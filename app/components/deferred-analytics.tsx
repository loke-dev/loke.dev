import { useEffect, useState } from 'react'

export function DeferredAnalytics() {
  const [Analytics, setAnalytics] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = () => {
      if (cancelled) return
      import('@vercel/analytics/remix').then((m) => {
        if (!cancelled) setAnalytics(() => m.Analytics)
      })
    }
    const hasIdle =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
    const id = hasIdle
      ? (
          window as Window & {
            requestIdleCallback: (
              c: () => void,
              o?: { timeout: number }
            ) => number
          }
        ).requestIdleCallback(run, { timeout: 2000 })
      : (setTimeout(run, 1) as unknown as number)
    return () => {
      cancelled = true
      if (hasIdle && 'cancelIdleCallback' in window) {
        ;(
          window as Window & { cancelIdleCallback: (n: number) => void }
        ).cancelIdleCallback(id)
      } else {
        clearTimeout(id)
      }
    }
  }, [])

  return Analytics ? <Analytics /> : null
}
