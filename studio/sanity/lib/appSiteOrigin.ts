function withoutTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}

const DEFAULT_APP_SITE_ORIGIN = 'https://loke.dev'
function isSanityHostedStudioHost(hostname: string) {
  return (
    hostname.endsWith('.sanity.studio') ||
    hostname === 'sanity.io' ||
    hostname === 'www.sanity.io' ||
    hostname.endsWith('.sanity.io')
  )
}
function resolveConfiguredAppOrigin(value: string): string | null {
  try {
    const parsed = new URL(value)
    if (
      (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') ||
      isSanityHostedStudioHost(parsed.hostname)
    ) {
      return null
    }
    return withoutTrailingSlash(parsed.origin)
  } catch {
    return null
  }
}

export function getAppSiteOrigin(): string {
  const fromEnv = process.env.SANITY_STUDIO_APP_SITE_URL
  if (fromEnv) {
    const resolvedFromEnv = resolveConfiguredAppOrigin(fromEnv)
    if (resolvedFromEnv) return resolvedFromEnv
  }

  if (typeof window === 'undefined') {
    return DEFAULT_APP_SITE_ORIGIN
  }

  const { origin, hostname, port, protocol } = window.location

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (port === '3333') {
      return withoutTrailingSlash(`${protocol}//${hostname}:3000`)
    }
    return withoutTrailingSlash(origin)
  }

  if (isSanityHostedStudioHost(hostname)) {
    return DEFAULT_APP_SITE_ORIGIN
  }

  return withoutTrailingSlash(origin)
}

export function appApiUrl(path: string): string {
  const base = getAppSiteOrigin()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
