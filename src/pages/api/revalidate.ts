import { timingSafeEqual } from 'node:crypto'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import type { APIRoute } from 'astro'
import { env as workerEnv } from 'cloudflare:workers'
import {
  getPostsByAuthorSlug,
  getPostsByTopicSlug,
} from '@/utils/sanity.queries'
import { readRequestBody } from '@/lib/request-body.server'
import {
  buildPurgeUrls,
  collectPaths,
  normalizeRevalidationPath,
  purgeCloudflareCache,
  SSR_WARM_PATHS,
  triggerSiteDeploy,
  warmCachePaths,
  type RevalidatePayload,
  type RuntimeEnvironment,
} from '@/lib/revalidate.server'
import { freshClient } from '@/lib/sanity/client'

export const prerender = false

const MAX_BODY_BYTES = 64 * 1024
const RELATED_LOOKUP_TIMEOUT_MS = 4_000

function getRuntimeString(
  runtimeEnv: RuntimeEnvironment | undefined,
  name: string
): string | undefined {
  const value = runtimeEnv?.[name]
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
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

function resolveWithTimeout<T>(operation: Promise<T>, timeoutMs: number) {
  return new Promise<T | null>((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs)
    operation.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      () => {
        clearTimeout(timer)
        resolve(null)
      }
    )
  })
}

function payloadSlug(value: RevalidatePayload['slug']): string | null {
  if (typeof value === 'string') return value.trim() || null
  if (value && typeof value === 'object' && typeof value.current === 'string') {
    return value.current.trim() || null
  }
  return null
}

async function addRelatedPostPaths(
  payload: RevalidatePayload,
  paths: string[]
): Promise<string[]> {
  if (payload._type !== 'topic' && payload._type !== 'author') return paths
  const slug = payloadSlug(payload.slug)
  if (!slug) return paths

  try {
    const posts = await resolveWithTimeout(
      payload._type === 'topic'
        ? getPostsByTopicSlug(slug, freshClient)
        : getPostsByAuthorSlug(slug, freshClient),
      RELATED_LOOKUP_TIMEOUT_MS
    )
    if (!posts) return paths
    const relatedPaths = posts
      .map((post) => normalizeRevalidationPath(`/blog/${post.slug.current}`))
      .filter((path): path is string => Boolean(path))
    return [...new Set([...paths, ...relatedPaths])]
  } catch {
    return paths
  }
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
  const sanityWebhookSecret = getRuntimeString(
    runtimeEnv,
    'SANITY_WEBHOOK_SECRET'
  )

  const rawBody = await readRequestBody(request, MAX_BODY_BYTES)
  if (rawBody === null) {
    return Response.json(
      { ok: false, error: 'Webhook payload is too large.' },
      { status: 413 }
    )
  }
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
    getRuntimeString(runtimeEnv, 'SANITY_WEBHOOK_REVALIDATE_DELAY_MS') ?? '1200'
  )
  if (
    authMethod === 'sanity-signature' &&
    Number.isFinite(delayMs) &&
    delayMs > 0
  ) {
    await delay(Math.min(delayMs, 5000))
  }

  const paths = await addRelatedPostPaths(payload, collectPaths(payload))
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
