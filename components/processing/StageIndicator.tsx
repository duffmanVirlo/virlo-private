import type { PipelineStageStatus } from "@/types/pipeline";

type StageIndicatorProps = {
  label: string;
  description: string;
  status: PipelineStageStatus;
};

export function StageIndicator({ label, description, status }: StageIndicatorProps) {
  return (
    <div
      className={`flex items-start gap-3 py-2.5 transition-all duration-300 ${
        status === "active" ? "opacity-100" : status === "complete" ? "opacity-50" : "opacity-25"
      }`}
    >
      <div className="mt-0.5 flex-shrink-0">
        {status === "complete" ? (
          <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : status === "active" ? (
          <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-[pulse-subtle_1.5s_ease-in-out_infinite]" />
          </div>
        ) : status === "failed" ? (
          <div className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center">
            <svg className="w-3 h-3 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-elevated border border-border-subtle" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-tight ${
          status === "active" ? "font-medium text-text-primary" : "text-text-secondary"
        }`}>
          {label}
        </p>
        {status === "active" && (
          <p className="text-xs text-text-muted mt-0.5 animate-fade-in">{description}</p>
        )}
      </div>

      {status === "active" && (
        <span className="text-[10px] text-accent font-medium uppercase tracking-wider flex-shrink-0 mt-0.5">
          Active
        </span>
      )}
    </div>
  );
}
