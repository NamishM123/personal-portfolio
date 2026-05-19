'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, GitFork, MapPin, Utensils, Mic, Activity, Home, Brain } from 'lucide-react'

const projects = [
  {
    title: 'Poly Problems',
    subtitle: 'Campus Reporting App',
    date: 'Dec 2025 – Present',
    icon: <Activity size={20} />,
    color: 'from-green-500 to-emerald-700',
    accent: '#10b981',
    url: 'https://www.polyproblems.com/',
    description:
      'A mobile-first app for reporting campus issues with photos, location tagging, SSO auth, and AI-powered classification. Led a 10-person team, architected the React Native frontend with Supabase, RESTful APIs, and real-time data sync.',
    tags: ['React Native', 'Expo', 'Supabase', 'REST API', 'AI'],
    role: 'Project Lead — Code Box',
  },
  {
    title: 'Starly',
    subtitle: 'AI Mock Interview Platform',
    date: 'Apr 2026 – Present',
    icon: <Mic size={20} />,
    color: 'from-yellow-400 to-orange-600',
    accent: '#f59e0b',
    url: null,
    description:
      'AI-powered mock interview agent with speech-to-text & text-to-speech, rubric-based feedback on pacing, pauses, and filler words. Facial recognition via Hugging Face, real-time transcription via Deepgram, and personalized question generation through the Groq API.',
    tags: ['AI', 'Groq API', 'Deepgram', 'Hugging Face', 'Python'],
    badge: '2nd Place — Poly-Prompt Hackathon',
  },
  {
    title: 'Settlr',
    subtitle: 'Map-Based Housing App',
    date: 'Mar 2026 – Present',
    icon: <Home size={20} />,
    color: 'from-blue-500 to-cyan-600',
    accent: '#3b82f6',
    url: 'https://housing-app-delta.vercel.app/',
    description:
      'Geospatial housing search with real-time affordability calculations to dynamically filter listings. Built reactive state management with geocoding and optimized map rendering for low-latency UI updates.',
    tags: ['Next.js', 'Maps API', 'Geospatial', 'TypeScript'],
  },
  {
    title: 'Recipe Vision',
    subtitle: 'AI Recipe Generator from Photos',
    date: '2025',
    icon: <Utensils size={20} />,
    color: 'from-pink-500 to-rose-600',
    accent: '#ec4899',
    url: 'https://recepie-ingridients-aske.vercel.app/',
    description:
      'Upload a photo of your ingredients or paste a list and instantly get a full recipe with an AI-generated image preview. Snap your fridge and dinner is planned.',
    tags: ['AI Vision', 'Image Generation', 'Next.js', 'API'],
  },
  {
    title: 'Seagull (Raccoon)',
    subtitle: 'End-to-End TRT / HRT Companion',
    date: '2025',
    icon: <Brain size={20} />,
    color: 'from-purple-500 to-violet-700',
    accent: '#8b5cf6',
    url: 'https://vercel.com/namishm123s-projects/raccoon',
    description:
      'A complete tool for people on testosterone replacement therapy or other hormone replacements. Makes doctor visits less challenging and scary with tracking, insights, and guided preparation for appointments.',
    tags: ['Health Tech', 'React', 'TypeScript', 'Vercel'],
  },
  {
    title: 'Benu',
    subtitle: 'AI Restaurant Ordering Platform',
    date: 'Dec 2025 – Present',
    icon: <Utensils size={20} />,
    color: 'from-orange-400 to-red-600',
    accent: '#f97316',
    url: null,
    description:
      'Mobile-first restaurant ordering with QR-code ordering, real-time order tracking, and dedicated admin & kitchen dashboards. Engineered an OpenAI GPT-4o-mini chatbot with allergen-first safety architecture and multilingual anti-prompt-injection guardrails.',
    tags: ['Next.js 15', 'React 19', 'TypeScript', 'OpenAI', 'Realtime'],
    role: 'AI Team Project',
  },
  {
    title: 'FLEX',
    subtitle: 'Workout Tracking Application',
    date: 'Jan 2025 – Present',
    icon: <Activity size={20} />,
    color: 'from-lime-400 to-green-600',
    accent: '#84cc16',
    url: null,
    description:
      'RESTful backend with a progressive overload algorithm that tracks strength and calculates optimal weight increases from past performance. Mobile-first React frontend with JWT-based authentication and Tailwind CSS.',
    tags: ['React', 'REST API', 'JWT', 'Tailwind CSS', 'Progressive Overload'],
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="group relative rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden hover:border-neutral-600 transition-all duration-300 hover:-translate-y-1"
      style={{ '--accent': project.accent } as React.CSSProperties}
    >
      {/* Gradient top bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${project.color}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${project.color} text-white`}>
              {project.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
              <p className="text-neutral-400 text-sm">{project.subtitle}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-all"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {project.badge && (
          <span className="inline-block mb-3 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            🏆 {project.badge}
          </span>
        )}

        {project.role && (
          <p className="text-xs text-neutral-500 mb-2 font-mono">{project.role}</p>
        )}

        <p className="text-neutral-300 text-sm leading-relaxed mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-xs bg-neutral-800 text-neutral-400 border border-neutral-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-xs text-neutral-600 mt-4 font-mono">{project.date}</p>
      </div>
    </motion.div>
  )
}

export function ProjectsSection() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true })

  return (
    <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto" id="projects">
      <motion.div
        ref={titleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={titleInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-3">
          What I've built
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Projects</h2>
        <p className="text-neutral-400 max-w-xl">
          Real products shipped to real users — from hackathon winners to production apps.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
