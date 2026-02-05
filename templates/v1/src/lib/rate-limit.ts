// Simple in-memory rate limiter
const requests: Map<string, { count: number; resetTime: number }> = new Map();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute

export function getRateLimitKey(req: Request): string {
  // Try to get IP from headers (works on Vercel and most platforms)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown';

  return ip;
}

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = requests.get(key);

  if (!record || now > record.resetTime) {
    // Create new record or reset existing one
    requests.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true; // Allow
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Deny
  }

  record.count++;
  return true; // Allow
}

// Cleanup old entries periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requests.entries()) {
    if (now > record.resetTime) {
      requests.delete(key);
    }
  }
}, 10 * 60 * 1000);
