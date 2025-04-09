import { useEffect } from 'react'
import { data, LoaderFunctionArgs } from '@remix-run/node'
import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { allPosts } from 'content-collections'
import { toast } from 'sonner'
import { getFlashMessage } from '@/utils/session.server'
import { Grid, Page, PageHeader } from '@/components/layout'

export const meta: MetaFunction = () => {
  return [
    { title: 'Blog - loke.dev' },
    {
      name: 'description',
      content:
        'Articles, guides, and thoughts on web development and technology',
    },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getFlashMessage(request)

  return data({ posts: allPosts, toast }, { headers })
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
          {posts.map((post) => {
            return (
              <article
                key={post.title}
                className="group rounded-lg border p-6 transition-colors hover:bg-muted/50"
              >
                <Link to={post._meta.path} className="block" prefetch="intent">
                  <div className="mb-2 flex items-center text-sm text-muted-foreground">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <h2 className="mb-2 text-2xl font-bold tracking-tight group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground">{post.description}</p>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-primary group-hover:underline">
                      Read more →
                    </span>
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
