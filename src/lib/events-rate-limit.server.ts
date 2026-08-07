import { createInMemoryRateLimiter } from '@/lib/rate-limit.server'

export const checkEventRateLimit = createInMemoryRateLimiter({
  windowMs: 60_000,
  maxRequests: 120,
})
