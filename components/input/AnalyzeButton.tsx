"use client";

import { LoadingDots } from "@/components/ui/LoadingDots";

type AnalyzeButtonProps = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function AnalyzeButton({ onClick, loading, disabled }: AnalyzeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
        disabled || loading
          ? "bg-raised text-text-muted cursor-not-allowed"
          : "bg-accent text-void hover:bg-accent-bright active:scale-[0.98] shadow-[0_1px_12px_rgba(245,158,11,0.2)]"
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          Analyzing <LoadingDots />
        </span>
      ) : (
        "Analyze Product"
      )}
    </button>
  );
}
