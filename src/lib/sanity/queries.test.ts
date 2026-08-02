import assert from 'node:assert/strict'
import test from 'node:test'
import { POST_NEXT_QUERY, POST_PREV_QUERY } from './queries.ts'

test('adjacent post queries keep posts from the same day in order', () => {
  assert.match(POST_PREV_QUERY, /date == \$date && _createdAt < \$createdAt/)
  assert.match(POST_NEXT_QUERY, /date == \$date && _createdAt > \$createdAt/)
  assert.match(POST_PREV_QUERY, /order\(date desc, _createdAt desc\)/)
  assert.match(POST_NEXT_QUERY, /order\(date asc, _createdAt asc\)/)
})
