import { type PostListItem } from '@/utils/sanity.queries'
import { getRelatedPosts } from '@/lib/sanity/helpers'
import { BlogPostCard } from './blog-post-card'

type RelatedPostsProps = {
  currentPost: PostListItem
  allPosts: PostListItem[]
  maxPosts?: number
}

export function RelatedPosts({
  currentPost,
  allPosts,
  maxPosts = 3,
}: RelatedPostsProps) {
  const relatedPosts = getRelatedPosts(currentPost, allPosts, maxPosts)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 border-t pt-8">
      <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
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
