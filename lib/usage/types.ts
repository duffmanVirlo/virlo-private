// ============================================================================
// Virlo Usage Model Types v1
// ============================================================================

import type { PlanId } from "./plans";

/**
 * A user's current usage state.
 * In MVP (no auth), this lives in localStorage.
 * With auth, this moves to server-side storage.
 */
export type UsageState = {
  /** Current plan */
  plan_id: PlanId;

  /** ISO date string when the trial started (null if not on trial) */
  trial_started_at: string | null;

  /** ISO date string of the current usage day (YYYY-MM-DD in user's local timezone) */
  current_day: string;

  /** Number of runs used today (base allocation) */
  runs_used_today: number;

  /** Number of top-up runs available today (resets daily, same-day only) */
  topup_runs_available: number;

  /** Number of top-up runs used today */
  topup_runs_used_today: number;

  /** Rolling count of days where daily cap was hit (resets monthly) */
  cap_hits_this_period: number;

  /** Rolling count of top-up purchases this period (resets monthly) */
  topup_purchases_this_period: number;

  /** ISO date string of period start for cap/topup tracking */
  period_started_at: string;
};

/**
 * Result of a usage check before a run.
 */
export type UsageCheckResult = {
  allowed: boolean;
  reason?: "ok" | "daily_cap" | "trial_expired" | "trial_cap";
  runs_remaining: number;
  topup_runs_remaining: number;
  plan_id: PlanId;
  should_show_upgrade_nudge: boolean;
  should_show_topup_offer: boolean;
  nudge_type?: "cap_hit" | "trial_expiring" | "frequent_topups" | "trial_ended";
};

/**
 * What changed after recording a run.
 */
export type RunRecordResult = {
  runs_used_today: number;
  runs_remaining: number;
  used_topup: boolean;
};
