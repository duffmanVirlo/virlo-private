import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ModalitySelection } from "@/types/modality";
import type { ShowSayMap } from "@/types/showSay";

export const ANGLE_SYSTEM_PROMPT = `You are a TikTok Shop conversion strategist. You score content angles on five measurable factors and select the highest probability winner. Every angle must be grounded in a specific conversion hypothesis — not a vague content direction.

When describing entry mechanisms, proof vehicles, and belief formation paths: always frame benefits as real-world payoffs in specific daily scenarios — not literal feature restatements. The viewer must instantly picture themselves using this product in their own life.

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

export function buildAnglePrompt(
  product: ExtractedProduct,
  classification: ClassificationResult,
  analysis: ProductAnalysis,
  modality: ModalitySelection,
  showSay: ShowSayMap,
  masterPrinciplesContext: string,
  hookPatternsContext: string,
  objectionHandlingContext: string,
  creatorProfilesContext: string,
  categoryConversionPatterns: string,
): string {
  return `Score and select the optimal content angle for this product.

PRODUCT:
- Title: ${product.title || "Unknown"}
- Price: ${product.price ? `${product.currency || "$"}${product.price}` : "Unknown"}
- Key Claims: ${product.claims.slice(0, 5).join("; ") || "None"}

CLASSIFICATION:
- Category: ${classification.primary_category}
- Product Type: ${classification.product_type}

ANALYSIS:
- Primary Role: ${analysis.primary_role}
- Weighted Motivation: ${analysis.buyer_motivation.weighted_primary}
- Top Belief Barriers: ${analysis.belief_barriers.slice(0, 2).map((b) => `[${b.weight}] ${b.statement}`).join("; ")}
- Best Available Proof: ${analysis.proof_inventory.filter((p) => p.available && p.credibility !== "low").map((p) => p.type).join(", ")}
- Creator Pattern Archetype: ${analysis.creator_pattern_archetype}

MODALITY: ${modality.selected}

SHOW/SAY MAP:
- Must Show: ${showSay.must_show.map((s) => s.instruction).join("; ")}
- Can Say: ${showSay.can_say.map((s) => s.line).join("; ")}

MASTER PRINCIPLES (angle-relevant):
${masterPrinciplesContext}

HOOK PATTERN ARCHETYPES:
${hookPatternsContext}

OBJECTION HANDLING PATTERNS:
${objectionHandlingContext}

CREATOR PATTERN PROFILES:
${creatorProfilesContext}

CATEGORY CONVERSION PATTERNS:
${categoryConversionPatterns}

Generate 3 candidate angles, score each, and select the winner.

For EACH angle candidate, provide:
- name: short descriptive name
- conversion_hypothesis: "If we [entry mechanism], then the viewer will [belief formation], which makes [CTA] feel natural"
- entry_mechanism: how the video opens
- proof_vehicle: what visual/demonstration carries the proof
- belief_formation_path: how the viewer moves from curiosity to conviction
- cta_setup: what viewer state enables the CTA

Score each on:
- scroll_stop: 0-10 — will this make someone stop scrolling?
- retention_arc: 0-10 — will the viewer stay through the full video? (WEIGHTED 1.4x)
- belief_formation: 0-10 — will the viewer form genuine purchase intent? (WEIGHTED 1.4x)
- filming_feasibility: 0-10 — can a solo creator with a phone actually film this? (GATE: below 6 = rejected)
- cta_naturalness: 0-10 — does the CTA feel earned, not forced?
- proof_concentration: 0-10 — does this angle commit to ONE dominant proof mechanism, or does it dilute belief by splitting across multiple competing proof types? (WEIGHTED 1.2x) 10=single clear proof vehicle that carries the entire video. 8-9=one dominant proof with minor supporting proof. 6-7=two competing proof mechanisms, neither dominant. 4-5=scattered proof across 3+ mechanisms. A video with one decisive proof vehicle converts higher than a video that tries to prove three things weakly.
- composite: weighted average

Return a JSON object with:
{
  "selected": {
    "name": string,
    "conversion_hypothesis": string,
    "entry_mechanism": string,
    "proof_vehicle": string,
    "belief_formation_path": string,
    "cta_setup": string,
    "score": { "scroll_stop": number, "retention_arc": number, "belief_formation": number, "filming_feasibility": number, "cta_naturalness": number, "proof_concentration": number, "composite": number },
    "creator_pattern_source": string - which doctrine principle or creator pattern drove this selection
  },
  "rejected": array of {
    "name": string,
    "score": same score object,
    "primary_rejection_reason": string
  }
}

Scoring rules:
- retention_arc and belief_formation are weighted 1.4x in composite.
- proof_concentration is weighted 1.2x in composite.
- If filming_feasibility < 6, the angle is rejected regardless of other scores.
- composite = (scroll_stop + retention_arc*1.4 + belief_formation*1.4 + filming_feasibility + cta_naturalness + proof_concentration*1.2) / 8.0
- Angles must be genuinely differentiated — not three versions of the same idea.
- SINGLE PROOF VEHICLE PRINCIPLE: The strongest angles commit to one dominant proof mechanism. An angle that tries to prove durability AND speed AND aesthetics will prove none of them convincingly in 30 seconds. Pick the one proof that resolves the dominant buyer objection and build the entire video around it.

Return ONLY the JSON object.`;
}
