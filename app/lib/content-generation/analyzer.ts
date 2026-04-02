import { createClient } from '@sanity/client'

export interface ExistingPostSummary {
  title: string
  tags: string[]
  date: string
}

export interface RepositoryContext {
  totalPosts: number
  recentTitles: string[]
  recentTags: string[]
}

export async function analyzeExistingPosts(
  projectId: string,
  dataset: string
): Promise<RepositoryContext> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: true,
  })

  try {
    const posts = await client.fetch<ExistingPostSummary[]>(
      `*[_type == "post" && !(_id in path("drafts.**"))] | order(date desc) [0...30] {
        title,
        "tags": select(
          defined(tags) && count(tags) > 0 => tags,
          defined(tag) => [tag],
          []
        ),
        date
      }`
    )

    return {
      totalPosts: posts.length,
      recentTitles: posts.map((p) => p.title),
      recentTags: [...new Set(posts.flatMap((p) => p.tags))],
    }
  } catch {
    return { totalPosts: 0, recentTitles: [], recentTags: [] }
  }
}
