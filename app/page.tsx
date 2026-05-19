import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <HeroSection />
      <div className="border-t border-neutral-900">
        <ProjectsSection />
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
