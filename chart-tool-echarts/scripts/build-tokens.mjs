// Generates src/tokens/tokens.json from the design system's Figma DTCG export
// in the repo-root "& theme.a" folder (the source of truth). Run: npm run build:tokens
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url)); // chart-tool/scripts
const repoRoot = join(here, '..', '..'); // repo root (contains the "& *" folders)
const themeDir = join(repoRoot, '& theme.a');

const readColor = (file) => JSON.parse(readFileSync(join(themeDir, file), 'utf8'))['&color'];
const light = readColor('Light.a.tokens.json');
const dark = readColor('Dark.a.tokens.json');

// Named categorical tones live in the mode-independent "& color hero" collection
// (e.g. indigo/60, jade/70). Single file → the same hex is used in light & dark.
const hero = JSON.parse(readFileSync(join(repoRoot, '& color hero', 'color.tokens.json'), 'utf8'));
function heroHex(group, tone) {
  const h = hero?.[group]?.[tone]?.$value?.hex;
  return typeof h === 'string' ? h.toLowerCase() : null;
}

const warnings = [];
function hex(set, group, leaf) {
  const h = set?.[group]?.[leaf]?.$value?.hex;
  return typeof h === 'string' ? h.toLowerCase() : null;
}
function pair(group, leaf) {
  const l = hex(light, group, leaf);
  const d = hex(dark, group, leaf);
  if (!l || !d) warnings.push(`missing ${group}.${leaf} (light=${l}, dark=${d})`);
  return { lightA: l ?? '#334155', darkA: d ?? '#a1a1aa' };
}

// chart token name → DTCG path (&color.<group>.<leaf>)
const tokens = {
  referencePrimary: pair('primary', 'primary'),
  referenceSecondary: pair('secondary', 'secondary'),
  surfaceCanvas: pair('surfaces', 'canvas'),
  surfaceCard: pair('surfaces', 'container'),
  surfaceOnContainerHigh: pair('surfaces', 'onContainer high'),
  borderWeak: pair('stroke', 'border low'),
  borderStandard: pair('stroke', 'border'),
  textPrimary: pair('text+icon', 'primary'),
  textSecondary: pair('text+icon', 'secondary'),
  referenceHelper: pair('text+icon', 'placeholder'),
  referenceFocus: pair('primary', 'primary'),
  tooltipBg: pair('surfaces', 'inverseContainer'),
  tooltipText: pair('text+icon', 'inverse'),
  onPrimary: pair('text+icon', 'onPrimary'),
};

// Categorical chart palette = hand-picked hello pc "hero" tones (60–80) chosen to
// pass contrast on BOTH black and white, so the SAME values are used in light and
// dark. Order matches the design's swatch sheet.
const CATEGORICAL_TONES = [
  ['indigo', '60'],
  ['cyan', '70'],
  ['yellow', '80'],
  ['pink', '60'],
  ['jade', '70'],
  ['amber', '70'],
  ['lime', '70'],
  ['purple', '70'],
  ['gold', '80'],
  ['blue', '70'],
  ['red', '70'],
  ['pure neutral', '70'],
];
/** Hero tone → a listable token entry (same shape as singleTokens) so the UI can
 *  show each palette stop's name/path/value, not just its swatch. */
function heroToken(group, tone) {
  const h = heroHex(group, tone);
  if (!h) warnings.push(`missing hero ${group}/${tone}`);
  return h
    ? { id: `hero.${group}.${tone}`, label: `${group} ${tone}`, group: 'Hero', path: `&color hero/${group}/${tone}`, lightA: h, darkA: h }
    : null;
}
const heroTokens = (tones) => tones.map(([g, t]) => heroToken(g, t)).filter(Boolean);
const hexesOf = (list) => list.map((t) => t.lightA);

const categoricalTokens = heroTokens(CATEGORICAL_TONES);
const catHexes = hexesOf(categoricalTokens);
const categorical = { lightA: catHexes, darkA: catHexes };

// Sequential single-hue ramp (light → dark) for value-encoded charts: heatmap,
// choropleth, area, funnel, calendar. Sourced from the indigo hero tones (80→30),
// identical in light & dark like the categorical set.
const SEQUENTIAL_TONES = ['80', '70', '60', '50', '40', '30'].map((tone) => ['indigo', tone]);
const sequentialTokens = heroTokens(SEQUENTIAL_TONES);
const seqHexes = hexesOf(sequentialTokens);
const sequential = { lightA: seqHexes, darkA: seqHexes };

// Semantic "bad → good" ramp (red → green through amber/yellow/lime) for value-
// encoded charts that carry meaning: gauge, KPI, heatmap. Ordered low(0%)→high(100%).
const SEMANTIC_SCALE_TONES = [
  ['red', '50'],
  ['amber', '80'],
  ['yellow', '90'],
  ['lime', '80'],
  ['green', '60'],
];
const semanticScaleTokens = heroTokens(SEMANTIC_SCALE_TONES);
const semScaleHexes = hexesOf(semanticScaleTokens);
const semanticScale = { lightA: semScaleHexes, darkA: semScaleHexes };

// Diverging ramp (jade ↔ warm-neutral ↔ violet) — a neutral two-ended scale for
// heatmap / choropleth, no inherent good/bad meaning. Ordered low(0%)→high(100%).
const DIVERGING_TONES = [
  ['jade', '70'],
  ['jade', '80'],
  ['warm  neutral', '95'],
  ['violet', '70'],
  ['violet', '40'],
];
const divergingTokens = heroTokens(DIVERGING_TONES);
const divHexes = hexesOf(divergingTokens);
const diverging = { lightA: divHexes, darkA: divHexes };

// Semantic color set for meaning-based charts (positive/negative bars, waterfall).
// positive/negative/info come from the design system's real, mode-aware semantic
// tokens; warning/neutral are sourced from hero tones as stand-ins until dedicated
// chart-semantic tokens exist (swap these two lines when they do).
const sameMode = (h) => ({ lightA: h, darkA: h });
const semantic = {
  positive: pair('success', 'success'),
  negative: pair('error', 'error'),
  info: pair('info', 'info'),
  warning: sameMode(heroHex('gold', '80')),
  neutral: sameMode(heroHex('pure neutral', '70')),
};

// Selectable single-color token variations from the primary / secondary / tonal
// families (primary, primaryHover, primaryOverlay, tonalLightest, …). Overlay
// tokens carry alpha < 1, emitted as rgba() so the tint is preserved.
const SINGLE_GROUPS = [
  { group: 'Primary', key: 'primary' },
  { group: 'Secondary', key: 'secondary' },
  { group: 'Tonal', key: 'tonal' },
];
function colorString(set, group, leaf) {
  const v = set?.[group]?.[leaf]?.$value;
  if (!v) return null;
  const a = typeof v.alpha === 'number' ? v.alpha : 1;
  if (a >= 0.999) return typeof v.hex === 'string' ? v.hex.toLowerCase() : null;
  const [r, g, b] = (v.components || []).map((x) => Math.round((x || 0) * 255));
  return `rgba(${r}, ${g}, ${b}, ${Math.round(a * 100) / 100})`;
}
const singleTokens = [];
for (const { group, key } of SINGLE_GROUPS) {
  for (const leaf of Object.keys(light[key] || {}).filter((k) => !k.startsWith('$'))) {
    const l = colorString(light, key, leaf);
    const d = colorString(dark, key, leaf);
    if (!l && !d) continue;
    singleTokens.push({
      id: `${key}.${leaf}`,
      label: leaf,
      group,
      path: `&color/${key}/${leaf}`,
      lightA: l ?? d,
      darkA: d ?? l,
    });
  }
}

const out = {
  $comment:
    'GENERATED by scripts/build-tokens.mjs from "../& theme.a/*.tokens.json" (Figma DTCG export). Do not edit by hand — run `npm run build:tokens`.',
  tokens,
  categorical,
  sequential,
  semanticScale,
  diverging,
  semantic,
  singleTokens,
  // Per-stop provenance for the fixed palettes above, so the color controls can
  // list each stop's token name / path alongside its swatch.
  paletteTokens: {
    categorical: categoricalTokens,
    sequential: sequentialTokens,
    semanticScale: semanticScaleTokens,
    diverging: divergingTokens,
  },
};

writeFileSync(join(here, '..', 'src', 'tokens', 'tokens.json'), JSON.stringify(out, null, 2) + '\n');

if (warnings.length) console.warn('[build-tokens] warnings:\n  ' + warnings.join('\n  '));
console.log(
  `[build-tokens] wrote src/tokens/tokens.json — ${Object.keys(tokens).length} tokens, ` +
    `${categorical.lightA.length} categorical hues.`,
);
