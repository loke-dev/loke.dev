import { defineMiddleware } from 'astro:middleware'
import { getSecurityHeaders } from '@/utils/headers.server'
import { getPreviewPerspective } from '@/lib/sanity/draft-mode'

const CACHEABLE_PATHS =
  /^\/(?:blog(?:\/|$)|guides(?:\/|$)|topics(?:\/|$)|authors(?:\/|$)|sitemap\.xml$|rss\.xml$)/
const CANONICAL_NO_SLASH_PATHS =
  /^\/(?:about|affiliate-disclosure|apps|authors|blog|brand|changelog|contact|guides|now|privacy|projects|services|tools|topics)(?:\/[^?]*)?\/$/
const CACHE_EXPIRY_HEADER = 'X-Loke-Cache-Expires-At'
const WORKER_VERSION_HEADER = 'X-Loke-Worker-Version'
const ERROR_CACHE_CONTROL =
  'public, max-age=0, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400'

function isApiPath(pathname: string): boolean {
  return pathname === '/api' || pathname.startsWith('/api/')
}

function getContentCacheVersion(request: Request): string {
  return request.headers.get(WORKER_VERSION_HEADER) ?? 'local'
}

function isCacheableRequest(request: Request, pathname: string): boolean {
  return request.method === 'GET' && CACHEABLE_PATHS.test(pathname)
}

function isStudioPreviewRequest(request: Request): boolean {
  return getPreviewPerspective(request) !== null
}

function getCanonicalPathRedirect(url: URL): URL | null {
  if (!CANONICAL_NO_SLASH_PATHS.test(url.pathname)) return null

  const canonicalUrl = new URL(url)
  canonicalUrl.pathname = canonicalUrl.pathname.slice(0, -1)
  return canonicalUrl
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

  const canonicalRedirect = getCanonicalPathRedirect(url)
  if (canonicalRedirect) {
    return Response.redirect(canonicalRedirect, 308)
  }

  const previewRequest =
    !context.isPrerendered && isStudioPreviewRequest(request)
  const cacheable = !previewRequest && isCacheableRequest(request, pathname)
  const cache =
    cacheable && typeof caches !== 'undefined'
      ? (caches as CacheStorage & { default: Cache }).default
      : undefined
  const cacheKey = cache
    ? (() => {
        const cacheUrl = new URL(url)
        cacheUrl.search = ''
        cacheUrl.searchParams.set(
          '__content_cache',
          getContentCacheVersion(request)
        )
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

  const securityHeaders = getSecurityHeaders({
    allowStudioFrame: !context.isPrerendered && previewRequest,
  })
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }
  if (isApiPath(pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  if (response.status === 404 || response.status === 410) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    if (
      !response.headers.has('Cache-Control') &&
      !isApiPath(pathname) &&
      !pathname.startsWith('/go/')
    ) {
      response.headers.set('Cache-Control', ERROR_CACHE_CONTROL)
    }
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
