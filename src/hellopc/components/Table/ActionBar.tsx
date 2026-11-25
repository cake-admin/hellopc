import React from 'react';
import styled from 'styled-components';

import { Checkbox } from '../Checkbox/Checkbox';

/**
 * hello pc Table — Action Bar (Figma `hellopc.table.action.bar`, node 5794:5776;
 * originally 171:9796).
 *
 * The toolbar that sits above a table body. It leads with a select-all
 * **Checkbox** and then adapts to selection: with nothing selected it shows the
 * table's idle controls (`actions`, e.g. a refresh **IconButton**) and a
 * right-aligned `end` slot (a search **IconButton** that can expand into a
 * search **TextInput**); once rows are selected (`selected`) it shows the
 * selection count (`selectionLabel`, "3 selected") followed by bulk actions
 * (`selectedActions`, e.g. **Button**s for Label / Group / Delete) and hides
 * the idle `end` slot. It composes those existing controls rather than
 * re-drawing any.
 *
 * Every color, spacing, and type value resolves from hello pc token custom
 * properties, so the **Theme** toolbar re-themes the bar live.
 *
 * There is no Radix primitive that fits: Radix `Toolbar` imposes roving
 * arrow-key focus, which is wrong for a bar that hosts a search text input
 * (arrows must reach the caret). So — like **Pagination** — this follows the
 * toolbar accessibility pattern directly (`role="toolbar"` + `aria-label`) and
 * lets each composed control keep its own Radix/native behavior and Tab order.
 */

/** Figma 5794:5776 — the bar is a fixed 48px tall. Intrinsic geometry. */
const MIN_HEIGHT = 48;

const Root = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  /* gap-48 between the leading cluster and the trailing slot (Figma 5794:5777) */
  gap: var(--space-800);
  width: 100%;
  min-height: ${MIN_HEIGHT}px;
  /* py-8 px-12 from Figma 5794:5777 */
  padding: var(--space-100) var(--space-200);
  background: var(--color-surfaces-container);
`;

/** Leading cluster: the select-all checkbox, the selection count, the active action set. */
const Leading = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
  flex-shrink: 0;
`;

/** Figma 19533:22192 — "3 selected", medium.14.body. */
const SelectionLabel = styled.span`
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  /* Figma medium.14.body tracking; no token carries letter-spacing. */
  letter-spacing: 0.1px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  white-space: nowrap;
`;

/** Bulk actions (Figma 5907:9054 `Actions`, gap-16). */
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
`;

/** Right region: grows to push its content to the trailing edge. */
const End = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
`;

export interface ActionBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Select-all checkbox state. Use `'indeterminate'` when only some rows are
   * selected (Figma `state=selected`), `true` for all, `false` for none.
   * @default false
   */
  checked?: boolean | 'indeterminate';
  /** Fired with the next state when the select-all checkbox toggles. */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  /**
   * Accessible name for the select-all checkbox.
   * @default 'Select all rows'
   */
  checkboxLabel?: string;
  /**
   * Selection mode. When `true`, `selectedActions` replace `actions` and the
   * idle `end` slot is hidden (Figma `state=selected`). Drive it from "are any
   * rows selected".
   * @default false
   */
  selected?: boolean;
  /**
   * Idle table controls shown after the checkbox when nothing is selected —
   * typically a refresh **IconButton**. Hidden in selection mode.
   */
  actions?: React.ReactNode;
  /**
   * Bulk actions shown in place of `actions` when `selected` — typically
   * **Button**s (Action ▾ / Label / Group / Delete).
   */
  selectedActions?: React.ReactNode;
  /**
   * Selection count shown between the checkbox and the bulk actions in
   * selection mode — e.g. `"3 selected"` (Figma `selectedCount`). Rendered as
   * a polite live region so count changes are announced. Hidden when nothing
   * is selected.
   */
  selectionLabel?: React.ReactNode;
  /**
   * Trailing slot: a search **IconButton**, or an expanded search
   * **TextInput** (Figma `state=search expanded`). Hidden in selection mode.
   */
  end?: React.ReactNode;
  /**
   * Accessible name for the toolbar landmark.
   * @default 'Table actions'
   */
  'aria-label'?: string;
}

/**
 * A table's top toolbar: select-all checkbox · idle actions / bulk actions ·
 * trailing search. Place it above a **Header Row** + **Data Row** body.
 */
export const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  (
    {
      checked = false,
      onCheckedChange,
      checkboxLabel = 'Select all rows',
      selected = false,
      actions,
      selectedActions,
      selectionLabel,
      end,
      'aria-label': ariaLabel = 'Table actions',
      ...props
    },
    ref,
  ) => (
    <Root ref={ref} role="toolbar" aria-label={ariaLabel} {...props}>
      <Leading>
        <Checkbox
          aria-label={checkboxLabel}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        {selected ? (
          <>
            {selectionLabel != null ? (
              <SelectionLabel role="status">{selectionLabel}</SelectionLabel>
            ) : null}
            {selectedActions ? <Actions>{selectedActions}</Actions> : null}
          </>
        ) : (
          actions
        )}
      </Leading>

      <End>{selected ? null : end}</End>
    </Root>
  ),
);

ActionBar.displayName = 'ActionBar';

export default ActionBar;
