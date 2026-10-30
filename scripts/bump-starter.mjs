#!/usr/bin/env node
/**
 * Point the starter at a newly published version.
 *
 *   node scripts/bump-starter.mjs --version 4.2.0
 *
 * Two things move together, and they MUST move together:
 *
 *   1. starter/package.json's pinned tarball URL
 *   2. starter/context/ — regenerated and stamped with that same version
 *
 * If the context were regenerated on every push to main instead, a designer's
 * agent would read about components their pinned package does not contain yet.
 * The context that ships beside a pinned dependency has to describe that exact
 * dependency, which is why this runs from the publish workflow rather than the
 * deploy one.
 *
 * Deliberately a script and not `sed`: it fails loudly if the shape it expects
 * has changed, rather than silently matching nothing and reporting success.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const i = process.argv.indexOf('--version');
const version = i !== -1 ? process.argv[i + 1] : null;
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('usage: bump-starter.mjs --version X.Y.Z');
  process.exit(1);
}

const DEP = '@cake-admin/cakeand';
const url = `https://github.com/cake-admin/cakev2/releases/download/v${version}/cake-admin-cakeand-${version}.tgz`;

// 1. The pinned dependency.
const pkgPath = path.join(root, 'starter', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const before = pkg.dependencies?.[DEP];
if (!before) {
  console.error(`✗ ${DEP} is not a dependency of starter/package.json — nothing to bump.`);
  process.exit(1);
}
if (before === url) {
  process.stdout.write(`Starter already pinned to ${version}.\n`);
} else {
  pkg.dependencies[DEP] = url;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  process.stdout.write(`starter/package.json\n  ${before}\n  → ${url}\n`);
}

// 2. The context that ships beside it, stamped with the same version.
execFileSync(
  process.execPath,
  [
    path.join(root, 'scripts', 'build-agent-context.mjs'),
    '--md-out',
    path.join(root, 'starter', 'context'),
    '--stamp',
    version,
  ],
  { stdio: 'inherit' },
);

// 3. Anywhere else the version is quoted to a designer.
const readme = path.join(root, 'starter', 'README.md');
const src = fs.readFileSync(readme, 'utf8');
const next = src.replace(
  /https:\/\/github\.com\/cake-admin\/cakev2\/releases\/download\/v[\d.]+\/cake-admin-cakeand-[\d.]+\.tgz/g,
  url,
);
if (next !== src) {
  fs.writeFileSync(readme, next);
  process.stdout.write('starter/README.md — install URL updated\n');
}

process.stdout.write(`\n✓ Starter now targets hello pc ${version}\n`);
