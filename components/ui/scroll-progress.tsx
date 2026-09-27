'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * A thin gradient bar pinned to the top of the viewport that fills as the
 * whole page scrolls. Scroll-as-timeline, made literal.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 shadow-[0_0_12px_rgba(129,140,248,0.7)]"
    />
  )
}
