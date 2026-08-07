import assert from 'node:assert/strict'
import test from 'node:test'
import { parseDate, toIsoDate, toRfc822Date } from './date.ts'

test('normalizes valid CMS dates', () => {
  assert.equal(toIsoDate('2026-08-07'), '2026-08-07T00:00:00.000Z')
  assert.equal(
    toRfc822Date('2026-08-07T12:30:00Z'),
    'Fri, 07 Aug 2026 12:30:00 GMT'
  )
  assert.ok(parseDate('2026-08-07') instanceof Date)
})

test('returns nullish values for malformed CMS dates', () => {
  assert.equal(parseDate('not-a-date'), null)
  assert.equal(toIsoDate(undefined), undefined)
  assert.equal(toRfc822Date(''), undefined)
})
