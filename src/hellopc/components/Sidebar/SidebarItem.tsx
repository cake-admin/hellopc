import React from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';
import { Tabs as RadixTabs } from 'radix-ui';

import { useSidebarCollapsed } from './SidebarContext';

/**
 * hello pc SidebarItem — a top-level row in an app sidebar (Figma
 * ".elements/sidebar_item", node 156:8735).
 *
 * A Radix `Tabs.Trigger`, so selection, roving Up/Down focus, and the
 * `role="tab"` / `aria-selected` / panel wiring come from the primitive. Figma's
 * `status` axis is Radix's `data-state`; its `state` axis is CSS pseudo-classes
 * plus `disabled`.
 *
 * A heavier sibling of `VerticalTabItem` rather than a variant of it — the two
 * differ in almost every dimension:
 *
 * | | VerticalTabItem | SidebarItem |
 * | --- | --- | --- |
 * | row / radius | 32px, `--radius-150` | 48px, `--radius-200` |
 * | leading icon | none | 24px, always |
 * | trailing control | none | optional disclosure chevron |
 * | selected fill | `--color-tonal-tonal-overlay` | `--color-tonal-tonal-lightest` |
 * | selected label | `--color-primary-primary` | `--color-text-icon-on-tonal` |
 * | indicator | 4×16px | 4×32px |
 *
 * Must be rendered inside `SidebarList` within `Sidebar`.
 */

/* Figma 156:8736 intrinsic geometry: a 40px content row inside 4px of block
   padding (48px total), a 24px leading icon, and a 4×32px leading indicator. */
const CONTENT_HEIGHT = 40;
const ICON_SIZE = 24;
const INDICATOR_WIDTH = 4;
const INDICATOR_HEIGHT = 32;

const Trigger = styled(RadixTabs.Trigger)`
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--space-050) var(--space-300);
  border: none;
  appearance: none;
  border-radius: var(--radius-200);
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

  /* Selected — note the resting fill is tonal/lightest, not the overlay the
     vertical tab row uses. */
  &[data-state='active'] {
    background: var(--color-tonal-tonal-lightest);
    color: var(--color-text-icon-on-tonal);
    font-weight: var(--font-weight-bold);
  }
  &[data-state='active']:hover:not(:disabled) {
    background: var(--color-tonal-tonal-overlay-hover);
  }
  &[data-state='active']:active:not(:disabled) {
    background: var(--color-tonal-tonal-overlay-press);
  }

  /* Leading indicator, in the same on-tonal color as the label. Figma drops it
     on the disabled variants, so it hangs off :not(:disabled). */
  &[data-state='active']:not(:disabled)::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: ${INDICATOR_WIDTH}px;
    height: ${INDICATOR_HEIGHT}px;
    border-radius: var(--radius-1000);
    background: var(--color-text-icon-on-tonal);
  }

  /* Disabled wins over the selected treatment: no fill, no indicator, and the
     label back to medium weight. */
  &:disabled {
    cursor: not-allowed;
    background: transparent;
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

const Content = styled.span<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  gap: var(--space-300);
  width: 100%;
  height: ${CONTENT_HEIGHT}px;
`;

/**
 * Keeps the label in the accessibility tree while the icon rail hides it.
 * Without this the label would merely be *clipped* by the 80px rail, which
 * happens to look right but isn't a decision — and would break the moment the
 * rail width changed.
 */
const HiddenLabel = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

/** Leading glyph. Inherits the row color via currentColor, so it turns
 *  on-tonal along with the label when selected. */
const IconSlot = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  color: currentColor;

  svg {
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
  }
`;

const Label = styled.span`
  flex: 1 1 0%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/* Figma renders the disclosure control as a 32px icon button. It's drawn inside
   the trigger here rather than as its own button, because a button cannot nest
   inside a button — the row itself toggles, and aria-expanded says so. */
const Chevron = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: currentColor;
  transform: rotate(${(p) => (p.$expanded ? '180deg' : '0deg')});
  transition: transform 150ms ease;

  svg {
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export interface SidebarItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  /** Value linking this row to its `SidebarContent` panel. */
  value: string;
  /** The row label. */
  children: React.ReactNode;
  /** Leading 24px glyph. Inherits the row's color. */
  icon?: React.ReactNode;
  /** Dims the row and drops it from the tab order. @default false */
  disabled?: boolean;
  /**
   * Marks this row as owning sub-items and sets their disclosure state. Passing
   * it renders the trailing chevron and sets `aria-expanded`; leave it
   * undefined for a row with no children.
   */
  expanded?: boolean;
  /** Fires with the next disclosure state when a collapsible row is activated. */
  onExpandedChange?: (expanded: boolean) => void;
}

export const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ children, icon, expanded, onExpandedChange, onClick, ...props }, ref) => {
    const collapsed = useSidebarCollapsed();
    /* A collapsed rail has no room for a disclosure control, and its group's
       sub-items aren't shown anyway — so the chevron goes with the label. */
    const collapsible = expanded !== undefined && !collapsed;

    return (
      <Trigger
        ref={ref}
        aria-expanded={collapsible ? expanded : undefined}
        onClick={(event) => {
          onClick?.(event);
          if (collapsible) onExpandedChange?.(!expanded);
        }}
        {...props}
      >
        <Content $collapsed={collapsed}>
          {icon ? <IconSlot aria-hidden>{icon}</IconSlot> : null}
          {collapsed ? <HiddenLabel>{children}</HiddenLabel> : <Label>{children}</Label>}
          {collapsible ? (
            <Chevron $expanded={Boolean(expanded)} aria-hidden>
              <ChevronDown />
            </Chevron>
          ) : null}
        </Content>
      </Trigger>
    );
  },
);

SidebarItem.displayName = 'SidebarItem';

export default SidebarItem;
