'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { GlassButton } from '@/components/ui/apple-tahoe-liquid-glass-button'

const links = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = href
    }
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/40 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
        <GlassButton size="sm" onClick={() => goTo('#')}>
          <span className="font-bold tracking-tight">
            NM<span className="text-orange-600">.</span>
          </span>
        </GlassButton>

        {/* Desktop links — all GlassButtons */}
        <div className="hidden md:flex items-center gap-3">
          {links.map((link) => (
            <GlassButton key={link.label} size="sm" onClick={() => goTo(link.href)}>
              <span>{link.label}</span>
            </GlassButton>
          ))}
          <GlassButton
            size="sm"
            onClick={() => {
              window.location.href = 'mailto:namishmannepalli2024@gmail.com'
            }}
          >
            <span>Hire me</span>
          </GlassButton>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <GlassButton size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </GlassButton>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#ffd1b3]/95 border-b border-white/20 overflow-hidden"
          >
            <div className="px-8 py-4 flex flex-col gap-3 items-start">
              {links.map((link) => (
                <GlassButton
                  key={link.label}
                  size="sm"
                  onClick={() => {
                    setMenuOpen(false)
                    goTo(link.href)
                  }}
                >
                  <span>{link.label}</span>
                </GlassButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
