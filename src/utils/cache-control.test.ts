import assert from 'node:assert/strict'
import test from 'node:test'
import { CACHE_CONTROL } from './cache-control.ts'

test('CMS-driven feed and blog responses revalidate in browsers', () => {
  for (const policy of [
    CACHE_CONTROL.blogIndex,
    CACHE_CONTROL.blogPost,
    CACHE_CONTROL.xmlFeed,
  ]) {
    assert.match(policy, /\bmax-age=0\b/)
    assert.match(policy, /\bs-maxage=\d+\b/)
  }
})
