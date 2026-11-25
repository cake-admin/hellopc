import React from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { IconButton } from '../Button/IconButton';

/**
 * hello pc Table — Group Row (Figma `hellopc.table.row.group`, node 18237:263).
 *
 * The header row for a group of table rows (a request and its items, a device
 * and its components). A 32px chevron **IconButton** expands / collapses the
 * group; next to it sit a title over a meta line, an optional status **Badge**,
 * and — pushed to the trailing edge — one group-level action (**Button**
 * `size="sm"` secondary outline) and a "more" **IconButton**. The member rows
 * are ordinary **Data Row**s rendered after it while `expanded`.
 *
 * It is a native `<tr>` holding a single `<td>` that spans the table's columns
 * (`colSpan`), so the table keeps a valid grid. The toggle is a disclosure
 * button (`aria-expanded` + `aria-controls`), not a treegrid: the member rows
 * stay plain rows, so the table keeps normal reading/table navigation and needs
 * no roving-focus model. Every value resolves from hello pc token custom
 * properties, so the **Theme** toolbar re-themes the row live.
 *
 * Figma axes → props: `expanded` → `expanded` / `onExpandedChange`;
 * `showMeta` / `showStatus` / `showAction` / `showMore` → pass or omit the
 * `meta` / `status` / `action` / `more` slots.
 */

/** Figma 18237:263 — the group row is a fixed 56px tall. Intrinsic geometry. */
const ROW_HEIGHT = 56;

const Root = styled.tr`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  background: var(--color-surfaces-on-container-low);
  color: var(--color-text-icon-primary);
`;

const Cell = styled.td`
  box-sizing: border-box;
  display: flex;
  flex: 1 0 0;
  align-items: center;
  gap: var(--space-200);
  min-width: 0;
  min-height: ${ROW_HEIGHT}px;
  /* py-8 pl-8 pr-16 from Figma 18237:182 */
  padding: var(--space-100) var(--space-300) var(--space-100) var(--space-100);
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);
  text-align: start;
`;

/** Figma 18237:197 `title group` — title over meta, 2px apart. */
const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-025);
  min-width: 0;
  font-family: var(--font-family);
  line-height: 1.35;
`;

const Title = styled.span`
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  /* Figma medium.14.body tracking; no token carries letter-spacing. */
  letter-spacing: 0.1px;
  color: var(--color-text-icon-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.span`
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  /* Figma regular.12 tracking; no token carries letter-spacing. */
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Status = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`;

/** Figma `spacer` — pushes the action + more to the trailing edge. */
const Spacer = styled.span`
  flex: 1 0 0;
  min-width: 0;
`;

const Trailing = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-200);
  flex-shrink: 0;
`;

export interface GroupRowProps
  extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'title'> {
  /** Group title (Figma `title`), medium 14px. */
  title: React.ReactNode;
  /** Secondary line under the title (Figma `meta`), e.g. "Created 18 Mar 2025 · Due 12 Jun 2025". */
  meta?: React.ReactNode;
  /** Optional status — a **Badge** (Figma `showStatus`, e.g. amber "Draft"). */
  status?: React.ReactNode;
  /**
   * One group-level action — a **Button** `size="sm"` `intent="secondary"`
   * `variant="outline"` (Figma `showAction`).
   */
  action?: React.ReactNode;
  /** Trailing overflow control — a `size="sm"` ghost **IconButton** with a "more" glyph (Figma `showMore`). */
  more?: React.ReactNode;
  /**
   * Controlled expanded state (Figma `expanded`). Render the member rows only
   * while it is `true`. Pair with `onExpandedChange`.
   */
  expanded?: boolean;
  /** Uncontrolled initial expanded state. @default false */
  defaultExpanded?: boolean;
  /** Fires with the next state when the chevron toggles. */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Space-separated ids of the member rows this group shows / hides — set as
   * the toggle's `aria-controls`. Give each member `<DataRow id>` a stable id.
   */
  controls?: string;
  /**
   * Plain-text group name for the toggle's accessible name ("Expand …" /
   * "Collapse …"). Defaults to `title` when it is a string.
   */
  toggleLabel?: string;
  /**
   * Number of table columns the row's single cell spans (`<td colSpan>`).
   * Set it to the table's column count — cells plus the two rails — so
   * assistive tech sees one full-width cell.
   */
  colSpan?: number;
}

/**
 * A table group header: chevron toggle · title + meta · status · action ·
 * more. Renders a native `<tr>`; place it in a **Table** body above its member
 * **Data Row**s.
 */
export const GroupRow = React.forwardRef<HTMLTableRowElement, GroupRowProps>(
  (
    {
      title,
      meta,
      status,
      action,
      more,
      expanded,
      defaultExpanded = false,
      onExpandedChange,
      controls,
      toggleLabel,
      colSpan,
      ...props
    },
    ref,
  ) => {
    const [innerExpanded, setInnerExpanded] = React.useState(defaultExpanded);
    const isExpanded = expanded ?? innerExpanded;
    const name = toggleLabel ?? (typeof title === 'string' ? title : 'group');

    const toggle = () => {
      const next = !isExpanded;
      if (expanded === undefined) setInnerExpanded(next);
      onExpandedChange?.(next);
    };

    return (
      <Root ref={ref} data-state={isExpanded ? 'open' : 'closed'} {...props}>
        <Cell colSpan={colSpan}>
          <IconButton
            size="sm"
            variant="ghost"
            intent="secondary"
            label={`${isExpanded ? 'Collapse' : 'Expand'} ${name}`}
            icon={isExpanded ? <ChevronDown /> : <ChevronRight />}
            aria-expanded={isExpanded}
            aria-controls={controls}
            onClick={toggle}
          />
          <TitleGroup>
            <Title>{title}</Title>
            {meta != null ? <Meta>{meta}</Meta> : null}
          </TitleGroup>
          {status != null ? <Status>{status}</Status> : null}
          <Spacer />
          {action != null || more != null ? (
            <Trailing>
              {action}
              {more}
            </Trailing>
          ) : null}
        </Cell>
      </Root>
    );
  },
);

GroupRow.displayName = 'GroupRow';

export default GroupRow;
