/** Keep CMS-authored links to safe, browser-supported protocols. */
export function safeLinkHref(value: unknown): string {
  if (typeof value !== 'string') return '#'
  const href = value.trim()
  if (!href) return '#'
  const compactHref = href.replace(/[\u0000-\u0020]/g, '')
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(compactHref)?.[1]?.toLowerCase()
  return !scheme || ['http', 'https', 'mailto', 'tel'].includes(scheme)
    ? href
    : '#'
}
