// ============================================================================
// Virlo Pricing Architecture v1 — Plan Definitions
// ============================================================================
// LOCKED BUSINESS MODEL. Changes here affect monetization directly.
// Do not modify without founder approval.
// ============================================================================

export type PlanId = "trial" | "core" | "pro";

export type PlanDefinition = {
  id: PlanId;
  name: string;
  display_name: string;
  price_monthly_cents: number;
  daily_run_limit: number;
  topups_enabled: boolean;
  trial_duration_days: number | null;
};

export const PLANS: Record<PlanId, PlanDefinition> = {
  trial: {
    id: "trial",
    name: "Free Trial",
    display_name: "Free Trial",
    price_monthly_cents: 0,
    daily_run_limit: 3,
    topups_enabled: false,
    trial_duration_days: 2,
  },
  core: {
    id: "core",
    name: "Virlo Core",
    display_name: "Core",
    price_monthly_cents: 3900,
    daily_run_limit: 3,
    topups_enabled: true,
    trial_duration_days: null,
  },
  pro: {
    id: "pro",
    name: "Virlo Pro",
    display_name: "Pro",
    price_monthly_cents: 7900,
    daily_run_limit: 8,
    topups_enabled: true,
    trial_duration_days: null,
  },
} as const;

// ============================================================================
// Top-Up Definitions
// ============================================================================

export type TopUpOption = {
  id: string;
  runs: number;
  price_cents: number;
  label: string;
};

export const TOPUP_OPTIONS: TopUpOption[] = [
  { id: "topup_1", runs: 1, price_cents: 200, label: "+1 Run — $2" },
  { id: "topup_3", runs: 3, price_cents: 500, label: "+3 Runs — $5" },
  // Future: { id: "topup_5", runs: 5, price_cents: 800, label: "+5 Runs — $8" },
];

// ============================================================================
// Cost-per-run reference (for internal margin tracking)
// ============================================================================

export const ESTIMATED_API_COST_PER_RUN_CENTS = 16; // ~$0.16 typical

// ============================================================================
// Upgrade nudge thresholds
// ============================================================================

export const NUDGE_RULES = {
  /** After this many cap-hits in a billing period, show upgrade nudge */
  cap_hits_before_upgrade_nudge: 3,
  /** After this many top-up purchases in a billing period, show upgrade nudge */
  topups_before_upgrade_nudge: 5,
  /** Trial: after hitting daily cap on both trial days, push hard upgrade */
  trial_both_days_capped: true,
} as const;
