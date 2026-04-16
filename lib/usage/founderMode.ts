// ============================================================================
// Virlo Founder Mode — Centralized founder-access detection + persistence
// ============================================================================
// Single source of truth for founder testing access. Used by:
// - FounderModeDetector (root layout component that captures URL param)
// - useUsage hook (paywall gating + display)
// - analyze/page.tsx handleConfirm (belt-and-suspenders gate check)
//
// Uses a cookie (not sessionStorage) for maximum persistence across:
// - Hard navigations (<a href>)
// - Client-side navigations (router.push)
// - Page reloads
// - Any tab within the same origin
// - iOS Safari privacy modes where sessionStorage can be wiped
// ============================================================================

export const FOUNDER_KEY = "virlo-calibration";
export const FOUNDER_COOKIE_NAME = "virlo_founder";
const FOUNDER_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Build-time env var (local .env.local testing)
const IS_FOUNDER_TESTING_ENV = process.env.NEXT_PUBLIC_FOUNDER_TESTING === "true";

/**
 * Read founder mode from any available source.
 * Priority: env var > URL param > cookie.
 * Returns true if ANY source indicates founder mode.
 */
export function isFounderMode(): boolean {
  if (IS_FOUNDER_TESTING_ENV) return true;
  if (typeof window === "undefined") return false;

  // 1. Check URL param — highest trust, always accurate if present
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("founder") === FOUNDER_KEY) return true;
  } catch { /* continue to cookie */ }

  // 2. Check cookie — persists across all navigation types
  try {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === FOUNDER_COOKIE_NAME && value === "1") return true;
    }
  } catch { /* fall through */ }

  return false;
}

/**
 * Activate founder mode by setting the cookie. Called when a valid
 * URL param is detected. Idempotent — safe to call multiple times.
 */
export function activateFounderMode(): void {
  if (typeof document === "undefined") return;
  try {
    // Set cookie with 7-day expiration, path=/, SameSite=Lax for safe cross-page behavior
    document.cookie = `${FOUNDER_COOKIE_NAME}=1; path=/; max-age=${FOUNDER_COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch { /* silently fail — cookies blocked or unavailable */ }
}

/**
 * Check URL and activate founder mode if param is present.
 * Called by FounderModeDetector on every page mount.
 */
export function detectAndActivateFounderMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("founder") === FOUNDER_KEY) {
      activateFounderMode();
      return true;
    }
  } catch { /* silently fail */ }
  return false;
}
