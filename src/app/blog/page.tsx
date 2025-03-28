import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Blog | loke.dev',
  description: 'Articles and thoughts by Loke Carlsson',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">
          Articles and thoughts on web development and design
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="border-border bg-muted/30 rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            No posts available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="flex flex-col overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                {post.date && (
                  <div className="text-muted-foreground mb-3 flex items-center text-sm">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <time>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                )}
                {post.excerpt && (
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </CardContent>
              <CardFooter className="mt-auto pt-0">
                <Button
                  asChild
                  variant="outline"
                  className="hover:text-primary px-0 hover:bg-transparent"
                >
                  <Link href={`/blog/${post.slug}`}>
                    Read more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
