"use client";

import type { PlanId } from "@/lib/usage/plans";

type UsageBadgeProps = {
  planName: string;
  planId: PlanId;
  runsRemaining: number;
  dailyLimit: number;
};

const IS_FOUNDER_TESTING = process.env.NEXT_PUBLIC_FOUNDER_TESTING === "true";

export function UsageBadge({ planName, planId, runsRemaining, dailyLimit }: UsageBadgeProps) {
  const isLow = runsRemaining <= 1 && runsRemaining > 0;
  const isEmpty = runsRemaining === 0;

  // Founder testing: clean internal badge, no usage counts
  if (IS_FOUNDER_TESTING) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs">
        <span className="font-medium text-accent">Founder Testing Mode</span>
        <span className="text-text-faint">·</span>
        <span className="text-text-muted">Unlimited internal runs</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs">
      <span className={`font-medium ${planId === "trial" ? "text-accent" : "text-text-secondary"}`}>
        {planName}
      </span>
      <span className="text-text-faint">·</span>
      <span className={`tabular-nums ${isEmpty ? "text-error" : isLow ? "text-warning" : "text-text-muted"}`}>
        {runsRemaining} of {dailyLimit} left today
      </span>
    </div>
  );
}
