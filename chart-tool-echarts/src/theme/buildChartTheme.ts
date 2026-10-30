import {
  categoricalFor,
  divergingFor,
  makeResolver,
  semanticFor,
  semanticScaleFor,
  sequentialFor,
  singleColorsFor,
} from '../tokens/loadTokens';
import type { Mode, RawTokens } from '../tokens/tokens.types';
import { buildColorSystem } from './colorScales';
import type { ChartTheme } from './chartTheme.types';
import { HCT, HCT_CATEGORICAL, HCT_SEQUENTIAL } from './hctTheme';

/**
 * Assemble a full ChartTheme for a mode. Structural fields map 1:1 from base
 * semantic tokens (the same tokens the design-system components consume); chart
 * color scales are derived from referencePrimary / referenceSecondary.
 *
 * Token → chart-part mapping (source components in parens):
 *   grid/axis lines  ← borderWeak           (Divider)
 *   tooltip bg/text  ← textPrimary/surface  (Tooltips)
 *   surfaces         ← surfaceCanvas/Card
 *   focus ring       ← referenceFocus       (Button)
 *
 * `hct` overlays hello pc Windows High-Contrast (`win hct`) surfaces + series
 * colors — chart tokens.json has no HCT channel of its own.
 */
export function buildChartTheme(tokens: RawTokens, mode: Mode): ChartTheme {
  if (mode === 'hct') return buildHctChartTheme();

  const t = makeResolver(tokens, mode);
  // Tooltip elevation copied from the Tooltips component (two-layer drop shadow,
  // heavier on dark). Elevation only — not a data color, so kept token-free.
  const tooltipShadow =
    mode === 'dark'
      ? '0 2px 16px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.2)'
      : '0 2px 16px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.05)';
  return {
    mode,
    surface: {
      canvas: t('surfaceCanvas'),
      card: t('surfaceCard'),
      onContainerHigh: t('surfaceOnContainerHigh'),
    },
    text: { primary: t('textPrimary'), secondary: t('textSecondary'), helper: t('referenceHelper') },
    // Axis baseline uses the stronger Divider weight; gridlines use the weak one.
    axis: { line: t('borderStandard'), tick: t('textSecondary'), label: t('textSecondary') },
    grid: { line: t('borderWeak') },
    border: { weak: t('borderWeak'), standard: t('borderStandard') },
    tooltip: {
      // Inverse surface (Tooltips component): dark bubble in light mode, light in dark.
      bg: t('tooltipBg'),
      text: t('tooltipText'),
      border: t('borderWeak'),
      shadow: tooltipShadow,
      radius: 12,
    },
    focus: t('referenceFocus'),
    // From the Progress bar (pill fills) + Tooltips references.
    shape: { cornerRadius: 12, strokeWidth: 2, dotRadius: 5, donutInnerRatio: 0.6 },
    // Crisp data-viz entrance: strong ease-out curve (Emil Kowalski's recommended
    // cubic-bezier(0.23,1,0.32,1)), short duration, small stagger.
    motion: { duration: 0.4, easing: [0.23, 1, 0.32, 1], stagger: 0.05 },
    // Categorical = the fixed hello pc "hero" palette (identical in light & dark);
    // primary/secondary single-token modes still derive from the base tokens.
    color: buildColorSystem(
      t('referencePrimary'),
      t('referenceSecondary'),
      mode,
      singleColorsFor(mode),
      categoricalFor(mode),
      semanticFor(mode),
      sequentialFor(mode),
      semanticScaleFor(mode),
      divergingFor(mode),
    ),
  };
}

/** High-contrast chart theme from hello pc `win hct` token values. */
function buildHctChartTheme(): ChartTheme {
  return {
    mode: 'hct',
    surface: { ...HCT.surface },
    text: { ...HCT.text },
    axis: { line: HCT.border.standard, tick: HCT.text.secondary, label: HCT.text.secondary },
    grid: { line: HCT.border.weak },
    border: { ...HCT.border },
    tooltip: {
      bg: HCT.tooltip.bg,
      text: HCT.tooltip.text,
      border: HCT.border.standard,
      shadow: '0 2px 16px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.35)',
      radius: 4,
    },
    focus: HCT.focus,
    // Stronger strokes for HCT readability on near-black canvas.
    shape: { cornerRadius: 4, strokeWidth: 3, dotRadius: 6, donutInnerRatio: 0.6 },
    motion: { duration: 0.4, easing: [0.23, 1, 0.32, 1], stagger: 0.05 },
    color: buildColorSystem(
      HCT.primary,
      HCT.secondary,
      'hct',
      {
        'primary.primary': HCT.primary,
        'secondary.secondary': HCT.secondary,
      },
      [...HCT_CATEGORICAL],
      { ...HCT.semantic },
      [...HCT_SEQUENTIAL],
      [
        HCT.semantic.negative,
        HCT.semantic.warning,
        HCT.semantic.neutral,
        HCT.semantic.info,
        HCT.semantic.positive,
      ],
      [HCT.data, HCT.border.weak, HCT.secondary, HCT.primary],
    ),
  };
}
