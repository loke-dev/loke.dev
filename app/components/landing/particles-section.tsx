import { useEffect, useRef } from 'react'
import { useTheme } from './use-theme'

export function ParticlesSection() {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)

  // Main animation for titles and text
  useEffect(() => {
    if (!containerRef.current || !textContainerRef.current) return

    const elements = textContainerRef.current.querySelectorAll(
      '.animated-element'
    ) as NodeListOf<HTMLElement>

    // Initial state - all elements invisible
    elements.forEach((el) => {
      el.style.transform = 'translateY(20px)'
      el.style.opacity = '0'
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
    })

    // Handle scroll event to reveal elements
    const handleElementsAnimation = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate progress (0 to 1)
      let progress = 1 - rect.bottom / (windowHeight + rect.height)
      progress = Math.max(0, Math.min(1, progress))

      // Animate elements based on scroll progress
      elements.forEach((el, index) => {
        // Stagger the animation by delaying each element
        const elementProgress = Math.min(1, (progress - index * 0.1) * 3)

        if (elementProgress > 0) {
          el.style.transform = `translateY(${20 * (1 - elementProgress)}px)`
          el.style.opacity = elementProgress.toString()
        }
      })
    }

    // Initial check
    handleElementsAnimation()

    // Add scroll listener
    window.addEventListener('scroll', handleElementsAnimation, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleElementsAnimation)
    }
  }, [])

  // Canvas animation for particles
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = containerRef.current?.clientWidth || window.innerWidth
      canvas.height = containerRef.current?.clientHeight || window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener('resize', setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1

        const hue = Math.floor(Math.random() * 60) + 170 // Blues and purples
        this.color = `hsla(${hue}, 90%, 65%, 0.7)`
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(
      Math.floor((canvas.width * canvas.height) / 10000),
      150
    )

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Draw connections between particles
    const drawConnections = () => {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop for particles
    const animateParticles = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      drawConnections()
      requestAnimationFrame(animateParticles)
    }

    // Start animation when section comes into view
    const canvasObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateParticles()
            canvasObserver.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    canvasObserver.observe(containerRef.current)

    return () => {
      canvasObserver.disconnect()
      window.removeEventListener('resize', setCanvasDimensions)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-4 py-36 bg-gradient-to-b ${theme.particles.from} ${theme.particles.to} relative overflow-hidden`}
    >
      <canvas ref={canvasRef} className="absolute inset-0"></canvas>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-64 h-64 rounded-full bg-blue-600 blur-3xl opacity-20"></div>
        <div className="absolute bottom-[15%] right-[15%] w-72 h-72 rounded-full bg-indigo-500 blur-3xl opacity-15"></div>
      </div>

      <div
        ref={textContainerRef}
        className="max-w-4xl w-full mb-8 relative z-10"
      >
        <h2
          className={`animated-element text-4xl md:text-5xl font-bold mb-6 text-center ${theme.particles.text.primary}`}
        >
          Connected Technology
        </h2>
        <p
          className={`animated-element text-lg text-center ${theme.particles.text.secondary} mb-12`}
        >
          Building the infrastructure that powers the modern web
        </p>

        <div className="animated-element text-center">
          <button className="px-8 py-3 bg-blue-500 rounded-full text-white font-medium hover:bg-blue-700 transition-colors shadow-lg">
            Start Building
          </button>
        </div>
      </div>
    </div>
  )
}
