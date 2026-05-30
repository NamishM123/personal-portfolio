'use client'

import { motion } from 'framer-motion'
import { ExternalLink, GitFork } from 'lucide-react'
import GlassCard from '@/components/ui/glass-card'

const projects = [
  {
    title: 'Code Box',
    description:
      'AI-powered learning platform with real users. Led a team building interactive coding lessons and a custom code execution engine.',
    link: '#',
    github: '#',
  },
  {
    title: 'Cybersecurity Toolkit',
    description:
      'A suite of penetration testing tools and security research utilities for vulnerability assessment.',
    link: '#',
    github: '#',
  },
  {
    title: 'ML Research',
    description:
      'Research project exploring neural network architectures for natural language understanding.',
    link: '#',
    github: '#',
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-8 md:px-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Projects</h2>
        <p className="text-neutral-400 mb-12">Things I&apos;ve built recently.</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-10">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <GlassCard
              title={project.title}
              description={project.description}
              links={[
                { icon: GitFork, href: project.github, label: `${project.title} on GitHub` },
                { icon: ExternalLink, href: project.link, label: `${project.title} live` },
              ]}
              viewMoreHref={project.link}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
