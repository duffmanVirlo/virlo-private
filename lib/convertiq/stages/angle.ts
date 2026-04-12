import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ModalitySelection } from "@/types/modality";
import type { ShowSayMap } from "@/types/showSay";
import type { AngleSelection } from "@/types/angle";
import { callClaudeWithRetry } from "@/lib/anthropic";
import { ANGLE_SYSTEM_PROMPT, buildAnglePrompt } from "@/lib/prompts/angle";
import { getCategoryModule } from "@/lib/convertiq/categoryModules";
import {
  getRelevantPrinciples,
  getHookPatterns,
  getObjectionPatterns,
  getMatchingCreatorProfiles,
} from "@/lib/convertiq/creatorDoctrine";

export async function runAngleSelection(
  product: ExtractedProduct,
  classification: ClassificationResult,
  analysis: ProductAnalysis,
  modality: ModalitySelection,
  showSay: ShowSayMap,
): Promise<AngleSelection> {
  const categoryModule = getCategoryModule(classification.primary_category);

  // Master principles filtered to angle-relevant
  const principles = getRelevantPrinciples(["angle"]);
  const principlesContext = principles
    .map((p) => `${p.name}: ${p.principle}\n  Proof structure: ${p.proof_structure}`)
    .join("\n\n");

  // Hook pattern archetypes
  const hookPatterns = getHookPatterns();
  const hookContext = hookPatterns
    .map((h) => `[${h.priority}] ${h.name}: ${h.structure}\n  Best for: ${h.best_for.join(", ")}\n  Anti-pattern: ${h.anti_pattern}`)
    .join("\n\n");

  // Objection handling patterns
  const objectionPatterns = getObjectionPatterns();
  const objectionContext = objectionPatterns
    .map((o) => `${o.name}: ${o.approach}\n  Placement: ${o.placement_in_video}`)
    .join("\n\n");

  // Matching creator profiles
  const creatorProfiles = getMatchingCreatorProfiles(
    classification.primary_category,
    analysis.primary_role,
  );
  const creatorContext = creatorProfiles
    .map((c) => `${c.handle} pattern:\n  Hook: ${c.hook_archetype}\n  Proof: ${c.proof_preference.join(", ")}\n  CTA: ${c.cta_approach}\n  Retention: ${c.retention_approach}`)
    .join("\n\n");

  // Category conversion patterns
  const conversionPatterns = categoryModule.conversion_patterns
    .map((p) => `${p.name}: ${p.description} (when: ${p.when_to_use})`)
    .join("\n");

  const result = await callClaudeWithRetry<AngleSelection>({
    prompt: buildAnglePrompt(
      product,
      classification,
      analysis,
      modality,
      showSay,
      principlesContext,
      hookContext,
      objectionContext,
      creatorContext,
      conversionPatterns,
    ),
    systemPrompt: ANGLE_SYSTEM_PROMPT,
    maxTokens: 3072,
    temperature: 0.4,
    stage: "angle",
  });

  return result;
}
