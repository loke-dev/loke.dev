const MAX_ATTEMPTS = 3

export async function checkRateLimit() {
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - 1,
    resetTime: Date.now() + 15 * 60 * 1000,
  }
}

export function getRateLimitHeaders(rateLimit: {
  remaining: number
  resetTime: number
}) {
  return {
    'X-RateLimit-Limit': MAX_ATTEMPTS.toString(),
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
  }
}
