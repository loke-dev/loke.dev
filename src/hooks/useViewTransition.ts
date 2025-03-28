import { useEffect, useState } from 'react'

export function useViewTransition() {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const checkSupport = () => {
      const hasViewTransitions = document.startViewTransition !== undefined
      const isNotMobile = window.matchMedia('(min-width: 768px)').matches
      setIsSupported(hasViewTransitions && isNotMobile)
    }

    checkSupport()
    window.addEventListener('resize', checkSupport)

    return () => window.removeEventListener('resize', checkSupport)
  }, [])

  return isSupported
}
