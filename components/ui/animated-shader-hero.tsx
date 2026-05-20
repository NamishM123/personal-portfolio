'use client'

import React, { useRef, useEffect } from 'react'

// ============================================================================
// Shader source (Matthias Hurrle — @atzedent). Produces a deep-space nebula
// that already reads as a dark, moody background — perfect for the site vibe.
// ============================================================================
const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.18,bg*.10,bg*.22),d);
  }
  O=vec4(col,1);
}`

// ============================================================================
// WebGL renderer — manages program, buffers, uniforms, and the per-frame draw
// ============================================================================
class WebGLRenderer {
  private canvas: HTMLCanvasElement
  private gl: WebGL2RenderingContext
  private program: WebGLProgram | null = null
  private vs: WebGLShader | null = null
  private fs: WebGLShader | null = null
  private buffer: WebGLBuffer | null = null
  private scale: number
  private shaderSource: string
  private mouseMove = [0, 0]
  private mouseCoords = [0, 0]
  private pointerCoords = [0, 0]
  private nbrOfPointers = 0

  private uResolution: WebGLUniformLocation | null = null
  private uTime: WebGLUniformLocation | null = null
  private uMove: WebGLUniformLocation | null = null
  private uTouch: WebGLUniformLocation | null = null
  private uPointerCount: WebGLUniformLocation | null = null
  private uPointers: WebGLUniformLocation | null = null

  private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`

  private vertices = [-1, 1, -1, -1, 1, 1, 1, -1]

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas
    this.scale = scale
    const ctx = canvas.getContext('webgl2')
    if (!ctx) throw new Error('WebGL2 is not supported in this browser')
    this.gl = ctx
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale)
    this.shaderSource = defaultShaderSource
  }

  updateShader(source: string) {
    this.reset()
    this.shaderSource = source
    this.setup()
    this.init()
  }

  updateMove(deltas: number[]) {
    this.mouseMove = deltas
  }

  updateMouse(coords: number[]) {
    this.mouseCoords = coords
  }

  updatePointerCoords(coords: number[]) {
    this.pointerCoords = coords
  }

  updatePointerCount(nbr: number) {
    this.nbrOfPointers = nbr
  }

  updateScale(scale: number) {
    this.scale = scale
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale)
  }

  compile(shader: WebGLShader, source: string) {
    const gl = this.gl
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
    }
  }

  test(source: string): string | null {
    const gl = this.gl
    const shader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    const result = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
      ? null
      : gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    return result
  }

  reset() {
    const gl = this.gl
    if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
      if (this.vs) {
        gl.detachShader(this.program, this.vs)
        gl.deleteShader(this.vs)
      }
      if (this.fs) {
        gl.detachShader(this.program, this.fs)
        gl.deleteShader(this.fs)
      }
      gl.deleteProgram(this.program)
    }
  }

  setup() {
    const gl = this.gl
    this.vs = gl.createShader(gl.VERTEX_SHADER)!
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)!
    this.compile(this.vs, this.vertexSrc)
    this.compile(this.fs, this.shaderSource)
    this.program = gl.createProgram()!
    gl.attachShader(this.program, this.vs)
    gl.attachShader(this.program, this.fs)
    gl.linkProgram(this.program)
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program))
    }
  }

  init() {
    const gl = this.gl
    const program = this.program!

    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    this.uResolution = gl.getUniformLocation(program, 'resolution')
    this.uTime = gl.getUniformLocation(program, 'time')
    this.uMove = gl.getUniformLocation(program, 'move')
    this.uTouch = gl.getUniformLocation(program, 'touch')
    this.uPointerCount = gl.getUniformLocation(program, 'pointerCount')
    this.uPointers = gl.getUniformLocation(program, 'pointers')
  }

  render(now = 0) {
    const gl = this.gl
    const program = this.program
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)

    gl.uniform2f(this.uResolution, this.canvas.width, this.canvas.height)
    gl.uniform1f(this.uTime, now * 1e-3)
    gl.uniform2f(this.uMove, this.mouseMove[0], this.mouseMove[1])
    gl.uniform2f(this.uTouch, this.mouseCoords[0], this.mouseCoords[1])
    gl.uniform1i(this.uPointerCount, this.nbrOfPointers)
    gl.uniform2fv(this.uPointers, this.pointerCoords)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}

// ============================================================================
// Pointer handler — tracks pointer position/movement for mouse-reactive shaders
// ============================================================================
class PointerHandler {
  private scale: number
  private active = false
  private pointers = new Map<number, number[]>()
  private lastCoords: number[] = [0, 0]
  private moves: number[] = [0, 0]

  constructor(element: HTMLCanvasElement, scale: number) {
    this.scale = scale
    const map = (el: HTMLCanvasElement, s: number, x: number, y: number) => [
      x * s,
      el.height - y * s,
    ]

    element.addEventListener('pointerdown', (e) => {
      this.active = true
      this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY))
    })
    element.addEventListener('pointerup', (e) => {
      if (this.count === 1) this.lastCoords = this.first
      this.pointers.delete(e.pointerId)
      this.active = this.pointers.size > 0
    })
    element.addEventListener('pointerleave', (e) => {
      if (this.count === 1) this.lastCoords = this.first
      this.pointers.delete(e.pointerId)
      this.active = this.pointers.size > 0
    })
    element.addEventListener('pointermove', (e) => {
      if (!this.active) return
      this.lastCoords = [e.clientX, e.clientY]
      this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY))
      this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY]
    })
  }

  getScale() {
    return this.scale
  }
  updateScale(scale: number) {
    this.scale = scale
  }
  get count() {
    return this.pointers.size
  }
  get move() {
    return this.moves
  }
  get coords(): number[] {
    return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0]
  }
  get first(): number[] {
    const v = this.pointers.values().next().value
    return v ?? this.lastCoords
  }
}

// ============================================================================
// Hook — mounts the renderer on a canvas ref and drives the animation loop
// ============================================================================
const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const pointersRef = useRef<PointerHandler | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current

    const resize = () => {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      rendererRef.current?.updateScale(dpr)
    }

    try {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio)
      rendererRef.current = new WebGLRenderer(canvas, dpr)
      pointersRef.current = new PointerHandler(canvas, dpr)
      rendererRef.current.setup()
      rendererRef.current.init()
      resize()
      if (rendererRef.current.test(defaultShaderSource) === null) {
        rendererRef.current.updateShader(defaultShaderSource)
      }
    } catch (err) {
      console.error('Shader hero init failed:', err)
      return
    }

    const loop = (now: number) => {
      if (!rendererRef.current || !pointersRef.current) return
      rendererRef.current.updateMouse(pointersRef.current.first)
      rendererRef.current.updatePointerCount(pointersRef.current.count)
      rendererRef.current.updatePointerCoords(pointersRef.current.coords)
      rendererRef.current.updateMove(pointersRef.current.move)
      rendererRef.current.render(now)
      animationFrameRef.current = requestAnimationFrame(loop)
    }

    loop(0)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      rendererRef.current?.reset()
    }
  }, [])

  return canvasRef
}

// ============================================================================
// Hero component — dark indigo-tinted overlay on the shader canvas
// ============================================================================
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
  className?: string
}

const Hero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = '',
}) => {
  const canvasRef = useShaderBackground()

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-black ${className}`}
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

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover touch-none"
        style={{ background: 'black' }}
      />

      {/* Dim overlay so text stays legible against the nebula */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
      />

      {/* Hero content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
        {trustBadge && (
          <div className="mb-8 animate-fade-in-down">
            <div className="flex items-center gap-2 px-6 py-3 bg-white/[0.04] backdrop-blur-md border border-white/15 rounded-full text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              {trustBadge.icons && (
                <div className="flex gap-1">
                  {trustBadge.icons.map((icon, index) => (
                    <span
                      key={index}
                      className="text-indigo-300"
                      aria-hidden
                    >
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
