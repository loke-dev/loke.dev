import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Check out my latest projects and work',
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
