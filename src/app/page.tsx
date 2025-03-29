import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarIcon } from 'lucide-react'
import { siGithub, siInstagram, siX } from 'simple-icons'
import { fadeIn, fadeInSlideUp, scaleIn } from '@/lib/animations'
import { getAllPosts } from '@/lib/mdx'
import { getProjects } from '@/lib/projects'
import { Hero } from '@/components/hero'
import { JsonLd } from '@/components/jsonLd'
import { ProjectCard } from '@/components/projectCard'
import { Animated } from '@/components/ui/animated'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to loke.dev - Personal website of Loke',
}

export default async function Home() {
  const [posts, projects] = await Promise.all([getAllPosts(), getProjects()])
  const latestPosts = posts.slice(0, 3)
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
          <Animated
            variants={fadeInSlideUp}
            className="mb-8 flex items-center justify-between"
          >
            <h2 className="text-3xl font-bold">Latest Blog Posts</h2>
            <Button asChild variant="ghost">
              <Link href="/blog">
                View all posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Animated>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, index) => (
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
        </div>
      </section>

      <section className="bg-background">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Animated
            variants={fadeInSlideUp}
            className="mb-8 flex items-center justify-between"
          >
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Button asChild variant="ghost">
              <Link href="/projects">
                View all projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Animated>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Animated key={project.id} variants={scaleIn} delay={index * 0.1}>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  image={project.image}
                  link={project.link}
                  github={project.github}
                />
              </Animated>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <Animated variants={fadeInSlideUp}>
            <h2 className="mb-8 text-3xl font-bold">Connect With Me</h2>
          </Animated>
          <Animated variants={fadeIn} delay={0.2}>
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
          </Animated>
        </div>
      </section>
    </>
  )
}
