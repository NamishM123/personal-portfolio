'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const skillGroups = [
  {
    label: 'Languages',
    skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'C', 'Assembly'],
  },
  {
    label: 'Frontend',
    skills: ['React', 'React Native', 'Next.js 15', 'Expo', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    label: 'Backend & DB',
    skills: ['Node.js', 'REST APIs', 'Supabase', 'PostgreSQL', 'JWT', 'Prisma'],
  },
  {
    label: 'AI & ML',
    skills: ['OpenAI GPT-4o', 'Groq API', 'Hugging Face', 'Deepgram', 'LangChain', 'Computer Vision'],
  },
  {
    label: 'Security',
    skills: ['CVE Analysis', 'Graph Theory', 'Anomaly Detection', 'Dependency Auditing', 'GitHub APIs'],
  },
  {
    label: 'Tools & Infra',
    skills: ['Git', 'Vercel', 'Docker', 'GitHub Actions', 'Figma'],
  },
]

export function SkillsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto" id="skills">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <p className="text-accent font-mono text-[11px] tracking-[0.3em] uppercase mb-3">
          ☞ Chapter III — Implements & tools
        </p>
        <h2 className="font-serif text-5xl md:text-6xl text-ink mb-4 tracking-tight">
          The <span className="italic text-accent">writing kit</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillGroups.map((group, gi) => (
          <SkillGroup key={group.label} group={group} index={gi} />
        ))}
      </div>
    </section>
  )
}

function SkillGroup({ group, index }: { group: typeof skillGroups[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-sm border border-border-soft bg-paper p-6 paper-grain"
    >
      <h3 className="text-[10px] font-mono text-accent tracking-[0.3em] uppercase mb-4">
        ¶ {group.label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-none text-sm font-serif italic bg-background text-ink-soft border border-border hover:border-ink hover:text-ink transition-all"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
