import { client } from '@/lib/sanity/client'
import {
  ABOUT_PAGE_QUERY,
  BLOG_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  HOME_PAGE_QUERY,
  POST_BY_SLUG_QUERY,
  POST_COUNT_QUERY,
  POST_LIST_QUERY,
  POST_NEXT_QUERY,
  POST_PAGINATED_QUERY,
  POST_PREV_QUERY,
  POST_SLUGS_QUERY,
  PROJECTS_PAGE_QUERY,
  RELATED_POSTS_QUERY,
} from '@/lib/sanity/queries'
import {
  calculateReadingTime,
  readingTimeFromPlainText,
} from '@/lib/sanity/reading-time'
import type {
  AboutPage,
  BlogPage,
  ContactPage,
  HomePage,
  Post,
  PostListItem,
  PostSlug,
  ProjectsPage,
} from '@/lib/sanity/types'

export type {
  AboutPage,
  BlogPage,
  ContactPage,
  HomePage,
  Post,
  PostListItem,
  ProjectsPage,
}

export const POSTS_PER_PAGE = 10

type PostListFetchRow = PostListItem & { plainBody?: string | null }

function mapPostListRow(row: PostListFetchRow): PostListItem {
  const { plainBody, ...rest } = row
  return {
    ...rest,
    readingTime: readingTimeFromPlainText(plainBody ?? ''),
  }
}

export interface PaginatedPostsResult {
  posts: PostListItem[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function getPaginatedPosts(
  page: number = 1
): Promise<PaginatedPostsResult> {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const [rawPosts, totalCount] = await Promise.all([
    client.fetch<PostListFetchRow[]>(POST_PAGINATED_QUERY, { start, end }),
    client.fetch<number>(POST_COUNT_QUERY),
  ])

  const posts = rawPosts.map(mapPostListRow)

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE)

  return {
    posts,
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export async function getAllPublishedPosts(): Promise<PostListItem[]> {
  const rows = await client.fetch<PostListFetchRow[]>(POST_LIST_QUERY)
  return rows.map(mapPostListRow)
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

export async function getRelatedPosts(
  excludeId: string,
  tags: string[],
  limit: number = 3
): Promise<PostListItem[]> {
  if (tags.length === 0) return []
  const rows = await client.fetch<PostListFetchRow[]>(RELATED_POSTS_QUERY, {
    excludeId,
    tags,
    limit,
  })
  return rows.map(mapPostListRow)
}

export async function getAdjacentPosts(
  date: string
): Promise<{ prev: PostListItem | null; next: PostListItem | null }> {
  const [prev, next] = await Promise.all([
    client.fetch<PostListItem | null>(POST_PREV_QUERY, { date }),
    client.fetch<PostListItem | null>(POST_NEXT_QUERY, { date }),
  ])
  return { prev, next }
}

export async function getHomePage(): Promise<HomePage> {
  return client.fetch<HomePage>(HOME_PAGE_QUERY)
}

export async function getAboutPage(): Promise<AboutPage> {
  return client.fetch<AboutPage>(ABOUT_PAGE_QUERY)
}

export async function getBlogPage(): Promise<BlogPage> {
  return client.fetch<BlogPage>(BLOG_PAGE_QUERY)
}

export async function getProjectsPage(): Promise<ProjectsPage> {
  return client.fetch<ProjectsPage>(PROJECTS_PAGE_QUERY)
}

export async function getContactPage(): Promise<ContactPage> {
  return client.fetch<ContactPage>(CONTACT_PAGE_QUERY)
}
