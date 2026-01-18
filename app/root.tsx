import { useEffect, useState } from 'react'
import { useSWEffect } from '@remix-pwa/sw'
import { type LinksFunction, type LoaderFunctionArgs } from '@remix-run/node'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react'
import { Analytics } from '@vercel/analytics/remix'
import { ClientHintCheck } from '@/utils/client-hint-check'
import { getHints } from '@/utils/hints'
import { createTitle } from '@/utils/meta'
import { getEffectiveTheme, getTheme } from '@/utils/theme.server'
import { toast } from '@/utils/toast'
import { useBfcache } from '@/hooks/useBfcache'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { NetworkStatusIndicator } from '@/components/network-status'
import { Toaster } from '@/components/ui/toast'
import appStyles from '@/styles/app.css?url'
import tailwindStyles from '@/styles/tailwind.css?url'

// Add HTTP headers for bfcache support
export function headers() {
  return {
    'Cache-Control': 'no-cache',
    'Permissions-Policy': 'unload=()',
  }
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStyles },
  { rel: 'stylesheet', href: appStyles },

  // PWA manifest
  { rel: 'manifest', href: '/manifest.json' },

  // Favicon links
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png',
  },

  // Apple touch icon links
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },

  // Android chrome icons
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: '/android-chrome-192x192.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '512x512',
    href: '/android-chrome-512x512.png',
  },

  // Preload critical assets
  { rel: 'preload', href: '/android-chrome-192x192.png', as: 'image' },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = await getTheme(request)
  const hints = getHints(request)
  const effectiveTheme = await getEffectiveTheme(request)

  return {
    theme,
    systemTheme: hints.theme,
    effectiveTheme,
    ENV: {
      TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
    },
  }
}

// The Layout export is used across the root component, ErrorBoundary, and HydrateFallback
export function Layout({ children }: { children: React.ReactNode }) {
  // Using useRouteLoaderData instead of useLoaderData to safely access data in all contexts
  const data = useRouteLoaderData<typeof loader>('root')
  const isDark = data?.effectiveTheme === 'dark'

  return (
    <html lang="en" className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={isDark ? '#030711' : '#ffffff'} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="application-name" content="Loke.dev" />
        <meta name="apple-mobile-web-app-title" content="Loke.dev" />

        {/* PWA related meta tags */}
        <meta name="description" content="Lokes personal website and blog" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <ClientHintCheck />
        <Links />
        <Meta />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV || {})}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          {children}
          <Footer />
        </div>
        <NetworkStatusIndicator />
        <Toaster theme={isDark ? 'dark' : 'light'} />
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  )
}

// The default export renders the happy path
export default function App() {
  const [swRegistered, setSwRegistered] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleUpdate = () => {
        toast('Update available', {
          description:
            'A new version of this site is available. Reload to update.',
          action: {
            label: 'Reload',
            onClick: () => window.location.reload(),
          },
          duration: 10000,
        })
      }

      const handleSuccess = () => {
        if (!swRegistered) {
          setSwRegistered(true)
          console.log('Service worker registered successfully')
        }
      }

      navigator.serviceWorker.addEventListener('controllerchange', handleUpdate)

      navigator.serviceWorker.ready.then(handleSuccess)

      return () => {
        navigator.serviceWorker.removeEventListener(
          'controllerchange',
          handleUpdate
        )
      }
    }
  }, [swRegistered])

  useSWEffect()

  useBfcache(() => {
    console.log('Page restored from back/forward cache')
  })

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Loke',
    url: 'https://loke.dev',
    sameAs: ['https://twitter.com/loke_dev', 'https://github.com/loke-dev'],
    jobTitle: 'Web Developer',
    description:
      'Full-stack web developer specializing in React, Remix, and modern JavaScript',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Outlet />
    </>
  )
}

// Error boundary handles errors
export function ErrorBoundary() {
  const error = useRouteError()

  let message = 'An unexpected error occurred'
  let status = 500

  if (isRouteErrorResponse(error)) {
    message = error.data
    status = error.status
  } else if (error instanceof Error) {
    message = error.message
  }

  const errorTitle =
    status === 404 ? 'Page Not Found' : `Error ${status > 0 ? status : ''}`

  return (
    <Layout>
      <title>{createTitle({ title: errorTitle })}</title>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">{errorTitle}</h1>
        <p className="mb-4">{message}</p>
      </div>
    </Layout>
  )
}
