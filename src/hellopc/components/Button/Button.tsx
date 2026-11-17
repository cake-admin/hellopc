import React from 'react';
import styled, { css } from 'styled-components';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonIntent = 'primary' | 'secondary' | 'destructive';
export type ButtonVariant = 'fill' | 'outline' | 'tonal' | 'ghost';
export type ButtonTone = 'default' | 'inverse';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Height + type scale, always bold: `xs` 24px tall / 12px text, `sm` 32px /
   * 12px, `md` 40px / 14px, `lg` 48px / 16px.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Which hello pc token family drives the color: `primary` (indigo family),
   * `secondary` (neutral/ink family), or `destructive` (the error family — for
   * actions that delete or can't be undone; Figma `hellopc.button.destructive`).
   * @default 'primary'
   */
  intent?: ButtonIntent;
  /**
   * `inverse` is for buttons on inverse surfaces — toasts, snackbars, tooltips,
   * coach marks (Figma `hellopc.button.inverse`): every color, including
   * hover, press, focus and disabled, swaps to its `--color-inverse-*` twin.
   * Figma defines it for `primary` · `fill` and `secondary` · `ghost` only;
   * other combinations keep their default colors.
   * @default 'default'
   */
  tone?: ButtonTone;
  /**
   * Emphasis treatment, highest → lowest: `fill` (the one main action in a
   * view), `outline` and `tonal` (secondary emphasis), `ghost` (lowest —
   * dense UIs, toolbars, inline actions).
   * @default 'fill'
   */
  variant?: ButtonVariant;
  /**
   * Leading icon. The slot sets the size — 18px for `xs`/`sm`, 24px for
   * `md`/`lg` (Figma icon-size guidance) — so pass the glyph without a size.
   * Icons are decorative — the text label carries the accessible name. Do not
   * use this to build icon-only buttons; that's the (separate) IconButton
   * component.
   */
  startIcon?: React.ReactNode;
  /**
   * Trailing icon, sized by the same slot as `startIcon` (18px `xs`/`sm`, 24px
   * `md`/`lg`). Same rules as `startIcon`.
   */
  endIcon?: React.ReactNode;
  /**
   * Stretch to the container's width (not the viewport). For stacked layouts
   * like dialog footers and mobile forms.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Whether the label is underlined. Defaults to `true` for `ghost` +
   * `secondary` only: with no fill or border those buttons would otherwise be
   * distinguishable from plain text by color alone (WCAG 1.4.1).
   *
   * Set `false` when the button already sits in something that makes it
   * obviously a control — a segmented control, a pager — where the underline
   * reads as a stray link instead.
   */
  underline?: boolean;
}

/** Height + font size per size step — bold at every size: xs/sm 12px
 *  (caption), md 14px (body), lg 16px (subject). */
const sizeStyles = (size: ButtonSize) => {
  const map = {
    xs: css`
      height: 24px;
      font-size: var(--type-size-caption);
    `,
    sm: css`
      height: 32px;
      font-size: var(--type-size-caption);
    `,
    md: css`
      height: 40px;
      font-size: var(--type-size-body);
    `,
    lg: css`
      height: 48px;
      font-size: var(--type-size-subject);
    `,
  } as const;
  return map[size];
};

/** stateLayer padding per size (tonal+md uses a tighter inset, matching Figma).
 *  sm is 8 × 12 per the Figma 1.1 spec; xs keeps its own geometry because the
 *  Figma xs frame is drawn with a 32px state layer inside a 24px button. */
const padFor = (size: ButtonSize, variant: ButtonVariant) => {
  if (variant === 'tonal' && size === 'md') return 'var(--space-100) var(--space-200)';
  return {
    xs: 'var(--space-050) var(--space-200)',
    sm: 'var(--space-100) var(--space-200)',
    md: 'var(--space-150) var(--space-300)',
    lg: 'var(--space-200) var(--space-400)',
  }[size];
};

/** Icon ↔ label gap: 4px at sm (Figma 1.1) and tonal md, 8px otherwise. */
const gapFor = (size: ButtonSize, variant: ButtonVariant) =>
  size === 'sm' || (variant === 'tonal' && size === 'md') ? 'var(--space-050)' : 'var(--space-100)';

/** Icon slot per size — Figma "Icon Size Guidance" (node 3702:7122): 18×18
 *  icons for XS and S buttons, 24×24 for M and L. */
const ICON_SIZE: Record<ButtonSize, string> = {
  xs: 'var(--space-350)',
  sm: 'var(--space-350)',
  md: 'var(--space-500)',
  lg: 'var(--space-500)',
};

/** destructive × variant (Figma hellopc.button.destructive, node 14748:4249).
 *  Figma paints fill hover/press/focus with raw values that equal the
 *  error-hover / error-press / error tokens, so those tokens are used here. */
const destructiveStyles = (variant: ButtonVariant) => {
  const text = 'var(--color-text-icon-error-on-surface-text-destructive-btn)';
  if (variant === 'fill') {
    return css`
      background: var(--color-error-error);
      color: var(--color-text-icon-inverse);
      &:hover:not(:disabled) { background: var(--color-error-error-hover); }
      &:active:not(:disabled) { background: var(--color-error-error-press); }
    `;
  }
  if (variant === 'outline') {
    return css`
      background: transparent;
      color: ${text};
      box-shadow: inset 0 0 0 var(--stroke-200) var(--color-error-error);
      &:focus-visible { background: var(--color-error-error-overlay); }
      &:hover:not(:disabled) { background: var(--color-error-error-overlay-hover); }
      &:active:not(:disabled) { background: var(--color-error-error-overlay-press); }
    `;
  }
  if (variant === 'tonal') {
    return css`
      background: var(--color-error-error-overlay);
      color: ${text};
      &:hover:not(:disabled) { background: var(--color-error-error-overlay-hover); }
      &:active:not(:disabled) { background: var(--color-error-error-overlay-press); }
    `;
  }
  return css`
    background: transparent;
    color: ${text};
    &:focus-visible { background: var(--color-error-error-overlay); }
    &:hover:not(:disabled) { background: var(--color-error-error-overlay-hover); }
    &:active:not(:disabled) { background: var(--color-error-error-overlay-press); }
  `;
};

/** tone=inverse (Figma hellopc.button.inverse, node 17793:6895): primary is
 *  the fill button, secondary the no-container button, each with every color
 *  swapped for its --color-inverse-* twin. Returns null for combinations Figma
 *  doesn't define, which then keep their default colors. */
const inverseStyles = (intent: ButtonIntent, variant: ButtonVariant) => {
  if (intent === 'primary' && variant === 'fill') {
    return css`
      background: var(--color-inverse-button-primary-fill);
      color: var(--color-inverse-button-on-primary-fill);
      box-shadow: inset 0 0 0 var(--stroke-100) var(--color-inverse-button-primary-border);
      &:hover:not(:disabled),
      &:focus-visible {
        background: var(--color-inverse-primary-primary-hover);
        color: var(--color-inverse-text-icon-on-primary);
        box-shadow: none;
      }
      &:active:not(:disabled) {
        background: var(--color-inverse-primary-primary-press);
        color: var(--color-inverse-text-icon-on-primary);
        box-shadow: none;
      }
      &:disabled, &[aria-disabled='true'] {
        background: var(--color-inverse-disabled-disabled);
        color: var(--color-inverse-disabled-disabled-inverse);
        box-shadow: none;
      }
    `;
  }
  if (intent === 'secondary' && variant === 'ghost') {
    /* Figma binds the label to inverse/surfaces/inverseContainer (not
       inverse/secondary/secondary); kept as specified. */
    return css`
      background: transparent;
      color: var(--color-inverse-surfaces-inverse-container);
      &:hover:not(:disabled),
      &:focus-visible { background: var(--color-inverse-secondary-secondary-overlay); }
      &:active:not(:disabled) { background: var(--color-inverse-secondary-secondary-overlay-hover); }
      &:disabled, &[aria-disabled='true'] {
        background: transparent;
        color: var(--color-inverse-disabled-disabled-inverse);
      }
    `;
  }
  return null;
};

/** intent × variant → background / text / border + hover/press, all from the
 *  hello pc token custom properties (see src/hellopc/tokens/hellopc-vars.css). */
const colorStyles = (intent: ButtonIntent, variant: ButtonVariant) => {
  if (intent === 'destructive') return destructiveStyles(variant);
  const p = intent === 'primary';

  if (variant === 'fill') {
    /* Primary fill uses the Figma 1.1 button tokens (color/button/*). They
       equal primary/onPrimary in light and dark; in win hct the button is the
       system ButtonFace with a ButtonText border and label. */
    return p
      ? css`
          background: var(--color-button-primary-fill);
          color: var(--color-button-on-primary-fill);
          box-shadow: inset 0 0 0 var(--stroke-100) var(--color-button-primary-border);
          &:hover:not(:disabled) {
            background: var(--color-primary-primary-hover);
            color: var(--color-text-icon-on-primary);
            box-shadow: none;
          }
          &:active:not(:disabled) {
            background: var(--color-primary-primary-press);
            color: var(--color-text-icon-on-primary);
            box-shadow: none;
          }
        `
      : css`
          background: var(--color-secondary-secondary);
          color: var(--color-text-icon-inverse);
          &:hover:not(:disabled) { background: var(--color-secondary-secondary-hover); }
          &:active:not(:disabled) { background: var(--color-secondary-secondary-press); }
        `;
  }

  /* Outline strokes are drawn as INSET box-shadows, not borders: Figma
     strokes are inside-aligned and overlap the padding, so the text inset
     stays identical to fill/tonal/ghost (a CSS border would add its width
     and make outline buttons read 2px wider per side). */
  if (variant === 'outline') {
    return p
      ? css`
          background: var(--color-surfaces-container);
          color: var(--color-primary-primary);
          box-shadow: inset 0 0 0 var(--stroke-200) var(--color-primary-primary);
          &:hover:not(:disabled) { background: var(--color-primary-primary-overlay); }
          &:active:not(:disabled) { background: var(--color-primary-primary-overlay-hover); }
        `
      : css`
          background: var(--color-surfaces-container);
          color: var(--color-secondary-secondary);
          box-shadow: inset 0 0 0 var(--stroke-200) var(--color-secondary-secondary);
          &:hover:not(:disabled) { background: var(--color-secondary-secondary-overlay); }
          &:active:not(:disabled) { background: var(--color-secondary-secondary-overlay-hover); }
        `;
  }

  if (variant === 'tonal') {
    return p
      ? css`
          background: var(--color-tonal-tonal);
          color: var(--color-text-icon-on-tonal-inverse);
          &:hover:not(:disabled) { background: var(--color-tonal-tonal-hover); }
          &:active:not(:disabled) { background: var(--color-tonal-tonal-press); }
        `
      : css`
          background: var(--color-tonal-tonal-secondary-overlay);
          color: var(--color-text-icon-on-tonal-secondary);
          &:hover:not(:disabled) { background: var(--color-tonal-tonal-secondary-overlay-hover); }
          &:active:not(:disabled) { background: var(--color-tonal-tonal-secondary-overlay-press); }
        `;
  }

  // ghost
  return p
    ? css`
        background: transparent;
        color: var(--color-primary-primary);
        &:hover:not(:disabled) { background: var(--color-primary-primary-overlay); }
        &:active:not(:disabled) { background: var(--color-primary-primary-overlay-hover); }
      `
    : css`
        background: transparent;
        color: var(--color-secondary-secondary);
        /* Persistent label underline (per the Figma spec, e.g. the toast
           button group): with no fill or border, color alone would set this
           apart from plain text — the underline is the non-color affordance
           (WCAG 1.4.1). */
        text-decoration: underline;
        &:hover:not(:disabled) { background: var(--color-secondary-secondary-overlay); }
        &:active:not(:disabled) { background: var(--color-secondary-secondary-overlay-hover); }
      `;
};

/** Disabled treatment differs for bordered/transparent variants. */
const disabledStyles = (variant: ButtonVariant, intent: ButtonIntent) => {
  const base = css`
    cursor: not-allowed;
    pointer-events: none;
  `;
  if (variant === 'outline' && intent === 'destructive') {
    /* Figma destructive outline disabled: transparent, disabledInverse ring,
       text+icon/disabled label. */
    return css`
      &:disabled, &[aria-disabled='true'] {
        ${base}
        background: transparent;
        box-shadow: inset 0 0 0 var(--stroke-200) var(--color-disabled-disabled-inverse);
        color: var(--color-text-icon-disabled);
      }
    `;
  }
  if (variant === 'outline') {
    return css`
      &:disabled, &[aria-disabled='true'] {
        ${base}
        background: var(--color-surfaces-container);
        box-shadow: inset 0 0 0 var(--stroke-200) var(--color-disabled-disabled);
        color: var(--color-disabled-disabled-inverse);
      }
    `;
  }
  if (variant === 'ghost') {
    return css`
      &:disabled, &[aria-disabled='true'] {
        ${base}
        background: transparent;
        color: ${intent === 'destructive' ? 'var(--color-text-icon-disabled)' : 'var(--color-disabled-disabled-inverse)'};
      }
    `;
  }
  return css`
    &:disabled, &[aria-disabled='true'] {
      ${base}
      background: var(--color-disabled-disabled);
      color: var(--color-disabled-disabled-inverse);
      border-color: transparent;
      box-shadow: none;
    }
  `;
};

const StyledButton = styled.button<{
  $size: ButtonSize;
  $intent: ButtonIntent;
  $variant: ButtonVariant;
  $tone: ButtonTone;
  $fullWidth: boolean;
  $underline: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => (p.$fullWidth ? '100%' : 'auto')};
  /* Kill the UA button padding (1px 6px in Chromium) — the StateLayer owns
     ALL padding via the spacing tokens; without this reset every button was
     6px wider per side than the Figma spec. */
  appearance: none;
  padding: 0;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-1000);
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease,
    box-shadow 120ms ease;

  ${(p) => sizeStyles(p.$size)}
  ${(p) => colorStyles(p.$intent, p.$variant)}
  ${(p) => disabledStyles(p.$variant, p.$intent)}
  /* Inverse comes after the defaults so its states (incl. disabled) win. */
  ${(p) => (p.$tone === 'inverse' ? inverseStyles(p.$intent, p.$variant) : null)}

  /* Opting out of the ghost/secondary underline has to undo it here too, since
     colorStyles sets it on the button as well as on the Label. */
  ${(p) =>
    !p.$underline &&
    css`
      text-decoration: none;
    `}

  &:focus {
    outline: none;
  }
  &:focus-visible::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: var(--stroke-300) solid
      ${(p) => (p.$tone === 'inverse' ? 'var(--color-inverse-primary-primary)' : 'var(--color-primary-primary)')};
    border-radius: var(--radius-1000);
    pointer-events: none;
  }
`;

const StateLayer = styled.span<{ $size: ButtonSize; $variant: ButtonVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => gapFor(p.$size, p.$variant)};
  width: 100%;
  height: 100%;
  padding: ${(p) => padFor(p.$size, p.$variant)};
`;

/** Sized by the button (see ICON_SIZE); any SVG fills it via currentColor. */
const IconSlot = styled.span<{ $size: ButtonSize }>`
  display: inline-flex;
  flex-shrink: 0;
  width: ${(p) => ICON_SIZE[p.$size]};
  height: ${(p) => ICON_SIZE[p.$size]};
  align-items: center;
  justify-content: center;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const Label = styled.span<{ $underline: boolean }>`
  white-space: nowrap;
  line-height: 1.35;
  /* Secondary ghost buttons have no background or border, so color alone would
     distinguish them (WCAG 1.4.1). A persistent underline is the non-color
     affordance (matches Figma container=none, type=secondary). */
  ${(p) =>
    p.$underline
      ? css`
          text-decoration: underline;
          text-decoration-skip-ink: none;
          text-underline-position: from-font;
        `
      : ''}
`;

/**
 * hello pc Button — pill-shaped and token-driven. Cross of intent
 * (primary/secondary) × variant (fill/outline/tonal/ghost) × size
 * (xs/sm/md/lg). Styled entirely from the hello pc CSS custom properties
 * (`--color-*`, `--space-*`, `--radius-*`, `--type-*`), which mirror the
 * Figma variables and re-theme via `[data-theme]`.
 *
 * Always renders a real `<button type="button">`. Disabled buttons use the
 * native `disabled` attribute plus `pointer-events: none` (with an
 * `[aria-disabled='true']` styling hook).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'md',
      intent = 'primary',
      variant = 'fill',
      tone = 'default',
      startIcon,
      endIcon,
      fullWidth = false,
      underline,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    /* Ghost/secondary underlines by default (see Label); `underline` lets a
       caller opt out where the affordance is already obvious. */
    const showUnderline = underline ?? (variant === 'ghost' && intent === 'secondary');

    return (
      <StyledButton
        ref={ref}
        type={type}
        $size={size}
        $intent={intent}
        $variant={variant}
        $tone={tone}
        $fullWidth={fullWidth}
        $underline={showUnderline}
        {...props}
      >
        <StateLayer $size={size} $variant={variant}>
          {startIcon ? <IconSlot $size={size}>{startIcon}</IconSlot> : null}
          <Label $underline={showUnderline}>{children}</Label>
          {endIcon ? <IconSlot $size={size}>{endIcon}</IconSlot> : null}
        </StateLayer>
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';
