/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'
import { Links, Meta, Scripts } from '@remix-run/react'

// Tell Remix to skip root layout
export const handle = { hydrate: true }

export async function loader() {
  return null
}

export const clientLoader = () => ({ ok: true })

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Studio</title>
        <Links />
        <Meta />
      </head>
      <body>
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Loading Studio...</div>
        </div>
        <Scripts />
      </body>
    </html>
  )
}

// Use custom layout to bypass root layout
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Studio</title>
        <Links />
        <Meta />
      </head>
      <body style={{ margin: 0, height: '100vh', overflow: 'hidden' }}>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

export default function StudioPage() {
  return (
    <div
      id="sanity-studio-root"
      style={{ position: 'fixed', inset: 0, zIndex: 999999 }}
    >
      <ClientOnlyStudio />
    </div>
  )
}

function ClientOnlyStudio() {
  const [StudioComponent, setStudioComponent] =
    React.useState<React.ComponentType<{ config: unknown }> | null>(null)
  const [config, setConfig] = React.useState<unknown>(null)

  React.useEffect(() => {
    Promise.all([import('sanity'), import('sanity.config')]).then(
      ([sanityMod, configMod]) => {
        setStudioComponent(
          () => sanityMod.Studio as React.ComponentType<{ config: unknown }>
        )
        setConfig(configMod.default)
      }
    )
  }, [])

  if (!StudioComponent || !config) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading Studio...</div>
      </div>
    )
  }

  return <StudioComponent config={config} />
}
