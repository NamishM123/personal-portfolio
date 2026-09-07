/**
 * Config types for the ASCII / halftone raster effect.
 *
 * This is a from-scratch Canvas2D reimplementation of the "Vignette Bloom"
 * preset from the 21st.dev ASCII art community component. Nothing here
 * depends on that project's internals — the whole pipeline is rebuilt below
 * in `engine.ts` from the documented parameter surface.
 */

export type RenderMode =
  | 'characters'
  | 'dither'
  | 'mosaic'
  | 'pixel'
  | 'dots'
  | 'cross'
  | 'diamond'
  | 'voxel'
  | 'lego'
  | 'mixed'
  | 'lines'
  | 'diagonal'
  | 'braille'
  | 'disco'
  | 'hexdump'
  | 'matrix'
  | 'rings'
  | 'hearts'
  | 'stars'
  | 'hexagons'
  | 'triangles'
  | 'bubbles'
  | 'hatch'
  | 'contour'
  | 'halfblocks'

/** What shows behind the drawn grid. */
export type BgMode = 'blur' | 'solid' | 'photo' | 'none'

export type CharSetName =
  | 'standard'
  | 'blocks'
  | 'minimal'
  | 'dense'
  | 'binary'
  | 'shades'
  | 'custom'

export type BlurType =
  | 'off'
  | 'gaussian'
  | 'directional'
  | 'radial'
  | 'zoom'
  | 'tilt'
  | 'lens'
  | 'progressive'

export type AnimStyle = 'wave' | 'pulse' | 'shimmer' | 'ripple' | 'flicker'

export type PfxKey =
  | 'scanLines'
  | 'vignette'
  | 'bloom'
  | 'chromatic'
  | 'filmGrain'
  | 'glitch'
  | 'halftone'
  | 'pixelate'
  | 'filmDust'

/** An on/off switch with a 0-100 strength. */
export interface Toggle {
  enabled: boolean
  intensity: number
}

export interface CurvePoint {
  x: number
  y: number
}

export interface LightPoint {
  /** normalized 0-1 across the canvas */
  x: number
  y: number
  /** normalized against the canvas diagonal */
  radius: number
  /** 0-100 */
  intensity: number
  color?: string
}

export interface AsciiConfig {
  renderMode: RenderMode

  bgMode: BgMode
  /** px of blur applied to the backdrop when bgMode is 'blur' */
  bgBlur: number
  /** 0-100 */
  bgOpacity: number
  /** used when bgMode is 'solid' */
  bgColor: string

  /** grid pitch in CSS pixels */
  cellSize: number
  /** 0-100, percentage of cells actually drawn */
  coverage: number
  invert: boolean
  /** composite op used to lay the grid over the backdrop */
  styleBlend: GlobalCompositeOperation

  charSet: CharSetName
  customChars: string

  /** -100..100 */
  brightness: number
  /** percent, 100 is neutral */
  contrast: number
  /** 0-100, boosts cells that sit on a luminance edge */
  edgeEmphasis: number
  /** 0-100, biases every cell toward a fuller shape */
  density: number
  toneCurve: CurvePoint[]

  tint: string
  /** 0-100 */
  tintOpacity: number
  overlayBlend: GlobalCompositeOperation
  /** percent, 100 is neutral */
  saturation: number
  /** 0-100 */
  grayscale: number

  blurType: BlurType
  /** 0-100 */
  blurAmount: number
  /** degrees, for directional blur */
  blurAngle: number
  directionalBothSides: boolean
  /** 0-100, height of the sharp band for tilt-shift */
  tiltFocus: number
  /** 0-100, vertical placement of that band */
  tiltPosition: number
  /** 0-100, softness of the band edges */
  tiltFeather: number
  /** 0-100, radius of the sharp circle for lens blur */
  lensFocus: number
  /** 0-100 */
  blurCenterX: number
  blurCenterY: number
  /** 0-100, where the progressive ramp begins */
  progressivePosition: number
  progressiveReverse: boolean

  pfx: Record<PfxKey, Toggle>

  animated: boolean
  animStyle: AnimStyle
  animSpeed: Toggle
  animIntensity: Toggle

  lights: {
    enabled: boolean
    points: LightPoint[]
  }

  mask: {
    enabled: boolean
    tool?: string
    brushSize?: number
    showOverlay?: boolean
    invert: boolean
    dataUrl: string | null
    shapes?: unknown[]
  }
}

/** Character ramps, ordered dark -> light. */
export const CHAR_SETS: Record<Exclude<CharSetName, 'custom'>, string> = {
  standard: ' .:-=+*#%@',
  blocks: ' ░▒▓█',
  minimal: ' .:*#',
  dense: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  binary: ' 01',
  shades: ' ·∷⁙░▒▓█',
}

/**
 * The "Vignette Bloom" preset, verbatim from the 21st.dev parameter dump.
 * `bgColor` is the one addition — the dump specifies `bgMode: "solid"`
 * without naming the colour, and the reference frame reads as pure black.
 */
export const VIGNETTE_BLOOM: AsciiConfig = {
  renderMode: 'mosaic',
  bgMode: 'solid',
  bgBlur: 12,
  bgOpacity: 90,
  bgColor: '#000000',
  cellSize: 16,
  coverage: 100,
  invert: false,
  styleBlend: 'source-over',
  charSet: 'standard',
  customChars: '',
  brightness: 12,
  contrast: 115,
  edgeEmphasis: 0,
  density: 0,
  toneCurve: [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
  tint: '#3ca6ff',
  tintOpacity: 0,
  overlayBlend: 'multiply',
  saturation: 100,
  grayscale: 0,
  blurType: 'off',
  blurAmount: 35,
  blurAngle: 0,
  directionalBothSides: false,
  tiltFocus: 35,
  tiltPosition: 50,
  tiltFeather: 15,
  lensFocus: 40,
  blurCenterX: 50,
  blurCenterY: 50,
  progressivePosition: 55,
  progressiveReverse: false,
  pfx: {
    vignette: { enabled: true, intensity: 38 },
    scanLines: { enabled: false, intensity: 40 },
    chromatic: { enabled: false, intensity: 15 },
    bloom: { enabled: true, intensity: 25 },
    filmGrain: { enabled: false, intensity: 30 },
    glitch: { enabled: false, intensity: 20 },
    pixelate: { enabled: false, intensity: 15 },
    halftone: { enabled: false, intensity: 20 },
    filmDust: { enabled: false, intensity: 20 },
  },
  animated: true,
  animStyle: 'wave',
  animSpeed: { enabled: true, intensity: 100 },
  animIntensity: { enabled: true, intensity: 60 },
  lights: {
    enabled: false,
    points: [],
  },
  mask: {
    enabled: false,
    tool: 'freehand',
    brushSize: 30,
    showOverlay: false,
    invert: false,
    dataUrl: null,
    shapes: [],
  },
}

/** Shallow-merges a partial override onto the preset, one level into objects. */
export function resolveConfig(overrides?: DeepPartial<AsciiConfig>): AsciiConfig {
  if (!overrides) return { ...VIGNETTE_BLOOM }
  const o = overrides as Partial<AsciiConfig>
  return {
    ...VIGNETTE_BLOOM,
    ...o,
    pfx: { ...VIGNETTE_BLOOM.pfx, ...(o.pfx ?? {}) },
    animSpeed: { ...VIGNETTE_BLOOM.animSpeed, ...(o.animSpeed ?? {}) },
    animIntensity: { ...VIGNETTE_BLOOM.animIntensity, ...(o.animIntensity ?? {}) },
    lights: { ...VIGNETTE_BLOOM.lights, ...(o.lights ?? {}) },
    mask: { ...VIGNETTE_BLOOM.mask, ...(o.mask ?? {}) },
    toneCurve: o.toneCurve ?? VIGNETTE_BLOOM.toneCurve,
  }
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K]
}
