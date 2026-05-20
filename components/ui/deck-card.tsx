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

/**
 * Deck-shuffle card: enters from bottom-right with 3D rotation, passes through
 * the center, exits to top-left. Driven by section scroll progress with each
 * card owning a window of progress.
 */
export function DeckCard({ data, index, total, progress }: DeckCardProps) {
  const segment = 1 / total
  const peak = (index + 0.5) * segment

  // Each card overlaps its neighbors slightly for smooth handoff
  const enter = Math.max(0, peak - segment * 0.85)
  const exit = Math.min(1, peak + segment * 0.85)

  const x = useTransform(progress, [enter, peak, exit], [520, 0, -540])
  const y = useTransform(progress, [enter, peak, exit], [320, 0, -320])
  const z = useTransform(progress, [enter, peak, exit], [-260, 0, -340])
  const rotateY = useTransform(progress, [enter, peak, exit], [-48, 0, 42])
  const rotateX = useTransform(progress, [enter, peak, exit], [22, 0, -18])
  const rotateZ = useTransform(progress, [enter, peak, exit], [-12, 0, 10])
  const scale = useTransform(progress, [enter, peak, exit], [0.78, 1, 0.72])
  const opacity = useTransform(
    progress,
    [enter - 0.01, enter + 0.04, exit - 0.04, exit + 0.01],
    [0, 1, 1, 0]
  )
  const filter = useTransform(
    progress,
    [enter, peak - segment * 0.25, peak, peak + segment * 0.25, exit],
    ['blur(10px)', 'blur(2px)', 'blur(0px)', 'blur(2px)', 'blur(10px)']
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
      }}
      className="absolute h-[24rem] w-[20rem] md:h-[30rem] md:w-[28rem] lg:h-[34rem] lg:w-[34rem]"
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/15 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)]">
        {/* image */}
        <img
          src={data.imageUrl}
          alt={data.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* darkening gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/85" />
        {/* glass tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-pink-500/10" />

        <div className="relative flex h-full flex-col justify-between p-6 text-white">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs tracking-[0.3em] text-white/60">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <a
              href={data.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${data.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div>
            {data.badge && (
              <span className="mb-3 inline-block rounded-full border border-yellow-400/40 bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-yellow-200 backdrop-blur-sm">
                ★ {data.badge}
              </span>
            )}
            <h3 className="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
              {data.title}
            </h3>
            <p className="mt-2 max-w-[85%] text-sm text-white/75">{data.subtitle}</p>

            {data.tags && data.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {data.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/20 bg-white/[0.08] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/80 backdrop-blur-sm"
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
              className="group/btn mt-5 flex w-full items-center justify-between rounded-lg border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/15"
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
