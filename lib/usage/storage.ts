// ============================================================================
// Virlo Usage State — localStorage Persistence (MVP)
// ============================================================================
// When auth ships, replace this with server-side storage.
// The engine module (engine.ts) stays the same either way.
// ============================================================================

import type { UsageState } from "./types";
import { createInitialUsageState, applyDailyReset } from "./engine";

const STORAGE_KEY = "virlo_usage_v1";

/**
 * Load usage state from localStorage.
 * If no state exists, initializes a new trial automatically.
 * Always applies daily reset before returning.
 */
export function loadUsageState(): UsageState {
  if (typeof window === "undefined") {
    return applyDailyReset(createInitialUsageState());
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialUsageState();
      saveUsageState(initial);
      return initial;
    }

    const parsed = JSON.parse(raw) as UsageState;

    // Validate shape — if corrupted, re-initialize
    if (!parsed.plan_id || !parsed.current_day) {
      const initial = createInitialUsageState();
      saveUsageState(initial);
      return initial;
    }

    // Apply daily reset (resets counters if day changed)
    const resetState = applyDailyReset(parsed);

    // Persist if reset happened
    if (resetState !== parsed) {
      saveUsageState(resetState);
    }

    return resetState;
  } catch {
    const initial = createInitialUsageState();
    saveUsageState(initial);
    return initial;
  }
}

/**
 * Save usage state to localStorage.
 */
export function saveUsageState(state: UsageState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or blocked — fail silently in MVP
  }
}
