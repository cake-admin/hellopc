import React from 'react';
import styled, { css } from 'styled-components';

import { Checkbox } from '../Checkbox/Checkbox';

/**
 * hello pc Table — Data Row (Figma `DataRow`, node 171:9843) and its Data Cell
 * (Figma `&table cell` / `TableCell`, node 171:9755).
 *
 * A data row is one record in a table body: a fixed leading rail holding a
 * selection `Checkbox`, a flexible run of `DataCell`s (the record's columns),
 * and a fixed trailing rail for a row action (an info icon, an overflow menu…).
 * It composes the hello pc **Checkbox** rather than re-drawing one, and its cells
 * hold arbitrary content — plain text or existing pills like **Chip** / **Badge**.
 *
 * The Figma `state` axis (default stripe / inverse stripe / hover / selected /
 * disabled) maps to props + CSS: `stripe` for zebra banding, `selected` for the
 * tonal highlight + checked box, hover lift on every non-disabled non-selected
 * row, and the `disabled` prop. Every value resolves from hello pc token custom properties,
 * so the **Theme** toolbar re-themes rows live.
 *
 * Rendered as ARIA grid rows/cells (`role="row"` / `role="gridcell"`) so it can
 * compose into a table container that supplies `role="table"` + `rowgroup`.
 */

/**
 * Figma 171:9843 — the row height and the fixed leading/trailing rail width are
 * both 48px (the cell hit-area). Intrinsic component geometry, not a token.
 */
const ROW_HEIGHT = 48;
const RAIL_WIDTH = 48;

type Stripe = 'default' | 'inverse';

/** state → row background token (see hellopc-vars.css). */
const STRIPE_BACKGROUND: Record<Stripe, string> = {
  default: 'var(--color-surfaces-container)',
  inverse: 'var(--color-surfaces-on-container-high)',
};

const Root = styled.div<{
  $stripe: Stripe;
  $selected: boolean;
  $disabled: boolean;
  $interactive: boolean;
}>`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: ${RAIL_WIDTH}px minmax(0, 1fr) ${RAIL_WIDTH}px;
  width: 100%;
  background: ${(p) => STRIPE_BACKGROUND[p.$stripe]};
  transition: background-color 120ms ease, box-shadow 120ms ease;

  ${(p) =>
    !p.$disabled && !p.$selected
      ? css`
          &:hover {
            background: var(--color-surfaces-on-container);
            box-shadow: var(--elevation-0);
          }
        `
      : ''}

  ${(p) =>
    p.$interactive && !p.$disabled
      ? css`
          cursor: pointer;
        `
      : ''}

  ${(p) =>
    p.$selected && !p.$disabled
      ? css`
          background: var(--color-tonal-tonal-lightest);
        `
      : ''}

  ${(p) =>
    p.$disabled
      ? css`
          background: var(--color-disabled-disabled);
          color: var(--color-disabled-disabled-inverse);
          cursor: not-allowed;
        `
      : ''}
`;

/** Shared cell chrome: 48px tall, top+bottom low-emphasis rule, token padding. */
const cellBase = css`
  box-sizing: border-box;
  min-height: ${ROW_HEIGHT}px;
  border-top: var(--stroke-100) solid var(--color-stroke-border-low);
  border-bottom: var(--stroke-100) solid var(--color-stroke-border-low);
`;

/** Fixed leading/trailing rail cell — centers a checkbox or row action. */
const RailCell = styled.div`
  ${cellBase}
  display: flex;
  align-items: center;
  justify-content: center;
  /* py-10 px-8 from Figma 171:9845 */
  padding: var(--space-150) var(--space-100);
`;

/** Middle region: a clipped flex run that lays the DataCells out edge to edge. */
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
  min-width: 0;
  /* py-10 px-8 from Figma 171:9757 */
  padding: var(--space-150) var(--space-100);
`;

/** Text content — 14px regular, truncates to a single ellipsized line. */
const CellText = styled.span`
  flex: 1 0 0;
  min-width: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  /* Figma regular.14.body letter-spacing; no token carries tracking. */
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface DataCellProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Cell content. A plain string is rendered as truncating 14px body text
   * (Figma `type=text`); pass a **Chip**, **Badge**, or any node for richer
   * cells (Figma `type=chip` / `tag` / `badge`).
   */
  children?: React.ReactNode;
}

/**
 * A single column within a `DataRow`. Flexes to share the middle region evenly
 * with its siblings and clips overflow. Strings become ellipsized body text;
 * any other node (a `Chip`, a `Badge`, an avatar…) is placed as-is.
 */
export const DataCell = React.forwardRef<HTMLDivElement, DataCellProps>(
  ({ children, ...props }, ref) => (
    <CellRoot ref={ref} role="gridcell" {...props}>
      {typeof children === 'string' ? <CellText>{children}</CellText> : children}
    </CellRoot>
  ),
);

DataCell.displayName = 'DataCell';

export interface DataRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The row's `DataCell`s — the record's columns. */
  children?: React.ReactNode;
  /**
   * Zebra banding (Figma `state=default stripe` / `inverse stripe`). Alternate
   * it per row (`index % 2`) for striped tables.
   * @default 'default'
   */
  stripe?: Stripe;
  /**
   * Selected row (Figma `state=selected`): a tonal highlight with the leading
   * checkbox checked. Pair with `onSelectedChange`.
   * @default false
   */
  selected?: boolean;
  /**
   * Dims the row and blocks interaction, including the checkbox (Figma
   * `state=disabled`).
   * @default false
   */
  disabled?: boolean;
  /**
   * Adds a pointer cursor for rows that navigate or open a detail on click.
   * Pair with `onClick`. Hover lift (Figma `state=hover`) is applied to every
   * non-disabled, non-selected row regardless of this flag.
   * @default false
   */
  interactive?: boolean;
  /**
   * Render the leading selection checkbox. Set `false` for a read-only table;
   * the rail column stays so rows still align with the header.
   * @default true
   */
  selectable?: boolean;
  /** Fired when the leading checkbox toggles. */
  onSelectedChange?: (selected: boolean) => void;
  /**
   * Accessible name for the row's selection checkbox.
   * @default 'Select row'
   */
  checkboxLabel?: string;
  /**
   * Trailing rail content — a row action such as an info icon or an overflow
   * menu. The rail column renders even when omitted, to keep header alignment.
   */
  action?: React.ReactNode;
}

/**
 * A table body row: leading selection checkbox · flexible `DataCell` run ·
 * trailing action. Compose it inside a table container that provides
 * `role="table"` and row groups.
 */
export const DataRow = React.forwardRef<HTMLDivElement, DataRowProps>(
  (
    {
      children,
      stripe = 'default',
      selected = false,
      disabled = false,
      interactive = false,
      selectable = true,
      onSelectedChange,
      checkboxLabel = 'Select row',
      action,
      ...props
    },
    ref,
  ) => (
    <Root
      ref={ref}
      role="row"
      aria-selected={selectable ? selected : undefined}
      aria-disabled={disabled || undefined}
      $stripe={stripe}
      $selected={selected}
      $disabled={disabled}
      $interactive={interactive}
      {...props}
    >
      <RailCell role="gridcell">
        {selectable ? (
          <Checkbox
            aria-label={checkboxLabel}
            checked={!disabled && selected}
            disabled={disabled}
            onCheckedChange={(next) => onSelectedChange?.(next === true)}
          />
        ) : null}
      </RailCell>

      <Slots>{children}</Slots>

      <RailCell role="gridcell">{action}</RailCell>
    </Root>
  ),
);

DataRow.displayName = 'DataRow';

export default DataRow;
