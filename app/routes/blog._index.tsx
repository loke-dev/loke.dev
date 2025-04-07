import { data, type MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getBlogPosts } from '@/utils/blog'
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

export async function loader() {
  const posts = await getBlogPosts()

  return data(
    { posts },
    {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Last-Modified': new Date().toUTCString(),
      },
    }
  )
}

export default function BlogIndex() {
  const { posts } = useLoaderData<typeof loader>()

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
            <article
              key={post.slug}
              className="group rounded-lg border p-6 transition-colors hover:bg-muted/50"
            >
              <Link to={post.slug} className="block" prefetch="intent">
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
          ))}
        </Grid>
      )}
    </Page>
  )
}
