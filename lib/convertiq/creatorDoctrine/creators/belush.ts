import type { CategoryId } from "@/types/classification";
import type { ProofType } from "@/types/analysis";

export type CreatorPatternProfile = {
  creator_id: string;
  handle: string;
  primary_category_strength: CategoryId[];
  hook_archetype: string;
  hook_mechanics: string[];
  retention_approach: string;
  pacing_signature: string;
  proof_preference: ProofType[];
  objection_style: string;
  cta_approach: string;
  trust_mechanic: string;
  visual_tendencies: string[];
  delivery_register: string;
  category_adaptations: Partial<Record<CategoryId, string>>;
  anti_patterns: string[];
};

export const BELUSH_PROFILE: CreatorPatternProfile = {
  creator_id: "belush",
  handle: "@be.lush",
  primary_category_strength: ["BEAUTY", "WELLNESS"],
  hook_archetype: "relatable-struggle",
  hook_mechanics: [
    "Opens with a specific skin frustration described in first-person that feels like an internal monologue the viewer has had themselves",
    "Uses close-up shots of the actual skin concern at the start to make the problem visceral and visual before any words",
    "Frames the problem as something she has personally struggled with for a long time, establishing shared experience with the viewer",
    "Occasionally pairs the problem callout with a brief mention of products that failed, building credibility before introducing the solution",
  ],
  retention_approach:
    "Methodical build to reveal. She holds the viewer by creating genuine curiosity about the result through a slow, detailed application process. The viewer stays because they can see the product going on and need to see what it looks like when finished. She uses the application itself as the retention mechanism rather than verbal promises about what is coming.",
  pacing_signature:
    "Slow and deliberate during application, with a slight acceleration during the reveal. Her pacing mirrors the patience required by the skincare routine itself, which makes the content feel authentic to the category. She does not rush through steps, and this patience signals that she actually uses the product regularly rather than performing for a camera.",
  proof_preference: ["result-display", "personal-testimony"],
  objection_style: "preemptive-limitation",
  cta_approach: "natural-continuation",
  trust_mechanic: "honest-limitation",
  visual_tendencies: [
    "Natural bathroom or vanity lighting that matches where viewers would actually use skincare products",
    "Extreme close-ups of skin texture before and after, shot in the same lighting to maintain comparison integrity",
    "Product shown among her real collection on her actual shelf, not isolated on a clean surface",
    "Application shown in real time without cuts, so the viewer can see exactly how the product behaves on skin",
  ],
  delivery_register: "casual-direct",
  category_adaptations: {
    BEAUTY:
      "Leads with the specific skin concern and builds to the visual reveal. Application process is shown in detail because the application experience is part of the proof in beauty.",
    WELLNESS:
      "Shifts from visual proof to experiential testimony. Describes how the product makes her feel over time rather than showing an immediate visible result. Emphasizes routine integration and long-term use.",
  },
  anti_patterns: [
    "Never uses superlatives like 'best product ever' or 'holy grail' without immediately grounding them in specific observable evidence",
    "Avoids rapid-fire product feature lists; always ties each feature to a personal experience or visible result",
    "Does not use aggressive urgency or limited-time framing; her CTA style is informational not pressured",
    "Never pretends a product has no downsides; willingly shares who the product is not suited for",
  ],
};
