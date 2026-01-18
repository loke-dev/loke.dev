import { Link } from '@remix-run/react'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

type Post = {
  title: string
  description: string
  date: string
  tag: string
  image?: string
  _meta: {
    path: string
  }
}

type RelatedPostsProps = {
  currentPost: Post
  allPosts: Post[]
  maxPosts?: number
}

export function RelatedPosts({
  currentPost,
  allPosts,
  maxPosts = 3,
}: RelatedPostsProps) {
  const relatedPosts = allPosts
    .filter((post) => post._meta.path !== currentPost._meta.path)
    .filter((post) => post.tag === currentPost.tag)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxPosts)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card
            key={post._meta.path}
            className="h-full flex flex-col hover:shadow-md transition-shadow group overflow-hidden"
          >
            {post.image && (
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={post.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-3">
                {post.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild className="gap-1">
                <Link
                  to={`/blog/${post._meta.path}`}
                  aria-label={`Read article: ${post.title}`}
                >
                  Read article{' '}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
