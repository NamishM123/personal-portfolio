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
        <p className="text-accent font-mono text-[11px] tracking-[0.3em] uppercase mb-4">
          ☞ Epilogue — Correspondence
        </p>
        <h2 className="font-serif text-5xl md:text-7xl text-ink mb-8 leading-[1.05]">
          Let&apos;s write
          <span className="italic text-accent"> the next chapter</span>
          <span className="text-accent">.</span>
        </h2>
        <p className="text-ink-soft text-lg md:text-xl font-serif italic mb-10 leading-relaxed">
          I&apos;m always open to interesting projects, internships, and collaborations.
          Send a letter — I tend to write back within a day.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:namishmannepalli2024@gmail.com"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-none border border-ink bg-ink text-background hover:bg-background hover:text-ink transition-all font-mono text-xs uppercase tracking-[0.25em]"
          >
            <Mail size={14} />
            namishmannepalli2024@gmail.com
          </a>
        </div>

        <div className="flex justify-center gap-8 mt-10">
          <a
            href="https://github.com/namishm123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ink-soft hover:text-accent transition-colors text-xs font-mono tracking-[0.25em] uppercase"
          >
            <GitFork size={14} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/namish-mannepalli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ink-soft hover:text-accent transition-colors text-xs font-mono tracking-[0.25em] uppercase"
          >
            <Link size={14} /> LinkedIn
          </a>
          <a
            href="https://namishm123.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ink-soft hover:text-accent transition-colors text-xs font-mono tracking-[0.25em] uppercase"
          >
            <ExternalLink size={14} /> Archive
          </a>
        </div>
      </motion.div>

      <div className="mt-24 pt-8 border-t border-border-soft text-center text-muted-foreground text-[10px] font-mono tracking-[0.3em] uppercase">
        ✱ Set in Instrument Serif & Geist · © 2026 Namish Mannepalli · Pressed with Next.js ✱
      </div>
    </section>
  )
}
