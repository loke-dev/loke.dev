import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import Container from '@/components/ui/Container'

export const metadata = {
  title: 'Blog | loke.dev',
  description: 'Articles and thoughts by Loke Carlsson',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <Container className="py-12">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No posts available yet.
        </p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                  {post.title}
                </h2>
                {post.date && (
                  <time className="mb-3 block text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-4 inline-block font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Read more →
                </span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </Container>
  )
}
