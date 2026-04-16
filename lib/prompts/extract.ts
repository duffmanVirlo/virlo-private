export const EXTRACT_SYSTEM_PROMPT = `You are a product data extraction specialist. You analyze raw HTML text from product pages and extract structured product information.

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

export function buildExtractPrompt(url: string, rawHtmlText: string): string {
  return `Extract structured product data from this product page.

URL: ${url}

Page content:
${rawHtmlText}

Extract the following fields into a JSON object:
{
  "url": "${url}",
  "title": string or null - the product name/title,
  "description": string or null - the main product description,
  "price": number or null - the numeric price (no currency symbol),
  "currency": string or null - currency code like "USD",
  "images": string[] - array of product image URLs found,
  "category_tags": string[] - any category labels, breadcrumbs, or tags,
  "ingredients_or_materials": string or null - ingredients list or materials if present,
  "claims": string[] - specific product assertions from the page (not generic marketing language). Examples: "holds up to 25 lbs", "lasts 8 hours", "fits all iPhone models". Extract the actual specific claims made about this product,
  "review_signals": {
    "rating": number or null - average rating,
    "review_count": number or null - number of reviews,
    "recurring_phrases": string[] - common themes from review snippets if visible
  },
  "badges": string[] - any special badges like "bestseller", "TikTok Made Me Buy It", "Amazon's Choice", etc.,
  "sold_count": string or null - units sold if displayed,
  "raw_text": string - cleaned page text, max 2000 characters, focused on product-relevant content
}

Rules:
- Extract ACTUAL content from the page. Do not invent data.
- If a field is not found, use null (for nullable fields) or empty array (for array fields).
- claims[] should contain SPECIFIC product assertions, not generic marketing filler.
- raw_text should be the most product-relevant text, stripped of navigation and boilerplate.
- Images should be actual product image URLs, not icons or logos.

SOURCE OF TRUTH HIERARCHY (for ingredients_or_materials and factual product facts):
When the page has conflicting or ambiguous signals, use this priority order:
1. Structured data (JSON-LD, product schema) — highest trust
2. Explicit labeled sections ("Ingredients:", "Materials:", "What's inside:") in the main product description
3. The main product description body
4. Inferred content from title or bullet points — lowest trust
If the page has label-style text that appears unreliable (OCR artifacts, partial extraction, inconsistent formatting), prefer the cleaner description text as the source of truth. Do NOT mix partial label fragments with description content — pick the most reliable single source.
If no source is clearly reliable, return null for ingredients_or_materials rather than inventing or merging.

NO-MERGE RULE FOR FACTUAL FIELDS:
For ingredients_or_materials, claims[], and any fact-bearing field:
- Pick ONE source and extract from it cleanly
- Do NOT combine partial extractions from multiple sources into a single string
- Do NOT infer ingredients or materials from product imagery or category assumptions
- If sources conflict, prefer the more specific, better-formatted source — or return null
- Never fabricate a spec, measurement, or ingredient that is not explicitly stated on the page

CLAIMS EXTRACTION DISCIPLINE:
- Extract ONLY claims literally stated on the page. Do NOT infer claims from category norms.
- If a claim is ambiguous or appears in marketing fluff only, exclude it.
- Prefer specific numeric claims ("holds 25 lbs", "lasts 8 hours") over vague marketing ("amazing", "revolutionary") — exclude vague marketing entirely.
- Do NOT extract competitor comparisons from the page (e.g., "better than Brand X") — these belong to the brand's marketing, not the creator's voice.

Return ONLY the JSON object.`;
}
