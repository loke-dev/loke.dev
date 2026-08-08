/**
 * Parse a CMS date without allowing malformed content to crash a page.
 */
export function parseDate(value: string | undefined): Date | null {
  if (!value?.trim()) return null

  const normalized = value.trim()
  const calendarDate = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/u)
  if (calendarDate) {
    const year = Number(calendarDate[1])
    const month = Number(calendarDate[2])
    const day = Number(calendarDate[3])
    const checked = new Date(Date.UTC(year, month - 1, day))
    if (
      checked.getUTCFullYear() !== year ||
      checked.getUTCMonth() !== month - 1 ||
      checked.getUTCDate() !== day
    ) {
      return null
    }
  }

  const timestamp = Date.parse(normalized)
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
