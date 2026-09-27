'use client'

import { Mail, GitFork, Link, ExternalLink } from 'lucide-react'
import InteractiveWaveShader from '@/components/ui/flowing-waves-shader'
import { Reveal } from '@/components/ui/reveal'

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-8 py-40 md:px-16"
    >
      {/* Living purple wave background — center-dimmed so text stays legible */}
      <div className="absolute inset-0 z-0">
        <InteractiveWaveShader intensity={0.9} />
      </div>
      {/* Legibility overlays: vignette + top/bottom fade into the page */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,0,0,0.35),rgba(0,0,0,0.82))]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-black to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-indigo-300">
            Get in touch
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
            Let&apos;s build something
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
              {' '}
              together.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mb-10 text-lg text-neutral-300">
            I&apos;m always open to interesting projects, internships, and
            collaborations. Reach out — I reply fast.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="mailto:namishmannepalli2024@gmail.com"
              className="group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] transition-all hover:shadow-[0_10px_50px_-8px_rgba(168,85,247,0.7)]"
            >
              <Mail size={16} className="transition-transform group-hover:-translate-y-0.5" />
              namishmannepalli2024@gmail.com
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-8 flex justify-center gap-6">
            <a
              href="https://github.com/namishm123"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-white"
            >
              <GitFork size={16} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/namish-mannepalli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-white"
            >
              <Link size={16} /> LinkedIn
            </a>
            <a
              href="https://namishm123.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-white"
            >
              <ExternalLink size={16} /> namishm123.github.io
            </a>
          </div>
        </Reveal>
      </div>

      <div className="relative z-10 mx-auto mt-24 max-w-2xl border-t border-white/10 pt-8 text-center font-mono text-xs text-neutral-400">
        © 2026 Namish Mannepalli · Built with Next.js, Tailwind CSS, Framer Motion
        &amp; Three.js
      </div>
    </section>
  )
}
