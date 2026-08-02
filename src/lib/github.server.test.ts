import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchRecentRepoCommits } from './github.server.ts'

test('maps valid GitHub commits and sets a request timeout', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  let signal: AbortSignal | undefined
  globalThis.fetch = async (_input, init) => {
    signal = init?.signal ?? undefined
    return new Response(
      JSON.stringify([
        {
          sha: 'abcdef1234567890',
          html_url:
            'https://github.com/loke-dev/loke.dev/commit/abcdef1234567890',
          commit: {
            message:
              'Add a safer changelog\n\nAvoid failed builds on GitHub outages.',
            author: { name: 'Loke', date: '2026-08-02T00:00:00.000Z' },
          },
        },
      ]),
      { status: 200 }
    )
  }

  const commits = await fetchRecentRepoCommits('loke-dev', 'loke.dev', 50)

  assert.equal(signal instanceof AbortSignal, true)
  assert.deepEqual(commits, [
    {
      sha: 'abcdef1',
      subject: 'Add a safer changelog',
      body: 'Avoid failed builds on GitHub outages.',
      authorName: 'Loke',
      committedAt: '2026-08-02T00:00:00.000Z',
      url: 'https://github.com/loke-dev/loke.dev/commit/abcdef1234567890',
    },
  ])
})

test('returns an empty changelog when GitHub cannot be reached', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  globalThis.fetch = async () => {
    throw new Error('GitHub is unavailable')
  }

  assert.deepEqual(await fetchRecentRepoCommits('loke-dev', 'loke.dev'), [])
})
