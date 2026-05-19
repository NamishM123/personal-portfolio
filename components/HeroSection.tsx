'use client'

import { motion } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button'
import { GitFork, Link, Mail, ArrowDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-[#ffd1b3] overflow-hidden flex flex-col">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="flex flex-1 h-screen">
        {/* Left: text */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-orange-700 text-sm font-mono tracking-widest uppercase mb-4">
              CS Student @ Cal Poly SLO
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700">
                Namish
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-orange-600 to-rose-700">
                Mannepalli
              </span>
            </h1>
            <p className="mt-6 text-neutral-800 text-lg max-w-md leading-relaxed">
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
            <GlassButton
              size="sm"
              onClick={() =>
                window.open('https://github.com/namishm123', '_blank', 'noopener,noreferrer')
              }
            >
              <GitFork size={16} />
              <span>GitHub</span>
            </GlassButton>
            <GlassButton
              size="sm"
              onClick={() =>
                window.open(
                  'https://linkedin.com/in/namish-mannepalli',
                  '_blank',
                  'noopener,noreferrer'
                )
              }
            >
              <Link size={16} />
              <span>LinkedIn</span>
            </GlassButton>
            <GlassButton
              size="sm"
              onClick={() => {
                window.location.href = 'mailto:namishmannepalli2024@gmail.com'
              }}
            >
              <Mail size={16} />
              <span>Contact</span>
            </GlassButton>
          </motion.div>
        </div>

        {/* Right: Spline 3D — peach backdrop, robot itself stays dark */}
        <div className="hidden md:flex flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-700 text-xs"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span>scroll</span>
        <ArrowDown size={14} />
      </motion.div>
    </section>
  )
}
