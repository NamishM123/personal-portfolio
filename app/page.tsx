import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'
import { AsciiEffect } from '@/components/ui/ascii-effect'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/*
        Hero and About share one pinned backdrop. The sticky canvas is pulled
        back out of the flow with a negative margin so both sections scroll
        over it, then it releases at the bottom of the container.
      */}
      <div className="relative">
        <div className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen">
          <AsciiEffect />
        </div>

        <div className="relative z-10">
          <HeroSection />
          <AboutSection />
        </div>

        {/* hand off to the black sections below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-72 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="relative z-10 bg-black">
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
      </div>
    </main>
  )
}
