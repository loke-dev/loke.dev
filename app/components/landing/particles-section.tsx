import { useEffect, useRef } from 'react'
import { useTheme } from './use-theme'

export function ParticlesSection() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle parallax scroll effect
  useEffect(() => {
    if (!sectionRef.current || !layersRef.current || !contentRef.current) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const sectionRect = sectionRef.current?.getBoundingClientRect()
      if (!sectionRect) return

      // Calculate section visibility (0 to 1)
      const windowHeight = window.innerHeight
      const sectionTop = sectionRect.top + scrollPosition
      const sectionHeight = sectionRect.height

      // How far we've scrolled into the section (0 at top, 1 at bottom)
      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          (scrollPosition - sectionTop + windowHeight) /
            (sectionHeight + windowHeight)
        )
      )

      // Apply parallax effect to layers
      const layers = layersRef.current?.querySelectorAll('.parallax-layer')
      layers?.forEach((layer) => {
        if (layer instanceof HTMLElement) {
          const speed = parseFloat(layer.dataset.speed || '0')
          const yOffset = scrollProgress * 100 * speed
          layer.style.transform = `translateY(${yOffset}px)`
        }
      })

      // Apply rotation to shapes
      const shapes = layersRef.current?.querySelectorAll('.rotate-shape')
      shapes?.forEach((shape) => {
        if (shape instanceof HTMLElement) {
          const speed = parseFloat(shape.dataset.rotateSpeed || '0')
          const rotation = scrollProgress * 360 * speed
          shape.style.transform = `rotate(${rotation}deg)`
        }
      })

      // Animate content based on scroll
      const elements = contentRef.current?.querySelectorAll('.reveal-element')
      elements?.forEach((el) => {
        if (el instanceof HTMLElement) {
          const delay = parseFloat(el.dataset.delay || '0')
          // Calculate individual element progress
          const elementProgress = Math.max(
            0,
            Math.min(1, (scrollProgress - delay) * 2)
          )

          el.style.opacity = elementProgress.toString()
          el.style.transform = `translateY(${20 * (1 - elementProgress)}px)`
        }
      })
    }

    // Initial call
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-b ${theme.particles.from} ${theme.particles.to}`}
    >
      {/* Parallax background layers */}
      <div ref={layersRef} className="absolute inset-0 pointer-events-none">
        {/* Gradient overlay that moves slightly with scroll */}
        <div
          className="parallax-layer absolute inset-0 opacity-50"
          data-speed="0.2"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)',
          }}
        ></div>

        {/* Geometric shapes that rotate with scroll */}
        <div
          className="rotate-shape parallax-layer absolute top-1/4 left-1/4 w-40 h-40 rounded-full border border-blue-500/20"
          data-speed="-0.3"
          data-rotate-speed="0.2"
        ></div>
        <div
          className="rotate-shape parallax-layer absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full border border-indigo-500/20"
          data-speed="0.4"
          data-rotate-speed="-0.1"
        ></div>
        <div
          className="rotate-shape parallax-layer absolute top-1/3 right-1/3 w-32 h-32 rounded-md border border-purple-500/20"
          data-speed="-0.2"
          data-rotate-speed="0.3"
        ></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>

        {/* Glowing orbs with scroll-based reveal */}
        <div
          className="parallax-layer absolute top-[20%] left-[20%] w-64 h-64 rounded-full bg-blue-600 blur-3xl opacity-5"
          data-speed="0.1"
        ></div>
        <div
          className="parallax-layer absolute bottom-[30%] right-[20%] w-72 h-72 rounded-full bg-indigo-500 blur-3xl opacity-5"
          data-speed="-0.2"
        ></div>
        <div
          className="parallax-layer absolute top-[50%] right-[10%] w-48 h-48 rounded-full bg-violet-500 blur-3xl opacity-5"
          data-speed="0.15"
        ></div>
      </div>

      {/* Content that reveals with scroll */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 max-w-6xl mx-auto"
      >
        <h2
          className={`reveal-element text-center text-5xl sm:text-6xl md:text-7xl font-bold mb-8 ${theme.particles.text.primary}`}
          data-delay="0"
        >
          Ready to Get Started?
        </h2>

        <p
          className={`reveal-element text-center text-xl md:text-2xl max-w-3xl mb-16 ${theme.particles.text.secondary}`}
          data-delay="0.05"
        >
          Join the community of developers building the future with our
          platform. Deploy faster, scale easier, and create amazing experiences.
        </p>

        <div
          className="reveal-element grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16"
          data-delay="0.1"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 shadow-xl">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 mb-4 text-xl">
              01
            </div>
            <h3
              className={`text-xl font-semibold mb-3 ${theme.particles.text.primary}`}
            >
              Create Your Account
            </h3>
            <p className={`${theme.particles.text.secondary}`}>
              Sign up in seconds and get access to all our tools and resources.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 shadow-xl">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 mb-4 text-xl">
              02
            </div>
            <h3
              className={`text-xl font-semibold mb-3 ${theme.particles.text.primary}`}
            >
              Deploy Your First Project
            </h3>
            <p className={`${theme.particles.text.secondary}`}>
              Use our intuitive interface to deploy your project in minutes.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 shadow-xl">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-violet-500/20 text-violet-400 mb-4 text-xl">
              03
            </div>
            <h3
              className={`text-xl font-semibold mb-3 ${theme.particles.text.primary}`}
            >
              Scale to Millions
            </h3>
            <p className={`${theme.particles.text.secondary}`}>
              Our infrastructure scales automatically with your needs.
            </p>
          </div>
        </div>

        <div
          className="reveal-element flex flex-col sm:flex-row gap-6 mb-20"
          data-delay="0.15"
        >
          <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all duration-300 shadow-lg shadow-blue-500/20">
            Get Started for Free
          </button>
          <button className="px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 rounded-xl text-white font-medium transition-all duration-300">
            Read Documentation
          </button>
        </div>

        <div
          className="reveal-element opacity-70 pt-10 border-t border-white/10 text-center"
          data-delay="0.2"
        >
          <p className={`text-sm ${theme.particles.text.secondary}`}>
            © 2023 Your Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
