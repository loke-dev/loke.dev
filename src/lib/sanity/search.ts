const MIN_LEN = 2
const MAX_LEN = 100

export function normalizeSearchQuery(raw: string): string | null {
  const q = raw.trim().slice(0, MAX_LEN)
  if (q.length < MIN_LEN) return null
  return q
}

export function toSanityGlobPattern(normalizedQuery: string): string {
  const s = normalizedQuery.toLowerCase()
  const escaped = s
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/\?/g, '\\?')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
  return `*${escaped}*`
}
