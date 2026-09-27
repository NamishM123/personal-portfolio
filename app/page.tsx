import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ImpactSection } from '@/components/ImpactSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { AmbientGlow } from '@/components/ui/ambient-glow'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <AmbientGlow />
      <ScrollProgress />

      <div className="relative z-10">
        <HeroSection />
        <div className="border-t border-neutral-900">
          <ProjectsSection />
        </div>
        <div className="border-t border-neutral-900">
          <ImpactSection />
        </div>
        <div className="border-t border-neutral-900">
          <ExperienceSection />
        </div>
        <div className="border-t border-neutral-900">
          <SkillsSection />
        </div>
        <div className="border-t border-neutral-900">
          <ContactSection />
        </div>
      </div>
    </main>
  )
}
