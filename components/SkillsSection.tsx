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
        <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">
          What I work with
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Skills</h2>
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
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.08),transparent_55%)]" />
      <h3 className="relative text-xs font-mono text-indigo-300 tracking-widest uppercase mb-4">
        {group.label}
      </h3>
      <div className="relative flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-full text-sm bg-white/[0.03] text-neutral-200 border border-white/10 hover:border-indigo-400/50 hover:text-white hover:bg-white/[0.06] transition-all backdrop-blur-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
