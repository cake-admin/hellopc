import React from 'react';
import styled from 'styled-components';

import { Divider } from '../Elements/Divider';

/**
 * hello pc vertical-tab section pieces (Figma ".elements/vert_tab_sections", node
 * 147:8635) — the two structural rows that break a long rail into groups.
 *
 * Figma models these as one component with a `type` of "section header" or
 * "divider". They're split into two named exports here because they carry
 * different padding and serve different purposes, and a named component reads
 * better at the call site than `type="divider"`.
 *
 * The divider reuses the existing `Divider` element (a Radix `Separator`)
 * rather than drawing its own rule.
 */

/** Figma 147:8635 — the group label above a run of tab rows. */
const Header = styled.div`
  display: flex;
  align-items: flex-end;
  gap: var(--space-300);
  width: 100%;
  padding: var(--space-100) var(--space-300) var(--space-050);
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.2px;
  line-height: 1.35;
  white-space: nowrap;
`;

/** Figma 147:8638 — a full-width rule between groups, with its own inset. */
const DividerRow = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding: var(--space-100) var(--space-100) var(--space-300);
`;

const Rule = styled(Divider)`
  width: 100%;
`;

export interface VerticalTabsSectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The group label, e.g. "General" or "Settings". */
  children: React.ReactNode;
}

/**
 * A group label inside the rail.
 *
 * Note this is not a tab, and a `tablist` is specified to contain only tabs —
 * so the label is visual grouping that assistive tech reads as plain text, not
 * as a group boundary. When the grouping is semantically important, give each
 * section its own `VerticalTabsList` labelled by a real heading instead (see
 * the Vertical Tabs docs).
 */
export const VerticalTabsSectionHeader = React.forwardRef<
  HTMLDivElement,
  VerticalTabsSectionHeaderProps
>(({ children, ...props }, ref) => (
  <Header ref={ref} {...props}>
    {children}
  </Header>
));
VerticalTabsSectionHeader.displayName = 'VerticalTabsSectionHeader';

export type VerticalTabsDividerProps = React.HTMLAttributes<HTMLDivElement>;

/** A rule between groups. Purely decorative, so it's hidden from assistive tech
 *  — the section labels and tab names already convey the structure. */
export const VerticalTabsDivider = React.forwardRef<HTMLDivElement, VerticalTabsDividerProps>(
  (props, ref) => (
    <DividerRow ref={ref} {...props}>
      <Rule decorative weight="primary" />
    </DividerRow>
  ),
);
VerticalTabsDivider.displayName = 'VerticalTabsDivider';
