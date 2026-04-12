import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ModalitySelection } from "@/types/modality";
import type { ShowSayMap } from "@/types/showSay";
import { callClaudeWithRetry } from "@/lib/anthropic";
import { SHOWSAY_SYSTEM_PROMPT, buildShowSayPrompt } from "@/lib/prompts/showSay";
import { getCategoryModule } from "@/lib/convertiq/categoryModules";
import {
  getRelevantPrinciples,
  getProofSequences,
} from "@/lib/convertiq/creatorDoctrine";

export async function runShowSayMapping(
  product: ExtractedProduct,
  classification: ClassificationResult,
  analysis: ProductAnalysis,
  modality: ModalitySelection,
): Promise<ShowSayMap> {
  const categoryModule = getCategoryModule(classification.primary_category);

  const proofDestroyers = categoryModule.proof_destroyers
    .map((d) => `• ${d}`)
    .join("\n");

  const availableProofTypes = analysis.proof_inventory
    .filter((p) => p.available)
    .map((p) => p.type);
  const proofSequences = getProofSequences(availableProofTypes);
  const proofContext = proofSequences
    .map((s) => `${s.name}: ${s.sequence.join(" → ")} — ${s.why_this_order}`)
    .join("\n");

  const principles = getRelevantPrinciples(["showSay"]);
  const principlesContext = principles
    .map((p) => `${p.name}: ${p.principle}`)
    .join("\n");

  const result = await callClaudeWithRetry<ShowSayMap>({
    prompt: buildShowSayPrompt(
      product,
      classification,
      analysis,
      modality,
      proofDestroyers,
      proofContext,
      principlesContext,
    ),
    systemPrompt: SHOWSAY_SYSTEM_PROMPT,
    maxTokens: 2048,
    temperature: 0.3,
    stage: "showSay",
  });

  return result;
}
