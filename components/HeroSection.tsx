'use client'

import { useEffect, useRef } from 'react'

const PHOTO_URL =
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=80'

const CREAM = '#efe6d2'

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const lastRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const paint = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = CREAM
      ctx.fillRect(0, 0, w, h)
    }

    paint()
    window.addEventListener('resize', paint)
    return () => window.removeEventListener('resize', paint)
  }, [])

  const erase = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 180
    const last = lastRef.current
    if (last) {
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.arc(x, y, 90, 0, Math.PI * 2)
      ctx.fill()
    }
    lastRef.current = { x, y }
  }

  const pointFrom = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    drawingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = pointFrom(e)
    erase(p.x, p.y)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drawingRef.current) return
    const p = pointFrom(e)
    erase(p.x, p.y)
  }
  const stop = () => {
    drawingRef.current = false
    lastRef.current = null
  }

  return (
    <section
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      onPointerLeave={stop}
      className="relative h-screen w-full overflow-hidden select-none"
      style={{ backgroundColor: CREAM, cursor: 'crosshair' }}
    >
      {/* Full-bleed landscape sitting beneath the cream mask */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${PHOTO_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Cream mask — drag to scratch it away */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Literary copy, fixed above both layers */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p
          style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
          className="text-[0.7rem] uppercase tracking-[0.45em] text-stone-600"
        >
          An essay in code
        </p>

        <h1
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          className="mt-8 text-5xl italic text-stone-800 sm:text-6xl md:text-7xl"
        >
          Namish <span style={{ color: '#9a1f2b' }}>Mannepalli</span>
        </h1>

        <a
          href="mailto:namishmannepalli2024@gmail.com"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          className="pointer-events-auto mt-12 text-base italic text-stone-700 underline decoration-[#9a1f2b]/60 underline-offset-8 transition-colors hover:decoration-[#9a1f2b] sm:text-lg"
        >
          Begin a correspondence
        </a>

        <p
          style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.4em] text-stone-500"
        >
          drag your cursor across the page
        </p>
      </div>
    </section>
  )
}
