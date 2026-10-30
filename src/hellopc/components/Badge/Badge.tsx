import React from 'react';
import styled, { css } from 'styled-components';

/** Semantic color families (Figma `Property 1`: primary/secondary/destructive/disabled). */
export const BADGE_SEMANTICS = ['primary', 'secondary', 'destructive', 'disabled'] as const;
/** Decorative palette colors (Figma `Property 1` badge swatches). */
export const BADGE_PALETTE = [
  'red',
  'orange',
  'amber',
  'gold',
  'yellow',
  'lime',
  'green',
  'jade',
  'teal',
  'aqua',
  'cyan',
  'azure',
  'blue',
  'indigo',
  'violet',
  'purple',
  'magenta',
  'pink',
] as const;

export type BadgeSemantic = (typeof BADGE_SEMANTICS)[number];
export type BadgePalette = (typeof BADGE_PALETTE)[number];
export type BadgeColor = BadgeSemantic | BadgePalette;
export type BadgeTone = 'solid' | 'subtle';

type ToneStyle = { bg: string; fg: string };

/** Semantic families resolve to design-system fills rather than the badge palette. */
const SEMANTIC_STYLES: Record<BadgeSemantic, Record<BadgeTone, ToneStyle>> = {
  primary: {
    solid: { bg: 'var(--color-primary-primary)', fg: 'var(--color-text-icon-inverse)' },
    subtle: { bg: 'var(--color-primary-primary-overlay)', fg: 'var(--color-primary-primary)' },
  },
  secondary: {
    solid: { bg: 'var(--color-secondary-secondary)', fg: 'var(--color-text-icon-inverse)' },
    subtle: { bg: 'var(--color-secondary-secondary-overlay)', fg: 'var(--color-secondary-secondary)' },
  },
  destructive: {
    solid: { bg: 'var(--color-error-error)', fg: 'var(--color-text-icon-inverse)' },
    subtle: { bg: 'var(--color-error-error-overlay)', fg: 'var(--color-error-error)' },
  },
  disabled: {
    solid: { bg: 'var(--color-disabled-disabled-inverse)', fg: 'var(--color-disabled-disabled)' },
    subtle: { bg: 'var(--color-disabled-disabled)', fg: 'var(--color-disabled-disabled-inverse)' },
  },
};

/** Palette swatches follow the `--color-badge-*` naming 1:1 with the Figma variables. */
const paletteStyle = (c: BadgePalette): Record<BadgeTone, ToneStyle> => ({
  solid: { bg: `var(--color-badge-${c})`, fg: 'var(--color-text-icon-inverse)' },
  subtle: {
    bg: `var(--color-badge-${c}-light)`,
    fg: `var(--color-badge-text-icon-on-${c}-light)`,
  },
});

const COLOR_STYLES: Record<BadgeColor, Record<BadgeTone, ToneStyle>> = {
  ...SEMANTIC_STYLES,
  ...(Object.fromEntries(BADGE_PALETTE.map((c) => [c, paletteStyle(c)])) as Record<
    BadgePalette,
    Record<BadgeTone, ToneStyle>
  >),
};

const Root = styled.span<{ $bg: string; $fg: string; $solidBg: string; $solidFg: string; $tone: BadgeTone }>`
  display: inline-flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  gap: var(--space-050);
  /* Figma 122:6268: horizontal padding only (space-050), height hugs the
     12px line so the pill is ~16px tall. */
  padding: 0 var(--space-050);
  border-radius: var(--radius-1000);
  background: ${(p) => p.$bg};
  color: ${(p) => p.$fg};
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.2px;
  line-height: 1.35;
  white-space: nowrap;

  /*
   * Windows HCT flattens subtle washes: primary/secondary overlays become solid
   * white while label tokens stay light (white-on-white or cyan-on-white). Use
   * the solid fill + ink pair so date / release chips stay readable.
   */
  ${(p) =>
    p.$tone === 'subtle'
      ? css`
          :root[data-theme='win hct'] &,
          [data-theme='win hct'] & {
            background: ${p.$solidBg};
            color: ${p.$solidFg};
          }
        `
      : null}
`;

const Dot = styled.span`
  flex-shrink: 0;
  /* Figma left-slot is a fixed 8px status dot; --space-100 == 8px. */
  width: var(--space-100);
  height: var(--space-100);
  border-radius: var(--radius-1000);
  background: currentColor;
`;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge text (Figma `label`). */
  children: React.ReactNode;
  /**
   * Color family (Figma `Property 1`). Four semantic families —
   * `primary`, `secondary`, `destructive`, `disabled` — draw from the
   * design-system colors; the remaining values are decorative palette
   * swatches. `disabled` is a muted/inactive treatment, not an interactive
   * state (Badge is presentational).
   * @default 'primary'
   */
  color?: BadgeColor;
  /**
   * Emphasis (Figma `Property 2`). `solid` is a saturated fill with inverse
   * text (Figma `primary`); `subtle` is a light tinted wash with colored text
   * (Figma `onPrimary`).
   * @default 'solid'
   */
  tone?: BadgeTone;
  /**
   * Show the leading 8px status dot (Figma `showLeftSlot`). The dot is
   * decorative and inherits the badge's text color.
   * @default true
   */
  dot?: boolean;
}

/**
 * hello pc Badge — a compact, non-interactive status label (Figma `Label`, node
 * 122:6268). Renders a token-styled pill with an optional leading status dot
 * and a bold caption. Use it to tag or categorize content (status, counts,
 * labels); it is presentational only — for a removable/clickable pill use
 * `Chip`, and for actions use `Button`.
 *
 * Being static, Badge wraps no Radix primitive (there is none for a badge and
 * nothing interactive to delegate); it renders a semantic `<span>`. Every
 * color resolves from hello pc CSS custom properties, so the **Theme** toolbar
 * re-themes it live.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, color = 'primary', tone = 'solid', dot = true, ...props }, ref) => {
    const { bg, fg } = COLOR_STYLES[color][tone];
    const solid = COLOR_STYLES[color].solid;

    return (
      <Root
        ref={ref}
        $bg={bg}
        $fg={fg}
        $solidBg={solid.bg}
        $solidFg={solid.fg}
        $tone={tone}
        {...props}
      >
        {dot ? <Dot aria-hidden /> : null}
        {children}
      </Root>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
