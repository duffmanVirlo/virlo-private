import type { ExtractedProduct } from "@/types/product";
import type { ClassificationResult } from "@/types/classification";
import type { ProductAnalysis } from "@/types/analysis";
import type { ModalitySelection } from "@/types/modality";
import type { ShowSayMap } from "@/types/showSay";
import type { AngleSelection } from "@/types/angle";
import type { GeneratedScript } from "@/types/script";
import type { QAResult, ComplianceResult } from "@/types/score";
import type { OutputPackage } from "@/types/output";

export function assembleOutputPackage(params: {
  sessionId: string;
  product: ExtractedProduct;
  classification: ClassificationResult;
  analysis: ProductAnalysis;
  modality: ModalitySelection;
  showSay: ShowSayMap;
  angle: AngleSelection;
  script: GeneratedScript;
  qa: QAResult;
  compliance: ComplianceResult;
}): OutputPackage {
  return {
    session_id: params.sessionId,
    generated_at: new Date().toISOString(),
    product: params.product,
    classification: params.classification,
    analysis: params.analysis,
    modality: params.modality,
    show_say: params.showSay,
    angle: params.angle,
    script: params.script,
    qa: params.qa,
    compliance: params.compliance,
  };
}
