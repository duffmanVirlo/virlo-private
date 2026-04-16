"use client";

// ============================================================================
// Virlo Usage Hook — React client-side usage management
// ============================================================================

import { useState, useCallback, useEffect } from "react";
import type { UsageState, UsageCheckResult } from "./types";
import { checkUsage, recordRun, recordCapHit } from "./engine";
import { PLANS } from "./plans";
import { loadUsageState, saveUsageState } from "./storage";
import { isFounderMode, detectAndActivateFounderMode } from "./founderMode";

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
// See lib/usage/founderMode.ts for the source of truth. This hook consumes
// the shared helpers to stay synchronized with FounderModeDetector.
//
// The production usage system (plans, engine, storage) is completely untouched.
// This bypass only affects the hook's return values (display + gating).

export function useUsage(): UseUsageReturn {
  const [state, setState] = useState<UsageState>(() => loadUsageState());
  const [isFounder, setIsFounder] = useState(false);

  // On mount: (1) detect+activate founder mode from URL if present,
  // (2) re-read persisted state, (3) check founder mode from any source.
  useEffect(() => {
    detectAndActivateFounderMode(); // capture ?founder= param if this page has it
    setState(loadUsageState());
    setIsFounder(isFounderMode());
  }, []);

  const currentCheck = checkUsage(state);
  const plan = PLANS[state.plan_id];

  const consumeRun = useCallback((): boolean => {
    // ── Founder testing: always allow ────────────────────────────────
    if (isFounderMode()) return true;

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
  if (isFounder) {
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
