import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'

export const metadata = {
  title: 'Blog | loke.dev',
  description: 'Articles and thoughts by Loke Carlsson',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>

      {posts.length === 0 ? (
        <p className="opacity-70">No posts available yet.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="card bg-base-100 shadow-md hover:shadow-lg"
            >
              <div className="card-body">
                <Link href={`/blog/${post.slug}`} className="block">
                  <h2 className="card-title hover:text-primary text-2xl">
                    {post.title}
                  </h2>
                  {post.date && (
                    <time className="mb-3 block text-sm opacity-70">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {post.excerpt && <p className="opacity-80">{post.excerpt}</p>}
                  <span className="text-primary mt-4 inline-block font-medium hover:underline">
                    Read more →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
