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
        <p className="text-orange-700 font-mono text-sm tracking-widest uppercase mb-3">
          What I work with
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">Skills</h2>
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
      className="rounded-2xl border border-black/20 bg-black p-6"
    >
      <h3 className="text-xs font-mono text-orange-300 tracking-widest uppercase mb-4">
        {group.label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-full text-sm bg-[#1a1a1a] text-[#ffe6d1] border border-[#ffd1b3]/30 hover:border-[#ffd1b3] hover:text-white transition-all"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
