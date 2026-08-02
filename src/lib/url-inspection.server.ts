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
  public status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

function isNonPublicIpv4Address(parts: number[]): boolean {
  const [first, second] = parts
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 0) ||
    (first === 192 && second === 2) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51) ||
    (first === 203 && second === 0) ||
    first >= 224
  )
}

function parseIpv4Address(hostname: string): number[] | null {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!match) return null

  const parts = match.slice(1).map(Number)
  return parts.some((part) => part > 255) ? null : parts
}

function parseIpv6Address(hostname: string): number[] | null {
  const normalized = hostname.replace(/^\[|\]$/g, '').toLowerCase()
  const sections = normalized.split('::')
  if (sections.length > 2) return null

  const left = sections[0] ? sections[0].split(':') : []
  const right = sections[1] ? sections[1].split(':') : []
  const missingGroups = 8 - left.length - right.length
  if (missingGroups < 0 || (sections.length === 1 && missingGroups !== 0))
    return null

  const groups = [...left, ...Array(missingGroups).fill('0'), ...right]
  if (
    groups.length !== 8 ||
    groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))
  )
    return null

  return groups.map((group) => Number.parseInt(group, 16))
}

function isNonPublicIpAddress(hostname: string): boolean {
  const ipv4 = parseIpv4Address(hostname)
  if (ipv4) return isNonPublicIpv4Address(ipv4)

  const normalizedHostname = hostname.replace(/^\[|\]$/g, '').toLowerCase()
  // Public pages have no reason to use an IPv4-mapped IPv6 literal. Reject the
  // whole representation instead of trying to distinguish mapped public and
  // private ranges, which also prevents loopback aliases such as ::ffff:127.0.0.1.
  if (normalizedHostname.startsWith('::ffff:')) return true

  const ipv6 = parseIpv6Address(hostname)
  if (!ipv6) return false

  const [firstGroup] = ipv6
  const isUnspecified = ipv6.every((group) => group === 0)
  const isLoopback =
    ipv6.slice(0, 7).every((group) => group === 0) && ipv6[7] === 1
  const isUniqueLocal = (firstGroup & 0xfe00) === 0xfc00
  const isLinkLocal = (firstGroup & 0xffc0) === 0xfe80
  const isMulticast = (firstGroup & 0xff00) === 0xff00
  const isDocumentation =
    (firstGroup === 0x2001 && ipv6[1] === 0x0db8) ||
    (firstGroup === 0x3fff && (ipv6[1] & 0xf000) === 0)
  const isEmbeddedIpv4 =
    ipv6.slice(0, 6).every((group) => group === 0) ||
    (ipv6.slice(0, 5).every((group) => group === 0) && ipv6[5] === 0xffff)
  const embeddedIpv4 = [
    ipv6[6] >> 8,
    ipv6[6] & 0xff,
    ipv6[7] >> 8,
    ipv6[7] & 0xff,
  ]

  return (
    isUnspecified ||
    isLoopback ||
    isUniqueLocal ||
    isLinkLocal ||
    isMulticast ||
    isDocumentation ||
    (isEmbeddedIpv4 && isNonPublicIpv4Address(embeddedIpv4))
  )
}

export function validateUrl(value: string): URL {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new InspectionError('Enter a complete http or https URL.')
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new InspectionError('Only http and https URLs can be inspected.')
  }

  if (url.username || url.password) {
    throw new InspectionError('URLs with credentials cannot be inspected.')
  }

  if (
    PRIVATE_HOST_PATTERN.test(url.hostname) ||
    isNonPublicIpAddress(url.hostname)
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

async function readHtmlBody(response: Response): Promise<string> {
  if (!response.body) return ''

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      totalBytes += value.byteLength
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel()
        throw new InspectionError('The page is too large to inspect.', 413)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const body = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  return new TextDecoder().decode(body)
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

  const html = await readHtmlBody(response)

  return extractInspection(html, requestedUrl, response)
}
