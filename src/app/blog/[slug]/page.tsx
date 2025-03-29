import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getPostBySlug, getPostSlugs } from '@/lib/mdx'
import { MDXProvider } from '@/lib/mdx-provider'

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ''),
  }))
}

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params

  try {
    const filePath = `src/posts/${slug}.mdx`
    const fileContents = await fetch(
      new URL(filePath, import.meta.url).href
    ).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch post')
      return res.text()
    })

    const post = await getPostBySlug(slug)

    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <Button variant="outline" size="sm" asChild className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all posts
            </Link>
          </Button>

          <Card>
            <CardHeader className="pb-4">
              <h1 className="text-4xl font-bold tracking-tight">
                {post.title}
              </h1>
              {post.date && (
                <time className="text-muted-foreground text-sm">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <MDXProvider content={fileContents} />
              </article>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch {
    notFound()
  }
}
