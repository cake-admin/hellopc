import React from 'react';
import styled from 'styled-components';
import { Tabs as RadixTabs } from 'radix-ui';

/**
 * hello pc VerticalTabs — the container for a vertical tab rail and its panels.
 *
 * A thin wrapper over Radix `Tabs` with `orientation="vertical"`, which is what
 * makes the rail behave: roving focus with Up/Down arrows (Home/End to jump),
 * the `tablist` / `tab` / `tabpanel` roles, `aria-selected`, and the
 * trigger↔panel wiring. `VerticalTabItem` and `VerticalTabSubItem` are the rows
 * that go inside `VerticalTabsList`.
 *
 * The rail's own geometry comes from the assembled Figma nav (node 147:8709):
 * `--space-050` padding, `--space-025` between rows, `--radius-200` corners.
 * Only the rail↔panel gap is still a local choice, since Figma draws the nav on
 * its own without a panel beside it.
 */

const Root = styled(RadixTabs.Root)`
  display: flex;
  align-items: flex-start;
  gap: var(--space-500);
  font-family: var(--font-family);
`;

const List = styled(RadixTabs.List)`
  display: flex;
  flex-direction: column;
  flex: none;
  gap: var(--space-025);
  padding: var(--space-050);
  border-radius: var(--radius-200);
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

export interface VerticalTabsProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  /** The selected tab's value (controlled). */
  value?: string;
  /** The initially selected tab's value (uncontrolled). */
  defaultValue?: string;
  /** Fires with the newly selected tab's value. */
  onValueChange?: (value: string) => void;
  /**
   * `automatic` selects a tab as soon as it receives focus; `manual` waits for
   * Enter/Space. Use `manual` when switching tabs is expensive.
   * @default 'automatic'
   */
  activationMode?: 'automatic' | 'manual';
}

/** The tabs root. Forces `orientation="vertical"` so Radix wires up Up/Down
 *  arrow navigation instead of Left/Right. */
export const VerticalTabs = React.forwardRef<HTMLDivElement, VerticalTabsProps>(
  (props, ref) => <Root ref={ref} {...props} orientation="vertical" />,
);
VerticalTabs.displayName = 'VerticalTabs';

export interface VerticalTabsListProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {
  /** Accessible name for the rail — always give it one. */
  'aria-label'?: string;
}

/** The rail that holds the tab rows (`role="tablist"`). */
export const VerticalTabsList = React.forwardRef<HTMLDivElement, VerticalTabsListProps>(
  (props, ref) => <List ref={ref} {...props} />,
);
VerticalTabsList.displayName = 'VerticalTabsList';

export interface VerticalTabsContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content> {
  /** Matches the `value` of the row that reveals this panel. */
  value: string;
}

/** A tab panel (`role="tabpanel"`), shown when its `value` is selected. */
export const VerticalTabsContent = React.forwardRef<HTMLDivElement, VerticalTabsContentProps>(
  (props, ref) => <Content ref={ref} {...props} />,
);
VerticalTabsContent.displayName = 'VerticalTabsContent';

export default VerticalTabs;
