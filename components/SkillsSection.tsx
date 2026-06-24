'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { LeafGlyph } from '@/components/ui/ornaments'

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
    <section
      id="skills"
      className="relative py-28 px-8 md:px-16 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Watermark — sunlight through trees, on the left this time */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 -left-10 hidden md:block w-[40%] h-[55%] opacity-[0.16]"
        style={{
          maskImage: 'radial-gradient(ellipse at left, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at left, black 30%, transparent 75%)',
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1600&q=80"
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
          style={{ filter: 'sepia(0.45) saturate(0.7)' }}
        />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative mb-16 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 items-end"
      >
        {/* Field-guide plate */}
        <figure className="relative hidden md:block">
          <div className="plate aspect-[3/4] relative">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80"
              alt=""
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>
          <figcaption className="literary italic text-xs text-ink-muted mt-2 text-center">
            Plate ii. — <span className="not-italic">light through the canopy</span>
          </figcaption>
        </figure>

        <div>
          <p className="eyebrow mb-4 flex items-center gap-2">
            <LeafGlyph size={12} className="text-bark" />
            Chapter three — the toolkit
          </p>
          <h2 className="literary text-5xl md:text-6xl italic font-light text-ink leading-[1.05]">
            A small box of <span className="crimson">implements</span>.
          </h2>
          <p className="literary mt-5 max-w-xl text-lg italic text-ink-soft">
            The things kept on the desk — sharpened, dulled, sharpened again —
            for the daily writing of software.
          </p>
        </div>
      </motion.div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      className="paper-card p-7"
    >
      <h3 className="eyebrow mb-5 text-ink-soft flex items-center gap-2">
        <LeafGlyph size={10} className="text-bark" />
        {group.label}
      </h3>
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
