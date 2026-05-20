'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { ScrollTiltCard } from '@/components/ui/scroll-tilt-card'

interface Project {
  title: string
  subtitle: string
  actionText: string
  href: string
  tags?: string[]
  badge?: string
}

const projects: Project[] = [
  {
    title: 'Poly Problems',
    subtitle: 'Campus Reporting App · Code Box',
    actionText: 'Visit Poly Problems',
    href: 'https://www.polyproblems.com/',
    tags: ['React Native', 'Expo', 'Supabase', 'AI'],
  },
  {
    title: 'Starly',
    subtitle: 'AI Mock Interview Platform',
    actionText: 'Hackathon Winner',
    href: '#',
    tags: ['Groq API', 'Deepgram', 'Hugging Face', 'Python'],
    badge: '2nd — Poly-Prompt',
  },
  {
    title: 'Settlr',
    subtitle: 'Map-Based Housing App',
    actionText: 'Open Settlr',
    href: 'https://housing-app-delta.vercel.app/',
    tags: ['Next.js', 'Maps API', 'Geospatial', 'TypeScript'],
  },
  {
    title: 'Recipe Vision',
    subtitle: 'AI Recipe Generator from Photos',
    actionText: 'Try it',
    href: 'https://recepie-ingridients-aske.vercel.app/',
    tags: ['AI Vision', 'Image Gen', 'Next.js'],
  },
  {
    title: 'Seagull',
    subtitle: 'TRT / HRT Companion App',
    actionText: 'View App',
    href: 'https://vercel.com/namishm123s-projects/raccoon',
    tags: ['Health Tech', 'React', 'TypeScript'],
  },
  {
    title: 'Benu',
    subtitle: 'AI Restaurant Ordering Platform',
    actionText: 'AI Team Project',
    href: '#',
    tags: ['Next.js 15', 'OpenAI', 'React 19', 'Realtime'],
  },
  {
    title: 'FLEX',
    subtitle: 'Workout Tracking App',
    actionText: 'Progressive Overload Engine',
    href: '#',
    tags: ['React', 'REST API', 'JWT', 'Tailwind'],
  },
]

export function ProjectsSection() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true })

  return (
    <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto" id="projects">
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
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

      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-14 py-[15vh] sm:grid-cols-2">
        {projects.map((project, i) => (
          <ScrollTiltCard key={project.title} side={i % 2 === 0 ? 'L' : 'R'}>
            <ProjectCard project={project} index={i} />
          </ScrollTiltCard>
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <a
      href={project.href}
      target={project.href !== '#' ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.02] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.04),0_20px_60px_-20px_rgba(0,0,0,0.6)] transition-all hover:border-indigo-400/40 hover:bg-white/[0.05]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-500/[0.06]" />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <span className="font-mono text-xs tracking-widest text-neutral-500">
            {String(index + 1).padStart(2, '0')}
          </span>
          <ArrowUpRight className="h-4 w-4 text-neutral-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>

        {project.badge && (
          <span className="mb-3 inline-block w-fit rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-yellow-300 backdrop-blur-sm">
            ★ {project.badge}
          </span>
        )}

        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <p className="mt-1 text-sm text-neutral-400">{project.subtitle}</p>

        {project.tags && project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/15 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-300 backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="mt-5 text-sm font-medium text-indigo-400 group-hover:text-indigo-300">
          {project.actionText} →
        </p>
      </div>
    </a>
  )
}
