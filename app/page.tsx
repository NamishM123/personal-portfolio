import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'

export default function Home() {
  return (
    <main className="relative bg-paper min-h-screen text-ink">
      <Navbar />
      <HeroSection />
      <div className="relative">
        <div className="rule-thin max-w-5xl mx-auto" />
        <ProjectsSection />
      </div>
      <div className="relative">
        <div className="rule-thin max-w-5xl mx-auto" />
        <ExperienceSection />
      </div>
      <div className="relative">
        <div className="rule-thin max-w-5xl mx-auto" />
        <SkillsSection />
      </div>
      <div className="relative">
        <div className="rule-thin max-w-5xl mx-auto" />
        <ContactSection />
      </div>
    </main>
  )
}
