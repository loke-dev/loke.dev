import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with me for web development projects, collaborations, or any questions about frontend development.',
  openGraph: {
    title: 'Contact | loke.dev',
    description:
      'Get in touch with me for web development projects, collaborations, or any questions about frontend development.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
