import type { CategoryId } from "@/types/classification";

export type { ProductTypeDefinition } from "./auto";
import type { ProductTypeDefinition } from "./auto";

import { autoProductTypes } from "./auto";
import { beautyProductTypes } from "./beauty";
import { techProductTypes } from "./tech";
import { petProductTypes } from "./pet";
import { wellnessProductTypes } from "./wellness";
import { homeProductTypes } from "./home";
import { fashionProductTypes } from "./fashion";
import { fitnessProductTypes } from "./fitness";
import { kitchenProductTypes } from "./kitchen";
import { babyProductTypes } from "./baby";
import { outdoorProductTypes } from "./outdoor";
import { officeProductTypes } from "./office";

const categoryMap: Record<CategoryId, ProductTypeDefinition[]> = {
  AUTO: autoProductTypes,
  BEAUTY: beautyProductTypes,
  TECH: techProductTypes,
  PET: petProductTypes,
  WELLNESS: wellnessProductTypes,
  HOME: homeProductTypes,
  FASHION: fashionProductTypes,
  FITNESS: fitnessProductTypes,
  KITCHEN: kitchenProductTypes,
  BABY: babyProductTypes,
  OUTDOOR: outdoorProductTypes,
  OFFICE: officeProductTypes,
};

const allProductTypes: ProductTypeDefinition[] = Object.values(categoryMap).flat();

/**
 * Find a specific product type definition by category and type name.
 * Performs case-insensitive partial matching on type_name.
 */
export function getProductTypeDefinition(
  category: CategoryId,
  typeName: string,
): ProductTypeDefinition | null {
  const types = categoryMap[category];
  if (!types) return null;

  const needle = typeName.toLowerCase();

  // Try exact match first (case-insensitive)
  const exact = types.find(
    (t) => t.type_name.toLowerCase() === needle,
  );
  if (exact) return exact;

  // Fall back to partial match
  const partial = types.find(
    (t) =>
      t.type_name.toLowerCase().includes(needle) ||
      needle.includes(t.type_name.toLowerCase()),
  );
  return partial ?? null;
}

/**
 * Get all product type definitions for a given category.
 */
export function getProductTypesForCategory(
  category: CategoryId,
): ProductTypeDefinition[] {
  return categoryMap[category] ?? [];
}

/**
 * Get all product type definitions across all categories.
 */
export function getAllProductTypes(): ProductTypeDefinition[] {
  return allProductTypes;
}
