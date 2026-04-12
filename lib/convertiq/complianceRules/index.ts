import type { CategoryId } from "@/types/classification";

export type { ComplianceRule } from "./wellness";

import { WELLNESS_COMPLIANCE } from "./wellness";
import { BEAUTY_COMPLIANCE } from "./beauty";
import { BABY_COMPLIANCE } from "./baby";
import { PET_COMPLIANCE } from "./pet";

import type { ComplianceRule } from "./wellness";

const COMPLIANCE_MAP: Partial<Record<CategoryId, ComplianceRule>> = {
  WELLNESS: WELLNESS_COMPLIANCE,
  BEAUTY: BEAUTY_COMPLIANCE,
  BABY: BABY_COMPLIANCE,
  PET: PET_COMPLIANCE,
};

/**
 * Returns the compliance rules for a given product category.
 * Only WELLNESS, BEAUTY, BABY, and PET have specific compliance rules.
 * Returns null for all other categories (TECH, FASHION, FITNESS, etc.).
 */
export function getComplianceRules(
  category: CategoryId,
): ComplianceRule | null {
  return COMPLIANCE_MAP[category] ?? null;
}
