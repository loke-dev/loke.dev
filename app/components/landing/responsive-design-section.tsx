import { useEffect, useRef } from 'react'
import { useAnimationOnScroll } from '@/hooks/useAnimationOnScroll'
import { useTheme } from './use-theme'

export function ResponsiveDesignSection() {
  const { theme } = useTheme()
  const containerRef = useAnimationOnScroll({
    targets: '.section-title, .section-text',
    animation: {
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutSine',
    },
    threshold: 0.2,
  })

  const devicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !devicesRef.current) return

    const desktop = devicesRef.current.querySelector(
      '.device-desktop'
    ) as HTMLElement
    const tablet = devicesRef.current.querySelector(
      '.device-tablet'
    ) as HTMLElement
    const mobile = devicesRef.current.querySelector(
      '.device-mobile'
    ) as HTMLElement

    if (!desktop || !tablet || !mobile) return

    // Initial state
    desktop.style.transform = 'translateX(-300px) translateY(-50%)'
    desktop.style.opacity = '0'

    tablet.style.transform = 'translate(-50%, 200px)'
    tablet.style.opacity = '0'

    mobile.style.transform = 'translateX(300px) translateY(-50%)'
    mobile.style.opacity = '0'

    desktop.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
    tablet.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
    mobile.style.transition = 'opacity 0.8s ease, transform 0.8s ease'

    // Handle scroll event to animate devices
    const handleDeviceAnimation = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate progress (0 to 1)
      let progress = 1 - rect.bottom / (windowHeight + rect.height)
      progress = Math.max(0, Math.min(1, progress))

      // Animate devices based on scroll progress
      if (progress > 0.1) {
        // Animate desktop
        const desktopProgress = Math.min(1, (progress - 0.1) * 3)
        desktop.style.transform = `translateX(${-300 * (1 - desktopProgress)}px) translateY(-50%)`
        desktop.style.opacity = desktopProgress.toString()
      }

      if (progress > 0.3) {
        // Animate tablet
        const tabletProgress = Math.min(1, (progress - 0.3) * 3)
        tablet.style.transform = `translate(-50%, ${200 * (1 - tabletProgress)}px)`
        tablet.style.opacity = tabletProgress.toString()
      }

      if (progress > 0.5) {
        // Animate mobile
        const mobileProgress = Math.min(1, (progress - 0.5) * 3)
        mobile.style.transform = `translateX(${300 * (1 - mobileProgress)}px) translateY(-50%)`
        mobile.style.opacity = mobileProgress.toString()
      }
    }

    // Initial check
    handleDeviceAnimation()

    // Add scroll listener
    window.addEventListener('scroll', handleDeviceAnimation, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleDeviceAnimation)
    }
  }, [containerRef])

  return (
    <div
      ref={containerRef}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-4 py-32 bg-gradient-to-b ${theme.responsive.from} ${theme.responsive.to} overflow-hidden relative`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute -top-[10%] right-[10%] w-64 h-64 rounded-full bg-indigo-600 blur-3xl opacity-20"></div>
        <div className="absolute left-[5%] bottom-[10%] w-52 h-52 rounded-full bg-violet-500 blur-3xl opacity-15"></div>
        <div className="absolute right-[40%] top-[30%] w-28 h-28 rounded-full border border-indigo-300 opacity-20"></div>
      </div>

      <div className="max-w-4xl w-full mb-16 relative z-10">
        <h2
          className={`section-title text-4xl md:text-5xl font-bold mb-6 text-center ${theme.responsive.text.primary} opacity-0`}
        >
          Responsive By Design
        </h2>
        <p
          className={`section-text text-lg text-center ${theme.responsive.text.secondary} opacity-0`}
        >
          Creating experiences that work beautifully on every device
        </p>
      </div>

      <div ref={devicesRef} className="relative h-[50vh] w-full max-w-4xl z-10">
        <div className="device-desktop absolute left-0 top-1/2 -translate-y-1/2 w-[65%] h-[70%] bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          <div className="h-6 bg-slate-700 flex items-center px-2">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div className="p-4 flex flex-col h-[calc(100%-1.5rem)]">
            <div className="h-6 w-2/3 bg-slate-700 rounded mb-3"></div>
            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="bg-slate-700 rounded"></div>
              <div className="bg-slate-700 rounded"></div>
              <div className="bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>

        <div className="device-tablet absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[60%] bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          <div className="h-4 bg-slate-700"></div>
          <div className="p-3 flex flex-col h-[calc(100%-1rem)]">
            <div className="h-5 w-1/2 bg-slate-700 rounded mb-3"></div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="bg-slate-700 rounded"></div>
              <div className="bg-slate-700 rounded"></div>
              <div className="bg-slate-700 rounded"></div>
              <div className="bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>

        <div className="device-mobile absolute right-0 top-1/2 -translate-y-1/2 w-[20%] h-[50%] bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          <div className="h-3 bg-slate-700"></div>
          <div className="p-2 flex flex-col h-[calc(100%-0.75rem)]">
            <div className="h-4 w-1/2 bg-slate-700 rounded mb-2"></div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="bg-slate-700 rounded h-1/4"></div>
              <div className="bg-slate-700 rounded h-1/4"></div>
              <div className="bg-slate-700 rounded h-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
