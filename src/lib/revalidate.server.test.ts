import assert from 'node:assert/strict'
import test from 'node:test'
import {
  collectPaths,
  purgeCloudflareCache,
  triggerSiteDeploy,
} from './revalidate.server.ts'

test('returns a safe deploy fallback when GitHub cannot be reached', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  globalThis.fetch = async () => {
    throw new Error('GitHub is unavailable')
  }

  assert.deepEqual(
    await triggerSiteDeploy(['/blog'], { GITHUB_DEPLOY_TOKEN: 'test-token' }),
    {
      ok: false,
      skipped: false,
      status: 502,
      detail: 'Could not reach GitHub to trigger a deploy.',
    }
  )
})

test('returns a safe purge fallback when Cloudflare cannot be reached', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  globalThis.fetch = async () => {
    throw new Error('Cloudflare is unavailable')
  }

  const result = await purgeCloudflareCache(['https://loke.dev/blog'], {
    CLOUDFLARE_ZONE_ID: 'zone-id',
    CLOUDFLARE_API_TOKEN: 'test-token',
  })

  assert.equal(result.ok, false)
  assert.equal(result.status, 502)
  assert.deepEqual(result.result?.errors, [
    { message: 'Could not reach Cloudflare to purge the cache.' },
  ])
})

test('includes related author and topic pages for post webhooks', () => {
  assert.deepEqual(
    collectPaths({
      _type: 'post',
      slug: 'post-slug',
      authorSlug: { current: 'author-slug' },
      topicSlugs: ['astro', { current: 'cloudflare' }],
    }),
    [
      '/',
      '/blog',
      '/guides',
      '/topics',
      '/rss.xml',
      '/sitemap.xml',
      '/blog/post-slug',
      '/authors/author-slug',
      '/topics/astro',
      '/topics/cloudflare',
    ]
  )
})

test('ignores unsafe relationship slugs in post webhooks', () => {
  assert.deepEqual(
    collectPaths({
      _type: 'post',
      topicSlugs: ['../private', 'valid-topic'],
      authorSlug: 'author/other',
    }),
    [
      '/',
      '/blog',
      '/guides',
      '/topics',
      '/rss.xml',
      '/sitemap.xml',
      '/topics/valid-topic',
    ]
  )
})
