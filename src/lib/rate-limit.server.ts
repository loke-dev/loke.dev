interface RateBucket {
  count: number
  resetAt: number
}

export function createInMemoryRateLimiter(options: {
  windowMs: number
  maxRequests: number
}): (key: string) => boolean {
  const buckets = new Map<string, RateBucket>()

  return (key: string): boolean => {
    const now = Date.now()
    const current = buckets.get(key)
    if (!current || now > current.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs })
      return true
    }
    if (current.count >= options.maxRequests) return false

    current.count += 1
    return true
  }
}
