import { defineMiddleware } from 'astro:middleware'
import { getSecurityHeaders } from '@/utils/headers.server'

const CACHEABLE_PATHS = /^\/(?:blog(?:\/|$)|sitemap\.xml$|rss\.xml$)/
const CACHE_EXPIRY_HEADER = 'X-Loke-Cache-Expires-At'
const CONTENT_CACHE_VERSION = '2026-07-17-projects-template-shelf-v5'

function isCacheableRequest(request: Request, pathname: string): boolean {
  return request.method === 'GET' && CACHEABLE_PATHS.test(pathname)
}

function getSharedCacheTtlMilliseconds(cacheControl: string): number | null {
  const match = /(?:^|,)\s*s-maxage=(\d+)/i.exec(cacheControl)
  if (!match) return null

  return Number(match[1]) * 1000
}

function toMutableResponse(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.delete(CACHE_EXPIRY_HEADER)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context
  const pathname = url.pathname

  const cacheable = isCacheableRequest(request, pathname)
  const cache =
    cacheable && typeof caches !== 'undefined'
      ? (caches as CacheStorage & { default: Cache }).default
      : undefined
  const cacheKey = cache
    ? (() => {
        const cacheUrl = new URL(url)
        cacheUrl.searchParams.set('__content_cache', CONTENT_CACHE_VERSION)
        return new Request(cacheUrl.toString(), { method: 'GET' })
      })()
    : undefined
  if (cache && cacheKey) {
    const cached = await cache.match(cacheKey)
    if (cached) {
      const expiresAt = Number(cached.headers.get(CACHE_EXPIRY_HEADER))
      if (Number.isFinite(expiresAt) && expiresAt > Date.now()) {
        // Cache API responses expose immutable headers. Astro finalizes every
        // response by adding headers, so return a mutable equivalent instead.
        return toMutableResponse(cached)
      }

      // Entries from before explicit expiry tracking are also treated as stale.
      await cache.delete(cacheKey)
    }
  }

  const response = await next()

  const securityHeaders = getSecurityHeaders()
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  if (cache && cacheKey && response.status === 200) {
    const ttl = getSharedCacheTtlMilliseconds(
      response.headers.get('Cache-Control') ?? ''
    )
    if (ttl) {
      const responseForCache = response.clone()
      responseForCache.headers.set(
        CACHE_EXPIRY_HEADER,
        String(Date.now() + ttl)
      )
      await cache.put(cacheKey, responseForCache)
    }
  }

  return response
})
