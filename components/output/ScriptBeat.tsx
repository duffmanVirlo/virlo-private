import type { ScriptBeat as ScriptBeatType, BeatType } from "@/types/script";
import { Badge } from "@/components/ui/Badge";

type ScriptBeatProps = {
  beat: ScriptBeatType;
};

const beatVariants: Record<BeatType, "beat-show" | "beat-spoken" | "beat-text" | "beat-hold" | "beat-note"> = {
  SHOW: "beat-show",
  SPOKEN: "beat-spoken",
  TEXT: "beat-text",
  HOLD: "beat-hold",
  CREATOR_NOTE: "beat-note",
};

export function ScriptBeat({ beat }: ScriptBeatProps) {
  return (
    <div className="flex gap-3 py-3 border-b border-border-subtle last:border-0">
      <div className="flex-shrink-0 w-16 text-right">
        <span className="text-xs font-mono text-text-muted">
          {beat.start_seconds}s–{beat.end_seconds}s
        </span>
      </div>
      <div className="flex-shrink-0">
        <Badge variant={beatVariants[beat.type]}>{beat.type}</Badge>
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-sm text-text-primary leading-relaxed">{beat.content}</p>
        {beat.spoken && (
          <p className="text-sm text-beat-spoken/90 leading-relaxed">
            <span className="text-xs text-text-muted mr-1.5">SPOKEN:</span>
            &ldquo;{beat.spoken}&rdquo;
          </p>
        )}
        {beat.text_overlay && (
          <p className="text-sm text-beat-text/90 leading-relaxed">
            <span className="text-xs text-text-muted mr-1.5">TEXT:</span>
            {beat.text_overlay}
          </p>
        )}
        {beat.filming_note && (
          <p className="text-xs text-text-muted italic">{beat.filming_note}</p>
        )}
      </div>
    </div>
  );
}
