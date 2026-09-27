'use client'

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'

/**
 * Typographic assembly: each word dims-to-bright as the reader scrolls it
 * through the middle of the viewport. The scroll position is the timeline.
 */
export function ScrollRevealText({
  children,
  className = '',
}: {
  children: string
  className?: string
}) {
  const container = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 0.85', 'start 0.25'],
  })

  const words = children.split(' ')

  return (
    <p ref={container} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <span className="relative mr-[0.28em] mt-[0.14em]">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}
