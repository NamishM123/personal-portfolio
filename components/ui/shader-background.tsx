'use client'

import { useRef } from 'react'
import { useShaderCanvas } from '@/components/ui/shader-engine'

interface ShaderBackgroundProps {
  /** Tint overlay opacity (0–1). Default 0.55 so site content stays readable. */
  dim?: number
  className?: string
}

/**
 * Fixed full-viewport WebGL shader background — sits behind the entire page.
 * Black fallback shows automatically if WebGL2 is unavailable.
 */
export function ShaderBackground({ dim = 0.55, className = '' }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useShaderCanvas(canvasRef)

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 bg-black ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ background: 'black' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `rgba(0,0,0,${dim})` }}
      />
    </div>
  )
}
