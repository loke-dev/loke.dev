import { formatDate } from '@/lib/sanity/helpers'
import type { PostListItem } from '@/lib/sanity/types'

export function getPostUpdatedDisplay(
  post: Pick<PostListItem, 'date' | 'lastModified' | '_updatedAt'>
): { label: string; datetime: string } | null {
  if (post.lastModified && post.lastModified > post.date) {
    return { label: formatDate(post.lastModified), datetime: post.lastModified }
  }
  if (post._updatedAt) {
    const day = post._updatedAt.slice(0, 10)
    if (day > post.date) {
      return { label: formatDate(day), datetime: day }
    }
  }
  return null
}
