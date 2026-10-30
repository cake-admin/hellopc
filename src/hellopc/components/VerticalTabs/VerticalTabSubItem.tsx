import React from 'react';
import styled from 'styled-components';
import { Tabs as RadixTabs } from 'radix-ui';

/**
 * hello pc VerticalTabSubItem — a nested row beneath a `VerticalTabItem` (Figma
 * ".elements/vert_tab_subitem", node 145:8584).
 *
 * Same primitive as the parent row — a Radix `Tabs.Trigger`, so it's a peer in
 * the same roving-focus rail — with four deliberate differences taken from
 * Figma:
 *
 * 1. It indents to `--space-600` (32px) instead of `--space-300`.
 * 2. It has **no** leading indicator; the indent conveys the nesting.
 * 3. Selected-at-rest carries no fill — just the bold accent label.
 * 4. Disabled paints a solid `--color-disabled-disabled` fill (the parent row
 *    stays transparent when disabled).
 *
 * Must be rendered inside `VerticalTabsList` within `VerticalTabs`.
 */

/* Figma 145:8585 intrinsic row height, matching the parent row. */
const ROW_HEIGHT = 32;

const Trigger = styled(RadixTabs.Trigger)`
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-300);
  width: 100%;
  height: ${ROW_HEIGHT}px;
  /* The 32px leading inset is what marks this row as nested. */
  padding: var(--space-050) var(--space-100) var(--space-050) var(--space-600);
  border: none;
  appearance: none;
  border-radius: var(--radius-150);
  background: transparent;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.1px;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition: background 120ms ease;

  /* Not selected. */
  &:hover:not(:disabled) {
    background: var(--color-tonal-tonal-secondary-overlay-hover);
  }
  &:active:not(:disabled) {
    background: var(--color-tonal-tonal-secondary-overlay-press);
  }

  /* Selected: bold label; on-tonal when a tonal fill appears (HCT-safe). */
  &[data-state='active'] {
    color: var(--color-primary-primary);
    font-weight: var(--font-weight-bold);
  }
  &[data-state='active']:hover:not(:disabled) {
    background: var(--color-tonal-tonal-overlay-hover);
    color: var(--color-text-icon-on-tonal);
  }
  &[data-state='active']:active:not(:disabled) {
    background: var(--color-tonal-tonal-overlay-press);
    color: var(--color-text-icon-on-tonal);
  }

  /* Figma gives the sub-item a solid disabled fill, where the parent row stays
     transparent. Kept faithful rather than normalised — see the docs page. */
  &:disabled {
    cursor: not-allowed;
    background: var(--color-disabled-disabled);
    color: var(--color-disabled-disabled-inverse);
    font-weight: var(--font-weight-medium);
  }

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: calc(-1 * var(--stroke-200));
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/** Truncates a long label rather than letting it wrap the fixed-height row. */
const Label = styled.span`
  flex: 1 1 0%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface VerticalTabSubItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  /** Value linking this row to its `VerticalTabsContent` panel. */
  value: string;
  /** The row label. */
  children: React.ReactNode;
  /** Dims the row and drops it from the tab order. @default false */
  disabled?: boolean;
}

export const VerticalTabSubItem = React.forwardRef<HTMLButtonElement, VerticalTabSubItemProps>(
  ({ children, ...props }, ref) => (
    <Trigger ref={ref} {...props}>
      <Label>{children}</Label>
    </Trigger>
  ),
);

VerticalTabSubItem.displayName = 'VerticalTabSubItem';

export default VerticalTabSubItem;
