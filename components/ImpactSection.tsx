'use client'

import { CountUp } from '@/components/ui/count-up'
import { Reveal } from '@/components/ui/reveal'
import { ScrollRevealText } from '@/components/ui/scroll-reveal'

interface Stat {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  label: string
  sub: string
}

const stats: Stat[] = [
  {
    value: 380,
    suffix: 'ms',
    label: 'p95 response time',
    sub: 'cut from 2.3s at Benu with Redis caching + pooling',
  },
  {
    value: 200,
    suffix: '+',
    label: 'tracked AI-TA sessions',
    sub: 'students guided without full solutions',
  },
  {
    value: 92,
    suffix: '%',
    label: 'planner accuracy',
    sub: '45/50 conflicts caught on a hand-labeled set',
  },
  {
    value: 40,
    suffix: '%',
    label: 'shorter wait / question',
    sub: 'by ranking retrieved context + caching checks',
  },
  {
    value: 150,
    suffix: '+',
    label: 'live orders piloted',
    sub: 'across 3 restaurants, kitchen + guest in sync',
  },
  {
    value: 45,
    suffix: '%',
    label: 'faster map render',
    sub: '200+ reports kept readable with clustering',
  },
]

export function ImpactSection() {
  return (
    <section
      id="impact"
      className="relative overflow-hidden py-28 px-8 md:px-16"
    >
      {/* soft aurora wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_50%_at_20%_0%,rgba(99,102,241,0.12),transparent_60%),radial-gradient(50%_50%_at_90%_20%,rgba(217,70,239,0.10),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-indigo-400">
            The numbers
          </p>
        </Reveal>

        <ScrollRevealText className="max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">
          I care about outcomes you can measure — faster products, real users, and
          results that hold up under load.
        </ScrollRevealText>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-800 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={(i % 3) * 0.08}
              className="group relative bg-neutral-950 p-8 transition-colors duration-300 hover:bg-neutral-900"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CountUp
                to={s.value}
                decimals={s.decimals}
                prefix={s.prefix}
                suffix={s.suffix}
                className="block bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-5xl font-black tracking-tight text-transparent tabular-nums md:text-6xl"
              />
              <p className="mt-4 text-sm font-semibold text-white">{s.label}</p>
              <p className="mt-1 text-sm leading-snug text-neutral-500">
                {s.sub}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
