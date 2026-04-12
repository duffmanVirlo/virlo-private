import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ModalitySelection } from "@/types/modality";
import { callClaudeWithRetry } from "@/lib/anthropic";
import { MODALITY_SYSTEM_PROMPT, buildModalityPrompt } from "@/lib/prompts/modality";
import {
  getRetentionMechanics,
  getVisualSequences,
} from "@/lib/convertiq/creatorDoctrine";

export async function runModalitySelection(
  classification: ClassificationResult,
  analysis: ProductAnalysis,
): Promise<ModalitySelection> {
  const retentionMechanics = getRetentionMechanics(classification.primary_category);
  const visualSequences = getVisualSequences();

  const retentionContext = retentionMechanics
    .map((r) => `${r.name}: ${r.mechanic} (placement: ${r.placement})`)
    .join("\n");

  const visualContext = visualSequences
    .map((v) => `${v.name}: ${v.shot_flow.join(" → ")} — ${v.why_this_flow}`)
    .join("\n");

  const result = await callClaudeWithRetry<ModalitySelection>({
    prompt: buildModalityPrompt(
      classification,
      analysis,
      retentionContext,
      visualContext,
    ),
    systemPrompt: MODALITY_SYSTEM_PROMPT,
    maxTokens: 1024,
    temperature: 0.3,
    stage: "modality",
  });

  return result;
}
