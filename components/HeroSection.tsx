'use client'

import { motion } from 'framer-motion'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { ParticleText } from '@/components/ui/particle-text'
import { Spotlight } from '@/components/ui/spotlight'
import { GitFork, Link, Mail, ArrowDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative h-screen w-full bg-black overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      {/* Background: slow shader "splash" */}
      <div className="absolute inset-0 z-0">
        <ShaderAnimation brightness={0.3} speed={0.018} className="w-full h-full" />
      </div>

      {/* Interactive particle name, centered, transparent so the splash shows behind it */}
      <div className="absolute inset-0 z-10">
        <ParticleText
          text="NAMISH MANNEPALLI"
          transparent
          mouseForce={90}
          animationSpeed={1.4}
          disableExplosion
          className="!h-full"
        />
      </div>

      {/* Foreground overlay: tagline + links + scroll cue (clicks pass through to the canvas) */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-indigo-400 text-sm font-mono tracking-widest uppercase"
        >
          CS Student @ Cal Poly SLO
        </motion.p>

        <div className="flex flex-col items-center gap-6 px-6">
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
            className="pointer-events-auto flex gap-4"
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

        <motion.div
          className="flex flex-col items-center gap-2 text-neutral-500 text-xs"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span>scroll</span>
          <ArrowDown size={14} />
        </motion.div>
      </div>
    </section>
  )
}
