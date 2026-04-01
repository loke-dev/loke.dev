import { parseWithZod } from '@conform-to/zod'
import {
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react'
import { z } from 'zod'
import { ClientHintCheck } from '@/utils/client-hint-check'
import { getHints } from '@/utils/hints'
import { createMetaTags, createTitle, SITE_DOMAIN } from '@/utils/meta'
import { getEffectiveTheme, getTheme } from '@/utils/theme.server'
import { DeferredAnalytics } from '@/components/deferred-analytics'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { NavigationProgress } from '@/components/navigation-progress'
import { NetworkStatusIndicator } from '@/components/network-status'
import { Toaster } from '@/components/ui/toast'
import tailwindStyles from '@/styles/tailwind.css?url'

// Add HTTP headers for bfcache support
export function headers() {
  return {
    'Permissions-Policy': 'unload=()',
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return createMetaTags({
    title: 'Loke.dev',
    description: 'Lokes personal website and blog',
    url: data?.requestUrl || SITE_DOMAIN,
  })
}

export const links: LinksFunction = () => [
  { rel: 'preload', href: tailwindStyles, as: 'style' },
  { rel: 'stylesheet', href: tailwindStyles },

  // Preconnects
  { rel: 'dns-prefetch', href: 'https://cdn.sanity.io' },
  {
    rel: 'preconnect',
    href: 'https://cdn.sanity.io',
    crossOrigin: 'anonymous',
  },
  { rel: 'dns-prefetch', href: 'https://vitals.vercel-insights.com' },
  {
    rel: 'preconnect',
    href: 'https://vitals.vercel-insights.com',
    crossOrigin: 'anonymous',
  },

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
]

export async function loader({ request }: LoaderFunctionArgs) {
  const hints = getHints(request)
  const theme = getTheme(request)
  const effectiveTheme = getEffectiveTheme(request)

  return {
    theme,
    systemTheme: hints.theme,
    effectiveTheme,
    ENV: {
      TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
    },
    requestUrl: request.url,
  }
}

const ThemeFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
})

// The Layout export is used across the root component, ErrorBoundary, and HydrateFallback
export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root')
  const fetchers = useFetchers()
  const location = useLocation()

  const pendingThemeFetcher = fetchers.find(
    (f) => f.formAction === '/resources/theme-switch'
  )
  let optimisticEffectiveTheme: 'light' | 'dark' | undefined
  if (pendingThemeFetcher?.formData) {
    const submission = parseWithZod(pendingThemeFetcher.formData, {
      schema: ThemeFormSchema,
    })
    if (submission.status === 'success') {
      const { theme } = submission.value
      optimisticEffectiveTheme =
        theme === 'system' ? (data?.systemTheme ?? 'light') : theme
    }
  }

  const isDark = (optimisticEffectiveTheme ?? data?.effectiveTheme) === 'dark'
  const isStudioRoute = location.pathname.startsWith('/studio')

  return (
    <html lang="en" className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={isDark ? '#030711' : '#ffffff'} />
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
        <NavigationProgress />
        {isStudioRoute ? (
          <div className="fixed inset-0">{children}</div>
        ) : (
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        )}
        <NetworkStatusIndicator />
        <Toaster theme={isDark ? 'dark' : 'light'} />
        <ScrollRestoration />
        <Scripts />
        <DeferredAnalytics />
      </body>
    </html>
  )
}

// The default export renders the happy path
export default function App() {
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
