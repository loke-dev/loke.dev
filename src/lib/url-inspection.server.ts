const MAX_REDIRECTS = 4
const MAX_BODY_BYTES = 400_000
const FETCH_TIMEOUT_MS = 8_000

const PRIVATE_HOST_PATTERN = /(^localhost$|\.localhost$|\.local$)/i

export interface PageInspection {
  requestedUrl: string
  finalUrl: string
  status: number
  contentType: string | null
  title: string | null
  canonical: string | null
  robots: string | null
  description: string | null
  openGraph: Record<string, string | null>
  twitter: Record<string, string | null>
  headers: Record<string, string | null>
}

export class InspectionError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message)
  }
}

function isPrivateIpAddress(hostname: string): boolean {
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4) {
    const parts = ipv4.slice(1).map(Number)
    if (parts.some((part) => part > 255)) return true
    const [first, second] = parts
    return (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 198 && (second === 18 || second === 19))
    )
  }

  const normalized = hostname.replace(/^\[|\]$/g, '').toLowerCase()
  return (
    normalized === '::1' ||
    normalized === '::' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:')
  )
}

function validateUrl(value: string): URL {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new InspectionError('Enter a complete http or https URL.')
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new InspectionError('Only http and https URLs can be inspected.')
  }

  if (
    PRIVATE_HOST_PATTERN.test(url.hostname) ||
    isPrivateIpAddress(url.hostname)
  ) {
    throw new InspectionError(
      'Private and local network addresses are not allowed.'
    )
  }

  return url
}

function decodeHtml(value: string | undefined): string | null {
  if (!value) return null
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .trim()
    .slice(0, 1_000)
}

function attributes(tag: string): Record<string, string> {
  const result: Record<string, string> = {}
  const pattern = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g
  for (const match of tag.matchAll(pattern)) {
    result[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? ''
  }
  return result
}

function getMetaTags(html: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(match[0])
    const key = (attrs.property || attrs.name || '').toLowerCase()
    if (key && attrs.content && result[key] === undefined)
      result[key] = attrs.content
  }
  return result
}

function absoluteUrl(value: string | undefined, base: URL): string | null {
  if (!value) return null
  try {
    return new URL(value, base).href
  } catch {
    return null
  }
}

function extractInspection(
  html: string,
  requestedUrl: URL,
  response: Response
): PageInspection {
  const finalUrl = new URL(response.url || requestedUrl.href)
  const meta = getMetaTags(html)
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const canonicalMatch = html.match(
    /<link\b[^>]*\brel\s*=\s*(?:"canonical"|'canonical'|canonical)[^>]*>/i
  )
  const canonicalAttrs = canonicalMatch
    ? attributes(canonicalMatch[0])
    : undefined
  const openGraphKeys = [
    'og:title',
    'og:description',
    'og:image',
    'og:url',
    'og:type',
  ]
  const twitterKeys = [
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
  ]

  return {
    requestedUrl: requestedUrl.href,
    finalUrl: finalUrl.href,
    status: response.status,
    contentType: response.headers.get('content-type'),
    title: decodeHtml(titleMatch?.[1]?.replace(/<[^>]+>/g, ' ')),
    canonical: absoluteUrl(canonicalAttrs?.href, finalUrl),
    robots: decodeHtml(meta.robots),
    description: decodeHtml(meta.description),
    openGraph: Object.fromEntries(
      openGraphKeys.map((key) => [
        key,
        key === 'og:image' || key === 'og:url'
          ? absoluteUrl(meta[key], finalUrl)
          : decodeHtml(meta[key]),
      ])
    ),
    twitter: Object.fromEntries(
      twitterKeys.map((key) => [
        key,
        key === 'twitter:image'
          ? absoluteUrl(meta[key], finalUrl)
          : decodeHtml(meta[key]),
      ])
    ),
    headers: Object.fromEntries(
      [
        'content-type',
        'cache-control',
        'content-security-policy',
        'x-robots-tag',
        'x-frame-options',
        'strict-transport-security',
      ].map((key) => [key, response.headers.get(key)])
    ),
  }
}

export async function inspectPublicUrl(value: string): Promise<PageInspection> {
  const requestedUrl = validateUrl(value)
  let currentUrl = requestedUrl
  let response: Response | undefined

  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      response = await fetch(currentUrl, {
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': 'loke.dev URL inspector',
        },
      })
    } catch {
      throw new InspectionError(
        'The URL could not be fetched. Check that it is public and try again.',
        502
      )
    } finally {
      clearTimeout(timeout)
    }

    if (response.status < 300 || response.status >= 400) break
    const location = response.headers.get('location')
    if (!location) break
    if (attempt === MAX_REDIRECTS) {
      throw new InspectionError('Too many redirects.', 502)
    }
    currentUrl = validateUrl(new URL(location, currentUrl).href)
  }

  if (!response) throw new InspectionError('The URL could not be fetched.', 502)
  const contentType = response.headers.get('content-type') ?? ''
  if (
    !contentType.includes('text/html') &&
    !contentType.includes('application/xhtml+xml')
  ) {
    throw new InspectionError('The URL did not return an HTML page.', 422)
  }

  const contentLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new InspectionError('The page is too large to inspect.', 413)
  }

  const html = await response.text()
  if (html.length > MAX_BODY_BYTES) {
    throw new InspectionError('The page is too large to inspect.', 413)
  }

  return extractInspection(html, requestedUrl, response)
}
