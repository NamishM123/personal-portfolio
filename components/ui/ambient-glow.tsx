'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

/**
 * A soft purple light fixed behind the whole page that drifts downward and
 * shifts hue as you scroll — a quiet through-line that ties every section to
 * the same palette. Pointer-events-none, so it never blocks interaction.
 */
export function AmbientGlow() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 30,
    restDelta: 0.001,
  })

  const top = useTransform(p, [0, 1], ['8%', '82%'])
  const x = useTransform(p, [0, 0.5, 1], ['-12%', '18%', '-6%'])
  const hue = useTransform(p, [0, 0.5, 1], [265, 285, 245])
  const background = useTransform(
    hue,
    (h) =>
      `radial-gradient(closest-side, hsla(${h}, 85%, 60%, 0.16), transparent 70%)`
  )

  return (
    <motion.div
      aria-hidden
      style={{ top, left: x, background }}
      className="pointer-events-none fixed z-0 h-[60vh] w-[60vh] rounded-full blur-3xl"
    />
  )
}
