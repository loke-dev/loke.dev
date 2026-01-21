import { lazy, Suspense } from 'react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import { createMetaTags, SITE_DOMAIN } from '@/utils/meta'
import { getAllPublishedPosts, getPostBySlug } from '@/utils/sanity.queries'
import { setFlashMessage } from '@/utils/session.server'
import { Page } from '@/components/layout'
import { PortableText } from '@/components/PortableText'
import { formatDate, getPostImageUrl } from '@/lib/sanity/helpers'
import {
  createArticleSchema,
  createBreadcrumbSchema,
} from '@/lib/sanity/schema'

const RelatedPosts = lazy(() =>
  import('@/components/related-posts').then((m) => ({
    default: m.RelatedPosts,
  }))
)

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return createMetaTags({
      title: 'Post Not Found',
      description: 'The requested blog post was not found',
    })
  }

  const { post } = data
  const imageUrl = getPostImageUrl(post, 1200, 630)

  return createMetaTags({
    title: post.title,
    description: post.description,
    url: `${SITE_DOMAIN}/blog/${post.slug.current}`,
    image: imageUrl || undefined,
    type: 'article',
    publishedTime: new Date(post.date).toISOString(),
    keywords: post.tag,
  })
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  if (!params.slug) {
    return setFlashMessage(request, 'Post slug is required', 'error', '/blog')
  }

  const post = await getPostBySlug(params.slug)

  if (!post) {
    return setFlashMessage(
      request,
      `Post "${params.slug}" was not found`,
      'error',
      '/blog'
    )
  }

  const allPosts = await getAllPublishedPosts()

  return { post, allPosts }
}

export default function BlogPostPage() {
  const { post, allPosts } = useLoaderData<typeof loader>()

  if (!post) {
    return <div>Post not found</div>
  }

  const articleSchema = createArticleSchema(post)
  const breadcrumbSchema = createBreadcrumbSchema(post)
  const imageUrl = getPostImageUrl(post, 1200)

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
        {imageUrl && (
          <div className="mb-8 -mx-4 sm:-mx-6 md:-mx-8">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={imageUrl}
                alt={post.imageAlt || `Cover image for ${post.title}`}
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
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.lastModified && (
              <span>· Updated {formatDate(post.lastModified)}</span>
            )}
            {post.readingTime && <span>· {post.readingTime} min read</span>}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <PortableText value={post.body} />
        </div>
      </article>
      <Suspense fallback={null}>
        <RelatedPosts currentPost={post} allPosts={allPosts} />
      </Suspense>
    </Page>
  )
}
