import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ModalitySelection } from "@/types/modality";

export const SHOWSAY_SYSTEM_PROMPT = `You are a TikTok Shop proof strategy expert. You determine what must be shown on camera versus spoken versus never said. Your decisions are grounded in the principle: proof is the evidence from which the viewer independently forms belief.

When writing "can_say" lines: always phrase them as real-world payoffs and lived-use benefits, never as literal feature restatements. A creator would say "I can finally push my nightstand all the way against the wall" — not "the flat plug profile reduces protrusion."

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

export function buildShowSayPrompt(
  product: ExtractedProduct,
  classification: ClassificationResult,
  analysis: ProductAnalysis,
  modality: ModalitySelection,
  proofDestroyersConstraint: string,
  proofSequencingContext: string,
  masterPrinciplesContext: string,
): string {
  return `Generate the show vs. say map for this product's content strategy.

PRODUCT:
- Title: ${product.title || "Unknown"}
- Claims: ${product.claims.length > 0 ? product.claims.join("; ") : "None"}
- Ingredients/Materials: ${product.ingredients_or_materials || "Not listed"}

CLASSIFICATION:
- Category: ${classification.primary_category}
- Product Type: ${classification.product_type}

ANALYSIS:
- Primary Role: ${analysis.primary_role}
- Primary Belief Barrier: ${analysis.belief_barriers[0]?.statement || "None identified"}
- Available Proof: ${analysis.proof_inventory.filter((p) => p.available).map((p) => `${p.type}: ${p.notes}`).join("; ")}

MODALITY: ${modality.selected}

PROOF DESTROYERS (hard constraints for never_say):
${proofDestroyersConstraint}

PROOF SEQUENCING GUIDANCE:
${proofSequencingContext}

MASTER PRINCIPLES:
${masterPrinciplesContext}

Return a JSON object with:
{
  "must_show": array of {
    "instruction": string - specific, filmable instruction for what to show on camera. Must be something a solo creator with a phone can physically film,
    "why": string - explains why this must be SHOWN not spoken
  },
  "can_say": array of {
    "line": string - a specific line or type of line the creator can speak,
    "purpose": string - one of: "problem naming", "timeline anchor", "limitation acknowledgment", "context setting", "viewer direction", "personal experience"
  },
  "never_say": array of {
    "blocked_phrase_type": string - category of blocked language (e.g., "efficacy claim", "superlative", "unverifiable guarantee"),
    "instead": string - what the creator should DO instead. Not just what to avoid — what to do.
  }
}

Rules:
- Every must_show instruction must be physically filmable by a solo creator with a phone.
- never_say entries must explain what the creator should DO instead — not just what to avoid.
- can_say lines should feel like something a real person would actually say, not copy.
- MUST_SHOW ORDERING RULE: The FIRST must_show item must directly address the PRIMARY BELIEF BARRIER listed above. "Proof importance" means: how much does this visual resolve the viewer's biggest doubt? The most important visual is the one that answers the #1 reason a viewer would NOT buy. If the barrier is "does it actually work?", the first must_show is the live demonstration. If the barrier is "is it durable?", the first must_show is the stress test. If the barrier is "will it fit my situation?", the first must_show is the real-environment demo. Order all remaining must_show items by their contribution to belief formation — not by what is easiest to film or most visually appealing.
- Minimum 3 must_show, 3 can_say, 3 never_say entries.

Return ONLY the JSON object.`;
}
