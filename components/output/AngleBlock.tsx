import type { AngleSelection } from "@/types/angle";
import { Badge } from "@/components/ui/Badge";

type AngleBlockProps = {
  angle: AngleSelection;
};

export function AngleBlock({ angle }: AngleBlockProps) {
  const { selected } = angle;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold text-text-primary">{selected.name}</h4>
          <p className="text-sm text-text-secondary leading-relaxed">
            {selected.conversion_hypothesis}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Badge variant="accent">{selected.score.composite.toFixed(1)}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-elevated rounded-lg p-3 space-y-1">
          <p className="text-xs text-text-muted uppercase tracking-wider">Entry</p>
          <p className="text-sm text-text-secondary">{selected.entry_mechanism}</p>
        </div>
        <div className="bg-elevated rounded-lg p-3 space-y-1">
          <p className="text-xs text-text-muted uppercase tracking-wider">Proof Vehicle</p>
          <p className="text-sm text-text-secondary">{selected.proof_vehicle}</p>
        </div>
        <div className="bg-elevated rounded-lg p-3 space-y-1">
          <p className="text-xs text-text-muted uppercase tracking-wider">Belief Path</p>
          <p className="text-sm text-text-secondary">{selected.belief_formation_path}</p>
        </div>
        <div className="bg-elevated rounded-lg p-3 space-y-1">
          <p className="text-xs text-text-muted uppercase tracking-wider">CTA Setup</p>
          <p className="text-sm text-text-secondary">{selected.cta_setup}</p>
        </div>
      </div>

      {selected.creator_pattern_source && (
        <p className="text-xs text-text-muted">
          Pattern source: <span className="text-accent">{selected.creator_pattern_source}</span>
        </p>
      )}
    </div>
  );
}
