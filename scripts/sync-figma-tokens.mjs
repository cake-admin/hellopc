// Pulls the hello pc color + value variables straight from the Figma library via
// the Variables REST API and rewrites the repo-root "& …" export folders, so no
// one has to export JSON by hand. Run: npm run sync:figma-tokens
//
// Needs (Figma Enterprise — the Variables REST API is Enterprise-only):
//   FIGMA_TOKEN     personal access token with the `file_variables:read` scope
//   FIGMA_FILE_KEY  the library file key (figma.com/design/<KEY>/…)
//
// Flags:
//   --list         print every collection (name, modes, variable count) and exit
//   --check        write nothing; exit 1 if any output file would change
//   --from <file>  read a saved API response instead of calling Figma (testing)
//   --save <file>  also save the raw API response (debugging)
//
// The files it writes have the same shape as Figma's own "Export variables"
// DTCG output — the parts scripts/build-hellopc-tokens.mjs and
// chart-tool-echarts/scripts/build-tokens.mjs read — with every alias already
// resolved to a color, so those scripts work unchanged.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

// ---- Which Figma collection/mode lands in which repo file -----------------
// Collection names as they appear in the Figma library. Run with --list to see
// what the file actually contains if one of these stops matching.
const OUTPUTS = [
  { collection: 'hellopc hero', file: '& color hero/color.tokens.json' },
  { collection: 'hellopc', mode: 'light.a', file: '& theme.a/Light.a.tokens.json' },
  { collection: 'hellopc', mode: 'dark.a', file: '& theme.a/Dark.a.tokens.json' },
  // Windows High Contrast is an *extended* collection of "hellopc" whose values
  // point at the "win hct system" colors. Its light.a mode is the one we ship.
  { extensionOf: 'hellopc', mode: 'light.a', file: '& theme.a/Win hct.tokens.json' },
  // One file per Windows contrast theme.
  { collection: 'win hct system', eachMode: (mode) => `& win hct/${mode}.tokens.json` },
  // Spacing / radius / stroke numbers. Matched by content, not name.
  { containsPrefix: ['Spacing/', 'Border/'], file: '& spacing/Value.tokens.json' },
];

// ---- CLI ------------------------------------------------------------------
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const fail = (msg) => {
  console.error(`[sync:figma-tokens] ${msg}`);
  process.exit(1);
};

async function loadResponse() {
  const from = option('--from');
  if (from) return JSON.parse(readFileSync(from, 'utf8'));

  const token = process.env.FIGMA_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;
  if (!token) fail('FIGMA_TOKEN is not set (a Figma personal access token with file_variables:read).');
  if (!fileKey) fail('FIGMA_FILE_KEY is not set (the key in figma.com/design/<KEY>/…).');

  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
    headers: { 'X-Figma-Token': token },
  });
  if (res.status === 403) {
    fail(
      'Figma returned 403. The Variables REST API needs a Figma Enterprise seat and a token ' +
        'with the file_variables:read scope, and the token owner must be able to open the file.'
    );
  }
  if (res.status === 404) fail(`Figma returned 404 — check FIGMA_FILE_KEY ("${fileKey}").`);
  if (!res.ok) fail(`Figma returned ${res.status}: ${await res.text()}`);
  const body = await res.json();
  const save = option('--save');
  if (save) writeFileSync(save, JSON.stringify(body, null, 2) + '\n');
  return body;
}

// ---- Conversion -----------------------------------------------------------
const to255 = (x) => Math.round(Math.min(1, Math.max(0, x)) * 255);
const hexOf = ({ r, g, b }) =>
  '#' + [r, g, b].map((x) => to255(x).toString(16).padStart(2, '0')).join('').toUpperCase();

const isAlias = (v) => v && typeof v === 'object' && v.type === 'VARIABLE_ALIAS';

export function convert(response) {
  const meta = response.meta ?? response;
  const variables = meta.variables ?? {};
  const collections = meta.variableCollections ?? {};
  const all = Object.values(collections);

  const byName = (name) => {
    const hits = all.filter((c) => c.name === name && !c.remote);
    if (hits.length === 0) throw new Error(`no local collection named "${name}" (run with --list)`);
    if (hits.length > 1) throw new Error(`more than one collection named "${name}"`);
    return hits[0];
  };
  const modeId = (collection, name) => {
    const m = collection.modes.find((x) => x.name === name);
    if (!m) {
      throw new Error(
        `collection "${collection.name}" has no mode "${name}" (has: ${collection.modes.map((x) => x.name).join(', ')})`
      );
    }
    return m.modeId;
  };
  const modeName = (collection, id) => collection.modes.find((m) => m.modeId === id)?.name ?? id;

  // Extended collections: Figma models them as a collection pointing at its
  // parent, with per-variable overrides for its own modes. Both field spellings
  // seen in the API are accepted.
  const parentOf = (c) => c.parentVariableCollectionId ?? c.parentCollectionId ?? null;
  const overridesOf = (c) => c.variableOverrides ?? c.overrides ?? {};

  // Resolve one variable to a final value. `ctx` is the mode being exported:
  // { collection, modeId, ext? } where `ext` is an extended collection whose
  // overrides win over its parent's values.
  const resolveValue = (variableId, ctx, path = []) => {
    if (path.includes(variableId)) throw new Error(`alias cycle: ${[...path, variableId].join(' → ')}`);
    const v = variables[variableId];
    if (!v) throw new Error(`alias to unknown variable ${variableId} (is the library it lives in enabled?)`);

    const sameFamily = v.variableCollectionId === ctx.collection.id;
    let raw;
    if (sameFamily) {
      const override = ctx.ext ? overridesOf(ctx.ext)[variableId]?.[ctx.extModeId] : undefined;
      raw = override !== undefined ? override : v.valuesByMode[ctx.modeId];
    } else {
      // A different collection: Figma uses that collection's default mode.
      const target = collections[v.variableCollectionId];
      raw = v.valuesByMode[target?.defaultModeId] ?? Object.values(v.valuesByMode)[0];
    }

    if (isAlias(raw)) {
      const target = variables[raw.id];
      const nextCtx =
        target && target.variableCollectionId === ctx.collection.id
          ? ctx
          : { collection: collections[target?.variableCollectionId] ?? ctx.collection, modeId: null };
      if (nextCtx !== ctx) nextCtx.modeId = nextCtx.collection.defaultModeId;
      return { value: resolveValue(raw.id, nextCtx, [...path, variableId]).value, via: raw.id };
    }
    return { value: raw, via: null };
  };

  const tokenFor = (v, ctx) => {
    const { value, via } = resolveValue(v.id, ctx);
    const ext = {
      'com.figma.variableId': v.id,
      'com.figma.scopes': v.scopes ?? ['ALL_SCOPES'],
    };
    if (v.hiddenFromPublishing) ext['com.figma.hiddenFromPublishing'] = true;
    if (via && variables[via]) {
      const target = variables[via];
      ext['com.figma.aliasData'] = {
        targetVariableName: target.name,
        targetVariableSetName: collections[target.variableCollectionId]?.name ?? '',
      };
    }

    let token;
    if (v.resolvedType === 'COLOR') {
      const { r, g, b, a = 1 } = value;
      token = {
        $type: 'color',
        $value: { colorSpace: 'srgb', components: [r, g, b], alpha: a, hex: hexOf({ r, g, b }) },
      };
    } else if (v.resolvedType === 'FLOAT') {
      token = { $type: 'number', $value: value };
    } else if (v.resolvedType === 'STRING') {
      token = { $type: 'string', $value: value };
    } else if (v.resolvedType === 'BOOLEAN') {
      token = { $type: 'boolean', $value: value };
    } else {
      return null;
    }
    if (v.description) token.$description = v.description;
    token.$extensions = ext;
    return token;
  };

  // Nest "color/primary/primary" → { color: { primary: { primary: token } } },
  // keeping the collection's own variable order.
  const buildFile = (collection, ctx, filter = () => true) => {
    const out = {};
    const ids = collection.variableIds ?? Object.keys(variables).filter((id) => variables[id].variableCollectionId === collection.id);
    for (const id of ids) {
      const v = variables[id];
      if (!v || v.remote || !filter(v)) continue;
      const token = tokenFor(v, ctx);
      if (!token) continue;
      const parts = v.name.split('/');
      let node = out;
      for (const p of parts.slice(0, -1)) node = node[p] ??= {};
      node[parts.at(-1)] = token;
    }
    out.$extensions = { 'com.figma.modeName': modeName(ctx.collection, ctx.modeId) };
    return out;
  };

  const files = {};
  for (const spec of OUTPUTS) {
    if (spec.extensionOf) {
      const parent = byName(spec.extensionOf);
      const exts = all.filter((c) => parentOf(c) === parent.id && !c.remote);
      if (exts.length !== 1) {
        throw new Error(
          `expected one extended collection of "${spec.extensionOf}", found ${exts.length} ` +
            '(run with --list; the Windows High Contrast mapping may need updating)'
        );
      }
      const ext = exts[0];
      const extModeId = modeId(ext, spec.mode);
      const extMode = ext.modes.find((m) => m.modeId === extModeId);
      // An extension's mode maps onto a parent mode; fall back to the same name.
      const parentModeId = extMode.parentModeId ?? modeId(parent, spec.mode);
      const ctx = { collection: parent, modeId: parentModeId, ext, extModeId };
      const file = buildFile(parent, ctx);
      file.$extensions = {
        'com.figma.modeName': spec.mode,
        'com.figma.parentVariableSetId': parent.id,
        'com.figma.parentVariableSetName': parent.name,
      };
      files[spec.file] = file;
    } else if (spec.containsPrefix) {
      const hits = all.filter(
        (c) =>
          !c.remote &&
          spec.containsPrefix.every((prefix) =>
            (c.variableIds ?? []).some((id) => variables[id]?.name.startsWith(prefix))
          )
      );
      if (hits.length !== 1) {
        throw new Error(`expected one collection holding ${spec.containsPrefix.join(' + ')} variables, found ${hits.length}`);
      }
      const c = hits[0];
      files[spec.file] = buildFile(c, { collection: c, modeId: c.defaultModeId }, (v) =>
        spec.containsPrefix.some((p) => v.name.startsWith(p))
      );
    } else if (spec.eachMode) {
      const c = byName(spec.collection);
      for (const m of c.modes) files[spec.eachMode(m.name)] = buildFile(c, { collection: c, modeId: m.modeId });
    } else {
      const c = byName(spec.collection);
      const id = spec.mode ? modeId(c, spec.mode) : c.defaultModeId;
      files[spec.file] = buildFile(c, { collection: c, modeId: id });
    }
  }
  return files;
}

function listCollections(response) {
  const meta = response.meta ?? response;
  const variables = meta.variables ?? {};
  for (const c of Object.values(meta.variableCollections ?? {})) {
    const count = (c.variableIds ?? []).length;
    const sample = (c.variableIds ?? []).slice(0, 2).map((id) => variables[id]?.name).join(', ');
    const parent = c.parentVariableCollectionId ?? c.parentCollectionId;
    console.log(
      `${c.remote ? '[remote] ' : ''}"${c.name}" (${c.id}) — modes: ${c.modes.map((m) => m.name).join(', ')}` +
        ` — ${count} variables${sample ? ` e.g. ${sample}` : ''}` +
        (parent ? ` — extends ${meta.variableCollections[parent]?.name ?? parent}` : '')
    );
  }
}

// ---- Main -----------------------------------------------------------------
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const response = await loadResponse();
  if (flag('--list')) {
    listCollections(response);
    process.exit(0);
  }

  let files;
  try {
    files = convert(response);
  } catch (err) {
    fail(err.message);
  }

  const changed = [];
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(repoRoot, rel);
    const text = JSON.stringify(content, null, 2) + '\n';
    const before = existsSync(abs) ? readFileSync(abs, 'utf8').replace(/\r\n/g, '\n') : null;
    if (before === text) continue;
    changed.push(rel);
    if (!flag('--check')) {
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, text);
    }
  }

  if (flag('--check')) {
    if (changed.length) {
      console.log(`[sync:figma-tokens] out of date with Figma:\n  ${changed.join('\n  ')}`);
      process.exit(1);
    }
    console.log('[sync:figma-tokens] up to date with Figma.');
  } else {
    console.log(
      changed.length
        ? `[sync:figma-tokens] updated ${changed.length} file(s):\n  ${changed.join('\n  ')}`
        : '[sync:figma-tokens] already up to date with Figma.'
    );
  }
}
