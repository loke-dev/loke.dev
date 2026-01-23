import { type PostListItem } from '@/utils/sanity.queries'
import { BlogPostCard } from './blog-post-card'

type RelatedPostsProps = {
  posts: PostListItem[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 border-t pt-8">
      <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard
            key={post._id}
            post={post}
            imageWidth={400}
            imageHeight={225}
            variant="minimal"
          />
        ))}
      </div>
    </section>
  )
}
