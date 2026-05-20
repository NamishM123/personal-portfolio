import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'
import { ShaderBackground } from '@/components/ui/shader-background'

export default function Home() {
  return (
    <>
      <ShaderBackground dim={0.45} />
      <main className="relative min-h-screen">
        <Navbar />
        <HeroSection />
        <div className="border-t border-white/5">
          <ProjectsSection />
        </div>
        <div className="border-t border-white/5">
          <ExperienceSection />
        </div>
        <div className="border-t border-white/5">
          <SkillsSection />
        </div>
        <div className="border-t border-white/5">
          <ContactSection />
        </div>
      </main>
    </>
  )
}
