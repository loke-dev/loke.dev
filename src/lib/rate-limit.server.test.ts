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
