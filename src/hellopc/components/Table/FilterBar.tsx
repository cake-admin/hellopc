import React from 'react';
import styled from 'styled-components';

import { Button } from '../Button/Button';
import { Divider } from '../Elements/Divider';

/**
 * hello pc Table — Filter Bar (Figma `hellopc.table.filter.bar`, node 18225:394).
 *
 * The bar that sits above a table, below the **Action Bar**. It is a layout
 * shell with slots — every control in it is an existing hello pc piece:
 *
 * - `layout="full"`: saved-view **Button** · vertical **Divider** · one
 *   **Filter Menu** per common filter (outline → tonal + value once applied) ·
 *   "Advanced filters" (**Filter Rule Builder**, with a rule **Counter**) ·
 *   spacer · optional search **TextInput**, sort **Button**, icon-only
 *   **ContentSwitcher** · Reset all.
 * - `layout="compact"` (the former `hellopc.toolbar`, for small tables and
 *   cards): one "Filters" **Filter Rule Builder** pill with a count · sort ·
 *   spacer · search · view switcher · Reset all.
 *
 * Reset all is a primary ghost **Button**, disabled while nothing is applied
 * (`resetDisabled`); `onResetAll` should clear *everything* the bar controls —
 * every filter menu, every rule, and the search. Every value resolves from
 * hello pc token custom properties.
 */

/** Figma 18225:394 — the bar is a fixed 48px tall; the view divider is 24px. */
const MIN_HEIGHT = 48;
const DIVIDER_HEIGHT = 24;

const Root = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-100);
  width: 100%;
  min-height: ${MIN_HEIGHT}px;
  /* py-8 px-16 from Figma 18225:314; Figma's bottom stroke sits inside the 48px
     frame, so the bottom padding gives up one stroke width. */
  padding: var(--space-100) var(--space-300) calc(var(--space-100) - var(--stroke-100));
  background: var(--color-surfaces-container);
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);
  font-family: var(--font-family);
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  flex-shrink: 0;
`;

/**
 * Figma `filters` — the per-filter buttons. Not clipped (Figma clips): clipping
 * would cut the buttons' focus rings; keep the filter count to what fits.
 */
const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const DividerSlot = styled.div`
  display: flex;
  height: ${DIVIDER_HEIGHT}px;
  flex-shrink: 0;
`;

const Spacer = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

export type FilterBarLayout = 'full' | 'compact';

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * `full` — saved view, one button per filter, Advanced filters, Reset all
   * (optional search / sort / view switcher). `compact` — one Filters button,
   * sort, search, view switcher, Reset all — for small tables and cards.
   * @default 'full'
   */
  layout?: FilterBarLayout;
  /**
   * Saved-view picker — a `size="sm"` secondary outline **Button** with a
   * bookmark icon and chevron (Figma `showSavedViews`). `full` only; a divider
   * follows it.
   */
  savedView?: React.ReactNode;
  /**
   * The filters: **Filter Menu**s in `full`; in `compact`, one **Filter Rule
   * Builder** with `triggerAppearance="filter"` ("Filters" + count).
   */
  filters?: React.ReactNode;
  /** "Advanced filters" — a **Filter Rule Builder** (`scope="advanced"`). `full` only. */
  advancedFilters?: React.ReactNode;
  /** Optional search — a `size="sm"` **TextInput**, ~240px wide. */
  search?: React.ReactNode;
  /** Optional sort control — e.g. a secondary ghost "Sort: Last used" **Button**. */
  sort?: React.ReactNode;
  /** Optional view switcher — an icon-only `size="sm"` secondary **ContentSwitcher**. */
  viewSwitcher?: React.ReactNode;
  /**
   * Fires when Reset all is pressed. Clear everything the bar controls —
   * filters, rules, and search. Omit to hide Reset all.
   */
  onResetAll?: () => void;
  /**
   * Disables Reset all — set it while nothing is applied (Figma
   * `state=default`).
   * @default false
   */
  resetDisabled?: boolean;
  /** Reset button text. @default 'Reset all' */
  resetLabel?: string;
  /** Accessible name for the bar. @default 'Table filters' */
  'aria-label'?: string;
}

/**
 * The filter bar above a table: filters on the left, search / sort / view on
 * the right, Reset all at the end. Hosts **Filter Menu** and **Filter Rule
 * Builder** popovers in its slots.
 */
export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      layout = 'full',
      savedView,
      filters,
      advancedFilters,
      search,
      sort,
      viewSwitcher,
      onResetAll,
      resetDisabled = false,
      resetLabel = 'Reset all',
      'aria-label': ariaLabel = 'Table filters',
      ...props
    },
    ref,
  ) => {
    const full = layout === 'full';
    return (
      <Root ref={ref} role="toolbar" aria-label={ariaLabel} data-layout={layout} {...props}>
        {full && savedView ? (
          <>
            <Group>{savedView}</Group>
            <DividerSlot>
              <Divider direction="vertical" />
            </DividerSlot>
          </>
        ) : null}
        {filters ? <Filters>{filters}</Filters> : null}
        {full && advancedFilters ? <Group>{advancedFilters}</Group> : null}
        {!full && sort ? <Group>{sort}</Group> : null}
        <Spacer />
        {search ? <Group>{search}</Group> : null}
        {full && sort ? <Group>{sort}</Group> : null}
        {viewSwitcher ? <Group>{viewSwitcher}</Group> : null}
        {onResetAll ? (
          <Button
            size="sm"
            intent="primary"
            variant="ghost"
            disabled={resetDisabled}
            onClick={onResetAll}
          >
            {resetLabel}
          </Button>
        ) : null}
      </Root>
    );
  },
);

FilterBar.displayName = 'FilterBar';

export default FilterBar;
