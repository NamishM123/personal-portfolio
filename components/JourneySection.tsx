'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import MorphGallery, { type MorphItem } from '@/components/ui/morph-gallery'

interface Point {
  tag: string
  text: string
  top: string
  left: string
}

interface Chapter {
  image: string
  alt: string
  no: string
  eyebrow: string
  title: string
  accent: string // rgb triplet for glows
  points: Point[]
}

const chapters: Chapter[] = [
  {
    image: '/scenery/scenery1.png',
    alt: 'Misty layered ridges at dawn',
    no: '01',
    eyebrow: 'Foundations',
    title: 'Where it starts',
    accent: '129,140,248', // indigo
    points: [
      { tag: 'Research', text: 'Own the policy layer of an AI teaching assistant — 200+ tracked sessions.', top: '28%', left: '16%' },
      { tag: 'Efficiency', text: 'Ranked context + caching cut wait per question ~40%.', top: '45%', left: '58%' },
      { tag: 'Resilience', text: 'Fallback behavior keeps students supported when a model is down.', top: '64%', left: '30%' },
    ],
  },
  {
    image: '/scenery/scenery2.png',
    alt: 'Snow peak under the Milky Way',
    no: '02',
    eyebrow: 'Building',
    title: 'From zero to shipped',
    accent: '217,70,239', // fuchsia
    points: [
      { tag: 'Benu', text: 'Co-founded a restaurant platform — 13 routes from one codebase.', top: '26%', left: '18%' },
      { tag: 'Performance', text: 'Cut p95 response time from 2.3s to 380ms with Redis + pooling.', top: '46%', left: '60%' },
      { tag: 'Scale', text: 'Piloted across 3 restaurants and 150+ live orders.', top: '65%', left: '34%' },
    ],
  },
  {
    image: '/scenery/scenery3.png',
    alt: 'Alpine peak above a sea of clouds',
    no: '03',
    eyebrow: 'Leading',
    title: 'Taking teams up',
    accent: '45,212,191', // teal
    points: [
      { tag: 'Poly Problems', text: 'Led 10 engineers to launch on iOS & Android — 120+ students.', top: '26%', left: '15%' },
      { tag: 'CS+AI', text: 'Leading a multi-agent social simulation team.', top: '44%', left: '60%' },
      { tag: 'Craft', text: 'Marker clustering cut map render time 45%.', top: '64%', left: '34%' },
    ],
  },
  {
    image: '/scenery/scenery4.png',
    alt: 'Desert canyon at dusk',
    no: '04',
    eyebrow: 'Shipping',
    title: 'Proof in the work',
    accent: '251,146,60', // amber
    points: [
      { tag: 'Usely', text: 'AI usability agent — 20/20 on a 10-task eval.', top: '28%', left: '16%' },
      { tag: 'Sightline', text: '2D ⇄ 3D room planner — 92% conflict accuracy.', top: '44%', left: '58%' },
      { tag: 'Starly', text: 'AI interview coach — 2nd place at PolyPrompt.', top: '65%', left: '32%' },
    ],
  },
]

const items: MorphItem[] = chapters.map((c) => ({
  src: c.image,
  thumb: c.image,
  alt: c.alt,
}))

export function JourneySection() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const n = chapters.length
    const i = Math.min(n - 1, Math.max(0, Math.floor(p * n)))
    setActive((prev) => (prev === i ? prev : i))
  })

  const chapter = chapters[active]
  const rgb = chapter.accent

  return (
    <section id="journey" ref={wrapRef} className="relative h-[420vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Morphing scenery backdrop, driven by scroll position */}
        <MorphGallery
          items={items}
          index={active}
          height="100%"
          duration={1100}
          noiseScale={3.2}
          edge={0.16}
          drift={0.45}
          loop={false}
          arrows={false}
          thumbnails={false}
        />

        {/* Legibility washes */}
        <div className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-r from-black/70 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-t from-black/70 via-transparent to-black/40" />

        {/* Chapter header — remounts per chapter so it always animates in */}
        <motion.div
          key={`head-${active}`}
          initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-6 top-24 z-20 max-w-md md:left-16"
        >
          <p
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: `rgb(${rgb})` }}
          >
            {chapter.no} — {chapter.eyebrow}
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)] md:text-6xl">
            {chapter.title}
          </h2>
        </motion.div>

        {/* Point cards pinned near the peaks — keyed so they remount per chapter */}
        <div className="absolute inset-0 z-10">
          {chapter.points.map((pt, i) => (
            <motion.div
              key={`${active}-${i}`}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.55,
                delay: 0.15 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute w-[13rem] sm:w-[15rem]"
              style={{ top: pt.top, left: pt.left }}
            >
                {/* Peak marker */}
                <span className="relative mb-2 flex h-3 w-3">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                    style={{ backgroundColor: `rgb(${rgb})` }}
                  />
                  <span
                    className="relative inline-flex h-3 w-3 rounded-full ring-2 ring-black/40"
                    style={{ backgroundColor: `rgb(${rgb})` }}
                  />
                </span>

                <div
                  className="rounded-xl border border-white/15 bg-black/45 p-4 backdrop-blur-md"
                  style={{ boxShadow: `0 20px 60px -24px rgba(${rgb},0.6)` }}
                >
                  <p
                    className="text-[11px] font-semibold uppercase tracking-widest"
                    style={{ color: `rgb(${rgb})` }}
                  >
                    {pt.tag}
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-white/90">
                    {pt.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        {/* Chapter progress dots */}
        <div className="absolute right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3 md:right-8">
          {chapters.map((c, i) => (
            <div key={c.no} className="flex items-center justify-end gap-2">
              <span
                className={`font-mono text-[10px] transition-opacity ${
                  i === active ? 'opacity-90' : 'opacity-0'
                }`}
                style={{ color: `rgb(${c.accent})` }}
              >
                {c.no}
              </span>
              <span
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    i === active ? `rgb(${c.accent})` : 'rgba(255,255,255,0.35)',
                  transform: i === active ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Scroll hint (first chapter only) */}
        <motion.div
          animate={{ opacity: active === 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-xs text-white/70"
        >
          <span className="font-mono uppercase tracking-widest">scroll the journey</span>
          <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  )
}
