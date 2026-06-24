'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Code2, Bot } from 'lucide-react'

const experiences = [
  {
    role: 'Project Lead',
    company: 'Code Box',
    period: 'Dec 2025 – Present',
    icon: <Code2 size={18} />,
    accent: '#4a5a3a', // moss
    bullets: [
      'Led a ten-person team building Poly Problems — a mobile-first campus reporting app with SSO and AI-driven classification.',
      'Coordinated sprints across frontend, backend, and AI so the work moved as one quiet river.',
      'Architected the React Native frontend with Supabase Auth, Database, and RESTful APIs for secure geotagged submissions.',
      'Optimized async data fetching, shortening API response times and softening the app in the hand.',
    ],
  },
  {
    role: 'Cybersecurity Intern',
    company: 'Cal Poly State University, SLO',
    period: 'Dec 2025 – Present',
    icon: <Shield size={18} />,
    accent: '#9a1f2b', // crimson
    bullets: [
      'Built AI-powered Python pipelines reading open-source ecosystems by way of GitHub, NPM, and CVE data.',
      'Used graph theory and ML anomaly detection to surface dependency and contributor risks.',
      'Published a public repository implementing automated red-flag detection for vulnerable dependencies and suspicious releases.',
      'Validated blue-flag heuristics — active maintenance, signed commits, rapid patching — as positive trust signals.',
    ],
  },
  {
    role: 'AI Team Member',
    company: 'Benu Restaurant Platform',
    period: 'Dec 2025 – Present',
    icon: <Bot size={18} />,
    accent: '#b88a3f', // ochre
    bullets: [
      'Built a mobile-first restaurant ordering platform with Next.js 15, React 19, and TypeScript — QR-code ordering at the table.',
      'Engineered an OpenAI GPT-4o-mini chatbot with allergen-first safety architecture and medical emergency override detection.',
      'Designed a multilingual conversational commerce system with automatic language detection and anti-prompt-injection guardrails.',
    ],
  },
]

export function ExperienceSection() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <section className="relative py-28 px-8 md:px-16 max-w-7xl mx-auto" id="experience">
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="eyebrow mb-4">Chapter two — letters from work</p>
        <h2 className="literary text-5xl md:text-6xl italic font-light text-ink">
          Places I have <span className="crimson">written from</span>.
        </h2>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-rule hidden md:block" />

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative md:ml-16 overflow-hidden rounded-2xl border border-rule bg-paper-2/60 p-7 backdrop-blur-sm shadow-[0_20px_50px_-30px_rgba(58,40,18,0.35)]"
            >
              {/* Timeline dot */}
              <div
                className="absolute -left-[2.85rem] top-7 hidden md:block h-3 w-3 rounded-full border-2 border-paper"
                style={{ backgroundColor: exp.accent }}
              />

              <div className="flex items-start gap-3 mb-5">
                <span style={{ color: exp.accent }}>{exp.icon}</span>
                <div>
                  <h3 className="literary italic text-xl text-ink leading-tight">
                    {exp.role}
                    <span className="text-ink-muted not-italic"> — </span>
                    <span className="literary italic" style={{ color: exp.accent }}>
                      {exp.company}
                    </span>
                  </h3>
                  <p className="eyebrow mt-1.5">{exp.period}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {exp.bullets.map((b, j) => (
                  <li
                    key={j}
                    className="literary flex gap-3 text-[15px] leading-relaxed text-ink-soft"
                  >
                    <span className="crimson shrink-0 mt-2">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
