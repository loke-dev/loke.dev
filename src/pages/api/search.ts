import type { APIRoute } from 'astro'
import { normalizeSearchQuery } from '@/lib/sanity/search'
import { runSearch } from '@/lib/sanity/search.server'
import { checkSearchRateLimit } from '@/lib/search-rate-limit.server'

export const prerender = false

const PRIVATE_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow',
}
const NO_STORE_HEADERS = {
  ...PRIVATE_HEADERS,
  'Cache-Control': 'private, no-store',
}

export const GET: APIRoute = async ({ url, clientAddress }) => {
  const q = url.searchParams.get('q') ?? ''
  if (!normalizeSearchQuery(q)) {
    return Response.json(
      { error: 'Query must be between 2 and 100 characters.' },
      { status: 400, headers: NO_STORE_HEADERS }
    )
  }

  const ip = clientAddress ?? 'unknown'
  if (!checkSearchRateLimit(ip)) {
    return Response.json(
      { error: 'Too many search requests. Try again in a minute.' },
      {
        status: 429,
        headers: { ...NO_STORE_HEADERS, 'Retry-After': '60' },
      }
    )
  }

  const result = await runSearch(q)
  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.status, headers: NO_STORE_HEADERS }
    )
  }

  return Response.json(result.data, {
    headers: {
      ...PRIVATE_HEADERS,
      'Cache-Control': 'private, max-age=60',
    },
  })
}
