'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Projects', href: '#projects' },
  { label: 'Letters', href: '#experience' },
  { label: 'Tools', href: '#skills' },
  { label: 'Correspondence', href: '#contact' },
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
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/85 backdrop-blur-md border-b border-rule'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
        <a
          href="#"
          className="literary italic text-ink text-xl tracking-tight"
        >
          N. Mannepalli<span className="crimson">.</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="literary text-ink-soft hover:text-ink text-sm italic transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:namishmannepalli2024@gmail.com"
            className="literary text-sm italic text-ink underline decoration-crimson/60 underline-offset-[6px] hover:decoration-crimson transition-colors"
          >
            Begin a letter
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
            className="md:hidden bg-paper/95 border-b border-rule overflow-hidden"
          >
            <div className="px-8 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="literary italic text-ink-soft hover:text-ink text-base transition-colors"
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
