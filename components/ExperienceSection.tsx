'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { FlaskConical, Users, Rocket, Code2, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'

interface Experience {
  role: string
  company: string
  period: string
  icon: LucideIcon
  color: string
  ring: string
  glow: string
  bullets: string[]
}

const experiences: Experience[] = [
  {
    role: 'Undergraduate Researcher',
    company: 'AIEIC Lab, Cal Poly',
    period: 'May 2026 – Present',
    icon: FlaskConical,
    color: 'text-indigo-400',
    ring: 'ring-indigo-400',
    glow: 'from-indigo-500/15',
    bullets: [
      'Own the policy layer of an AI teaching assistant for CS lab courses, defining the multi-step workflow that validates, drafts and verifies each question and reply so students get guidance without full solutions — 200+ tracked sessions.',
      'Cut wait per question ~40% and token usage 30% by ranking retrieved context and caching repeat checks.',
      'Designed fallback behavior that keeps students supported when a model is down.',
    ],
  },
  {
    role: 'Project Lead',
    company: 'CS+AI, Cal Poly',
    period: 'Sep 2026 – Present',
    icon: Users,
    color: 'text-fuchsia-400',
    ring: 'ring-fuchsia-400',
    glow: 'from-fuchsia-500/15',
    bullets: [
      'Leading a student team building a multi-agent social simulation where AI personas interact, form relationships and react to events a user introduces.',
      'Running user-feedback sessions and turning what testers find confusing or compelling into specific changes and the next sprint’s priorities.',
    ],
  },
  {
    role: 'Co-founder',
    company: 'Benu · Remote',
    period: 'May 2025 – Jun 2026',
    icon: Rocket,
    color: 'text-rose-400',
    ring: 'ring-rose-400',
    glow: 'from-rose-500/15',
    bullets: [
      'Co-founded a restaurant ordering platform spanning guest checkout, a dense real-time kitchen display and an admin dashboard — 13 shared routes from one codebase, piloted across 3 restaurants and 150+ orders.',
      'Cut p95 response time from 2.3s to 380ms with Redis caching and connection pooling, keeping order status live for guests and kitchen staff during peak rush.',
    ],
  },
  {
    role: 'Tech Lead, CodeBox',
    company: 'Poly Problems · San Luis Obispo',
    period: 'Sep 2025 – Mar 2026',
    icon: Code2,
    color: 'text-emerald-400',
    ring: 'ring-emerald-400',
    glow: 'from-emerald-500/15',
    bullets: [
      'Led 10 engineers from problem framing to launch of a campus issue-reporting app on iOS and Android, reaching 120+ students; ran bi-weekly sprints, scoped each release and owned code review.',
      'Kept a map of 200+ reports readable with marker clustering that cut render time 45%; rate limiting blocked 100+ spam votes to keep issue rankings trustworthy.',
    ],
  },
]

export function ExperienceSection() {
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 0.6', 'end 0.6'],
  })
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section className="mx-auto max-w-5xl px-8 py-24 md:px-16" id="experience">
      <Reveal>
        <p className="mb-3 font-mono text-sm uppercase tracking-widest text-indigo-400">
          Where I&apos;ve worked
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mb-16 text-4xl font-bold text-white md:text-5xl">
          Experience
        </h2>
      </Reveal>

      <div ref={lineRef} className="relative">
        {/* Track + scroll-drawn progress line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-neutral-800 md:left-[13px]" />
        <motion.div
          style={{ scaleY }}
          className="absolute left-[9px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-emerald-400 md:left-[13px]"
        />

        <div className="space-y-10">
          {experiences.map((exp, i) => {
            const Icon = exp.icon
            return (
              <Reveal
                key={i}
                direction="up"
                delay={0.05}
                className="relative pl-12 md:pl-16"
              >
                {/* node */}
                <span
                  className={`absolute left-0 top-1 grid h-[19px] w-[19px] place-content-center rounded-full border border-neutral-700 bg-neutral-950 ring-2 ring-offset-2 ring-offset-black md:h-[27px] md:w-[27px] ${exp.ring}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full bg-current ${exp.color}`} />
                </span>

                <div
                  className={`group relative overflow-hidden rounded-2xl border border-neutral-800 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors duration-300 hover:border-neutral-700`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${exp.glow} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div className="mb-4 flex items-start gap-3">
                      <span className={exp.color}>
                        <Icon size={18} />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                        <p className="text-sm text-neutral-400">{exp.company}</p>
                        <p className="mt-0.5 font-mono text-xs text-neutral-600">
                          {exp.period}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {exp.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="flex gap-2 text-sm leading-relaxed text-neutral-300"
                        >
                          <span className={`mt-1 shrink-0 ${exp.color}`}>·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
