'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export interface DeckCardData {
  title: string
  subtitle: string
  imageUrl: string
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

export function DeckCard({ data, index, total, progress }: DeckCardProps) {
  const segment = 1 / total
  const peak = (index + 0.5) * segment

  // Wide windows so several cards overlap on screen at once
  const enter = Math.max(0, peak - segment * 1.1)
  const exit = Math.min(1, peak + segment * 1.1)
  const enterHold = peak - segment * 0.25
  const exitHold = peak + segment * 0.25

  // Position arc: bottom-right → centered → top-left
  const x = useTransform(progress, [enter, peak, exit], [620, 0, -640])
  const y = useTransform(progress, [enter, peak, exit], [340, 0, -340])
  const z = useTransform(progress, [enter, peak, exit], [-320, 0, -380])

  // Gentler rotation than before — the video isn't actually that aggressive
  const rotateY = useTransform(progress, [enter, peak, exit], [-38, 0, 32])
  const rotateX = useTransform(progress, [enter, peak, exit], [14, 0, -10])
  const rotateZ = useTransform(progress, [enter, peak, exit], [-8, 0, 6])

  // Hold focused size at the peak window so the card sits readable for longer
  const scale = useTransform(
    progress,
    [enter, enterHold, exitHold, exit],
    [0.82, 1, 1, 0.78]
  )

  const opacity = useTransform(
    progress,
    [enter, enter + segment * 0.18, exit - segment * 0.18, exit],
    [0, 1, 1, 0]
  )

  // Heavier motion blur at the edges, sharp focus only at the peak
  const filter = useTransform(
    progress,
    [enter, enterHold, peak, exitHold, exit],
    ['blur(14px)', 'blur(2px)', 'blur(0px)', 'blur(2px)', 'blur(14px)']
  )

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
        transformStyle: 'preserve-3d',
        transformPerspective: 1800,
      }}
      className="absolute h-[28rem] w-[22rem] md:h-[32rem] md:w-[30rem] lg:h-[36rem] lg:w-[36rem]"
    >
      {/* Outer glow halo */}
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25),rgba(99,102,241,0.15)_40%,transparent_70%)] blur-2xl" />

      <div className="relative h-full w-full overflow-hidden rounded-3xl">
        {/* Hairline border + inner highlight */}
        <div className="pointer-events-none absolute inset-0 z-30 rounded-3xl border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),0_50px_120px_-20px_rgba(0,0,0,0.7)]" />

        {/* Faint image texture, very low opacity so it reads as glass not a photo */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${data.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(1.4) blur(2px)',
          }}
        />

        {/* Heavy backdrop blur to make it actually glassy */}
        <div className="absolute inset-0 backdrop-blur-2xl" />

        {/* Subtle frosted tint + radial highlight */}
        <div className="absolute inset-0 bg-white/[0.04]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
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
