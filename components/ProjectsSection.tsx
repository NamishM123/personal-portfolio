'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { InteractiveTravelCard } from '@/components/ui/3d-card'

const projects = [
  {
    title: 'Poly Problems',
    subtitle: 'Campus Reporting App · Code Box',
    date: 'Dec 2025 – Present',
    imageUrl:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
    actionText: 'Visit Poly Problems →',
    href: 'https://www.polyproblems.com/',
    tags: ['React Native', 'Expo', 'Supabase', 'AI'],
    badge: undefined,
  },
  {
    title: 'Starly',
    subtitle: 'AI Mock Interview Platform',
    date: 'Apr 2026 – Present',
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop',
    actionText: 'Hackathon Winner',
    href: '#',
    tags: ['Groq API', 'Deepgram', 'Hugging Face', 'Python'],
    badge: '2nd Place — Poly-Prompt Hackathon',
  },
  {
    title: 'Settlr',
    subtitle: 'Map-Based Housing App',
    date: 'Mar 2026 – Present',
    imageUrl:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop',
    actionText: 'Open Settlr →',
    href: 'https://housing-app-delta.vercel.app/',
    tags: ['Next.js', 'Maps API', 'Geospatial', 'TypeScript'],
    badge: undefined,
  },
  {
    title: 'Recipe Vision',
    subtitle: 'AI Recipe Generator from Photos',
    date: '2025',
    imageUrl:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop',
    actionText: 'Try it →',
    href: 'https://recepie-ingridients-aske.vercel.app/',
    tags: ['AI Vision', 'Image Gen', 'Next.js'],
    badge: undefined,
  },
  {
    title: 'Seagull',
    subtitle: 'TRT / HRT Companion App',
    date: '2025',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
    actionText: 'View App →',
    href: 'https://vercel.com/namishm123s-projects/raccoon',
    tags: ['Health Tech', 'React', 'TypeScript'],
    badge: undefined,
  },
  {
    title: 'Benu',
    subtitle: 'AI Restaurant Ordering Platform',
    date: 'Dec 2025 – Present',
    imageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop',
    actionText: 'AI Team Project',
    href: '#',
    tags: ['Next.js 15', 'OpenAI', 'React 19', 'Realtime'],
    badge: undefined,
  },
  {
    title: 'FLEX',
    subtitle: 'Workout Tracking App',
    date: 'Jan 2025 – Present',
    imageUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    actionText: 'Progressive Overload Engine',
    href: '#',
    tags: ['React', 'REST API', 'JWT', 'Tailwind'],
    badge: undefined,
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        style={{ perspective: '1200px' }}
      >
        {projects.map((project, index) => (
          <ProjectEntry key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

function ProjectEntry({
  project,
  index,
}: {
  project: (typeof projects)[0]
  index: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <InteractiveTravelCard
        title={project.title}
        subtitle={project.subtitle}
        imageUrl={project.imageUrl}
        actionText={project.actionText}
        href={project.href}
        tags={project.tags}
        badge={project.badge}
        onActionClick={
          project.href !== '#'
            ? () => window.open(project.href, '_blank')
            : undefined
        }
        className="w-full"
      />
    </motion.div>
  )
}
