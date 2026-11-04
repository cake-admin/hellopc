// Imports Figma "Export variables" JSON files into the repo-root "& …" folders,
// whatever they were named on download, then rebuilds every token output.
//
//   npm run import:figma-tokens -- "<folder with the exported .json files>"
//
// Each file is identified by its contents (collection, mode, what its colors
// point at), never by its file name — Figma names every theme export
// "light.a.tokens.json" / "dark.a.tokens.json", including the Windows High
// Contrast ones, so names alone are ambiguous.
//
// Flags:
//   --dry-run    show what would go where; change nothing
//   --no-build   copy the files but skip the token rebuild
//
// Use this until the automated Figma sync (scripts/sync-figma-tokens.mjs) has
// API access; both write the same folders.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const noBuild = args.includes('--no-build');
const folder = args.find((a) => !a.startsWith('--'));

const log = (msg) => console.log(`[import:figma-tokens] ${msg}`);
const fail = (msg) => {
  console.error(`[import:figma-tokens] ${msg}`);
  process.exit(1);
};

if (!folder) fail('give the folder that holds the exported .json files, e.g.\n  npm run import:figma-tokens -- "C:\\Users\\me\\Downloads\\hellopc tokens"');
if (!existsSync(folder) || !statSync(folder).isDirectory()) fail(`"${folder}" is not a folder.`);

// ---- Classification ---------------------------------------------------------
const WIN_MODES = ['Aquatic', 'Desert', 'Dusk', 'Night sky'];

const leaves = (o, out = []) => {
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('$')) continue;
    if (v && v.$type) out.push(v);
    else if (v && typeof v === 'object') leaves(v, out);
  }
  return out;
};

// Which collection the majority of this file's aliases point at.
const mainAliasTarget = (json) => {
  const counts = {};
  for (const t of leaves(json)) {
    const ext = t.$extensions ?? {};
    const alias = ext['com.figma.aliasData'] ?? ext['com.figma.composedColor']?.colorArg?.alias;
    const set = alias?.targetVariableSetName;
    if (set) counts[set] = (counts[set] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
};

// → { target, label } or { skip, label } or { unknown }
function classify(json) {
  const ext = json.$extensions ?? {};
  const mode = ext['com.figma.modeName'];
  const roots = Object.keys(json).filter((k) => !k.startsWith('$'));
  const semantic = json.color ?? json['&color'];

  if (semantic && roots.length === 1) {
    const isHighContrast =
      Boolean(ext['com.figma.parentVariableSetName']) || /win hct/i.test(mainAliasTarget(json) ?? '');
    if (isHighContrast) {
      // The extended "win hct" collection exports light.a and dark.a modes; the
      // repo ships light.a (the two are near-identical).
      if (mode === 'light.a') return { target: '& theme.a/Win hct.tokens.json', label: 'win hct (high contrast)' };
      return { skip: true, label: `win hct ${mode} — not used (the repo ships the light.a mode)` };
    }
    if (mode === 'light.a') return { target: '& theme.a/Light.a.tokens.json', label: 'light.a theme' };
    if (mode === 'dark.a') return { target: '& theme.a/Dark.a.tokens.json', label: 'dark.a theme' };
    return { unknown: `semantic colors in an unexpected mode "${mode}"` };
  }

  if (roots.length && roots.every((k) => k.startsWith('SystemColor'))) {
    if (WIN_MODES.includes(mode)) return { target: `& win hct/${mode}.tokens.json`, label: `Windows contrast theme ${mode}` };
    return { unknown: `Windows system colors in an unexpected mode "${mode}"` };
  }

  if (roots.includes('Spacing') && roots.includes('Border')) {
    return { target: '& spacing/Value.tokens.json', label: 'spacing / radius / stroke' };
  }

  if (['white', 'black', 'red', 'indigo'].every((k) => roots.includes(k))) {
    return { target: '& color hero/color.tokens.json', label: 'hero palette' };
  }

  if (['Balanced', 'Vibrant', 'Neutral'].every((k) => roots.includes(k))) {
    return { target: '& color primitives/Value.tokens.json', label: 'color primitives' };
  }

  return { unknown: `unrecognized contents (top-level keys: ${roots.slice(0, 6).join(', ')}${roots.length > 6 ? ', …' : ''})` };
}

// ---- Plan -------------------------------------------------------------------
const files = readdirSync(folder).filter((f) => f.toLowerCase().endsWith('.json'));
if (!files.length) fail(`no .json files in "${folder}".`);

const plan = new Map(); // target → { file, text, label }
const problems = [];
const skipped = [];

for (const f of files) {
  const path = join(folder, f);
  let text, json;
  try {
    text = readFileSync(path, 'utf8');
    json = JSON.parse(text);
  } catch (err) {
    problems.push(`${f}: not valid JSON (${err.message})`);
    continue;
  }
  const c = classify(json);
  if (c.unknown) {
    problems.push(`${f}: ${c.unknown}`);
    continue;
  }
  if (c.skip) {
    skipped.push(`${f} → ${c.label}`);
    continue;
  }
  const prior = plan.get(c.target);
  if (prior && prior.text !== text) {
    problems.push(`${f} and ${prior.file} are both the ${c.label} export but differ — keep only the one you mean`);
    continue;
  }
  plan.set(c.target, { file: f, text, label: c.label });
}

if (problems.length) fail(`nothing was changed:\n  ${problems.join('\n  ')}`);

const EXPECTED = [
  '& color hero/color.tokens.json',
  '& theme.a/Light.a.tokens.json',
  '& theme.a/Dark.a.tokens.json',
  '& theme.a/Win hct.tokens.json',
  ...WIN_MODES.map((m) => `& win hct/${m}.tokens.json`),
  '& spacing/Value.tokens.json',
];
const missing = EXPECTED.filter((t) => !plan.has(t));

const sameAsRepo = (target, text) => {
  const abs = join(repoRoot, target);
  return existsSync(abs) && readFileSync(abs, 'utf8').replace(/\r\n/g, '\n') === text.replace(/\r\n/g, '\n');
};

log(`${dryRun ? 'would import' : 'importing'} from ${resolve(folder)}:`);
for (const [target, { file, label }] of plan) {
  const note = sameAsRepo(target, plan.get(target).text) ? ' (unchanged)' : '';
  console.log(`  ${basename(file).padEnd(28)} → ${target}  [${label}]${note}`);
}
for (const s of skipped) console.log(`  skipped: ${s}`);
if (missing.length) console.log(`  not in this export (repo copy kept):\n    ${missing.join('\n    ')}`);

if (dryRun) process.exit(0);

// ---- Write + rebuild --------------------------------------------------------
const cssPath = join(repoRoot, 'src', 'hellopc', 'tokens', 'hellopc-vars.css');
const varNames = (css) => new Set([...css.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]));
const before = existsSync(cssPath) ? varNames(readFileSync(cssPath, 'utf8')) : new Set();

let written = 0;
for (const [target, { text }] of plan) {
  if (sameAsRepo(target, text)) continue;
  const abs = join(repoRoot, target);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, text);
  written++;
}
log(`${written} file(s) updated, ${plan.size - written} already current.`);

if (noBuild) process.exit(0);

const run = (script) => execFileSync(process.execPath, [join(repoRoot, script)], { cwd: repoRoot, stdio: 'inherit' });
try {
  run('scripts/build-hellopc-tokens.mjs');
  run('scripts/build-hellopc-css-vars.mjs');
  run('chart-tool-echarts/scripts/build-tokens.mjs');
  run('scripts/validate-tokens.js');
} catch {
  fail('the token rebuild failed (see above). The exported files were copied; fix the problem and run `npm run build:hellopc-tokens && npm run build:hellopc-vars`.');
}

const after = varNames(readFileSync(cssPath, 'utf8'));
const added = [...after].filter((v) => !before.has(v));
const removed = [...before].filter((v) => !after.has(v));
log(`CSS variables: ${added.length} added, ${removed.length} removed.`);
if (added.length) console.log(`  added:   ${added.join(' ')}`);
if (removed.length) {
  console.log(`  REMOVED: ${removed.join(' ')}`);
  console.log('  Any component still using a removed variable will lose its color — search src/ before merging.');
}
log('Next: review in Storybook (npm run storybook) in light, dark and win hct, then commit.');
