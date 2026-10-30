import tokensData from './tokens.json';
import { font } from './typography';

/**
 * hello pc theme.
 *
 * Colors are generated from the Figma DTCG export ("& theme.a") by
 * scripts/build-hellopc-tokens.mjs. Spacing, radius, and typography are
 * design-system conventions layered on top (no token export for them yet).
 */
export type ThemeMode = 'light.a' | 'dark.a' | 'win hct';

export type CakeColors = (typeof tokensData)['theme']['light.a'];

const space = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '48px',
} as const;

const radius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  pill: '999px',
  round: '50%',
} as const;

const makeTheme = (mode: ThemeMode) => {
  const color = tokensData.theme[mode] as CakeColors;
  return {
    mode,
    color,
    space,
    radius,
    font,
    typography: font.presets,
    /**
     * Figma `elevation/<n>` — each level is a key layer (drop-shadow-light)
     * over an ambient layer (drop-shadow-heavy). Prefer `var(--elevation-<n>)`
     * in CSS; these exist for JS consumers under CakeThemeProvider.
     */
    elevation: {
      /** Resting — a surface sitting on the page. */
      0: `0 1px 2px 0 ${color.elevation.dropShadowLight}, 0 0 4px 0 ${color.elevation.dropShadowHeavy}`,
      /** Raised — a surface lifting off the page. */
      1: `0 1px 4px 0 ${color.elevation.dropShadowLight}, 0 1px 8px 0 ${color.elevation.dropShadowHeavy}`,
      /** Floating — anchored transients (tooltips). */
      2: `0 2px 8px 0 ${color.elevation.dropShadowLight}, 0 2px 16px 0 ${color.elevation.dropShadowHeavy}`,
      /** Overlay — detached surfaces (menus, toasts, panels). */
      3: `0 4px 12px 0 ${color.elevation.dropShadowLight}, 0 3px 24px 0 ${color.elevation.dropShadowHeavy}`,
      /** Prominent — large detached surfaces (drawers, sheets). */
      4: `0 6px 18px 0 ${color.elevation.dropShadowLight}, 0 4px 36px 0 ${color.elevation.dropShadowHeavy}`,
      /** Dialog — the top of the scale; surfaces that take over the screen. */
      5: `0 8px 24px 0 ${color.elevation.dropShadowLight}, 0 4px 48px 0 ${color.elevation.dropShadowHeavy}`,
      /** Legacy aliases, predating the numbered Figma scale. */
      low: `0 1px 2px 0 ${color.elevation.dropShadowLight}`,
      high: `0 12px 32px -4px ${color.elevation.dropShadowHeavy}`,
    },
  };
};

export const lightTheme = makeTheme('light.a');
export const darkTheme = makeTheme('dark.a');
/** Windows High-Contrast theme contributed in Figma ("& win hct"). */
export const winHctTheme = makeTheme('win hct');

export const themes: Record<ThemeMode, CakeTheme> = {
  'light.a': lightTheme,
  'dark.a': darkTheme,
  'win hct': winHctTheme,
};

export type CakeTheme = ReturnType<typeof makeTheme>;

// win hct is a dark-canvas theme, so treat it as dark for any luminance-based
// UI decisions (e.g. syntax-highlight themes, image treatments).
export const isDarkMode = (mode: ThemeMode) => mode !== 'light.a';
