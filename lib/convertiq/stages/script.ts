import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ModalitySelection } from "@/types/modality";
import type { ShowSayMap } from "@/types/showSay";
import type { AngleSelection } from "@/types/angle";
import type { GeneratedScript } from "@/types/script";
import { callClaudeWithRetry } from "@/lib/anthropic";
import { SCRIPT_SYSTEM_PROMPT, buildScriptPrompt } from "@/lib/prompts/script";
import { getCategoryModule } from "@/lib/convertiq/categoryModules";
import { getProductTypeDefinition } from "@/lib/convertiq/productTypes";
import { PHRASE_BLACKLIST } from "@/lib/convertiq/qaRules";
import {
  getRetentionMechanics,
  getProofSequences,
  getObjectionPatterns,
  getCTAPatterns,
  getVisualSequences,
  getDeliveryRegister,
  getTrustStyles,
} from "@/lib/convertiq/creatorDoctrine";

export async function runScriptGeneration(
  product: ExtractedProduct,
  classification: ClassificationResult,
  analysis: ProductAnalysis,
  modality: ModalitySelection,
  showSay: ShowSayMap,
  angle: AngleSelection,
  regenerationTargets?: string[],
): Promise<GeneratedScript> {
  const categoryModule = getCategoryModule(classification.primary_category);

  const antiPatterns = categoryModule.anti_patterns
    .map((a) => `• ${a}`)
    .join("\n");

  const proofHierarchy = categoryModule.proof_hierarchy
    .map((p, i) => `${i + 1}. ${p}`)
    .join("\n");

  const retentionMechanics = getRetentionMechanics(classification.primary_category);
  const retentionContext = retentionMechanics
    .map((r) => `${r.name}: ${r.mechanic} (${r.placement})`)
    .join("\n");

  const availableProofTypes = analysis.proof_inventory
    .filter((p) => p.available)
    .map((p) => p.type);
  const proofSequences = getProofSequences(availableProofTypes);
  const proofContext = proofSequences
    .map((s) => `${s.name}: ${s.sequence.join(" → ")}`)
    .join("\n");

  const objectionPatterns = getObjectionPatterns();
  const objectionContext = objectionPatterns
    .map((o) => `${o.name}: ${o.approach} (${o.placement_in_video})`)
    .join("\n");

  const ctaPatterns = getCTAPatterns(modality.selected);
  const ctaContext = ctaPatterns
    .map((c) => `${c.name}: ${c.framing} (timing: ${c.timing}, pressure: ${c.pressure_type || "none"})`)
    .join("\n");

  const visualSequences = getVisualSequences(modality.selected);
  const visualContext = visualSequences
    .map((v) => `${v.name}: ${v.shot_flow.join(" → ")}`)
    .join("\n");

  const deliveryRegisters = getDeliveryRegister(modality.selected);
  const deliveryContext = deliveryRegisters
    .map((d) => `${d.name}: tone=${d.tone}, pacing=${d.pacing}, energy=${d.energy}`)
    .join("\n");

  const blacklist = PHRASE_BLACKLIST.join(", ");

  // ── Doctrine signal injection (bounded uplift) ──────────────────────────
  // Wire product-type required proof, trust style, and delivery register
  // into the script prompt so generation enforces them.

  const productTypeDef = getProductTypeDefinition(
    classification.primary_category,
    classification.product_type,
  );

  const requiredProofContext = productTypeDef
    ? `REQUIRED PROOF: ${productTypeDef.required_proof}\nDOMINANT OBJECTION: ${productTypeDef.dominant_objection}`
    : "";

  const proofDestroyers = categoryModule.proof_destroyers
    .map((d) => `• ${d}`)
    .join("\n");

  const trustStyles = getTrustStyles(classification.primary_category);
  const recommendedTrustStyle = trustStyles.length > 0
    ? `${trustStyles[0].name}: ${trustStyles[0].approach}`
    : "";

  const recommendedDeliveryRegister = deliveryRegisters.length > 0
    ? `${deliveryRegisters[0].name}: tone=${deliveryRegisters[0].tone}`
    : "";

  const primaryBeliefBarrier = analysis.belief_barriers[0]?.statement || "";

  const result = await callClaudeWithRetry<GeneratedScript>({
    prompt: buildScriptPrompt(
      product,
      classification,
      analysis,
      modality,
      showSay,
      angle,
      antiPatterns,
      proofHierarchy,
      retentionContext,
      proofContext,
      objectionContext,
      ctaContext,
      visualContext,
      deliveryContext,
      blacklist,
      regenerationTargets,
      requiredProofContext,
      proofDestroyers,
      recommendedTrustStyle,
      recommendedDeliveryRegister,
      primaryBeliefBarrier,
    ),
    systemPrompt: SCRIPT_SYSTEM_PROMPT,
    maxTokens: 4096,
    temperature: 0.4,
    stage: "script",
  });

  return result;
}
