/* eslint-disable react-refresh/only-export-components */
import * as React from 'react'

export async function loader() {
  return null
}

export const clientLoader = () => ({ ok: true })

export function HydrateFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-lg">Loading Studio...</div>
    </div>
  )
}

export default function StudioPage() {
  return (
    <div className="h-screen">
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
