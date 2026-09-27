'use client'

import { motion } from 'framer-motion'
import { GitFork, Link, Mail } from 'lucide-react'
import { WorksWheel, type WorksWheelItem } from '@/components/ui/works-wheel'

// Bespoke cover art committed under /public/works. Swap any of these for a real
// app screenshot by dropping a file at the same path.
const works: WorksWheelItem[] = [
  { title: 'Usely', image: '/works/usely.svg', href: '#projects' },
  { title: 'Sightline', image: '/works/sightline.svg', href: '#projects' },
  { title: 'Starly', image: '/works/starly.svg', href: '#projects' },
  { title: 'Benu', image: '/works/benu.svg', href: '#projects' },
  {
    title: 'Poly Problems',
    image: '/works/poly-problems.svg',
    href: 'https://www.polyproblems.com/',
  },
  {
    title: 'Settlr',
    image: '/works/settlr.svg',
    href: 'https://housing-app-delta.vercel.app/',
  },
  {
    title: 'Recipe Vision',
    image: '/works/recipe-vision.svg',
    href: 'https://recepie-ingridients-aske.vercel.app/',
  },
  { title: 'FLEX', image: '/works/flex.svg', href: '#projects' },
]

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* The front page is now a turnable index of the work. Scroll or drag to
          spin the ring open into a drum; it releases the page at either end. */}
      <WorksWheel
        items={works}
        label="Namish Mannepalli"
        action="Open"
        className="h-full"
      />

      {/* Eyebrow — identity, top-left, clear of the wheel index */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="pointer-events-none absolute left-8 top-24 z-20 md:left-16"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-indigo-300 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
          CS @ Cal Poly SLO · Researcher · Builder
        </p>
      </motion.div>

      {/* Bottom overlay — tagline, links, and a turn hint */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-4 px-6 text-center"
      >
        <p className="max-w-md text-sm text-neutral-300 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] md:text-base">
          I build AI-powered products with real users. Turn the wheel to browse
          the work.
        </p>

        <div className="pointer-events-auto flex flex-wrap justify-center gap-3">
          <a
            href="https://github.com/namishm123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-sm text-neutral-200 backdrop-blur-sm transition-all hover:border-indigo-400 hover:text-white"
          >
            <GitFork size={16} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/namish-mannepalli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-sm text-neutral-200 backdrop-blur-sm transition-all hover:border-indigo-400 hover:text-white"
          >
            <Link size={16} /> LinkedIn
          </a>
          <a
            href="mailto:namishmannepalli2024@gmail.com"
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm text-white transition-all hover:bg-indigo-500"
          >
            <Mail size={16} /> Contact
          </a>
        </div>
      </motion.div>
    </section>
  )
}
