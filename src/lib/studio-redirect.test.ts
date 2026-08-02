import assert from 'node:assert/strict'
import test from 'node:test'
import { getStudioRedirect } from './studio-redirect.ts'

test('redirects the Studio root to Sanity Studio', () => {
  const response = getStudioRedirect(new Request('https://loke.dev/studio'))

  assert.equal(response?.status, 302)
  assert.equal(
    response?.headers.get('location'),
    'https://loke-dev.sanity.studio/'
  )
})

test('preserves Studio paths and query parameters', () => {
  const response = getStudioRedirect(
    new Request('https://loke.dev/studio/structure/post?intent=edit&id=post-1')
  )

  assert.equal(response?.status, 302)
  assert.equal(
    response?.headers.get('location'),
    'https://loke-dev.sanity.studio/structure/post?intent=edit&id=post-1'
  )
})

test('leaves non-Studio paths to the Astro handler', () => {
  assert.equal(
    getStudioRedirect(new Request('https://loke.dev/projects')),
    null
  )
})
