import type { GeneratedScript } from "@/types/script";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ShowSayMap } from "@/types/showSay";
import type { AngleSelection } from "@/types/angle";
import type { QAResult } from "@/types/score";
import { callClaudeWithRetry } from "@/lib/anthropic";
import { QA_SYSTEM_PROMPT, buildQAPrompt } from "@/lib/prompts/qa";
import { PHRASE_BLACKLIST, calculateWeightedScore, MIN_QA_SCORE } from "@/lib/convertiq/qaRules";
import { getRelevantPrinciples } from "@/lib/convertiq/creatorDoctrine";
import { getProductTypeDefinition } from "@/lib/convertiq/productTypes";

export async function runQAPass(
  script: GeneratedScript,
  angle: AngleSelection,
  analysis: ProductAnalysis,
  showSay: ShowSayMap,
  classification?: ClassificationResult,
): Promise<QAResult> {
  const topBarriers = analysis.belief_barriers
    .slice(0, 2)
    .map((b) => ({ type: b.type, statement: b.statement, weight: b.weight }));

  const neverSayConstraints = showSay.never_say;

  const principles = getRelevantPrinciples(["qa"]);
  const principlesContext = principles
    .map((p) => `${p.name}: ${p.principle}\n  Failure mode: ${p.failure_mode}`)
    .join("\n\n");

  // ── Doctrine signals for QA (bounded uplift) ────────────────────────────
  const productTypeDef = classification
    ? getProductTypeDefinition(classification.primary_category, classification.product_type)
    : null;
  const requiredProof = productTypeDef?.required_proof || "";
  const categoryId = classification?.primary_category || "";

  const result = await callClaudeWithRetry<QAResult>({
    prompt: buildQAPrompt(
      script,
      angle.selected.conversion_hypothesis,
      topBarriers,
      neverSayConstraints,
      PHRASE_BLACKLIST,
      principlesContext,
      requiredProof,
      categoryId,
    ),
    systemPrompt: QA_SYSTEM_PROMPT,
    maxTokens: 2048,
    temperature: 0.2,
    stage: "qa",
  });

  // ── Server-side score recalculation ────────────────────────────────────
  // The LLM tends to default to a "safe" overall_score (~8.1) regardless
  // of per-dimension variation. Recalculate from the actual dimension
  // scores using the real weighted formula to recover signal.
  const recalculated = calculateWeightedScore(result.scores);
  const hasBlockingFlags = result.flags.some((f) => f.severity === "blocking");
  const correctedPassed = recalculated >= MIN_QA_SCORE && !hasBlockingFlags;

  return {
    ...result,
    overall_score: recalculated,
    passed: correctedPassed,
  };
}
