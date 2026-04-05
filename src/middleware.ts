import { defineMiddleware } from 'astro:middleware'
import { getSecurityHeaders } from '@/utils/headers.server'

const SESHAT_PREFIX = '/api/seshat'

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

  return response
})
