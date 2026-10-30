import React from 'react';
import { Separator as RadixSeparator } from 'radix-ui';
import styled from 'styled-components';

export type DividerDirection = 'horizontal' | 'vertical';
export type DividerWeight = 'primary' | 'weak';

const Root = styled(RadixSeparator.Root)<{ $direction: DividerDirection; $weight: DividerWeight }>`
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  border: none;
  background: transparent;
  padding: var(--space-025);

  ${(p) =>
    p.$direction === 'horizontal'
      ? `
        width: 100%;
        height: calc(var(--space-025) + var(--space-025) + var(--stroke-100));
      `
      : `
        align-self: stretch;
        width: calc(var(--space-025) + var(--space-025) + var(--stroke-100));
        height: 100%;
      `}

  &::before {
    content: '';
    display: block;
    width: ${(p) => (p.$direction === 'horizontal' ? '100%' : 'var(--stroke-100)')};
    height: ${(p) => (p.$direction === 'horizontal' ? 'var(--stroke-100)' : '100%')};
    background: ${(p) =>
      p.$weight === 'primary' ? 'var(--color-stroke-border)' : 'var(--color-stroke-border-low)'};
  }
`;

export interface DividerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixSeparator.Root>, 'orientation' | 'children'> {
  /**
   * The direction of the visual rule (mapped to the Radix Separator
   * `orientation`). Vertical dividers stretch to the containing flex/grid
   * row’s height.
   * @default 'horizontal'
   */
  direction?: DividerDirection;
  /** Visual stroke contrast from Figma: standard `primary` or subtle `weak`. @default 'primary' */
  weight?: DividerWeight;
}

/**
 * hello pc Divider — a separator (Figma "Divider", node 83:4471) built on the
 * Radix `Separator` primitive, which owns the semantics (`role="separator"`,
 * `aria-orientation`, and the `decorative` opt-out). hello pc supplies the 1px
 * tokenized rule inside Figma’s 2px clear inset, filling its parent in the
 * selected direction.
 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ direction = 'horizontal', weight = 'primary', ...props }, ref) => (
    <Root
      ref={ref}
      orientation={direction}
      $direction={direction}
      $weight={weight}
      {...props}
    />
  ),
);

Divider.displayName = 'Divider';

export default Divider;
