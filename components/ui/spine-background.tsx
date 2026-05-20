'use client'

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

interface SpineBackgroundProps {
  targetRef: React.RefObject<HTMLElement | null>
  count?: number
}

export function SpineBackground({ targetRef, count = 28 }: SpineBackgroundProps) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.5,
  })

  const rotateY = useTransform(smooth, [0, 0.5, 1], [55, 0, -55])
  const rotateX = useTransform(smooth, [0, 0.5, 1], [12, 0, -8])
  const rotateZ = useTransform(smooth, [0, 0.5, 1], [-6, 0, 6])
  const y = useTransform(smooth, [0, 1], ['-8%', '8%'])

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
      className="pointer-events-none absolute inset-y-0 left-1/2 z-0 flex w-40 -translate-x-1/2 flex-col items-center justify-center gap-1.5"
    >
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
  const baseWidth = 110 + Math.sin(index * 0.55) * 14
  const height = 22 + Math.cos(index * 0.7) * 4

  const tilt = useTransform(smooth, [0, 1], [-15 + index * 0.4, 15 - index * 0.4])
  const offsetZ = useTransform(smooth, [0, 0.5, 1], [
    -40 + Math.sin(phase * Math.PI) * 30,
    Math.sin(phase * Math.PI) * 30,
    40 + Math.sin(phase * Math.PI) * 30,
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
      {/* transverse processes (side wings) */}
      <div className="absolute top-1/2 -left-4 h-2 w-7 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-400/40 via-indigo-600/50 to-indigo-900/60 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
      <div className="absolute top-1/2 -right-4 h-2 w-7 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-400/40 via-indigo-600/50 to-indigo-900/60 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />

      {/* vertebra body */}
      <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-indigo-300/30 via-indigo-500/40 to-indigo-950/60 shadow-[0_4px_14px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.4)] backdrop-blur-sm" />

      {/* central foramen (the hole) */}
      <div className="absolute left-1/2 top-1/2 h-2.5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />

      {/* faint inner highlight */}
      <div className="absolute inset-x-2 top-0.5 h-px rounded-full bg-white/20" />
    </motion.div>
  )
}
