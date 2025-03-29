import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articles and tutorials about frontend development, React, Next.js, TypeScript, and modern web development practices.',
  openGraph: {
    title: 'Blog | loke.dev',
    description:
      'Articles and tutorials about frontend development, React, Next.js, TypeScript, and modern web development practices.',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
