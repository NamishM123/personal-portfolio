'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, GitFork, Link, ExternalLink } from 'lucide-react'

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
        <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-4">
          Get in touch
        </p>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Let's build something
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            {' '}together.
          </span>
        </h2>
        <p className="text-neutral-400 text-lg mb-10">
          I'm always open to interesting projects, internships, and collaborations.
          Reach out — I reply fast.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:namishmannepalli2024@gmail.com"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all font-medium"
          >
            <Mail size={16} />
            namishmannepalli2024@gmail.com
          </a>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <a
            href="https://github.com/namishm123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
          >
            <GitFork size={16} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/namish-mannepalli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
          >
            <Link size={16} /> LinkedIn
          </a>
          <a
            href="https://namishm123.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
          >
            <ExternalLink size={16} /> namishm123.github.io
          </a>
        </div>
      </motion.div>

      <div className="mt-24 pt-8 border-t border-neutral-800 text-center text-neutral-600 text-xs font-mono">
        © 2026 Namish Mannepalli · Built with Next.js, Tailwind CSS, Framer Motion
      </div>
    </section>
  )
}
