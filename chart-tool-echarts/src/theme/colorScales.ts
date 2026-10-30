import { oklch, oklab, formatHex, clampChroma, clampRgb } from 'culori';
import type { Mode } from '../tokens/tokens.types';
import type { BaseKey, ChartColorSystem, ColorConfig, SemanticColors } from './chartTheme.types';
import { WIREFRAME_SHADE_LIMIT } from './chartTheme.types';

interface Lab {
  mode: 'oklab';
  l: number;
  a: number;
  b: number;
}
function toOklab(hex: string): Lab {
  const p = oklab(hex);
  if (!p) return { mode: 'oklab', l: 0.5, a: 0, b: 0 };
  return { mode: 'oklab', l: p.l, a: p.a ?? 0, b: p.b ?? 0 };
}

const FALLBACK_SEMANTIC: SemanticColors = {
  positive: '#38871d',
  negative: '#df2e3c',
  warning: '#fcbb42',
  info: '#0077dc',
  neutral: '#ababab',
};

/**
 * Mode-aware color derivation in OKLCH, scoped to a single base.
 *
 * Each base (primary, secondary) owns its own family — selecting a base never
 * pulls in the other, so "primary" stays its own hue and never shows the neutral
 * secondary's grey. From the chosen base we derive:
 *  - tonal()       — ordered light→dark ramp (sequential data)
 *  - categorical() — distinct, contrast-ordered steps of the same hue
 *
 * Per-mode lightness/chroma windows keep colors readable on each surface
 * (lighter + slightly desaturated on dark) rather than naively inverting.
 *
 * Only primary + secondary are used for now; the architecture (base registry +
 * scale builders) extends to more bases/scale types without rework.
 */

interface Ok {
  mode: 'oklch';
  l: number;
  c: number;
  h: number;
}

function toOklch(hex: string): Ok {
  const parsed = oklch(hex);
  if (!parsed) return { mode: 'oklch', l: 0.5, c: 0.1, h: 0 };
  return { mode: 'oklch', l: parsed.l, c: parsed.c, h: parsed.h ?? 0 };
}

function toHex(o: Ok): string {
  return formatHex(clampChroma({ mode: 'oklch', l: o.l, c: o.c, h: o.h }, 'oklch')) ?? '#000000';
}

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/** Dark-canvas modes (dark + Windows HCT) share the lighter ramp window. */
function isDarkCanvas(mode: Mode): boolean {
  return mode === 'dark' || mode === 'hct';
}

/** Lightness window for a base's ramp. `wide` spreads steps further apart for
 *  categorical (more distinguishable); narrow is for tonal sequences. */
function lightnessWindow(mode: Mode, wide: boolean): { lo: number; hi: number } {
  if (isDarkCanvas(mode)) return wide ? { lo: 0.5, hi: 0.95 } : { lo: 0.55, hi: 0.9 };
  return wide ? { lo: 0.34, hi: 0.92 } : { lo: 0.42, hi: 0.86 };
}

/** light → dark ramp of a single hue. */
function ramp(baseHex: string, steps: number, mode: Mode, wide: boolean): string[] {
  const base = toOklch(baseHex);
  const { lo, hi } = lightnessWindow(mode, wide);
  const c = base.c * (isDarkCanvas(mode) ? 0.85 : 1);
  if (steps <= 1) return [toHex({ mode: 'oklch', l: clamp(base.l, lo, hi), c, h: base.h })];
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return toHex({ mode: 'oklch', l: hi - t * (hi - lo), c, h: base.h });
  });
}

/** Derived hover/press shade when no real token variant exists (categorical,
 *  tonalLightest, …): nudge lightness — darker on light surfaces, lighter on dark. */
function deriveState(color: string, state: 'hover' | 'press', mode: Mode): string {
  const o = toOklch(color);
  const d = state === 'press' ? 0.1 : 0.05;
  const l = clamp(isDarkCanvas(mode) ? o.l + d : o.l - d, 0.05, 0.97);
  return toHex({ mode: 'oklch', l, c: o.c, h: o.h });
}

/** Reorder a ramp so adjacent entries contrast (alternating ends inward) — turns
 *  a smooth ramp into distinguishable categorical steps within one hue. */
function interleave(values: string[]): string[] {
  const out: string[] = [];
  let lo = 0;
  let hi = values.length - 1;
  let takeHi = true;
  while (lo <= hi) {
    out.push(takeHi ? values[hi--] : values[lo++]);
    takeHi = !takeHi;
  }
  return out;
}

/** A reusable ramp sampler: exact token stops for small counts, OKLCH
 *  interpolation beyond the ramp length. Used by sequential + diverging. */
function rampSampler(rampStops: string[]): (count: number) => string[] {
  const sampleAt = (t: number): string => {
    if (rampStops.length === 1) return rampStops[0];
    const x = clamp(t, 0, 1) * (rampStops.length - 1);
    const i = Math.min(rampStops.length - 2, Math.floor(x));
    const f = x - i;
    // Interpolate in OKLab (rectangular) — a straight line through color space, so
    // a near-neutral midpoint never drags the hue through an out-of-place color
    // (e.g. teal between a warm neutral and violet).
    const a = toOklab(rampStops[i]);
    const b = toOklab(rampStops[i + 1]);
    const mixed = { mode: 'oklab' as const, l: a.l + (b.l - a.l) * f, a: a.a + (b.a - a.a) * f, b: a.b + (b.b - a.b) * f };
    return formatHex(clampRgb(mixed)) ?? rampStops[i];
  };
  return (count: number): string[] => {
    if (count <= 0) return [];
    if (count === 1) return [rampStops[Math.floor(rampStops.length / 2)]];
    if (count <= rampStops.length) {
      return Array.from({ length: count }, (_, i) => rampStops[Math.round((i * (rampStops.length - 1)) / (count - 1))]);
    }
    return Array.from({ length: count }, (_, i) => sampleAt(i / (count - 1)));
  };
}

export function buildColorSystem(
  primaryHex: string,
  secondaryHex: string,
  mode: Mode,
  singleColors: Record<string, string> = {},
  categoricalPalette: string[] = [],
  semantic: SemanticColors = FALLBACK_SEMANTIC,
  sequentialPalette: string[] = [],
  semanticScalePalette: string[] = [],
  divergingPalette: string[] = [],
): ChartColorSystem {
  const base: Record<BaseKey, string> = { primary: primaryHex, secondary: secondaryHex };
  const tonal = (b: BaseKey, steps: number): string[] => ramp(base[b], steps, mode, false);

  /** A "mix" of one base: distinct, contrast-ordered tonal steps of that family.
   *  Fallback only — used when no fixed categorical palette is supplied. */
  const categoricalMix = (b: BaseKey, count: number): string[] =>
    interleave(ramp(base[b], count, mode, true));

  /** Fixed multi-hue categorical palette (the hello pc "hero" tones), cycled to the
   *  needed count. These pass contrast on both surfaces, so they're identical in
   *  light and dark — selecting a base does not change them. */
  const fixed = categoricalPalette.length > 0 ? categoricalPalette : null;
  const categorical = (count: number): string[] =>
    fixed
      ? Array.from({ length: Math.max(0, count) }, (_, i) => fixed[i % fixed.length])
      : categoricalMix('primary', count);

  // Fixed ramps (token-pure for small counts, interpolated beyond): sequential
  // (single-hue indigo), semanticScale (red→green, bad→good), diverging
  // (cyan↔violet, neutral two-ended).
  const seqRamp = sequentialPalette.length > 0 ? sequentialPalette : ramp(base.primary, 6, mode, false);
  const semRamp = semanticScalePalette.length > 0 ? semanticScalePalette : seqRamp;
  const divRamp = divergingPalette.length > 0 ? divergingPalette : seqRamp;
  const sequential = rampSampler(seqRamp);
  const semanticScale = rampSampler(semRamp);
  const diverging = rampSampler(divRamp);

  return {
    base,
    semantic,
    categorical,
    sequential,
    sequentialRamp: seqRamp,
    semanticScale,
    semanticRamp: semRamp,
    diverging,
    divergingRamp: divRamp,
    tonal,
    resolve: (config: ColorConfig, count: number) => {
      if (config.variation === 'sequential') {
        return sequential(count);
      }
      if (config.variation === 'semantic') {
        return semanticScale(count);
      }
      if (config.variation === 'diverging') {
        return diverging(count);
      }
      if (config.variation === 'categorical') {
        return fixed ? categorical(count) : categoricalMix(config.base ?? 'primary', count);
      }
      // Wireframe (secondary): multiple distinct neutral greys (up to 6), then
      // cycle — patterns beyond the 6th shade are applied by option builders.
      if (config.variation === 'secondary') {
        const tokenHex = config.token ? singleColors[config.token] : undefined;
        // Overlays (rgba) are poor ramp anchors — fall back to the secondary base.
        const baseHex =
          tokenHex && /^#([0-9a-f]{6})$/i.test(tokenHex) ? tokenHex : secondaryHex;
        const shades = interleave(ramp(baseHex, WIREFRAME_SHADE_LIMIT, mode, true));
        return Array.from({ length: Math.max(0, count) }, (_, i) => shades[i % shades.length]);
      }
      // primary → one solid token color for every mark.
      const color = (config.token && singleColors[config.token]) || primaryHex;
      return Array.from({ length: count }, () => color);
    },
    states: (config: ColorConfig, rest: string) => {
      // Single-token modes: use the token's real Hover/Press siblings when present
      // (e.g. tonal.tonal → tonal.tonalHover / tonal.tonalPress).
      if ((config.variation === 'primary' || config.variation === 'secondary') && config.token) {
        const dot = config.token.indexOf('.');
        const grp = config.token.slice(0, dot);
        const leaf = config.token.slice(dot + 1);
        const hover = singleColors[`${grp}.${leaf}Hover`];
        const press = singleColors[`${grp}.${leaf}Press`];
        return {
          hover: hover ?? deriveState(rest, 'hover', mode),
          press: press ?? deriveState(rest, 'press', mode),
        };
      }
      return { hover: deriveState(rest, 'hover', mode), press: deriveState(rest, 'press', mode) };
    },
  };
}
