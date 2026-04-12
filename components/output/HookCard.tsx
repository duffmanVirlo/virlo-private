import type { HookOption } from "@/types/script";
import { CopyButton } from "@/components/ui/CopyButton";
import { Badge } from "@/components/ui/Badge";

type HookCardProps = {
  hook: HookOption;
};

const rankLabels = {
  1: "Primary",
  2: "Alternative",
  3: "Variant",
};

const formatLabels: Record<string, string> = {
  spoken: "Spoken",
  visual: "Visual",
  "text-overlay": "Text",
};

export function HookCard({ hook }: HookCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 space-y-3 ${
        hook.rank === 1
          ? "border-accent/30 bg-accent-surface/30"
          : "border-border bg-surface"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              hook.rank === 1 ? "text-accent" : "text-text-muted"
            }`}
          >
            {rankLabels[hook.rank]}
          </span>
          <Badge variant={hook.hook_format === "spoken" ? "beat-spoken" : hook.hook_format === "visual" ? "beat-show" : "beat-text"}>
            {formatLabels[hook.hook_format] || hook.hook_format}
          </Badge>
        </div>
        <CopyButton text={hook.hook_text} label="Copy" />
      </div>

      <p className="text-base text-text-primary font-medium leading-relaxed">
        &ldquo;{hook.hook_text}&rdquo;
      </p>

      <div className="space-y-1.5">
        <p className="text-xs text-text-secondary">{hook.rationale}</p>
        {hook.performance_note && (
          <p className="text-xs text-text-muted italic">{hook.performance_note}</p>
        )}
      </div>
    </div>
  );
}
