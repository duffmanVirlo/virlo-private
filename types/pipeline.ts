export type PipelineStage =
  | "extracting"
  | "classifying"
  | "analyzing"
  | "selecting-modality"
  | "mapping-show-say"
  | "selecting-angle"
  | "generating-script"
  | "running-qa"
  | "compliance-check"
  | "assembling"
  | "complete"
  | "failed";

export type PipelineStageStatus = "pending" | "active" | "complete" | "failed";

export type PipelineState = {
  session_id: string;
  url: string;
  current_stage: PipelineStage;
  stages: Record<PipelineStage, PipelineStageStatus>;
  error: string | null;
  qa_attempts: number;
};

export const STAGE_LABELS = [
  { stage: "extracting" as const, label: "Extracting product data", description: "Reading product signals from the link" },
  { stage: "classifying" as const, label: "Classifying product", description: "Identifying category and product type" },
  { stage: "analyzing" as const, label: "Building buyer map", description: "Mapping psychology, barriers, and proof opportunities" },
  { stage: "selecting-modality" as const, label: "Selecting content format", description: "Choosing the highest-converting video modality" },
  { stage: "mapping-show-say" as const, label: "Mapping proof strategy", description: "Determining what to show vs. say vs. never say" },
  { stage: "selecting-angle" as const, label: "Selecting angle", description: "Scoring and choosing the highest-converting angle" },
  { stage: "generating-script" as const, label: "Generating strategy", description: "Writing script, hooks, filming instructions" },
  { stage: "running-qa" as const, label: "Quality check", description: "Verifying output against ConvertIQ standards" },
  { stage: "compliance-check" as const, label: "Compliance review", description: "Protecting against overclaiming" },
  { stage: "assembling" as const, label: "Assembling output", description: "Packaging your complete strategy" },
] as const;
