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
    <section className="relative py-28 px-8 md:px-16 max-w-7xl mx-auto" id="skills">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <p className="eyebrow mb-4">Chapter three — the toolkit</p>
        <h2 className="literary text-5xl md:text-6xl italic font-light text-ink">
          A small box of <span className="crimson">implements</span>.
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

function SkillGroup({
  group,
  index,
}: {
  group: (typeof skillGroups)[0]
  index: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl border border-rule bg-paper-2/55 p-7 shadow-[0_20px_50px_-30px_rgba(58,40,18,0.3)]"
    >
      <h3 className="eyebrow mb-5 text-ink-soft">{group.label}</h3>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="literary italic px-3 py-1 rounded-full text-sm text-ink-soft bg-paper border border-rule hover:border-crimson hover:text-ink transition-all"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
