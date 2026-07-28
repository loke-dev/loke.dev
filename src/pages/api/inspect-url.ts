import type { APIRoute } from 'astro'
import { InspectionError, inspectPublicUrl } from '@/lib/url-inspection.server'

export const prerender = false

interface RateBucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateBucket>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 12

function withinRateLimit(ip: string): boolean {
  const now = Date.now()
  const current = buckets.get(ip)
  if (!current || now > current.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (current.count >= MAX_REQUESTS) return false
  current.count += 1
  return true
}

export const GET: APIRoute = async ({ url, clientAddress }) => {
  if (!withinRateLimit(clientAddress ?? 'unknown')) {
    return Response.json(
      { error: 'Too many inspections. Try again in a minute.' },
      { status: 429 }
    )
  }

  const target = url.searchParams.get('url') ?? ''
  try {
    return Response.json(await inspectPublicUrl(target), {
      headers: { 'Cache-Control': 'private, max-age=60' },
    })
  } catch (error) {
    const inspectionError = error instanceof InspectionError ? error : undefined
    return Response.json(
      { error: inspectionError?.message ?? 'Inspection failed.' },
      { status: inspectionError?.status ?? 500 }
    )
  }
}
