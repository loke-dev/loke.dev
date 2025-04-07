import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

interface AnimationOptions {
  targets: string
  animation: Record<string, unknown>
  threshold?: number
  root?: Element | null
  rootMargin?: string
}

export function useAnimationOnScroll({
  targets,
  animation,
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
}: AnimationOptions) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll(targets)
    if (elements.length === 0) return

    // Create the animation but don't autoplay it
    const anim = animate(elements, {
      ...animation,
      autoplay: false, // Don't play automatically
    })

    // Setup scroll handler for progress
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate how far the element is through the viewport
      // 0 = just entered at bottom, 1 = just exited at top
      let progress = 1 - rect.bottom / (windowHeight + rect.height)

      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress))

      // Update animation progress
      anim.seek(progress * anim.duration)
    }

    // Initial calculation
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [targets, animation, threshold, root, rootMargin])

  return containerRef
}
