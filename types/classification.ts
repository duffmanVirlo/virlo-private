export type CategoryId =
  | "AUTO"
  | "BEAUTY"
  | "TECH"
  | "PET"
  | "WELLNESS"
  | "FASHION"
  | "FITNESS"
  | "KITCHEN"
  | "BABY"
  | "OUTDOOR"
  | "OFFICE"
  | "HOME";

export const ALL_CATEGORIES: CategoryId[] = [
  "AUTO", "BEAUTY", "TECH", "PET", "WELLNESS",
  "FASHION", "FITNESS", "KITCHEN", "BABY",
  "OUTDOOR", "OFFICE", "HOME",
];

export type ClassificationResult = {
  primary_category: CategoryId;
  product_type: string;
  secondary_modifier: string | null;
  confidence: number;
  confidence_label: "high" | "moderate" | "low";
  reason: string;
  competing_classification: {
    category: CategoryId;
    product_type: string;
    reason_rejected: string;
  } | null;
  requires_override_prompt: boolean;
};
