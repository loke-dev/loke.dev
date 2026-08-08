const DEFAULT_DEPLOY_EVENT = 'sanity-content-update'
const REVALIDATION_PATH_ORIGIN = 'https://revalidation.invalid'
const EXTERNAL_REQUEST_TIMEOUT_MS = 8_000
const TYPE_PATHS: Record<string, string[]> = {
  post: ['/', '/blog', '/guides', '/topics', '/rss.xml', '/sitemap.xml'],
  topic: ['/', '/blog', '/guides', '/topics', '/sitemap.xml'],
  author: ['/sitemap.xml'],
  homePage: ['/'],
  nowPage: ['/now'],
  blogPage: ['/blog'],
  aboutPage: ['/about'],
  projectsPage: ['/projects'],
  project: ['/', '/projects'],
  contactPage: ['/contact'],
  changelog: ['/changelog'],
}

export type RuntimeEnvironment = Record<string, unknown>

export interface RevalidatePayload {
  _type?: string
  slug?: string | { current?: string }
  authorSlug?: string | { current?: string }
  topicSlugs?: Array<string | { current?: string }>
  path?: string
  route?: string
  paths?: string[]
}

function env(
  name: string,
  runtimeEnv?: RuntimeEnvironment
): string | undefined {
  const fromRuntime = runtimeEnv?.[name]
  if (typeof fromRuntime === 'string' && fromRuntime.trim()) {
    return fromRuntime.trim()
  }

  const fromMeta = (
    import.meta.env as Record<string, string | undefined> | undefined
  )?.[name]
  if (typeof fromMeta === 'string' && fromMeta.trim()) return fromMeta.trim()
  const fromProcess =
    typeof process !== 'undefined' && process.env
      ? process.env[name]
      : undefined
  if (typeof fromProcess === 'string' && fromProcess.trim()) {
    return fromProcess.trim()
  }
  return undefined
}

interface DeployTriggerResult {
  ok: boolean
  skipped: boolean
  status?: number
  detail?: string
}

export function normalizeRevalidationPath(value: string): string | null {
  const path = value.trim()
  if (!path.startsWith('/')) return null

  try {
    const url = new URL(path, REVALIDATION_PATH_ORIGIN)
    if (url.origin !== REVALIDATION_PATH_ORIGIN) return null
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return null

    return `${url.pathname}${url.search}`
  } catch {
    return null
  }
}

function extractSlug(slug: RevalidatePayload['slug']): string | null {
  if (typeof slug === 'string') return slug.trim() || null
  if (slug && typeof slug === 'object' && typeof slug.current === 'string') {
    return slug.current.trim() || null
  }
  return null
}

function isSafeSlug(value: string): boolean {
  return /^[a-z0-9][a-z0-9_-]*$/i.test(value)
}

function addSlugPath(paths: Set<string>, prefix: string, value: unknown) {
  const slug = extractSlug(value as RevalidatePayload['slug'])
  if (slug && isSafeSlug(slug)) paths.add(`${prefix}/${slug}`)
}

export function collectPaths(payload: RevalidatePayload): string[] {
  const paths = new Set<string>()

  if (payload._type) {
    for (const mappedPath of TYPE_PATHS[payload._type] ?? []) {
      paths.add(mappedPath)
    }
  }

  const slug = extractSlug(payload.slug)
  if (slug) {
    const slugPathByType: Record<string, string[]> = {
      post: [`/blog/${slug}`, '/blog'],
      topic: [`/topics/${slug}`, '/topics'],
      author: [`/authors/${slug}`],
    }

    for (const path of slugPathByType[payload._type ?? ''] ?? []) {
      paths.add(path)
    }
  }

  if (payload._type === 'post') {
    addSlugPath(paths, '/authors', payload.authorSlug)
    for (const topicSlug of payload.topicSlugs ?? []) {
      addSlugPath(paths, '/topics', topicSlug)
    }
  }

  const singularCandidates = [payload.path, payload.route]
  for (const candidate of singularCandidates) {
    if (typeof candidate !== 'string') continue
    const normalized = normalizeRevalidationPath(candidate)
    if (normalized) paths.add(normalized)
  }

  if (Array.isArray(payload.paths)) {
    for (const path of payload.paths) {
      if (typeof path !== 'string') continue
      const normalized = normalizeRevalidationPath(path)
      if (normalized) paths.add(normalized)
    }
  }

  if (paths.size === 0) paths.add('/')
  return [...paths]
}

export function getDeployRepositoryConfig(runtimeEnv?: RuntimeEnvironment) {
  const token =
    env('GITHUB_DEPLOY_TOKEN', runtimeEnv) ?? env('GITHUB_TOKEN', runtimeEnv)
  const owner = env('GITHUB_OWNER', runtimeEnv) ?? 'loke-dev'
  const repo = env('GITHUB_REPO', runtimeEnv) ?? 'loke.dev'

  if (!token || !owner || !repo) {
    return null
  }

  return { token, owner, repo }
}

export async function triggerSiteDeploy(
  paths: string[],
  runtimeEnv?: RuntimeEnvironment
): Promise<DeployTriggerResult> {
  const config = getDeployRepositoryConfig(runtimeEnv)
  if (!config) {
    return {
      ok: false,
      skipped: true,
      detail:
        'Missing deploy config. Set GITHUB_DEPLOY_TOKEN (or GITHUB_TOKEN), GITHUB_OWNER, and GITHUB_REPO.',
    }
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'loke.dev-revalidation/1.0',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          event_type: DEFAULT_DEPLOY_EVENT,
          client_payload: { paths },
        }),
        signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
      }
    )

    if (response.status === 204) {
      return { ok: true, skipped: false, status: response.status }
    }

    const detail = await response.text().catch(() => response.statusText)
    return {
      ok: false,
      skipped: false,
      status: response.status,
      detail,
    }
  } catch {
    return {
      ok: false,
      skipped: false,
      status: 502,
      detail: 'Could not reach GitHub to trigger a deploy.',
    }
  }
}

export function getPurgeOrigins(
  url: URL,
  runtimeEnv?: RuntimeEnvironment
): string[] {
  const configuredHosts = env('CLOUDFLARE_PURGE_HOSTS', runtimeEnv)
    ?.split(',')
    .map((host) => host.trim())
    .filter(Boolean)

  if (configuredHosts?.length) {
    return configuredHosts.map((host) => {
      if (host.startsWith('http://') || host.startsWith('https://')) {
        return host.replace(/\/+$/, '')
      }
      return `https://${host.replace(/\/+$/, '')}`
    })
  }

  return [`${url.protocol}//${url.host}`]
}

export function buildPurgeUrls(
  paths: string[],
  url: URL,
  runtimeEnv?: RuntimeEnvironment
): string[] {
  return getPurgeOrigins(url, runtimeEnv).flatMap((origin) =>
    paths.map((path) => new URL(path, origin).href)
  )
}

interface CloudflarePurgeResponse {
  success: boolean
  errors: Array<{ code?: number; message: string }>
  messages: Array<{ code?: number; message: string }>
  result?: { id?: string }
}

export async function purgeCloudflareCache(
  files: string[],
  runtimeEnv?: RuntimeEnvironment
) {
  const zoneId = env('CLOUDFLARE_ZONE_ID', runtimeEnv)
  const apiToken = env('CLOUDFLARE_API_TOKEN', runtimeEnv)

  if (!zoneId || !apiToken) {
    return {
      ok: false,
      status: 500,
      result: {
        success: false,
        errors: [
          {
            message:
              'Missing Cloudflare cache purge config. Set CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN.',
          },
        ],
        messages: [],
      } satisfies CloudflarePurgeResponse,
    }
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
        signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
      }
    )

    const result = (await response
      .json()
      .catch(() => null)) as CloudflarePurgeResponse | null

    return {
      ok: response.ok && result?.success === true,
      status: response.status,
      result,
    }
  } catch {
    return {
      ok: false,
      status: 502,
      result: {
        success: false,
        errors: [{ message: 'Could not reach Cloudflare to purge the cache.' }],
        messages: [],
      } satisfies CloudflarePurgeResponse,
    }
  }
}

export async function warmCachePaths(
  paths: string[],
  url: URL,
  runtimeEnv?: RuntimeEnvironment
): Promise<string[]> {
  const urls = buildPurgeUrls(paths, url, runtimeEnv)
  await Promise.allSettled(
    urls.map((target) =>
      fetch(target, {
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
      })
    )
  )
  return urls
}

export const SSR_WARM_PATHS = ['/search'] as const
