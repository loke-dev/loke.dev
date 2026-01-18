import { lazy, Suspense } from 'react'
import { MDXContent } from '@content-collections/mdx/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import { allPosts } from 'content-collections'
import {
  AUTHOR_NAME,
  createMetaTags,
  DEFAULT_IMAGE,
  SITE_DOMAIN,
} from '@/utils/meta'
import { setFlashMessage } from '@/utils/session.server'
import { Callout } from '@/components/callout'
import { Page } from '@/components/layout'
import { OptimizedImage } from '@/components/optimized-image'

const RelatedPosts = lazy(() =>
  import('@/components/related-posts').then((m) => ({
    default: m.RelatedPosts,
  }))
)

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
    keywords: post.tag,
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

  const publishedPosts = allPosts.filter((p) => p.published)

  return { post, allPosts: publishedPosts }
}

export default function BlogPostPage() {
  const { post, allPosts } = useLoaderData<typeof loader>()

  if (!post) {
    return <div>Post not found</div>
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image ? `${SITE_DOMAIN}${post.image}` : DEFAULT_IMAGE,
    datePublished: new Date(post.date).toISOString(),
    dateModified: post.lastModified
      ? new Date(post.lastModified).toISOString()
      : new Date(post.date).toISOString(),
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
    keywords: post.tag,
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTime}M`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_DOMAIN,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_DOMAIN}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_DOMAIN}/blog/${post._meta.path}`,
      },
    ],
  }

  return (
    <Page size="md">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article>
        {post.image && (
          <div className="mb-8 -mx-4 sm:-mx-6 md:-mx-8">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <OptimizedImage
                src={post.image}
                alt={post.imageAlt || `Cover image for ${post.title}`}
                width={1200}
                quality={90}
                format="webp"
                responsive
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1200px"
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
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.lastModified && (
              <span>
                · Updated{' '}
                {new Date(post.lastModified).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            <span>· {post.readingTime} min read</span>
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXContent code={post.body} components={{ Callout }} />
        </div>
      </article>
      <Suspense fallback={null}>
        <RelatedPosts currentPost={post} allPosts={allPosts} />
      </Suspense>
    </Page>
  )
}
