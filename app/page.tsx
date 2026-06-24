import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'
import { BranchRule } from '@/components/ui/ornaments'

export default function Home() {
  return (
    <main className="relative bg-paper min-h-screen text-ink">
      <Navbar />
      <HeroSection />

      <div className="max-w-5xl mx-auto px-8 pt-10">
        <BranchRule />
      </div>
      <ProjectsSection />

      {/* Experience is its own dark band — no rule before it */}
      <ExperienceSection />

      <div className="max-w-5xl mx-auto px-8 pt-10">
        <BranchRule />
      </div>
      <SkillsSection />

      <div className="max-w-5xl mx-auto px-8 pt-10">
        <BranchRule />
      </div>
      <ContactSection />
    </main>
  )
}
