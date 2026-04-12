import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";

export const MODALITY_SYSTEM_PROMPT = `You are a TikTok Shop content format strategist. You select content modalities based on conversion probability, not personal preference. You understand that modality choice directly impacts filming requirements, viewer retention, and purchase conversion.

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

const MODALITY_DEFINITIONS = `Available content modalities:

silent-visual-first: No voiceover. Visual demonstration with text overlays. Best when the product's visual proof is so compelling it speaks for itself. Requires highly filmable product with clear visual transformation or mechanism.

text-led: On-screen text drives the narrative, with supporting visuals. Best for products where the value proposition needs framing that visuals alone can't provide. Text appears as the primary storytelling device.

voiceover-led: Creator narrates over product visuals. Best when the product needs context or explanation that the viewer can't see. Allows the creator to build trust through tone while keeping visuals focused.

creator-to-camera: Creator speaks directly to camera, showing and discussing. Best when personal credibility is the primary trust mechanism. Requires the product to benefit from personal endorsement.

demo-first: Opens immediately with the product in use. No setup, no talking head intro. The demonstration IS the hook. Best for products with a visually compelling mechanism or surprising result.

comparison-led: Side-by-side or before/after comparison drives the content. Best for products where the value is relative to alternatives or previous state.

routine-integration: Product shown within a natural daily routine. Best for consumables, beauty, wellness — products that become part of a habit. Shows the product fitting into real life.

problem-reveal-led: Opens by revealing a problem (mess, frustration, failure), then shows the product solving it. Best for utility products where the problem is relatable and visual.`;

export function buildModalityPrompt(
  classification: ClassificationResult,
  analysis: ProductAnalysis,
  retentionDoctrineContext: string,
  visualSequencingContext: string,
): string {
  const availableProof = analysis.proof_inventory
    .filter((p) => p.available)
    .map((p) => `${p.type} (credibility: ${p.credibility})`)
    .join(", ");

  return `Select the optimal content modality for this product.

PRODUCT CONTEXT:
- Category: ${classification.primary_category}
- Product Type: ${classification.product_type}
- Primary Functional Role: ${analysis.primary_role}
- Weighted Buyer Motivation: ${analysis.buyer_motivation.weighted_primary} — "${analysis.buyer_motivation[analysis.buyer_motivation.weighted_primary]}"
- Available Proof Types: ${availableProof}
- Content Fit Rating: ${analysis.content_fit_rating}/10

RETENTION MECHANICS CONTEXT:
${retentionDoctrineContext}

VISUAL SEQUENCING CONTEXT:
${visualSequencingContext}

${MODALITY_DEFINITIONS}

Return a JSON object with:
{
  "selected": string - one modality ID from the list above,
  "reason": string - 2-3 sentences explaining why this modality maximizes conversion for THIS specific product. Must reference the product's proof types and buyer psychology,
  "rejected": array of { "modality": string, "reason": string } - at minimum, explain why the top 2 competing modalities were rejected
}

Selection rules:
- Commit to ONE modality. Do not hedge.
- "creator-to-camera" requires justification beyond "the creator can speak to the product" — it must serve a specific trust or credibility function.
- Consider filming reality: solo creator with a phone. The modality must be executable.
- The selected modality must serve the product's primary proof type effectively.

Return ONLY the JSON object.`;
}
