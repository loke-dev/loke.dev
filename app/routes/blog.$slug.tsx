import { MDXContent } from '@content-collections/mdx/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import { allPosts } from 'content-collections'
import { setFlashMessage } from '@/utils/session.server'
import { Callout } from '@/components/callout'
import { Page } from '@/components/layout'

export const meta: MetaFunction = ({ params }) => {
  const post = allPosts.find((post) => post.title === params.slug)

  return [
    { title: `Blog - ${post?.title}` },
    {
      name: 'description',
      content:
        'Articles, guides, and thoughts on web development and technology',
    },
  ]
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const post = allPosts.find((post) => post._meta.path === params.slug)

  if (!post) {
    return setFlashMessage(
      request,
      `Post "${params.slug}" was not found`,
      'error',
      '/blog'
    )
  }

  return { post }
}

export default function BlogPostPage() {
  const { post } = useLoaderData<typeof loader>()

  if (!post) {
    return <div>Post not found</div>
  }

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
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXContent code={post.body} components={{ Callout }} />
        </div>
      </article>
    </Page>
  )
}
