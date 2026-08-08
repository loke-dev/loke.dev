import assert from 'node:assert/strict'
import test from 'node:test'
import { safeLinkHref } from './safe-link.ts'

test('keeps relative and supported CMS links', () => {
  assert.equal(safeLinkHref('/blog/example'), '/blog/example')
  assert.equal(safeLinkHref('#details'), '#details')
  assert.equal(
    safeLinkHref('mailto:hello@example.com'),
    'mailto:hello@example.com'
  )
  assert.equal(
    safeLinkHref(' https://example.com/docs '),
    'https://example.com/docs'
  )
})

test('replaces unsafe CMS protocols with a harmless anchor', () => {
  assert.equal(safeLinkHref('javascript:alert(1)'), '#')
  assert.equal(safeLinkHref('java\nscript:alert(1)'), '#')
  assert.equal(safeLinkHref('data:text/html,unsafe'), '#')
  assert.equal(safeLinkHref(null), '#')
})
