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
 * toolbar re-themes the header live. Rendered as native table markup — a
 * `<tr>` whose labels are `<th scope="col">` — with `aria-sort` on sortable
 * columns.
 */

/** Figma 171:9834 — header row/cell height is a fixed 48px, matching DataRow. */
const ROW_HEIGHT = 48;
const RAIL_WIDTH = 48;

const Root = styled.tr`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  background: var(--color-surfaces-container);
`;

/** Header cells carry a single bottom rule at the stronger `border` weight. */
const cellBase = css`
  box-sizing: border-box;
  text-align: start;
  min-height: ${ROW_HEIGHT}px;
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);
`;

/**
 * Fixed leading/trailing rail — empty, but rendered so headers align to rows.
 * A `<td>`, not a `<th>`: an empty header cell would announce as a nameless
 * column.
 */
const RailCell = styled.td`
  ${cellBase}
  flex: 0 0 ${RAIL_WIDTH}px;
  width: ${RAIL_WIDTH}px;
  padding: 0;
`;

const CellRoot = styled.th`
  ${cellBase}
  display: flex;
  flex: 1 0 0;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
  overflow: hidden;
  font-weight: inherit;
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

/** `aria-sort` values a sortable column can announce. */
export type HeaderCellSort = 'ascending' | 'descending' | 'none' | 'other';

export interface HeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Column label text. */
  children?: React.ReactNode;
  /**
   * Emphasize the column as active/sorted — colors the label with the primary
   * token (Figma's primary-colored header variant).
   * @default false
   */
  active?: boolean;
  /**
   * Sort direction of a sortable column, rendered as `aria-sort` on the
   * `<th>` so screen readers announce it. Set it on every sortable column
   * (`'none'` while unsorted); leave it off columns that cannot sort. Pair the
   * sorted column with `active` for the visual signal.
   */
  sort?: HeaderCellSort;
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
export const HeaderCell = React.forwardRef<HTMLTableCellElement, HeaderCellProps>(
  ({ children, active = false, sort, actions, ...props }, ref) => (
    <CellRoot ref={ref} scope="col" aria-sort={sort} {...props}>
      <CellLabel $active={active}>{children}</CellLabel>
      {actions ? <Actions>{actions}</Actions> : null}
    </CellRoot>
  ),
);

HeaderCell.displayName = 'HeaderCell';

export interface HeaderRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** The row's `HeaderCell`s — one per body column. */
  children?: React.ReactNode;
}

/**
 * A table header row: an empty leading rail (over the selection checkbox), a
 * flexible `HeaderCell` run, and an empty trailing rail (over the row action).
 * Renders a native `<tr>`; **Table** places it in the `<thead>`.
 */
export const HeaderRow = React.forwardRef<HTMLTableRowElement, HeaderRowProps>(
  ({ children, ...props }, ref) => (
    <Root ref={ref} {...props}>
      <RailCell />
      {children}
      <RailCell />
    </Root>
  ),
);

HeaderRow.displayName = 'HeaderRow';

export default HeaderRow;
