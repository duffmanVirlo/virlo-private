import type { ExtractedProduct } from "@/types/product";

export const CLASSIFY_SYSTEM_PROMPT = `You are a product classification specialist for TikTok Shop creator commerce. You classify products into specific categories and product types based on product signals.

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

const CATEGORY_DEFINITIONS = `Available categories with disambiguation notes:

AUTO - Vehicle accessories, car care products, garage/workshop tools. NOT general tools (→ HOME), NOT electronics that happen to be in a car (→ TECH if primary function is tech).

BEAUTY - Skincare, makeup, hair care, nail care. The product's primary purpose is cosmetic/appearance-focused application to the body.

TECH - Electronics, gadgets, phone accessories, smart devices. The product's primary value is electronic/digital functionality.

PET - Products for animals: supplements, toys, grooming, food, beds, calming. Must be explicitly for pets.

WELLNESS - Health supplements, posture tools, sleep aids, recovery devices, breathing tools. The product's primary purpose is health/wellness improvement. NOT beauty products that happen to have health claims.

FASHION - Clothing, shoes, shapewear, accessories (bags, jewelry, belts). The product is worn on the body for style/fit.

FITNESS - Workout equipment, athletic gear, recovery tools, fitness tracking. The product is primarily used during or for exercise/training.

KITCHEN - Cooking appliances, kitchen tools, ingredients, meal solutions, food storage. The product's primary use is in food preparation or kitchen organization.

BABY - Products explicitly for babies/toddlers: supplements, sleep aids, feeding tools, safety products, baby skincare.

OUTDOOR - Camping, garden, outdoor sports, adventure gear. The product is primarily used outdoors in nature/yard.

OFFICE - Desk tools, ergonomic accessories, organizers, stationery, monitor accessories. The product's primary use is in a workspace/office setting.

HOME - Cleaning tools, storage, air quality, pest control, laundry, home organization, bathroom. General household products that don't fit other categories.`;

export function buildClassifyPrompt(product: ExtractedProduct): string {
  return `Classify this product into a primary category and product type.

Product data:
- Title: ${product.title || "Unknown"}
- Description: ${product.description || "No description"}
- Price: ${product.price ? `${product.currency || "$"}${product.price}` : "Unknown"}
- Category tags from page: ${product.category_tags.length > 0 ? product.category_tags.join(", ") : "None"}
- Claims: ${product.claims.length > 0 ? product.claims.join("; ") : "None"}
- Badges: ${product.badges.length > 0 ? product.badges.join(", ") : "None"}
- Ingredients/Materials: ${product.ingredients_or_materials || "Not listed"}

${CATEGORY_DEFINITIONS}

Return a JSON object with:
{
  "primary_category": one of the category IDs above (e.g., "AUTO", "BEAUTY"),
  "product_type": string - specific product type within the category (e.g., "Magnetic Tool Organization", "Vitamin C Serum", "Wireless Phone Mount"),
  "secondary_modifier": string or null - secondary usage context if applicable (e.g., "Workshop / Garage Use"),
  "confidence": number 0-100 - your classification confidence,
  "confidence_label": "high" if confidence >= 85, "moderate" if 70-84, "low" if < 70,
  "reason": string - 1-2 sentences explaining the classification in creator-facing language,
  "competing_classification": only if confidence < 85, provide { "category": string, "product_type": string, "reason_rejected": string } for the next-best classification. null if confidence >= 85,
  "requires_override_prompt": true if confidence < 85, false otherwise
}

Classification rules:
- Classify based on the product's PRIMARY function and use context.
- When a product could fit multiple categories, choose the one that best serves creator content strategy.
- product_type should be specific enough to be useful (not just the category name repeated).
- The reason should help a creator understand why this classification matters for their content.

Return ONLY the JSON object.`;
}
