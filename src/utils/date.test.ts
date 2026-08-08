import assert from 'node:assert/strict'
import test from 'node:test'
import {
  latestDateOrNow,
  latestIsoDate,
  parseDate,
  toIsoDate,
  toRfc822Date,
} from './date.ts'
import { formatDate } from './format-date.ts'

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
  assert.equal(parseDate('2026-02-30'), null)
  assert.equal(toIsoDate(undefined), undefined)
  assert.equal(toRfc822Date(''), undefined)
})

test('finds the newest valid date while ignoring malformed values', () => {
  assert.equal(
    latestIsoDate(['2026-08-01', 'not-a-date', '2026-08-07T12:00:00Z']),
    '2026-08-07T12:00:00.000Z'
  )
  assert.equal(latestIsoDate([undefined, '']), undefined)
})

test('uses the current time when no valid date exists', () => {
  const before = Date.now()
  const result = latestDateOrNow(['not-a-date'])
  const after = Date.now()
  assert.ok(result.getTime() >= before && result.getTime() <= after)
})

test('uses readable fallback text for malformed display dates', () => {
  assert.equal(formatDate('not-a-date'), 'Date unavailable')
})
