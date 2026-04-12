"use client";

import { useState, useEffect, useRef } from "react";
import { STAGE_LABELS, type PipelineStage, type PipelineStageStatus } from "@/types/pipeline";
import { StageIndicator } from "./StageIndicator";

type ProcessingShellProps = {
  currentStage: PipelineStage;
  stageStatuses: Record<string, PipelineStageStatus>;
};

const LONG_RUN_THRESHOLD_S = 90;

export function ProcessingShell({ currentStage, stageStatuses }: ProcessingShellProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef(Date.now());

  // Elapsed timer
  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate progress percentage from stages
  const completedCount = STAGE_LABELS.filter((s) => stageStatuses[s.stage] === "complete").length;
  const activeIndex = STAGE_LABELS.findIndex((s) => stageStatuses[s.stage] === "active");
  const totalStages = STAGE_LABELS.length;

  // Smooth progress: completed stages + partial progress within the active stage
  // Use elapsed time within the current stage band to interpolate (assume ~6s per stage average)
  const baseProgress = (completedCount / totalStages) * 100;
  const stageWidth = 100 / totalStages;
  const intraStageProgress = activeIndex >= 0 ? Math.min(stageWidth * 0.8, (elapsedSeconds % 8) * (stageWidth / 10)) : 0;
  const progress = Math.min(95, baseProgress + intraStageProgress); // Never hit 100 until truly done

  const percentage = Math.round(progress);
  const isLongRun = elapsedSeconds >= LONG_RUN_THRESHOLD_S;
  const isFailed = currentStage === "failed";

  const formattedTime = formatElapsed(elapsedSeconds);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="font-display text-2xl font-bold text-text-primary">
          ConvertIQ is building your strategy
        </h2>
        <p className="text-sm text-text-secondary">
          {isLongRun
            ? "This one is taking longer than usual, but ConvertIQ is still working."
            : "Analyzing product signals and building your execution plan."}
        </p>
      </div>

      {/* Progress bar + percentage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-primary tabular-nums">{percentage}%</span>
          <span className="text-xs text-text-faint tabular-nums">{formattedTime}</span>
        </div>
        <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="space-y-0.5">
        {STAGE_LABELS.map(({ stage, label, description }) => (
          <StageIndicator
            key={stage}
            label={label}
            description={description}
            status={stageStatuses[stage] || "pending"}
          />
        ))}
      </div>

      {/* Reassurance footer */}
      <div className="text-center space-y-2 pt-2">
        {isLongRun && !isFailed && (
          <p className="text-xs text-accent/80 animate-fade-in">
            Complex products or deeper quality validation can extend processing.
          </p>
        )}
        <p className="text-[11px] text-text-faint leading-relaxed">
          Most strategies finish in 30–90 seconds. Some may take up to 2–3 minutes.
          <br />
          Please keep this page open.
        </p>
      </div>

      {/* Failed state */}
      {isFailed && (
        <div className="text-center py-4 animate-fade-in">
          <p className="text-sm text-error">
            Something went wrong. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}

function formatElapsed(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
