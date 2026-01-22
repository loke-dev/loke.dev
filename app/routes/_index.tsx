import { type LinksFunction, type MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { ArrowRight } from 'lucide-react'
import { buildImageUrl } from '@/utils/image-helpers'
import { createMetaTags } from '@/utils/meta'
import { getAllPublishedPosts } from '@/utils/sanity.queries'
import { BlogPostCard } from '@/components/blog-post-card'
import { Button } from '@/components/ui/button'

const avatarUrl = buildImageUrl('/loke_clay.png', {
  width: 256,
  height: 256,
  quality: 90,
  format: 'webp',
  fit: 'cover',
})

export const links: LinksFunction = () => [
  { rel: 'preload', href: avatarUrl, as: 'image', fetchPriority: 'high' },
]

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'Loke.dev - Web Developer',
    description:
      'Full-stack web developer specializing in React, Remix, and modern JavaScript. Building fast, accessible, and beautiful web experiences. Explore in-depth tutorials and guides on web development.',
  })
}

export function headers() {
  return {
    'Cache-Control': 'no-cache',
    'Permissions-Policy': 'unload=()',
  }
}

export async function loader() {
  const allPosts = await getAllPublishedPosts()
  const latestPosts = allPosts.slice(0, 3)
  return { latestPosts }
}

export default function Index() {
  const { latestPosts } = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col items-center">
      <section className="w-full max-w-6xl px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              Loke<span className="text-accent">.</span>dev
            </h1>
            <p className="text-lg text-muted-foreground">
              Building modern web experiences with a focus on performance,
              accessibility, and beautiful design.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" asChild size="lg">
                <Link to="/projects">View Projects</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/contact">Contact Me</Link>
              </Button>
            </div>
          </div>
          <div className="relative p-1">
            <div className="relative overflow-hidden rounded-xl border aspect-square md:aspect-[4/3] bg-gradient-to-br from-primary/20 to-muted">
              <div
                className="absolute inset-0 bg-grid-white/[0.2] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
                style={{
                  backgroundSize: '32px 32px',
                  backgroundPosition: '0px 0px',
                  backgroundImage:
                    'linear-gradient(to right, var(--tw-gradient-stops))',
                }}
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-48 w-48 sm:h-64 sm:w-64 overflow-hidden rounded-full border-4 bg-muted">
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    fetchPriority="high"
                    loading="eager"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-muted/50 py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Some Technologies I Work With
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center justify-center">
            {[
              'JavaScript',
              'TypeScript',
              'React',
              'Remix',
              'Next.js',
              'Tailwind CSS',
            ].map((tech) => (
              <div
                key={tech}
                className="flex items-center justify-center p-4 bg-background rounded-lg shadow-sm h-20"
              >
                <span className="font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl px-4 py-20" id="blog">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Latest from the Blog
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl">
            Thoughts, tutorials, and insights about web development and
            technology.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestPosts.map((post) => (
            <BlogPostCard
              key={post._id}
              post={post}
              imageWidth={500}
              imageHeight={281}
            />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild size="lg">
            <Link to="/blog" aria-label="View All Articles">
              View All Articles{' '}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="w-full bg-primary/10 py-16">
        <div className="container px-4 mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Let&apos;s work together</h2>
          <p className="mb-6">
            Looking for a web developer to help bring your project to life?
            I&apos;m always open to discussing new opportunities and
            collaborations.
          </p>
          <Button asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
