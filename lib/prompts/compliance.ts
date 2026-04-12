import type { GeneratedScript } from "@/types/script";
import type { CategoryId } from "@/types/classification";

export const COMPLIANCE_SYSTEM_PROMPT = `You are a content compliance reviewer for creator-commerce content. You protect creators from language that creates legal or trust risk. You modify only what is necessary — preserving the creator's voice and the content's conversion power.

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

export function buildCompliancePrompt(
  script: GeneratedScript,
  category: CategoryId,
  complianceRulesContent: string,
): string {
  return `Review this content for compliance with ${category} category rules.

CATEGORY: ${category}

COMPLIANCE RULES:
${complianceRulesContent}

CONTENT TO REVIEW:

Hook Options:
${script.hook_options.map((h) => `  ${h.rank}. "${h.hook_text}"`).join("\n")}

Script Beats:
${script.beats.filter((b) => b.type === "SPOKEN" || b.type === "TEXT").map((b) => `  [${b.type}] "${b.content}"`).join("\n")}

CTA: "${script.cta_logic.cta_text}"
Caption: "${script.caption}"

Return a JSON object with:
{
  "category_requires_compliance": true,
  "modifications_made": array of {
    "original": string - the exact original phrase that violates compliance,
    "replacement": string - the compliant replacement that preserves intent,
    "reason": string - brief explanation of the compliance rule triggered
  },
  "creator_note": string or null - if modifications were made, a brief note to the creator explaining the changes as protection (not restriction). Frame it positively. null if no modifications,
  "cleared": boolean - true if the content passes compliance (with or without modifications)
}

Rules:
- Only modify what actually violates compliance rules. Do not over-correct.
- Replacements must preserve the creator's voice and content intent.
- If no violations found, return empty modifications_made array and cleared: true.
- The creator_note should feel protective, not restrictive.

Return ONLY the JSON object.`;
}

export function buildCompliancePassthrough(): {
  category_requires_compliance: false;
  modifications_made: [];
  creator_note: null;
  cleared: true;
} {
  return {
    category_requires_compliance: false,
    modifications_made: [],
    creator_note: null,
    cleared: true,
  };
}
