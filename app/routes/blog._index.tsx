import { useEffect } from 'react'
import { data, LoaderFunctionArgs } from '@remix-run/node'
import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { allPosts } from 'content-collections'
import { toast } from 'sonner'
import { createMetaTags, SITE_DOMAIN } from '@/utils/meta'
import { getFlashMessage } from '@/utils/session.server'
import { useBfcache } from '@/hooks/useBfcache'
import { Grid, Page, PageHeader } from '@/components/layout'
import { OptimizedImage } from '@/components/optimized-image'

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'Blog',
    description:
      'In-depth articles, practical guides, and insights on modern web development. Topics include React, Remix, TypeScript, database optimization, AI integration, and building resilient web applications.',
    url: `${SITE_DOMAIN}/blog`,
  })
}

// Add HTTP headers for bfcache support
export function headers() {
  return {
    'Cache-Control': 'no-cache',
    'Permissions-Policy': 'unload=()',
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getFlashMessage(request)

  const sortedPosts = [...allPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return data({ posts: sortedPosts, toast }, { headers })
}

export default function BlogIndex() {
  const { posts, toast: flashMessage } = useLoaderData<typeof loader>()

  // Enable back/forward cache support
  useBfcache()

  useEffect(() => {
    if (flashMessage) {
      toast[flashMessage.type](flashMessage.message)
    }
  }, [flashMessage])

  return (
    <Page>
      <PageHeader
        title="Blog"
        description="Articles, guides, and thoughts on web development and technology"
      />

      {posts.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No posts yet</h2>
          <p className="text-muted-foreground">
            Check back soon for new articles!
          </p>
        </div>
      ) : (
        <Grid columns={1} columnsSm={2} columnsMd={2} columnsLg={2} gap="md">
          {posts.map((post) => {
            return (
              <article
                key={post.title}
                className="group rounded-lg border overflow-hidden transition-colors hover:bg-muted/50"
              >
                <Link
                  to={post._meta.path}
                  className="block"
                  prefetch="intent"
                  aria-labelledby={`post-title-${post._meta.path}`}
                >
                  {post.image && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <OptimizedImage
                        src={post.image}
                        alt=""
                        width={600}
                        quality={85}
                        format="webp"
                        responsive
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2
                      id={`post-title-${post._meta.path}`}
                      className="mb-2 text-2xl font-bold tracking-tight group-hover:underline"
                    >
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground">{post.description}</p>
                    <div className="mt-4">
                      <span className="text-sm font-medium text-primary group-hover:underline">
                        Read article <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            )
          })}
        </Grid>
      )}
    </Page>
  )
}
