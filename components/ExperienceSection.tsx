'use client'

import { useRef, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import dynamic from 'next/dynamic'
import { Shield, Code2, Bot } from 'lucide-react'

const RobotSpine = dynamic(
  () => import('@/components/ui/robot-spine').then((m) => m.RobotSpine),
  { ssr: false }
)

const experiences = [
  {
    role: 'Project Lead',
    company: 'Code Box',
    period: 'Dec 2025 – Present',
    icon: <Code2 size={20} />,
    accent: 'from-green-400/40 via-green-500/30 to-emerald-950/60',
    accentText: 'text-green-300',
    bullets: [
      'Led a 10-person team building Poly Problems, a mobile-first campus reporting app with SSO auth and AI-powered classification.',
      'Delegated tasks and coordinated sprints across frontend, backend, and AI to ensure steady on-time progress.',
      'Architected React Native frontend with Supabase Auth, Database, and RESTful APIs for secure geotagged submissions.',
      'Optimized async data fetching, reducing API response time and improving overall application responsiveness.',
    ],
  },
  {
    role: 'Cybersecurity Intern',
    company: 'Cal Poly State University, SLO',
    period: 'Dec 2025 – Present',
    icon: <Shield size={20} />,
    accent: 'from-blue-400/40 via-blue-500/30 to-indigo-950/60',
    accentText: 'text-blue-300',
    bullets: [
      'Built AI-powered Python pipelines analyzing open-source ecosystems using GitHub, NPM, and CVE data.',
      'Leveraged graph theory and ML-based anomaly detection to uncover dependency and contributor risks.',
      'Hosted a public GitHub repository implementing automated red-flag detection for vulnerable dependencies and suspicious releases.',
      'Validated blue-flag heuristics assessing positive trust signals — active maintenance, signed commits, rapid patching.',
    ],
  },
  {
    role: 'AI Team Member',
    company: 'Benu Restaurant Platform',
    period: 'Dec 2025 – Present',
    icon: <Bot size={20} />,
    accent: 'from-orange-400/40 via-orange-500/30 to-amber-950/60',
    accentText: 'text-orange-300',
    bullets: [
      'Built a mobile-first restaurant ordering platform using Next.js 15, React 19, and TypeScript with QR-code ordering.',
      'Engineered an OpenAI GPT-4o-mini chatbot with allergen-first safety architecture and medical emergency override detection.',
      'Designed a multilingual conversational commerce system with automatic language detection and anti-prompt-injection guardrails.',
    ],
  },
]

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
  })

  const headerOpacity = useTransform(smooth, [0, 0.04, 0.12], [1, 1, 0])
  const headerY = useTransform(smooth, [0, 0.12], [0, -40])

  const counter = useTransform(smooth, (v) =>
    String(Math.min(experiences.length, Math.floor(v * experiences.length) + 1)).padStart(2, '0')
  )

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative"
      style={{ height: `${experiences.length * 110 + 60}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute top-24 left-8 z-30 md:left-16"
        >
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-pink-300/80">
            Where I've worked
          </p>
          <h2 className="text-4xl font-bold text-white md:text-6xl">Experience</h2>
        </motion.div>

        <div className="absolute bottom-10 left-8 z-30 md:left-16">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            Role
          </div>
          <div className="mt-1 flex items-baseline gap-2 font-mono text-white/90">
            <motion.span className="text-5xl font-bold">{counter}</motion.span>
            <span className="text-lg text-white/40">
              / {String(experiences.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        <RobotSpine progress={smooth} />

        <div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ perspective: '1800px' }}
        >
          {experiences.map((exp, i) => (
            <ExperienceDeckCard
              key={exp.role}
              exp={exp}
              index={i}
              total={experiences.length}
              progress={smooth}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceDeckCard({
  exp,
  index,
  total,
  progress,
}: {
  exp: (typeof experiences)[0]
  index: number
  total: number
  progress: MotionValue<number>
}) {
  // Orbital wrap — see deck-card.tsx for the geometry
  const ORBIT_RADIUS = 620
  const DEPTH_RADIUS = 460

  const angle = useTransform(progress, (p) => {
    let a = (index / total - p) * Math.PI * 2
    while (a > Math.PI) a -= Math.PI * 2
    while (a < -Math.PI) a += Math.PI * 2
    return a
  })

  const x = useTransform(angle, (a) => Math.sin(a) * ORBIT_RADIUS)
  const z = useTransform(angle, (a) => (Math.cos(a) - 1) * DEPTH_RADIUS)
  const y = useTransform(angle, (a) => -Math.sin(a) * 90)
  const rotateY = useTransform(angle, (a) => -a * (180 / Math.PI))
  const rotateX = useTransform(angle, (a) => Math.sin(a) * 6)
  const rotateZ = useTransform(angle, (a) => Math.sin(a) * -4)
  const scale = useTransform(angle, (a) => 0.62 + Math.max(0, Math.cos(a)) * 0.42)
  const opacity = useTransform(angle, (a) => {
    const c = Math.cos(a)
    return c >= 0 ? 1 : Math.max(0.05, 0.4 + c * 0.6)
  })
  const filter = useTransform(angle, (a) => {
    const blur = Math.max(0, (1 - Math.cos(a)) * 6)
    return `blur(${blur.toFixed(2)}px)`
  })
  const zIndex = useTransform(angle, (a) => Math.round(Math.cos(a) * 100))

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateY,
        rotateX,
        rotateZ,
        scale,
        opacity,
        filter,
        zIndex,
        transformStyle: 'preserve-3d',
        transformPerspective: 1800,
      }}
      className="absolute h-[30rem] w-[22rem] md:h-[34rem] md:w-[32rem] lg:h-[36rem] lg:w-[38rem]"
    >
      {/* Outer glow halo */}
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25),rgba(99,102,241,0.15)_40%,transparent_70%)] blur-2xl" />

      <div className="relative h-full w-full overflow-hidden rounded-3xl">
        <div className="pointer-events-none absolute inset-0 z-30 rounded-3xl border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(255,255,255,0.05),0_50px_120px_-20px_rgba(0,0,0,0.7)]" />

        {/* Frosted glass surface */}
        <div className="absolute inset-0 backdrop-blur-2xl" />
        <div className="absolute inset-0 bg-white/[0.04]" />
        <div className={`absolute inset-0 bg-gradient-to-br ${exp.accent} opacity-30`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.12),transparent_50%)]" />

        <div className="relative z-20 flex h-full flex-col justify-between p-7 text-white">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs tracking-[0.3em] text-white/60">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md ${exp.accentText}`}>
              {exp.icon}
            </span>
          </div>

          <div>
            <h3 className="text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-4xl">
              {exp.role}
            </h3>
            <p className="mt-1 text-sm text-white/80">{exp.company}</p>
            <p className="mt-0.5 font-mono text-xs text-white/50">{exp.period}</p>

            <ul className="mt-5 space-y-2">
              {exp.bullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-sm text-white/85">
      <span className="mt-1 shrink-0 text-white/40">›</span>
      <span>{children}</span>
    </li>
  )
}
