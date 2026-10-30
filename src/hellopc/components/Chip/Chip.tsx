import React from 'react';
import { AccessibleIcon } from 'radix-ui';
import styled, { css } from 'styled-components';
import { X } from 'lucide-react';

export type ChipType = 'primary' | 'secondary' | 'success' | 'warn' | 'error' | 'info';
export type ChipSize = 'sm' | 'lg';

/** Figma 93:4951 intrinsic chip heights: small 24px, large 32px. */
const HEIGHT: Record<ChipSize, number> = { sm: 24, lg: 32 };

/** type → overlay background token (enabled) + its hover variant. */
const TYPE_BACKGROUND: Record<ChipType, { base: string; hover: string }> = {
  primary: {
    base: 'var(--color-primary-primary-overlay)',
    hover: 'var(--color-primary-primary-overlay-hover)',
  },
  secondary: {
    base: 'var(--color-secondary-secondary-overlay)',
    hover: 'var(--color-secondary-secondary-overlay-hover)',
  },
  success: {
    base: 'var(--color-success-success-overlay)',
    hover: 'var(--color-success-success-overlay-hover)',
  },
  warn: {
    base: 'var(--color-warning-warn-overlay)',
    hover: 'var(--color-warning-warn-overlay-hover)',
  },
  error: {
    base: 'var(--color-error-error-overlay)',
    hover: 'var(--color-error-error-overlay-hover)',
  },
  info: {
    base: 'var(--color-info-info-overlay)',
    hover: 'var(--color-info-info-overlay-hover)',
  },
};

const Root = styled.span<{ $type: ChipType; $size: ChipSize; $disabled: boolean; $interactive: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: ${(p) => HEIGHT[p.$size]}px;
  padding: 0 var(--space-100);
  gap: var(--space-050);
  border-radius: var(--radius-1000);
  background: ${(p) => TYPE_BACKGROUND[p.$type].base};
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  transition: background-color 120ms ease;

  ${(p) =>
    p.$size === 'lg'
      ? css`
          font-size: var(--type-size-body);
          letter-spacing: 0.1px;
        `
      : css`
          font-size: var(--type-size-caption);
          letter-spacing: 0.2px;
        `}

  ${(p) =>
    p.$interactive && !p.$disabled
      ? css`
          &:hover {
            background: ${TYPE_BACKGROUND[p.$type].hover};
          }
        `
      : ''}

  /* Focus ring wraps the whole chip when any inner control is focused
     (Figma state=focus: 3px primary ring offset outside the pill). */
  &:focus-within {
    outline: none;
  }
  &:has(:focus-visible)::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: var(--stroke-300) solid var(--color-primary-primary);
    border-radius: var(--radius-1000);
    pointer-events: none;
  }

  ${(p) =>
    p.$disabled
      ? css`
          background: var(--color-disabled-disabled);
          color: var(--color-disabled-disabled-inverse);
          cursor: not-allowed;
        `
      : ''}
`;

const IconSlot = styled.span<{ $size: ChipSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${(p) => (p.$size === 'lg' ? 18 : 16)}px;
  height: ${(p) => (p.$size === 'lg' ? 18 : 16)}px;
  /* Optical offset: pull the leading glyph toward the edge so the icon's
     visible bounds — not its viewBox whitespace — sit ~8px from the edge
     (Figma offsets the leading asset the same way). */
  margin-left: calc(-1 * var(--space-025));
  color: inherit;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const bodyReset = css`
  display: inline-flex;
  align-items: center;
  gap: inherit;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
`;

const StaticBody = styled.span`
  ${bodyReset}
`;

const ButtonBody = styled.button`
  ${bodyReset}
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
  }
`;

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  min-width: 0;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveButton = styled.button<{ $size: ChipSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${(p) => (p.$size === 'lg' ? 18 : 16)}px;
  height: ${(p) => (p.$size === 'lg' ? 18 : 16)}px;
  padding: 0;
  border: none;
  border-radius: var(--radius-1000);
  background: none;
  color: inherit;
  cursor: pointer;
  transition: background-color 120ms ease;
  /* Optical offset: the close glyph is inset within its viewBox, so nudge it
     toward the edge to keep the visible padding at ~8px (mirrors Figma). */
  margin-right: calc(-1 * var(--space-025));

  & > svg {
    width: 100%;
    height: 100%;
  }

  &:hover:not(:disabled) {
    background: var(--color-secondary-secondary-overlay);
  }
  &:disabled {
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
  }
`;

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  /** Chip text. */
  children: React.ReactNode;
  /**
   * Semantic color family from the Figma `type` variant. Drives the overlay
   * background wash.
   * @default 'primary'
   */
  type?: ChipType;
  /**
   * Figma `size`: `lg` is a 32px / 14px chip, `sm` is a 24px / 12px chip.
   * @default 'lg'
   */
  size?: ChipSize;
  /**
   * Dims the chip and disables the body/remove interactions (Figma
   * state=disabled).
   * @default false
   */
  disabled?: boolean;
  /** Optional leading glyph slot; inherits color via `currentColor`. */
  leadingIcon?: React.ReactNode;
  /**
   * Fires when the chip body is activated. When provided the body becomes a
   * real `<button>`; omit it for a display-only chip.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Fires when the trailing remove control is activated. When provided a
   * remove button (Radix `AccessibleIcon`) renders in the trailing slot.
   */
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Accessible name for the remove control. Defaults to `Remove <label>` when
   * the children are a plain string, otherwise `Remove`.
   */
  removeLabel?: string;
}

/**
 * hello pc Chip — a compact, removable input chip (Figma `&Chip`, node 93:4951).
 * Renders a token-styled pill with an optional leading icon, an optional
 * clickable body, and an optional trailing remove button whose icon-only
 * control is built on Radix `AccessibleIcon`.
 *
 * The Figma `state` axis (enabled / hover / focus / disabled) maps to CSS
 * `:hover`, `:focus-within`, and the `disabled` prop rather than discrete
 * variants.
 */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      children,
      type = 'primary',
      size = 'lg',
      disabled = false,
      leadingIcon,
      onClick,
      onRemove,
      removeLabel,
      ...props
    },
    ref,
  ) => {
    const clickable = Boolean(onClick);
    const removable = Boolean(onRemove);
    const resolvedRemoveLabel =
      removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove');

    const content = (
      <>
        {leadingIcon ? (
          <IconSlot $size={size} aria-hidden>
            {leadingIcon}
          </IconSlot>
        ) : null}
        <Label>{children}</Label>
      </>
    );

    return (
      <Root
        ref={ref}
        $type={type}
        $size={size}
        $disabled={disabled}
        $interactive={clickable || removable}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {clickable ? (
          <ButtonBody type="button" onClick={onClick} disabled={disabled}>
            {content}
          </ButtonBody>
        ) : (
          <StaticBody>{content}</StaticBody>
        )}
        {removable ? (
          <RemoveButton type="button" $size={size} onClick={onRemove} disabled={disabled}>
            <AccessibleIcon.Root label={resolvedRemoveLabel}>
              <X aria-hidden />
            </AccessibleIcon.Root>
          </RemoveButton>
        ) : null}
      </Root>
    );
  },
);

Chip.displayName = 'Chip';

export default Chip;
