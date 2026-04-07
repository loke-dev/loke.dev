import type { GroundingMetadata } from '@google/genai'

export function normalizeUrlForDedup(raw: string): string {
  try {
    const u = new URL(raw.trim())
    const host = u.hostname.replace(/^www\./i, '').toLowerCase()
    const path = u.pathname.replace(/\/$/, '') || '/'
    return `${host}${path}${u.search}`
  } catch {
    return raw.trim().toLowerCase()
  }
}

export function extractWebSourcesFromGrounding(
  metadata: GroundingMetadata | undefined
): Array<{ title: string; url: string }> {
  const chunks = metadata?.groundingChunks
  if (!Array.isArray(chunks)) return []

  const seen = new Set<string>()
  const out: Array<{ title: string; url: string }> = []

  for (const chunk of chunks) {
    const web = chunk?.web
    if (!web?.uri) continue
    const url = web.uri.trim()
    if (!url) continue
    const key = normalizeUrlForDedup(url)
    if (seen.has(key)) continue
    seen.add(key)

    const title = (web.title ?? '').trim()
    const label =
      title.slice(0, 200) ||
      (() => {
        try {
          return new URL(url).hostname
        } catch {
          return 'Source'
        }
      })()

    out.push({ title: label, url })
  }

  return out
}
