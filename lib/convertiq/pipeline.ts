import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ModalitySelection } from "@/types/modality";
import type { ShowSayMap } from "@/types/showSay";
import type { AngleSelection } from "@/types/angle";
import type { GeneratedScript } from "@/types/script";
import type { QAResult, ComplianceResult } from "@/types/score";
import type { OutputPackage } from "@/types/output";
import type { PipelineStage } from "@/types/pipeline";

import { flushRunUsage } from "@/lib/anthropic";
import { runExtraction } from "./stages/extract";
import { runClassification } from "./stages/classify";
import { runAnalysis } from "./stages/analyze";
import { runModalitySelection } from "./stages/modality";
import { runShowSayMapping } from "./stages/showSay";
import { runAngleSelection } from "./stages/angle";
import { runScriptGeneration } from "./stages/script";
import { runQAPass } from "./stages/qa";
import { runCompliancePass } from "./stages/compliance";
import { assembleOutputPackage } from "./assemble";

const MAX_QA_RETRIES = 2;
const PIPELINE_TIMEOUT = 300000;

export type StageUpdateCallback = (stage: PipelineStage) => void;

export type PipelineInput = {
  url: string;
  sessionId: string;
  overrideCategory?: string;
  overrideProductType?: string;
  onStageUpdate?: StageUpdateCallback;
};

export type PipelineResult = {
  success: boolean;
  output?: OutputPackage;
  error?: string;
  failedStage?: PipelineStage;
};

export async function runPipeline(input: PipelineInput): Promise<PipelineResult> {
  const { url, sessionId, overrideCategory, overrideProductType, onStageUpdate } = input;

  const notify = (stage: PipelineStage) => {
    if (onStageUpdate) onStageUpdate(stage);
  };

  // Wrap with timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Pipeline timeout: exceeded 90 seconds")), PIPELINE_TIMEOUT);
  });

  try {
    const result = await Promise.race([
      executePipeline(url, sessionId, overrideCategory, overrideProductType, notify),
      timeoutPromise,
    ]);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown pipeline error",
      failedStage: "failed",
    };
  }
}

async function executePipeline(
  url: string,
  sessionId: string,
  overrideCategory: string | undefined,
  overrideProductType: string | undefined,
  notify: StageUpdateCallback,
): Promise<PipelineResult> {
  let product: ExtractedProduct;
  let classification: ClassificationResult;
  let analysis: ProductAnalysis;
  let modality: ModalitySelection;
  let showSay: ShowSayMap;
  let angle: AngleSelection;
  let script: GeneratedScript;
  let qa: QAResult;
  let compliance: ComplianceResult;

  // Stage 1: Extraction
  try {
    notify("extracting");
    const extractionResult = await runExtraction(url);
    if (!extractionResult.success || !extractionResult.product) {
      return { success: false, error: extractionResult.error || "Extraction failed", failedStage: "extracting" };
    }
    product = extractionResult.product;
  } catch (error) {
    return { success: false, error: `Extraction failed: ${errorMessage(error)}`, failedStage: "extracting" };
  }

  // Stage 2: Classification
  try {
    notify("classifying");
    classification = await runClassification(product);

    // Apply overrides if provided
    if (overrideCategory) {
      classification = {
        ...classification,
        primary_category: overrideCategory as ClassificationResult["primary_category"],
        confidence: 100,
        confidence_label: "high",
        requires_override_prompt: false,
        reason: `Manually overridden to ${overrideCategory}`,
      };
    }
    if (overrideProductType) {
      classification = { ...classification, product_type: overrideProductType };
    }
  } catch (error) {
    return { success: false, error: `Classification failed: ${errorMessage(error)}`, failedStage: "classifying" };
  }

  // Stage 3: Analysis
  try {
    notify("analyzing");
    analysis = await runAnalysis(product, classification);
  } catch (error) {
    return { success: false, error: `Analysis failed: ${errorMessage(error)}`, failedStage: "analyzing" };
  }

  // Stage 4: Modality Selection
  try {
    notify("selecting-modality");
    modality = await runModalitySelection(classification, analysis);
  } catch (error) {
    return { success: false, error: `Modality selection failed: ${errorMessage(error)}`, failedStage: "selecting-modality" };
  }

  // Stage 5: Show/Say Map
  try {
    notify("mapping-show-say");
    showSay = await runShowSayMapping(product, classification, analysis, modality);
  } catch (error) {
    return { success: false, error: `Show/Say mapping failed: ${errorMessage(error)}`, failedStage: "mapping-show-say" };
  }

  // Stage 6: Angle Selection
  try {
    notify("selecting-angle");
    angle = await runAngleSelection(product, classification, analysis, modality, showSay);
  } catch (error) {
    return { success: false, error: `Angle selection failed: ${errorMessage(error)}`, failedStage: "selecting-angle" };
  }

  // Stage 7 + 8: Script Generation + QA (with retry loop)
  let qaAttempts = 0;
  let bestScript: GeneratedScript | null = null;
  let bestQA: QAResult | null = null;

  try {
    notify("generating-script");
    script = await runScriptGeneration(product, classification, analysis, modality, showSay, angle);
    bestScript = script;

    notify("running-qa");
    qa = await runQAPass(script, angle, analysis, showSay, classification);
    bestQA = qa;
    qaAttempts = 1;

    // QA retry loop
    while (!qa.passed && qaAttempts < MAX_QA_RETRIES) {
      notify("generating-script");
      script = await runScriptGeneration(
        product, classification, analysis, modality, showSay, angle,
        qa.regeneration_targets,
      );
      bestScript = script;

      notify("running-qa");
      qa = await runQAPass(script, angle, analysis, showSay, classification);
      bestQA = qa;
      qaAttempts++;
    }

    // Use best available after max retries
    script = bestScript;
    qa = bestQA;
  } catch (error) {
    if (bestScript && bestQA) {
      // Use best available if we have something
      script = bestScript;
      qa = bestQA;
    } else {
      return { success: false, error: `Script/QA failed: ${errorMessage(error)}`, failedStage: "generating-script" };
    }
  }

  // Stage 9: Compliance
  try {
    notify("compliance-check");
    compliance = await runCompliancePass(script, classification.primary_category);
  } catch (error) {
    return { success: false, error: `Compliance check failed: ${errorMessage(error)}`, failedStage: "compliance-check" };
  }

  // Assemble
  notify("assembling");
  const output = assembleOutputPackage({
    sessionId,
    product,
    classification,
    analysis,
    modality,
    showSay,
    angle,
    script,
    qa,
    compliance,
  });

  notify("complete");

  // Log usage telemetry
  const usage = flushRunUsage();
  console.log(
    `[ConvertIQ] Run complete: ${usage.calls.length} API calls, ` +
    `${usage.totals.input_tokens} input / ${usage.totals.output_tokens} output tokens, ` +
    `~$${(usage.totals.estimated_cost_cents / 100).toFixed(3)} estimated cost`,
  );

  return { success: true, output };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}
