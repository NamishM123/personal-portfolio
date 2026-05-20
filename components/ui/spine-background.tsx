'use client'

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

interface SpineBackgroundProps {
  /** Optional external progress (0→1). When provided, drives the spine instead of useScroll. */
  progress?: MotionValue<number>
  targetRef?: React.RefObject<HTMLElement | null>
  count?: number
}

export function SpineBackground({
  progress,
  targetRef,
  count = 30,
}: SpineBackgroundProps) {
  // If no external progress is supplied, fall back to scroll on the target
  const localScroll = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  })
  const sourceProgress = progress ?? localScroll.scrollYProgress

  const smooth = useSpring(sourceProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.5,
  })

  // Range chosen so the spine sweeps through ~180° across the section
  const rotateY = useTransform(smooth, [0, 0.5, 1], [-90, 0, 90])
  const rotateX = useTransform(smooth, [0, 0.5, 1], [10, 0, -10])
  const rotateZ = useTransform(smooth, [0, 0.5, 1], [-4, 0, 4])
  const y = useTransform(smooth, [0, 1], ['-6%', '6%'])

  return (
    <motion.div
      aria-hidden
      style={{
        rotateY,
        rotateX,
        rotateZ,
        y,
        transformStyle: 'preserve-3d',
        transformPerspective: 1800,
      }}
      className="pointer-events-none absolute inset-y-0 left-1/2 z-0 flex w-48 -translate-x-1/2 flex-col items-center justify-center gap-2"
    >
      {/* halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.18),rgba(168,85,247,0.08)_45%,transparent_70%)] blur-3xl"
      />

      {Array.from({ length: count }).map((_, i) => (
        <Vertebra key={i} index={i} total={count} smooth={smooth} />
      ))}
    </motion.div>
  )
}

function Vertebra({
  index,
  total,
  smooth,
}: {
  index: number
  total: number
  smooth: MotionValue<number>
}) {
  const phase = index / total
  const baseWidth = 130 + Math.sin(index * 0.55) * 18
  const height = 26 + Math.cos(index * 0.7) * 4
  const wingWidth = 18 + Math.sin(index * 0.9) * 6

  const tilt = useTransform(smooth, [0, 1], [-18 + index * 0.4, 18 - index * 0.4])
  const offsetZ = useTransform(smooth, [0, 0.5, 1], [
    -50 + Math.sin(phase * Math.PI) * 40,
    Math.sin(phase * Math.PI) * 40,
    50 + Math.sin(phase * Math.PI) * 40,
  ])

  return (
    <motion.div
      style={{
        width: baseWidth,
        height,
        rotateZ: tilt,
        z: offsetZ,
        transformStyle: 'preserve-3d',
      }}
      className="relative"
    >
      {/* transverse processes — chunky side wings */}
      <div
        style={{ width: wingWidth }}
        className="absolute top-1/2 -left-5 h-2.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-pink-300/60 via-pink-500/70 to-rose-900/80 shadow-[0_3px_6px_rgba(0,0,0,0.55)]"
      />
      <div
        style={{ width: wingWidth }}
        className="absolute top-1/2 -right-5 h-2.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-pink-300/60 via-pink-500/70 to-rose-900/80 shadow-[0_3px_6px_rgba(0,0,0,0.55)]"
      />

      {/* spinous process — small bump on top */}
      <div className="absolute -top-1 left-1/2 h-2 w-3 -translate-x-1/2 rounded-t-full bg-gradient-to-b from-pink-400/70 to-rose-800/70" />

      {/* vertebra body */}
      <div className="absolute inset-0 rounded-[16px] bg-gradient-to-b from-pink-200/40 via-pink-500/55 to-rose-950/70 shadow-[0_6px_18px_rgba(190,24,93,0.35),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-3px_6px_rgba(0,0,0,0.45)] backdrop-blur-sm" />

      {/* central foramen (the hole) */}
      <div className="absolute left-1/2 top-1/2 h-3 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-black/80 to-rose-950/90 shadow-[inset_0_1px_2px_rgba(0,0,0,0.9),0_0_8px_rgba(244,114,182,0.4)]" />

      {/* top highlight */}
      <div className="absolute inset-x-3 top-1 h-px rounded-full bg-white/30" />
    </motion.div>
  )
}
