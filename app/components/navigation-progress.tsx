import { useEffect, useState } from 'react'
import { useNavigation } from '@remix-run/react'

export function NavigationProgress() {
  const navigation = useNavigation()
  const [progress, setProgress] = useState(0)
  const isNavigating = navigation.state !== 'idle'

  useEffect(() => {
    if (!isNavigating) {
      // Reset progress when navigation completes
      setProgress(0)
      return
    }

    // Start progress animation
    setProgress(10)

    const timer1 = setTimeout(() => setProgress(30), 100)
    const timer2 = setTimeout(() => setProgress(60), 300)
    const timer3 = setTimeout(() => setProgress(80), 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [isNavigating])

  if (!isNavigating && progress === 0) {
    return null
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-primary/20"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page loading"
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{
          width: isNavigating ? `${progress}%` : '100%',
          opacity: isNavigating ? 1 : 0,
          transition: isNavigating
            ? 'width 300ms ease-out'
            : 'width 100ms ease-out, opacity 300ms ease-out 100ms',
        }}
      />
    </div>
  )
}
