import { useMemo } from 'react'
import * as runtime from 'react/jsx-runtime'
import { runSync } from '@mdx-js/mdx'
import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getBlogPost, validateBlogSlug } from '@/utils/blog'
import { Page } from '@/components/layout'

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = validateBlogSlug(params)
  const post = await getBlogPost(slug)

  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }

  if (!post.published) {
    return redirect('/blog')
  }

  return {
    title: post.title,
    description: post.description,
    date: post.date,
    slug: post.slug,
    compiledContent: post.compiledContent,
  }
}

export default function BlogPostPage() {
  const { title, description, date, compiledContent } =
    useLoaderData<typeof loader>()

  const MdxComponent = useMemo(() => {
    if (!compiledContent) return () => null
    try {
      const { default: Component } = runSync(compiledContent, {
        ...runtime,
      })
      return Component
    } catch (error) {
      console.error('Error running compiled MDX:', error)
      const ErrorDisplay = () => <div>Error rendering post content.</div>
      ErrorDisplay.displayName = 'MdxErrorDisplay'
      return ErrorDisplay
    }
  }, [compiledContent])

  return (
    <Page size="md">
      <article>
        <header className="mb-8 text-center">
          <time className="text-sm text-muted-foreground">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{title}</h1>
          <p className="mt-4 text-xl text-muted-foreground">{description}</p>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MdxComponent />
        </div>
      </article>
    </Page>
  )
}
