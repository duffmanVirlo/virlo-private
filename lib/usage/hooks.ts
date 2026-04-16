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
// Two activation paths:
// 1. NEXT_PUBLIC_FOUNDER_TESTING=true (build-time env var, local .env.local)
// 2. URL query param ?founder=virlo-calibration (runtime, works on hosted Vercel)
//    Once activated via URL, persists in sessionStorage for the browser session
//    so testers don't need to add the param on every navigation.
//
// The production usage system (plans, engine, storage) is completely untouched.
// This bypass only affects the hook's return values (display + gating).
const IS_FOUNDER_TESTING_ENV = process.env.NEXT_PUBLIC_FOUNDER_TESTING === "true";
const FOUNDER_KEY = "virlo-calibration";
const FOUNDER_STORAGE_KEY = "virlo_founder_mode";

function checkFounderMode(): boolean {
  if (IS_FOUNDER_TESTING_ENV) return true;
  if (typeof window === "undefined") return false;

  // Check URL param (activates and persists)
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("founder") === FOUNDER_KEY) {
      sessionStorage.setItem(FOUNDER_STORAGE_KEY, "true");
      return true;
    }
  } catch { /* SSR safety */ }

  // Check persisted session
  try {
    return sessionStorage.getItem(FOUNDER_STORAGE_KEY) === "true";
  } catch { return false; }
}

export function useUsage(): UseUsageReturn {
  const [state, setState] = useState<UsageState>(() => loadUsageState());
  const [isFounder, setIsFounder] = useState(IS_FOUNDER_TESTING_ENV);

  // Re-load from storage on mount + check founder mode (handles SSR hydration + URL param)
  useEffect(() => {
    setState(loadUsageState());
    setIsFounder(checkFounderMode());
  }, []);

  const currentCheck = checkUsage(state);
  const plan = PLANS[state.plan_id];

  const consumeRun = useCallback((): boolean => {
    // ── Founder testing: always allow ────────────────────────────────
    if (checkFounderMode()) return true;

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
