import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation, useNavigate } from '@remix-run/react'
import type { Config } from 'sanity'
import { Hydrated } from '@/components/hydrated'

const Studio = lazy(() =>
  import('sanity').then((mod) => ({ default: mod.Studio }))
)

export function HydrateFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Loading Sanity Studio...</h1>
      </div>
    </div>
  )
}

export default function StudioPage() {
  const [config, setConfig] = useState<Config | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    import('sanity.config').then((mod) => setConfig(mod.default))
  }, [])

  // Redirect to dashboard when visiting /studio or /studio/structure
  useEffect(() => {
    if (
      location.pathname === '/studio' ||
      location.pathname === '/studio/' ||
      location.pathname === '/studio/structure' ||
      location.pathname === '/studio/structure/'
    ) {
      navigate('/studio/structure/dashboard', { replace: true })
    }
  }, [location.pathname, navigate])

  if (!config) {
    return <HydrateFallback />
  }

  return (
    <Hydrated>
      <div className="h-screen w-screen overflow-hidden">
        <Suspense fallback={<HydrateFallback />}>
          <Studio config={config} />
        </Suspense>
      </div>
    </Hydrated>
  )
}
