/**
 * Shared parser for the docs prose that every hello pc component carries in its
 * story's `parameters.docs.description.component`.
 *
 * That prose is the same text Storybook renders, and it follows a fixed section
 * order — intro · `## Usage` · `## Design tokens used` · `## Accessibility` ·
 * `## Do / Don't` — which is what makes it parseable rather than something to
 * re-author. Change a story, regenerate, and every downstream artefact follows.
 *
 * Two consumers share this module:
 *   - scripts/build-knowledge.mjs   → *.cake.json for cake-admin/ai-lab
 *   - scripts/build-agent-context.mjs → markdown for coding agents
 *
 * They must not drift, which is the whole reason this lives in one place.
 *
 * The `clean`/`sections`/`bullets`/`tableRows` helpers below are load-bearing and
 * encode two bugs that were expensive to find. Do not "simplify" them without
 * reading the comments.
 */
import fs from 'node:fs';
import path from 'node:path';

/**
 * Strip markdown emphasis/links/code so prose reads cleanly as plain strings.
 *
 * NEVER run this over a code block — it deletes backticks and `**`, which
 * silently corrupts any snippet you pass through it.
 */
export const clean = (s) =>
  s
    .replace(/\\`/g, '`')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Split a docs blob into its `## Section` bodies, keyed by lowercased heading.
 *
 * Done by scanning rather than one regex: the obvious `(?=^##\s|\Z)` lookahead
 * silently breaks, because JavaScript has no `\Z` anchor — it matches a literal
 * "Z", so the LAST section (Do / Don't) never captures.
 */
export const sections = (body) => {
  const out = {};
  let current = null;
  let buffer = [];
  for (const line of body.split('\n')) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      if (current) out[current.toLowerCase()] = buffer.join('\n');
      current = heading[1];
      buffer = [];
    } else if (current !== null) {
      buffer.push(line);
    }
  }
  if (current) out[current.toLowerCase()] = buffer.join('\n');
  return out;
};

/** `- item` bullets, re-joining the wrapped continuation lines beneath each. */
export const bullets = (text) => {
  const out = [];
  let current = null;
  for (const raw of text.split('\n')) {
    const item = raw.match(/^\s*[-*]\s+(.*)$/);
    if (item) {
      if (current) out.push(current);
      current = item[1];
    } else if (current && raw.trim() && !raw.trim().startsWith('|') && !raw.trim().startsWith('#')) {
      current += ` ${raw.trim()}`;
    } else if (current && !raw.trim()) {
      out.push(current);
      current = null;
    }
  }
  if (current) out.push(current);
  return out.map(clean).filter((l) => l.length > 3);
};

/** Two-column markdown table → [[left, right], …], skipping header/separator. */
export const tableRows = (text) =>
  text
    .split('\n')
    .filter((l) => l.trim().startsWith('|') && !/^\s*\|[\s:|-]+\|\s*$/.test(l))
    .map((l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => clean(c)))
    .filter((cells) => cells.length >= 2 && cells[0] && !/^Do$/i.test(cells[0]) && !/^(Part|Variant)/i.test(cells[0]));

/**
 * Normalise CRLF to LF.
 *
 * Non-negotiable before any line-anchored regex: these files are checked out
 * with Windows line endings, and `.` never matches `\r` in a JS regex, so every
 * pattern ending in `$` silently fails to match a single line.
 */
export const normalizeNewlines = (s) => s.replace(/\r\n?/g, '\n');

/**
 * Design-token names mentioned in a section.
 *
 * `--[a-z]…` rather than `--…` so that markdown table separators like `| --- |`
 * are not mistaken for token names.
 */
export const extractTokens = (text) => [...new Set((text.match(/--[a-z][a-z0-9-]*/g) || []))];

/** The intro paragraph before the first `## Section`. */
export const introParagraph = (body) => {
  const intro = body.split(/^##\s/m)[0];
  return (
    clean(
      intro
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p && !p.startsWith('#'))[0] || '',
    ) || ''
  );
};

/**
 * Fenced code blocks of a given language, VERBATIM.
 *
 * Inside a story's template literal every fence is escaped as \`\`\`tsx (a
 * literal ```tsx appears in zero files), so unescape first. The returned text is
 * deliberately never passed through `clean()` — these snippets are the single
 * most useful thing a coding agent gets, and cleaning would destroy them.
 */
export const codeBlocks = (text, lang = 'tsx') => {
  const unescaped = text.replace(/\\`/g, '`');
  const re = new RegExp('```' + lang + '\\n([\\s\\S]*?)```', 'g');
  return [...unescaped.matchAll(re)].map((m) => m[1].replace(/\s+$/, ''));
};

/**
 * The symbols a component folder's `index.ts` barrel actually exports.
 *
 * Parsed from the barrel rather than inferred from the folder name, because the
 * two often disagree in ways nobody would guess: `Button/` also exports
 * `IconButton`, `Card/` exports three templates, and `Progress Indicators/`
 * (a folder name with a space in it) exports `ProgressBar` and `Spinner`.
 */
export const parseBarrelExports = (barrelSrc) => {
  const values = [];
  const types = [];
  for (const m of barrelSrc.matchAll(/export\s+(type\s+)?\{([^}]*)\}/g)) {
    const isType = Boolean(m[1]);
    for (const raw of m[2].split(',')) {
      const name = raw.trim().split(/\s+as\s+/).pop()?.trim();
      if (!name) continue;
      if (isType || /^type\s/.test(raw.trim())) types.push(name.replace(/^type\s+/, ''));
      else values.push(name);
    }
  }
  return { values: [...new Set(values)], types: [...new Set(types)] };
};

/**
 * Every `*.stories.tsx` under the components directory, with its folder.
 *
 * `fs.readdirSync` rather than a glob: one folder is literally named
 * "Progress Indicators", and an unquoted shell glob mangles it.
 */
export const findStoryFiles = (componentsDir) => {
  const files = [];
  for (const folder of fs.readdirSync(componentsDir)) {
    const dir = path.join(componentsDir, folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.stories.tsx')) files.push({ folder, file: path.join(dir, f) });
    }
  }
  return files;
};

/**
 * Pull the meta out of a story file: title, component name, and the docs blob.
 * Returns null when either is absent — some stories are fixtures, not components.
 */
export const parseStoryMeta = (src) => {
  const titleMatch = src.match(/title:\s*'([^']+)'/);
  const componentMatch = src.match(/component:\s*([A-Za-z0-9_]+)\s*,/);
  if (!titleMatch || !componentMatch) return { ok: false, why: 'no title/component in meta' };

  const docsMatch = src.match(/description:\s*\{\s*component:\s*`([\s\S]*?)`\s*,?\s*\}/);
  if (!docsMatch) return { ok: false, why: 'no docs.description.component' };

  return {
    ok: true,
    title: titleMatch[1],
    component: componentMatch[1],
    body: normalizeNewlines(docsMatch[1]),
  };
};

/** `IconButton` → `icon-button`. Both generators must agree on this. */
export const slugify = (component) => component.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** The enum options declared across a story's argTypes. */
export const parseVariants = (src) => [
  ...new Set(
    [...src.matchAll(/options:\s*\[([^\]]+)\]/g)]
      .flatMap((m) => m[1].split(',').map((v) => v.trim().replace(/^['"]|['"]$/g, '')))
      .filter((v) => v && v !== 'true' && v !== 'false' && !v.startsWith('$')),
  ),
];
