import { urlFor } from './image'
import type { Post, Project } from './types'

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getPostImageUrl(
  post: Post,
  width: number,
  height?: number
): string | null {
  if (!post.image) return null
  const builder = urlFor(post.image).width(width)
  return height ? builder.height(height).url() : builder.url()
}

export function getRelatedPosts(
  currentPost: Post,
  allPosts: Post[],
  maxPosts = 3
): Post[] {
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
  height?: number
): string | null {
  if (!project.image) return null
  const builder = urlFor(project.image).width(width)
  return height ? builder.height(height).url() : builder.url()
}
