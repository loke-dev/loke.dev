import type { APIRoute } from 'astro'
import { recordAnalyticsEvent } from '@/lib/analytics.server'

export const prerender = false

const MAX_BODY_BYTES = 4096

const SITE_BY_ORIGIN = new Map([
  ['https://loke.dev', 'loke.dev'],
  ['https://www.loke.dev', 'loke.dev'],
  ['https://gitdash.dev', 'gitdash.dev'],
  ['https://www.gitdash.dev', 'gitdash.dev'],
  ['https://shuffle.loke.dev', 'shuffle.loke.dev'],
  ['https://flarecheck.loke.dev', 'flarecheck.loke.dev'],
])

const ALLOWED_EVENTS = new Set([
  'affiliate_click_intent',
  'canvas_saved',
  'contact_submitted',
  'github_login_started',
  'install_command_copied',
  'marketplace_clicked',
  'outbound_click',
  'primary_cta_clicked',
  'repository_connected',
  'rules_viewed',
  'share_completed',
  'shuffle_completed',
  'tool_completed',
])

interface EventPayload {
  v: 1
  event: string
  path?: string
  placement?: string
  target?: string
  campaign?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parsePayload(raw: string): EventPayload | null {
  try {
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value) || value.v !== 1 || typeof value.event !== 'string') {
      return null
    }

    for (const field of ['path', 'placement', 'target', 'campaign']) {
      const fieldValue = value[field]
      if (fieldValue !== undefined && typeof fieldValue !== 'string')
        return null
    }

    return {
      v: 1,
      event: value.event,
      path: typeof value.path === 'string' ? value.path : undefined,
      placement:
        typeof value.placement === 'string' ? value.placement : undefined,
      target: typeof value.target === 'string' ? value.target : undefined,
      campaign: typeof value.campaign === 'string' ? value.campaign : undefined,
    }
  } catch {
    return null
  }
}

function cleanPath(value: string | undefined): string {
  if (!value?.startsWith('/')) return '/'

  const path = value.split(/[?#]/, 1)[0]
  const cleaned = path.replace(/[^a-zA-Z0-9/_-]/g, '').slice(0, 160)
  return cleaned || '/'
}

function cleanDimension(
  value: string | undefined,
  fallback: string,
  maxLength = 64
): string {
  if (!value) return fallback

  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, '')
    .slice(0, maxLength)
  return cleaned || fallback
}

function getOrigin(request: Request): string | null {
  const origin = request.headers.get('origin')
  return origin && SITE_BY_ORIGIN.has(origin) ? origin : null
}

function responseHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Cache-Control': 'private, no-store',
    'Content-Type': 'application/json; charset=utf-8',
    Vary: 'Origin',
    'X-Robots-Tag': 'noindex, nofollow',
  }
  if (origin) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

export const OPTIONS: APIRoute = ({ request }) => {
  const origin = getOrigin(request)
  if (!origin) {
    return Response.json(
      { error: 'Origin not allowed' },
      { status: 403, headers: responseHeaders(null) }
    )
  }

  const headers = new Headers(responseHeaders(origin))
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  headers.set('Access-Control-Max-Age', '86400')
  return new Response(null, { status: 204, headers })
}

export const POST: APIRoute = async ({ request }) => {
  const origin = getOrigin(request)
  if (!origin) {
    return Response.json(
      { error: 'Origin not allowed' },
      { status: 403, headers: responseHeaders(null) }
    )
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('text/plain')) {
    return Response.json(
      { error: 'Content-Type must be text/plain' },
      { status: 415, headers: responseHeaders(origin) }
    )
  }

  const contentLength = Number(request.headers.get('content-length'))
  if (
    !Number.isInteger(contentLength) ||
    contentLength < 2 ||
    contentLength > MAX_BODY_BYTES
  ) {
    return Response.json(
      { error: 'Invalid body size' },
      { status: 413, headers: responseHeaders(origin) }
    )
  }

  const payload = parsePayload(await request.text())
  if (!payload || !ALLOWED_EVENTS.has(payload.event)) {
    return Response.json(
      { error: 'Invalid event' },
      { status: 400, headers: responseHeaders(origin) }
    )
  }

  recordAnalyticsEvent({
    event: payload.event,
    site: SITE_BY_ORIGIN.get(origin) ?? 'unknown',
    path: cleanPath(payload.path),
    placement: cleanDimension(payload.placement, 'unknown'),
    target: cleanDimension(payload.target, 'unknown'),
    campaign: cleanDimension(payload.campaign, 'none', 96),
  })

  return new Response(null, {
    status: 204,
    headers: responseHeaders(origin),
  })
}
