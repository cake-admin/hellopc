// Generates src/hellopc/tokens/hellopc-vars.css from tokens.json — the CSS
// custom-property layer of the hello pc theme. Figma variables map 1:1 to
// `--color-<group>-<token>` custom properties, scoped per mode by
// `[data-theme]` (the Storybook theme decorator stamps it; `:root` defaults
// to light.a). Structural vars (spacing / radius / typography) mirror
// src/hellopc/tokens/theme.ts. Run: npm run build:hellopc-vars
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const tokensPath = join(here, '..', 'src', 'hellopc', 'tokens', 'tokens.json');
const outPath = join(here, '..', 'src', 'hellopc', 'tokens', 'hellopc-vars.css');

const { theme, value } = JSON.parse(readFileSync(tokensPath, 'utf8'));
if (!value) {
  throw new Error(
    '[cake-vars] tokens.json has no `value` section (spacing/radius/stroke) — run `npm run build:hellopc-tokens` first.'
  );
}

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** Surface fallbacks (Figma "Fallbacks", Hello PC 1.2.0 node 16294:80): when
 *  the app shell can't render Mica, a 16px radius, or borders, a floating
 *  surface becomes a solid fill, 4px radius, no stroke, with the
 *  `container blur high` shadow (= elevation/5). The fills are hero palette
 *  primitives with no semantic variable, so they're read from the hero export:
 *  light.a blue/95, dark.a black (per the frame's previews). Figma gives no
 *  win hct value; there the system-backed blur-high fill (#202020) is used. */
const hero = JSON.parse(readFileSync(join(here, '..', '& color hero', 'color.tokens.json'), 'utf8'));
const heroHex = (group, tone) => {
  const hex = hero[group]?.[tone]?.$value?.hex;
  if (!hex) throw new Error(`[cake-vars] hero palette has no ${group}/${tone} — needed for --surface-fallback-fill.`);
  return hex.toLowerCase();
};
const FALLBACK_FILL = {
  'light.a': heroHex('blue', '95'),
  'dark.a': heroHex('black', 'black'),
  'win hct': 'var(--color-surfaces-container-blur-high)',
};
const fallbackFill = (mode) => `\n  /* Surface fallback fill — see Foundations/Special Surfaces */\n  --surface-fallback-fill: ${FALLBACK_FILL[mode]};\n`;

/** win hct override for the AI group. Figma's win hct mode still carries the
 *  brand AI gradients (same values as light.a), which breaks the rule that every
 *  high-contrast color is a Windows system color. Until design maps color/ai/*
 *  to system colors in Figma, each AI var points at a system-backed token,
 *  chosen by its suffix. An AI token no rule covers fails the build, so a new
 *  Figma token can't let a brand color through unnoticed. */
const WIN_HCT_AI = [
  [/-(primary|fill)-(start|end)$|-flat$/, 'var(--color-primary-primary)'],
  [/-on-fill$/, 'var(--color-text-icon-inverse)'],
  [/-surface-(start|end)$/, 'var(--color-primary-primary-overlay)'],
  [/^canvas-base$|-?canvas-(start|end)$/, 'var(--color-surfaces-canvas)'],
  [/^chip-thread$/, 'var(--color-surfaces-container)'],
  [/^chip-thread-border$/, 'var(--color-stroke-border)'],
];
const winHctAi = (name) => {
  const rule = WIN_HCT_AI.find(([re]) => re.test(name));
  if (!rule) throw new Error(`[cake-vars] win hct: no system-color rule for --color-ai-${name} (add one to WIN_HCT_AI).`);
  return rule[1];
};

/** win hct override for the rating group (Figma 1.3.0 color/rating/*). Figma's
 *  win hct mode keeps brand gold for stars; high contrast needs system colors.
 *  Filled stars and their outline take Highlight, empty stars GrayText — the
 *  filled vs outline shape still separates them without relying on color. */
const WIN_HCT_RATING = {
  filled: 'var(--color-primary-primary)',
  outline: 'var(--color-primary-primary)',
  empty: 'var(--color-text-icon-disabled)',
};
const winHctRating = (name) => {
  const out = WIN_HCT_RATING[name];
  if (!out) throw new Error(`[cake-vars] win hct: no system-color rule for --color-rating-${name} (add one to WIN_HCT_RATING).`);
  return out;
};

/** Groups whose win hct values are replaced by system-color rules. */
const WIN_HCT_OVERRIDES = { ai: winHctAi, rating: winHctRating };

/** One mode's color groups → sorted `--color-<group>-<token>: value;` lines. */
function colorLines(mode) {
  const lines = [];
  for (const [group, tokens] of Object.entries(theme[mode])) {
    for (const [name, value] of Object.entries(tokens)) {
      if (typeof value !== 'string') continue;
      const override = mode === 'win hct' ? WIN_HCT_OVERRIDES[group] : undefined;
      const out = override ? override(kebab(name)) : value;
      lines.push(`  --color-${kebab(group)}-${kebab(name)}: ${out};`);
    }
  }
  return lines.sort();
}

/** Value tokens (spacing / radius / stroke) from the Figma "Value" export,
 *  flowing through tokens.json. Names map 1:1 to the Figma variables:
 *  `Spacing/Small/space-100` ⇄ `--space-100` · `Border/Radius/radius-200` ⇄
 *  `--radius-200` · `Border/Stroke/stroke-300` ⇄ `--stroke-300`. */
const valueLines = (items, comment) =>
  `\n  /* ${comment} */\n` + items.map((t) => `  --${t.name}: ${t.px}px;`).join('\n') + '\n';

const structure = `${valueLines(value.spacing, 'Spacing — Figma Spacing/<bucket>/space-*')}${valueLines(value.radius, 'Radius — Figma Border/Radius/radius-*')}${valueLines(value.stroke, 'Stroke widths — Figma Border/Stroke/stroke-*')}
  /* Typography — theme.font / theme.typography (rem @ 16px root) */
  --font-family: 'Rookery New', 'Rookery', system-ui, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --type-size-caption: 0.75rem;
  --type-size-helper: 0.875rem;
  --type-size-body: 0.875rem;
  --type-size-subject: 1rem;
  --type-size-subtitle: 1.125rem;
  --type-size-title: 1.25rem;
  --type-size-page: 1.75rem;
  --type-size-greeting: 2rem;
  --type-size-hero: 2.625rem;
  --type-size-data: 4.25rem;
`;

/** Shadows composed from the mode-scoped elevation color vars.
 *  `--elevation-<n>` mirrors the Figma `elevation/<n>` effect styles 1:1 (each
 *  is a key + ambient layer). `--elevation-low` / `--elevation-high` predate
 *  the numbered scale and are kept for existing call sites — see
 *  Foundations/Elevation. */
const elevation = `
  /* Elevation — Figma elevation/<n> (colors resolve per data-theme) */
  --elevation-0:
    0 1px 2px 0 var(--color-elevation-drop-shadow-light),
    0 0 4px 0 var(--color-elevation-drop-shadow-heavy);
  --elevation-1:
    0 1px 4px 0 var(--color-elevation-drop-shadow-light),
    0 1px 8px 0 var(--color-elevation-drop-shadow-heavy);
  --elevation-2:
    0 2px 8px 0 var(--color-elevation-drop-shadow-light),
    0 2px 16px 0 var(--color-elevation-drop-shadow-heavy);
  --elevation-3:
    0 4px 12px 0 var(--color-elevation-drop-shadow-light),
    0 3px 24px 0 var(--color-elevation-drop-shadow-heavy);
  --elevation-4:
    0 6px 18px 0 var(--color-elevation-drop-shadow-light),
    0 4px 36px 0 var(--color-elevation-drop-shadow-heavy);
  --elevation-5:
    0 8px 24px 0 var(--color-elevation-drop-shadow-light),
    0 4px 48px 0 var(--color-elevation-drop-shadow-heavy);

  /* Legacy, pre-scale aliases. */
  --elevation-low: 0 1px 2px 0 var(--color-elevation-drop-shadow-light);
  --elevation-high: 0 12px 32px -4px var(--color-elevation-drop-shadow-heavy);

  /* Surface fallback (no Mica / 16px radius / borders in the app shell) —
     Figma "Fallbacks": 4px radius, no stroke, container-blur-high shadow. */
  --surface-fallback-radius: var(--radius-50);
  --surface-fallback-shadow: var(--elevation-5);
`;

const banner = `/* GENERATED by scripts/build-hellopc-css-vars.mjs from tokens.json.
 * Do not edit by hand — run \`npm run build:hellopc-vars\`.
 * Figma variable "color/<group>/<token>" ⇄ CSS \`--color-<group>-<token>\`. */
`;

const css = `${banner}
:root,
[data-theme='light.a'] {
${colorLines('light.a').join('\n')}
${fallbackFill('light.a')}${structure}${elevation}}

[data-theme='dark.a'] {
${colorLines('dark.a').join('\n')}
${fallbackFill('dark.a')}}

[data-theme='win hct'] {
${colorLines('win hct').join('\n')}
${fallbackFill('win hct')}}
`;

writeFileSync(outPath, css);
const count = colorLines('light.a').length;
const modeCount = Object.keys(theme).length;
console.log(`[cake-vars] wrote src/hellopc/tokens/hellopc-vars.css — ${count} color vars × ${modeCount} modes + structure.`);
