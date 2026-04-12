// ============================================================================
// Virlo Usage Module — Public API
// ============================================================================

export { PLANS, TOPUP_OPTIONS, NUDGE_RULES, ESTIMATED_API_COST_PER_RUN_CENTS } from "./plans";
export type { PlanId, PlanDefinition, TopUpOption } from "./plans";

export type { UsageState, UsageCheckResult, RunRecordResult } from "./types";

export {
  getTodayString,
  createInitialUsageState,
  applyDailyReset,
  isTrialExpired,
  getTrialDaysRemaining,
  checkUsage,
  recordRun,
  recordCapHit,
  applyTopUp,
  upgradePlan,
} from "./engine";

export { loadUsageState, saveUsageState } from "./storage";
export { useUsage } from "./hooks";
export type { UseUsageReturn } from "./hooks";
