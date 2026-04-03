import type { APIRoute } from 'astro'
import { client } from '@/lib/sanity/client'

export const GET: APIRoute = async ({ url }) => {
  const excludeId = url.searchParams.get('excludeId') ?? ''
  const tagsParam = url.searchParams.get('tags') ?? ''
  const tags = tagsParam ? tagsParam.split(',').filter(Boolean) : []

  if (tags.length === 0) {
    return Response.json({ posts: [] })
  }

  const posts = await client.fetch(
    `*[_type == "post" && !(_id in path("drafts.**")) && _id != $excludeId && (count(tags[@ in $tags]) > 0 || tag in $tags)] | order(date desc) [0...3] {
      _id, title, slug, description, date
    }`,
    { excludeId, tags }
  )

  return Response.json(
    { posts },
    {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    }
  )
}
