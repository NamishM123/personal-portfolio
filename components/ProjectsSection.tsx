'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
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
      className="group relative flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 transition-colors hover:border-indigo-500/50 hover:bg-neutral-900/70"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="font-mono text-xs tracking-widest text-neutral-500">
          {String(index + 1).padStart(2, '0')}
        </span>
        <ArrowUpRight className="h-4 w-4 text-neutral-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
      </div>

      {project.badge && (
        <span className="mb-3 inline-block w-fit rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-yellow-300">
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
              className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-5 text-sm font-medium text-indigo-400 group-hover:text-indigo-300">
        {project.actionText} →
      </p>
    </a>
  )
}
