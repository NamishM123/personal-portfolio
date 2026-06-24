'use client'

import { motion } from 'framer-motion'
import InkReveal from '@/components/ui/ink-reveal'
import { GitFork, Link, Mail, ArrowDown, PenLine } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background photograph — revealed only where the visitor's cursor drags ink across it. */}
      <div className="absolute inset-0 z-0 paper-grain">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2000&q=80"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <InkReveal maskColor={[252, 250, 248]} brushSize={140} lifetime={750} />
      </div>

      {/* Foreground — text sits above the ink layer (which is z-1). */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center gap-2 text-accent font-mono text-[11px] tracking-[0.3em] uppercase"
        >
          <PenLine size={12} />
          <span>An essay in code · Cal Poly SLO</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4 }}
          className="font-serif text-foreground leading-[0.95] tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem]"
        >
          Namish
          <span className="italic text-accent"> Mannepalli</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65 }}
          className="max-w-xl font-serif text-ink-soft text-xl md:text-2xl leading-snug italic"
        >
          Full-stack developer & cybersecurity researcher. I write software the way
          others write essays — by hand, with intent, one careful stroke at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-3 pointer-events-auto"
        >
          <a
            href="mailto:namishmannepalli2024@gmail.com"
            className="group flex items-center gap-2 rounded-none border border-ink bg-ink px-5 py-2.5 text-sm font-mono uppercase tracking-widest text-background transition-all hover:bg-background hover:text-ink"
          >
            <Mail size={14} /> Begin a correspondence
          </a>
          <a
            href="https://github.com/namishm123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-none border border-ink/40 bg-background/40 px-5 py-2.5 text-sm font-mono uppercase tracking-widest text-ink-soft backdrop-blur-sm transition-all hover:border-ink hover:text-ink"
          >
            <GitFork size={14} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/namish-mannepalli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-none border border-ink/40 bg-background/40 px-5 py-2.5 text-sm font-mono uppercase tracking-widest text-ink-soft backdrop-blur-sm transition-all hover:border-ink hover:text-ink"
          >
            <Link size={14} /> LinkedIn
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.4 }}
          className="mt-6 font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground"
        >
          ✱ drag your cursor across the page ✱
        </motion.p>
      </div>

      {/* Scroll mark */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4 }}
      >
        <span>read on</span>
        <ArrowDown size={14} className="text-accent" />
      </motion.div>
    </section>
  )
}
