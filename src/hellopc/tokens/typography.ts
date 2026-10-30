/**
 * hello pc typography — Rookery New.
 *
 * Token naming: `{weight}.{sizePx}.{role}` (matches Figma).
 * Implementation uses rem (16px root) per design-system rules.
 */

export const TYPOGRAPHY_ROLES = [
  'caption',
  'helper',
  'body',
  'subject',
  'subtitle',
  'title',
  'page',
  'greeting',
  'hero',
  'data',
] as const;

export type TypographyRole = (typeof TYPOGRAPHY_ROLES)[number];
export type TypographyWeight = 'regular' | 'medium' | 'bold';

/** Pixel sizes from the hello pc type scale (for docs / Figma parity). */
export const TYPOGRAPHY_SIZE_PX: Record<TypographyRole, number> = {
  caption: 12,
  helper: 14,
  body: 14,
  subject: 16,
  subtitle: 18,
  title: 20,
  page: 28,
  greeting: 32,
  hero: 42,
  data: 68,
};

const pxToRem = (px: number) => `${px / 16}rem`;

/** rem sizes for CSS — use these in styled-components, never raw px. */
export const typographySize = Object.fromEntries(
  TYPOGRAPHY_ROLES.map((role) => [role, pxToRem(TYPOGRAPHY_SIZE_PX[role])])
) as Record<TypographyRole, string>;

export const typographyWeight: Record<TypographyWeight, number> = {
  regular: 400,
  medium: 500,
  bold: 700,
};

/** Suggested line-height per role (not yet exported from Figma). */
const lineHeightForRole = (role: TypographyRole): number => {
  if (role === 'data') return 1.1;
  if (['page', 'greeting', 'hero'].includes(role)) return 1.2;
  if (['subtitle', 'title'].includes(role)) return 1.3;
  return 1.5;
};

export type TypographyStyle = {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  /** Figma token id, e.g. `regular.14.body` */
  token: string;
};

const family = '"Rookery New", "Rookery", system-ui, sans-serif';

const buildWeightStyles = (weight: TypographyWeight): Record<TypographyRole, TypographyStyle> =>
  Object.fromEntries(
    TYPOGRAPHY_ROLES.map((role) => {
      const px = TYPOGRAPHY_SIZE_PX[role];
      return [
        role,
        {
          fontFamily: family,
          fontSize: typographySize[role],
          fontWeight: typographyWeight[weight],
          lineHeight: lineHeightForRole(role),
          token: `${weight}.${px}.${role}`,
        },
      ];
    })
  ) as Record<TypographyRole, TypographyStyle>;

/** Preset styles: `theme.typography.regular.body`, `theme.typography.bold.hero`, … */
export const typographyPresets = {
  regular: buildWeightStyles('regular'),
  medium: buildWeightStyles('medium'),
  bold: buildWeightStyles('bold'),
} as const;

/** Flat list for documentation (all 30 tokens). */
export const typographyTokenList = (['regular', 'medium', 'bold'] as const).flatMap(
  (weight) =>
    TYPOGRAPHY_ROLES.map((role) => ({
      weight,
      role,
      px: TYPOGRAPHY_SIZE_PX[role],
      // `token` intentionally comes from the preset spread below — it builds the
      // identical `${weight}.${px}.${role}` id, so declaring it here as well was
      // redundant and silently overwritten.
      ...typographyPresets[weight][role],
    }))
);

export const font = {
  family,
  weight: typographyWeight,
  size: typographySize,
  role: TYPOGRAPHY_ROLES,
  presets: typographyPresets,
  lineHeight: { tight: 1.2, normal: 1.5, display: 1.1 },
} as const;
