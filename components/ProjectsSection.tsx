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
    subtitle: 'A campus reporting app for Code Box.',
    actionText: 'Visit Poly Problems',
    href: 'https://www.polyproblems.com/',
    tags: ['React Native', 'Expo', 'Supabase', 'AI'],
  },
  {
    title: 'Starly',
    subtitle: 'An AI that rehearses interviews with you.',
    actionText: 'Hackathon Winner',
    href: '#',
    tags: ['Groq API', 'Deepgram', 'Hugging Face', 'Python'],
    badge: '2nd — Poly-Prompt',
  },
  {
    title: 'Settlr',
    subtitle: 'A map-led search for student housing.',
    actionText: 'Open Settlr',
    href: 'https://housing-app-delta.vercel.app/',
    tags: ['Next.js', 'Maps API', 'Geospatial', 'TypeScript'],
  },
  {
    title: 'Recipe Vision',
    subtitle: 'A photo becomes a recipe, by way of AI.',
    actionText: 'Try it',
    href: 'https://recepie-ingridients-aske.vercel.app/',
    tags: ['AI Vision', 'Image Gen', 'Next.js'],
  },
  {
    title: 'Seagull',
    subtitle: 'A quiet companion for TRT / HRT routines.',
    actionText: 'View App',
    href: 'https://vercel.com/namishm123s-projects/raccoon',
    tags: ['Health Tech', 'React', 'TypeScript'],
  },
  {
    title: 'Benu',
    subtitle: 'A restaurant ordering platform, conversational.',
    actionText: 'AI Team Project',
    href: '#',
    tags: ['Next.js 15', 'OpenAI', 'React 19', 'Realtime'],
  },
  {
    title: 'FLEX',
    subtitle: 'A workout tracker built around progressive overload.',
    actionText: 'Progressive Overload Engine',
    href: '#',
    tags: ['React', 'REST API', 'JWT', 'Tailwind'],
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-28 px-8 md:px-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="eyebrow mb-4">Chapter one — works</p>
        <h2 className="literary text-5xl md:text-6xl italic font-light text-ink">
          A small <span className="crimson">field guide</span> of things I&apos;ve made.
        </h2>
        <p className="literary mt-4 max-w-xl text-lg italic text-ink-soft">
          Each entry is a real product with real readers — shipped, broken,
          mended, and sometimes won.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-12">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
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
              viewMoreLabel={project.href !== '#' ? 'Read on' : 'Soon'}
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
