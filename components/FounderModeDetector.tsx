"use client";

import { useEffect } from "react";
import { detectAndActivateFounderMode } from "@/lib/usage/founderMode";

/**
 * Founder mode detector — runs on EVERY page of the app via root layout.
 *
 * Checks URL for ?founder=virlo-calibration on mount and sets a cookie
 * that persists founder access across all navigation types (hard links,
 * router.push, page reloads, tabs within same origin).
 *
 * Renders nothing. Has no effect on public users.
 */
export function FounderModeDetector() {
  useEffect(() => {
    detectAndActivateFounderMode();
  }, []);

  return null;
}
