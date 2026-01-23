import { useEffect } from 'react'
import { data, LoaderFunctionArgs } from '@remix-run/node'
import {
  MetaFunction,
  PrefetchPageLinks,
  useLoaderData,
} from '@remix-run/react'
import { toast } from 'sonner'
import { createMetaTags, SITE_DOMAIN } from '@/utils/meta'
import { getPaginatedPosts } from '@/utils/sanity.queries'
import { getFlashMessage } from '@/utils/session.server'
import { BlogPostCard } from '@/components/blog-post-card'
import { Grid, Page, PageHeader } from '@/components/layout'
import { Pagination } from '@/components/pagination'

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'Blog',
    description:
      'In-depth articles, practical guides, and insights on modern web development. Topics include React, Remix, TypeScript, database optimization, AI integration, and building resilient web applications.',
    url: `${SITE_DOMAIN}/blog`,
  })
}

// HTTP headers with stale-while-revalidate for better caching
export function headers() {
  return {
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    'Permissions-Policy': 'unload=()',
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)

  const [{ toast, headers }, paginatedResult] = await Promise.all([
    getFlashMessage(request),
    getPaginatedPosts(page),
  ])

  return data({ ...paginatedResult, toast }, { headers })
}

export default function BlogIndex() {
  const {
    posts,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    toast: flashMessage,
  } = useLoaderData<typeof loader>()

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
        <>
          <Grid columns={1} columnsSm={2} columnsMd={2} columnsLg={2} gap="md">
            {posts.map((post, idx) => (
              <>
                {idx < 2 ? (
                  <PrefetchPageLinks page={`/blog/${post.slug.current}`} />
                ) : null}
                <BlogPostCard
                  key={post._id}
                  post={post}
                  prefetch={idx < 3 ? 'viewport' : 'intent'}
                />
              </>
            ))}
          </Grid>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
            />
          </div>
        </>
      )}
    </Page>
  )
}
