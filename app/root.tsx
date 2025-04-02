import { type LinksFunction, type LoaderFunctionArgs } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { ClientHintCheck } from '@/lib/client-hint-check'
import { getHints } from '@/lib/hints'
import { getEffectiveTheme, getTheme } from '@/lib/theme.server'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import appStyles from '@/styles/app.css?url'
import tailwindStyles from '@/styles/tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStyles },
  { rel: 'stylesheet', href: appStyles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const theme = await getTheme(request)
  const hints = getHints(request)
  const effectiveTheme = await getEffectiveTheme(request)

  return {
    theme,
    systemTheme: hints.theme,
    effectiveTheme,
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { effectiveTheme } = useLoaderData<typeof loader>()
  const isDark = effectiveTheme === 'dark'

  return (
    <html lang="en" className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ClientHintCheck />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
