import { getPostSlugs, getPostBySlug } from '@/lib/mdx'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import dynamic from 'next/dynamic'

export async function generateStaticParams() {
  const posts = getPostSlugs()

  return posts.map((post) => ({
    slug: post.replace(/\.mdx$/, ''),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  return {
    title: `${post.title} | loke.dev`,
    description: post.excerpt || `Read ${post.title} on loke.dev`,
  }
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = await params
  const postsDirectory = path.join(process.cwd(), 'src/posts')
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)

  const PostContent = dynamic(() => import(`@/posts/${slug}.mdx`), {
    loading: () => <p>Loading post content...</p>,
  })

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/blog" className="link link-primary mb-4 inline-block">
          ← Back to all posts
        </Link>
        <h1 className="mb-3 text-4xl font-bold">{data.title}</h1>
        {data.date && (
          <time className="mb-6 block opacity-70">
            {new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
      </div>

      <article className="prose prose-lg max-w-none">
        <PostContent />
      </article>
    </div>
  )
}
