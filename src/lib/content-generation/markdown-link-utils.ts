export const CODE_FENCE_RE = /(```[\s\S]*?```)/g

export function sanitizeHttpResourceUrl(raw: string): string | null {
  let s = raw.trim().replace(/[\u0000-\u001f\u007f]+/g, '')
  if (!s) return null
  if (s.startsWith('//')) s = `https:${s}`
  else if (!/^https?:\/\//i.test(s)) {
    try {
      s = new URL(`https://${s}`).href
    } catch {
      return null
    }
  }
  for (;;) {
    try {
      const u = new URL(s)
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
      return u.href
    } catch {
      if (s.length < 12) return null
      const last = s.at(-1)
      if (!last || !/[)\].,'"〉%;]/.test(last)) return null
      s = s.slice(0, -1)
    }
  }
}

function escapeForRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function stripResourceUrlMentionsOutsideCodeFences(
  markdown: string,
  resources: Array<{ title: string; url: string }>
): string {
  if (!resources.length) return markdown

  const sorted = [...resources].sort((a, b) => b.url.length - a.url.length)

  return markdown
    .split(CODE_FENCE_RE)
    .map((chunk) => {
      if (chunk.startsWith('```')) return chunk
      let prose = chunk
      for (const { title, url } of sorted) {
        const safe = sanitizeHttpResourceUrl(url)
        if (!safe) continue
        const re = new RegExp(escapeForRegExp(safe), 'gi')
        const replacement = title.trim() || safe
        prose = prose.replace(re, replacement)
      }
      return prose
    })
    .join('')
}

export function normalizeExternalHref(raw: string): string {
  const t = raw.trim()
  if (
    !t ||
    t.startsWith('#') ||
    t.startsWith('mailto:') ||
    t.startsWith('tel:')
  )
    return t
  if (/^https?:\/\//i.test(t)) return t
  if (t.startsWith('//')) return `https:${t}`
  try {
    const withScheme = `https://${t}`
    new URL(withScheme)
    return withScheme
  } catch {
    return t
  }
}

type LinkOcc = { label: string; rawUrl: string; start: number; end: number }

function findBalancedMarkdownLinks(prose: string): LinkOcc[] {
  const found: LinkOcc[] = []
  let i = 0
  while (i < prose.length) {
    const lb = prose.indexOf('[', i)
    if (lb === -1) break
    const rb = prose.indexOf(']', lb)
    if (rb === -1 || prose[rb + 1] !== '(') {
      i = lb + 1
      continue
    }
    const label = prose.slice(lb + 1, rb)
    let p = rb + 2
    let depth = 1
    const urlStart = p
    while (p < prose.length && depth > 0) {
      if (prose[p] === '(') depth++
      else if (prose[p] === ')') depth--
      p++
    }
    if (depth !== 0) {
      i = lb + 1
      continue
    }
    found.push({
      label,
      rawUrl: prose.slice(urlStart, p - 1),
      start: lb,
      end: p,
    })
    i = p
  }
  return found
}

export function remapBalancedMarkdownLinksInProse(
  prose: string,
  fn: (label: string, rawUrl: string) => string
): string {
  const occ = findBalancedMarkdownLinks(prose)
  if (!occ.length) return prose
  let out = ''
  let cursor = 0
  for (const o of occ) {
    out += prose.slice(cursor, o.start)
    out += fn(o.label, o.rawUrl)
    cursor = o.end
  }
  out += prose.slice(cursor)
  return out
}

export function stripMarkdownLinksOutsideCodeFences(markdown: string): string {
  return markdown
    .split(CODE_FENCE_RE)
    .map((chunk) => {
      if (chunk.startsWith('```')) return chunk
      return remapBalancedMarkdownLinksInProse(chunk, (label) => label)
    })
    .join('')
}

export type PlainSegmentPiece =
  | { kind: 'text'; text: string }
  | { kind: 'link'; label: string; rawUrl: string }

export function segmentPlainTextWithLinks(plain: string): PlainSegmentPiece[] {
  const occ = findBalancedMarkdownLinks(plain)
  if (!occ.length) return [{ kind: 'text', text: plain }]
  const out: PlainSegmentPiece[] = []
  let cursor = 0
  for (const o of occ) {
    if (o.start > cursor) {
      out.push({ kind: 'text', text: plain.slice(cursor, o.start) })
    }
    out.push({ kind: 'link', label: o.label, rawUrl: o.rawUrl })
    cursor = o.end
  }
  if (cursor < plain.length) {
    out.push({ kind: 'text', text: plain.slice(cursor) })
  }
  return out
}
