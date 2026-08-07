import { parseDate } from '@/utils/date'
import { formatDate } from '@/lib/sanity/helpers'
import type { PostListItem } from '@/lib/sanity/types'

export function getPostUpdatedDisplay(
  post: Pick<PostListItem, 'date' | 'lastModified' | '_updatedAt'>
): { label: string; datetime: string } | null {
  const published = parseDate(post.date)
  const lastModified = parseDate(post.lastModified)
  if (lastModified && (!published || lastModified > published)) {
    const datetime = lastModified.toISOString()
    return { label: formatDate(datetime), datetime }
  }
  const updatedAt = parseDate(post._updatedAt)
  if (updatedAt && (!published || updatedAt > published)) {
    const datetime = updatedAt.toISOString()
    return { label: formatDate(datetime), datetime }
  }
  return null
}
