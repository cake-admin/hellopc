import { create } from 'storybook/theming/create';

/**
 * Storybook manager themes mapped 1:1 to cake& light.a / dark.a / win hct.
 * Kept as plain hex (Storybook theming has no access to cake-vars.css).
 */

export type CakeManagerThemeKey = 'light' | 'dark' | 'hct';

const FONT =
  '"Rookery New", "Rookery", system-ui, sans-serif';
const FONT_CODE =
  'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const BRAND = {
  brandTitle: 'cake<span class="cake-brand-amp">&amp;</span>',
  brandUrl: 'https://cake.lenovo.com',
  brandTarget: '_self' as const,
};

/** light.a */
const light = create({
  base: 'light',
  ...BRAND,
  colorPrimary: '#394edb',
  colorSecondary: '#5066ff',
  appBg: '#f9f9f9',
  appContentBg: '#ffffff',
  // Solid hover — translucent overlays read as a muddy gradient.
  appHoverBg: '#e8eafc',
  appPreviewBg: '#f9f9f9',
  appBorderColor: '#e3e3e3',
  appBorderRadius: 8,
  fontBase: FONT,
  fontCode: FONT_CODE,
  textColor: '#25262d',
  textInverseColor: '#ffffff',
  textMutedColor: '#44464e',
  barTextColor: '#44464e',
  barHoverColor: '#394edb',
  barSelectedColor: '#394edb',
  barBg: '#ffffff',
  buttonBg: '#ffffff',
  buttonBorder: '#e3e3e3',
  booleanBg: '#f9f9f9',
  booleanSelectedBg: '#e8eafc',
  inputBg: '#ffffff',
  inputBorder: '#e3e3e3',
  inputTextColor: '#25262d',
  inputBorderRadius: 6,
});

/** dark.a */
const dark = create({
  base: 'dark',
  ...BRAND,
  colorPrimary: '#bcc3ff',
  colorSecondary: '#98a4ff',
  appBg: '#121318',
  appContentBg: '#25262d',
  appHoverBg: '#2a2d4a',
  appPreviewBg: '#121318',
  appBorderColor: '#5e5e5e',
  appBorderRadius: 8,
  fontBase: FONT,
  fontCode: FONT_CODE,
  textColor: '#ffffff',
  textInverseColor: '#25262d',
  textMutedColor: '#c6c6cf',
  barTextColor: '#c6c6cf',
  barHoverColor: '#bcc3ff',
  barSelectedColor: '#bcc3ff',
  barBg: '#25262d',
  buttonBg: '#25262d',
  buttonBorder: '#5e5e5e',
  booleanBg: '#121318',
  booleanSelectedBg: '#2a2d4a',
  inputBg: '#25262d',
  inputBorder: '#5e5e5e',
  inputTextColor: '#ffffff',
  inputBorderRadius: 6,
});

/** win hct — high contrast: white/cyan on #202020 */
const hct = create({
  base: 'dark',
  ...BRAND,
  colorPrimary: '#8ee3f0',
  colorSecondary: '#8ee3f0',
  appBg: '#202020',
  appContentBg: '#202020',
  appHoverBg: '#2a2a2a',
  appPreviewBg: '#202020',
  appBorderColor: '#ffffff',
  appBorderRadius: 8,
  fontBase: FONT,
  fontCode: FONT_CODE,
  textColor: '#ffffff',
  textInverseColor: '#202020',
  textMutedColor: '#ffffff',
  barTextColor: '#ffffff',
  barHoverColor: '#8ee3f0',
  barSelectedColor: '#8ee3f0',
  barBg: '#202020',
  buttonBg: '#202020',
  buttonBorder: '#ffffff',
  booleanBg: '#202020',
  booleanSelectedBg: '#2a2a2a',
  inputBg: '#202020',
  inputBorder: '#ffffff',
  inputTextColor: '#ffffff',
  inputBorderRadius: 6,
});

export const cakeManagerThemes = { light, dark, hct } as const;

export const resolveManagerThemeKey = (raw: unknown): CakeManagerThemeKey => {
  if (raw === 'dark' || raw === 'dark.a') return 'dark';
  if (raw === 'hct' || raw === 'win hct') return 'hct';
  return 'light';
};
