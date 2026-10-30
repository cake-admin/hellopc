import React from 'react';
import styled from 'styled-components';

import { Divider } from '../Elements/Divider';
import { useSidebarCollapsed } from './SidebarContext';

/**
 * hello pc sidebar section pieces (Figma ".elements/sidebar_sections", nodes
 * 160:9458 / 160:9430) — the two structural rows that break a sidebar rail into
 * groups.
 *
 * Figma models these as one component with a `type`; they're split into two
 * named exports here because they carry different padding and a named component
 * reads better at the call site than `type="divider"`.
 *
 * The divider reuses the existing `Divider` element (a Radix `Separator`)
 * rather than drawing its own rule.
 *
 * These mirror the vertical-tabs section pieces but are *not* the same: the
 * sidebar insets are larger (Figma 160:9458 vs 147:8635), so they're separate
 * rather than shared with a padding prop.
 */

/** Figma 160:9458 — the group label above a run of sidebar rows. */
const Header = styled.div`
  display: flex;
  align-items: flex-end;
  gap: var(--space-300);
  width: 100%;
  padding: var(--space-300) var(--space-300) var(--space-050);
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.2px;
  line-height: 1.35;
  white-space: nowrap;
`;

/** Figma 160:9430 — a full-width rule between groups, with its own inset. */
const DividerRow = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding: var(--space-300) var(--space-100);
`;

const Rule = styled(Divider)`
  width: 100%;
`;

export interface SidebarSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The group label, e.g. "Features". */
  children: React.ReactNode;
}

/**
 * A group label inside the rail.
 *
 * **Collapses to a rule.** In Figma's collapsed variants this slot renders a
 * divider instead of the label (node 160:9430 in place of 160:9458) — an 80px
 * rail has no room for a word, and a truncated "Feat…" is worse than a clean
 * separator. The grouping is still conveyed, just by the rule.
 *
 * Not a tab — and a `tablist` is specified to contain only tabs — so assistive
 * tech reads this as plain text rather than a group boundary. When the grouping
 * is semantically important, give each section its own `SidebarList` labelled by
 * a real heading instead.
 */
export const SidebarSectionHeader = React.forwardRef<HTMLDivElement, SidebarSectionHeaderProps>(
  ({ children, ...props }, ref) => {
    const collapsed = useSidebarCollapsed();

    if (collapsed) return <SidebarDivider ref={ref} {...props} />;

    return (
      <Header ref={ref} {...props}>
        {children}
      </Header>
    );
  },
);
SidebarSectionHeader.displayName = 'SidebarSectionHeader';

export type SidebarDividerProps = React.HTMLAttributes<HTMLDivElement>;

/** A rule between groups. Decorative, so it's hidden from assistive tech — the
 *  section labels and row names already convey the structure. */
export const SidebarDivider = React.forwardRef<HTMLDivElement, SidebarDividerProps>(
  (props, ref) => (
    <DividerRow ref={ref} {...props}>
      <Rule decorative weight="primary" />
    </DividerRow>
  ),
);
SidebarDivider.displayName = 'SidebarDivider';
