'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, animate } from 'framer-motion'

/**
 * Counts from 0 up to `to` the first time it scrolls into view.
 */
export function CountUp({
  to,
  decimals = 0,
  duration = 1.8,
  prefix = '',
  suffix = '',
  className = '',
}: {
  to: number
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const count = useMotionValue(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (ref.current) {
          ref.current.textContent =
            prefix + v.toFixed(decimals) + suffix
        }
      },
    })
    return () => controls.stop()
  }, [inView, to, decimals, duration, prefix, suffix, count])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  )
}
