import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | loke.dev',
  description: 'Articles and thoughts by Loke',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
