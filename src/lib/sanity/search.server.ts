import { client } from '@/lib/sanity/client'
import { SEARCH_POSTS_QUERY, SEARCH_PROJECTS_QUERY } from '@/lib/sanity/queries'
import type {
  SearchPayload,
  SearchPostHit,
  SearchProjectHit,
} from '@/lib/sanity/search-types'
import { normalizeSearchQuery, toSanityGlobPattern } from './search'

export type { SearchPayload, SearchPostHit, SearchProjectHit }

export { normalizeSearchQuery, toSanityGlobPattern } from './search'

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
