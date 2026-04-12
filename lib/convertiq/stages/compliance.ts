import type { GeneratedScript } from "@/types/script";
import type { CategoryId } from "@/types/classification";
import type { ComplianceResult } from "@/types/score";
import { callClaudeWithRetry } from "@/lib/anthropic";
import {
  COMPLIANCE_SYSTEM_PROMPT,
  buildCompliancePrompt,
  buildCompliancePassthrough,
} from "@/lib/prompts/compliance";
import { getComplianceRules } from "@/lib/convertiq/complianceRules";

const COMPLIANCE_CATEGORIES: CategoryId[] = ["WELLNESS", "BEAUTY", "BABY", "PET"];

export async function runCompliancePass(
  script: GeneratedScript,
  category: CategoryId,
): Promise<ComplianceResult> {
  // Pass-through for non-compliance categories
  if (!COMPLIANCE_CATEGORIES.includes(category)) {
    return buildCompliancePassthrough();
  }

  const rules = getComplianceRules(category);
  if (!rules) {
    return buildCompliancePassthrough();
  }

  // Build rules content for the prompt
  const rulesContent = [
    `BLOCKED PHRASES:`,
    ...rules.blocked_phrases.map((b) => `• "${b.phrase}" — ${b.reason}. Replace with: ${b.replacement_guidance}`),
    ``,
    `REQUIRED FRAMING:`,
    ...rules.required_framing.map((f) => `• ${f.rule} — Example: "${f.example}"`),
    ``,
    `DISCLAIMER REQUIREMENTS:`,
    ...rules.disclaimer_requirements.map((d) => `• ${d}`),
  ].join("\n");

  const result = await callClaudeWithRetry<ComplianceResult>({
    prompt: buildCompliancePrompt(script, category, rulesContent),
    systemPrompt: COMPLIANCE_SYSTEM_PROMPT,
    maxTokens: 2048,
    temperature: 0.1,
    stage: "compliance",
  });

  return {
    ...result,
    category_requires_compliance: true,
  };
}
