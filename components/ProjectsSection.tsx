'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { InteractiveTravelCard } from '@/components/ui/3d-card'
import { SpineBackground } from '@/components/ui/spine-background'

const projects = [
  {
    title: 'Poly Problems',
    subtitle: 'Campus Reporting App · Code Box',
    date: 'Dec 2025 – Present',
    actionText: 'Visit Poly Problems',
    href: 'https://www.polyproblems.com/',
    tags: ['React Native', 'Expo', 'Supabase', 'AI'],
    badge: undefined,
  },
  {
    title: 'Starly',
    subtitle: 'AI Mock Interview Platform',
    date: 'Apr 2026 – Present',
    actionText: 'Hackathon Winner',
    href: '#',
    tags: ['Groq API', 'Deepgram', 'Hugging Face', 'Python'],
    badge: '2nd — Poly-Prompt',
  },
  {
    title: 'Settlr',
    subtitle: 'Map-Based Housing App',
    date: 'Mar 2026 – Present',
    actionText: 'Open Settlr',
    href: 'https://housing-app-delta.vercel.app/',
    tags: ['Next.js', 'Maps API', 'Geospatial', 'TypeScript'],
    badge: undefined,
  },
  {
    title: 'Recipe Vision',
    subtitle: 'AI Recipe Generator from Photos',
    date: '2025',
    actionText: 'Try it',
    href: 'https://recepie-ingridients-aske.vercel.app/',
    tags: ['AI Vision', 'Image Gen', 'Next.js'],
    badge: undefined,
  },
  {
    title: 'Seagull',
    subtitle: 'TRT / HRT Companion App',
    date: '2025',
    actionText: 'View App',
    href: 'https://vercel.com/namishm123s-projects/raccoon',
    tags: ['Health Tech', 'React', 'TypeScript'],
    badge: undefined,
  },
  {
    title: 'Benu',
    subtitle: 'AI Restaurant Ordering Platform',
    date: 'Dec 2025 – Present',
    actionText: 'AI Team Project',
    href: '#',
    tags: ['Next.js 15', 'OpenAI', 'React 19', 'Realtime'],
    badge: undefined,
  },
  {
    title: 'FLEX',
    subtitle: 'Workout Tracking App',
    date: 'Jan 2025 – Present',
    actionText: 'Progressive Overload Engine',
    href: '#',
    tags: ['React', 'REST API', 'JWT', 'Tailwind'],
    badge: undefined,
  },
]

export function ProjectsSection() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true })
  const gridRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto" id="projects">
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">
          What I've built
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Projects</h2>
        <p className="text-neutral-400 max-w-xl">
          Real products shipped to real users — from hackathon winners to production apps.
        </p>
      </motion.div>

      <div
        ref={gridRef}
        className="relative"
        style={{ perspective: '1800px' }}
      >
        <SpineBackground targetRef={gridRef} />

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <InteractiveTravelCard
              key={project.title}
              title={project.title}
              subtitle={project.subtitle}
              actionText={project.actionText}
              href={project.href}
              tags={project.tags}
              badge={project.badge}
              index={index}
              onActionClick={
                project.href !== '#'
                  ? () => window.open(project.href, '_blank')
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}
