import type { APIRoute } from 'astro'
import { runSearch } from '@/lib/sanity/search.server'

interface RateBucket {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateBucket>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 40

function checkSearchRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_REQUESTS) {
    return false
  }
  entry.count++
  return true
}

export const GET: APIRoute = async ({ url, clientAddress }) => {
  const ip = clientAddress ?? 'unknown'
  if (!checkSearchRateLimit(ip)) {
    return Response.json(
      { error: 'Too many search requests. Try again in a minute.' },
      { status: 429 }
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
