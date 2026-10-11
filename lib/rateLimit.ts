import { NextRequest, NextResponse } from "next/server";

interface RateLimitTracker {
  timestamps: number[];
}

// In-memory IP tracking map per namespace
const rateLimitStores = new Map<string, Map<string, RateLimitTracker>>();

/**
 * Extracts client IP safely from request headers or falls back to '127.0.0.1'.
 */
export function getClientIp(req: Request | NextRequest): string {
  const forwarded = req.headers?.get?.("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers?.get?.("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

/**
 * Checks in-memory best-effort rate limit for a client IP.
 * @param namespace Unique route/action namespace (e.g. 'plan', 'speak', 'preferences')
 * @param ip Client IP address
 * @param maxRequests Maximum requests allowed within window (default 20)
 * @param windowMs Time window in milliseconds (default 60,000ms = 1 min)
 */
export function checkRateLimit(
  namespace: string,
  ip: string,
  maxRequests: number = 20,
  windowMs: number = 60 * 1000
): { allowed: boolean; retryAfterSeconds: number; remaining: number } {
  let store = rateLimitStores.get(namespace);
  if (!store) {
    store = new Map<string, RateLimitTracker>();
    rateLimitStores.set(namespace, store);
  }

  const now = Date.now();
  const tracker = store.get(ip) || { timestamps: [] };

  // Filter timestamps within current sliding window
  const activeTimestamps = tracker.timestamps.filter(ts => now - ts < windowMs);

  if (activeTimestamps.length >= maxRequests) {
    const oldest = activeTimestamps[0] || now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      retryAfterSeconds,
      remaining: 0
    };
  }

  activeTimestamps.push(now);
  store.set(ip, { timestamps: activeTimestamps });

  // Periodic pruning of stale IPs to prevent unbounded memory growth
  if (store.size > 2000) {
    for (const [key, val] of store.entries()) {
      if (val.timestamps.every(ts => now - ts >= windowMs)) {
        store.delete(key);
      }
    }
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(0, maxRequests - activeTimestamps.length)
  };
}

/**
 * Returns a friendly 429 response in both Hindi and English.
 */
export function createRateLimitResponse(retryAfterSeconds: number = 60): NextResponse {
  return NextResponse.json(
    {
      error: "RATE_LIMIT_EXCEEDED",
      message:
        "Too many requests. Please wait a minute before trying again. / बहुत अधिक अनुरोध। कृपया पुनः प्रयास करने से पहले एक मिनट प्रतीक्षा करें।",
      messageEn: "Too many requests. Please wait a minute before trying again.",
      messageHi: "बहुत अधिक अनुरोध। कृपया पुनः प्रयास करने से पहले एक मिनट प्रतीक्षा करें।",
      retryAfter: retryAfterSeconds
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store"
      }
    }
  );
}
