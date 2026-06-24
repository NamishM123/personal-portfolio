'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Mail, GitFork, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { LeafGlyph, BranchRule } from '@/components/ui/ornaments'

export function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section
      id="contact"
      className="relative overflow-hidden"
    >
      {/* Foggy mountain photograph fading up from the foot of the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          maskImage: 'linear-gradient(to top, black 0%, black 35%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, black 35%, transparent 100%)',
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-50"
          style={{ filter: 'sepia(0.35) saturate(0.75)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto py-32 px-8 md:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="eyebrow mb-5 inline-flex items-center gap-2">
            <LeafGlyph size={12} className="text-bark" />
            Postscript
          </p>
          <h2 className="literary text-5xl md:text-7xl italic font-light text-ink leading-[1.05]">
            Begin a <span className="crimson">correspondence</span>.
          </h2>
          <p className="literary mt-6 text-lg italic text-ink-soft">
            Internships, collaborations, or a quiet hello — the post is open.
            I tend to reply within a day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a
              href="mailto:namishmannepalli2024@gmail.com"
              className="literary italic flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-ink text-paper hover:bg-crimson transition-colors shadow-[0_20px_40px_-20px_rgba(58,40,18,0.5)]"
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

        <div className="mt-24 max-w-2xl mx-auto">
          <BranchRule />
        </div>
        <div className="mt-6 text-center text-ink-muted text-xs eyebrow">
          © 2026 N. Mannepalli · set in Fraunces · woven with Next.js
        </div>
      </div>
    </section>
  )
}
