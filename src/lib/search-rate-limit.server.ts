import { createInMemoryRateLimiter } from '@/lib/rate-limit.server'

export const checkSearchRateLimit = createInMemoryRateLimiter({
  windowMs: 60_000,
  maxRequests: 40,
})
