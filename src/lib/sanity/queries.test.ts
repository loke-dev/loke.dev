import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ALL_AUTHORS_QUERY,
  ALL_TOPICS_QUERY,
  AUTHOR_BY_SLUG_QUERY,
  POST_BY_SLUG_QUERY,
  POST_COUNT_QUERY,
  POST_LIST_QUERY,
  POST_NEXT_QUERY,
  POST_PAGINATED_QUERY,
  POST_PREV_QUERY,
  POSTS_BY_AUTHOR_SLUG_QUERY,
  POSTS_BY_TOPIC_SLUG_QUERY,
  PROJECTS_QUERY,
  RELATED_POSTS_QUERY,
  SEARCH_POSTS_QUERY,
  TOPIC_BY_SLUG_QUERY,
} from './queries.ts'

const publicPostQueries = [
  POST_BY_SLUG_QUERY,
  POST_COUNT_QUERY,
  POST_LIST_QUERY,
  POST_NEXT_QUERY,
  POST_PAGINATED_QUERY,
  POST_PREV_QUERY,
  POSTS_BY_AUTHOR_SLUG_QUERY,
  POSTS_BY_TOPIC_SLUG_QUERY,
  RELATED_POSTS_QUERY,
  SEARCH_POSTS_QUERY,
]

const publicDocumentQueries = [
  ALL_AUTHORS_QUERY,
  ALL_TOPICS_QUERY,
  AUTHOR_BY_SLUG_QUERY,
  PROJECTS_QUERY,
  TOPIC_BY_SLUG_QUERY,
]

test('all public post queries exclude Sanity drafts', () => {
  for (const query of publicPostQueries) {
    assert.match(query, /!\(_id in path\("drafts\.\*\*"\)\)/)
  }
})

test('public document queries exclude Sanity drafts', () => {
  for (const query of publicDocumentQueries) {
    assert.match(query, /!\(_id in path\("drafts\.\*\*"\)\)/)
  }
})
