import { latestIsoDate, parseDate } from '@/utils/date'
import { formatDate } from '@/lib/sanity/helpers'
import type { PostListItem } from '@/lib/sanity/types'

export function getPostUpdatedDisplay(
  post: Pick<PostListItem, 'date' | 'lastModified' | '_updatedAt'>
): { label: string; datetime: string } | null {
  const published = parseDate(post.date)
  const latestUpdate = parseDate(
    latestIsoDate([post.lastModified, post._updatedAt])
  )
  if (latestUpdate && (!published || latestUpdate > published)) {
    const datetime = latestUpdate.toISOString()
    return { label: formatDate(datetime), datetime }
  }
  return null
}
