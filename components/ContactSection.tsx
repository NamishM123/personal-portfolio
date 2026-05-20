'use client'

import Hero from '@/components/ui/animated-shader-hero'

export function ContactSection() {
  return (
    <section id="contact" className="relative">
      <Hero
        trustBadge={{
          text: 'Available for internships & collaborations',
          icons: ['◆'],
        }}
        headline={{
          line1: "Let's build",
          line2: 'something together.',
        }}
        subtitle="I'm always open to interesting projects and collaborations. Reach out — I reply fast."
        buttons={{
          primary: {
            text: 'Email me',
            href: 'mailto:namishmannepalli2024@gmail.com',
          },
          secondary: {
            text: 'GitHub',
            href: 'https://github.com/namishm123',
          },
        }}
      />

      <footer className="relative z-10 -mt-16 pb-8 text-center text-neutral-500 text-xs font-mono">
        © 2026 Namish Mannepalli · Built with Next.js, Tailwind CSS, Framer Motion
      </footer>
    </section>
  )
}
