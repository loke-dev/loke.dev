import { timingSafeEqual } from 'node:crypto'
import { env as workerEnv } from 'cloudflare:workers'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import type { APIRoute } from 'astro'
import {
  buildPurgeUrls,
  purgeCloudflareCache,
  type RuntimeEnvironment,
  SSR_WARM_PATHS,
  triggerSiteDeploy,
  warmCachePaths,
} from '@/lib/revalidate.server'

export const prerender = false

interface RevalidatePayload {
  _type?: string
  slug?: string | { current?: string }
  path?: string
  route?: string
  paths?: string[]
}

function getRuntimeString(
  runtimeEnv: RuntimeEnvironment | undefined,
  name: string
): string | undefined {
  const value = runtimeEnv?.[name]
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

const TYPE_PATHS: Record<string, string[]> = {
  post: ['/', '/blog', '/rss.xml', '/sitemap.xml'],
  homePage: ['/'],
  blogPage: ['/blog'],
  aboutPage: ['/about'],
  projectsPage: ['/projects'],
  project: ['/', '/projects'],
  contactPage: ['/contact'],
  changelog: ['/changelog'],
}

function normalizePath(path: string): string | null {
  if (
    !path.startsWith('/') ||
    path.includes('://') ||
    path.startsWith('/api/')
  ) {
    return null
  }
  return path
}

function extractSlug(slug: RevalidatePayload['slug']): string | null {
  if (typeof slug === 'string') {
    return slug.trim() || null
  }
  if (slug && typeof slug === 'object' && typeof slug.current === 'string') {
    return slug.current.trim() || null
  }
  return null
}

function constantTimeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) {
    return false
  }
  return timingSafeEqual(left, right)
}

function matchesSecret(candidate: string, secrets: string[]): boolean {
  return secrets.some((secret) => constantTimeEquals(candidate, secret))
}

function parsePayload(rawBody: string): RevalidatePayload | null {
  if (!rawBody.trim()) return {}
  try {
    const parsed = JSON.parse(rawBody)
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as RevalidatePayload
    }
    return {}
  } catch {
    return null
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function collectPaths(payload: RevalidatePayload): string[] {
  const paths = new Set<string>()

  if (payload._type) {
    for (const mappedPath of TYPE_PATHS[payload._type] ?? []) {
      paths.add(mappedPath)
    }
  }

  const slug = extractSlug(payload.slug)
  if (slug && payload._type === 'post') {
    paths.add(`/blog/${slug}`)
    paths.add('/blog')
  }

  const singularCandidates = [payload.path, payload.route]
  for (const candidate of singularCandidates) {
    if (typeof candidate !== 'string') continue
    const normalized = normalizePath(candidate.trim())
    if (normalized) {
      paths.add(normalized)
    }
  }

  if (Array.isArray(payload.paths)) {
    for (const path of payload.paths) {
      if (typeof path !== 'string') continue
      const normalized = normalizePath(path.trim())
      if (normalized) {
        paths.add(normalized)
      }
    }
  }

  if (paths.size === 0) {
    paths.add('/')
  }

  return [...paths]
}

function getIncomingSecret(request: Request): string | null {
  const authorization = request.headers.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim() || null
  }
  return request.headers.get('x-revalidate-secret')?.trim() || null
}

export const POST: APIRoute = async ({ request, url }) => {
  const runtimeEnv = workerEnv as unknown as RuntimeEnvironment
  const sharedSecret = getRuntimeString(runtimeEnv, 'REVALIDATE_WEBHOOK_SECRET')
  const sanityWebhookSecret = getRuntimeString(runtimeEnv, 'SANITY_WEBHOOK_SECRET')

  const rawBody = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)
  const incomingSecret = getIncomingSecret(request)

  let authMethod: 'sanity-signature' | 'shared-secret' | null = null

  if (signature) {
    if (!sanityWebhookSecret) {
      return Response.json(
        { ok: false, error: 'Missing SANITY_WEBHOOK_SECRET' },
        { status: 500 }
      )
    }

    const validSignature = await isValidSignature(
      rawBody,
      signature,
      sanityWebhookSecret
    )

    if (!validSignature) {
      return Response.json(
        { ok: false, error: 'Invalid Sanity webhook signature' },
        { status: 401 }
      )
    }
    authMethod = 'sanity-signature'
  } else {
    const acceptedSecrets = [sharedSecret, sanityWebhookSecret].filter(
      (secret): secret is string => Boolean(secret)
    )
    if (incomingSecret && matchesSecret(incomingSecret, acceptedSecrets)) {
      authMethod = 'shared-secret'
    }
  }

  if (!authMethod) {
    if (!sharedSecret && !sanityWebhookSecret) {
      return Response.json(
        {
          ok: false,
          error:
            'Missing webhook auth config. Set SANITY_WEBHOOK_SECRET and/or REVALIDATE_WEBHOOK_SECRET.',
        },
        { status: 500 }
      )
    }
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const payload = parsePayload(rawBody)
  if (!payload) {
    return Response.json(
      { ok: false, error: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const delayMs = Number(
    getRuntimeString(runtimeEnv, 'SANITY_WEBHOOK_REVALIDATE_DELAY_MS') ??
      '1200'
  )
  if (
    authMethod === 'sanity-signature' &&
    Number.isFinite(delayMs) &&
    delayMs > 0
  ) {
    await delay(Math.min(delayMs, 5000))
  }

  const paths = collectPaths(payload)
  const deploy = await triggerSiteDeploy(paths, runtimeEnv)

  if (deploy.ok) {
    return Response.json({
      ok: true,
      count: paths.length,
      authMethod,
      paths,
      deploy,
      message:
        'Deploy triggered. Static pages rebuild in GitHub Actions; cache purges after deploy.',
    })
  }

  console.error('Content revalidation deploy trigger failed', {
    skipped: deploy.skipped,
    status: deploy.status,
    detail: deploy.detail,
  })

  const purgeUrls = buildPurgeUrls(
    [...paths, ...SSR_WARM_PATHS],
    url,
    runtimeEnv
  )
  const purge = await purgeCloudflareCache(purgeUrls, runtimeEnv)
  const warmed = await warmCachePaths(
    [...paths, ...SSR_WARM_PATHS],
    url,
    runtimeEnv
  )

  if (!purge.ok) {
    console.error('Content revalidation cache purge failed', purge.result)
  }

  return Response.json(
    {
      ok: purge.ok,
      count: purgeUrls.length,
      authMethod,
      paths,
      deploy,
      purged: purgeUrls,
      warmed,
      cloudflare: purge.result,
    },
    { status: purge.ok ? 200 : purge.status }
  )
}
