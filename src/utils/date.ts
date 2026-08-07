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

export function latestIsoDate(
  values: Array<string | undefined>
): string | undefined {
  return values
    .map((value) => toIsoDate(value))
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1)
}

export function latestDateOrNow(values: Array<string | undefined>): Date {
  const dates = values
    .map(parseDate)
    .filter((value): value is Date => value !== null)
  if (dates.length === 0) return new Date()
  return new Date(Math.max(...dates.map((date) => date.getTime())))
}
