import { client } from '@/lib/sanity/client'
import {
  POST_BY_SLUG_QUERY,
  POST_QUERY,
  POST_SLUGS_QUERY,
} from '@/lib/sanity/queries'
import { calculateReadingTime } from '@/lib/sanity/reading-time'
import type { Post, PostSlug } from '@/lib/sanity/types'

export type { Post }

export async function getAllPublishedPosts(): Promise<Post[]> {
  const posts = await client.fetch<Post[]>(POST_QUERY)

  return posts.map((post) => {
    const { readingTime, wordCount } = calculateReadingTime(post.body || [])
    return { ...post, readingTime, wordCount }
  })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await client.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug })

  if (!post) return null

  const { readingTime, wordCount } = calculateReadingTime(post.body || [])
  return { ...post, readingTime, wordCount }
}

export async function getAllPostSlugs(): Promise<PostSlug[]> {
  return client.fetch<PostSlug[]>(POST_SLUGS_QUERY)
}
