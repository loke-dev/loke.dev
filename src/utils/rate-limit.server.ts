import { getSession } from './session.server'

interface RateLimitData {
  count: number
  resetTime: number
}

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 3

export async function checkRateLimit(
  request: Request,
  identifier: string = 'contact-form'
) {
  const session = await getSession(request)
  const now = Date.now()

  const rateLimitKey = `rate-limit-${identifier}`
  const rateLimitData = session.get(rateLimitKey) as RateLimitData | undefined

  if (!rateLimitData || now > rateLimitData.resetTime) {
    // Reset or initialize rate limit
    const newData: RateLimitData = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    }
    session.set(rateLimitKey, newData)
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS - 1,
      resetTime: newData.resetTime,
    }
  }

  if (rateLimitData.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: rateLimitData.resetTime,
      error: `Too many attempts. Please try again in ${Math.ceil((rateLimitData.resetTime - now) / 60000)} minutes.`,
    }
  }

  // Increment count
  rateLimitData.count++
  session.set(rateLimitKey, rateLimitData)

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - rateLimitData.count,
    resetTime: rateLimitData.resetTime,
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
