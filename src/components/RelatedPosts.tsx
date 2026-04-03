import { useEffect, useState } from 'react'

interface RelatedPost {
  _id: string
  title: string
  slug: { current: string }
  description: string
  date: string
}

interface Props {
  currentPostId: string
  tags: string[]
}

export default function RelatedPosts({ currentPostId, tags }: Props) {
  const [posts, setPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelated() {
      try {
        const params = new URLSearchParams({
          excludeId: currentPostId,
          tags: tags.join(','),
        })
        const res = await fetch(`/api/related-posts?${params}`)
        if (res.ok) {
          const data = (await res.json()) as { posts?: RelatedPost[] }
          setPosts(data.posts ?? [])
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchRelated()
  }, [currentPostId, tags])

  if (loading || posts.length === 0) return null

  return (
    <aside aria-label="Related posts">
      <h2 className="text-xl font-semibold mb-4">Related Posts</h2>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post._id}>
            <a
              href={`/blog/${post.slug.current}`}
              className="block group hover:text-accent transition-colors"
            >
              <span className="font-medium group-hover:underline">
                {post.title}
              </span>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.description}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
