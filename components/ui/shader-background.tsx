'use client'

import { useRef } from 'react'
import { useShaderCanvas } from '@/components/ui/shader-engine'

interface ShaderBackgroundProps {
  /** Opacity of the dim overlay on top of the shader (0–1). Default 0.45. */
  dim?: number
  className?: string
}

/**
 * Fixed full-viewport WebGL shader background — sits at -z-10 behind every
 * section. Black fallback is visible if WebGL2 init fails. The `dim` overlay
 * lets you knock the brightness down so site content stays readable.
 */
export function ShaderBackground({ dim = 0.45, className = '' }: ShaderBackgroundProps) {
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
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${dim})` }} />
    </div>
  )
}
