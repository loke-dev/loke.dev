import { defineMiddleware } from 'astro:middleware'
import { getSecurityHeaders } from '@/utils/headers.server'

const SESHAT_PREFIX = '/api/seshat'
const CACHEABLE_PATHS = /^\/(?:blog(?:\/|$)|sitemap\.xml$|rss\.xml$)/
const CACHE_EXPIRY_HEADER = 'X-Loke-Cache-Expires-At'

const SESHAT_EXACT_ALLOWED_ORIGINS = new Set([
  'https://loke-dev.sanity.studio',
  'https://loke.dev',
  'https://www.loke.dev',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3333',
  'http://127.0.0.1:3333',
])

const SANITY_HOSTED_STUDIO_ORIGINS = new Set(['www.sanity.io'])

function isSeshatAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false
  if (SESHAT_EXACT_ALLOWED_ORIGINS.has(origin)) return true

  try {
    const { protocol, hostname } = new URL(origin)
    if (
      protocol === 'https:' &&
      (hostname.endsWith('.sanity.studio') ||
        SANITY_HOSTED_STUDIO_ORIGINS.has(hostname))
    ) {
      return true
    }
  } catch {
    return false
  }

  return false
}

function seshatOptionsHeaders(origin: string, requestHeaders: string | null) {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', origin)
  headers.set('Vary', 'Origin')
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', requestHeaders || 'Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  return headers
}

function mergeSeshatCors(
  response: Response,
  origin: string | null,
  requestHeaders: string | null
) {
  if (isSeshatAllowedOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Vary', 'Origin')
  }
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    requestHeaders || 'Content-Type'
  )
}

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

  if (pathname.startsWith(SESHAT_PREFIX) && request.method === 'OPTIONS') {
    const origin = request.headers.get('Origin')
    if (!isSeshatAllowedOrigin(origin)) {
      return new Response(null, { status: 403 })
    }

    const requestHeaders = request.headers.get('Access-Control-Request-Headers')

    return new Response(null, {
      status: 204,
      headers: seshatOptionsHeaders(origin, requestHeaders),
    })
  }

  const cacheable = isCacheableRequest(request, pathname)
  const cache =
    cacheable && typeof caches !== 'undefined'
      ? (caches as CacheStorage & { default: Cache }).default
      : undefined
  const cacheKey = cache
    ? new Request(url.toString(), { method: 'GET' })
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

  if (pathname.startsWith(SESHAT_PREFIX)) {
    const origin = request.headers.get('Origin')
    const requestHeaders = request.headers.get('Access-Control-Request-Headers')
    mergeSeshatCors(response, origin, requestHeaders)
  }

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
