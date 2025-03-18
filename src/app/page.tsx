import type { Metadata } from 'next'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import JsonLd from '../components/JsonLd'
import ProjectCard from '../components/ProjectCard'
import Section from '../components/ui/Section'
import Text from '../components/ui/Text'

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

      <Section background="white">
        <Container spacing="xlarge">
          <div className="text-center">
            <Text variant="h1" as="h1" align="center">
              <span className="block">Welcome to</span>
              <Text
                variant="h1"
                as="span"
                intent="accent"
                align="center"
                className="block"
              >
                loke.dev
              </Text>
            </Text>
            <Text
              variant="bodyLarge"
              as="p"
              align="center"
              className="mx-auto mt-3 max-w-md sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
            >
              Personal website of Loke. Web developer, designer, and technology
              enthusiast.
            </Text>
            <div className="mt-10 flex justify-center">
              <div className="rounded-md shadow">
                <Button href="/about" intent="primary">
                  About Me
                </Button>
              </div>
              <div className="ml-3 rounded-md shadow">
                <Button href="/contact" intent="secondary">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="gray">
        <Container spacing="large">
          <Text variant="h2" as="h2">
            <span className="block">Latest Projects</span>
          </Text>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
        </Container>
      </Section>
    </>
  )
}
