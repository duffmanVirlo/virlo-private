// ============================================================================
// Virlo Usage Engine v1
// ============================================================================
// Pure logic — no storage, no side effects, no API calls.
// Takes a UsageState, returns decisions. Caller handles persistence.
//
// In MVP: caller is client-side, persistence is localStorage.
// With auth: caller is server-side, persistence is database.
// This module stays the same either way.
// ============================================================================

import type { UsageState, UsageCheckResult, RunRecordResult } from "./types";
import { PLANS, NUDGE_RULES, type PlanId } from "./plans";

// ============================================================================
// Day boundary
// ============================================================================

/**
 * Get today's date string in the user's local timezone (YYYY-MM-DD).
 * Daily resets happen at midnight local time.
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Create a fresh usage state for a new user starting a trial.
 */
export function createInitialUsageState(): UsageState {
  const today = getTodayString();
  return {
    plan_id: "trial",
    trial_started_at: new Date().toISOString(),
    current_day: today,
    runs_used_today: 0,
    topup_runs_available: 0,
    topup_runs_used_today: 0,
    cap_hits_this_period: 0,
    topup_purchases_this_period: 0,
    period_started_at: new Date().toISOString(),
  };
}

// ============================================================================
// Daily reset
// ============================================================================

/**
 * If the day has changed since last activity, reset daily counters.
 * Returns the (possibly reset) state. Does NOT mutate the input.
 *
 * TRIAL EXCEPTION: Trial plans do NOT reset the run counter across days.
 * The trial is "3 runs total over 2 days" — not "3 per day". The
 * runs_used_today field acts as a cumulative trial-run counter for trial
 * users. (Other daily state like topups still resets.)
 */
export function applyDailyReset(state: UsageState): UsageState {
  const today = getTodayString();
  if (state.current_day === today) {
    return state; // Same day — no reset needed
  }

  return {
    ...state,
    current_day: today,
    // Trial users: preserve cumulative run count across days (3 total, not 3/day).
    // Paid plans: reset daily counter as normal.
    runs_used_today: state.plan_id === "trial" ? state.runs_used_today : 0,
    topup_runs_available: 0, // Top-ups are same-day only — they expire at reset
    topup_runs_used_today: 0,
  };
}

// ============================================================================
// Trial expiration
// ============================================================================

/**
 * Check if the trial has expired.
 */
export function isTrialExpired(state: UsageState): boolean {
  if (state.plan_id !== "trial") return false;
  if (!state.trial_started_at) return true;

  const trialStart = new Date(state.trial_started_at);
  const trialDays = PLANS.trial.trial_duration_days ?? 2;
  const expiresAt = new Date(trialStart);
  expiresAt.setDate(expiresAt.getDate() + trialDays);

  return new Date() >= expiresAt;
}

/**
 * Get trial days remaining (0 if not on trial or expired).
 */
export function getTrialDaysRemaining(state: UsageState): number {
  if (state.plan_id !== "trial" || !state.trial_started_at) return 0;

  const trialStart = new Date(state.trial_started_at);
  const trialDays = PLANS.trial.trial_duration_days ?? 2;
  const expiresAt = new Date(trialStart);
  expiresAt.setDate(expiresAt.getDate() + trialDays);

  const msRemaining = expiresAt.getTime() - Date.now();
  if (msRemaining <= 0) return 0;
  return Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
}

// ============================================================================
// Usage check
// ============================================================================

/**
 * Check whether a user can start a new run right now.
 * This is the gate function — call BEFORE starting pipeline.
 */
export function checkUsage(rawState: UsageState): UsageCheckResult {
  const state = applyDailyReset(rawState);
  const plan = PLANS[state.plan_id];

  // Trial expiration check
  if (state.plan_id === "trial" && isTrialExpired(state)) {
    return {
      allowed: false,
      reason: "trial_expired",
      runs_remaining: 0,
      topup_runs_remaining: 0,
      plan_id: state.plan_id,
      should_show_upgrade_nudge: true,
      should_show_topup_offer: false,
      nudge_type: "trial_ended",
    };
  }

  // Calculate remaining capacity
  const baseRemaining = Math.max(0, plan.daily_run_limit - state.runs_used_today);
  const topupRemaining = Math.max(0, state.topup_runs_available - state.topup_runs_used_today);
  const totalRemaining = baseRemaining + topupRemaining;

  // Can they run?
  if (totalRemaining <= 0) {
    // Daily cap hit
    const reason = state.plan_id === "trial" ? "trial_cap" as const : "daily_cap" as const;

    return {
      allowed: false,
      reason,
      runs_remaining: 0,
      topup_runs_remaining: 0,
      plan_id: state.plan_id,
      should_show_upgrade_nudge:
        state.plan_id === "trial" ||
        state.cap_hits_this_period >= NUDGE_RULES.cap_hits_before_upgrade_nudge,
      should_show_topup_offer: plan.topups_enabled,
      nudge_type: state.plan_id === "trial" ? "trial_expiring" : "cap_hit",
    };
  }

  // Allowed — but should we nudge?
  const shouldNudgeUpgrade =
    state.plan_id === "core" &&
    state.topup_purchases_this_period >= NUDGE_RULES.topups_before_upgrade_nudge;

  return {
    allowed: true,
    reason: "ok",
    runs_remaining: baseRemaining,
    topup_runs_remaining: topupRemaining,
    plan_id: state.plan_id,
    should_show_upgrade_nudge: shouldNudgeUpgrade,
    should_show_topup_offer: false,
    nudge_type: shouldNudgeUpgrade ? "frequent_topups" : undefined,
  };
}

// ============================================================================
// Run recording
// ============================================================================

/**
 * Record a run. Call AFTER the pipeline starts (not after it completes).
 * Consumes base runs first, then top-up runs.
 * Returns the updated state + what changed.
 */
export function recordRun(rawState: UsageState): { state: UsageState; result: RunRecordResult } {
  const state = applyDailyReset(rawState);
  const plan = PLANS[state.plan_id];

  const baseRemaining = Math.max(0, plan.daily_run_limit - state.runs_used_today);

  let newState: UsageState;
  let usedTopup = false;

  if (baseRemaining > 0) {
    // Consume from base allocation
    newState = {
      ...state,
      runs_used_today: state.runs_used_today + 1,
    };
  } else {
    // Consume from top-up allocation
    usedTopup = true;
    newState = {
      ...state,
      topup_runs_used_today: state.topup_runs_used_today + 1,
    };
  }

  const newBaseRemaining = Math.max(0, plan.daily_run_limit - newState.runs_used_today);
  const newTopupRemaining = Math.max(0, newState.topup_runs_available - newState.topup_runs_used_today);

  return {
    state: newState,
    result: {
      runs_used_today: newState.runs_used_today + newState.topup_runs_used_today,
      runs_remaining: newBaseRemaining + newTopupRemaining,
      used_topup: usedTopup,
    },
  };
}

// ============================================================================
// Cap hit recording
// ============================================================================

/**
 * Record that the daily cap was hit. Call when checkUsage returns allowed: false with daily_cap.
 */
export function recordCapHit(state: UsageState): UsageState {
  return {
    ...state,
    cap_hits_this_period: state.cap_hits_this_period + 1,
  };
}

// ============================================================================
// Top-up application
// ============================================================================

/**
 * Apply a top-up purchase. Adds runs to today's top-up capacity.
 * Top-ups are same-day only — they expire at next daily reset.
 *
 * TODO: Integrate with payment confirmation before calling this.
 */
export function applyTopUp(
  rawState: UsageState,
  topupRuns: number,
): UsageState {
  const state = applyDailyReset(rawState);

  return {
    ...state,
    topup_runs_available: state.topup_runs_available + topupRuns,
    topup_purchases_this_period: state.topup_purchases_this_period + 1,
  };
}

// ============================================================================
// Plan upgrade
// ============================================================================

/**
 * Upgrade to a new plan. Resets period tracking.
 * Does NOT reset today's usage — the new limit takes effect immediately
 * but already-used runs still count.
 *
 * TODO: Integrate with payment confirmation before calling this.
 */
export function upgradePlan(rawState: UsageState, newPlanId: PlanId): UsageState {
  const state = applyDailyReset(rawState);

  return {
    ...state,
    plan_id: newPlanId,
    trial_started_at: null,
    cap_hits_this_period: 0,
    topup_purchases_this_period: 0,
    period_started_at: new Date().toISOString(),
  };
}
