import type { Mode } from '../tokens/tokens.types';

/** Base color families. Extend this union to add more bases. */
export type BaseKey = 'primary' | 'secondary';

/**
 * Color theme for a chart:
 *  - `categorical` — fixed multi-hue hello pc palette
 *  - `sequential` / `semantic` / `diverging` — value ramps
 *  - `primary` — one solid primary-family token (see `token`)
 *  - `secondary` — wireframe: multiple secondary greys (+ patterns after 6)
 */
export type Variation =
  | 'categorical'
  | 'sequential'
  | 'semantic'
  | 'diverging'
  | 'primary'
  | 'secondary';

/** Wireframe (secondary) uses this many distinct gray shades before patterns. */
export const WIREFRAME_SHADE_LIMIT = 6;

export interface ColorConfig {
  variation: Variation;
  /** Which family to mix when variation === 'categorical' (a mix of primary, or of secondary). */
  base?: BaseKey;
  /** Selected token id (e.g. "primary.primaryOverlay") for primary/secondary modes. */
  token?: string;
}

/**
 * The runtime color system derived from the (mode-aware) base tokens.
 * `resolve()` is what charts call: given the panel's color config and the number
 * of color slots needed, it returns final hex strings.
 */
/** Meaning-based colors for semantic charts (pos/neg bars, waterfall, …). */
export interface SemanticColors {
  positive: string;
  negative: string;
  warning: string;
  info: string;
  neutral: string;
}

export interface ChartColorSystem {
  base: Record<BaseKey, string>;
  /** Semantic role colors (token-driven), for charts that encode meaning. */
  semantic: SemanticColors;
  /** Distinct hues/tones for unrelated categories. */
  categorical: (count: number) => string[];
  /** Fixed single-hue sequential ramp (light→dark), sampled to `count` colors. */
  sequential: (count: number) => string[];
  /** The raw sequential stops (light→dark) — for visualMap / gradient fills. */
  sequentialRamp: string[];
  /** Semantic red→green ramp (bad→good), sampled to `count` colors. */
  semanticScale: (count: number) => string[];
  /** The raw red→green stops (low→high) — for visualMap / gauge zones. */
  semanticRamp: string[];
  /** Diverging cyan↔violet ramp (low→high), sampled to `count` colors. */
  diverging: (count: number) => string[];
  /** The raw diverging stops (low→high) — for visualMap / gauge zones. */
  divergingRamp: string[];
  /** Ordered light→dark ramp anchored on a base (sequential data). */
  tonal: (base: BaseKey, steps: number) => string[];
  /** Panel selection → final colors. */
  resolve: (config: ColorConfig, count: number) => string[];
  /** Interaction-state colors for a mark's rest color — prefers the real token
   *  Hover/Press variants (e.g. tonal → tonalHover/tonalPress); otherwise derived. */
  states: (config: ColorConfig, rest: string) => { hover: string; press: string };
}

export interface ChartTheme {
  mode: Mode;
  surface: { canvas: string; card: string; onContainerHigh: string };
  text: { primary: string; secondary: string; helper: string };
  axis: { line: string; tick: string; label: string };
  grid: { line: string };
  border: { weak: string; standard: string };
  tooltip: { bg: string; text: string; border: string; shadow: string; radius: number };
  focus: string;
  shape: {
    cornerRadius: number;
    strokeWidth: number;
    dotRadius: number;
    donutInnerRatio: number;
  };
  motion: { duration: number; easing: [number, number, number, number]; stagger: number };
  color: ChartColorSystem;
}
