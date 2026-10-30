import React from 'react';
import styled from 'styled-components';
import { Tabs as RadixTabs } from 'radix-ui';

/**
 * hello pc Sidebar — the container for a sidebar rail and its panels.
 *
 * A thin wrapper over Radix `Tabs` with `orientation="vertical"`, which is what
 * makes the rail behave: roving focus with Up/Down arrows (Home/End to jump),
 * the `tablist` / `tab` / `tabpanel` roles, `aria-selected`, and the
 * trigger↔panel wiring. `SidebarItem`, `SidebarSubItem`, and `SidebarBlock` are
 * what go inside `SidebarList`.
 *
 * These rows are Radix `Tabs.Trigger`s and therefore need a Tabs context. This
 * container exists so that context comes from the sidebar family itself rather
 * than borrowing `VerticalTabs` — a sidebar is built entirely from Sidebar
 * imports.
 *
 * Note this treats the sidebar as an **in-page view switcher**. If your rows
 * change the URL, tabs are the wrong semantics — navigation should be a `<nav>`
 * of links marked `aria-current="page"`, the pattern Breadcrumb and Pagination
 * use.
 *
 * Figma specs the rows and the block, not the surrounding rail, so the rail's
 * spacing follows the hello pc tokens used by the sidebar block (`--space-025`
 * between rows, `--space-050` inset).
 */

const Root = styled(RadixTabs.Root)`
  display: flex;
  align-items: flex-start;
  gap: var(--space-500);
  font-family: var(--font-family);
`;

/* Figma 160:9406 — the rail stacks rows with a 4px gap and no padding of its
   own; the inset comes from the surrounding shell (SidebarNav). */
const List = styled(RadixTabs.List)`
  display: flex;
  flex-direction: column;
  flex: none;
  gap: var(--space-050);
  width: 100%;
`;

const Content = styled(RadixTabs.Content)`
  flex: 1 1 0%;
  min-width: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

export interface SidebarProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  /** The selected row's value (controlled). */
  value?: string;
  /** The initially selected row's value (uncontrolled). */
  defaultValue?: string;
  /** Fires with the newly selected row's value. */
  onValueChange?: (value: string) => void;
  /**
   * `automatic` selects a row as soon as it receives focus; `manual` waits for
   * Enter/Space. Use `manual` when switching views is expensive.
   * @default 'automatic'
   */
  activationMode?: 'automatic' | 'manual';
}

/** The sidebar root. Pins `orientation="vertical"` so Radix wires up Up/Down
 *  arrow navigation instead of Left/Right. */
export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>((props, ref) => (
  <Root ref={ref} {...props} orientation="vertical" />
));
Sidebar.displayName = 'Sidebar';

export interface SidebarListProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {
  /** Accessible name for the rail — always give it one. */
  'aria-label'?: string;
}

/** The rail that holds the sidebar rows (`role="tablist"`). */
export const SidebarList = React.forwardRef<HTMLDivElement, SidebarListProps>((props, ref) => (
  <List ref={ref} {...props} />
));
SidebarList.displayName = 'SidebarList';

export interface SidebarContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content> {
  /** Matches the `value` of the row that reveals this panel. */
  value: string;
}

/** A panel (`role="tabpanel"`), shown when its `value` is selected. */
export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  (props, ref) => <Content ref={ref} {...props} />,
);
SidebarContent.displayName = 'SidebarContent';

export default Sidebar;
