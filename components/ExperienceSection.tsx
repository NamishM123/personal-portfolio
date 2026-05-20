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
    color: 'text-green-400',
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
    bullets: [
      'Led a 10-person team building Poly Problems, a mobile-first campus reporting app with SSO auth and AI-powered classification.',
      'Delegated tasks and coordinated sprints across frontend, backend, and AI to ensure steady on-time progress.',
      'Architected React Native frontend with Supabase Auth, Database, and RESTful APIs for secure geotagged submissions.',
      'Optimized async data fetching, reducing API response time and improving overall application responsiveness.',
    ],
  },
  {
    role: 'Cybersecurity Intern',
    company: 'Cal Poly State University, SLO',
    period: 'Dec 2025 – Present',
    icon: <Shield size={18} />,
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    bullets: [
      'Built AI-powered Python pipelines analyzing open-source ecosystems using GitHub, NPM, and CVE data.',
      'Leveraged graph theory and ML-based anomaly detection to uncover dependency and contributor risks.',
      'Hosted a public GitHub repository implementing automated red-flag detection for vulnerable dependencies and suspicious releases.',
      'Validated blue-flag heuristics assessing positive trust signals — active maintenance, signed commits, rapid patching.',
    ],
  },
  {
    role: 'AI Team Member',
    company: 'Benu Restaurant Platform',
    period: 'Dec 2025 – Present',
    icon: <Bot size={18} />,
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/5',
    bullets: [
      'Built a mobile-first restaurant ordering platform using Next.js 15, React 19, and TypeScript with QR-code ordering.',
      'Engineered an OpenAI GPT-4o-mini chatbot with allergen-first safety architecture and medical emergency override detection.',
      'Designed a multilingual conversational commerce system with automatic language detection and anti-prompt-injection guardrails.',
    ],
  },
]

export function ExperienceSection() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto" id="experience">
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">
          Where I've worked
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Experience</h2>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-neutral-800 hidden md:block" />

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`relative md:ml-16 overflow-hidden rounded-2xl border ${exp.border} bg-white/[0.02] p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(255,255,255,0.04),0_20px_60px_-20px_rgba(0,0,0,0.6)]`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.12),transparent_55%)]" />
              <div className={`pointer-events-none absolute inset-0 ${exp.bg} opacity-50`} />

              <div
                className={`absolute -left-[2.85rem] top-6 w-3 h-3 rounded-full border-2 border-neutral-800 bg-neutral-950 hidden md:block ring-2 ring-offset-2 ring-offset-black ${exp.color.replace(
                  'text-',
                  'ring-'
                )}`}
              />

              <div className="relative">
                <div className="flex items-start gap-3 mb-4">
                  <span className={exp.color}>{exp.icon}</span>
                  <div>
                    <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                    <p className="text-neutral-400 text-sm">{exp.company}</p>
                    <p className="text-neutral-600 text-xs font-mono mt-0.5">{exp.period}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 text-sm text-neutral-300">
                      <span className="text-neutral-600 mt-1 shrink-0">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
