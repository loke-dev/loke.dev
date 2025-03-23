import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '@/components/jsonLd'
import ProjectCard from '@/components/projectCard'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to loke.dev - Personal website of Loke',
}

export default function Home() {
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

      <section className="bg-base-100">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="hero text-center">
            <div className="hero-content flex-col">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Welcome to</span>
                <span className="text-primary block">loke.dev</span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-lg opacity-75">
                Personal website of Loke. Web developer, designer, and technology enthusiast.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link href="/about" className="btn btn-primary">
                  About Me
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-base-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="mb-6 text-3xl font-bold">Latest Projects</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              title="Project One"
              description="Description of project one. This is a placeholder for a real project."
            />
            <ProjectCard
              title="Project Two"
              description="Description of project two. This is a placeholder for a real project."
            />
            <ProjectCard
              title="Project Three"
              description="Description of project three. This is a placeholder for a real project."
            />
          </div>
        </div>
      </section>
    </>
  )
}
