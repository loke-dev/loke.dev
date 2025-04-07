import { CodeTypingSection } from './code-typing-section'
import { FrameworksSection } from './frameworks-section'
import { HeroSection } from './hero-section'
import { ParticlesSection } from './particles-section'
import { ResponsiveDesignSection } from './responsive-design-section'
import { defaultTheme } from './theme'
import { ThemeProvider } from './theme-context'

export function TechLanding() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className="flex flex-col items-center w-full overflow-x-hidden">
        <HeroSection />
        <CodeTypingSection />
        <FrameworksSection />
        <ResponsiveDesignSection />
        <ParticlesSection />
      </div>
    </ThemeProvider>
  )
}
