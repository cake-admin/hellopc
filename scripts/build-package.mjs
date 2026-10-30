/**
 * Builds the publishable design-system package into `dist-package/`.
 *
 *   node scripts/build-package.mjs [--version 1.2.3]
 *
 * Steps:
 *  1. regenerate the CSS token layer so the build can never ship stale tokens;
 *  2. run the Vite library build (vite.lib.config.mts);
 *  3. prepend the stylesheet import to the entry, so consumers get the tokens +
 *     fonts just by importing the package (no second import to remember);
 *  4. copy Storybook `*.stories.tsx` and generate agent `context/` markdown
 *     (for AI / docs — never on the runtime entry);
 *  5. emit a purpose-built package.json.
 *
 * The published manifest is written fresh here rather than reusing the repo's
 * root package.json: that one describes the Create React App site (react-scripts,
 * MUI, visx, …) and shipping its dependency list would drag the whole app into
 * every consumer.
 *
 * Binaries are invoked through `node` on purpose — this repo's path contains an
 * `&`, which breaks npm's generated .bin shims on Windows.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'dist-package');

const PACKAGE_NAME = '@cake-admin/cakeand';
const CSS_FILE = 'cakeand.css';

/** Read the version from the CLI (--version x.y.z) or fall back to the repo's. */
const versionFlag = process.argv.indexOf('--version');
const rootPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = versionFlag !== -1 ? process.argv[versionFlag + 1] : rootPkg.version;

const run = (args, label) => {
  process.stdout.write(`\n▸ ${label}\n`);
  execFileSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
};

// 1. Tokens first — the CSS custom properties everything reads.
run([path.join(root, 'scripts', 'build-hellopc-css-vars.mjs')], 'building token CSS vars');

// 2. Library build.
run(
  [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build', '--config', 'vite.lib.config.mts'],
  'vite library build',
);

// 2b. Type declarations, emitted by the isolated TypeScript 5 in tools/dts.
//     react-scripts pins the root install to TypeScript 4.x (which cannot even
//     parse this repo's "moduleResolution": "bundler" tsconfig), so upgrading it
//     would put the cake.lenovo.com site build at risk. tsc exits non-zero on the
//     handful of pre-existing type errors elsewhere in src/hellopc, but those do
//     not block declaration emit — so this step warns instead of failing, and we
//     assert on the emitted entry point below.
process.stdout.write('\n▸ emitting type declarations (isolated TypeScript 5)\n');
try {
  execFileSync(
    process.execPath,
    [
      path.join(root, 'tools', 'dts', 'node_modules', 'typescript', 'bin', 'tsc'),
      '-p',
      path.join(root, 'tools', 'dts', 'tsconfig.json'),
    ],
    { cwd: root, stdio: 'inherit' },
  );
} catch {
  process.stdout.write('  (tsc reported pre-existing type errors; declarations still emitted)\n');
}

const typesEntry = path.join(outDir, 'types', 'index.d.ts');
if (!fs.existsSync(typesEntry)) {
  console.error(`\n✗ expected ${typesEntry} — the package would ship without types`);
  process.exit(1);
}

// 3. Make the stylesheet load itself. Vite extracts CSS in library mode and does
//    not re-import it, so without this the package would render unstyled unless
//    the consumer remembered a separate CSS import.
const entry = path.join(outDir, 'index.js');
if (!fs.existsSync(entry)) {
  console.error(`\n✗ expected ${entry} to exist after the Vite build`);
  process.exit(1);
}
const cssEmitted = fs.existsSync(path.join(outDir, CSS_FILE));
if (cssEmitted) {
  const code = fs.readFileSync(entry, 'utf8');
  if (!code.startsWith(`import './${CSS_FILE}'`)) {
    fs.writeFileSync(entry, `import './${CSS_FILE}';\n${code}`);
  }
} else {
  console.warn(`\n! ${CSS_FILE} was not emitted — the package would ship without tokens/fonts.`);
}

// 4. AI / docs artifacts — not part of the runtime graph.
//    Stories stay outside Vite's entry so consumers cannot accidentally import
//    Storybook into their app. Context markdown is the same generator the
//    starter uses (stamped to this package version).
const componentsRoot = path.join(root, 'src', 'hellopc', 'components');
const storiesOut = path.join(outDir, 'stories');

const copyStories = (dir, rel = '') => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const from = path.join(dir, entry.name);
    const nextRel = rel ? path.join(rel, entry.name) : entry.name;
    if (entry.isDirectory()) {
      copyStories(from, nextRel);
      continue;
    }
    if (!entry.name.endsWith('.stories.tsx')) continue;
    const to = path.join(storiesOut, nextRel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
};

process.stdout.write('\n▸ copying Storybook stories → dist-package/stories/\n');
if (fs.existsSync(storiesOut)) fs.rmSync(storiesOut, { recursive: true, force: true });
copyStories(componentsRoot);
const storyCount = (() => {
  let n = 0;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.stories.tsx')) n += 1;
    }
  };
  if (fs.existsSync(storiesOut)) walk(storiesOut);
  return n;
})();
process.stdout.write(`  ${storyCount} story file(s)\n`);

run(
  [
    path.join(root, 'scripts', 'build-agent-context.mjs'),
    '--md-out',
    path.join(outDir, 'context'),
    '--stamp',
    version,
  ],
  'generating agent context → dist-package/context/',
);

// 5. The published manifest.
//
// The licence needs a deliberate answer, not a silent default. Today the root
// manifest has no `license` field, so the fallback below always fires and the
// package ships "UNLICENSED" — while README.md claims MIT and links a LICENSE
// file that does not exist. Those cannot both be right, and the package embeds
// the proprietary Rookery New woff2, so this is a decision for a human rather
// than something to guess at here. UNLICENSED stays the fallback because
// asserting no rights is the safer error than falsely asserting MIT.
if (!rootPkg.license) {
  process.stdout.write(
    '\n! No `license` in the root package.json — publishing as UNLICENSED.\n' +
      '  README.md claims MIT. Resolve the contradiction and set `license` explicitly.\n',
  );
}

const pkg = {
  name: PACKAGE_NAME,
  version,
  description: 'hello pc design system — React components, tokens, and theming.',
  homepage: rootPkg.homepage,
  license: rootPkg.license ?? 'UNLICENSED',
  private: false,
  type: 'module',
  // Keep the CSS (and the entry that imports it) out of tree-shaking's reach.
  sideEffects: ['*.css', './index.js'],
  main: './index.js',
  module: './index.js',
  types: './types/index.d.ts',
  exports: {
    '.': { types: './types/index.d.ts', import: './index.js' },
    [`./${CSS_FILE}`]: `./${CSS_FILE}`,
    // Vite's lib mode ignores `assetsInlineLimit` and base64s the woff2 straight
    // into cakeand.css, so today no assets/ directory is emitted and this entry
    // matches nothing. It is here so that the day fonts become real files, they
    // are reachable: without an `exports` entry, any tool that enforces the map
    // 404s them and the browser silently falls back to system-ui.
    './assets/*': './assets/*',
    // Docs for coding agents — not runtime. Do not import stories from app code.
    './stories/*': './stories/*',
    './context/*': './context/*',
    './package.json': './package.json',
  },
  files: [
    'index.js',
    'index.js.map',
    'types',
    CSS_FILE,
    'assets',
    'stories',
    'context',
    'README.md',
  ],
  peerDependencies: {
    react: '>=18',
    'react-dom': '>=18',
    'styled-components': '>=6',
    'radix-ui': '>=1.6',
    'lucide-react': '>=0.5',
  },
  repository: { type: 'git', url: 'git+https://github.com/cake-admin/cakev2.git' },
  // Scope must match the GitHub owner for GitHub Packages to accept the publish.
  // `access: public` because cake-admin/cakev2 is a public repository and GitHub
  // Packages inherits a package's visibility from its repo — declaring
  // `restricted` here contradicts that and can fail the publish. Note that the
  // GitHub npm registry still requires authentication to install, even for
  // public packages, so consumers keep the scoped .npmrc either way.
  publishConfig: { registry: 'https://npm.pkg.github.com', access: 'public' },
};

fs.writeFileSync(path.join(outDir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);

const readme = path.join(root, 'PACKAGE_README.md');
if (fs.existsSync(readme)) fs.copyFileSync(readme, path.join(outDir, 'README.md'));

const list = fs.readdirSync(outDir).sort();
process.stdout.write(`\n✓ ${PACKAGE_NAME}@${version} → dist-package/\n  ${list.join('\n  ')}\n`);
process.stdout.write(
  cssEmitted ? '' : '\n! no stylesheet emitted — investigate before publishing\n',
);
