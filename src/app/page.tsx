import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/jsonLd'
import { ProjectCard } from '@/components/projectCard'
import { Button } from '@/components/ui/button'
import { getAllPosts } from '@/lib/mdx'
import { Hero } from '@/components/Hero'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CalendarIcon, ArrowRight } from 'lucide-react'
import { siGithub, siX, siInstagram } from 'simple-icons'
import { getProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to loke.dev - Personal website of Loke',
}

export default async function Home() {
  const posts = getAllPosts().slice(0, 3)
  const projects = await getProjects()
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'loke.dev',
    url: 'https://loke.dev',
    description: 'Personal website of Loke',
    author: {
      '@type': 'Person',
      name: 'Loke',
    },
  }

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <Hero />

      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Latest Blog Posts</h2>
            <Button asChild variant="ghost">
              <Link href="/blog">
                View all posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </section>

      <section className="bg-background">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Button asChild variant="ghost">
              <Link href="/projects">
                View all projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                image={project.image}
                link={project.link}
                github={project.github}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="mb-8 text-3xl font-bold">Connect With Me</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              <Link
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                >
                  <path d={siGithub.path} />
                </svg>
                GitHub
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              <Link
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                >
                  <path d={siX.path} />
                </svg>
                X (Twitter)
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              <Link
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  className="mr-2 h-5 w-5"
                  fill="currentColor"
                >
                  <path d={siInstagram.path} />
                </svg>
                Instagram
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
