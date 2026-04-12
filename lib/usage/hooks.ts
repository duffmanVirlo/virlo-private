"use client";

// ============================================================================
// Virlo Usage Hook — React client-side usage management
// ============================================================================

import { useState, useCallback, useEffect } from "react";
import type { UsageState, UsageCheckResult } from "./types";
import { checkUsage, recordRun, recordCapHit } from "./engine";
import { PLANS } from "./plans";
import { loadUsageState, saveUsageState } from "./storage";

export type UseUsageReturn = {
  /** Current usage state */
  state: UsageState;
  /** Result of the latest usage check */
  check: UsageCheckResult;
  /** Plan display name */
  planName: string;
  /** Runs remaining today (base + topup) */
  runsRemaining: number;
  /** Daily run limit for current plan */
  dailyLimit: number;
  /** Runs used today (base + topup) */
  runsUsed: number;
  /** Attempt to consume a run. Returns true if allowed, false if blocked. */
  consumeRun: () => boolean;
  /** Refresh state from localStorage (useful after external changes) */
  refresh: () => void;
};

// ── Founder testing bypass ──────────────────────────────────────────────────
// When NEXT_PUBLIC_FOUNDER_TESTING=true (set in .env.local), usage gating
// is fully bypassed. The production usage system (plans, engine, storage)
// is completely untouched — this bypass only affects the hook's return values.
// On Vercel (no .env.local deployed), normal gating applies as designed.
// To re-enable public gating: remove NEXT_PUBLIC_FOUNDER_TESTING from .env.local.
const IS_FOUNDER_TESTING = process.env.NEXT_PUBLIC_FOUNDER_TESTING === "true";

export function useUsage(): UseUsageReturn {
  const [state, setState] = useState<UsageState>(() => loadUsageState());

  // Re-load from storage on mount (handles SSR hydration)
  useEffect(() => {
    setState(loadUsageState());
  }, []);

  const currentCheck = checkUsage(state);
  const plan = PLANS[state.plan_id];

  const consumeRun = useCallback((): boolean => {
    // ── Founder testing: always allow ────────────────────────────────
    if (IS_FOUNDER_TESTING) return true;

    // Fresh check against latest state
    const freshState = loadUsageState();
    const freshCheck = checkUsage(freshState);

    if (!freshCheck.allowed) {
      // Record the cap hit for nudge tracking
      const updatedState = recordCapHit(freshState);
      saveUsageState(updatedState);
      setState(updatedState);
      return false;
    }

    // Consume the run
    const { state: newState } = recordRun(freshState);
    saveUsageState(newState);
    setState(newState);
    return true;
  }, []);

  const refresh = useCallback(() => {
    setState(loadUsageState());
  }, []);

  // ── Founder testing: override display values ────────────────────────
  if (IS_FOUNDER_TESTING) {
    return {
      state,
      check: { ...currentCheck, allowed: true, reason: "ok", runs_remaining: 999, topup_runs_remaining: 0 },
      planName: "Founder Testing",
      runsRemaining: 999,
      dailyLimit: 999,
      runsUsed: 0,
      consumeRun,
      refresh,
    };
  }

  return {
    state,
    check: currentCheck,
    planName: plan.display_name,
    runsRemaining: currentCheck.runs_remaining + currentCheck.topup_runs_remaining,
    dailyLimit: plan.daily_run_limit,
    runsUsed: state.runs_used_today + state.topup_runs_used_today,
    consumeRun,
    refresh,
  };
}
