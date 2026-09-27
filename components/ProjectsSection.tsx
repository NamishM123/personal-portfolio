'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { TiltCard } from '@/components/ui/tilt-card'
import { Reveal } from '@/components/ui/reveal'

interface Project {
  title: string
  subtitle: string
  blurb: string
  metric: string
  tags: string[]
  href?: string
  badge?: string
  accent: string // tailwind gradient stops
}

const projects: Project[] = [
  {
    title: 'Usely',
    subtitle: 'AI usability testing tool',
    blurb:
      'A local-model agent browses a submitted site while the session streams live, turning click paths into UX findings scored across 5 personas.',
    metric: '20 / 20 on a 10-task eval',
    tags: ['Next.js', 'Playwright', 'Ollama', 'SQLite', 'SSE'],
    accent: 'from-indigo-500 to-sky-400',
  },
  {
    title: 'Sightline',
    subtitle: 'Room planner · 2D ↔ 3D',
    blurb:
      'Moves between a 2D floor plan and an interactive 3D view over 2,000+ listings from 8 retailers, flagging collision, clearance and door-swing conflicts in place.',
    metric: '92% accurate (45/50)',
    tags: ['React Three Fiber', 'TypeScript', 'GPT-4o-mini', 'Gemini'],
    badge: 'CodeBox Hacks',
    accent: 'from-violet-500 to-fuchsia-400',
  },
  {
    title: 'Starly',
    subtitle: 'AI interview coach',
    blurb:
      'Live transcription with a review screen that clips each answer’s strongest and weakest moments, pairing answer quality with eye-contact and head-stability scores at 30 FPS.',
    metric: '2nd place · PolyPrompt',
    tags: ['Deepgram', 'Groq', 'MediaPipe', 'WebSocket'],
    badge: 'Hackathon',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    title: 'Benu',
    subtitle: 'Restaurant ordering platform',
    blurb:
      'Guest checkout, a dense real-time kitchen display and an admin dashboard — 13 shared routes from one codebase, piloted across 3 restaurants.',
    metric: '2.3s → 380ms p95',
    tags: ['Next.js', 'Redis', 'React', 'Realtime'],
    accent: 'from-rose-500 to-pink-500',
  },
  {
    title: 'Poly Problems',
    subtitle: 'Campus reporting app · Code Box',
    blurb:
      'A campus issue-reporting app on iOS and Android reaching 120+ students, with marker clustering and rate limiting that keeps rankings trustworthy.',
    metric: '120+ students · 200+ reports',
    tags: ['React Native', 'Expo', 'Supabase'],
    href: 'https://www.polyproblems.com/',
    accent: 'from-emerald-500 to-teal-400',
  },
  {
    title: 'Settlr',
    subtitle: 'Map-based housing app',
    blurb:
      'A geospatial housing search that plots listings on an interactive map so renters can explore by neighborhood, price and fit.',
    metric: 'Interactive map search',
    tags: ['Next.js', 'Maps API', 'Geospatial'],
    href: 'https://housing-app-delta.vercel.app/',
    accent: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Recipe Vision',
    subtitle: 'Recipes from a photo',
    blurb:
      'Snap your ingredients and get a recipe back — computer vision reads what’s on the counter and generates something you can actually cook.',
    metric: 'Photo → recipe',
    tags: ['AI Vision', 'Image Gen', 'Next.js'],
    href: 'https://recepie-ingridients-aske.vercel.app/',
    accent: 'from-lime-400 to-emerald-500',
  },
  {
    title: 'FLEX',
    subtitle: 'Workout tracking app',
    blurb:
      'A training log with a progressive-overload engine that turns each session into the next target, so lifts keep moving up.',
    metric: 'Progressive overload',
    tags: ['React', 'REST API', 'JWT', 'Tailwind'],
    accent: 'from-fuchsia-500 to-purple-500',
  },
]

function ProjectCard({
  project,
  fluid = false,
}: {
  project: Project
  fluid?: boolean
}) {
  const clickable = project.href && project.href !== '#'
  const Wrapper = clickable ? 'a' : 'div'
  const wrapperProps = clickable
    ? { href: project.href, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <TiltCard
      intensity={7}
      className={
        fluid ? 'h-full w-full' : 'h-full w-[300px] shrink-0 sm:w-[360px]'
      }
    >
      <Wrapper
        {...wrapperProps}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950/80 p-7 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_60px_-30px_rgba(0,0,0,0.9)] transition-colors duration-300 hover:border-neutral-700"
      >
        {/* accent glow */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${project.accent} opacity-20 blur-2xl [transform:translateZ(0)]`}
        />

        <div className="relative flex items-start justify-between">
          <div
            className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${project.accent} px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-black`}
          >
            <Sparkles size={12} /> {project.metric}
          </div>
          {clickable && (
            <ArrowUpRight
              size={20}
              className="text-neutral-500 transition-colors group-hover/tilt:text-white"
            />
          )}
        </div>

        <div className="relative mt-6">
          <h3 className="text-2xl font-black text-white">{project.title}</h3>
          <p className="mt-1 text-sm text-neutral-400">{project.subtitle}</p>
        </div>

        <p className="relative mt-4 text-sm leading-relaxed text-neutral-400">
          {project.blurb}
        </p>

        <div className="relative mt-auto pt-6">
          {project.badge && (
            <span className="mb-3 inline-block rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-yellow-300">
              ★ {project.badge}
            </span>
          )}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Wrapper>
    </TiltCard>
  )
}

export function ProjectsSection() {
  const targetRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [travel, setTravel] = useState(0)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  })
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -travel])
  // Trailing spring gives the rail weight — it eases in behind the scroll.
  const x = useSpring(xRaw, { stiffness: 120, damping: 30, mass: 0.5 })
  // Subtle progress line under the rail so the pan reads as intentional.
  const railProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      // distance the rail must travel horizontally = overflow past the viewport
      setTravel(Math.max(0, track.scrollWidth - window.innerWidth + 96))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section id="projects" className="bg-black">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-8 pt-24 md:px-16">
        <Reveal>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-indigo-400">
            What I&apos;ve built
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Projects
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xl text-neutral-400">
            Shipped to real users — hackathon winners, research tools and
            production apps.{' '}
            <span className="hidden md:inline text-neutral-500">
              Keep scrolling to pan across the gallery →
            </span>
          </p>
        </Reveal>
      </div>

      {/* Desktop: horizontal pinned rail driven by vertical scroll */}
      <div
        ref={targetRef}
        className="relative mt-12 hidden md:block"
        style={{ height: `${Math.max(travel + 200, 600)}px` }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-8 px-8 md:px-16"
          >
            {projects.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
            {/* trailing spacer card so the last card clears the edge */}
            <div className="w-8 shrink-0" aria-hidden />
          </motion.div>

          {/* Rail progress indicator */}
          <div className="mx-8 mt-12 h-px max-w-xs overflow-hidden bg-neutral-800 md:mx-16">
            <motion.div
              style={{ width: railProgress }}
              className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile: simple stacked reveals */}
      <div className="mt-12 grid grid-cols-1 gap-8 px-8 pb-24 sm:grid-cols-2 md:hidden">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.08} className="h-full">
            <ProjectCard project={p} fluid />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
