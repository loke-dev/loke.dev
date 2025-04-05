import { useEffect, useRef } from 'react'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const elements = containerRef.current.querySelectorAll(
      '.animated-element'
    ) as NodeListOf<HTMLElement>

    // Initial state - all elements invisible
    elements.forEach((el) => {
      el.style.transform = 'translateY(40px)'
      el.style.opacity = '0'
      el.style.transition = 'opacity 1s ease, transform 1s ease'
    })

    // Handle scroll event to reveal elements
    const handleHeroAnimation = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate scroll progress (0 to 1)
      let progress = 1 - rect.bottom / (windowHeight + rect.height)
      progress = Math.max(0, Math.min(1, progress))

      // Animate elements based on scroll progress
      elements.forEach((el, index) => {
        // Stagger the animation by delaying each element
        const elementProgress = Math.min(1, progress * 3 - index * 0.2)

        if (elementProgress > 0) {
          el.style.transform = `translateY(${40 * (1 - elementProgress)}px)`
          el.style.opacity = elementProgress.toString()
        }
      })
    }

    // Initial check
    handleHeroAnimation()

    // Add scroll listener
    window.addEventListener('scroll', handleHeroAnimation, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleHeroAnimation)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 to-blue-950 text-white px-4"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-purple-500 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-green-500 blur-3xl"></div>
      </div>

      <h1 className="animated-element text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        Building the Web
      </h1>
      <p className="animated-element text-xl md:text-2xl max-w-2xl text-center mb-10">
        Crafting immersive digital experiences with modern technologies and
        creative animations
      </p>
      <div className="animated-element">
        <button className="px-8 py-3 bg-blue-600 rounded-full text-white font-medium hover:bg-blue-700 transition-colors">
          Explore
        </button>
      </div>
    </div>
  )
}
