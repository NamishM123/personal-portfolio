'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, GitFork, Link as LinkIcon, ExternalLink } from 'lucide-react'

export function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="relative py-32 px-8 md:px-16 max-w-7xl mx-auto" id="contact">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="eyebrow mb-5">Postscript</p>
        <h2 className="literary text-5xl md:text-7xl italic font-light text-ink leading-tight">
          Begin a <span className="crimson">correspondence</span>.
        </h2>
        <p className="literary mt-6 text-lg italic text-ink-soft">
          Internships, collaborations, or a quiet hello — the post is open.
          I tend to reply within a day.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <a
            href="mailto:namishmannepalli2024@gmail.com"
            className="literary italic flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-ink text-paper hover:bg-crimson transition-colors"
          >
            <Mail size={16} />
            namishmannepalli2024@gmail.com
          </a>
        </div>

        <div className="flex justify-center gap-8 mt-10">
          <a
            href="https://github.com/namishm123"
            target="_blank"
            rel="noopener noreferrer"
            className="literary italic flex items-center gap-2 text-ink-soft hover:text-crimson transition-colors text-sm"
          >
            <GitFork size={16} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/namish-mannepalli"
            target="_blank"
            rel="noopener noreferrer"
            className="literary italic flex items-center gap-2 text-ink-soft hover:text-crimson transition-colors text-sm"
          >
            <LinkIcon size={16} /> LinkedIn
          </a>
          <a
            href="https://namishm123.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="literary italic flex items-center gap-2 text-ink-soft hover:text-crimson transition-colors text-sm"
          >
            <ExternalLink size={16} /> namishm123.github.io
          </a>
        </div>
      </motion.div>

      <div className="mt-24 pt-8 border-t border-rule text-center text-ink-muted text-xs eyebrow">
        © 2026 N. Mannepalli · set in Fraunces · woven with Next.js
      </div>
    </section>
  )
}
