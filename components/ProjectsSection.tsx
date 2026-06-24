'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import GlassCard from '@/components/ui/glass-card'

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
  return (
    <section id="projects" className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="text-accent font-mono text-[11px] tracking-[0.3em] uppercase mb-3">
          ☞ Chapter I — Works on paper
        </p>
        <h2 className="font-serif text-5xl md:text-6xl text-ink mb-4 tracking-tight">
          Selected <span className="italic text-accent">projects</span>
        </h2>
        <p className="text-ink-soft max-w-xl font-serif text-lg italic">
          Real products shipped to real users — hackathon victories, production apps,
          and quiet little tools that mattered to someone.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-12">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
          >
            <GlassCard
              title={project.title}
              description={project.subtitle}
              tags={project.tags}
              badge={project.badge}
              viewMoreHref={project.href}
              viewMoreLabel={project.href !== '#' ? 'Visit' : 'Soon'}
              links={
                project.href !== '#'
                  ? [{ icon: ExternalLink, href: project.href, label: `Open ${project.title}` }]
                  : []
              }
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
