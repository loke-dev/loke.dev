interface RateBucket {
  count: number
  resetAt: number
}

export function createInMemoryRateLimiter(options: {
  windowMs: number
  maxRequests: number
}): (key: string) => boolean {
  const buckets = new Map<string, RateBucket>()
  let lastPrunedAt = 0

  function pruneExpiredBuckets(now: number): void {
    if (now - lastPrunedAt < options.windowMs) return

    lastPrunedAt = now
    for (const [key, bucket] of buckets) {
      if (now >= bucket.resetAt) buckets.delete(key)
    }
  }

  return (key: string): boolean => {
    const now = Date.now()
    pruneExpiredBuckets(now)
    const current = buckets.get(key)
    if (!current || now >= current.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs })
      return true
    }
    if (current.count >= options.maxRequests) return false

    current.count += 1
    return true
  }
}
