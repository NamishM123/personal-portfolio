'use client'

import { useEffect, useMemo, useRef } from 'react'
import { AsciiEngine } from '@/lib/ascii/engine'
import {
  resolveConfig,
  type AsciiConfig,
  type DeepPartial,
} from '@/lib/ascii/config'

export interface AsciiEffectProps {
  /** Source photo. Anything the browser can decode into an <img>. */
  src?: string
  /** Overrides merged onto the Vignette Bloom preset. */
  config?: DeepPartial<AsciiConfig>
  className?: string
  style?: React.CSSProperties
  /**
   * Device pixel ratio ceiling. The grid pitch is fixed in CSS pixels and the
   * shapes have soft edges, so rendering past ~1.25x buys almost nothing and
   * costs a great deal of fill rate.
   */
  maxDpr?: number
}

export function AsciiEffect({
  src = '/ascii/ref-008.png',
  config,
  className,
  style,
  maxDpr = 1.25,
}: AsciiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<AsciiEngine | null>(null)
  /**
   * Resolution multiplier. Starts at 1 and only ever ratchets down, when the
   * measured frame time says this device cannot keep up at full resolution.
   */
  const scaleRef = useRef(1)
  const refitRef = useRef<() => void>(() => {})

  // Config identity has to be stable or the engine would re-sample every render.
  const key = JSON.stringify(config ?? null)
  const resolved = useMemo(() => resolveConfig(config), [key]) // eslint-disable-line react-hooks/exhaustive-deps

  // Set up the engine, the image, and the resize observer.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const host = canvas.parentElement ?? canvas

    let engine: AsciiEngine
    try {
      engine = new AsciiEngine(canvas, resolved)
    } catch {
      return // no Canvas2D — leave the element blank rather than throwing
    }
    engineRef.current = engine

    const fit = () => {
      const rect = host.getBoundingClientRect()
      engine.resize({
        cssW: Math.max(1, Math.round(rect.width)),
        cssH: Math.max(1, Math.round(rect.height)),
        dpr: Math.min(maxDpr, window.devicePixelRatio || 1) * scaleRef.current,
      })
    }
    refitRef.current = fit
    fit()

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => engine.setImage(img, img.naturalWidth, img.naturalHeight)
    // On failure the engine falls back to its own painted scene, so the
    // effect still renders instead of collapsing to black.
    img.onerror = () => engine.setImage(null, 0, 0)
    img.src = src

    const ro = new ResizeObserver(fit)
    ro.observe(host)

    return () => {
      ro.disconnect()
      engine.dispose()
      engineRef.current = null
    }
  }, [src, maxDpr, resolved])

  useEffect(() => {
    engineRef.current?.setConfig(resolved)
  }, [resolved])

  // Animation loop. Idles whenever the canvas is offscreen or the tab is
  // hidden, and renders a single frame when the visitor prefers less motion.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let visible = true
    let start = 0

    let drawn = 0

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden) return
      if (!start) start = now
      const engine = engineRef.current
      if (!engine) return
      engine.render((now - start) / 1000)
      if (reduce.matches) {
        cancelAnimationFrame(raf)
        raf = 0
        return
      }
      // Give the device a couple of seconds to settle, then step the
      // resolution down if it is clearly missing frames. Downgrades only, so
      // this converges instead of oscillating.
      if (++drawn % 24 === 0 && scaleRef.current > 0.45 && engine.avgFrameMs > 26) {
        scaleRef.current = Math.max(0.45, scaleRef.current * 0.72)
        refitRef.current()
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { rootMargin: '120px' },
    )
    io.observe(canvas)

    const restart = () => {
      if (!raf) {
        start = 0
        raf = requestAnimationFrame(frame)
      }
    }
    reduce.addEventListener('change', restart)
    raf = requestAnimationFrame(frame)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      io.disconnect()
      reduce.removeEventListener('change', restart)
    }
  }, [resolved])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  )
}
