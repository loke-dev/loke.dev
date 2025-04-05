import { CodeTypingSection } from './code-typing-section'
import { FrameworksSection } from './frameworks-section'
import { HeroSection } from './hero-section'
import { ParticlesSection } from './particles-section'
import { ResponsiveDesignSection } from './responsive-design-section'

export function TechLanding() {
  return (
    <div className="flex flex-col items-center min-h-[400vh]">
      <HeroSection />
      <CodeTypingSection />
      <FrameworksSection />
      <ResponsiveDesignSection />
      <ParticlesSection />
    </div>
  )
}
