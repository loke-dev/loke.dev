import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my portfolio of web development projects built with React, Next.js, TypeScript, and other modern technologies.',
  openGraph: {
    title: 'Projects | loke.dev',
    description:
      'Explore my portfolio of web development projects built with React, Next.js, TypeScript, and other modern technologies.',
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
