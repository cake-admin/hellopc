import React from 'react';
import styled, { css } from 'styled-components';

/**
 * hello pc Table — Header Row (Figma `HeaderRow`, node 171:9834) and its Header
 * Cell (Figma `&table.header.items`, node 171:9838).
 *
 * The header row labels a table's columns. It mirrors `DataRow`'s three-part
 * frame — a fixed leading rail (aligning with the selection checkbox), a
 * flexible run of `HeaderCell`s, and a fixed trailing rail — so headers line up
 * exactly over the body below them. Column actions (sort, add, filter) are
 * existing **IconButton**s dropped into a cell's `actions` slot rather than a
 * bespoke control.
 *
 * Every value resolves from hello pc token custom properties, so the **Theme**
 * toolbar re-themes the header live. Rendered as ARIA grid semantics
 * (`role="row"` / `role="columnheader"`).
 */

/** Figma 171:9834 — header row/cell height is a fixed 48px, matching DataRow. */
const ROW_HEIGHT = 48;
const RAIL_WIDTH = 48;

const Root = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: ${RAIL_WIDTH}px minmax(0, 1fr) ${RAIL_WIDTH}px;
  width: 100%;
  background: var(--color-surfaces-container);
`;

/** Header cells carry a single bottom rule at the stronger `border` weight. */
const cellBase = css`
  box-sizing: border-box;
  min-height: ${ROW_HEIGHT}px;
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);
`;

/** Fixed leading/trailing rail — empty, but rendered so headers align to rows. */
const RailCell = styled.div`
  ${cellBase}
`;

const Slots = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
`;

const CellRoot = styled.div`
  ${cellBase}
  display: flex;
  flex: 1 0 0;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
  /* p-8 from Figma 171:9838 */
  padding: var(--space-100);
`;

const CellLabel = styled.span<{ $active: boolean }>`
  flex: 0 1 auto;
  min-width: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  /* Figma medium.14.body tracking; no token carries letter-spacing. */
  letter-spacing: 0.1px;
  line-height: 1.35;
  color: ${(p) =>
    p.$active ? 'var(--color-primary-primary)' : 'var(--color-text-icon-primary)'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/** Trailing action cluster (sort/add IconButtons); does not shrink the label. */
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
  flex-shrink: 0;
`;

export interface HeaderCellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column label text. */
  children?: React.ReactNode;
  /**
   * Emphasize the column as active/sorted — colors the label with the primary
   * token (Figma's primary-colored header variant).
   * @default false
   */
  active?: boolean;
  /**
   * Trailing column controls (sort, add, filter). Pass **IconButton**s
   * (`size="xs"`); they sit after the label and never squeeze it.
   */
  actions?: React.ReactNode;
}

/**
 * A single column header within a `HeaderRow`. Flexes to share the header
 * region evenly; `active` colors the label primary and `actions` hosts
 * `IconButton` column controls.
 */
export const HeaderCell = React.forwardRef<HTMLDivElement, HeaderCellProps>(
  ({ children, active = false, actions, ...props }, ref) => (
    <CellRoot ref={ref} role="columnheader" {...props}>
      <CellLabel $active={active}>{children}</CellLabel>
      {actions ? <Actions>{actions}</Actions> : null}
    </CellRoot>
  ),
);

HeaderCell.displayName = 'HeaderCell';

export interface HeaderRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The row's `HeaderCell`s — one per body column. */
  children?: React.ReactNode;
}

/**
 * A table header row: an empty leading rail (over the selection checkbox), a
 * flexible `HeaderCell` run, and an empty trailing rail (over the row action).
 * Compose it inside a table container that provides `role="table"` + a header
 * row group.
 */
export const HeaderRow = React.forwardRef<HTMLDivElement, HeaderRowProps>(
  ({ children, ...props }, ref) => (
    <Root role="row" {...props}>
      <RailCell role="columnheader" />
      <Slots>{children}</Slots>
      <RailCell role="columnheader" />
    </Root>
  ),
);

HeaderRow.displayName = 'HeaderRow';

export default HeaderRow;
