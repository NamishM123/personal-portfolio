'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { DeckCard, type DeckCardData } from '@/components/ui/deck-card'
import { SpineBackground } from '@/components/ui/spine-background'

const projects: DeckCardData[] = [
  {
    title: 'Poly Problems',
    subtitle: 'Campus Reporting App · Code Box',
    imageUrl:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
    actionText: 'Visit Poly Problems',
    href: 'https://www.polyproblems.com/',
    tags: ['React Native', 'Expo', 'Supabase', 'AI'],
  },
  {
    title: 'Starly',
    subtitle: 'AI Mock Interview Platform',
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop',
    actionText: 'Hackathon Winner',
    href: '#',
    tags: ['Groq API', 'Deepgram', 'Hugging Face', 'Python'],
    badge: '2nd — Poly-Prompt',
  },
  {
    title: 'Settlr',
    subtitle: 'Map-Based Housing App',
    imageUrl:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop',
    actionText: 'Open Settlr',
    href: 'https://housing-app-delta.vercel.app/',
    tags: ['Next.js', 'Maps API', 'Geospatial', 'TypeScript'],
  },
  {
    title: 'Recipe Vision',
    subtitle: 'AI Recipe Generator from Photos',
    imageUrl:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop',
    actionText: 'Try it',
    href: 'https://recepie-ingridients-aske.vercel.app/',
    tags: ['AI Vision', 'Image Gen', 'Next.js'],
  },
  {
    title: 'Seagull',
    subtitle: 'TRT / HRT Companion App',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
    actionText: 'View App',
    href: 'https://vercel.com/namishm123s-projects/raccoon',
    tags: ['Health Tech', 'React', 'TypeScript'],
  },
  {
    title: 'Benu',
    subtitle: 'AI Restaurant Ordering Platform',
    imageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop',
    actionText: 'AI Team Project',
    href: '#',
    tags: ['Next.js 15', 'OpenAI', 'React 19', 'Realtime'],
  },
  {
    title: 'FLEX',
    subtitle: 'Workout Tracking App',
    imageUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    actionText: 'Progressive Overload Engine',
    href: '#',
    tags: ['React', 'REST API', 'JWT', 'Tailwind'],
  },
]

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
  })

  // Header fades out as the deck takes over
  const headerOpacity = useTransform(smooth, [0, 0.04, 0.1], [1, 1, 0])
  const headerY = useTransform(smooth, [0, 0.1], [0, -40])

  // Counter for current card index (display only)
  const counter = useTransform(smooth, (v) =>
    String(Math.min(projects.length, Math.floor(v * projects.length) + 1)).padStart(2, '0')
  )

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative"
      style={{ height: `${projects.length * 90 + 60}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Header overlay */}
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute top-24 left-8 z-30 md:left-16"
        >
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-pink-300/80">
            What I've built
          </p>
          <h2 className="text-4xl font-bold text-white md:text-6xl">Projects</h2>
          <p className="mt-4 max-w-md text-neutral-400">
            Scroll to flip through — real products shipped to real users.
          </p>
        </motion.div>

        {/* Progress counter */}
        <div className="absolute bottom-10 left-8 z-30 md:left-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            Project
          </div>
          <div className="mt-1 flex items-baseline gap-2 font-mono text-white/90">
            <motion.span className="text-5xl font-bold">{counter}</motion.span>
            <span className="text-lg text-white/40">
              / {String(projects.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Spine */}
        <SpineBackground progress={smooth} count={32} />

        {/* Cards */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ perspective: '1800px' }}
        >
          {projects.map((project, i) => (
            <DeckCard
              key={project.title}
              data={project}
              index={i}
              total={projects.length}
              progress={smooth}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
