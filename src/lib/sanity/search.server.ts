import { client } from '@/lib/sanity/client'
import { SEARCH_POSTS_QUERY, SEARCH_PROJECTS_QUERY } from '@/lib/sanity/queries'
import type {
  SearchPayload,
  SearchPostHit,
  SearchProjectHit,
} from '@/lib/sanity/search-types'

export type { SearchPayload, SearchPostHit, SearchProjectHit }

const MIN_LEN = 2
const MAX_LEN = 100

export function normalizeSearchQuery(raw: string): string | null {
  const q = raw.trim().slice(0, MAX_LEN)
  if (q.length < MIN_LEN) return null
  return q
}

export function toSanityGlobPattern(normalizedQuery: string): string {
  const s = normalizedQuery.toLowerCase()
  const escaped = s
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/\?/g, '\\?')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
  return `*${escaped}*`
}

export async function searchSiteContent(normalizedQuery: string): Promise<{
  posts: SearchPostHit[]
  projects: SearchProjectHit[]
}> {
  const pattern = toSanityGlobPattern(normalizedQuery)
  const [posts, projects] = await Promise.all([
    client.fetch<SearchPostHit[]>(SEARCH_POSTS_QUERY, { pattern }),
    client.fetch<SearchProjectHit[]>(SEARCH_PROJECTS_QUERY, { pattern }),
  ])
  return { posts, projects }
}

export async function runSearch(
  raw: string
): Promise<
  | { ok: true; data: SearchPayload }
  | { ok: false; error: string; status: number }
> {
  const normalized = normalizeSearchQuery(raw)
  if (!normalized) {
    return {
      ok: false,
      error: 'Query must be between 2 and 100 characters.',
      status: 400,
    }
  }
  try {
    const { posts, projects } = await searchSiteContent(normalized)
    return { ok: true, data: { query: normalized, posts, projects } }
  } catch (err) {
    console.error('Sanity search error:', err)
    return {
      ok: false,
      error: 'Search temporarily unavailable.',
      status: 503,
    }
  }
}
