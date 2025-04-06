import { useEffect, useRef } from 'react'
import { useAnimationOnScroll } from '@/hooks/useAnimationOnScroll'
import { useTheme } from './use-theme'

export function CodeTypingSection() {
  const { theme } = useTheme()
  const codeContainerRef = useRef<HTMLPreElement>(null)

  const containerRef = useAnimationOnScroll({
    targets: '.animated-element',
    animation: {
      translateY: [20, 0],
      opacity: [1, 1],
      duration: 800,
      easing: 'easeOutSine',
    },
    threshold: 0.3,
  })

  useEffect(() => {
    if (!containerRef.current || !codeContainerRef.current) return

    // Clear any existing content
    codeContainerRef.current.innerHTML = ''

    // Add styles
    const style = document.createElement('style')
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .code-editor-line {
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      .code-editor-line.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .code-cursor {
        display: inline-block;
        width: 2px;
        height: 1.2em;
        background-color: white;
        margin-left: 2px;
        vertical-align: middle;
        animation: blink 1s infinite;
      }
    `
    document.head.appendChild(style)

    // Create the code content with pretty syntax highlighting
    const codeLines = [
      '<span class="text-purple-400">function</span> <span class="text-green-400">createAnimation</span>() {',
      '  <span class="text-purple-400">const</span> <span class="text-blue-400">elements</span> = <span class="text-green-400">document</span>.<span class="text-yellow-400">querySelectorAll</span>(<span class="text-orange-400">\'.animate\'</span>);',
      '  ',
      '  <span class="text-green-400">anime</span>({',
      '    <span class="text-blue-400">targets</span>: <span class="text-blue-400">elements</span>,',
      '    <span class="text-blue-400">translateY</span>: [<span class="text-orange-400">-50</span>, <span class="text-orange-400">0</span>],',
      '    <span class="text-blue-400">opacity</span>: [<span class="text-orange-400">0</span>, <span class="text-orange-400">1</span>],',
      '    <span class="text-blue-400">delay</span>: <span class="text-green-400">anime</span>.<span class="text-yellow-400">stagger</span>(<span class="text-orange-400">100</span>),',
      '    <span class="text-blue-400">easing</span>: <span class="text-orange-400">\'easeOutSine\'</span>',
      '  });',
      '}',
      '',
      '<span class="text-slate-500">// Initialize animations</span>',
      '<span class="text-green-400">createAnimation</span>();',
    ]

    // Create the code lines with staggered reveal
    const lineElements = codeLines.map((lineContent, index) => {
      const line = document.createElement('div')
      line.className = 'code-editor-line'
      line.innerHTML = lineContent

      // Add slightly increasing delay based on line position
      line.style.transitionDelay = `${index * 20}ms`

      codeContainerRef.current?.appendChild(line)
      return line
    })

    // Add cursor to the last line
    const cursor = document.createElement('span')
    cursor.className = 'code-cursor'
    if (lineElements.length > 0) {
      lineElements[lineElements.length - 1].appendChild(cursor)
    }

    // Handle scroll-based reveal
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Start revealing when the code block is higher on the page
      // (when the bottom of code block is at around 80% of viewport height)
      const triggerPoint = windowHeight * 0.5

      // Calculate how much of the container has passed the trigger point
      const progress = Math.min(
        Math.max((triggerPoint - rect.top) / rect.height, 0),
        1
      )

      // Make the animation simple: use progress to determine how many lines to show
      const linesToShow = Math.floor(progress * lineElements.length)

      // Show or hide lines based on scroll position
      lineElements.forEach((line, i) => {
        if (i < linesToShow) {
          line.classList.add('visible')
        } else {
          line.classList.remove('visible')
        }
      })

      // Show or hide cursor
      cursor.style.display = linesToShow > 0 ? 'inline-block' : 'none'
    }

    // Initial check
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.head.removeChild(style)
    }
  }, [containerRef])

  return (
    <div
      ref={containerRef}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 bg-gradient-to-b ${theme.code.from} ${theme.code.to} overflow-hidden relative`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute right-[5%] top-[15%] w-40 h-40 rounded-full border-2 border-indigo-400 opacity-25"></div>
        <div className="absolute left-[10%] bottom-[20%] w-64 h-64 rounded-full border border-blue-500 opacity-20"></div>
        <div className="absolute right-[15%] bottom-[10%] w-16 h-16 rounded-full bg-indigo-500 blur-xl opacity-20"></div>
      </div>

      <div className="max-w-4xl w-full mb-10 relative z-10">
        <h2
          className={`animated-element text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-center ${theme.code.text.primary}`}
        >
          Code That Comes to Life
        </h2>
        <p
          className={`animated-element text-xl sm:text-2xl md:text-3xl text-center ${theme.code.text.secondary} mb-16`}
        >
          Creating animations with JavaScript is like writing poetry with code
        </p>
      </div>

      <div className="animated-element code-box w-full max-w-2xl bg-slate-900 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="ml-2 text-sm text-slate-400">animation.js</div>
        </div>
        <pre
          ref={codeContainerRef}
          className="p-6 text-sm md:text-base font-mono text-slate-300 overflow-x-auto"
        ></pre>
      </div>
    </div>
  )
}
