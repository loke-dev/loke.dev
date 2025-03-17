import type { Metadata } from "next";
import JsonLd from "../../components/JsonLd";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Loke and his work",
};

export default function About() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Loke",
    url: "https://loke.dev",
    jobTitle: "Web Developer",
    worksFor: {
      "@type": "Organization",
      name: "Example Company",
    },
    description: "Web developer, designer, and technology enthusiast",
    skills: "React, Next.js, TypeScript, Tailwind CSS, Node.js",
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                About Me
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Learn more about my background, skills, and interests.
              </p>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-2">
              <div className="prose prose-indigo dark:prose-invert max-w-none">
                <p>
                  Hello! I&apos;m Loke, a passionate web developer and designer
                  with a focus on creating beautiful, functional, and accessible
                  web experiences.
                </p>
                <p>
                  With several years of experience in the industry, I&apos;ve
                  worked on a variety of projects ranging from small business
                  websites to large-scale web applications. My expertise
                  includes front-end development with React and Next.js, as well
                  as back-end development with Node.js.
                </p>
                <p>
                  I&apos;m particularly interested in user experience design,
                  accessibility, and performance optimization. I believe that
                  the web should be accessible to everyone, regardless of their
                  abilities or the devices they use.
                </p>
                <h3>Skills</h3>
                <ul>
                  <li>
                    Front-end Development: React, Next.js, TypeScript, Tailwind
                    CSS
                  </li>
                  <li>Back-end Development: Node.js, Express, PostgreSQL</li>
                  <li>UI/UX Design: Figma, Adobe XD</li>
                  <li>DevOps: Docker, CI/CD, AWS</li>
                </ul>
                <h3>Education</h3>
                <p>
                  I hold a Bachelor&apos;s degree in Computer Science from
                  Example University, where I specialized in web development and
                  human-computer interaction.
                </p>
                <h3>Interests</h3>
                <p>
                  Outside of work, I enjoy hiking, photography, and contributing
                  to open-source projects. I&apos;m also an avid reader and
                  enjoy learning about new technologies and design trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
