// ============================================================================
// Virlo — Lightweight In-Memory Rate Limiter (Pre-Auth MVP)
// ============================================================================
// Simple IP-based rate limiting for expensive API routes.
// No Redis, no database, no external dependencies.
// Resets on server restart. Acceptable for MVP/dev stage.
//
// When auth ships, replace with per-user quota enforcement.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";

type RateLimitConfig = {
  /** Max requests per window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Human-readable name for logging */
  routeName: string;
};

type ClientRecord = {
  count: number;
  windowStart: number;
};

// In-memory store keyed by "routeName:ip"
const store = new Map<string, ClientRecord>();

// Periodic cleanup to prevent memory leak on long-running servers
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of store.entries()) {
    if (now - record.windowStart > windowMs * 2) {
      store.delete(key);
    }
  }
}

/**
 * Extract client IP from request.
 * Uses x-forwarded-for in production (behind proxy/Vercel), falls back to a default.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

/**
 * Check rate limit for a request. Returns null if allowed, or a Response if blocked.
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
): NextResponse | null {
  const ip = getClientIp(request);
  const key = `${config.routeName}:${ip}`;
  const now = Date.now();

  cleanup(config.windowMs);

  const record = store.get(key);

  if (!record || now - record.windowStart > config.windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now });
    return null; // Allowed
  }

  if (record.count >= config.limit) {
    // Blocked
    console.log(
      `[RateLimit] BLOCKED ${config.routeName} | ip=${ip} | count=${record.count}/${config.limit} | window=${Math.round((now - record.windowStart) / 1000)}s`,
    );

    return NextResponse.json(
      { error: "You've reached the current usage limit. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((config.windowMs - (now - record.windowStart)) / 1000)),
        },
      },
    );
  }

  // Allowed — increment
  record.count++;
  return null;
}

// ============================================================================
// Pre-configured limiters for Virlo routes
// ============================================================================

const isDev = process.env.NODE_ENV === "development";

/** /api/generate — most expensive route (~$0.14/call) */
export const GENERATE_LIMIT: RateLimitConfig = {
  limit: isDev ? 30 : 15,
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  routeName: "/api/generate",
};

/** /api/generate — burst protection */
export const GENERATE_BURST_LIMIT: RateLimitConfig = {
  limit: isDev ? 5 : 3,
  windowMs: 60 * 1000, // 1 minute
  routeName: "/api/generate:burst",
};

/** /api/extract — moderate cost (Claude call + HTTP fetch) */
export const EXTRACT_LIMIT: RateLimitConfig = {
  limit: isDev ? 60 : 30,
  windowMs: 24 * 60 * 60 * 1000,
  routeName: "/api/extract",
};

/** /api/classify — low cost but still a Claude call */
export const CLASSIFY_LIMIT: RateLimitConfig = {
  limit: isDev ? 60 : 30,
  windowMs: 24 * 60 * 60 * 1000,
  routeName: "/api/classify",
};
