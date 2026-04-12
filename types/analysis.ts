import type { CategoryId } from "./classification";

export type FunctionalRole =
  | "demonstration-led"
  | "transformation-led"
  | "utility-led"
  | "curiosity-led"
  | "fear-led"
  | "convenience-led"
  | "identity-led"
  | "relief-led";

export type ProofType =
  | "live-demonstration"
  | "result-display"
  | "comparison"
  | "quantity-scale"
  | "unexpected-mechanism"
  | "third-party-signal"
  | "personal-testimony"
  | "problem-framing";

export type ProductAnalysis = {
  functional_role: FunctionalRole[];
  primary_role: FunctionalRole;
  buyer_motivation: {
    surface: string;
    deep: string;
    avoidance: string;
    identity: string;
    weighted_primary: "surface" | "deep" | "avoidance" | "identity";
  };
  belief_barriers: {
    type: "efficacy" | "relevance" | "friction";
    statement: string;
    weight: "high" | "medium" | "low";
  }[];
  proof_inventory: {
    type: ProofType;
    available: boolean;
    credibility: "high" | "medium" | "low";
    notes: string;
  }[];
  category_module_applied: CategoryId;
  product_type_applied: string;
  content_fit_rating: number;
  creator_pattern_archetype: string;
};
