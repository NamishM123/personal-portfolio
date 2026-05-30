'use client'

import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { Spotlight } from '@/components/ui/spotlight'
import { GitFork, Link, Mail, ArrowDown } from 'lucide-react'

export function HeroSection() {
  // Interactive glass-tilt for the name
  const nameRef = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [10, -10]), {
    stiffness: 150,
    damping: 15,
  })
  const rotateY = useSpring(useTransform(px, [0, 1], [-12, 12]), {
    stiffness: 150,
    damping: 15,
  })
  const glareX = useTransform(px, (v) => `${v * 100}%`)
  const glareY = useTransform(py, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.28), transparent 55%)`

  const handleNameMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = nameRef.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const handleNameLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <section className="relative h-screen w-full bg-black overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Background: slow shader "splash" */}
      <div className="absolute inset-0 z-0">
        <ShaderAnimation brightness={0.28} speed={0.018} className="w-full h-full" />
      </div>

      {/* Foreground content, stacked and centered */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-indigo-400 text-sm font-mono tracking-widest uppercase"
        >
          CS Student @ Cal Poly SLO
        </motion.p>

        {/* Name — crisp grey glass treatment, tilts and catches light on hover */}
        <motion.div
          ref={nameRef}
          onMouseMove={handleNameMove}
          onMouseLeave={handleNameLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="group relative rounded-3xl border border-white/10 bg-white/[0.04] px-8 py-5 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_20px_60px_-20px_rgba(0,0,0,0.7)] [transform-style:preserve-3d]"
        >
          {/* Moving specular sheen that follows the cursor */}
          <motion.div
            aria-hidden
            style={{ background: glare }}
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <h1 className="relative bg-gradient-to-b from-white via-neutral-300 to-neutral-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.25)] sm:text-5xl md:text-7xl">
            Namish Mannepalli
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-md text-neutral-300 text-base md:text-lg leading-relaxed"
        >
          Full-stack developer & cybersecurity researcher building AI-powered
          products. Project Lead at Code Box, building apps with real users.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex gap-4"
        >
          <a
            href="https://github.com/namishm123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700 bg-black/40 text-neutral-300 hover:border-indigo-500 hover:text-white transition-all text-sm backdrop-blur-sm"
          >
            <GitFork size={16} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/namish-mannepalli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700 bg-black/40 text-neutral-300 hover:border-indigo-500 hover:text-white transition-all text-sm backdrop-blur-sm"
          >
            <Link size={16} /> LinkedIn
          </a>
          <a
            href="mailto:namishmannepalli2024@gmail.com"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-sm"
          >
            <Mail size={16} /> Contact
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500 text-xs"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span>scroll</span>
        <ArrowDown size={14} />
      </motion.div>
    </section>
  )
}
