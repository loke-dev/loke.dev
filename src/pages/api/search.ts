import type { APIRoute } from 'astro'
import { runSearch } from '@/lib/sanity/search.server'
import { checkSearchRateLimit } from '@/lib/search-rate-limit.server'

export const prerender = false

export const GET: APIRoute = async ({ url, clientAddress }) => {
  const ip = clientAddress ?? 'unknown'
  if (!checkSearchRateLimit(ip)) {
    return Response.json(
      { error: 'Too many search requests. Try again in a minute.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const q = url.searchParams.get('q') ?? ''

  const result = await runSearch(q)
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status })
  }

  return Response.json(result.data, {
    headers: {
      'Cache-Control': 'private, max-age=60',
    },
  })
}
