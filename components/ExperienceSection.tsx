'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Shield, Code2, Bot } from 'lucide-react'
import { LeafGlyph } from '@/components/ui/ornaments'

const experiences = [
  {
    role: 'Project Lead',
    company: 'Code Box',
    period: 'Dec 2025 – Present',
    icon: <Code2 size={18} />,
    accent: '#9bb070', // soft moss
    bullets: [
      'Led a ten-person team building Poly Problems — a mobile-first campus reporting app with SSO and AI-driven classification.',
      'Coordinated sprints across frontend, backend, and AI so the work moved as one quiet river.',
      'Architected the React Native frontend with Supabase Auth, Database, and RESTful APIs for secure geotagged submissions.',
      'Optimized async data fetching, shortening API response times and softening the app in the hand.',
    ],
  },
  {
    role: 'Cybersecurity Intern',
    company: 'Cal Poly State University, SLO',
    period: 'Dec 2025 – Present',
    icon: <Shield size={18} />,
    accent: '#d97757', // warm tile
    bullets: [
      'Built AI-powered Python pipelines reading open-source ecosystems by way of GitHub, NPM, and CVE data.',
      'Used graph theory and ML anomaly detection to surface dependency and contributor risks.',
      'Published a public repository implementing automated red-flag detection for vulnerable dependencies and suspicious releases.',
      'Validated blue-flag heuristics — active maintenance, signed commits, rapid patching — as positive trust signals.',
    ],
  },
  {
    role: 'AI Team Member',
    company: 'Benu Restaurant Platform',
    period: 'Dec 2025 – Present',
    icon: <Bot size={18} />,
    accent: '#c9a151', // warm ochre
    bullets: [
      'Built a mobile-first restaurant ordering platform with Next.js 15, React 19, and TypeScript — QR-code ordering at the table.',
      'Engineered an OpenAI GPT-4o-mini chatbot with allergen-first safety architecture and medical emergency override detection.',
      'Designed a multilingual conversational commerce system with automatic language detection and anti-prompt-injection guardrails.',
    ],
  },
]

export function ExperienceSection() {
  const titleRef = useRef(null)
  const inView = useInView(titleRef, { once: true })

  return (
    <section
      id="experience"
      className="espresso relative overflow-hidden"
    >
      {/* Forest-floor photograph, very dim, behind the panel */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.22]">
        <Image
          src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: 'sepia(0.5) hue-rotate(-10deg) saturate(0.6)' }}
        />
        {/* Vignette to keep edges dark */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(20,12,5,0.75)_85%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-8 md:px-16 py-32">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-3xl"
        >
          <p className="eyebrow mb-4 flex items-center gap-2" style={{ color: '#b88a3f' }}>
            <LeafGlyph size={12} style={{ color: '#b88a3f' }} />
            Chapter two — by lamp-light
          </p>
          <h2
            className="literary text-5xl md:text-6xl italic font-light leading-[1.05]"
            style={{ color: '#efe6d2' }}
          >
            Letters <span style={{ color: '#d97757' }}>from work</span>.
          </h2>
          <p className="literary mt-5 text-lg italic" style={{ color: '#c9b896' }}>
            The hours after dusk, when the cursor blinks against a darker page.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px hidden md:block"
            style={{ background: 'rgba(184,138,63,0.35)' }}
          />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative md:ml-16 overflow-hidden rounded-2xl p-7"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(55,40,22,0.72) 0%, rgba(35,24,12,0.72) 100%)',
                  border: '1px solid rgba(184,138,63,0.25)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,235,200,0.08), 0 30px 60px -30px rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                {/* Timeline dot */}
                <div
                  className="absolute -left-[2.85rem] top-7 hidden md:block h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: exp.accent,
                    boxShadow: '0 0 0 4px rgba(20,12,5,1), 0 0 12px rgba(217,119,87,0.4)',
                  }}
                />

                <div className="flex items-start gap-3 mb-5">
                  <span style={{ color: exp.accent }}>{exp.icon}</span>
                  <div>
                    <h3
                      className="literary italic text-xl leading-tight"
                      style={{ color: '#efe6d2' }}
                    >
                      {exp.role}
                      <span style={{ color: '#7a6a4f' }} className="not-italic">
                        {' '}—{' '}
                      </span>
                      <span className="literary italic" style={{ color: exp.accent }}>
                        {exp.company}
                      </span>
                    </h3>
                    <p
                      className="eyebrow mt-1.5"
                      style={{ color: '#b88a3f' }}
                    >
                      {exp.period}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {exp.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="literary flex gap-3 text-[15px] leading-relaxed"
                      style={{ color: '#d6c8a8' }}
                    >
                      <span className="shrink-0 mt-2" style={{ color: '#d97757' }}>
                        ·
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
