import { parseDate } from './date.ts'

export function formatDate(date: string): string {
  const parsed = parseDate(date)
  if (!parsed) return 'Date unavailable'

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
