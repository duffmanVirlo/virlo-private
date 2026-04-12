import type { ScriptBeat as ScriptBeatType } from "@/types/script";
import { ScriptBeat } from "./ScriptBeat";
import { CopyButton } from "@/components/ui/CopyButton";

type ScriptDisplayProps = {
  beats: ScriptBeatType[];
  totalDuration: number;
};

export function ScriptDisplay({ beats, totalDuration }: ScriptDisplayProps) {
  const fullScriptText = beats
    .map((b) => {
      const time = `[${b.start_seconds}s-${b.end_seconds}s]`;
      const lines = [`${time} ${b.type}: ${b.content}`];
      if (b.spoken) lines.push(`  SPOKEN: "${b.spoken}"`);
      if (b.text_overlay) lines.push(`  TEXT: ${b.text_overlay}`);
      if (b.filming_note) lines.push(`  NOTE: ${b.filming_note}`);
      return lines.join("\n");
    })
    .join("\n");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">
          {beats.length} beats / {totalDuration}s total
        </span>
        <CopyButton text={fullScriptText} label="Copy Script" />
      </div>
      <div className="border border-border rounded-lg bg-surface overflow-hidden">
        {beats.map((beat, i) => (
          <ScriptBeat key={i} beat={beat} />
        ))}
      </div>
    </div>
  );
}
