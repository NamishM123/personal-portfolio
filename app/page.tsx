import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ImpactSection } from '@/components/ImpactSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'
import { ScrollProgress } from '@/components/ui/scroll-progress'

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <ScrollProgress />
      <Navbar />
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
    </main>
  )
}
