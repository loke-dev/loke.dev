import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeSearchQuery, toSanityGlobPattern } from './search.ts'

test('normalizes search input and enforces the query length bounds', () => {
  assert.equal(normalizeSearchQuery('  astro  '), 'astro')
  assert.equal(normalizeSearchQuery('a'), null)
  assert.equal(normalizeSearchQuery('   '), null)
  assert.equal(normalizeSearchQuery('x'.repeat(101))?.length, 100)
})

test('escapes Sanity glob metacharacters before building a contains pattern', () => {
  assert.equal(
    toSanityGlobPattern('Docs * [draft]?'),
    '*docs \\* \\[draft\\]\\?*'
  )
})
