import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { CategoryModule } from "@/lib/convertiq/categoryModules";
import type { ProductTypeDefinition } from "@/lib/convertiq/productTypes";

export const ANALYZE_SYSTEM_PROMPT = `You are a creator-commerce product analyst. You reason from buyer psychology, not marketing copy. Your analysis maps the real psychological terrain a creator's content must navigate to convert viewers into buyers.

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

export function buildAnalyzePrompt(
  product: ExtractedProduct,
  classification: ClassificationResult,
  categoryModule: CategoryModule,
  productType: ProductTypeDefinition | null,
  creatorArchetype: string,
): string {
  return `Analyze this product for creator-commerce content strategy.

PRODUCT:
- Title: ${product.title || "Unknown"}
- Description: ${product.description || "None"}
- Price: ${product.price ? `${product.currency || "$"}${product.price}` : "Unknown"}
- Claims: ${product.claims.length > 0 ? product.claims.join("; ") : "None"}
- Ingredients/Materials: ${product.ingredients_or_materials || "Not listed"}
- Review signals: Rating ${product.review_signals.rating || "N/A"}, ${product.review_signals.review_count || 0} reviews
- Recurring review themes: ${product.review_signals.recurring_phrases.length > 0 ? product.review_signals.recurring_phrases.join(", ") : "None"}

CLASSIFICATION:
- Category: ${classification.primary_category}
- Product Type: ${classification.product_type}
- Modifier: ${classification.secondary_modifier || "None"}

CATEGORY INTELLIGENCE MODULE (${categoryModule.id}):
- Buyer Psychology: ${JSON.stringify(categoryModule.buyer_psychology)}
- Proof Hierarchy: ${categoryModule.proof_hierarchy.join(" → ")}
- Proof Destroyers: ${categoryModule.proof_destroyers.join("; ")}
- Demonstration Priority: ${categoryModule.demonstration_priority}

${productType ? `PRODUCT TYPE INTELLIGENCE (${productType.type_name}):
- Primary Conversion Mechanism: ${productType.primary_conversion_mechanism}
- Dominant Objection: ${productType.dominant_objection}
- Required Proof: ${productType.required_proof}
- Anti-patterns: ${productType.anti_patterns.join("; ")}` : "No specific product type match found."}

CREATOR PATTERN ARCHETYPE: ${creatorArchetype}

Return a JSON object with:
{
  "functional_role": string[] - array from: "demonstration-led", "transformation-led", "utility-led", "curiosity-led", "fear-led", "convenience-led", "identity-led", "relief-led",
  "primary_role": string - the single most important functional role from the array above,
  "buyer_motivation": {
    "surface": string - what the buyer thinks they want,
    "deep": string - what they actually want at a psychological level,
    "avoidance": string - what pain or fear they're trying to avoid,
    "identity": string - who they want to be or be seen as,
    "weighted_primary": "surface" | "deep" | "avoidance" | "identity" - which motivation is strongest for THIS specific product
  },
  "belief_barriers": array of {
    "type": "efficacy" | "relevance" | "friction",
    "statement": string - the specific barrier stated as the viewer would think it,
    "weight": "high" | "medium" | "low"
  } - ordered from highest to lowest weight. The PRIMARY barrier is the one thing most likely to prevent a perfect-fit viewer from buying,
  "proof_inventory": array of {
    "type": one of "live-demonstration", "result-display", "comparison", "quantity-scale", "unexpected-mechanism", "third-party-signal", "personal-testimony", "problem-framing",
    "available": boolean - can this proof type be created for this product?,
    "credibility": "high" | "medium" | "low" - how credible is this proof for this specific product?,
    "notes": string - specific notes on how to execute this proof type for THIS product
  },
  "category_module_applied": "${classification.primary_category}",
  "product_type_applied": "${classification.product_type}",
  "content_fit_rating": number 1-10 - how demonstrable and visual are the proof opportunities? Higher = more filmable, more visual proof available,
  "creator_pattern_archetype": string - which creator pattern best fits this product's content needs
}

Analysis rules:
- Identify the PRIMARY belief barrier — the one thing most likely to prevent a perfect-fit viewer from buying.
- Weight efficacy barriers higher for categories with high skepticism (WELLNESS, BEAUTY, TECH).
- content_fit_rating reflects how demonstrable and visual the proof opportunities are.
- proof_inventory notes must be SPECIFIC to this product — not generic advice.
- buyer_motivation must go beyond surface-level: what does the buyer REALLY want?

Return ONLY the JSON object.`;
}
