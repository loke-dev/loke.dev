import { useEffect, useRef } from 'react'
import { useAnimationOnScroll } from '@/hooks/useAnimationOnScroll'
import { useTheme } from './use-theme'

export function FrameworksSection() {
  const { theme } = useTheme()
  const containerRef = useAnimationOnScroll({
    targets: '.section-title, .section-text',
    animation: {
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutSine',
    },
    threshold: 0.3,
  })

  const frameworKsRef = useRef<HTMLDivElement>(null)

  const frameworks = [
    { name: 'React', color: 'bg-blue-600', icon: '⚛️' },
    { name: 'Vue', color: 'bg-green-600', icon: '🔷' },
    { name: 'Svelte', color: 'bg-orange-600', icon: '🔥' },
    { name: 'Angular', color: 'bg-red-600', icon: '🅰️' },
    { name: 'Next.js', color: 'bg-slate-800', icon: '▲' },
    { name: 'Remix', color: 'bg-indigo-600', icon: '↺' },
  ]

  useEffect(() => {
    if (!containerRef.current || !frameworKsRef.current) return

    const cards = frameworKsRef.current.querySelectorAll(
      '.framework-card'
    ) as NodeListOf<HTMLElement>

    // Create initial state - all cards scaled down and transparent
    cards.forEach((card) => {
      card.style.opacity = '0'
      card.style.transform = 'scale(0.9)'
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
    })

    // Handle scroll event to reveal cards progressively
    const handleCardReveal = () => {
      if (!containerRef.current || !frameworKsRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate progress (0 to 1)
      let progress = 1 - rect.bottom / (windowHeight + rect.height)
      progress = Math.max(0, Math.min(1, progress))

      // Calculate how many cards should be visible
      const cardsToShow = Math.floor(progress * cards.length * 1.5) // Multiply by 1.5 to show cards more quickly

      // Update cards visibility
      cards.forEach((card, index) => {
        if (index < cardsToShow) {
          card.style.opacity = '1'
          card.style.transform = 'scale(1)'
        } else {
          card.style.opacity = '0'
          card.style.transform = 'scale(0.9)'
        }
      })
    }

    // Initial check
    handleCardReveal()

    // Add scroll listener
    window.addEventListener('scroll', handleCardReveal, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleCardReveal)
    }
  }, [containerRef])

  return (
    <div
      ref={containerRef}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-4 py-28 bg-gradient-to-b ${theme.frameworks.from} ${theme.frameworks.to} overflow-hidden relative`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute left-0 top-[10%] w-72 h-72 rounded-full bg-violet-600 blur-3xl opacity-20"></div>
        <div className="absolute right-[5%] bottom-[30%] w-80 h-80 rounded-full bg-blue-600 blur-3xl opacity-15"></div>
        <div className="absolute hidden md:block left-[20%] bottom-[20%] w-36 h-36 rounded-full border border-violet-400 opacity-25"></div>
      </div>

      <div className="max-w-4xl w-full mb-20 relative z-10">
        <h2
          className={`section-title text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-center ${theme.frameworks.text.primary} opacity-0`}
        >
          Modern Frameworks
        </h2>
        <p
          className={`section-text text-xl sm:text-2xl md:text-3xl text-center ${theme.frameworks.text.secondary} opacity-0`}
        >
          Building with the best tools for the modern web
        </p>
      </div>

      <div
        ref={frameworKsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl relative z-10"
      >
        {frameworks.map((framework, index) => (
          <div
            key={index}
            className={`framework-card p-8 rounded-xl ${framework.color} shadow-lg flex flex-col items-center text-white`}
          >
            <div className="text-4xl mb-4">{framework.icon}</div>
            <h3 className="text-2xl font-bold">{framework.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
