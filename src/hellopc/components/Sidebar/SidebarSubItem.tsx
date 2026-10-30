import React from 'react';
import styled from 'styled-components';
import { Tabs as RadixTabs } from 'radix-ui';

/**
 * hello pc SidebarSubItem — a nested row beneath a `SidebarItem` (Figma
 * ".elements/sidebar_item" sub-item, node 156:8794).
 *
 * The same primitive as the parent row (a Radix `Tabs.Trigger`), so it's a peer
 * in the same roving-focus rail: arrow keys walk parents and children alike, and
 * one row across the rail is selected at a time.
 *
 * Differences from the parent row, all from Figma: it indents past the parent's
 * icon column, drops the leading icon, the indicator and the chevron, carries no
 * fill when selected at rest, and paints a solid `--color-disabled-disabled`
 * fill when disabled.
 *
 * Must be rendered inside `SidebarList` within `Sidebar`.
 */

/* The leading inset aligns this label with the parent row's label:
   --space-300 (row padding) + 24px icon + --space-300 (gap) = 56px.

   Figma states 54px, which would leave the two labels 2px out of alignment;
   that reads as a drafting artifact rather than intent, so the alignment is
   derived from the parent's own tokens instead of hardcoding 54. Flagged on the
   docs page. */
const PARENT_ICON_SIZE = 24;

const Trigger = styled(RadixTabs.Trigger)`
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-300);
  width: 100%;
  padding: var(--space-200) var(--space-300) var(--space-200)
    calc(var(--space-300) * 2 + ${PARENT_ICON_SIZE}px);
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

  /* Selected: the on-tonal bold label carries it — no fill at rest. */
  &[data-state='active'] {
    color: var(--color-text-icon-on-tonal);
    font-weight: var(--font-weight-bold);
  }
  &[data-state='active']:hover:not(:disabled) {
    background: var(--color-tonal-tonal-overlay-hover);
  }
  &[data-state='active']:active:not(:disabled) {
    background: var(--color-tonal-tonal-overlay-press);
  }

  /* Figma gives the sub-item a solid disabled fill where the parent row stays
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

const Label = styled.span`
  flex: 1 1 0%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface SidebarSubItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  /** Value linking this row to its `SidebarContent` panel. */
  value: string;
  /** The row label. */
  children: React.ReactNode;
  /** Dims the row and drops it from the tab order. @default false */
  disabled?: boolean;
}

export const SidebarSubItem = React.forwardRef<HTMLButtonElement, SidebarSubItemProps>(
  ({ children, ...props }, ref) => (
    <Trigger ref={ref} {...props}>
      <Label>{children}</Label>
    </Trigger>
  ),
);

SidebarSubItem.displayName = 'SidebarSubItem';

export default SidebarSubItem;
