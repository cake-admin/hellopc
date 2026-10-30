import { echarts } from '../charts/echartsSetup';
import { buildOption } from '../charts/options/buildOption';
import { CHART_REGISTRY, type ChartId } from '../charts/registry';
import type { HeaderConfig, StyleConfig } from '../charts/types';
import type { ColorConfig } from '../theme/chartTheme.types';
import { buildChartTheme } from '../theme/buildChartTheme';
import { TOKENS } from '../tokens/loadTokens';
import type { Mode } from '../tokens/tokens.types';
import type { DataModel } from '../data/dataModel';

export interface ExportArgs {
  type: ChartId;
  data: DataModel;
  color: ColorConfig;
  style: StyleConfig;
  mode: Mode;
  width?: number;
  height?: number;
  /**
   * Font/spacing scale baked into the SVG. Defaults to {@link exportScale} for
   * the given width×height. Export UI exposes this so users can shrink labels
   * when callouts clip at the frame edge.
   */
  scale?: number;
  header?: HeaderConfig;
  title?: string;
  description?: string;
}

/** Reference size at which font/px sizes equal 1× (the in-app design baseline). */
export const EXPORT_REF = { width: 640, height: 420 };

/** Clamp for the export font-scale control (and auto recommendation). */
export const EXPORT_SCALE_MIN = 0.4;
export const EXPORT_SCALE_MAX = 4;

/**
 * Pick a font/px scale for a target export size. Uses the geometric mean of the
 * area ratio (balances width & height) so text & spacing stay proportionate at
 * any dimension — the SVG is rendered at that size with sizes baked in, since
 * Figma won't rescale <text> when the frame is resized.
 */
export function exportScale(width: number, height: number): number {
  const ratio = Math.sqrt((width * height) / (EXPORT_REF.width * EXPORT_REF.height));
  return Math.min(EXPORT_SCALE_MAX, Math.max(0.6, Math.round(ratio * 100) / 100));
}

/** Clamp a user-entered font scale into the supported export range. */
export function clampExportScale(scale: number): number {
  if (!Number.isFinite(scale)) return 1;
  return Math.min(EXPORT_SCALE_MAX, Math.max(EXPORT_SCALE_MIN, Math.round(scale * 100) / 100));
}

/**
 * ECharts centers ALL text via `dominant-baseline="central"`. Browsers honor it
 * (preview looks right), but Figma's SVG importer ignores it and places text on
 * the alphabetic baseline — so labels float above their swatches/ticks. We bake
 * the centering into an explicit `dy="0.32em"` (renderer-independent), keeping
 * browser output identical while making Figma center it too.
 */
function bakeBaselines(svg: string): string {
  return svg.replace(/<text\b[^>]*>/g, (tag) => {
    if (!/dominant-baseline="(?:central|middle)"/.test(tag)) return tag;
    let out = tag.replace(/\s*dominant-baseline="(?:central|middle)"/, '');
    if (!/\sdy=/.test(out)) out = out.replace(/<text\b/, '<text dy="0.32em"');
    return out;
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Render a chart to a clean, final-state SVG string for the given mode, using
 * ECharts' SSR SVG renderer (no animation, no interactivity). Text stays as real
 * <text> so it's editable in Figma. We embed the surface as the background and
 * inject <title>/<desc> for accessibility/handoff.
 */
export function renderChartSvg(args: ExportArgs): string {
  const theme = buildChartTheme(TOKENS, args.mode);
  const width = args.width ?? 640;
  const height = args.height ?? 420;
  const def = CHART_REGISTRY[args.type];

  const option = buildOption({
    type: args.type,
    data: args.data,
    color: args.color,
    style: args.style,
    header: args.header,
    theme,
    staticFrame: true,
    scale: clampExportScale(args.scale ?? exportScale(width, height)),
    frame: { width, height },
  });

  const chart = echarts.init(null, undefined, { renderer: 'svg', ssr: true, width, height });
  const backgroundColor = args.style.transparentBackground ? 'transparent' : theme.surface.card;
  chart.setOption({ ...option, backgroundColor });
  let svg = chart.renderToSVGString();
  chart.dispose();

  const title = args.title ?? def.label;
  const desc = args.description ?? `${def.label} — exported from hello pc data visualization playground (ECharts · ${args.mode} mode)`;
  svg = svg.replace(
    /<svg([^>]*)>/,
    (_m, attrs) => `<svg${attrs}><title>${escapeXml(title)}</title><desc>${escapeXml(desc)}</desc>`,
  );
  return bakeBaselines(svg);
}

/** Build light, dark, and HCT variants (the Figma handoff offers all three). */
export function renderBothModes(args: Omit<ExportArgs, 'mode'>): {
  light: string;
  dark: string;
  hct: string;
} {
  return {
    light: renderChartSvg({ ...args, mode: 'light' }),
    dark: renderChartSvg({ ...args, mode: 'dark' }),
    hct: renderChartSvg({ ...args, mode: 'hct' }),
  };
}
