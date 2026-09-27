'use client'

import { Reveal } from '@/components/ui/reveal'

const skillGroups = [
  {
    label: 'Languages',
    skills: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C', 'Java', 'Assembly'],
  },
  {
    label: 'Frontend',
    skills: [
      'React',
      'React Native',
      'Next.js',
      'Tailwind CSS',
      'React Three Fiber',
      'Framer Motion',
    ],
  },
  {
    label: 'AI & Agents',
    skills: [
      'LLM agents',
      'LangGraph',
      'RAG',
      'OpenAI / Anthropic APIs',
      'Deepgram',
      'Groq',
      'MediaPipe',
    ],
  },
  {
    label: 'Backend & Data',
    skills: ['FastAPI', 'Node.js', 'PostgreSQL', 'Redis', 'SQLite', 'REST / SSE'],
  },
  {
    label: 'Design & Research',
    skills: [
      'Figma',
      'Interactive prototyping',
      'User feedback sessions',
      'Workflow mapping',
      'Requirements scoping',
    ],
  },
  {
    label: 'Tooling',
    skills: ['Git', 'Playwright', 'Vercel', 'Docker', 'GitHub Actions'],
  },
]

const ticker = [
  'Python',
  'TypeScript',
  'Next.js',
  'React Three Fiber',
  'LangGraph',
  'RAG',
  'FastAPI',
  'Redis',
  'Postgres',
  'Playwright',
  'Ollama',
  'Groq',
  'Deepgram',
  'MediaPipe',
  'Figma',
  'Docker',
]

export function SkillsSection() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24 md:px-16" id="skills">
      <Reveal>
        <p className="mb-3 font-mono text-sm uppercase tracking-widest text-indigo-400">
          What I work with
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mb-12 text-4xl font-bold text-white md:text-5xl">Skills</h2>
      </Reveal>

      {/* Infinite ticker */}
      <div className="marquee-mask relative mb-14 overflow-hidden">
        <div className="animate-marquee flex w-max gap-3">
          {[...ticker, ...ticker].map((s, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full border border-neutral-800 bg-neutral-950 px-4 py-1.5 text-sm text-neutral-400"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, gi) => (
          <Reveal
            key={group.label}
            delay={(gi % 3) * 0.08}
            className="group rounded-2xl border border-neutral-800 bg-neutral-950 p-6 transition-colors duration-300 hover:border-neutral-700"
          >
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-indigo-400">
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-sm text-neutral-300 transition-all hover:border-indigo-500/50 hover:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
