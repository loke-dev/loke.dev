import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ViewTransitionWrapper } from '@/components/viewTransitionWrapper'
import { Providers } from './providers'
import '@/styles/globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F9F5F1' },
    { media: '(prefers-color-scheme: dark)', color: '#282828' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'loke.dev',
    template: '%s | loke.dev',
  },
  metadataBase: new URL('https://loke.dev'),
  description: 'Personal website of Loke',
  keywords: ['Next.js', 'React', 'JavaScript', 'Web Development'],
  authors: [{ name: 'Loke' }],
  creator: 'Loke',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://loke.dev',
    siteName: 'loke.dev',
    title: 'loke.dev',
    description: 'Personal website of Loke',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'loke.dev',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'loke.dev',
    description: 'Personal website of Loke',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col antialiased`}
      >
        <Providers>
          <Header />
          <main className="flex-grow">
            <ViewTransitionWrapper>{children}</ViewTransitionWrapper>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
