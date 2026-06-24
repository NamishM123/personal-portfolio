import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <HeroSection />
      <div className="border-t border-border-soft">
        <ProjectsSection />
      </div>
      <div className="border-t border-border-soft">
        <ExperienceSection />
      </div>
      <div className="border-t border-border-soft">
        <SkillsSection />
      </div>
      <div className="border-t border-border-soft">
        <ContactSection />
      </div>
    </main>
  )
}
