import { useEffect, useRef } from 'react'
import { useTheme } from './use-theme'

export function ResponsiveDesignSection() {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const devicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !devicesRef.current) return

    const title = textRef.current.querySelector('.section-title') as HTMLElement
    const text = textRef.current.querySelector('.section-text') as HTMLElement
    const desktop = devicesRef.current.querySelector(
      '.device-desktop'
    ) as HTMLElement
    const tablet = devicesRef.current.querySelector(
      '.device-tablet'
    ) as HTMLElement
    const mobile = devicesRef.current.querySelector(
      '.device-mobile'
    ) as HTMLElement

    if (!title || !text || !desktop || !tablet || !mobile) return

    // Set initial state
    title.style.opacity = '0'
    title.style.transform = 'translateY(40px)'
    text.style.opacity = '0'
    text.style.transform = 'translateY(40px)'

    desktop.style.opacity = '0'
    desktop.style.transform = 'translateX(-400px) translateY(-50%)'

    tablet.style.opacity = '0'
    tablet.style.transform = 'translate(-50%, 200px)'

    mobile.style.opacity = '0'
    mobile.style.transform = 'translateX(400px) translateY(-50%)'

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const containerRect = containerRef.current?.getBoundingClientRect()

      if (!containerRect) return

      // Text animation - calculate progress based on position
      const textRect = textRef.current?.getBoundingClientRect()
      if (textRect) {
        // Start when section is entering viewport, end when it's 80% through the viewport
        // This makes the animation last much longer as user scrolls
        const startPoint = windowHeight + containerRect.height * 0.3
        const endPoint = windowHeight * 0.2 - containerRect.height * 0.3
        const current = containerRect.top

        let progress = (startPoint - current) / (startPoint - endPoint)
        progress = Math.max(0, Math.min(1, progress))

        // Apply transforms directly proportional to scroll
        title.style.opacity = progress.toString()
        title.style.transform = `translateY(${40 * (1 - progress)}px)`

        // Slight delay for text
        const textProgress = Math.max(0, Math.min(1, progress - 0.05))
        text.style.opacity = textProgress.toString()
        text.style.transform = `translateY(${40 * (1 - textProgress)}px)`
      }

      // Devices animation
      const devicesRect = devicesRef.current?.getBoundingClientRect()
      if (devicesRect) {
        // Make devices animate over a longer scroll range
        // This makes them move more gradually as user scrolls
        const startPoint = windowHeight + containerRect.height * 0.4
        const endPoint = windowHeight * 0.2 - containerRect.height * 0.4
        const current = containerRect.top

        let progress = (startPoint - current) / (startPoint - endPoint)
        progress = Math.max(0, Math.min(1, progress))

        // Desktop animation - directly tied to scroll
        desktop.style.opacity = progress.toString()
        desktop.style.transform = `translateX(${-400 * (1 - progress)}px) translateY(-50%)`

        // Tablet animation - slightly different timing
        const tabletProgress = Math.max(0, Math.min(1, progress * 0.9))
        tablet.style.opacity = tabletProgress.toString()
        tablet.style.transform = `translate(-50%, ${200 * (1 - tabletProgress)}px)`

        // Mobile animation - slightly different timing
        const mobileProgress = Math.max(0, Math.min(1, progress * 0.8))
        mobile.style.opacity = mobileProgress.toString()
        mobile.style.transform = `translateX(${400 * (1 - mobileProgress)}px) translateY(-50%)`
      }
    }

    // Initial check
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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

      <div
        ref={textRef}
        className="max-w-4xl w-full relative z-10 mb-12 lg:mb-0"
      >
        <h2
          className={`section-title text-5xl sm:text-6xl md:text-7xl text-center font-bold mb-6 ${theme.responsive.text.primary}`}
        >
          Responsive By Design
        </h2>
        <p
          className={`section-text text-xl text-center sm:text-2xl md:text-3xl ${theme.responsive.text.secondary}`}
        >
          Creating experiences that work beautifully on every device
        </p>
      </div>

      <div ref={devicesRef} className="relative h-[50vh] w-full max-w-4xl z-10">
        <div className="device-desktop absolute left-0 top-1/2 w-[65%] h-[70%] bg-slate-800 rounded-lg shadow-xl overflow-hidden">
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

        <div className="device-tablet absolute left-1/2 top-1/2 -translate-x-1/2 w-[35%] h-[60%] bg-slate-800 rounded-lg shadow-xl overflow-hidden">
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

        <div className="device-mobile absolute right-0 top-1/2 w-[20%] h-[50%] bg-slate-800 rounded-lg shadow-xl overflow-hidden">
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
