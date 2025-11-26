import { auth } from "@/src/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { checkRateLimit, getRateLimitKey } from "@/src/lib/rate-limit";

const { GET: originalGET, POST: originalPOST } = toNextJsHandler(auth);

// Wrap handlers with rate limiting
export async function GET(request: Request) {
  const key = getRateLimitKey(request);
  if (!checkRateLimit(key)) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  return originalGET(request);
}

export async function POST(request: Request) {
  const key = getRateLimitKey(request);
  if (!checkRateLimit(key)) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  return originalPOST(request);
}
