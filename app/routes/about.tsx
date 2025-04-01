import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'About - loke.dev' },
    { name: 'description', content: 'About me and my journey' },
  ]
}

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">About Me</h1>

        <div className="prose prose-gray dark:prose-invert">
          <p className="lead">
            Hi, I&apos;m a developer passionate about creating meaningful
            digital experiences.
          </p>

          <h2 className="mt-10 text-2xl font-semibold">My Journey</h2>
          <p>
            I&apos;ve been working in web development for several years,
            focusing on building accessible, responsive, and performant
            applications. I enjoy working with modern technologies and
            frameworks to create solutions that solve real problems.
          </p>

          <h2 className="mt-10 text-2xl font-semibold">Skills & Expertise</h2>
          <ul className="mt-4 space-y-2">
            <li>Frontend: React, Remix, Next.js, TypeScript</li>
            <li>Styling: Tailwind CSS, CSS-in-JS</li>
            <li>Backend: Node.js, Express, SQL/NoSQL databases</li>
            <li>DevOps: CI/CD, Docker, Cloud services</li>
          </ul>

          <h2 className="mt-10 text-2xl font-semibold">Get in Touch</h2>
          <p className="mt-4">
            Feel free to reach out if you&apos;d like to collaborate on a
            project or just want to chat!
          </p>
        </div>
      </div>
    </div>
  )
}
