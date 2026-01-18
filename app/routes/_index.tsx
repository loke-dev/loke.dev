import { type MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { allPosts } from 'content-collections'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { createMetaTags } from '@/utils/meta'
import { useBfcache } from '@/hooks/useBfcache'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'Loke.dev - Web Developer',
    description:
      'Full-stack web developer specializing in React, Remix, and modern JavaScript. Building fast, accessible, and beautiful web experiences. Explore in-depth tutorials and guides on web development.',
  })
}

// Add HTTP headers for bfcache support
export function headers() {
  return {
    'Cache-Control': 'no-cache',
    'Permissions-Policy': 'unload=()',
  }
}

export async function loader() {
  // Get the latest 3 blog posts
  const latestPosts = allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return { latestPosts }
}

export default function Index() {
  const { latestPosts } = useLoaderData<typeof loader>()

  // Enable back/forward cache support
  useBfcache()

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
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
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Avatar className="h-48 w-48 sm:h-64 sm:w-64 border-4">
                  <AvatarImage
                    src="/loke_clay.png"
                    alt="Profile picture"
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback>Loke.dev</AvatarFallback>
                </Avatar>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="w-full bg-muted/50 py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Some Technologies I Work With
          </h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1, duration: 0.4 }}
          >
            {[
              'JavaScript',
              'TypeScript',
              'React',
              'Remix',
              'Next.js',
              'Tailwind CSS',
            ].map((tech, index) => (
              <motion.div
                key={tech}
                className="flex items-center justify-center p-4 bg-background rounded-lg shadow-sm h-20"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="font-medium">{tech}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Blog Posts */}
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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {latestPosts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow group overflow-hidden">
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
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
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
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-12">
          <Button asChild size="lg">
            <Link to="/blog" aria-label="View All Articles">
              View All Articles{' '}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
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
