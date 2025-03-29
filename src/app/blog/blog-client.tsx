'use client'

import Link from 'next/link'
import { ArrowRight, CalendarIcon } from 'lucide-react'
import { fadeIn, fadeInSlideUp, scaleIn } from '@/lib/animations'
import type { PostMetadata } from '@/lib/mdx'
import { Animated } from '@/components/ui/animated'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface BlogClientProps {
  posts: PostMetadata[]
}

export function BlogClient({ posts }: BlogClientProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Animated variants={fadeInSlideUp} className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">
          Articles and thoughts on web development and design
        </p>
      </Animated>

      {posts.length === 0 ? (
        <Animated variants={fadeIn}>
          <div className="border-border bg-muted/30 rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">
              No posts available yet. Check back soon!
            </p>
          </div>
        </Animated>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Animated key={post.slug} variants={scaleIn} delay={index * 0.1}>
              <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">
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
            </Animated>
          ))}
        </div>
      )}
    </div>
  )
}
