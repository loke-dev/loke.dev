/**
 * Parse a CMS date without allowing malformed content to crash a page.
 */
export function parseDate(value: string | undefined): Date | null {
  if (!value?.trim()) return null

  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? null : new Date(timestamp)
}

export function toIsoDate(value: string | undefined): string | undefined {
  return parseDate(value)?.toISOString()
}

export function toRfc822Date(value: string | undefined): string | undefined {
  return parseDate(value)?.toUTCString()
}
