'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GraduationCap, ShieldHalf, Terminal, Sparkles } from 'lucide-react'

const now = [
  {
    icon: <Terminal size={16} />,
    label: 'Leading',
    value: 'Poly Problems @ Code Box',
    note: 'A 10-person team shipping a campus reporting app to real users.',
  },
  {
    icon: <ShieldHalf size={16} />,
    label: 'Researching',
    value: 'Supply-chain risk @ Cal Poly',
    note: 'Graph theory and anomaly detection over GitHub, NPM, and CVE data.',
  },
  {
    icon: <Sparkles size={16} />,
    label: 'Building',
    value: 'Benu ordering platform',
    note: 'An allergen-first GPT-4o-mini assistant with safety guardrails.',
  },
  {
    icon: <GraduationCap size={16} />,
    label: 'Studying',
    value: 'BS Computer Science',
    note: 'Cal Poly San Luis Obispo.',
  },
]

const focus = [
  'Full-stack product',
  'React Native',
  'Applied AI',
  'Offensive security',
  'Developer tooling',
]

export function AboutSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section id="about" className="relative px-6 py-28 sm:px-8 md:px-16 md:py-40">
      {/* Scrim: darkest under the copy column, clearing toward the right so the
          backdrop stays visible around the panel */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/75 lg:hidden" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(100deg, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.86) 42%, rgba(0,0,0,0.5) 68%, rgba(0,0,0,0.2) 88%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      <div ref={ref} className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-indigo-300/80">
            About me
          </p>

          <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
            I build things that ship, then take them apart to see where they break.
          </h2>

          <div className="mt-7 max-w-xl space-y-5 text-[15px] leading-relaxed text-neutral-300/90 sm:text-base">
            <p>
              I&apos;m Namish, a computer science student at Cal Poly San Luis Obispo.
              Most of my time splits between two things I find hard to separate:
              building products people actually use, and studying how the software
              underneath them fails.
            </p>
            <p>
              On the building side that means React Native and Next.js front ends,
              Supabase and Node services behind them, and LLM features that have to
              behave under pressure — allergen safety, prompt-injection guardrails,
              multilingual input. On the breaking side it means mapping open-source
              ecosystems as graphs and hunting the anomalies that precede a
              compromised release.
            </p>
            <p className="text-neutral-400">
              Currently open to internships and collaborations. The fastest way to
              reach me is{' '}
              <a
                href="mailto:namishmannepalli2024@gmail.com"
                className="text-indigo-300 underline decoration-indigo-400/30 underline-offset-4 transition-colors hover:text-indigo-200 hover:decoration-indigo-300/60"
              >
                email
              </a>
              .
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {focus.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.06 }}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-300 backdrop-blur-sm"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right-hand "currently" panel */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="self-start rounded-2xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-md"
        >
          <div className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-transparent">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
                Right now
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-300/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                open to work
              </span>
            </div>

            <ul className="divide-y divide-white/[0.06]">
              {now.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.09 }}
                  className="group flex gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="mt-0.5 text-indigo-300/60 transition-colors group-hover:text-indigo-300">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
                    <p className="mt-1 text-[13px] leading-snug text-neutral-400">
                      {item.note}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
