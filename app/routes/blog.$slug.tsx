import { createElement } from 'react'
import * as runtime from 'react/jsx-runtime'
import { run } from '@mdx-js/mdx'
import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getBlogPost, validateBlogSlug } from '@/utils/blog'
import type { BlogPost } from '@/types/blog'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { title: 'Blog Post Not Found - loke.dev' },
      { name: 'description', content: 'Blog post not found' },
    ]
  }

  return [
    { title: `${data.post.title} - loke.dev` },
    { name: 'description', content: data.post.description },
  ]
}

interface LoaderData {
  post: BlogPost
  mdxContent: string
}

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const slug = validateBlogSlug(params)
  const post = await getBlogPost(slug)

  if (!post) {
    throw new Response('Not found', { status: 404 })
  }

  let mdxContent = ''
  try {
    const { default: Component } = await run(post.content, runtime)
    mdxContent = renderToStaticMarkup(createElement(Component))
  } catch (error) {
    console.error('Error rendering MDX:', error)
    mdxContent = '<div>Error rendering content</div>'
  }

  return { post, mdxContent }
}

export default function BlogPostPage() {
  const { post, mdxContent } = useLoaderData<typeof loader>()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <article>
        <header className="mb-8 text-center">
          <time className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            {post.description}
          </p>
        </header>
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: mdxContent }}
        />
      </article>
    </div>
  )
}
