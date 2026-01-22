import { useEffect } from 'react'
import { data, LoaderFunctionArgs } from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import { toast } from 'sonner'
import { createMetaTags, SITE_DOMAIN } from '@/utils/meta'
import { getAllPublishedPosts } from '@/utils/sanity.queries'
import { getFlashMessage } from '@/utils/session.server'
import { BlogPostCard } from '@/components/blog-post-card'
import { Grid, Page, PageHeader } from '@/components/layout'

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

  const posts = await getAllPublishedPosts()

  return data({ posts, toast }, { headers })
}

export default function BlogIndex() {
  const { posts, toast: flashMessage } = useLoaderData<typeof loader>()

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
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </Grid>
      )}
    </Page>
  )
}
