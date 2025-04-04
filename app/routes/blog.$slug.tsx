import { useMemo } from 'react'
import * as runtime from 'react/jsx-runtime'
import { runSync } from '@mdx-js/mdx'
import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
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
}

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const slug = validateBlogSlug(params)
  const post = await getBlogPost(slug)

  if (!post) {
    throw new Response('Not found', { status: 404 })
  }

  return { post }
}

const DynamicMdxComponent = ({
  Component,
}: {
  Component: React.ComponentType
}) => {
  return <Component />
}

export default function BlogPostPage() {
  const { post } = useLoaderData<typeof loader>()

  const MdxContent = useMemo(() => {
    try {
      const { default: Content } = runSync(post.content, { ...runtime })
      const MdxRenderer = () => <DynamicMdxComponent Component={Content} />
      MdxRenderer.displayName = 'MdxRenderer'
      return MdxRenderer
    } catch (error) {
      console.error('Error rendering MDX:', error)
      const ErrorRenderer = () => <div>Error rendering content</div>
      ErrorRenderer.displayName = 'ErrorRenderer'
      return ErrorRenderer
    }
  }, [post.content])

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
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MdxContent />
        </div>
      </article>
    </div>
  )
}
