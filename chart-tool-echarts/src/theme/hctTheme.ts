/**
 * Windows High-Contrast (`win hct`) chart theme values, mirrored from hello pc
 * `tokens.json` → `theme['win hct']`. Chart tokens.json only ships lightA/darkA;
 * HCT is applied as an overlay when the site theme dropdown selects HCT.
 *
 * HCT is a dark-canvas, limited-hue system: series distinction comes from
 * cyan / primary / white / gray rather than the multi-hue hero palette.
 * Near-duplicate cyans are intentional token mirrors — `fillStyle` overlays
 * ECharts decals when pairwise OKLab distance fails (see `wireframe.ts`).
 */
export const HCT = {
  surface: {
    canvas: '#202020',
    card: '#202020',
    onContainerHigh: '#202020',
  },
  text: {
    primary: '#ffffff',
    secondary: '#ffffff',
    helper: '#a6a6a6',
  },
  border: {
    weak: '#a6a6a6',
    standard: '#ffffff',
  },
  primary: '#8ee3f0',
  secondary: '#ffffff',
  focus: '#8ee3f0',
  /** `--color-data-*_data` under win hct (all series share the HCT data cyan). */
  data: '#75e9fc',
  tooltip: {
    bg: '#ffffff',
    text: '#202020',
  },
  semantic: {
    positive: '#ffffff',
    negative: '#ffffff',
    warning: '#ffffff',
    info: '#75e9fc',
    neutral: '#a6a6a6',
  },
} as const;

/**
 * Accessible series colors on the HCT canvas. Prefer official HCT tokens only —
 * no invented hex. Order maximizes early contrast (cyan → white → gray →
 * primary cyan); further slots cycle and pick up decal patterns via `hctDecal`.
 */
export const HCT_CATEGORICAL = [
  HCT.data,
  HCT.secondary,
  HCT.border.weak,
  HCT.primary,
] as const;

/** Single-hue sequential ramp (light cyan → deeper) for HCT surfaces. */
export const HCT_SEQUENTIAL = [
  '#d7f7fc',
  '#a8eef8',
  '#8ee3f0',
  '#75e9fc',
  '#5bc4d4',
  '#3a9aab',
] as const;
