/**
 * Emits hello pc component knowledge as schema-conforming JSON for the AI Lab
 * knowledge base (github.com/cake-admin/ai-lab).
 *
 *   node scripts/build-knowledge.mjs --out ../ai-lab/knowledge/components
 *
 * THIS IS A FORWARDER. The generator now lives in scripts/build-agent-context.mjs,
 * which produces the JSON here and the markdown that coding agents read from a
 * SINGLE parse of the story docs — so the two can never describe the components
 * differently. This entry point is kept because it is the documented workflow in
 * Publishing.mdx and in ai-lab, and because `--out` reads better than
 * `--json-out` when JSON is all you want.
 *
 * Behaviour is unchanged, including the rule that matters most: an existing
 * *.cake.json is NEVER overwritten, so hand-curated entries survive a resync.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

const outFlag = process.argv.indexOf('--out');
const out = outFlag !== -1 ? process.argv[outFlag + 1] : path.join(path.dirname(here), 'dist-knowledge');

const result = spawnSync(
  process.execPath,
  [path.join(here, 'build-agent-context.mjs'), '--json-out', out],
  { stdio: 'inherit' },
);

process.exit(result.status ?? 1);
