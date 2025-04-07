import { createElement } from 'react'
import * as runtime from 'react/jsx-runtime'
import { run } from '@mdx-js/mdx'
import {
  data,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getBlogPost, validateBlogSlug } from '@/utils/blog'
import { Page } from '@/components/layout'

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

// Cache MDX content in memory
const mdxCache = new Map<string, { content: string; timestamp: number }>()

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = validateBlogSlug(params)
  const post = await getBlogPost(slug)

  if (!post) {
    throw new Response('Not found', { status: 404 })
  }

  // Check if we have a cached version of the rendered MDX
  const cached = mdxCache.get(slug)
  if (cached) {
    // Return cached content with caching headers
    return data(
      { post, mdxContent: cached.content },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600',
          'Last-Modified': new Date(cached.timestamp).toUTCString(),
        },
      }
    )
  }

  let mdxContent = ''
  try {
    const { default: Component } = await run(post.content, {
      ...runtime,
      baseUrl: import.meta.url,
    })
    mdxContent = renderToStaticMarkup(createElement(Component))

    // Cache the rendered content
    mdxCache.set(slug, {
      content: mdxContent,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Error rendering MDX:', error)
    mdxContent = '<div>Error rendering content</div>'
  }

  // Return response with caching headers
  return data(
    { post, mdxContent },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Last-Modified': new Date().toUTCString(),
      },
    }
  )
}

export default function BlogPostPage() {
  const { post, mdxContent } = useLoaderData<typeof loader>()

  return (
    <Page size="md">
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
    </Page>
  )
}
