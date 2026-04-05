function withoutTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}
function isSanityHostedStudioHost(hostname: string) {
  return (
    hostname.endsWith('.sanity.studio') ||
    hostname === 'sanity.io' ||
    hostname === 'www.sanity.io' ||
    hostname.endsWith('.sanity.io')
  )
}

export function getAppSiteOrigin(): string {
  const fromEnv = process.env.SANITY_STUDIO_APP_SITE_URL
  if (fromEnv) return withoutTrailingSlash(fromEnv)

  if (typeof window === 'undefined') {
    return 'https://loke.dev'
  }

  const { origin, hostname, port, protocol } = window.location

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (port === '3333') {
      return withoutTrailingSlash(`${protocol}//${hostname}:3000`)
    }
    return withoutTrailingSlash(origin)
  }

  if (isSanityHostedStudioHost(hostname)) {
    return 'https://loke.dev'
  }

  return withoutTrailingSlash(origin)
}

export function appApiUrl(path: string): string {
  const base = getAppSiteOrigin()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
