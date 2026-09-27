'use client'

import { PrismaHero } from '@/components/ui/prisma-hero'

export function HeroSection() {
  return (
    <PrismaHero
      title="Namish"
      showAsterisk
      navItems={[
        { label: 'Work', href: '#journey' },
        { label: 'Impact', href: '#impact' },
        { label: 'Experience', href: '#experience' },
        { label: 'Skills', href: '#skills' },
        { label: 'Contact', href: '#contact' },
      ]}
      description="Namish Mannepalli — CS at Cal Poly SLO, undergraduate researcher and founder building AI-powered products with real users, from a teaching assistant that guides without giving answers to a restaurant platform serving live orders."
      ctaLabel="Get in touch"
      ctaHref="#contact"
      videoSrc="/hero.mp4"
    />
  )
}
