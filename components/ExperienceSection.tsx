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
    accent: 'text-emerald-800',
    border: 'border-emerald-900/20',
    wash: 'bg-emerald-900/[0.03]',
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
    accent: 'text-sky-900',
    border: 'border-sky-900/20',
    wash: 'bg-sky-900/[0.03]',
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
    accent: 'text-amber-800',
    border: 'border-amber-900/20',
    wash: 'bg-amber-900/[0.03]',
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
        <p className="text-accent font-mono text-[11px] tracking-[0.3em] uppercase mb-3">
          ☞ Chapter II — A working chronicle
        </p>
        <h2 className="font-serif text-5xl md:text-6xl text-ink mb-4 tracking-tight">
          <span className="italic text-accent">Experience</span>, in order
        </h2>
      </motion.div>

      <div className="relative">
        {/* Margin rule, like a notebook */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`relative md:ml-16 overflow-hidden rounded-sm border ${exp.border} bg-paper p-7 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_45px_-25px_rgba(20,15,10,0.25)] paper-grain`}
            >
              <div className={`pointer-events-none absolute inset-0 ${exp.wash}`} />

              {/* Inkwell dot on the timeline */}
              <div
                className={`absolute -left-[2.9rem] top-7 hidden h-3 w-3 rounded-full bg-background ring-1 ring-border md:block ${exp.accent.replace(
                  'text-',
                  'after:bg-'
                )}`}
              >
                <span className={`absolute inset-0.5 rounded-full ${exp.accent.replace('text-', 'bg-')}`} />
              </div>

              <div className="relative">
                <div className="flex items-start gap-3 mb-4">
                  <span className={exp.accent}>{exp.icon}</span>
                  <div>
                    <h3 className="font-serif text-2xl text-ink leading-tight">{exp.role}</h3>
                    <p className="text-ink-soft text-sm">{exp.company}</p>
                    <p className="text-muted-foreground text-[10px] font-mono tracking-[0.2em] uppercase mt-1">
                      {exp.period}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft font-serif">
                      <span className="text-accent mt-0.5 shrink-0">§</span>
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
