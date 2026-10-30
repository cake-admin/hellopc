import React from 'react';
import styled from 'styled-components';

import { Checkbox } from '../Checkbox/Checkbox';

/**
 * hello pc Table — Action Bar (Figma `ActionBar`, node 171:9796).
 *
 * The toolbar that sits above a table body. It leads with a select-all
 * **Checkbox** and then adapts to selection: with nothing selected it shows the
 * table's idle controls (`actions`, e.g. a refresh **IconButton**) and a
 * right-aligned `end` slot (a search **IconButton** that can expand into a
 * search **TextInput**); once rows are selected (`selected`) it swaps in bulk
 * actions (`selectedActions`, e.g. **Button**s for Label / Group / Delete) and
 * hides the idle `end` slot. It composes those existing controls rather than
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

/** Figma 171:9796 — the bar is a fixed 48px tall. Intrinsic geometry. */
const MIN_HEIGHT = 48;

const Root = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-500);
  width: 100%;
  min-height: ${MIN_HEIGHT}px;
  /* py-8 px-12 from Figma 171:9797 */
  padding: var(--space-100) var(--space-200);
  background: var(--color-surfaces-container);
`;

/** Leading cluster: the select-all checkbox + the active action set. */
const Leading = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
  flex-shrink: 0;
`;

/** Bulk actions run tighter together than they do from the checkbox. */
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
          selectedActions ? (
            <Actions>{selectedActions}</Actions>
          ) : null
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
