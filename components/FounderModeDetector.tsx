"use client";

import { useEffect } from "react";

// Must match the key in lib/usage/hooks.ts
const FOUNDER_KEY = "virlo-calibration";
const FOUNDER_STORAGE_KEY = "virlo_founder_mode";

/**
 * Founder mode detector — runs on EVERY page of the app.
 *
 * The useUsage hook only runs on pages that render usage UI (/start, /analyze).
 * But testers typically land on the root page first. Without this detector,
 * the ?founder=virlo-calibration param on the landing page is lost before
 * useUsage gets a chance to read it.
 *
 * This component:
 * 1. Runs on every page via root layout
 * 2. Checks the URL on mount
 * 3. Persists founder mode to sessionStorage if the param is present
 * 4. Renders nothing
 *
 * useUsage then picks up the sessionStorage flag on downstream pages.
 */
export function FounderModeDetector() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("founder") === FOUNDER_KEY) {
        sessionStorage.setItem(FOUNDER_STORAGE_KEY, "true");
      }
    } catch {
      // sessionStorage unavailable (private browsing, etc.) — silently skip
    }
  }, []);

  return null;
}
