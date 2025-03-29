import type { Metadata } from 'next'
import { JsonLd } from '@/components/jsonLd'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about my journey as a frontend developer, my skills in React, Next.js, and modern web technologies, and my professional experience.',
  openGraph: {
    title: 'About Loke - Frontend Developer',
    description:
      'Learn about my journey as a frontend developer, my skills in React, Next.js, and modern web technologies, and my professional experience.',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Loke',
    url: 'https://loke.dev',
    jobTitle: 'Frontend Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Example Company',
    },
    description:
      'Frontend developer specializing in React, Next.js and modern web technologies',
    skills: 'React, Next.js, TypeScript, Tailwind CSS, Node.js',
  }

  return (
    <>
      <JsonLd data={personJsonLd} />
      {children}
    </>
  )
}
