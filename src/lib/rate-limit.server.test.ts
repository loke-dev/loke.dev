import assert from 'node:assert/strict'
import test from 'node:test'
import { createInMemoryRateLimiter } from './rate-limit.server.ts'

test('allows requests up to the configured limit', () => {
  const checkRateLimit = createInMemoryRateLimiter({
    windowMs: 60_000,
    maxRequests: 2,
  })

  assert.equal(checkRateLimit('client'), true)
  assert.equal(checkRateLimit('client'), true)
  assert.equal(checkRateLimit('client'), false)
  assert.equal(checkRateLimit('other-client'), true)
})

test('evicts the oldest client when the bucket limit is reached', () => {
  const checkRateLimit = createInMemoryRateLimiter({
    windowMs: 60_000,
    maxRequests: 1,
    maxBuckets: 2,
  })

  assert.equal(checkRateLimit('first'), true)
  assert.equal(checkRateLimit('second'), true)
  assert.equal(checkRateLimit('third'), true)
  assert.equal(checkRateLimit('first'), true)
})
