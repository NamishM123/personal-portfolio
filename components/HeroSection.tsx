'use client'

import { motion } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import AnimatedTextCycle from '@/components/ui/animated-text-cycle'
import { GitFork, Link, Mail, ArrowDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="flex flex-1 h-screen">
        {/* Left: text */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-indigo-400 text-sm font-mono tracking-widest uppercase mb-4">
              CS Student @ Cal Poly SLO
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                Namish
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-indigo-400 to-purple-600">
                Mannepalli
              </span>
            </h1>
            <p className="mt-6 text-2xl md:text-3xl text-neutral-300 font-light leading-tight">
              I ship{' '}
              <AnimatedTextCycle
                words={[
                  'AI products',
                  'mobile apps',
                  'hackathon winners',
                  'secure platforms',
                  'full-stack tools',
                  'real software',
                ]}
                interval={2400}
                className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-violet-400 to-purple-500"
              />
            </p>

            <p className="mt-5 text-neutral-400 text-base md:text-lg max-w-md leading-relaxed">
              Full-stack developer & cybersecurity researcher building AI-powered products.
              Project Lead at Code Box, building apps with real users.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex gap-4 mt-8"
          >
            <a
              href="https://github.com/namishm123"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700 text-neutral-300 hover:border-indigo-500 hover:text-white transition-all text-sm"
            >
              <GitFork size={16} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/namish-mannepalli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700 text-neutral-300 hover:border-indigo-500 hover:text-white transition-all text-sm"
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

        {/* Right: Spline 3D — purple-tinted to match the theme */}
        <div className="hidden md:flex flex-1 relative isolate">
          {/* Soft purple halo behind the robot */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_45%,rgba(139,92,246,0.3),rgba(99,102,241,0.15)_45%,transparent_70%)] blur-2xl"
          />
          {/* Filter wrapper — recolors the robot canvas toward indigo/violet */}
          <div
            className="relative h-full w-full"
            style={{
              filter:
                'hue-rotate(230deg) saturate(1.45) brightness(0.95) contrast(1.05)',
            }}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
          {/* Subtle violet wash on top to pull cool neutrals into the palette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-color"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(139,92,246,0.35), rgba(99,102,241,0.25) 60%, transparent 90%)',
            }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-500 text-xs"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span>scroll</span>
        <ArrowDown size={14} />
      </motion.div>
    </section>
  )
}
