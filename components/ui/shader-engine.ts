'use client'

import { useEffect, useRef, type RefObject } from 'react'

// ============================================================================
// Default fragment shader — slow-drifting purple fog (no stars / sparkles).
// Two octaves of fbm noise tinted into a violet→indigo gradient with a soft
// vignette falloff. Pure fog, nothing pointy.
// ============================================================================
export const defaultShaderSource = `#version 300 es
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
  float t=.0, a=1.;
  mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<6; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN;

  // Two slow-drifting fog layers
  float f1 = fbm(uv*1.1 + vec2(T*0.05, T*0.025));
  float f2 = fbm(uv*1.9 - vec2(T*0.08, T*0.04) + f1*0.6);
  float fog = mix(f1, f2, 0.55);

  // Soft vignette so the edges fall into black
  float v = 1.0 - smoothstep(0.45, 1.4, length(uv));
  fog *= v * 0.6 + 0.4;

  // Violet → indigo gradient
  vec3 base = vec3(0.03, 0.02, 0.06);
  vec3 hi   = vec3(0.36, 0.20, 0.58);
  vec3 col  = mix(base, hi, fog);

  // A touch of cool indigo bloom in the densest fog
  col += vec3(0.05, 0.05, 0.14) * pow(fog, 3.0);

  O = vec4(col, 1.0);
}`

// ============================================================================
// WebGL renderer
// ============================================================================
export class WebGLRenderer {
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

  updateMove(d: number[]) { this.mouseMove = d }
  updateMouse(c: number[]) { this.mouseCoords = c }
  updatePointerCoords(c: number[]) { this.pointerCoords = c }
  updatePointerCount(n: number) { this.nbrOfPointers = n }

  updateScale(scale: number) {
    this.scale = scale
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale)
  }

  private compile(shader: WebGLShader, source: string) {
    const gl = this.gl
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader))
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
      if (this.vs) { gl.detachShader(this.program, this.vs); gl.deleteShader(this.vs) }
      if (this.fs) { gl.detachShader(this.program, this.fs); gl.deleteShader(this.fs) }
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
// Pointer handler
// ============================================================================
export class PointerHandler {
  private scale: number
  private active = false
  private pointers = new Map<number, number[]>()
  private lastCoords: number[] = [0, 0]
  private moves: number[] = [0, 0]

  constructor(element: HTMLElement, scale: number) {
    this.scale = scale
    const map = (target: HTMLCanvasElement, s: number, x: number, y: number) => [
      x * s,
      target.height - y * s,
    ]

    const canvas = element as HTMLCanvasElement
    element.addEventListener('pointerdown', (e) => {
      this.active = true
      this.pointers.set(e.pointerId, map(canvas, this.scale, e.clientX, e.clientY))
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
      this.pointers.set(e.pointerId, map(canvas, this.scale, e.clientX, e.clientY))
      this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY]
    })
  }

  get count() { return this.pointers.size }
  get move() { return this.moves }
  get coords(): number[] {
    return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0]
  }
  get first(): number[] {
    const v = this.pointers.values().next().value
    return v ?? this.lastCoords
  }
}

// ============================================================================
// React hook — wires a canvas ref to a renderer + animation loop
// ============================================================================
export function useShaderCanvas(canvasRef: RefObject<HTMLCanvasElement | null>) {
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
      console.error('Shader init failed:', err)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
