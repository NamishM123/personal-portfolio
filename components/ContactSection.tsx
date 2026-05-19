'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, GitFork, Link, ExternalLink } from 'lucide-react'
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button'

export function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="py-32 px-8 md:px-16 max-w-7xl mx-auto" id="contact">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="text-orange-700 font-mono text-sm tracking-widest uppercase mb-4">
          Get in touch
        </p>
        <h2 className="text-4xl md:text-6xl font-bold text-black mb-6 leading-tight">
          Let's build something
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-rose-800">
            {' '}together.
          </span>
        </h2>
        <p className="text-neutral-800 text-lg mb-10">
          I'm always open to interesting projects, internships, and collaborations.
          Reach out — I reply fast.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <GlassButton
            size="lg"
            onClick={() => {
              window.location.href = 'mailto:namishmannepalli2024@gmail.com'
            }}
          >
            <Mail size={18} />
            <span>namishmannepalli2024@gmail.com</span>
          </GlassButton>
        </div>

        <div className="flex justify-center gap-3 mt-8 flex-wrap">
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
            onClick={() =>
              window.open('https://namishm123.github.io', '_blank', 'noopener,noreferrer')
            }
          >
            <ExternalLink size={16} />
            <span>namishm123.github.io</span>
          </GlassButton>
        </div>
      </motion.div>

      <div className="mt-24 pt-8 border-t border-black/15 text-center text-neutral-700 text-xs font-mono">
        © 2026 Namish Mannepalli · Built with Next.js, Tailwind CSS, Framer Motion
      </div>
    </section>
  )
}
