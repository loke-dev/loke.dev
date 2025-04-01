import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getBlogPost, validateBlogSlug } from '../lib/blog'

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

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = validateBlogSlug(params)
  const post = await getBlogPost(slug)

  if (!post) {
    throw new Response('Not found', { status: 404 })
  }

  return json({ post })
}

export default function BlogPostPage() {
  const { post } = useLoaderData<typeof loader>()

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
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  )
}
