import { ScrollCue } from './scroll-cue'
import { useTheme } from './use-theme'

export function HeroSection() {
  const { theme } = useTheme()

  return (
    <div
      className={`relative min-h-[100svh] w-full flex flex-col items-center justify-center bg-gradient-to-b ${theme.hero.from} ${theme.hero.to} ${theme.hero.text.primary} px-4 py-24 overflow-hidden`}
    >
      {/* Content */}
      <div className="z-10 relative">
        <h1
          className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600`}
        >
          Building the Web
        </h1>
        <p
          className={`text-xl sm:text-2xl md:text-3xl max-w-3xl text-center mb-12 ${theme.hero.text.secondary}`}
        >
          Crafting immersive digital experiences with modern technologies and
          creative animations
        </p>
        <div className="mb-12 flex gap-4 justify-center">
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
