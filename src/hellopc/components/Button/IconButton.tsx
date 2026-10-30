import React from 'react';
import { AccessibleIcon } from 'radix-ui';
import styled, { css } from 'styled-components';

export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type IconButtonIntent = 'primary' | 'secondary';
export type IconButtonVariant = 'fill' | 'outline' | 'tonal' | 'ghost';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Accessible name for the action (required — the button has no visible
   * text). Rendered as visually-hidden text via Radix `AccessibleIcon`, so
   * screen readers announce it while sighted users see only the icon.
   */
  label: string;
  /**
   * The icon glyph. Rendered at 16px inside the `xs` button and 24px inside
   * `sm`/`md`/`lg`; any SVG icon scales to fill the slot and inherits the
   * button's state color via `currentColor`.
   */
  icon: React.ReactNode;
  /**
   * Container diameter: `xs` 24px (16px icon), `sm` 32px, `md` 40px, `lg`
   * 48px (24px icon).
   * @default 'md'
   */
  size?: IconButtonSize;
  /**
   * Which hello pc token family drives the color: `primary` (indigo family) or
   * `secondary` (neutral/ink family).
   * @default 'primary'
   */
  intent?: IconButtonIntent;
  /**
   * Emphasis treatment (Figma "container"): `fill` (solid), `outline` (1px
   * border), `tonal` (translucent overlay wash), `ghost` (bare icon, Figma
   * "none").
   * @default 'fill'
   */
  variant?: IconButtonVariant;
}

/** Container diameter → icon slot px (from the Figma set: 24→16, else 24). */
const DIAMETER: Record<IconButtonSize, number> = { xs: 24, sm: 32, md: 40, lg: 48 };
const ICON: Record<IconButtonSize, number> = { xs: 16, sm: 24, md: 24, lg: 24 };

/** variant × intent → container/icon colors + hover/press, all from the hello pc
 *  token custom properties (see src/hellopc/tokens/hellopc-vars.css). */
const colorStyles = (intent: IconButtonIntent, variant: IconButtonVariant) => {
  const p = intent === 'primary';

  if (variant === 'fill') {
    return p
      ? css`
          background: var(--color-primary-primary);
          color: var(--color-text-icon-inverse);
          &:hover:not(:disabled) { background: var(--color-primary-primary-hover); }
          &:active:not(:disabled) { background: var(--color-primary-primary-press); }
        `
      : css`
          background: var(--color-secondary-secondary);
          color: var(--color-text-icon-on-secondary);
          &:hover:not(:disabled) { background: var(--color-secondary-secondary-hover); }
          &:active:not(:disabled) { background: var(--color-secondary-secondary-press); }
        `;
  }

  if (variant === 'outline') {
    return p
      ? css`
          background: transparent;
          color: var(--color-primary-primary);
          border: var(--stroke-100) solid var(--color-primary-primary);
          &:hover:not(:disabled) { background: var(--color-primary-primary-overlay); }
          &:active:not(:disabled) { background: var(--color-primary-primary-overlay-hover); }
        `
      : css`
          background: transparent;
          color: var(--color-secondary-secondary);
          border: var(--stroke-100) solid var(--color-secondary-secondary);
          &:hover:not(:disabled) { background: var(--color-secondary-secondary-overlay); }
          &:active:not(:disabled) { background: var(--color-secondary-secondary-overlay-hover); }
        `;
  }

  if (variant === 'tonal') {
    return p
      ? css`
          background: var(--color-tonal-tonal-overlay);
          color: var(--color-text-icon-on-tonal-inverse);
          &:hover:not(:disabled) { background: var(--color-tonal-tonal-overlay-hover); }
          &:active:not(:disabled) { background: var(--color-tonal-tonal-overlay-press); }
        `
      : css`
          background: var(--color-tonal-tonal-secondary-overlay);
          color: var(--color-text-icon-on-tonal-secondary);
          &:hover:not(:disabled) { background: var(--color-tonal-tonal-secondary-overlay-hover); }
          &:active:not(:disabled) { background: var(--color-tonal-tonal-secondary-overlay-press); }
        `;
  }

  // ghost (Figma container=none)
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
        &:hover:not(:disabled) { background: var(--color-secondary-secondary-overlay); }
        &:active:not(:disabled) { background: var(--color-secondary-secondary-overlay-hover); }
      `;
};

/** Disabled: fill/outline/tonal flatten to the disabled fill (border drops);
 *  ghost keeps a transparent container — only the icon dims. */
const disabledStyles = (variant: IconButtonVariant) => css`
  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
    background: ${variant === 'ghost' ? 'transparent' : 'var(--color-disabled-disabled)'};
    border-color: transparent;
    color: var(--color-disabled-disabled-inverse);
  }
`;

const StyledIconButton = styled.button<{
  $size: IconButtonSize;
  $intent: IconButtonIntent;
  $variant: IconButtonVariant;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  width: ${(p) => DIAMETER[p.$size]}px;
  height: ${(p) => DIAMETER[p.$size]}px;
  border-radius: var(--radius-1000);
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;

  ${(p) => colorStyles(p.$intent, p.$variant)}
  ${(p) => disabledStyles(p.$variant)}

  &:focus {
    outline: none;
  }
  &:focus-visible::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: var(--stroke-300) solid var(--color-primary-primary);
    border-radius: var(--radius-1000);
    pointer-events: none;
  }
`;

const IconSlot = styled.span<{ $size: IconButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => ICON[p.$size]}px;
  height: ${(p) => ICON[p.$size]}px;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

/**
 * hello pc IconButton — a circular, icon-only action (Figma "&icon button",
 * node 43:1888). Same intent × variant families as Button, sized 24–48px.
 * Styled entirely from the hello pc CSS custom properties (`--color-*`,
 * `--radius-*`), which mirror the Figma variables and re-theme via
 * `[data-theme]`.
 *
 * Accessibility is built on Radix `AccessibleIcon`: the required `label`
 * renders as visually-hidden text, so the button always has an accessible
 * name even though it shows only a glyph. Renders a real
 * `<button type="button">`.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { label, icon, size = 'md', intent = 'primary', variant = 'fill', type = 'button', ...props },
    ref,
  ) => {
    return (
      <StyledIconButton ref={ref} type={type} $size={size} $intent={intent} $variant={variant} {...props}>
        <AccessibleIcon.Root label={label}>
          <IconSlot $size={size} aria-hidden>
            {icon}
          </IconSlot>
        </AccessibleIcon.Root>
      </StyledIconButton>
    );
  },
);

IconButton.displayName = 'IconButton';
