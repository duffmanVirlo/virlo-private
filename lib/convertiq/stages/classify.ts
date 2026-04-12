import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import { callClaudeWithRetry } from "@/lib/anthropic";
import { CLASSIFY_SYSTEM_PROMPT, buildClassifyPrompt } from "@/lib/prompts/classify";

export async function runClassification(
  product: ExtractedProduct,
): Promise<ClassificationResult> {
  const result = await callClaudeWithRetry<ClassificationResult>({
    prompt: buildClassifyPrompt(product),
    systemPrompt: CLASSIFY_SYSTEM_PROMPT,
    maxTokens: 1024,
    temperature: 0.2,
    stage: "classify",
  });

  // Enforce confidence label and override prompt logic
  const confidence = Math.max(0, Math.min(100, result.confidence));
  let confidence_label: "high" | "moderate" | "low";
  let requires_override_prompt: boolean;

  if (confidence >= 85) {
    confidence_label = "high";
    requires_override_prompt = false;
  } else if (confidence >= 70) {
    confidence_label = "moderate";
    requires_override_prompt = true;
  } else {
    confidence_label = "low";
    requires_override_prompt = true;
  }

  return {
    ...result,
    confidence,
    confidence_label,
    requires_override_prompt,
    competing_classification: confidence < 85 ? result.competing_classification : null,
  };
}
