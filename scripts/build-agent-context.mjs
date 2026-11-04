#!/usr/bin/env node
/**
 * The single generator for everything downstream of the hello pc component docs.
 *
 *   node scripts/build-agent-context.mjs --md-out starter/context
 *   node scripts/build-agent-context.mjs --json-out ../ai-lab/knowledge/components
 *   node scripts/build-agent-context.mjs --md-out build/context --json-out ../ai-lab/...
 *
 * Both artefacts come from ONE parse of the same source — the docs prose in each
 * `*.stories.tsx` — so the JSON that ai-lab's agents read and the markdown that a
 * designer's coding agent reads can never describe the components differently.
 *
 * TWO EMITTERS, DELIBERATELY DIFFERENT RULES:
 *
 *   --json-out   *.cake.json for cake-admin/ai-lab. NEVER overwrites an existing
 *                file: hand-curated entries record things a generator cannot
 *                know. This one fills gaps only.
 *   --md-out     Markdown for coding agents. ALWAYS fully regenerated, so a
 *                drift check against it actually means something.
 *
 * The markdown is two-tier on purpose. The full docs prose across 63 components
 * is ~160 kB — far too much to sit in an agent's context permanently. Tier 1 is
 * a compact index that is always read; Tier 2 is one file per component, read on
 * demand once the agent knows which component it needs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  bullets,
  clean,
  codeBlocks,
  extractTokens,
  findStoryFiles,
  introParagraph,
  parseBarrelExports,
  parseStoryMeta,
  parseVariants,
  sections,
  slugify,
  tableRows,
} from './lib/component-docs.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const componentsDir = path.join(root, 'src', 'hellopc', 'components');
const varsFile = path.join(root, 'src', 'hellopc', 'tokens', 'hellopc-vars.css');

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i !== -1 ? process.argv[i + 1] : null;
};
const jsonOut = arg('--json-out');
const mdOut = arg('--md-out');
const stamp = arg('--stamp') ?? 'main';

if (!jsonOut && !mdOut) {
  console.error('usage: build-agent-context.mjs [--json-out DIR] [--md-out DIR] [--stamp LABEL]');
  process.exit(1);
}

const STATE_ENUM = new Set([
  'default', 'hover', 'focus-visible', 'active', 'disabled',
  'selected', 'loading', 'error', 'empty',
]);

/**
 * Folder → section of the index. Keyed by FOLDER, not component, so a new
 * component added to an existing folder is categorised automatically and only a
 * genuinely new folder forces a decision — which the assertion below demands.
 */
const CATEGORIES = {
  Button: 'Actions', Chip: 'Actions',
  Card: 'Surfaces', Modal: 'Surfaces', Tooltip: 'Surfaces',
  Notification: 'Feedback', NotificationPanel: 'Feedback', Toast: 'Feedback',
  'Progress Indicators': 'Feedback',
  Table: 'Data', Pagination: 'Data', Badge: 'Data', Counter: 'Data', Avatar: 'Data',
  Sidebar: 'Navigation', HorizontalTabs: 'Navigation', VerticalTabs: 'Navigation',
  Breadcrumb: 'Navigation', ContentSwitcher: 'Navigation', Accordion: 'Navigation',
  Menu: 'Navigation', Stepper: 'Navigation',
  TextInput: 'Forms', PasswordInput: 'Forms', NumberInput: 'Forms', PinInput: 'Forms',
  DateInput: 'Forms', TimeInput: 'Forms', Checkbox: 'Forms', Radio: 'Forms',
  Switch: 'Forms', Slider: 'Forms', Dropdown: 'Forms', NumberDropdown: 'Forms',
  FileUpload: 'Forms',
  Elements: 'Elements',
};
const CATEGORY_ORDER = ['Actions', 'Forms', 'Surfaces', 'Navigation', 'Data', 'Feedback', 'Elements'];

/** Components that render through a Radix portal into document.body. */
const PORTALLED = new Set([
  'Modal', 'Dropdown', 'SimpleTooltip', 'RichTooltip', 'Breadcrumb',
  'NumberDropdown', 'Pagination', 'DateInput', 'DateRangePicker',
]);

// ── Prop extraction ─────────────────────────────────────────────────────────
//
// From the component's own `.tsx` interface rather than the TypeScript compiler
// API: driving tsc would force `npm ci --prefix tools/dts` into the deploy
// workflow, and the JSDoc on these interfaces (with its `@default` tags) is
// better agent context than a resolved type tree anyway.

/** `export type ButtonSize = 'xs' | 'sm' | …` → the literal union, as written. */
const typeAliases = (src) => {
  const out = {};
  for (const m of src.matchAll(/export type (\w+)\s*=\s*([^;]+);/g)) {
    const body = m[2].replace(/\s+/g, ' ').trim();
    if (body.includes("'")) out[m[1]] = body;
  }
  return out;
};

const parseProps = (src, componentName) => {
  const aliases = typeAliases(src);
  const start = src.search(new RegExp(`export interface ${componentName}Props[^{]*\\{`));
  if (start === -1) return { props: [], extendsFrom: null };

  const headerMatch = src.slice(start).match(/export interface \w+Props([^{]*)\{/);
  const extendsFrom = headerMatch?.[1].trim().replace(/^extends\s+/, '') || null;

  // Walk braces to find the interface body — regex cannot balance them.
  let depth = 0;
  let i = src.indexOf('{', start);
  const bodyStart = i + 1;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const body = src.slice(bodyStart, i);

  const props = [];
  // Each entry: an optional JSDoc block, then `name?: Type;`
  const re = /(?:\/\*\*([\s\S]*?)\*\/\s*)?^\s{2}(\w+)(\?)?:\s*([^;]+);/gm;
  for (const m of body.matchAll(re)) {
    const [, doc = '', name, optional, rawType] = m;
    const jsdoc = doc
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, ''))
      .join('\n');
    const defaultMatch = jsdoc.match(/@default\s+(.+)/);
    const description = clean(jsdoc.replace(/@default.*/s, ''));
    let type = rawType.replace(/\s+/g, ' ').trim();
    if (aliases[type]) type = aliases[type];
    props.push({
      name,
      required: !optional,
      type,
      default: defaultMatch ? defaultMatch[1].trim() : null,
      description,
    });
  }
  return { props, extendsFrom };
};

// ── Parse every component once ──────────────────────────────────────────────

const records = [];
const skipped = [];
const unknownFolders = new Set();

for (const { folder, file } of findStoryFiles(componentsDir)) {
  const src = fs.readFileSync(file, 'utf8');
  const meta = parseStoryMeta(src);
  if (!meta.ok) {
    skipped.push({ file: path.basename(file), why: meta.why });
    continue;
  }
  const { component, title, body } = meta;

  if (!CATEGORIES[folder]) unknownFolders.add(folder);

  const secs = sections(body);
  const componentFile = path.join(path.dirname(file), `${path.basename(file, '.stories.tsx')}.tsx`);
  const componentSrc = fs.existsSync(componentFile) ? fs.readFileSync(componentFile, 'utf8') : '';

  const barrelFile = path.join(path.dirname(file), 'index.ts');
  const barrel = fs.existsSync(barrelFile)
    ? parseBarrelExports(fs.readFileSync(barrelFile, 'utf8'))
    : { values: [], types: [] };

  const doDont = tableRows(secs["do / don't"] || '');
  const hasProp = (n) => new RegExp(`^\\s*${n}\\?:`, 'm').test(componentSrc);

  records.push({
    component,
    folder,
    title,
    body,
    slug: slugify(component),
    category: CATEGORIES[folder] ?? 'Uncategorised',
    purpose: introParagraph(body) || `hello pc ${component}.`,
    usage: secs['usage'] || '',
    snippets: codeBlocks(secs['usage'] || ''),
    tokens: extractTokens(secs['design tokens used'] || ''),
    accessibility: bullets(secs['accessibility'] || ''),
    doDont,
    variants: parseVariants(src),
    barrel,
    figmaNode: body.match(/node\s+(\d+:\d+)/)?.[1] ?? null,
    presentational: /wraps no Radix primitive|no Radix primitive/i.test(body),
    states: ['default', 'disabled', 'selected', 'loading', 'error']
      .filter((s) => s === 'default' || hasProp(s) || (s === 'error' && /'error'/.test(componentSrc)))
      .filter((s) => STATE_ENUM.has(s)),
    ...parseProps(componentSrc, component),
  });
}

// Cross-links, second pass.
const allNames = records.map((r) => r.component);
for (const r of records) {
  r.related = allNames.filter((n) => n !== r.component && new RegExp(`\\b${n}\\b`).test(r.body));
}

// ── Assertions ──────────────────────────────────────────────────────────────
//
// These protect the artefacts from going quietly wrong, which is the only
// failure mode that matters for something an agent trusts blindly.

if (unknownFolders.size) {
  console.error(
    `\n✗ Uncategorised component folder(s): ${[...unknownFolders].join(', ')}\n` +
      '  Add them to CATEGORIES in scripts/build-agent-context.mjs. A component\n' +
      '  missing from the index is a component agents will never use.\n',
  );
  process.exit(1);
}

// src/hellopc/index.ts re-exports 35 barrels with `export *`. A duplicate name
// across two barrels means one silently wins at bundle time, with nothing louder
// than a Rollup warning.
const seen = new Map();
const collisions = [];
for (const r of records) {
  for (const name of r.barrel.values) {
    if (seen.has(name) && seen.get(name) !== r.folder) {
      collisions.push(`${name} (${seen.get(name)} vs ${r.folder})`);
    } else seen.set(name, r.folder);
  }
}
if (collisions.length) {
  console.error(`\n✗ Duplicate exports across barrels: ${collisions.join(', ')}\n`);
  process.exit(1);
}

// ── Emitter: JSON for ai-lab ────────────────────────────────────────────────

const emitJson = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
  const written = [];
  const preserved = [];

  for (const r of records) {
    const target = path.join(dir, `${r.slug}.cake.json`);
    // Never clobber curated knowledge — see the header. This fills gaps only.
    if (fs.existsSync(target)) {
      preserved.push(`${r.slug}.cake.json`);
      continue;
    }

    const usage_guidelines = r.doDont.map((x) => x[0]).filter(Boolean).slice(0, 8);
    const anti_patterns = r.doDont.map((x) => x[1]).filter(Boolean).slice(0, 8);

    const json = {
      component: r.component,
      system: 'cake',
      purpose: r.purpose,
      ...(r.figmaNode ? { figma_node_id: r.figmaNode } : {}),
      variants: r.variants.slice(0, 20),
      states: r.states,
      tokens_used: r.tokens.slice(0, 20),
      usage_guidelines: usage_guidelines.length
        ? usage_guidelines
        : [`Use ${r.component} as documented in Storybook.`],
      accessibility_requirements: r.accessibility.length
        ? r.accessibility.slice(0, 8)
        : ['Follows the hello pc focus-ring and labelling conventions; see the Storybook docs page.'],
      anti_patterns: anti_patterns.length
        ? anti_patterns
        : ['Do not hardcode colors, spacing, or type — use hello pc tokens.'],
      implementation_notes: [
        'Import from @cake-admin/cakeand; wrap the app once in <CakeProvider>.',
        r.presentational
          ? 'Presentational — wraps no Radix primitive; renders a semantic element.'
          : 'Interactive behaviour delegated to a Radix primitive; hello pc owns only the visuals.',
        `Source: src/hellopc/components/${r.folder}/`,
        `Storybook: ${r.title} — https://cake.lenovo.com/storybook/`,
      ],
      status: 'active',
      version: '0.1.0',
      owners: ['design-systems'],
      ...(r.related.length ? { related_components: r.related.slice(0, 8) } : {}),
    };

    fs.writeFileSync(target, `${JSON.stringify(json, null, 2)}\n`);
    written.push(`${r.slug}.cake.json`);
  }

  process.stdout.write(`\n✓ JSON: ${written.length} written → ${dir}\n`);
  if (preserved.length) {
    process.stdout.write(`  preserved ${preserved.length} curated file(s): ${preserved.join(', ')}\n`);
  }
};

// ── Emitter: markdown for coding agents ─────────────────────────────────────

const storybookUrl = (title) =>
  `https://cake.lenovo.com/storybook/?path=/docs/${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}--docs`;

/**
 * One-line summary for the index: the first sentence, hard-capped.
 *
 * The cap is what keeps tier 1 inside its budget. Anything cut here is one file
 * read away in tier 2, so trimming costs an agent nothing but a lookup.
 */
const oneLine = (r) => {
  const first = (r.purpose.split(/(?<=\.)\s/)[0] ?? r.purpose)
    // Figma node references are noise in an index.
    .replace(/\s*\(Figma[^)]*\)/gi, '');
  return first.length > 92 ? `${first.slice(0, 89).trimEnd()}…` : first;
};

const tier1 = (version) => {
  const out = [];
  out.push('<!-- GENERATED by scripts/build-agent-context.mjs. Do not edit. -->');
  out.push(`# hello pc component index — @cake-admin/cakeand (${version})`);
  out.push('');
  out.push('Every component below is imported from ONE path:');
  out.push('');
  out.push("```ts\nimport { Button, Card, TextInput } from '@cake-admin/cakeand';\n```");
  out.push('');
  out.push('There are no deep paths. `@cake-admin/cakeand/Button` does not resolve.');
  out.push('');
  out.push('Every visual value is a CSS custom property — see `hellopc-tokens.md`.');
  out.push('Never hardcode a color, spacing, radius, or type size.');
  out.push('');
  out.push('Read `components/<slug>.md` before using a component for the first time.');
  out.push('');

  for (const cat of CATEGORY_ORDER) {
    const inCat = records.filter((r) => r.category === cat).sort((a, b) => a.component.localeCompare(b.component));
    if (!inCat.length) continue;
    out.push(`## ${cat}`);
    out.push('');
    for (const r of inCat) {
      const portal = PORTALLED.has(r.component) ? ' *(portals to body)*' : '';
      out.push(`- **${r.component}**${portal} — ${oneLine(r)} → \`components/${r.slug}.md\``);
    }
    out.push('');
  }

  out.push('## Portalled components');
  out.push('');
  out.push(
    `${[...PORTALLED].join(', ')} render into \`document.body\`, outside the React tree. ` +
      'They stay themed only because `CakeProvider` puts `data-theme` on `<html>`. ' +
      'Do not pass `scope="subtree"` if you use any of them.',
  );
  out.push('');
  out.push('## Rules');
  out.push('');
  out.push('1. Exactly one `<CakeProvider>`, at the app root.');
  out.push('2. Never hardcode a color, spacing, radius, or type size — use tokens.');
  out.push('3. Token names are exact, not guessable by analogy. Check `hellopc-tokens.md`.');
  out.push('4. `styled-components` must resolve to a single instance.');
  out.push('5. Icons come from `lucide-react`.');
  out.push('6. Do not add another UI library. Compose from what is here.');
  out.push('');
  out.push(`${records.length} components. Live docs: <https://cake.lenovo.com/storybook/>`);
  out.push('');
  return out.join('\n');
};

const tier2 = (r) => {
  const out = [];
  out.push('<!-- GENERATED by scripts/build-agent-context.mjs. Do not edit. -->');
  out.push(`# ${r.component}`);
  out.push('');
  out.push('```ts');
  out.push(`import { ${r.component} } from '@cake-admin/cakeand';`);
  out.push('```');
  out.push('');
  out.push(r.purpose);
  out.push('');

  if (r.props.length) {
    out.push('## Props');
    out.push('');
    out.push('| Prop | Type | Default | Notes |');
    out.push('| --- | --- | --- | --- |');
    for (const p of r.props) {
      const type = `\`${p.type.replace(/\|/g, '\\|')}\``;
      const def = p.default ? `\`${p.default.replace(/\|/g, '\\|')}\`` : p.required ? '**required**' : '—';
      out.push(`| \`${p.name}\` | ${type} | ${def} | ${p.description || ''} |`);
    }
    out.push('');
    if (r.extendsFrom) out.push(`Also accepts all \`${r.extendsFrom}\` props.`);
    out.push('');
  }

  if (r.snippets.length) {
    out.push('## Usage');
    out.push('');
    for (const s of r.snippets) {
      out.push('```tsx');
      out.push(s);
      out.push('```');
      out.push('');
    }
  }

  if (r.tokens.length) {
    out.push('## Design tokens used');
    out.push('');
    out.push(r.tokens.map((t) => `\`${t}\``).join(', '));
    out.push('');
  }

  if (r.accessibility.length) {
    out.push('## Accessibility');
    out.push('');
    for (const a of r.accessibility) out.push(`- ${a}`);
    out.push('');
  }

  if (r.doDont.length) {
    out.push("## Do / Don't");
    out.push('');
    out.push('| Do | Don\'t |');
    out.push('| --- | --- |');
    for (const [a, b] of r.doDont) out.push(`| ${a} | ${b ?? ''} |`);
    out.push('');
  }

  const meta = [];
  if (PORTALLED.has(r.component)) {
    meta.push('Renders through a Radix portal into `document.body` — themed via `<html data-theme>`.');
  }
  meta.push(r.presentational ? 'Presentational; wraps no Radix primitive.' : 'Behaviour comes from a Radix primitive; hello pc owns the visuals.');
  if (r.related.length) meta.push(`Related: ${r.related.slice(0, 8).join(', ')}.`);
  meta.push(`Source: \`src/hellopc/components/${r.folder}/\``);
  meta.push(`Storybook: <${storybookUrl(r.title)}>`);
  out.push('---');
  out.push('');
  out.push(meta.map((m) => `- ${m}`).join('\n'));
  out.push('');
  return out.join('\n');
};

/**
 * Every custom property, light.a values. Parsed from the generated
 * hellopc-vars.css, which is already committed — no new source of truth.
 */
const tokensDoc = (version) => {
  const css = fs.readFileSync(varsFile, 'utf8');
  const block = css.slice(css.indexOf('{') + 1, css.indexOf('}'));
  const entries = [...block.matchAll(/(--[a-z][a-z0-9-]*)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]);

  const groups = new Map();
  for (const [name, value] of entries) {
    const family = name.match(/^--([a-z]+)/)?.[1] ?? 'other';
    if (!groups.has(family)) groups.set(family, []);
    groups.get(family).push([name, value]);
  }

  const out = [];
  out.push('<!-- GENERATED by scripts/build-agent-context.mjs. Do not edit. -->');
  out.push(`# hello pc design tokens — ${version}`);
  out.push('');
  out.push(`${entries.length} CSS custom properties. Values shown are \`light.a\`;`);
  out.push('color tokens resolve differently under `dark.a` and `win hct`, which is');
  out.push('exactly why you use the token instead of the value.');
  out.push('');
  out.push('Names map 1:1 from Figma variables: `color/primary/primaryHover` becomes');
  out.push('`--color-primary-primary-hover`. Names are EXACT — do not guess by analogy.');
  out.push('');
  for (const family of [...groups.keys()].sort()) {
    out.push(`## \`--${family}-*\``);
    out.push('');
    out.push('```css');
    for (const [name, value] of groups.get(family)) out.push(`${name}: ${value};`);
    out.push('```');
    out.push('');
  }
  return out.join('\n');
};

/**
 * `llms.txt` / `llms-full.txt` are WEB artefacts: they address everything by
 * absolute cake.lenovo.com URL and exist for agents that fetch over HTTP rather
 * than reading files. In a starter they are dead weight — llms-full.txt alone is
 * a ~230 kB verbatim duplicate of components/ — so they are opt-in.
 */
const emitMarkdown = (dir, version, { llms = false } = {}) => {
  fs.rmSync(path.join(dir, 'components'), { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, 'components'), { recursive: true });

  const index = tier1(version);
  fs.writeFileSync(path.join(dir, 'hellopc-components.md'), index);
  fs.writeFileSync(path.join(dir, 'hellopc-tokens.md'), tokensDoc(version));

  const details = [];
  for (const r of records) {
    const md = tier2(r);
    fs.writeFileSync(path.join(dir, 'components', `${r.slug}.md`), md);
    details.push(md);
  }

  if (llms) emitLlms(dir, version, index, details);

  const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
  process.stdout.write(
    `\n✓ Markdown: ${records.length} components → ${dir}\n` +
      `  hellopc-components.md ${kb(index)} kB (tier 1 — always read)\n` +
      `  hellopc-tokens.md     ${kb(tokensDoc(version))} kB\n` +
      `  components/        ${records.length} files\n` +
      (llms ? '  llms.txt, llms-full.txt\n' : ''),
  );

  if (Buffer.byteLength(index) > 10 * 1024) {
    process.stdout.write('\n! Tier 1 index is over 10 kB — it is meant to be always-on context.\n');
  }
};

const emitLlms = (dir, version, index, details) => {
  const base = 'https://cake.lenovo.com/context';
  const llmsIndex = [
    '# hello pc',
    '',
    "> Lenovo's design system: React components, design tokens, and theming.",
    `> Package \`@cake-admin/hellopc\` (${version}). Docs <https://cake.lenovo.com/storybook/>`,
    '',
    '## Docs',
    '',
    `- [Component index](${base}/hellopc-components.md): every component and where to read more`,
    `- [Design tokens](${base}/hellopc-tokens.md): every CSS custom property`,
    '- [Getting started](https://cake.lenovo.com/storybook/?path=/docs/getting-started--docs)',
    '',
    '## Components',
    '',
    ...records
      .slice()
      .sort((a, b) => a.component.localeCompare(b.component))
      .map((r) => `- [${r.component}](${base}/components/${r.slug}.md): ${oneLine(r)}`),
    '',
  ].join('\n');

  fs.writeFileSync(path.join(dir, 'llms.txt'), llmsIndex);
  fs.writeFileSync(path.join(dir, 'llms-full.txt'), [index, ...details].join('\n\n---\n\n'));
};

if (jsonOut) emitJson(path.resolve(jsonOut));
if (mdOut) emitMarkdown(path.resolve(mdOut), stamp, { llms: process.argv.includes('--llms') });

if (skipped.length) {
  process.stdout.write(`\n  skipped ${skipped.length} story file(s):\n`);
  for (const s of skipped) process.stdout.write(`   - ${s.file} (${s.why})\n`);
}
