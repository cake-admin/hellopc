#!/usr/bin/env node
/**
 * Renders a hello pc-consuming app in a real browser and asserts the package
 * actually works — not merely that it compiled.
 *
 *   node scripts/render-check.mjs http://localhost:5173
 *
 * Why this exists: Storybook imports components from SOURCE, not from the built
 * package, so no packaging defect is visible on the docs site. A missing barrel
 * export, a bad external, fonts that 404 through the `exports` map, or a
 * stylesheet that never loads are all invisible until a consumer hits them.
 *
 * The motivating case: the ampersand-web-ldo-dashboard prototype hit a failure
 * where Vite's dependency optimizer dropped the package entry's side-effect CSS
 * import, so the whole token layer silently vanished — under `vite dev` only,
 * while `vite build` stayed fine. That exact failure does NOT reproduce against
 * the current package on Vite 6.4.3 or 8.1.5 (both verified; the optimizer keeps
 * the import), but the class of bug is real, silent, and cheap to guard.
 *
 * Because that failure was dev-only, the caller must run this against BOTH the
 * dev server and the preview server. A build-only smoke test proves very little.
 *
 * Requires playwright's chromium. CI installs it on demand; nothing in this repo
 * depends on it.
 */
import { chromium } from 'playwright';

const url = process.argv[2];
if (!url) {
  console.error('usage: node scripts/render-check.mjs <url>');
  process.exit(1);
}

const failures = [];
const check = (name, ok, detail) => {
  process.stdout.write(`${ok ? '  ✓' : '  ✗'} ${name}${detail ? ` — ${detail}` : ''}\n`);
  if (!ok) failures.push(name);
};

const browser = await chromium.launch();
const page = await browser.newPage();

// Surface anything the app logs as an error — a failed CSS or font request often
// shows up here first.
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push(e.message));

process.stdout.write(`\nRender check — ${url}\n`);
await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
// styled-components injects on mount; give React a beat past first paint.
await page.waitForSelector('button', { timeout: 30_000 });

// 1. The token layer loaded. This is the one that catches the optimizer bug:
//    without cakeand.css every custom property resolves to an empty string.
const tokens = await page.evaluate(() => {
  const s = getComputedStyle(document.documentElement);
  const names = ['--color-surfaces-canvas', '--space-300', '--radius-400', '--font-family'];
  return Object.fromEntries(names.map((n) => [n, s.getPropertyValue(n).trim()]));
});
for (const [name, value] of Object.entries(tokens)) {
  check(`token ${name} resolves`, value.length > 0, value || 'EMPTY — stylesheet did not load');
}

// 2. A real component actually picked up a token-driven style. Tokens can be
//    present while the component CSS is missing, so assert the rendered result.
const button = await page.evaluate(() => {
  const el = document.querySelector('button');
  if (!el) return null;
  const s = getComputedStyle(el);
  return { background: s.backgroundColor, radius: s.borderRadius, font: s.fontFamily };
});
check('a button rendered', button !== null);
if (button) {
  const transparent = ['rgba(0, 0, 0, 0)', 'transparent', ''];
  check('button has a real background', !transparent.includes(button.background), button.background);
  check('button has a non-zero radius', button.radius !== '0px', button.radius);
  check('button inherits the hello pc font stack', /Rookery/i.test(button.font), button.font);
}

// 3. The Rookery woff2 resolved. Guards the `exports` map and the font pipeline:
//    when this breaks the browser silently falls back to system-ui.
const fontLoaded = await page.evaluate(async () => {
  await document.fonts.ready;
  return document.fonts.check('1em "Rookery New"');
});
check('Rookery New is available', fontLoaded);

// 4. The theme attribute is on <html>, which is what keeps portalled components
//    (Modal, Dropdown, Tooltip…) themed.
const themed = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
check('data-theme is set on <html>', Boolean(themed), themed ?? 'absent');

check('no uncaught page errors', consoleErrors.length === 0, consoleErrors.join(' | '));

await browser.close();

if (failures.length) {
  process.stderr.write(`\n✗ ${failures.length} check(s) failed: ${failures.join(', ')}\n`);
  process.exit(1);
}
process.stdout.write('\n✓ all checks passed\n');
