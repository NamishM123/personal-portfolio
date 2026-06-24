'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Work', href: '#projects' },
  { label: 'Chronicle', href: '#experience' },
  { label: 'Tools', href: '#skills' },
  { label: 'Letters', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
        <a href="#" className="font-serif text-ink text-2xl tracking-tight italic">
          N<span className="text-accent">.</span>M
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.25em] uppercase text-ink-soft hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:namishmannepalli2024@gmail.com"
            className="border border-ink bg-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-background hover:bg-background hover:text-ink transition-colors"
          >
            Commission
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-ink-soft hover:text-ink"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background/95 border-b border-border-soft overflow-hidden"
          >
            <div className="px-8 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
