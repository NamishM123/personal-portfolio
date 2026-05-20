'use client'

import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  cubicBezier,
} from 'framer-motion'
import { useRef, type ReactNode } from 'react'

const easeIntoFocus = cubicBezier(0.22, 1, 0.36, 1)
const easeOutOfFocus = cubicBezier(0, 0, 0.58, 1)
const focusEase: [typeof easeIntoFocus, typeof easeOutOfFocus] = [
  easeIntoFocus,
  easeOutOfFocus,
]

interface ScrollTiltCardProps {
  side?: 'L' | 'R'
  maxTilt?: number
  maxBlur?: number
  perspective?: number
  className?: string
  children: ReactNode
}

/**
 * Wraps children with the same scroll-tilt motion used by ScrollTiltedGrid:
 * the element rises from below tipped forward, settles into focus at the
 * viewport center, then tilts back over the top edge as it exits.
 */
export function ScrollTiltCard({
  side = 'L',
  maxTilt = 70,
  maxBlur = 8,
  perspective = 900,
  className,
  children,
}: ScrollTiltCardProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const reduce = useReducedMotion()
  const sign = side === 'L' ? -1 : 1

  const blur = useTransform(p, [0, 0.5, 1], [maxBlur, 0, maxBlur], { ease: focusEase })
  const bright = useTransform(p, [0, 0.5, 1], [0, 1, 0], { ease: focusEase })
  const contrast = useTransform(p, [0, 0.5, 1], [4, 1, 4], { ease: focusEase })

  const ty = useTransform(p, [0, 0.5, 1], ['100%', '0%', '-100%'], { ease: focusEase })
  const tz = useTransform(p, [0, 0.5, 1], [300, 0, 300], { ease: focusEase })
  const rx = useTransform(p, [0, 0.5, 1], [maxTilt, 0, -maxTilt], { ease: focusEase })

  const tx = useTransform(
    p,
    [0, 0.5, 1],
    [`${sign * 40}%`, '0%', `${sign * 40}%`],
    { ease: focusEase }
  )
  const rot = useTransform(p, [0, 0.5, 1], [-sign * 5, 0, sign * 5], { ease: focusEase })
  const sk = useTransform(p, [0, 0.5, 1], [sign * 20, 0, -sign * 20], { ease: focusEase })

  const filter = useMotionTemplate`blur(${blur}px) brightness(${bright}) contrast(${contrast})`

  if (reduce) {
    return (
      <figure ref={ref} className={`relative z-10 m-0 ${className ?? ''}`.trim()}>
        {children}
      </figure>
    )
  }

  return (
    <motion.figure
      ref={ref}
      className={`relative z-10 m-0 ${className ?? ''}`.trim()}
      style={{ perspective, willChange: 'transform' }}
    >
      <motion.div
        className="will-change-[filter,transform]"
        style={{
          filter,
          x: tx,
          y: ty,
          z: tz,
          rotate: rot,
          rotateX: rx,
          skewX: sk,
        }}
      >
        {children}
      </motion.div>
    </motion.figure>
  )
}
