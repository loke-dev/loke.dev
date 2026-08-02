import type { APIRoute } from 'astro'
import { createInMemoryRateLimiter } from '@/lib/rate-limit.server'
import { InspectionError, inspectPublicUrl } from '@/lib/url-inspection.server'

export const prerender = false

const withinRateLimit = createInMemoryRateLimiter({
  windowMs: 60_000,
  maxRequests: 12,
})

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
