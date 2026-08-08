interface RateBucket {
  count: number
  resetAt: number
}

export function createInMemoryRateLimiter(options: {
  windowMs: number
  maxRequests: number
  maxBuckets?: number
}): (key: string) => boolean {
  const buckets = new Map<string, RateBucket>()
  const maxBuckets = Math.max(1, options.maxBuckets ?? 10_000)
  let lastPrunedAt = 0

  function pruneExpiredBuckets(now: number): void {
    if (now - lastPrunedAt < options.windowMs) return

    lastPrunedAt = now
    for (const [key, bucket] of buckets) {
      if (now >= bucket.resetAt) buckets.delete(key)
    }
  }

  function evictOldestBucket(): void {
    if (buckets.size < maxBuckets) return

    const oldest = [...buckets.entries()].reduce(
      (candidate, entry) =>
        !candidate || entry[1].resetAt < candidate[1].resetAt
          ? entry
          : candidate,
      null as [string, RateBucket] | null
    )
    if (oldest) buckets.delete(oldest[0])
  }

  return (key: string): boolean => {
    const now = Date.now()
    pruneExpiredBuckets(now)
    const current = buckets.get(key)
    if (!current || now >= current.resetAt) {
      if (!current) evictOldestBucket()
      buckets.set(key, { count: 1, resetAt: now + options.windowMs })
      return true
    }
    if (current.count >= options.maxRequests) return false

    current.count += 1
    return true
  }
}
