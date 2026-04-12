import type { GeneratedScript } from "@/types/script";
import { CopyButton } from "@/components/ui/CopyButton";

type CTALogicBlockProps = {
  logic: GeneratedScript["cta_logic"];
};

export function CTALogicBlock({ logic }: CTALogicBlockProps) {
  return (
    <div className="space-y-3">
      <div className="border border-accent/20 rounded-lg bg-accent-surface/30 p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-base font-semibold text-text-primary">&ldquo;{logic.cta_text}&rdquo;</p>
          <CopyButton text={logic.cta_text} />
        </div>
        <p className="text-xs text-text-muted">{logic.why_it_works}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-elevated rounded-lg p-3 space-y-1">
          <p className="text-xs text-text-muted uppercase tracking-wider">Viewer State at CTA</p>
          <p className="text-sm text-text-secondary">{logic.viewer_state_at_cta}</p>
        </div>
        {logic.pressure_mechanism && (
          <div className="bg-elevated rounded-lg p-3 space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-wider">Pressure Mechanism</p>
            <p className="text-sm text-text-secondary">{logic.pressure_mechanism}</p>
          </div>
        )}
      </div>
    </div>
  );
}
