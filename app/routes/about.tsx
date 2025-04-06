import type { MetaFunction } from '@remix-run/node'
import { Page, PageHeader, Section } from '@/components/layout'

export const meta: MetaFunction = () => {
  return [
    { title: 'About - loke.dev' },
    { name: 'description', content: 'About me and my journey' },
  ]
}

export default function About() {
  return (
    <Page>
      <PageHeader title="About Me" />

      <div className="prose prose-gray dark:prose-invert">
        <div className="flex justify-center mb-6">
          <img
            src="/loke_clay.png"
            alt="3D clay avatar"
            className="rounded-lg w-64 h-auto"
          />
        </div>

        <p className="lead">
          Hi, I&apos;m a developer passionate about creating meaningful digital
          experiences.
        </p>

        <Section title="My Journey">
          <p>
            I&apos;ve been working in web development for several years,
            focusing on building accessible, responsive, and performant
            applications. I enjoy working with modern technologies and
            frameworks to create solutions that solve real problems.
          </p>
        </Section>

        <Section title="Skills & Expertise">
          <ul className="mt-4 space-y-2">
            <li>Frontend: React, Remix, Next.js, TypeScript</li>
            <li>Styling: Tailwind CSS, CSS-in-JS</li>
            <li>Backend: Node.js, Express, SQL/NoSQL databases</li>
            <li>DevOps: CI/CD, Docker, Cloud services</li>
          </ul>
        </Section>

        <Section title="Get in Touch">
          <p className="mt-4">
            Feel free to reach out if you&apos;d like to collaborate on a
            project or just want to chat!
          </p>
        </Section>
      </div>
    </Page>
  )
}
