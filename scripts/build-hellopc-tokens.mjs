// Generates src/hellopc/tokens/tokens.json for the NEW "hello pc" design system
// from the Figma DTCG export in the repo-root "& theme.a" folder (source of
// truth). Run: npm run build:hellopc-tokens
//
// The "& theme.a" files hold the semantic color layer (color.<group>.<leaf>)
// with light.a + dark.a modes. We emit:
//   - theme: nested { <mode>: { <groupKey>: { <leafKey>: "#hex" | "rgba(...)" } } }
//     with camelCase keys that are ergonomic to use in styled-components.
//   - list:  flat metadata (group, leaf, figma path, both modes) for docs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url)); // scripts/
const repoRoot = join(here, '..');
const themeDir = join(repoRoot, '& theme.a');
const valueFile = join(repoRoot, '& spacing', 'Value.tokens.json');
const outDir = join(repoRoot, 'src', 'hellopc', 'tokens');

// Figma renamed the semantic collection's root from "&color" to "color" (1.0.1
// token restructure). Accept either so older exports still build.
const readColor = (file) => {
  const json = JSON.parse(readFileSync(join(themeDir, file), 'utf8'));
  const set = json.color ?? json['&color'];
  if (!set) {
    throw new Error(`[build:hellopc-tokens] "${file}" has no "color" (or "&color") root.`);
  }
  return set;
};

const light = readColor('Light.a.tokens.json');
const dark = readColor('Dark.a.tokens.json');
// "win hct" — Windows High-Contrast Theme contributed in Figma. Same semantic
// color layer as light.a/dark.a, aliased to the "win hct system" colors.
// Figma exports it as the light.a mode of an extended "win hct" collection;
// save that file here as "Win hct.tokens.json".
const winHct = readColor('Win hct.tokens.json');

// "text+icon" -> "textIcon", "border low" -> "borderLow",
// "containerPop-windows" -> "containerPopWindows", "primaryHover" -> "primaryHover",
// "errorOn surface text (Destructive Btn)" -> "errorOnSurfaceTextDestructiveBtn"
const camel = (name) => {
  const words = String(name)
    .replace(/[+/()-]/g, ' ')
    .split(' ')
    .filter(Boolean);
  return words
    .map((w, i) =>
      i === 0
        ? w.charAt(0).toLowerCase() + w.slice(1)
        : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join('');
};

// DTCG color value -> CSS color string. Preserves alpha as rgba().
const colorString = (value) => {
  if (!value) return null;
  const alpha = typeof value.alpha === 'number' ? value.alpha : 1;
  if (alpha >= 0.999) {
    return typeof value.hex === 'string' ? value.hex.toLowerCase() : null;
  }
  const [r, g, b] = (value.components || []).map((x) =>
    Math.round((x || 0) * 255)
  );
  return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 1000) / 1000})`;
};

const isMeta = (k) => k.startsWith('$');

// Some tokens are exported as DTCG references to another token in the same
// mode, e.g. "{color.primary.primary}", instead of a resolved color. Follow the
// reference (and chains of them) within the same set.
const resolve = (set, value, mode, seen = new Set()) => {
  if (typeof value !== 'string') return value;
  const m = value.match(/^\{(?:&?color)\.([^.}]+)\.([^}]+)\}$/);
  if (!m) throw new Error(`[build:hellopc-tokens] ${mode}: unsupported value ${value}`);
  if (seen.has(value)) throw new Error(`[build:hellopc-tokens] ${mode}: alias cycle at ${value}`);
  seen.add(value);
  const target = set[m[1]]?.[m[2]];
  if (!target) throw new Error(`[build:hellopc-tokens] ${mode}: ${value} points to a missing token`);
  return resolve(set, target.$value, mode, seen);
};

const tokenCss = (set, group, leaf, mode) => {
  const token = set[group]?.[leaf];
  if (!token) return null;
  return colorString(resolve(set, token.$value, mode));
};

const buildMode = (set, mode) => {
  const out = {};
  for (const group of Object.keys(set).filter((k) => !isMeta(k))) {
    const gKey = camel(group);
    out[gKey] = out[gKey] || {};
    for (const leaf of Object.keys(set[group]).filter((k) => !isMeta(k))) {
      const key = camel(leaf);
      if (key in out[gKey]) {
        throw new Error(`[build:hellopc-tokens] ${mode}: "${group}/${leaf}" collides with another token as "${gKey}.${key}"`);
      }
      const css = tokenCss(set, group, leaf, mode);
      if (!css) throw new Error(`[build:hellopc-tokens] ${mode}: "${group}/${leaf}" has no usable color value`);
      out[gKey][key] = css;
    }
  }
  return out;
};

const buildList = () => {
  const list = [];
  for (const group of Object.keys(light).filter((k) => !isMeta(k))) {
    for (const leaf of Object.keys(light[group]).filter((k) => !isMeta(k))) {
      list.push({
        group,
        groupKey: camel(group),
        leaf,
        leafKey: camel(leaf),
        figmaPath: `color/${group}/${leaf}`,
        lightA: tokenCss(light, group, leaf, 'light.a'),
        darkA: tokenCss(dark, group, leaf, 'dark.a'),
        winHct: tokenCss(winHct, group, leaf, 'win hct'),
      });
    }
  }
  return list;
};

// ---- Value tokens (spacing / radius / stroke) from "& spacing/Value.tokens.json" ----
// Mode-independent numeric variables. Emitted as ordered arrays so docs can
// render them grouped exactly as Figma organizes them (Small/Medium/Large…).
const buildValue = () => {
  let raw;
  try {
    raw = JSON.parse(readFileSync(valueFile, 'utf8'));
  } catch {
    console.warn('[build:hellopc-tokens] "& spacing/Value.tokens.json" not found — skipping spacing/radius/stroke.');
    return null;
  }
  const collect = (section, figmaPrefix) => {
    const items = [];
    for (const bucket of Object.keys(section || {}).filter((k) => !isMeta(k))) {
      for (const name of Object.keys(section[bucket]).filter((k) => !isMeta(k))) {
        const px = section[bucket][name].$value;
        if (typeof px !== 'number') continue;
        items.push({ name, px, bucket, figmaPath: `${figmaPrefix}/${bucket}/${name}` });
      }
    }
    return items;
  };
  return {
    spacing: collect(raw.Spacing, 'Spacing'),
    radius: collect({ Radius: raw.Border?.Radius }, 'Border').map((t) => ({ ...t, bucket: undefined })),
    stroke: collect({ Stroke: raw.Border?.Stroke }, 'Border').map((t) => ({ ...t, bucket: undefined })),
  };
};

const value = buildValue();

const out = {
  $comment:
    'GENERATED by scripts/build-hellopc-tokens.mjs from "& theme.a/*.tokens.json" + "& spacing/Value.tokens.json" (Figma DTCG exports). Do not edit by hand — run `npm run build:hellopc-tokens`.',
  modes: ['light.a', 'dark.a', 'win hct'],
  theme: {
    'light.a': buildMode(light, 'light.a'),
    'dark.a': buildMode(dark, 'dark.a'),
    'win hct': buildMode(winHct, 'win hct'),
  },
  ...(value ? { value } : {}),
  list: buildList(),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'tokens.json'), JSON.stringify(out, null, 2) + '\n');

const groups = Object.keys(out.theme['light.a']).length;
const valueCount = value
  ? value.spacing.length + value.radius.length + value.stroke.length
  : 0;
console.log(
  `[build:hellopc-tokens] wrote src/hellopc/tokens/tokens.json — ${groups} groups, ${out.list.length} color tokens x${out.modes.length} modes (${out.modes.join(', ')}), ${valueCount} value tokens (spacing/radius/stroke).`
);
