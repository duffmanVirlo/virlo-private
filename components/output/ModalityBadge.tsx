import type { ModalitySelection } from "@/types/modality";
import { Badge } from "@/components/ui/Badge";

type ModalityBadgeProps = {
  modality: ModalitySelection;
};

const modalityLabels: Record<string, string> = {
  "silent-visual-first": "Silent Visual",
  "text-led": "Text-Led",
  "voiceover-led": "Voiceover",
  "creator-to-camera": "Creator to Camera",
  "demo-first": "Demo First",
  "comparison-led": "Comparison",
  "routine-integration": "Routine Integration",
  "problem-reveal-led": "Problem Reveal",
};

export function ModalityBadge({ modality }: ModalityBadgeProps) {
  return (
    <div className="flex items-start gap-3">
      <Badge variant="accent">
        {modalityLabels[modality.selected] || modality.selected}
      </Badge>
      <p className="text-sm text-text-secondary leading-relaxed">{modality.reason}</p>
    </div>
  );
}
