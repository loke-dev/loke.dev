import { MDXContent } from '@content-collections/mdx/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import { allPosts } from 'content-collections'
import { createTitle } from '@/utils/meta'
import { setFlashMessage } from '@/utils/session.server'
import { Callout } from '@/components/callout'
import { Page } from '@/components/layout'

export const meta: MetaFunction = ({ params }) => {
  const post = allPosts.find((post) => post._meta.path === params.slug)

  if (!post) {
    return [
      { title: createTitle({ title: 'Post Not Found' }) },
      { name: 'description', content: 'The requested blog post was not found' },
    ]
  }

  return [
    { title: createTitle({ title: post.title }) },
    {
      name: 'description',
      content: post.description,
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
        {post.image && (
          <div className="mb-8 -mx-4 sm:-mx-6 md:-mx-8">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={post.image}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
        <header className="mb-8 text-center">
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
