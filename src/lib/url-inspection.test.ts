import assert from 'node:assert/strict'
import test from 'node:test'
import { InspectionError, validateUrl } from './url-inspection.server.ts'

test('accepts public HTTP and HTTPS URLs', () => {
  assert.equal(
    validateUrl('https://example.com/path?value=1').href,
    'https://example.com/path?value=1'
  )
  assert.equal(validateUrl('http://example.com').href, 'http://example.com/')
})

test('rejects credential-bearing inspection URLs', () => {
  assert.throws(
    () => validateUrl('https://user:password@example.com'),
    (error: unknown) =>
      error instanceof InspectionError &&
      error.message === 'URLs with credentials cannot be inspected.'
  )
})

test('rejects local and private inspection URLs', () => {
  for (const value of [
    'http://localhost',
    'http://127.0.0.1',
    'http://192.168.1.1',
    'http://192.0.2.1',
    'http://198.51.100.1',
    'http://203.0.113.1',
    'http://255.255.255.255',
    'http://[::1]',
    'http://[2001:db8::1]',
    'http://[ff02::1]',
  ]) {
    assert.throws(
      () => validateUrl(value),
      (error: unknown) =>
        error instanceof InspectionError &&
        error.message === 'Private and local network addresses are not allowed.'
    )
  }
})
