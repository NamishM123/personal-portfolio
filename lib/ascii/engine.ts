/**
 * Canvas2D reimplementation of the "Vignette Bloom" ASCII-art effect.
 *
 * Pipeline, in order:
 *   1. draw the source photo at target size; bgMode/bgBlur/bgOpacity decide
 *      what stays visible behind the grid
 *   2. split the canvas into cellSize cells, average each one
 *   3. draw a primitive per cell according to renderMode
 *   4. colour adjustments: brightness -> contrast -> saturation -> grayscale
 *      -> tint (via overlayBlend) -> blurType/blurAmount
 *   5. post effects from `pfx`
 *   6. light points
 *   7. reveal mask back to the plain photo
 *
 * Steps 1-3 are cheap because the per-cell averages are computed by letting
 * the browser downscale the photo to exactly cols x rows and reading that
 * back once, rather than looping over every pixel each frame.
 */

import {
  type AsciiConfig,
  type LightPoint,
  type RenderMode,
  CHAR_SETS,
} from './config'

const TAU = Math.PI * 2

const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v)

/** Stable per-cell noise in 0..1 — same cell always gets the same value. */
function hash2(a: number, b: number): number {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function makeCanvas(w = 1, h = 1): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = Math.max(1, w | 0)
  c.height = Math.max(1, h | 0)
  return c
}

function ctx2d(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('Canvas2D is unavailable')
  return ctx
}

/** Does this browser honour ctx.filter? Safari only got it in 16.4. */
let filterSupport: boolean | null = null
function supportsFilter(): boolean {
  if (filterSupport !== null) return filterSupport
  try {
    const ctx = ctx2d(makeCanvas(1, 1))
    ctx.filter = 'blur(1px)'
    filterSupport = ctx.filter === 'blur(1px)'
  } catch {
    filterSupport = false
  }
  return filterSupport
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return [255, 255, 255]
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
}

/** Cover-fit draw: fills w x h completely, cropping the overflow axis. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  iw: number,
  ih: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / iw, h / ih)
  const dw = iw * scale
  const dh = ih * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

/** 8x8 Bayer matrix, normalised to 0..1, for ordered dithering. */
const BAYER8 = (() => {
  const base = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ]
  const out = new Float32Array(64)
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) out[y * 8 + x] = base[y][x] / 64
  return out
})()

const MATRIX_GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ0123456789'
const HEX_DIGITS = '0123456789ABCDEF'

export interface EngineSize {
  cssW: number
  cssH: number
  dpr: number
}

export class AsciiEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private cfg: AsciiConfig

  /** photo drawn cover-fit at full canvas size — backdrop + mask reveal */
  private photo = makeCanvas()
  private photoCtx = ctx2d(this.photo)
  /** the effect is composed here, then blitted (optionally masked) to canvas */
  private scene = makeCanvas()
  private sceneCtx = ctx2d(this.scene)
  /** scratch buffers for blur / bloom / chromatic / pixelate */
  private fxA = makeCanvas()
  private fxACtx = ctx2d(this.fxA)
  private fxB = makeCanvas()
  private fxBCtx = ctx2d(this.fxB)
  /** cols x rows downsample used to average each cell */
  private small = makeCanvas()
  private smallCtx = ctx2d(this.small)
  /** finer downsample for braille (2x4) and halfblocks (1x2) */
  private fine = makeCanvas()
  private fineCtx = ctx2d(this.fine)

  private img: CanvasImageSource | null = null
  private imgW = 0
  private imgH = 0
  private maskImg: HTMLImageElement | null = null

  private cssW = 0
  private cssH = 0
  private dpr = 1
  private cols = 0
  private rows = 0

  /** per-cell colour after all adjustments */
  private cellR = new Uint8ClampedArray(0)
  private cellG = new Uint8ClampedArray(0)
  private cellB = new Uint8ClampedArray(0)
  /** per-cell luminance in 0..1 after tone curve / invert / edge emphasis */
  private cellL = new Float32Array(0)
  /** sub-cell luminance for braille / halfblocks */
  private fineL = new Float32Array(0)
  private fineCols = 0
  private fineRows = 0

  private toneLut = new Float32Array(256)
  private gridDirty = true

  /** cached, rebuilt on resize/config change */
  private vignetteGrad: CanvasGradient | null = null
  private grainPattern: CanvasPattern | null = null
  private scanPattern: CanvasPattern | null = null
  private halftonePattern: CanvasPattern | null = null
  /**
   * Canvas the pipeline is currently composing into. Without a reveal mask
   * that is the visible canvas directly, which saves a full-frame blit.
   */
  private work!: HTMLCanvasElement
  /**
   * fillStyle strings quantised to 5 bits per channel. Building and parsing
   * an rgb() string per cell per frame is otherwise one of the hottest costs
   * in the loop, and 32 levels per channel is invisible at this grid pitch.
   */
  private colorCache = new Array<string | undefined>(32768)
  /** rounded-tile outlines, one per size step, reused across cells */
  private beadPaths: Path2D[] | null = null
  private beadCell = 0
  /** matrix rain head position per column */
  private rainHeads = new Float32Array(0)
  private rainSpeeds = new Float32Array(0)

  constructor(canvas: HTMLCanvasElement, config: AsciiConfig) {
    this.canvas = canvas
    this.ctx = ctx2d(canvas)
    this.cfg = config
    this.buildToneLut()
  }

  setConfig(config: AsciiConfig) {
    const prev = this.cfg
    this.cfg = config
    if (
      prev.cellSize !== config.cellSize ||
      prev.brightness !== config.brightness ||
      prev.contrast !== config.contrast ||
      prev.saturation !== config.saturation ||
      prev.grayscale !== config.grayscale ||
      prev.invert !== config.invert ||
      prev.edgeEmphasis !== config.edgeEmphasis ||
      prev.renderMode !== config.renderMode ||
      prev.toneCurve !== config.toneCurve
    ) {
      this.buildToneLut()
      this.gridDirty = true
      this.layout()
    }
    if (prev.cellSize !== config.cellSize) this.beadPaths = null
    if (prev.pfx !== config.pfx) this.invalidateCaches()
    if (prev.mask.dataUrl !== config.mask.dataUrl) this.loadMask()
  }

  setImage(img: CanvasImageSource | null, w: number, h: number) {
    this.img = img
    this.imgW = w
    this.imgH = h
    this.gridDirty = true
    this.paintPhoto()
  }

  resize({ cssW, cssH, dpr }: EngineSize) {
    if (this.cssW === cssW && this.cssH === cssH && this.dpr === dpr) return
    this.cssW = cssW
    this.cssH = cssH
    this.dpr = dpr

    const pw = Math.max(1, Math.round(cssW * dpr))
    const ph = Math.max(1, Math.round(cssH * dpr))
    for (const c of [this.canvas, this.photo, this.scene]) {
      c.width = pw
      c.height = ph
    }
    this.canvas.style.width = `${cssW}px`
    this.canvas.style.height = `${cssH}px`

    this.gridDirty = true
    this.invalidateCaches()
    this.layout()
    this.paintPhoto()
  }

  /** Recomputes grid dimensions and reallocates the per-cell buffers. */
  private layout() {
    const cell = Math.max(2, this.cfg.cellSize)
    const cols = Math.max(1, Math.ceil(this.cssW / cell))
    const rows = Math.max(1, Math.ceil(this.cssH / cell))
    if (cols === this.cols && rows === this.rows && this.cellL.length) return
    this.cols = cols
    this.rows = rows
    const n = cols * rows
    this.cellR = new Uint8ClampedArray(n)
    this.cellG = new Uint8ClampedArray(n)
    this.cellB = new Uint8ClampedArray(n)
    this.cellL = new Float32Array(n)
    this.rainHeads = new Float32Array(cols)
    this.rainSpeeds = new Float32Array(cols)
    for (let i = 0; i < cols; i++) {
      this.rainHeads[i] = hash2(i, 7) * rows * 2 - rows
      this.rainSpeeds[i] = 4 + hash2(i, 13) * 14
    }
    this.gridDirty = true
  }

  private invalidateCaches() {
    this.vignetteGrad = null
    this.grainPattern = null
    this.scanPattern = null
    this.halftonePattern = null
  }

  private colorStr(r: number, g: number, b: number): string {
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3)
    let s = this.colorCache[key]
    if (s === undefined) {
      s = `rgb(${r & 248},${g & 248},${b & 248})`
      this.colorCache[key] = s
    }
    return s
  }

  /** Rounded-square outlines at 24 size steps, centred on the origin. */
  private beads(cell: number): Path2D[] {
    if (this.beadPaths && this.beadCell === cell) return this.beadPaths
    const steps = 24
    const out: Path2D[] = []
    for (let i = 0; i < steps; i++) {
      const size = cell * 0.92 * (0.3 + 0.7 * ((i + 0.5) / steps))
      const h = size / 2
      const r = size * 0.3
      const p = new Path2D()
      if (typeof p.roundRect === 'function') {
        p.roundRect(-h, -h, size, size, r)
      } else {
        p.moveTo(-h + r, -h)
        p.arcTo(h, -h, h, h, r)
        p.arcTo(h, h, -h, h, r)
        p.arcTo(-h, h, -h, -h, r)
        p.arcTo(-h, -h, h, -h, r)
        p.closePath()
      }
      out.push(p)
    }
    this.beadPaths = out
    this.beadCell = cell
    return out
  }

  private buildToneLut() {
    const pts = [...(this.cfg.toneCurve ?? [])].sort((a, b) => a.x - b.x)
    if (pts.length < 2) {
      for (let i = 0; i < 256; i++) this.toneLut[i] = i / 255
      return
    }
    for (let i = 0; i < 256; i++) {
      const x = i / 255
      let j = 0
      while (j < pts.length - 2 && pts[j + 1].x < x) j++
      const a = pts[j]
      const b = pts[j + 1]
      const span = b.x - a.x
      const t = span <= 0 ? 0 : clamp((x - a.x) / span)
      this.toneLut[i] = clamp(a.y + (b.y - a.y) * t)
    }
  }

  /** Draws the source photo cover-fit at full canvas size. */
  private paintPhoto() {
    const { photo, photoCtx } = this
    if (photo.width < 2) return
    photoCtx.setTransform(1, 0, 0, 1, 0, 0)
    photoCtx.clearRect(0, 0, photo.width, photo.height)
    if (this.img) {
      drawCover(photoCtx, this.img, this.imgW, this.imgH, photo.width, photo.height)
    } else {
      this.paintFallbackPhoto()
    }
  }

  /**
   * Stand-in scene used if the source photo never loads: a dark room with a
   * warm lamp bloom, so the effect still reads correctly instead of going flat.
   */
  private paintFallbackPhoto() {
    const { photo, photoCtx: c } = this
    const w = photo.width
    const h = photo.height
    c.fillStyle = '#050506'
    c.fillRect(0, 0, w, h)
    const warm = c.createRadialGradient(w * 0.48, h * 0.33, 0, w * 0.48, h * 0.33, h * 0.85)
    warm.addColorStop(0, 'rgba(255,232,190,0.95)')
    warm.addColorStop(0.18, 'rgba(226,158,84,0.55)')
    warm.addColorStop(0.55, 'rgba(96,58,26,0.18)')
    warm.addColorStop(1, 'rgba(0,0,0,0)')
    c.fillStyle = warm
    c.fillRect(0, 0, w, h)
    const cool = c.createLinearGradient(w * 0.55, h * 0.2, w, 0)
    cool.addColorStop(0, 'rgba(0,0,0,0)')
    cool.addColorStop(0.6, 'rgba(150,180,196,0.28)')
    cool.addColorStop(1, 'rgba(0,0,0,0)')
    c.fillStyle = cool
    c.fillRect(0, 0, w, h * 0.4)
    const desk = c.createLinearGradient(0, h * 0.72, 0, h)
    desk.addColorStop(0, 'rgba(0,0,0,0)')
    desk.addColorStop(1, 'rgba(196,128,66,0.6)')
    c.fillStyle = desk
    c.fillRect(w * 0.12, h * 0.72, w * 0.5, h * 0.28)
  }

  private loadMask() {
    const url = this.cfg.mask.dataUrl
    if (!url) {
      this.maskImg = null
      return
    }
    const img = new Image()
    img.onload = () => {
      this.maskImg = img
    }
    img.src = url
  }

  /**
   * Averages every cell and bakes the colour adjustments in. Only runs when
   * the size, photo or a colour parameter changes — never per frame.
   */
  private sampleGrid() {
    const { cols, rows, cfg } = this
    if (!cols || !rows) return
    this.small.width = cols
    this.small.height = rows
    const sc = this.smallCtx
    sc.imageSmoothingEnabled = true
    sc.imageSmoothingQuality = 'high'
    sc.clearRect(0, 0, cols, rows)
    // Letting the browser scale the photo down to exactly cols x rows gives
    // us the box average of every cell in one operation.
    sc.drawImage(this.photo, 0, 0, cols, rows)
    const data = sc.getImageData(0, 0, cols, rows).data

    const bright = cfg.brightness * 2.55
    const contrast = cfg.contrast / 100
    const sat = cfg.saturation / 100
    const gray = clamp(cfg.grayscale / 100)
    const n = cols * rows

    for (let i = 0; i < n; i++) {
      let r = data[i * 4]
      let g = data[i * 4 + 1]
      let b = data[i * 4 + 2]

      // brightness -> contrast -> saturation -> grayscale, in that order
      r += bright
      g += bright
      b += bright
      r = (r - 128) * contrast + 128
      g = (g - 128) * contrast + 128
      b = (b - 128) * contrast + 128
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
      r = luma + (r - luma) * sat
      g = luma + (g - luma) * sat
      b = luma + (b - luma) * sat
      if (gray > 0) {
        const gl = 0.2126 * r + 0.7152 * g + 0.0722 * b
        r += (gl - r) * gray
        g += (gl - g) * gray
        b += (gl - b) * gray
      }

      r = r < 0 ? 0 : r > 255 ? 255 : r
      g = g < 0 ? 0 : g > 255 ? 255 : g
      b = b < 0 ? 0 : b > 255 ? 255 : b

      let l = this.toneLut[(0.2126 * r + 0.7152 * g + 0.0722 * b) | 0]
      if (cfg.invert) {
        l = 1 - l
        r = 255 - r
        g = 255 - g
        b = 255 - b
      }
      this.cellR[i] = r
      this.cellG[i] = g
      this.cellB[i] = b
      this.cellL[i] = l
    }

    if (cfg.edgeEmphasis > 0) this.applyEdgeEmphasis()
    if (cfg.renderMode === 'braille' || cfg.renderMode === 'halfblocks') {
      this.sampleFine(cfg.renderMode === 'braille' ? 2 : 1, cfg.renderMode === 'braille' ? 4 : 2)
    }
    this.gridDirty = false
  }

  /** Sobel over the luminance grid, mixed back in to sharpen contours. */
  private applyEdgeEmphasis() {
    const { cols, rows, cellL } = this
    const k = clamp(this.cfg.edgeEmphasis / 100)
    const src = Float32Array.from(cellL)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const at = (xx: number, yy: number) =>
          src[Math.min(rows - 1, Math.max(0, yy)) * cols + Math.min(cols - 1, Math.max(0, xx))]
        const gx =
          -at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1) +
          at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1)
        const gy =
          -at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1) +
          at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1)
        const mag = Math.min(1, Math.hypot(gx, gy))
        const i = y * cols + x
        cellL[i] = clamp(src[i] * (1 - k * 0.5) + mag * k)
      }
    }
  }

  /** Sub-cell luminance grid, for the modes that carry extra detail. */
  private sampleFine(sx: number, sy: number) {
    const fc = this.cols * sx
    const fr = this.rows * sy
    this.fine.width = fc
    this.fine.height = fr
    const c = this.fineCtx
    c.imageSmoothingEnabled = true
    c.imageSmoothingQuality = 'high'
    c.clearRect(0, 0, fc, fr)
    c.drawImage(this.photo, 0, 0, fc, fr)
    const data = c.getImageData(0, 0, fc, fr).data
    if (this.fineL.length !== fc * fr) this.fineL = new Float32Array(fc * fr)
    const bright = this.cfg.brightness * 2.55
    const contrast = this.cfg.contrast / 100
    for (let i = 0; i < fc * fr; i++) {
      let l = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]
      l = (l + bright - 128) * contrast + 128
      l = this.toneLut[clamp(l, 0, 255) | 0]
      this.fineL[i] = this.cfg.invert ? 1 - l : l
    }
    this.fineCols = fc
    this.fineRows = fr
  }

  // ---------------------------------------------------------------- render

  private lastTime = 0
  private frameMs = 0

  /** Rolling average of how long a frame takes to draw, in milliseconds. */
  get avgFrameMs(): number {
    return this.frameMs
  }

  render(timeSec: number) {
    if (!this.cols || this.canvas.width < 2) return
    const t0 = performance.now()
    if (this.gridDirty) this.sampleGrid()
    const dt = Math.min(0.1, Math.max(0, timeSec - this.lastTime))
    this.lastTime = timeSec

    const { cfg, dpr } = this
    // A reveal mask needs the effect on its own layer; without one we can skip
    // the offscreen entirely and compose straight onto the visible canvas.
    const masked = cfg.mask.enabled && !!this.maskImg
    this.work = masked ? this.scene : this.canvas
    const s = masked ? this.sceneCtx : this.ctx
    s.setTransform(1, 0, 0, 1, 0, 0)
    s.globalCompositeOperation = 'source-over'
    s.globalAlpha = 1
    s.filter = 'none'
    s.clearRect(0, 0, this.work.width, this.work.height)

    // steps 1-4a happen in CSS-pixel space
    s.scale(dpr, dpr)
    this.drawBackdrop(s)
    s.save()
    s.globalCompositeOperation = cfg.styleBlend
    this.drawGrid(s, timeSec, dt)
    s.restore()

    // 4b — tint at tintOpacity through overlayBlend
    if (cfg.tintOpacity > 0) {
      s.save()
      s.globalCompositeOperation = cfg.overlayBlend
      s.globalAlpha = clamp(cfg.tintOpacity / 100)
      s.fillStyle = cfg.tint
      s.fillRect(0, 0, this.cssW, this.cssH)
      s.restore()
    }

    // everything below reads back whole frames, so work in device pixels
    s.setTransform(1, 0, 0, 1, 0, 0)

    // 4c — blur
    if (cfg.blurType !== 'off' && cfg.blurAmount > 0) this.applyBlur(s)

    // 5 — post effects, in the documented order
    const p = cfg.pfx
    if (p.scanLines?.enabled) this.fxScanLines(s, p.scanLines.intensity)
    if (p.vignette?.enabled) this.fxVignette(s, p.vignette.intensity)
    if (p.bloom?.enabled) this.fxBloom(s, p.bloom.intensity)
    if (p.chromatic?.enabled) this.fxChromatic(s, p.chromatic.intensity)
    if (p.filmGrain?.enabled) this.fxFilmGrain(s, p.filmGrain.intensity, timeSec)
    if (p.glitch?.enabled) this.fxGlitch(s, p.glitch.intensity, timeSec)
    if (p.halftone?.enabled) this.fxHalftone(s, p.halftone.intensity)
    if (p.pixelate?.enabled) this.fxPixelate(s, p.pixelate.intensity)
    if (p.filmDust?.enabled) this.fxFilmDust(s, p.filmDust.intensity, timeSec)

    // 6 — light points
    if (cfg.lights.enabled && cfg.lights.points.length) this.drawLights(s)

    // 7 — reveal the plain photo through the mask
    if (masked) this.composite()

    this.frameMs = this.frameMs ? this.frameMs * 0.9 + (performance.now() - t0) * 0.1 : performance.now() - t0
  }

  private drawBackdrop(s: CanvasRenderingContext2D) {
    const { cfg, cssW: w, cssH: h } = this
    const a = clamp(cfg.bgOpacity / 100)
    if (cfg.bgMode === 'none' || a <= 0) return
    s.save()
    s.globalAlpha = a
    if (cfg.bgMode === 'solid') {
      s.fillStyle = cfg.bgColor
      s.fillRect(0, 0, w, h)
    } else if (cfg.bgMode === 'photo') {
      s.drawImage(this.photo, 0, 0, w, h)
    } else {
      if (supportsFilter() && cfg.bgBlur > 0) s.filter = `blur(${cfg.bgBlur}px)`
      // overdraw slightly so the blur doesn't bleed transparent edges inward
      const o = cfg.bgBlur * 2
      s.drawImage(this.photo, -o, -o, w + o * 2, h + o * 2)
      s.filter = 'none'
    }
    s.restore()
  }

  /** Per-cell modulation from animStyle / animSpeed / animIntensity. */
  private animFactor(cx: number, cy: number, t: number): number {
    const cfg = this.cfg
    if (!cfg.animated) return 1
    const amp = ((cfg.animIntensity.enabled ? cfg.animIntensity.intensity : 0) / 100) * 0.6
    if (amp <= 0) return 1
    const spd = (cfg.animSpeed.enabled ? cfg.animSpeed.intensity : 0) / 100
    const time = t * spd
    let v = 0
    switch (cfg.animStyle) {
      case 'wave':
        v = Math.sin(cx * 0.26 + cy * 0.15 - time * 1.9)
        break
      case 'pulse':
        v = Math.sin(time * 2.2)
        break
      case 'shimmer':
        v = Math.sin(hash2(cx, cy) * TAU + time * 4.6)
        break
      case 'ripple': {
        const dx = cx - this.cols * 0.5
        const dy = cy - this.rows * 0.5
        v = Math.sin(Math.sqrt(dx * dx + dy * dy) * 0.42 - time * 3)
        break
      }
      case 'flicker':
        v = Math.sin(time * 11 + hash2(cx, cy) * TAU) * 0.45 + Math.sin(time * 3.7) * 0.55
        break
    }
    return 1 + v * amp
  }

  private drawGrid(s: CanvasRenderingContext2D, t: number, dt: number) {
    const { cfg, cols, rows } = this
    const mode = cfg.renderMode
    const cell = cfg.cellSize
    const cov = clamp(cfg.coverage / 100)
    const density = clamp(cfg.density / 100)

    const chars =
      cfg.charSet === 'custom'
        ? cfg.customChars || CHAR_SETS.standard
        : CHAR_SETS[cfg.charSet] ?? CHAR_SETS.standard

    if (mode === 'characters' || mode === 'mixed' || mode === 'hexdump' || mode === 'matrix') {
      const px = mode === 'hexdump' ? cell * 0.62 : cell * 1.02
      s.font = `${px}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`
      s.textAlign = 'center'
      s.textBaseline = 'middle'
    }
    if (mode === 'matrix') {
      this.drawMatrixRain(s, t, dt)
      return
    }
    if (mode === 'contour') {
      this.drawContour(s)
      return
    }
    if (mode === 'mosaic') {
      this.drawMosaic(s, t)
      return
    }

    s.lineCap = 'round'

    for (let cy = 0; cy < rows; cy++) {
      const y = cy * cell
      for (let cx = 0; cx < cols; cx++) {
        if (cov < 1 && hash2(cx * 31 + 7, cy * 17 + 3) > cov) continue
        const i = cy * cols + cx
        const m = this.animFactor(cx, cy, t)

        let l = clamp(this.cellL[i] * m)
        if (density > 0) l = clamp(l + density * (1 - l) * 0.85)
        if (l <= 0.005 && mode !== 'pixel' && mode !== 'dither') continue

        const r = clamp(this.cellR[i] * m, 0, 255) | 0
        const g = clamp(this.cellG[i] * m, 0, 255) | 0
        const b = clamp(this.cellB[i] * m, 0, 255) | 0
        const x = cx * cell
        this.drawCell(s, mode, x, y, cell, l, r, g, b, cx, cy, t, chars)
      }
    }
  }

  private drawCell(
    s: CanvasRenderingContext2D,
    mode: RenderMode,
    x: number,
    y: number,
    cell: number,
    l: number,
    r: number,
    g: number,
    b: number,
    cx: number,
    cy: number,
    t: number,
    chars: string,
  ) {
    const mx = x + cell * 0.5
    const my = y + cell * 0.5
    const fill = this.colorStr(r, g, b)

    switch (mode) {
      case 'pixel': {
        s.fillStyle = fill
        s.fillRect(x, y, cell + 0.5, cell + 0.5)
        break
      }
      case 'dots': {
        s.fillStyle = fill
        s.beginPath()
        s.arc(mx, my, cell * 0.46 * l, 0, TAU)
        s.fill()
        break
      }
      case 'dither': {
        // ordered 8x8 Bayer threshold: a cell is either on or off
        if (l > BAYER8[(cy & 7) * 8 + (cx & 7)]) {
          s.fillStyle = fill
          s.fillRect(x, y, cell, cell)
        }
        break
      }
      case 'characters': {
        const idx = Math.min(chars.length - 1, Math.round(l * (chars.length - 1)))
        const ch = chars[idx]
        if (ch === ' ') break
        s.fillStyle = fill
        s.fillText(ch, mx, my)
        break
      }
      case 'hexdump': {
        const v = Math.round(l * 255)
        s.fillStyle = fill
        s.fillText(HEX_DIGITS[(v >> 4) & 15] + HEX_DIGITS[v & 15], mx, my)
        break
      }
      case 'cross': {
        const arm = cell * 0.45 * l
        s.strokeStyle = fill
        s.lineWidth = Math.max(0.6, cell * 0.16 * l)
        s.beginPath()
        s.moveTo(mx - arm, my)
        s.lineTo(mx + arm, my)
        s.moveTo(mx, my - arm)
        s.lineTo(mx, my + arm)
        s.stroke()
        break
      }
      case 'diamond': {
        const rr = cell * 0.5 * l
        s.fillStyle = fill
        s.beginPath()
        s.moveTo(mx, my - rr)
        s.lineTo(mx + rr, my)
        s.lineTo(mx, my + rr)
        s.lineTo(mx - rr, my)
        s.closePath()
        s.fill()
        break
      }
      case 'voxel': {
        // isometric cube, faces shaded to fake a light from the upper left
        const h = cell * 0.5 * (0.35 + 0.65 * l)
        const w = cell * 0.46
        s.fillStyle = `rgb(${(r * 1.25) | 0},${(g * 1.25) | 0},${(b * 1.25) | 0})`
        s.beginPath()
        s.moveTo(mx, my - h)
        s.lineTo(mx + w, my - h * 0.5)
        s.lineTo(mx, my)
        s.lineTo(mx - w, my - h * 0.5)
        s.closePath()
        s.fill()
        s.fillStyle = `rgb(${(r * 0.66) | 0},${(g * 0.66) | 0},${(b * 0.66) | 0})`
        s.beginPath()
        s.moveTo(mx - w, my - h * 0.5)
        s.lineTo(mx, my)
        s.lineTo(mx, my + h * 0.5)
        s.lineTo(mx - w, my)
        s.closePath()
        s.fill()
        s.fillStyle = `rgb(${(r * 0.42) | 0},${(g * 0.42) | 0},${(b * 0.42) | 0})`
        s.beginPath()
        s.moveTo(mx + w, my - h * 0.5)
        s.lineTo(mx, my)
        s.lineTo(mx, my + h * 0.5)
        s.lineTo(mx + w, my)
        s.closePath()
        s.fill()
        break
      }
      case 'lego': {
        const size = cell * 0.9
        s.fillStyle = fill
        this.roundRectPath(s, mx - size / 2, my - size / 2, size, size, size * 0.16)
        s.fill()
        s.fillStyle = `rgba(255,255,255,${0.18 + 0.3 * l})`
        s.beginPath()
        s.arc(mx, my, size * 0.26, 0, TAU)
        s.fill()
        s.fillStyle = `rgba(0,0,0,0.28)`
        s.beginPath()
        s.arc(mx, my + size * 0.05, size * 0.26, 0.2 * Math.PI, 0.8 * Math.PI)
        s.fill()
        break
      }
      case 'mixed': {
        // shape ladder: the brighter the cell, the heavier the mark
        if (l < 0.2) {
          s.fillStyle = fill
          s.beginPath()
          s.arc(mx, my, cell * 0.12, 0, TAU)
          s.fill()
        } else if (l < 0.45) {
          const rr = cell * 0.42 * l
          s.fillStyle = fill
          s.beginPath()
          s.moveTo(mx, my - rr)
          s.lineTo(mx + rr, my)
          s.lineTo(mx, my + rr)
          s.lineTo(mx - rr, my)
          s.closePath()
          s.fill()
        } else if (l < 0.72) {
          const size = cell * 0.8 * l
          s.fillStyle = fill
          s.fillRect(mx - size / 2, my - size / 2, size, size)
        } else {
          const idx = Math.min(chars.length - 1, Math.round(l * (chars.length - 1)))
          s.fillStyle = fill
          s.fillText(chars[idx], mx, my)
        }
        break
      }
      case 'lines': {
        const h = Math.max(0.6, cell * 0.8 * l)
        s.fillStyle = fill
        s.fillRect(x, my - h / 2, cell, h)
        break
      }
      case 'diagonal': {
        const w = Math.max(0.6, cell * 0.42 * l)
        s.strokeStyle = fill
        s.lineWidth = w
        s.beginPath()
        if ((cx + cy) & 1) {
          s.moveTo(x, y)
          s.lineTo(x + cell, y + cell)
        } else {
          s.moveTo(x + cell, y)
          s.lineTo(x, y + cell)
        }
        s.stroke()
        break
      }
      case 'braille': {
        // 2x4 dot cell sampled from the finer grid, so it carries roughly
        // eight times the detail of the cell average
        const dw = cell / 2
        const dh = cell / 4
        s.fillStyle = fill
        for (let dy = 0; dy < 4; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const fx = cx * 2 + dx
            const fy = cy * 4 + dy
            const fl = this.fineL[fy * this.fineCols + fx] ?? l
            // ordered threshold per dot, so the eight dots come on as a ramp
            // instead of the whole cell switching at one brightness
            if (fl <= BAYER8[(fy & 7) * 8 + (fx & 7)] * 0.95 + 0.02) continue
            s.beginPath()
            s.arc(x + dw * (dx + 0.5), y + dh * (dy + 0.5), Math.min(dw, dh) * 0.42, 0, TAU)
            s.fill()
          }
        }
        break
      }
      case 'halfblocks': {
        // upper and lower halves sampled independently — double vertical detail
        const top = this.fineL[cy * 2 * this.fineCols + cx] ?? l
        const bot = this.fineL[(cy * 2 + 1) * this.fineCols + cx] ?? l
        s.fillStyle = `rgb(${(r * (0.4 + top)) | 0},${(g * (0.4 + top)) | 0},${(b * (0.4 + top)) | 0})`
        s.fillRect(x, y, cell + 0.5, cell / 2 + 0.5)
        s.fillStyle = `rgb(${(r * (0.4 + bot)) | 0},${(g * (0.4 + bot)) | 0},${(b * (0.4 + bot)) | 0})`
        s.fillRect(x, y + cell / 2, cell + 0.5, cell / 2 + 0.5)
        break
      }
      case 'disco': {
        const hue = (cx * 9 + cy * 13 + t * 90) % 360
        s.fillStyle = `hsl(${hue} 92% ${Math.round(6 + l * 58)}%)`
        s.beginPath()
        s.arc(mx, my, cell * 0.48 * (0.18 + 0.82 * l), 0, TAU)
        s.fill()
        if (l > 0.78) {
          s.fillStyle = 'rgba(255,255,255,0.85)'
          s.beginPath()
          s.arc(mx - cell * 0.1, my - cell * 0.1, cell * 0.07, 0, TAU)
          s.fill()
        }
        break
      }
      case 'rings': {
        s.strokeStyle = fill
        s.lineWidth = Math.max(0.5, cell * 0.1)
        const rings = l > 0.66 ? 3 : l > 0.33 ? 2 : 1
        for (let k = 1; k <= rings; k++) {
          s.beginPath()
          s.arc(mx, my, cell * 0.46 * (k / rings) * (0.4 + 0.6 * l), 0, TAU)
          s.stroke()
        }
        break
      }
      case 'hearts': {
        const sc = cell * 0.5 * (0.4 + 0.6 * l)
        s.fillStyle = fill
        s.beginPath()
        s.moveTo(mx, my + sc * 0.75)
        s.bezierCurveTo(mx - sc * 1.4, my - sc * 0.3, mx - sc * 0.45, my - sc * 1.1, mx, my - sc * 0.35)
        s.bezierCurveTo(mx + sc * 0.45, my - sc * 1.1, mx + sc * 1.4, my - sc * 0.3, mx, my + sc * 0.75)
        s.closePath()
        s.fill()
        break
      }
      case 'stars': {
        const outer = cell * 0.5 * (0.35 + 0.65 * l)
        const inner = outer * 0.42
        s.fillStyle = fill
        s.beginPath()
        for (let k = 0; k < 10; k++) {
          const rad = k & 1 ? inner : outer
          const ang = (k / 10) * TAU - Math.PI / 2
          const px = mx + Math.cos(ang) * rad
          const py = my + Math.sin(ang) * rad
          if (k === 0) s.moveTo(px, py)
          else s.lineTo(px, py)
        }
        s.closePath()
        s.fill()
        break
      }
      case 'hexagons': {
        // honeycomb: every other row is offset by half a cell
        const ox = cy & 1 ? cell * 0.5 : 0
        const rad = cell * 0.55 * (0.35 + 0.65 * l)
        s.fillStyle = fill
        s.beginPath()
        for (let k = 0; k < 6; k++) {
          const ang = (k / 6) * TAU
          const px = mx + ox + Math.cos(ang) * rad
          const py = my + Math.sin(ang) * rad
          if (k === 0) s.moveTo(px, py)
          else s.lineTo(px, py)
        }
        s.closePath()
        s.fill()
        break
      }
      case 'triangles': {
        // low-poly: two facets per cell, shaded apart so the grid reads faceted
        const flip = hash2(cx, cy) > 0.5
        const lo = `rgb(${(r * 0.72) | 0},${(g * 0.72) | 0},${(b * 0.72) | 0})`
        const hi = `rgb(${Math.min(255, (r * 1.2) | 0)},${Math.min(255, (g * 1.2) | 0)},${Math.min(255, (b * 1.2) | 0)})`
        s.fillStyle = hi
        s.beginPath()
        s.moveTo(x, y)
        if (flip) {
          s.lineTo(x + cell, y)
          s.lineTo(x, y + cell)
        } else {
          s.lineTo(x + cell, y)
          s.lineTo(x + cell, y + cell)
        }
        s.closePath()
        s.fill()
        s.fillStyle = lo
        s.beginPath()
        if (flip) {
          s.moveTo(x + cell, y)
          s.lineTo(x + cell, y + cell)
          s.lineTo(x, y + cell)
        } else {
          s.moveTo(x, y)
          s.lineTo(x + cell, y + cell)
          s.lineTo(x, y + cell)
        }
        s.closePath()
        s.fill()
        break
      }
      case 'bubbles': {
        const rad = cell * 0.46 * (0.35 + 0.65 * l)
        s.strokeStyle = `rgba(${r},${g},${b},0.9)`
        s.lineWidth = Math.max(0.5, cell * 0.07)
        s.beginPath()
        s.arc(mx, my, rad, 0, TAU)
        s.stroke()
        s.fillStyle = `rgba(${r},${g},${b},0.22)`
        s.fill()
        s.fillStyle = `rgba(255,255,255,${0.25 + l * 0.5})`
        s.beginPath()
        s.arc(mx - rad * 0.35, my - rad * 0.35, Math.max(0.4, rad * 0.16), 0, TAU)
        s.fill()
        break
      }
      case 'hatch': {
        // pencil cross-hatch: more passes where there is more to show
        const passes = Math.min(4, Math.round(Math.pow(l, 0.55) * 4.4))
        if (passes <= 0) break
        s.strokeStyle = `rgba(${r},${g},${b},0.9)`
        s.lineWidth = Math.max(0.5, cell * 0.07)
        s.beginPath()
        for (let k = 0; k < passes; k++) {
          const off = ((k + 1) / (passes + 1)) * cell
          s.moveTo(x, y + off)
          s.lineTo(x + off, y)
          s.moveTo(x + cell - off, y + cell)
          s.lineTo(x + cell, y + cell - off)
        }
        if (passes >= 3) {
          for (let k = 0; k < passes - 2; k++) {
            const off = ((k + 1) / (passes - 1)) * cell
            s.moveTo(x + cell - off, y)
            s.lineTo(x + cell, y + off)
          }
        }
        s.stroke()
        break
      }
    }
  }

  /**
   * Rounded tiles that grow with luminance, leaving the dark grid gaps that
   * give the reference frame its beaded look. Split out from drawCell because
   * it is the default mode: filling a cached Path2D under a per-cell transform
   * costs roughly half of rebuilding a roundRect path every cell.
   */
  private drawMosaic(s: CanvasRenderingContext2D, t: number) {
    const { cols, rows, cfg, dpr } = this
    const cell = cfg.cellSize
    const cov = clamp(cfg.coverage / 100)
    const density = clamp(cfg.density / 100)
    const paths = this.beads(cell)
    const last = paths.length - 1

    for (let cy = 0; cy < rows; cy++) {
      const my = (cy * cell + cell * 0.5) * dpr
      for (let cx = 0; cx < cols; cx++) {
        if (cov < 1 && hash2(cx * 31 + 7, cy * 17 + 3) > cov) continue
        const i = cy * cols + cx
        const m = this.animFactor(cx, cy, t)
        let l = clamp(this.cellL[i] * m)
        if (density > 0) l = clamp(l + density * (1 - l) * 0.85)
        if (l <= 0.005) continue
        s.fillStyle = this.colorStr(
          clamp(this.cellR[i] * m, 0, 255) | 0,
          clamp(this.cellG[i] * m, 0, 255) | 0,
          clamp(this.cellB[i] * m, 0, 255) | 0,
        )
        s.setTransform(dpr, 0, 0, dpr, (cx * cell + cell * 0.5) * dpr, my)
        s.fill(paths[Math.min(last, (l * paths.length) | 0)])
      }
    }
    s.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  private roundRectPath(
    s: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    s.beginPath()
    if (typeof s.roundRect === 'function') {
      s.roundRect(x, y, w, h, r)
      return
    }
    const rr = Math.min(r, w / 2, h / 2)
    s.moveTo(x + rr, y)
    s.arcTo(x + w, y, x + w, y + h, rr)
    s.arcTo(x + w, y + h, x, y + h, rr)
    s.arcTo(x, y + h, x, y, rr)
    s.arcTo(x, y, x + w, y, rr)
    s.closePath()
  }

  /** Green code rain. Self-animated, brightness still driven by the photo. */
  private drawMatrixRain(s: CanvasRenderingContext2D, t: number, dt: number) {
    const { cols, rows, cfg } = this
    const cell = cfg.cellSize
    const trail = Math.max(6, rows * 0.35)
    for (let cx = 0; cx < cols; cx++) {
      this.rainHeads[cx] += this.rainSpeeds[cx] * dt
      if (this.rainHeads[cx] - trail > rows) this.rainHeads[cx] = -hash2(cx, (t | 0) + 1) * rows * 0.5
      const head = this.rainHeads[cx]
      for (let cy = 0; cy < rows; cy++) {
        const dist = head - cy
        if (dist < 0 || dist > trail) continue
        const fade = 1 - dist / trail
        const lum = this.cellL[cy * cols + cx]
        const a = clamp(fade * fade * (0.25 + lum * 1.4))
        if (a < 0.02) continue
        const gi = (hash2(cx, cy + ((t * 8) | 0)) * MATRIX_GLYPHS.length) | 0
        s.fillStyle =
          dist < 1
            ? `rgba(210,255,222,${clamp(a + 0.35)})`
            : `rgba(${(60 * fade) | 0},${(200 + 55 * fade) | 0},${(110 * fade) | 0},${a})`
        s.fillText(MATRIX_GLYPHS[gi], cx * cell + cell / 2, cy * cell + cell / 2)
      }
    }
  }

  /** Topographic iso-lines: stroke wherever the quantised level steps. */
  private drawContour(s: CanvasRenderingContext2D) {
    const { cols, rows, cfg, cellL } = this
    const cell = cfg.cellSize
    const levels = 9
    s.lineWidth = Math.max(0.6, cell * 0.1)
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const i = cy * cols + cx
        const lv = Math.round(cellL[i] * levels)
        const right = cx + 1 < cols ? Math.round(cellL[i + 1] * levels) : lv
        const down = cy + 1 < rows ? Math.round(cellL[i + cols] * levels) : lv
        if (lv === right && lv === down) continue
        const x = cx * cell
        const y = cy * cell
        s.strokeStyle = `rgb(${this.cellR[i]},${this.cellG[i]},${this.cellB[i]})`
        s.beginPath()
        if (lv !== right) {
          s.moveTo(x + cell, y)
          s.lineTo(x + cell, y + cell)
        }
        if (lv !== down) {
          s.moveTo(x, y + cell)
          s.lineTo(x + cell, y + cell)
        }
        s.stroke()
      }
    }
  }

  // ------------------------------------------------------------- blur pass

  private sizeFx(c: HTMLCanvasElement, w: number, h: number) {
    if (c.width !== w || c.height !== h) {
      c.width = w
      c.height = h
    }
  }

  private applyBlur(s: CanvasRenderingContext2D) {
    const { cfg } = this
    const W = this.work.width
    const H = this.work.height
    const amt = (cfg.blurAmount / 100) * 36 * this.dpr
    if (amt < 0.4) return

    this.sizeFx(this.fxA, W, H)
    const a = this.fxACtx
    a.setTransform(1, 0, 0, 1, 0, 0)
    a.globalCompositeOperation = 'source-over'
    a.globalAlpha = 1
    a.filter = 'none'
    a.clearRect(0, 0, W, H)

    const cx = (cfg.blurCenterX / 100) * W
    const cy = (cfg.blurCenterY / 100) * H

    if (cfg.blurType === 'directional') {
      const rad = (cfg.blurAngle * Math.PI) / 180
      const dx = Math.cos(rad)
      const dy = Math.sin(rad)
      const steps = 12
      a.globalAlpha = 1 / steps
      for (let i = 0; i < steps; i++) {
        const k = cfg.directionalBothSides ? (i / (steps - 1)) * 2 - 1 : i / (steps - 1)
        a.drawImage(this.work, dx * amt * k, dy * amt * k)
      }
      a.globalAlpha = 1
      s.clearRect(0, 0, W, H)
      s.drawImage(this.fxA, 0, 0)
      return
    }

    if (cfg.blurType === 'zoom' || cfg.blurType === 'radial') {
      const steps = 12
      a.globalAlpha = 1 / steps
      for (let i = 0; i < steps; i++) {
        const k = i / (steps - 1)
        a.save()
        a.translate(cx, cy)
        if (cfg.blurType === 'zoom') {
          const sc = 1 + k * (amt / Math.max(W, H)) * 2.2
          a.scale(sc, sc)
        } else {
          a.rotate(((k - 0.5) * amt) / Math.max(W, H) * 2.4)
        }
        a.translate(-cx, -cy)
        a.drawImage(this.work, 0, 0)
        a.restore()
      }
      a.globalAlpha = 1
      s.clearRect(0, 0, W, H)
      s.drawImage(this.fxA, 0, 0)
      return
    }

    if (!supportsFilter()) return
    a.filter = `blur(${amt}px)`
    a.drawImage(this.work, 0, 0)
    a.filter = 'none'

    if (cfg.blurType === 'gaussian') {
      s.clearRect(0, 0, W, H)
      s.drawImage(this.fxA, 0, 0)
      return
    }

    // tilt / lens / progressive keep part of the frame sharp: cut the blurred
    // copy down with a gradient, then lay it back over the sharp original
    let grad: CanvasGradient
    if (cfg.blurType === 'tilt') {
      const pos = (cfg.tiltPosition / 100) * H
      const half = (cfg.tiltFocus / 100) * H * 0.5
      const feather = Math.max(1, (cfg.tiltFeather / 100) * H * 0.5)
      grad = a.createLinearGradient(0, 0, 0, H)
      const stops: Array<[number, number]> = [
        [0, 1],
        [clamp((pos - half - feather) / H), 1],
        [clamp((pos - half) / H), 0],
        [clamp((pos + half) / H), 0],
        [clamp((pos + half + feather) / H), 1],
        [1, 1],
      ]
      for (const [p, alpha] of stops) grad.addColorStop(clamp(p), `rgba(0,0,0,${alpha})`)
    } else if (cfg.blurType === 'lens') {
      const maxR = Math.hypot(W, H) * 0.5
      const inner = (cfg.lensFocus / 100) * maxR
      grad = a.createRadialGradient(cx, cy, inner * 0.6, cx, cy, Math.max(inner + 1, maxR))
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(0.55, 'rgba(0,0,0,0.55)')
      grad.addColorStop(1, 'rgba(0,0,0,1)')
    } else {
      const p = clamp(cfg.progressivePosition / 100)
      grad = a.createLinearGradient(0, 0, 0, H)
      if (cfg.progressiveReverse) {
        grad.addColorStop(0, 'rgba(0,0,0,1)')
        grad.addColorStop(clamp(p), 'rgba(0,0,0,0)')
        grad.addColorStop(1, 'rgba(0,0,0,0)')
      } else {
        grad.addColorStop(0, 'rgba(0,0,0,0)')
        grad.addColorStop(clamp(p), 'rgba(0,0,0,0)')
        grad.addColorStop(1, 'rgba(0,0,0,1)')
      }
    }
    a.globalCompositeOperation = 'destination-in'
    a.fillStyle = grad
    a.fillRect(0, 0, W, H)
    a.globalCompositeOperation = 'source-over'
    s.drawImage(this.fxA, 0, 0)
  }

  // ----------------------------------------------------------- post effects

  private fxVignette(s: CanvasRenderingContext2D, intensity: number) {
    const W = this.work.width
    const H = this.work.height
    if (!this.vignetteGrad) {
      const cx = W / 2
      const cy = H / 2
      const g = s.createRadialGradient(cx, cy, Math.min(W, H) * 0.22, cx, cy, Math.hypot(W, H) * 0.62)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(0.55, 'rgba(0,0,0,0.35)')
      g.addColorStop(1, 'rgba(0,0,0,1)')
      this.vignetteGrad = g
    }
    s.save()
    s.globalAlpha = clamp((intensity / 100) * 1.15)
    s.fillStyle = this.vignetteGrad
    s.fillRect(0, 0, W, H)
    s.restore()
  }

  private fxBloom(s: CanvasRenderingContext2D, intensity: number) {
    const W = this.work.width
    const H = this.work.height
    const k = clamp(intensity / 100)
    // work at a sixth of the frame: the blur is the expensive part and it is
    // being smeared wide anyway, so the lost detail never shows
    const sw = Math.max(2, (W / 6) | 0)
    const sh = Math.max(2, (H / 6) | 0)
    // Downscale first with no filter, then isolate and smear the highlights on
    // the small buffer — running the filter chain against the full frame costs
    // an order of magnitude more.
    this.sizeFx(this.fxB, sw, sh)
    const b = this.fxBCtx
    b.setTransform(1, 0, 0, 1, 0, 0)
    b.globalCompositeOperation = 'source-over'
    b.globalAlpha = 1
    b.imageSmoothingEnabled = true
    b.clearRect(0, 0, sw, sh)
    b.drawImage(this.work, 0, 0, sw, sh)

    this.sizeFx(this.fxA, sw, sh)
    const a = this.fxACtx
    a.setTransform(1, 0, 0, 1, 0, 0)
    a.globalCompositeOperation = 'source-over'
    a.globalAlpha = 1
    a.clearRect(0, 0, sw, sh)
    a.filter = supportsFilter() ? `brightness(1.25) contrast(2.1) blur(${1.5 + k * 3.5}px)` : 'none'
    a.drawImage(this.fxB, 0, 0)
    a.filter = 'none'
    s.save()
    s.globalCompositeOperation = 'lighter'
    s.globalAlpha = 0.2 + k * 0.85
    s.imageSmoothingEnabled = true
    s.drawImage(this.fxA, 0, 0, W, H)
    s.restore()
  }

  private fxScanLines(s: CanvasRenderingContext2D, intensity: number) {
    const W = this.work.width
    const H = this.work.height
    if (!this.scanPattern) {
      const pitch = Math.max(2, Math.round(3 * this.dpr))
      const tile = makeCanvas(1, pitch)
      const tc = ctx2d(tile)
      tc.fillStyle = '#000'
      tc.fillRect(0, 0, 1, Math.max(1, pitch / 2))
      this.scanPattern = s.createPattern(tile, 'repeat')
    }
    if (!this.scanPattern) return
    s.save()
    s.globalAlpha = clamp((intensity / 100) * 0.75)
    s.fillStyle = this.scanPattern
    s.fillRect(0, 0, W, H)
    s.restore()
  }

  private fxChromatic(s: CanvasRenderingContext2D, intensity: number) {
    const W = this.work.width
    const H = this.work.height
    const off = (intensity / 100) * 12 * this.dpr
    if (off < 0.4) return
    this.sizeFx(this.fxA, W, H)
    this.sizeFx(this.fxB, W, H)
    const a = this.fxACtx
    const b = this.fxBCtx
    a.setTransform(1, 0, 0, 1, 0, 0)
    a.globalCompositeOperation = 'source-over'
    a.globalAlpha = 1
    a.clearRect(0, 0, W, H)
    a.drawImage(this.work, 0, 0)

    const channel = (colour: string, dx: number) => {
      b.setTransform(1, 0, 0, 1, 0, 0)
      b.globalCompositeOperation = 'source-over'
      b.globalAlpha = 1
      b.clearRect(0, 0, W, H)
      b.drawImage(this.fxA, 0, 0)
      b.globalCompositeOperation = 'multiply'
      b.fillStyle = colour
      b.fillRect(0, 0, W, H)
      b.globalCompositeOperation = 'destination-in'
      b.drawImage(this.fxA, 0, 0)
      b.globalCompositeOperation = 'source-over'
      s.drawImage(this.fxB, dx, 0)
    }

    s.save()
    s.clearRect(0, 0, W, H)
    s.globalCompositeOperation = 'lighter'
    channel('#ff0000', -off)
    channel('#00ff00', 0)
    channel('#0000ff', off)
    s.restore()
  }

  private fxFilmGrain(s: CanvasRenderingContext2D, intensity: number, t: number) {
    const W = this.work.width
    const H = this.work.height
    if (!this.grainPattern) {
      const size = 128
      const tile = makeCanvas(size, size)
      const tc = ctx2d(tile)
      const img = tc.createImageData(size, size)
      for (let i = 0; i < size * size; i++) {
        const v = 110 + Math.random() * 90
        img.data[i * 4] = v
        img.data[i * 4 + 1] = v
        img.data[i * 4 + 2] = v
        img.data[i * 4 + 3] = 255
      }
      tc.putImageData(img, 0, 0)
      this.grainPattern = s.createPattern(tile, 'repeat')
    }
    if (!this.grainPattern) return
    s.save()
    s.globalCompositeOperation = 'overlay'
    s.globalAlpha = clamp((intensity / 100) * 0.55)
    // jitter the tile every frame so the grain crawls instead of sitting still
    s.translate(((t * 617) % 128 | 0) - 64, ((t * 971) % 128 | 0) - 64)
    s.fillStyle = this.grainPattern
    s.fillRect(-128, -128, W + 256, H + 256)
    s.restore()
  }

  private fxGlitch(s: CanvasRenderingContext2D, intensity: number, t: number) {
    const W = this.work.width
    const H = this.work.height
    const k = clamp(intensity / 100)
    const seed = (t * 6) | 0
    const slices = 2 + Math.round(k * 8)
    this.sizeFx(this.fxA, W, H)
    const a = this.fxACtx
    a.setTransform(1, 0, 0, 1, 0, 0)
    a.globalCompositeOperation = 'source-over'
    a.globalAlpha = 1
    a.clearRect(0, 0, W, H)
    a.drawImage(this.work, 0, 0)
    for (let i = 0; i < slices; i++) {
      if (hash2(seed, i * 13) > 0.55) continue
      const sy = hash2(seed + 1, i * 7) * H
      const sh = (4 + hash2(seed + 2, i * 11) * 40) * this.dpr
      const dx = (hash2(seed + 3, i * 5) - 0.5) * k * 90 * this.dpr
      s.clearRect(0, sy, W, sh)
      s.drawImage(this.fxA, 0, sy, W, sh, dx, sy, W, sh)
      s.save()
      s.globalCompositeOperation = 'lighter'
      s.globalAlpha = k * 0.4
      s.fillStyle = i & 1 ? '#ff0044' : '#00d4ff'
      s.fillRect(dx, sy, W, sh)
      s.restore()
    }
  }

  private fxHalftone(s: CanvasRenderingContext2D, intensity: number) {
    const W = this.work.width
    const H = this.work.height
    if (!this.halftonePattern) {
      const size = Math.max(4, Math.round(5 * this.dpr))
      const tile = makeCanvas(size, size)
      const tc = ctx2d(tile)
      tc.fillStyle = '#000'
      tc.beginPath()
      tc.arc(size / 2, size / 2, size * 0.32, 0, TAU)
      tc.fill()
      this.halftonePattern = s.createPattern(tile, 'repeat')
    }
    if (!this.halftonePattern) return
    s.save()
    s.globalCompositeOperation = 'multiply'
    s.globalAlpha = clamp(intensity / 100)
    s.fillStyle = this.halftonePattern
    s.fillRect(0, 0, W, H)
    s.restore()
  }

  private fxPixelate(s: CanvasRenderingContext2D, intensity: number) {
    const W = this.work.width
    const H = this.work.height
    const factor = 1 + (intensity / 100) * 14
    const sw = Math.max(2, (W / factor) | 0)
    const sh = Math.max(2, (H / factor) | 0)
    this.sizeFx(this.fxA, sw, sh)
    const a = this.fxACtx
    a.setTransform(1, 0, 0, 1, 0, 0)
    a.globalCompositeOperation = 'source-over'
    a.globalAlpha = 1
    a.imageSmoothingEnabled = true
    a.clearRect(0, 0, sw, sh)
    a.drawImage(this.work, 0, 0, sw, sh)
    s.save()
    s.imageSmoothingEnabled = false
    s.clearRect(0, 0, W, H)
    s.drawImage(this.fxA, 0, 0, sw, sh, 0, 0, W, H)
    s.restore()
    s.imageSmoothingEnabled = true
  }

  private fxFilmDust(s: CanvasRenderingContext2D, intensity: number, t: number) {
    const W = this.work.width
    const H = this.work.height
    const k = clamp(intensity / 100)
    const seed = (t * 12) | 0
    const specks = Math.round(k * 60)
    s.save()
    for (let i = 0; i < specks; i++) {
      const x = hash2(seed, i * 3 + 1) * W
      const y = hash2(seed + 1, i * 5 + 2) * H
      const r = (0.5 + hash2(seed + 2, i * 7) * 1.6) * this.dpr
      s.fillStyle = hash2(seed + 3, i) > 0.5 ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.55)'
      s.beginPath()
      s.arc(x, y, r, 0, TAU)
      s.fill()
    }
    const scratches = Math.round(k * 3)
    for (let i = 0; i < scratches; i++) {
      if (hash2(seed + 9, i) > 0.4) continue
      const x = hash2(seed + 11, i * 13) * W
      s.strokeStyle = 'rgba(255,255,255,0.16)'
      s.lineWidth = this.dpr
      s.beginPath()
      s.moveTo(x, 0)
      s.lineTo(x + (hash2(seed + 12, i) - 0.5) * 30, H)
      s.stroke()
    }
    s.restore()
  }

  private drawLights(s: CanvasRenderingContext2D) {
    const W = this.work.width
    const H = this.work.height
    const diag = Math.hypot(W, H)
    s.save()
    s.globalCompositeOperation = 'lighter'
    for (const pt of this.cfg.lights.points as LightPoint[]) {
      const x = pt.x * W
      const y = pt.y * H
      const rad = Math.max(2, pt.radius * diag)
      const [r, g, b] = hexToRgb(pt.color ?? '#ffd9a0')
      const a = clamp((pt.intensity ?? 50) / 100)
      const grad = s.createRadialGradient(x, y, 0, x, y, rad)
      grad.addColorStop(0, `rgba(${r},${g},${b},${a})`)
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${a * 0.32})`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      s.fillStyle = grad
      s.fillRect(x - rad, y - rad, rad * 2, rad * 2)
    }
    s.restore()
  }

  /**
   * Mask pass. Only runs when a reveal mask is active: the plain photo goes
   * down first, then the effect layer with the masked region punched out.
   */
  private composite() {
    const { ctx, canvas, maskImg } = this
    if (!maskImg) return
    const W = canvas.width
    const H = canvas.height
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(this.photo, 0, 0)
    this.sizeFx(this.fxA, W, H)
    const a = this.fxACtx
    a.setTransform(1, 0, 0, 1, 0, 0)
    a.globalCompositeOperation = 'source-over'
    a.globalAlpha = 1
    a.clearRect(0, 0, W, H)
    a.drawImage(this.work, 0, 0)
    a.globalCompositeOperation = this.cfg.mask.invert ? 'destination-in' : 'destination-out'
    a.drawImage(maskImg, 0, 0, W, H)
    a.globalCompositeOperation = 'source-over'
    ctx.drawImage(this.fxA, 0, 0)
  }

  dispose() {
    for (const c of [this.photo, this.scene, this.fxA, this.fxB, this.small, this.fine]) {
      c.width = 1
      c.height = 1
    }
    this.img = null
    this.maskImg = null
  }
}
