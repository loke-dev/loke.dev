import { MDXContent } from '@content-collections/mdx/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import { allPosts } from 'content-collections'
import { AUTHOR_NAME, createMetaTags, SITE_DOMAIN } from '@/utils/meta'
import { setFlashMessage } from '@/utils/session.server'
import { Callout } from '@/components/callout'
import { Page } from '@/components/layout'

export const meta: MetaFunction = ({ params }) => {
  const post = allPosts.find((post) => post._meta.path === params.slug)

  if (!post) {
    return createMetaTags({
      title: 'Post Not Found',
      description: 'The requested blog post was not found',
    })
  }

  return createMetaTags({
    title: post.title,
    description: post.description,
    url: `${SITE_DOMAIN}/blog/${post._meta.path}`,
    image: post.image ? `${SITE_DOMAIN}${post.image}` : undefined,
    type: 'article',
    publishedTime: new Date(post.date).toISOString(),
  })
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

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image
      ? `${SITE_DOMAIN}${post.image}`
      : `${SITE_DOMAIN}/loke_clay.png`,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_DOMAIN,
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_DOMAIN,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_DOMAIN}/blog/${post._meta.path}`,
    },
  }

  return (
    <Page size="md">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
