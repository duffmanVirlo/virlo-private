import type { ExtractedProduct } from "./product";
import type { ClassificationResult } from "./classification";
import type { ProductAnalysis } from "./analysis";
import type { ModalitySelection } from "./modality";
import type { ShowSayMap } from "./showSay";
import type { AngleSelection } from "./angle";
import type { GeneratedScript } from "./script";
import type { QAResult, ComplianceResult } from "./score";

export type OutputPackage = {
  session_id: string;
  generated_at: string;
  product: ExtractedProduct;
  classification: ClassificationResult;
  analysis: ProductAnalysis;
  modality: ModalitySelection;
  show_say: ShowSayMap;
  angle: AngleSelection;
  script: GeneratedScript;
  qa: QAResult;
  compliance: ComplianceResult;
};
