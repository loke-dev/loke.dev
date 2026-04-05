import { defineMiddleware } from 'astro:middleware'
import { getSecurityHeaders } from '@/utils/headers.server'

const SESHAT_PREFIX = '/api/seshat'

const SESHAT_ALLOWED_ORIGINS = new Set([
  'https://loke-dev.sanity.studio',
  'https://loke.dev',
  'https://www.loke.dev',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3333',
  'http://127.0.0.1:3333',
])

function seshatOptionsHeaders(origin: string) {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', origin)
  headers.set('Vary', 'Origin')
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  return headers
}

function mergeSeshatCors(response: Response, origin: string | null) {
  if (origin && SESHAT_ALLOWED_ORIGINS.has(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Vary', 'Origin')
  }
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context
  const pathname = url.pathname

  if (pathname.startsWith(SESHAT_PREFIX) && request.method === 'OPTIONS') {
    const origin = request.headers.get('Origin')
    if (!origin || !SESHAT_ALLOWED_ORIGINS.has(origin)) {
      return new Response(null, { status: 403 })
    }
    return new Response(null, {
      status: 204,
      headers: seshatOptionsHeaders(origin),
    })
  }

  const response = await next()

  if (pathname.startsWith(SESHAT_PREFIX)) {
    const origin = request.headers.get('Origin')
    mergeSeshatCors(response, origin)
  }

  const securityHeaders = getSecurityHeaders()
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }
  return response
})
