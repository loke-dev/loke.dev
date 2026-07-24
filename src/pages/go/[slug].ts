import type { APIRoute } from 'astro'
import { getPartner } from '@/data/partners'

export const prerender = false

function cleanDimension(value: string | null, fallback: string): string {
  if (!value) return fallback
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, '')
    .slice(0, 96)
  return cleaned || fallback
}

function getReferrerPath(request: Request): string {
  const referrer = request.headers.get('referer')
  if (!referrer) return 'none'

  try {
    const referrerUrl = new URL(referrer)
    const requestUrl = new URL(request.url)
    if (
      referrerUrl.hostname !== requestUrl.hostname &&
      referrerUrl.hostname !== 'loke.dev'
    ) {
      return 'external'
    }
    return cleanDimension(referrerUrl.pathname, 'unknown')
  } catch {
    return 'invalid'
  }
}

export const GET: APIRoute = ({ params, request }) => {
  const partner = getPartner(params.slug ?? '')
  if (!partner) {
    return new Response('Unknown partner', {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  const url = new URL(request.url)
  const source = cleanDimension(url.searchParams.get('from'), 'unknown')

  console.info(
    JSON.stringify({
      event: 'outbound_partner_click',
      partner: partner.slug,
      source,
      referrerPath: getReferrerPath(request),
      relationship: partner.affiliate ? 'affiliate' : 'direct',
    })
  )

  return new Response(null, {
    status: 302,
    headers: {
      Location: partner.destination,
      'Cache-Control': 'private, no-store',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
