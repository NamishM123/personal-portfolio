'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export interface DeckCardData {
  title: string
  subtitle: string
  imageUrl?: string
  actionText: string
  href: string
  tags?: string[]
  badge?: string
}

interface DeckCardProps {
  data: DeckCardData
  index: number
  total: number
  progress: MotionValue<number>
}

const ORBIT_RADIUS = 620
const DEPTH_RADIUS = 460

/**
 * Orbital deck card — each card sits at a fixed angle on a wheel that rotates
 * around the vertical (spine) axis. As scroll progresses the whole wheel
 * rotates; cards behind the spine are dimmed/blurred but never deleted, so the
 * deck wraps around continuously instead of fading out.
 */
export function DeckCard({ data, index, total, progress }: DeckCardProps) {
  // Each card's angular position relative to camera, normalized to [-π, π].
  // At progress=0, card 0 is at angle 0 (front). As progress → 1 the wheel
  // makes one full revolution so each card crosses the front exactly once.
  const angle = useTransform(progress, (p) => {
    let a = (index / total - p) * Math.PI * 2
    while (a > Math.PI) a -= Math.PI * 2
    while (a < -Math.PI) a += Math.PI * 2
    return a
  })

  const x = useTransform(angle, (a) => Math.sin(a) * ORBIT_RADIUS)
  // z brings card to 0 when at front, pushes it -2*DEPTH when at back
  const z = useTransform(angle, (a) => (Math.cos(a) - 1) * DEPTH_RADIUS)
  // small diagonal lift so motion echoes the bottom-right → top-left arc
  const y = useTransform(angle, (a) => -Math.sin(a) * 90)
  const rotateY = useTransform(angle, (a) => -a * (180 / Math.PI))
  const rotateX = useTransform(angle, (a) => Math.sin(a) * 6)
  const rotateZ = useTransform(angle, (a) => Math.sin(a) * -4)
  const scale = useTransform(angle, (a) => 0.62 + Math.max(0, Math.cos(a)) * 0.42)
  const opacity = useTransform(angle, (a) => {
    const c = Math.cos(a)
    if (c >= 0) return 1
    // Behind the spine — fade but never fully vanish so wrap is continuous
    return Math.max(0.05, 0.4 + c * 0.6)
  })
  const filter = useTransform(angle, (a) => {
    const blur = Math.max(0, (1 - Math.cos(a)) * 6)
    return `blur(${blur.toFixed(2)}px)`
  })
  const zIndex = useTransform(angle, (a) => Math.round(Math.cos(a) * 100))

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateY,
        rotateX,
        rotateZ,
        scale,
        opacity,
        filter,
        zIndex,
        transformStyle: 'preserve-3d',
        transformPerspective: 1800,
      }}
      className="absolute h-[28rem] w-[22rem] md:h-[32rem] md:w-[30rem] lg:h-[36rem] lg:w-[36rem]"
    >
      {/* Soft outer halo */}
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22),rgba(99,102,241,0.12)_40%,transparent_70%)] blur-2xl" />

      <div className="relative h-full w-full overflow-hidden rounded-3xl">
        {/* Hairline border + inset highlight */}
        <div className="pointer-events-none absolute inset-0 z-30 rounded-3xl border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.05),0_50px_120px_-20px_rgba(0,0,0,0.7)]" />

        {/* Glass surface — no image, just backdrop blur + frost tint */}
        <div className="absolute inset-0 backdrop-blur-2xl" />
        <div className="absolute inset-0 bg-white/[0.05]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-purple-500/10" />

        <div className="relative z-20 flex h-full flex-col justify-between p-7 text-white">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs tracking-[0.3em] text-white/60">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <a
              href={data.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${data.title}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div>
            {data.badge && (
              <span className="mb-3 inline-block rounded-full border border-yellow-400/40 bg-yellow-500/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-yellow-200 backdrop-blur-sm">
                ★ {data.badge}
              </span>
            )}
            <h3 className="text-4xl font-black uppercase leading-[0.92] tracking-tight md:text-5xl">
              {data.title}
            </h3>
            <p className="mt-3 max-w-[88%] text-sm text-white/70">{data.subtitle}</p>

            {data.tags && data.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {data.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/15 bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <a
              href={data.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn mt-6 flex w-full items-center justify-between rounded-lg border border-white/20 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/15"
            >
              <span>{data.actionText}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
