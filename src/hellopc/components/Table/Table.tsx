import React from 'react';
import styled from 'styled-components';

import { Pagination } from '../Pagination/Pagination';
import { nativeScrollbarStyles } from '../Elements/Scrollbar';

/**
 * hello pc Table — the assembled data table (Figma `table templates`, node
 * 178:10143). It stacks the table parts into one surface: an **Action Bar** on
 * top, a **Header Row** over a scrollable body of **Data Row**s, and a
 * **Table Footer** (a results range + **Pagination**) at the bottom.
 *
 * Table is a composition shell, not a data grid: it owns the frame, the ARIA
 * `role="table"` grouping, and body scrolling — the rows, cells, selection, and
 * paging are the parts you pass in, each already token-styled and accessible.
 * Every value resolves from hello pc token custom properties, so the **Theme**
 * toolbar re-themes the whole table live.
 *
 * The Figma `state` axis (default / hover / select / select all) is expressed by
 * the parts themselves — a Data Row's hover lift and `selected`, and
 * the Action Bar's `selected` bulk-action mode — not by Table variants.
 */

/** Figma 178:10143 — the table surface is a 4px-rounded card. */
const Root = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  isolation: isolate;
  width: 100%;
  border-radius: var(--radius-50);
  overflow: hidden;
  background: var(--color-surfaces-container);
  font-family: var(--font-family);
`;

/** The ARIA table itself — only rowgroups/rows live here (bar + footer are outside). */
const Grid = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

/** Header rowgroup — sits above the scroll region, so it stays put as rows scroll. */
const HeaderGroup = styled.div`
  position: relative;
  z-index: 1;
`;

/**
 * Body rowgroup. When `maxHeight` is set it becomes a vertical scroll container,
 * carrying the hello pc native scrollbar look (`nativeScrollbarStyles`) — the rows
 * stay direct children so the `role="rowgroup"` → `role="row"` ownership the
 * table semantics need is never broken by an intervening ScrollArea wrapper.
 */
const Body = styled.div<{ $scroll: boolean }>`
  display: flex;
  flex-direction: column;
  ${(p) =>
    p.$scroll
      ? `
    overflow-y: auto;
    ${nativeScrollbarStyles}
  `
      : ''}
`;

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Body rows — the **Data Row**s of the table. */
  children?: React.ReactNode;
  /** Top toolbar — an **Action Bar**. Rendered above the grid. */
  actionBar?: React.ReactNode;
  /**
   * Column header — a **Header Row**. Rendered in its own header rowgroup above
   * the scrollable body, so it stays fixed while the body scrolls.
   */
  header?: React.ReactNode;
  /** Bottom footer — a **Table Footer** (range + **Pagination**), or any node. */
  footer?: React.ReactNode;
  /**
   * Caps the body height and turns it into a vertical scroll region with the
   * hello pc scrollbar. Omit for a table that grows to its content.
   */
  maxBodyHeight?: number | string;
  /**
   * Accessible name for the table grid (`role="table"`). Provide this or
   * `aria-labelledby`.
   */
  'aria-label'?: string;
  /** ID of an element labelling the table grid. */
  'aria-labelledby'?: string;
}

/**
 * The assembled table surface: Action Bar · Header Row · scrollable Data Row
 * body · Table Footer. Compose the parts as slots; Table frames them and
 * supplies the table semantics.
 */
export const Table = React.forwardRef<HTMLDivElement, TableProps>(
  (
    {
      children,
      actionBar,
      header,
      footer,
      maxBodyHeight,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const scroll = maxBodyHeight != null;
    return (
      <Root ref={ref} {...props}>
        {actionBar}
        <Grid role="table" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
          {header ? <HeaderGroup role="rowgroup">{header}</HeaderGroup> : null}
          <Body
            role="rowgroup"
            $scroll={scroll}
            style={scroll ? { maxHeight: maxBodyHeight } : undefined}
          >
            {children}
          </Body>
        </Grid>
        {footer}
      </Root>
    );
  },
);

Table.displayName = 'Table';

const FooterRoot = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-500);
  width: 100%;
  /* p-8 from Figma 178:10140 */
  padding: var(--space-100);
  background: var(--color-surfaces-container);
`;

const Range = styled.p`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  /* Figma regular.14.body tracking; no token carries letter-spacing. */
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  white-space: nowrap;
`;

export interface TableFooterProps {
  /** Current page, 1-based. */
  page: number;
  /** Rows shown per page — drives both the range and the page count. */
  pageSize: number;
  /** Total number of rows across all pages. */
  total: number;
  /** Fires with the new page whenever the pager navigates. */
  onPageChange?: (page: number) => void;
  /**
   * Forwarded to **Pagination**: collapse the middle behind a "…" menu once the
   * page count exceeds this. Omit to render every page.
   */
  maxPageButtons?: number;
  /** Accessible name for the pager landmark. @default 'Table pages' */
  paginationLabel?: string;
}

/**
 * The table's footer: a "start–end of total" results range beside the hello pc
 * **Pagination** control. Computes the range and page count from `page` /
 * `pageSize` / `total`, so you drive it from the same paging state as the body.
 */
export const TableFooter = React.forwardRef<HTMLDivElement, TableFooterProps>(
  ({ page, pageSize, total, onPageChange, maxPageButtons, paginationLabel = 'Table pages' }, ref) => {
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);

    return (
      <FooterRoot ref={ref}>
        <Range>
          {start}–{end} of {total}
        </Range>
        <Pagination
          count={pageCount}
          page={page}
          onPageChange={onPageChange}
          maxPageButtons={maxPageButtons}
          label={paginationLabel}
        />
      </FooterRoot>
    );
  },
);

TableFooter.displayName = 'TableFooter';

export default Table;
