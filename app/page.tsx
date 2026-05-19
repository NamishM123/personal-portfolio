import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'

export default function Home() {
  return (
    <main className="bg-[#ffd1b3] min-h-screen">
      <Navbar />
      <HeroSection />
      <div className="border-t border-black/15">
        <ProjectsSection />
      </div>
      <div className="border-t border-black/15">
        <ExperienceSection />
      </div>
      <div className="border-t border-black/15">
        <SkillsSection />
      </div>
      <div className="border-t border-black/15">
        <ContactSection />
      </div>
    </main>
  )
}
