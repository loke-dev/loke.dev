const FENCE_RE = /(```[\s\S]*?```)/g

export function normalizeResourceUrlForMatch(url: string): string {
  try {
    const u = new URL(url.trim())
    u.hash = ''
    ;[
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ].forEach((k) => u.searchParams.delete(k))
    const path =
      u.pathname.length > 1 && u.pathname.endsWith('/')
        ? u.pathname.slice(0, -1)
        : u.pathname
    return `${u.protocol}//${u.host.toLowerCase()}${path || '/'}${u.search}`
  } catch {
    return url.trim()
  }
}

export function applyResourceRefMarkers(
  markdown: string,
  resources: Array<{ url: string; title: string }>
): string {
  if (!resources.length) return markdown

  const refByNorm = new Map<string, number>()
  resources.forEach((r, i) => {
    refByNorm.set(normalizeResourceUrlForMatch(r.url), i + 1)
  })

  const mdLink = /\[([^\]]*)\]\((https?:[^)\s]+)\)/g

  return markdown
    .split(FENCE_RE)
    .map((chunk) => {
      if (chunk.startsWith('```')) return chunk
      return chunk.replace(mdLink, (full, label, url) => {
        const n = refByNorm.get(normalizeResourceUrlForMatch(url))
        if (!n) return full
        return `[${label}](${url}) [${n}](#resource-ref-${n})`
      })
    })
    .join('')
}
