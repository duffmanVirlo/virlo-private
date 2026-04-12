import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _client;
}

// ── Usage telemetry (lightweight, server-side only) ──────────────────────────

export type CallUsage = {
  input_tokens: number;
  output_tokens: number;
  model: string;
};

let _runUsageLog: CallUsage[] = [];

/** Get accumulated usage for the current pipeline run, then reset. */
export function flushRunUsage(): { calls: CallUsage[]; totals: { input_tokens: number; output_tokens: number; estimated_cost_cents: number } } {
  const calls = [..._runUsageLog];
  _runUsageLog = [];

  const totals = calls.reduce(
    (acc, c) => ({
      input_tokens: acc.input_tokens + c.input_tokens,
      output_tokens: acc.output_tokens + c.output_tokens,
    }),
    { input_tokens: 0, output_tokens: 0 },
  );

  // Sonnet 4: $3/M input, $15/M output
  const estimated_cost_cents =
    (totals.input_tokens / 1_000_000) * 300 +
    (totals.output_tokens / 1_000_000) * 1500;

  return { calls, totals: { ...totals, estimated_cost_cents: Math.round(estimated_cost_cents * 100) / 100 } };
}

// ── Core API call ────────────────────────────────────────────────────────────

export type CallClaudeOptions = {
  prompt: string;
  systemPrompt: string;
  maxTokens?: number;
  temperature?: number;
  /** Optional label for telemetry (e.g., "classify", "script") */
  stage?: string;
};

export async function callClaude<T>(options: CallClaudeOptions): Promise<T> {
  const { prompt, systemPrompt, maxTokens = 4096, temperature = 0.3, stage } = options;

  const model = "claude-sonnet-4-20250514";

  const response = await getClient().messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });

  // Record usage telemetry
  const usage = response.usage;
  if (usage) {
    const entry: CallUsage = {
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      model,
    };
    _runUsageLog.push(entry);

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[ConvertIQ] ${stage || "call"}: ${usage.input_tokens} in / ${usage.output_tokens} out`,
      );
    }
  }

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const raw = textBlock.text.trim();

  // Extract JSON from potential markdown code blocks
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw;

  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    throw new Error(`Failed to parse Claude response as JSON: ${jsonStr.slice(0, 200)}`);
  }
}

export async function callClaudeWithRetry<T>(
  options: CallClaudeOptions,
  maxRetries = 2
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callClaude<T>(options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on parse errors — the prompt needs fixing, not a retry
      if (lastError.message.includes("Failed to parse")) {
        throw lastError;
      }

      // Wait before retry with exponential backoff
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError!;
}
