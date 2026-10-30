// Renders the real export SVGs for every chart (light + dark) into a single
// static HTML gallery you can open in a browser — no dev server needed.
// Run: npm run gallery  →  preview/index.html
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderChartSvg } from '../src/export/renderStaticSvg';
import { CHART_IDS, CHART_REGISTRY } from '../src/charts/registry';
import { DEFAULT_STYLE } from '../src/charts/types';
import { TOKENS } from '../src/tokens/loadTokens';
import { buildChartTheme } from '../src/theme/buildChartTheme';
import type { Mode } from '../src/tokens/tokens.types';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'preview');
mkdirSync(outDir, { recursive: true });

const W = 520;
const H = 340;

function chartSvg(id: (typeof CHART_IDS)[number], mode: Mode): string {
  const def = CHART_REGISTRY[id];
  const style = { ...DEFAULT_STYLE, ...def.defaultStyle };
  return renderChartSvg({
    type: id,
    data: def.preset(),
    color: { variation: 'categorical' },
    style,
    mode,
    width: W,
    height: H,
  });
}

function column(mode: Mode): string {
  const theme = buildChartTheme(TOKENS, mode);
  const cards = CHART_IDS.map(
    (id) => `<figure><figcaption>${CHART_REGISTRY[id].label}</figcaption>${chartSvg(id, mode)}</figure>`,
  ).join('\n');
  return `<section class="col" style="background:${theme.surface.canvas};color:${theme.text.primary}">
    <h2>${mode === 'dark' ? 'Dark' : 'Light'}</h2>
    <div class="grid">${cards}</div>
  </section>`;
}

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>hello pc data visualization playground — static gallery</title>
<style>
  @font-face { font-family:'Rookery New'; src:url('../public/fonts/RookeryNew-Regular.woff2') format('woff2'); font-weight:400; }
  @font-face { font-family:'Rookery New'; src:url('../public/fonts/RookeryNew-Medium.woff2') format('woff2'); font-weight:500 600; }
  @font-face { font-family:'Rookery New'; src:url('../public/fonts/RookeryNew-Bold.woff2') format('woff2'); font-weight:700; }
  body { margin:0; font-family:'Rookery New','Noto Sans',system-ui,sans-serif; background:#e9e9ec; }
  header { padding:16px 24px; font-weight:700; }
  .wrap { display:grid; grid-template-columns:1fr 1fr; gap:0; }
  .col { padding:24px; min-height:100vh; }
  .col h2 { margin:0 0 16px; font-size:13px; text-transform:uppercase; letter-spacing:.08em; opacity:.7; }
  .grid { display:grid; grid-template-columns:1fr; gap:20px; max-width:560px; }
  figure { margin:0; }
  figcaption { font-size:12px; opacity:.7; margin-bottom:6px; }
  svg { width:100%; height:auto; border-radius:12px; }
  @media (max-width:900px){ .wrap{grid-template-columns:1fr} .col{min-height:auto} }
</style></head>
<body>
  <header>hello pc data visualization playground — static export gallery (real SVG output · categorical palette)</header>
  <div class="wrap">${column('light')}${column('dark')}</div>
</body></html>`;

writeFileSync(join(outDir, 'index.html'), html);
console.log(`[gallery] wrote preview/index.html (${CHART_IDS.length} charts × 2 modes)`);
