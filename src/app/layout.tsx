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
  description:
    'Frontend developer specializing in React, Next.js, and modern web technologies',
  keywords: [
    'Next.js',
    'React',
    'JavaScript',
    'TypeScript',
    'Web Development',
    'Frontend Development',
    'UI/UX',
    'Software Engineering',
  ],
  authors: [{ name: 'Loke', url: 'https://loke.dev' }],
  creator: 'Loke',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/favicon-167x167.png', sizes: '167x167', type: 'image/png' },
    ],
    other: [
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://loke.dev',
    siteName: 'loke.dev',
    title: 'loke.dev',
    description:
      'Frontend developer specializing in React, Next.js, and modern web technologies',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'loke.dev - Frontend Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'loke.dev',
    description:
      'Frontend developer specializing in React, Next.js, and modern web technologies',
    images: ['/og-image.jpg'],
    creator: '@loke',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
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
