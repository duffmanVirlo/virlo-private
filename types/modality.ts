export type ContentModality =
  | "silent-visual-first"
  | "text-led"
  | "voiceover-led"
  | "creator-to-camera"
  | "demo-first"
  | "comparison-led"
  | "routine-integration"
  | "problem-reveal-led";

export type ModalitySelection = {
  selected: ContentModality;
  reason: string;
  rejected: {
    modality: ContentModality;
    reason: string;
  }[];
};
