import { urlFor } from './image'
import type { Post, PostListItem, Project } from './types'

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getPostImageUrl(
  post: PostListItem | Post,
  width: number,
  height?: number,
  quality: number = 80
): string | null {
  if (!post.image) return null
  const builder = urlFor(post.image)
    .width(width)
    .quality(quality)
    .format('webp')
  return height ? builder.height(height).url() : builder.url()
}

export function getPostImageSrcSet(
  post: PostListItem | Post,
  widths: number[],
  height?: number,
  quality: number = 80
): string | null {
  if (!post.image) return null
  const parts = widths.map((w) => {
    const b = urlFor(post.image).width(w).quality(quality).format('webp')
    const u = height
      ? b.height(Math.round((height * w) / widths[widths.length - 1])).url()
      : b.url()
    return `${u} ${w}w`
  })
  return parts.join(', ')
}

export function getRelatedPosts<T extends PostListItem>(
  currentPost: PostListItem,
  allPosts: T[],
  maxPosts = 3
): T[] {
  return allPosts
    .filter(
      (post) =>
        post.slug.current !== currentPost.slug.current &&
        post.tag === currentPost.tag
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxPosts)
}

export function getProjectImageUrl(
  project: Project,
  width: number,
  height?: number,
  quality: number = 80
): string | null {
  if (!project.image) return null
  const builder = urlFor(project.image)
    .width(width)
    .quality(quality)
    .format('webp')
  return height ? builder.height(height).url() : builder.url()
}

export function getProjectImageSrcSet(
  project: Project,
  widths: number[],
  height?: number,
  quality: number = 80
): string | null {
  if (!project.image) return null
  const parts = widths.map((w) => {
    const b = urlFor(project.image).width(w).quality(quality).format('webp')
    const u = height
      ? b.height(Math.round((height * w) / widths[widths.length - 1])).url()
      : b.url()
    return `${u} ${w}w`
  })
  return parts.join(', ')
}
