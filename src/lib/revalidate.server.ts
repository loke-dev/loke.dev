const DEFAULT_DEPLOY_EVENT = 'sanity-content-update'

interface DeployTriggerResult {
  ok: boolean
  skipped: boolean
  status?: number
  detail?: string
}

export function getDeployRepositoryConfig() {
  const token = process.env.GITHUB_DEPLOY_TOKEN ?? process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO

  if (!token || !owner || !repo) {
    return null
  }

  return { token, owner, repo }
}

export async function triggerSiteDeploy(
  paths: string[]
): Promise<DeployTriggerResult> {
  const config = getDeployRepositoryConfig()
  if (!config) {
    return {
      ok: false,
      skipped: true,
      detail:
        'Missing deploy config. Set GITHUB_DEPLOY_TOKEN (or GITHUB_TOKEN), GITHUB_OWNER, and GITHUB_REPO.',
    }
  }

  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        event_type: DEFAULT_DEPLOY_EVENT,
        client_payload: { paths },
      }),
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
}

export function getPurgeOrigins(url: URL): string[] {
  const configuredHosts = process.env.CLOUDFLARE_PURGE_HOSTS?.split(',')
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

export function buildPurgeUrls(paths: string[], url: URL): string[] {
  return getPurgeOrigins(url).flatMap((origin) =>
    paths.map((path) => new URL(path, origin).href)
  )
}

interface CloudflarePurgeResponse {
  success: boolean
  errors: Array<{ code?: number; message: string }>
  messages: Array<{ code?: number; message: string }>
  result?: { id?: string }
}

export async function purgeCloudflareCache(files: string[]) {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

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

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files }),
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
}

export async function warmCachePaths(
  paths: string[],
  url: URL
): Promise<string[]> {
  const urls = buildPurgeUrls(paths, url)
  await Promise.allSettled(
    urls.map((target) =>
      fetch(target, {
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })
    )
  )
  return urls
}

export const SSR_WARM_PATHS = ['/search'] as const
