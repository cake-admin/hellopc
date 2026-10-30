import { z } from 'zod';

/**
 * Theme modes the chart system supports.
 * - `light` / `dark` map to token JSON `lightA` / `darkA`
 * - `hct` is Windows High-Contrast (hello pc `win hct`) — structural tokens fall
 *   back to darkA, then `buildChartTheme` overlays HCT surfaces + series colors
 */
export type Mode = 'light' | 'dark' | 'hct';

export const MODE_TO_TOKEN_KEY: Record<Mode, 'lightA' | 'darkA'> = {
  light: 'lightA',
  dark: 'darkA',
  hct: 'darkA',
};

/** A single token carries (at least) a light and dark value, plus optional extras. */
export const rawTokenSchema = z
  .object({
    lightA: z.string(),
    darkA: z.string(),
  })
  .catchall(z.string());

export const rawTokensSchema = z.record(z.string(), rawTokenSchema);

/** A categorical chart palette, authored per mode (already mode-correct). */
export const paletteSchema = z.object({
  lightA: z.array(z.string()),
  darkA: z.array(z.string()),
});

/** A semantic role color (positive/negative/…), authored per mode. */
export const colorPairSchema = z.object({ lightA: z.string(), darkA: z.string() });

/** Semantic color set for meaning-based charts (pos/neg bars, waterfall, …). */
export const semanticSchema = z.object({
  positive: colorPairSchema,
  negative: colorPairSchema,
  warning: colorPairSchema,
  info: colorPairSchema,
  neutral: colorPairSchema,
});

/** A single, named color-token variation (e.g. primary/primaryOverlay) the user
 *  can pick as a chart's single solid color. Overlay tokens carry rgba(). */
export const singleTokenSchema = z.object({
  id: z.string(),
  label: z.string(),
  group: z.string(),
  path: z.string(),
  lightA: z.string(),
  darkA: z.string(),
});

/**
 * Shape of the generated `tokens.json` (produced by scripts/build-tokens.mjs from
 * the design system's Figma DTCG export). `tokens` = structural + base colors;
 * `categorical` = the design system's badge palette used for multi-series charts.
 */
export const generatedTokensSchema = z.object({
  tokens: rawTokensSchema,
  categorical: paletteSchema,
  sequential: paletteSchema.optional(),
  semanticScale: paletteSchema.optional(),
  diverging: paletteSchema.optional(),
  semantic: semanticSchema.optional(),
  singleTokens: z.array(singleTokenSchema).optional().default([]),
  paletteTokens: z.record(z.string(), z.array(singleTokenSchema)).optional().default({}),
});

export type RawToken = z.infer<typeof rawTokenSchema>;
export type RawTokens = z.infer<typeof rawTokensSchema>;
export type Palette = z.infer<typeof paletteSchema>;
export type Semantic = z.infer<typeof semanticSchema>;
export type SemanticRole = keyof Semantic;
export type SingleToken = z.infer<typeof singleTokenSchema>;
/** Per-stop provenance for the fixed palettes, keyed by variation name. */
export type PaletteTokens = Record<string, SingleToken[]>;
export type GeneratedTokens = z.infer<typeof generatedTokensSchema>;

/**
 * The canonical token names the chart theme reads. The uploaded JSON only needs
 * to supply BASE semantic tokens — chart scales (categorical / tonal) are derived
 * from `referencePrimary` and `referenceSecondary` at runtime.
 *
 * Adding a new base color later (e.g. a tertiary) is a one-line addition here plus
 * an entry in the color system's base registry.
 */
export const REQUIRED_TOKENS = [
  'referencePrimary',
  'referenceSecondary',
  'surfaceCanvas',
  'surfaceCard',
  'borderWeak',
  'textPrimary',
  'textSecondary',
  'referenceHelper',
  'referenceFocus',
] as const;

export type RequiredTokenName = (typeof REQUIRED_TOKENS)[number];
