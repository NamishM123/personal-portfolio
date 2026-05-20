'use client'

import React, { useRef } from 'react'
import { useShaderCanvas } from '@/components/ui/shader-engine'

interface HeroProps {
  trustBadge?: {
    text: string
    icons?: string[]
  }
  headline: {
    line1: string
    line2: string
  }
  subtitle: string
  buttons?: {
    primary?: {
      text: string
      onClick?: () => void
      href?: string
    }
    secondary?: {
      text: string
      onClick?: () => void
      href?: string
    }
  }
  /**
   * Skip rendering the shader canvas — use this when the page already has a
   * global ShaderBackground and you don't want to mount a duplicate canvas.
   */
  transparent?: boolean
  className?: string
}

const Hero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  transparent = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useShaderCanvas(transparent ? { current: null } : canvasRef)

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${
        transparent ? '' : 'bg-black'
      } ${className}`}
    >
      <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-fade-in-up   { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animation-delay-200  { animation-delay: 0.2s; }
        .animation-delay-400  { animation-delay: 0.4s; }
        .animation-delay-600  { animation-delay: 0.6s; }
        .animation-delay-800  { animation-delay: 0.8s; }
      `}</style>

      {!transparent && (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover touch-none"
            style={{ background: 'black' }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
          />
        </>
      )}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
        {trustBadge && (
          <div className="mb-8 animate-fade-in-down">
            <div className="flex items-center gap-2 px-6 py-3 bg-white/[0.04] backdrop-blur-md border border-white/15 rounded-full text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              {trustBadge.icons && (
                <div className="flex gap-1">
                  {trustBadge.icons.map((icon, index) => (
                    <span key={index} className="text-indigo-300" aria-hidden>
                      {icon}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-neutral-200">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-6 max-w-5xl mx-auto px-4">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
              {headline.line1}
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-indigo-300 via-violet-400 to-purple-500 bg-clip-text text-transparent animate-fade-in-up animation-delay-400">
              {headline.line2}
            </h1>
          </div>

          <div className="max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
            <p className="text-lg md:text-xl lg:text-2xl text-neutral-300 font-light leading-relaxed">
              {subtitle}
            </p>
          </div>

          {buttons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in-up animation-delay-800">
              {buttons.primary && (
                <ButtonOrLink
                  onClick={buttons.primary.onClick}
                  href={buttons.primary.href}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30 border border-indigo-400/30"
                >
                  {buttons.primary.text}
                </ButtonOrLink>
              )}
              {buttons.secondary && (
                <ButtonOrLink
                  onClick={buttons.secondary.onClick}
                  href={buttons.secondary.href}
                  className="px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 hover:border-white/30 text-neutral-100 rounded-full font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  {buttons.secondary.text}
                </ButtonOrLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ButtonOrLink({
  href,
  onClick,
  className,
  children,
}: {
  href?: string
  onClick?: () => void
  className?: string
  children: React.ReactNode
}) {
  if (href) {
    const isExternal = /^https?:|^mailto:/.test(href)
    return (
      <a
        href={href}
        onClick={onClick}
        target={isExternal && !href.startsWith('mailto:') ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}

export default Hero
