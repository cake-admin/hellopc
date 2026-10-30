import React from 'react';
import { Progress as RadixProgress } from 'radix-ui';
import styled, { keyframes } from 'styled-components';

export type SpinnerColor = 'primary' | 'greyscale';
export type SpinnerFill = 'all' | '3/4' | '2/3' | '1/2' | '1/3' | '1/4' | '1/8' | 'none';
export type SpinnerSize = 'sm' | 'md' | 'lg';

/** Figma 90:4969 intrinsic spinner diameters: 16px, 24px, and 32px. */
const DIAMETER: Record<SpinnerSize, number> = { sm: 16, md: 24, lg: 32 };
/** Figma 90:4969 intrinsic ring thickness per 16px, 24px, and 32px spinner. */
const RING_WIDTH: Record<SpinnerSize, number> = { sm: 2, md: 3, lg: 4 };

const FILL_PERCENTAGE: Record<SpinnerFill, number> = {
  all: 100,
  '3/4': 75,
  '2/3': 66.667,
  '1/2': 50,
  '1/3': 33.333,
  '1/4': 25,
  '1/8': 12.5,
  none: 0,
};

const COLOR: Record<SpinnerColor, string> = {
  primary: 'var(--color-primary-primary)',
  greyscale: 'var(--color-text-icon-primary)',
};

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Root = styled(RadixProgress.Root)<{ $animated: boolean; $size: SpinnerSize }>`
  position: relative;
  display: inline-block;
  flex: none;
  width: ${(p) => DIAMETER[p.$size]}px;
  height: ${(p) => DIAMETER[p.$size]}px;
  border-radius: var(--radius-1000);
  animation: ${(p) => (p.$animated ? rotate : 'none')} 900ms linear infinite;
  will-change: transform;

  &::before {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: conic-gradient(
      from -90deg,
      var(--color-stroke-border-low) 0deg 360deg
    );
    content: '';
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - ${(p) => RING_WIDTH[p.$size]}px),
      var(--color-text-icon-primary) calc(100% - ${(p) => RING_WIDTH[p.$size]}px + 1px)
    );
    mask: radial-gradient(
      farthest-side,
      transparent calc(100% - ${(p) => RING_WIDTH[p.$size]}px),
      var(--color-text-icon-primary) calc(100% - ${(p) => RING_WIDTH[p.$size]}px + 1px)
    );
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Indicator = styled(RadixProgress.Indicator)<{
  $color: SpinnerColor;
  $fill: SpinnerFill;
  $size: SpinnerSize;
}>`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: conic-gradient(
    from -90deg,
    ${(p) => COLOR[p.$color]} 0deg ${(p) => FILL_PERCENTAGE[p.$fill] * 3.6}deg,
    transparent ${(p) => FILL_PERCENTAGE[p.$fill] * 3.6}deg 360deg
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - ${(p) => RING_WIDTH[p.$size]}px),
    var(--color-text-icon-primary) calc(100% - ${(p) => RING_WIDTH[p.$size]}px + 1px)
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - ${(p) => RING_WIDTH[p.$size]}px),
    var(--color-text-icon-primary) calc(100% - ${(p) => RING_WIDTH[p.$size]}px + 1px)
  );
`;

export interface SpinnerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadixProgress.Root>,
    'children' | 'max' | 'value'
  > {
  /**
   * Semantic color treatment from the Figma `color` variant.
   * @default 'primary'
   */
  color?: SpinnerColor;
  /**
   * Visual arc from the Figma `filled` variant. This is deliberately visual
   * only: Spinner always exposes indeterminate progress semantics.
   * @default '3/4'
   */
  fill?: SpinnerFill;
  /**
   * Figma size: `sm` is 16px, `md` is 24px, and `lg` is 32px.
   * @default 'lg'
   */
  size?: SpinnerSize;
  /**
   * Rotates the visual arc to indicate ongoing work. Reduced-motion users see
   * the same static arc.
   * @default true
   */
  animated?: boolean;
  /** Accessible name announced for the indeterminate loading indicator. @default 'Loading' */
  'aria-label'?: string;
}

/**
 * hello pc Spinner — an indeterminate circular loading indicator based on Figma
 * node 90:4969. Radix Progress owns its `progressbar` semantics; the visual
 * arc and animation are token-based and re-theme with hello pc modes.
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      color = 'primary',
      fill = '3/4',
      size = 'lg',
      animated = true,
      'aria-label': ariaLabel = 'Loading',
      ...props
    },
    ref,
  ) => (
    <Root
      ref={ref}
      value={null}
      $animated={animated}
      $size={size}
      aria-label={ariaLabel}
      {...props}
    >
      <Indicator $color={color} $fill={fill} $size={size} />
    </Root>
  ),
);

Spinner.displayName = 'Spinner';

export default Spinner;
