import type { GeneratedScript } from "@/types/script";
import type { CategoryId } from "@/types/classification";
import type { ComplianceResult } from "@/types/score";
import { callClaudeWithRetry } from "@/lib/anthropic";
import {
  COMPLIANCE_SYSTEM_PROMPT,
  buildCompliancePrompt,
} from "@/lib/prompts/compliance";
import { getComplianceRules } from "@/lib/convertiq/complianceRules";

/**
 * Run TikTok Shop content policy compliance on ALL outputs.
 *
 * This is a FINAL ENFORCEMENT LAYER, not creative doctrine.
 * It runs after script generation and QA to catch policy violations
 * without influencing upstream generation quality.
 *
 * - Universal TikTok policy (Tier 1 hard blocks, Tier 2 soft rewrites) runs on ALL categories
 * - Category-specific rules (WELLNESS, BEAUTY, BABY, PET) run in addition
 * - Tier 3 elevated review triggers on sensitive product types regardless of category
 */
export async function runCompliancePass(
  script: GeneratedScript,
  category: CategoryId,
  productType: string = "",
): Promise<ComplianceResult> {
  // Build category-specific rules content if applicable
  const categoryRules = getComplianceRules(category);
  let categoryRulesContent: string | null = null;

  if (categoryRules) {
    categoryRulesContent = [
      `BLOCKED PHRASES:`,
      ...categoryRules.blocked_phrases.map((b) => `• "${b.phrase}" — ${b.reason}. Replace with: ${b.replacement_guidance}`),
      ``,
      `REQUIRED FRAMING:`,
      ...categoryRules.required_framing.map((f) => `• ${f.rule} — Example: "${f.example}"`),
      ``,
      `DISCLAIMER REQUIREMENTS:`,
      ...categoryRules.disclaimer_requirements.map((d) => `• ${d}`),
    ].join("\n");
  }

  // ALWAYS run compliance — universal TikTok policy applies to all categories.
  // Category-specific rules are passed through when available.
  const result = await callClaudeWithRetry<ComplianceResult>({
    prompt: buildCompliancePrompt(script, category, categoryRulesContent, productType),
    systemPrompt: COMPLIANCE_SYSTEM_PROMPT,
    maxTokens: 2048,
    temperature: 0.1,
    stage: "compliance",
  });

  return {
    ...result,
    category_requires_compliance: !!categoryRules,
  };
}
