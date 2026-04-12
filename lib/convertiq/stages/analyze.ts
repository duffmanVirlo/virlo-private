import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import { callClaudeWithRetry } from "@/lib/anthropic";
import { ANALYZE_SYSTEM_PROMPT, buildAnalyzePrompt } from "@/lib/prompts/analyze";
import { getCategoryModule } from "@/lib/convertiq/categoryModules";
import { getProductTypeDefinition } from "@/lib/convertiq/productTypes";
import { identifyCreatorArchetype } from "@/lib/convertiq/creatorDoctrine";

export async function runAnalysis(
  product: ExtractedProduct,
  classification: ClassificationResult,
): Promise<ProductAnalysis> {
  const categoryModule = getCategoryModule(classification.primary_category);
  const productType = getProductTypeDefinition(
    classification.primary_category,
    classification.product_type,
  );

  // Identify the closest creator archetype based on category and a default role
  // The actual primary_role will be determined by the analysis
  const creatorArchetype = identifyCreatorArchetype(
    classification.primary_category,
    "demonstration-led", // default assumption, refined after analysis
  );

  const result = await callClaudeWithRetry<ProductAnalysis>({
    prompt: buildAnalyzePrompt(
      product,
      classification,
      categoryModule,
      productType,
      creatorArchetype,
    ),
    systemPrompt: ANALYZE_SYSTEM_PROMPT,
    maxTokens: 3072,
    temperature: 0.3,
    stage: "analyze",
  });

  // Ensure category and product type metadata are set correctly
  return {
    ...result,
    category_module_applied: classification.primary_category,
    product_type_applied: classification.product_type,
  };
}
