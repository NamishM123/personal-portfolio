'use client'

import { motion } from 'framer-motion'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { Spotlight } from '@/components/ui/spotlight'
import { GitFork, Link, Mail, ArrowDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col">
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
            <p className="mt-6 text-neutral-400 text-lg max-w-md leading-relaxed">
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

        {/* Right: shader animation */}
        <div className="hidden md:flex flex-1 relative">
          <ShaderAnimation brightness={0.35} className="w-full h-full" />
          {/* Fade the shader into the page background on the left edge */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
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
