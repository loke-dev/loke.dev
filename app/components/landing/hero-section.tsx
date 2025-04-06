import { useEffect, useRef } from 'react'
import { ScrollCue } from './scroll-cue'
import { useTheme } from './use-theme'

export function HeroSection() {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  // Setup minimal scroll effects
  useEffect(() => {
    if (!containerRef.current) return

    // Get animated elements
    const elements = containerRef.current.querySelectorAll(
      '.animated-element'
    ) as NodeListOf<HTMLElement>
    const foregroundLayer = containerRef.current.querySelector(
      '.foreground-layer'
    ) as HTMLElement
    const backgroundLayer = containerRef.current.querySelector(
      '.background-layer'
    ) as HTMLElement

    // Set initial state for entrance animations
    elements.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(40px)'
      el.style.transition = 'opacity 1.2s ease, transform 1.2s ease'
    })

    // Trigger entrance animations with staggered delay
    elements.forEach((el, index) => {
      setTimeout(
        () => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        },
        100 + index * 250
      )
    })

    // Simple scroll handler for background parallax
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      // Parallax for foreground gradient (faster)
      if (foregroundLayer) {
        const foregroundMovement = scrollPosition * 0.4
        foregroundLayer.style.transform = `translateY(-${foregroundMovement}px)`
      }

      // Parallax for background gradient (slower)
      if (backgroundLayer) {
        const backgroundMovement = scrollPosition * 0.2
        backgroundLayer.style.transform = `translateY(-${backgroundMovement}px)`
      }
    }

    // Initial call
    handleScroll()

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[100svh] w-full flex flex-col items-center justify-center bg-gradient-to-b ${theme.hero.from} ${theme.hero.to} ${theme.hero.text.primary} px-4 py-24 overflow-hidden`}
    >
      {/* Background layers with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Background layer (moves slower) */}
        <div className="background-layer absolute inset-0">
          <div className="absolute -top-[40vh] -left-[20vw] w-[140vw] h-[140vh] bg-gradient-radial from-purple-800/20 via-indigo-600/10 to-transparent blur-3xl"></div>
        </div>

        {/* Foreground layer (moves faster) */}
        <div className="foreground-layer absolute inset-0">
          <div className="absolute top-[10vh] left-[30vw] w-[80vw] h-[80vh] bg-gradient-radial from-blue-500/20 via-cyan-500/10 to-transparent blur-3xl"></div>
          <div className="absolute bottom-[5vh] right-[10vw] w-[60vw] h-[60vh] bg-gradient-radial from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl"></div>
        </div>
      </div>

      {/* Content - stays static */}
      <div className="z-10 relative">
        <h1
          className={`animated-element text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600`}
        >
          Building the Web
        </h1>
        <p
          className={`animated-element text-xl sm:text-2xl md:text-3xl max-w-3xl text-center mb-12 ${theme.hero.text.secondary}`}
        >
          Crafting immersive digital experiences with modern technologies and
          creative animations
        </p>
        <div className="animated-element mb-12 flex gap-4 justify-center">
          <button className="px-8 py-3 bg-blue-500 rounded-full text-white font-medium hover:bg-blue-700 transition-all hover:scale-105 shadow-lg">
            Explore
          </button>
          <button className="px-8 py-3 border border-white/30 rounded-full text-white font-medium hover:bg-white/10 transition-all hover:scale-105">
            Learn More
          </button>
        </div>
      </div>

      {/* Static scroll indicator */}
      <div className="absolute bottom-8 w-full flex justify-center">
        <ScrollCue color={theme.hero.text.secondary} />
      </div>
    </div>
  )
}
