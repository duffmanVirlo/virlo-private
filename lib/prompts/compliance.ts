import type { GeneratedScript } from "@/types/script";
import type { CategoryId } from "@/types/classification";
import {
  TIER1_HARD_BLOCKS,
  TIER2_SOFT_REWRITES,
  TIER3_ELEVATED_CATEGORIES,
  TIER3_SENSITIVE_PRODUCT_TYPES,
} from "@/lib/convertiq/complianceRules/tiktokPolicy";

export const COMPLIANCE_SYSTEM_PROMPT = `You are a content compliance reviewer for TikTok Shop creator-commerce content. You protect creators from platform policy violations and legal risk.

CRITICAL INTENT:
- Modify ONLY what creates real policy or enforcement risk
- Preserve the creator's voice, tone, and conversion power
- Do NOT weaken strong output "just in case"
- Do NOT make content timid, generic, robotic, or AI-sounding
- Do NOT strip urgency when legitimate offer language is supported
- Do NOT add broad disclaimers by default
- When rewriting, preserve: creator-native tone, product-first framing, core angle, proof logic, CTA momentum, specificity

You are a final safety net, not a creative editor. Intervene only when necessary.

Return ONLY valid JSON matching the exact schema specified. Do not include any text outside the JSON object.`;

/**
 * Build the full compliance review text including universal TikTok policy rules
 * and optional category-specific rules.
 */
function buildPolicyRulesContent(
  category: CategoryId,
  productType: string,
  categoryRulesContent: string | null,
): string {
  const sections: string[] = [];

  // ── Universal TikTok Shop Policy (all categories) ──────────────────────
  sections.push("TIER 1 — HARD BLOCK (must never appear in final output):");
  for (const rule of TIER1_HARD_BLOCKS) {
    sections.push(`  • BLOCK: "${rule.pattern}" — ${rule.reason}. Replace with: ${rule.replacement_guidance}`);
  }

  sections.push("");
  sections.push("TIER 2 — SOFT REWRITE (normalize phrasing, preserve intent):");
  for (const rule of TIER2_SOFT_REWRITES) {
    sections.push(`  • REWRITE: "${rule.pattern}" — ${rule.reason}. Better: ${rule.replacement_guidance}`);
  }

  // ── Elevated review flag ───────────────────────────────────────────────
  const isElevated =
    TIER3_ELEVATED_CATEGORIES.includes(category) ||
    TIER3_SENSITIVE_PRODUCT_TYPES.some((kw) =>
      productType.toLowerCase().includes(kw)
    );

  if (isElevated) {
    sections.push("");
    sections.push(`TIER 3 — ELEVATED REVIEW (${category} / ${productType}):`);
    sections.push("This product type has elevated claim sensitivity. Apply stricter scrutiny to:");
    sections.push("  • Health, efficacy, or outcome claims — must be personal experience framing, not universal");
    sections.push("  • Before/after claims — must reflect honest personal timeline, not guaranteed outcome");
    sections.push("  • Ingredient or mechanism claims — must match what is on the product label or page");
    sections.push("  • Any language that sounds like a medical, therapeutic, or clinical claim");
  }

  // ── Category-specific rules (existing system) ──────────────────────────
  if (categoryRulesContent) {
    sections.push("");
    sections.push(`CATEGORY-SPECIFIC RULES (${category}):`);
    sections.push(categoryRulesContent);
  }

  return sections.join("\n");
}

export function buildCompliancePrompt(
  script: GeneratedScript,
  category: CategoryId,
  categoryRulesContent: string | null,
  productType: string = "",
): string {
  const policyRules = buildPolicyRulesContent(category, productType, categoryRulesContent);

  // Collect all reviewable text from the script
  const spokenLines = script.beats
    .filter((b) => b.spoken)
    .map((b) => `  [SPOKEN] "${b.spoken}"`)
    .join("\n");
  const textOverlays = script.beats
    .filter((b) => b.text_overlay)
    .map((b) => `  [TEXT] "${b.text_overlay}"`)
    .join("\n");

  return `Review this TikTok Shop creator content for policy compliance.

CATEGORY: ${category}
PRODUCT TYPE: ${productType}

POLICY RULES:
${policyRules}

CONTENT TO REVIEW:

Hook Options:
${script.hook_options.map((h) => `  ${h.rank}. [${h.hook_format}] "${h.hook_text}"`).join("\n")}

Spoken Lines:
${spokenLines || "  (none)"}

Text Overlays:
${textOverlays || "  (none)"}

CTA: "${script.cta_logic.cta_text}"
Caption: "${script.caption}"

Return a JSON object with:
{
  "category_requires_compliance": boolean — true if category-specific rules were applied, false if only universal policy,
  "modifications_made": array of {
    "original": string — the exact original phrase that violates policy,
    "replacement": string — the compliant replacement that preserves creator voice and intent,
    "reason": string — brief explanation: which tier and which rule triggered
  },
  "creator_note": string or null — if modifications were made, a brief protective note to the creator (1-2 sentences max, frame as protection not restriction). null if no modifications needed,
  "cleared": boolean — true if the content passes compliance (with or without modifications)
}

REVIEW RULES:
- Scan ALL content (hooks, spoken lines, text overlays, CTA, caption) against ALL tiers
- TIER 1 violations: MUST be caught and replaced. Flag cleared=false if any Tier 1 violation is unreplaceable.
- TIER 2 violations: normalize phrasing. The replacement must preserve the original intent and creator tone.
- TIER 3: apply elevated scrutiny to the flagged content areas.
- Do NOT over-correct. If a phrase is strong but safe, leave it alone.
- Do NOT add disclaimers unless a specific rule requires one.
- Do NOT strip legitimate offer/sale urgency when product data supports it.
- Do NOT weaken CTA momentum unless the CTA contains a real policy violation.
- PRESERVE: creator-native tone, product-specific language, proof logic, angle integrity, CTA closing energy.
- If no violations found, return empty modifications_made array and cleared: true.

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
