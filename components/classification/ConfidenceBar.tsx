type ConfidenceBarProps = {
  confidence: number;
  label: "high" | "moderate" | "low";
};

const labelColors = {
  high: "text-success",
  moderate: "text-warning",
  low: "text-error",
};

const barColors = {
  high: "bg-success",
  moderate: "bg-warning",
  low: "bg-error",
};

export function ConfidenceBar({ confidence, label }: ConfidenceBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted uppercase tracking-wider">Confidence</span>
        <span className={`text-xs font-semibold ${labelColors[label]}`}>
          {confidence}% — {label}
        </span>
      </div>
      <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColors[label]}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
