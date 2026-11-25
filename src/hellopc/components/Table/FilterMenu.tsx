import React from 'react';
import styled from 'styled-components';

import { Button } from '../Button/Button';
import { Divider } from '../Elements/Divider';
import { MenuItem } from '../Menu/MenuItem';
import { TextInput } from '../TextInput/TextInput';
import { nativeScrollbarStyles } from '../Elements/Scrollbar';
import { FilterPopover, FilterTrigger } from './FilterPopover';

/**
 * hello pc Table — Filter Menu (Figma `hellopc.table.filter.menu`, node 18259:2253).
 *
 * The multi-select menu behind one filter button in the **Filter Bar** (e.g.
 * "OS type"). Its trigger is a `size="sm"` **Button** — outline until the
 * filter is applied, then tonal and reading "OS type: 2 selected" (or the value
 * itself when exactly one is picked). The 280px panel holds a search
 * **TextInput**, a "Select all" row that goes indeterminate when some values
 * are picked, one checkbox **MenuItem** per value with its count, and a footer
 * ("2 of 6 selected") with Clear and Done **Button**s.
 *
 * Changes are a draft: they apply on **Done**; Esc or an outside click cancels
 * and restores the applied selection (Figma: "Changes apply on Done; Esc
 * cancels"). Behavior is Radix `Popover` (see `FilterPopover`). Every value
 * resolves from hello pc token custom properties.
 */

/** Figma 18259:2253 — the menu is a fixed 280px wide. */
const MENU_WIDTH = 280;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  /* py-8 from Figma 18259:1703 */
  padding: var(--space-100) 0;
`;

/** Figma `search` — px-12 py-8. */
const Search = styled.div`
  padding: var(--space-100) var(--space-200);
`;

const Options = styled.div<{ $maxHeight?: number | string }>`
  display: flex;
  flex-direction: column;
  ${(p) =>
    p.$maxHeight != null
      ? `
    overflow-y: auto;
    ${nativeScrollbarStyles}
  `
      : ''}
`;

/** Figma 18259:1784 — counts are regular 12 in the primary text color. */
const Count = styled.span`
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  /* Figma regular.12 tracking; no token carries letter-spacing. */
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  white-space: nowrap;
`;

const Empty = styled.p`
  margin: 0;
  padding: var(--space-100) var(--space-200);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
`;

/** Figma `footer` — px-12 py-8, gap-8. */
const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  padding: var(--space-100) var(--space-200);
`;

const Summary = styled.span`
  flex: 1 0 0;
  min-width: 0;
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  white-space: nowrap;
`;

export interface FilterMenuOption {
  /** Stable value reported through `onValueChange`. */
  value: string;
  /** Visible label. */
  label: string;
  /** Record count shown at the row's trailing edge. */
  count?: number | string;
}

export interface FilterMenuProps {
  /** The filter's name — the trigger text and the panel's accessible name (e.g. "OS type"). */
  label: string;
  /** One checkbox row per value. */
  options: FilterMenuOption[];
  /** Controlled applied selection (option values). */
  value?: string[];
  /** Uncontrolled initial applied selection. @default [] */
  defaultValue?: string[];
  /** Fires with the new selection when the user presses **Done**. */
  onValueChange?: (value: string[]) => void;
  /** Search field placeholder. @default `Search ${label}` */
  searchPlaceholder?: string;
  /** Controlled open state of the panel. */
  open?: boolean;
  /** Fires when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Caps the option list height and scrolls it; omit to show every option. */
  maxListHeight?: number | string;
}

/**
 * A filter-bar button that opens a searchable multi-select menu with
 * select-all, per-value counts, and Clear / Done.
 */
export function FilterMenu({
  label,
  options,
  value,
  defaultValue = [],
  onValueChange,
  searchPlaceholder,
  open: openProp,
  onOpenChange,
  maxListHeight,
}: FilterMenuProps) {
  const [innerValue, setInnerValue] = React.useState<string[]>(defaultValue);
  const applied = value ?? innerValue;

  const [innerOpen, setInnerOpen] = React.useState(false);
  const open = openProp ?? innerOpen;

  const [draft, setDraft] = React.useState<string[]>(applied);
  const [query, setQuery] = React.useState('');

  const setOpen = (next: boolean) => {
    if (next) {
      // Every opening starts from the applied selection; closing discards the draft.
      setDraft(applied);
      setQuery('');
    }
    if (openProp === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  // A controlled `open` can turn true without going through setOpen; reseed on
  // every closed → open transition so Done never applies a stale draft.
  const wasOpen = React.useRef(open);
  React.useLayoutEffect(() => {
    if (open && !wasOpen.current) {
      setDraft(applied);
      setQuery('');
    }
    wasOpen.current = open;
  });

  const q = query.trim().toLowerCase();
  const visible = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  const visibleChecked = visible.filter((o) => draft.includes(o.value)).length;
  const selectAll: boolean | 'indeterminate' =
    visible.length > 0 && visibleChecked === visible.length
      ? true
      : visibleChecked > 0
        ? 'indeterminate'
        : false;

  const toggle = (v: string, checked: boolean) =>
    setDraft((d) => (checked ? (d.includes(v) ? d : [...d, v]) : d.filter((x) => x !== v)));

  const toggleAll = () => {
    const ids = visible.map((o) => o.value);
    setDraft((d) =>
      selectAll === true ? d.filter((x) => !ids.includes(x)) : Array.from(new Set([...d, ...ids])),
    );
  };

  const done = () => {
    // Keep the option order, whatever order the boxes were ticked in.
    const next = options.map((o) => o.value).filter((v) => draft.includes(v));
    if (value === undefined) setInnerValue(next);
    onValueChange?.(next);
    setOpen(false);
  };

  const triggerText =
    applied.length === 0
      ? label
      : applied.length === 1
        ? `${label}: ${options.find((o) => o.value === applied[0])?.label ?? applied[0]}`
        : `${label}: ${applied.length} selected`;

  return (
    <FilterPopover
      open={open}
      onOpenChange={setOpen}
      label={`${label} filter`}
      width={MENU_WIDTH}
      renderTrigger={(p) => (
        <FilterTrigger applied={applied.length > 0} {...p}>
          {triggerText}
        </FilterTrigger>
      )}
    >
      <Panel>
        <Search>
          <TextInput
            size="sm"
            aria-label={`Search ${label}`}
            placeholder={searchPlaceholder ?? `Search ${label}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Search>

        {visible.length > 0 ? (
          <>
            <MenuItem
              showCheckbox
              toggleRow
              showLeftSlot={false}
              showRightSlot={false}
              checked={selectAll}
              onCheckedChange={toggleAll}
            >
              Select all
            </MenuItem>
            <Divider weight="weak" decorative />
            <Options
              role="group"
              aria-label={`${label} values`}
              $maxHeight={maxListHeight}
              style={maxListHeight != null ? { maxHeight: maxListHeight } : undefined}
            >
              {visible.map((o) => (
                <MenuItem
                  key={o.value}
                  showCheckbox
                  toggleRow
                  showLeftSlot={false}
                  showRightSlot={o.count != null}
                  rightSlot={o.count != null ? <Count>{o.count}</Count> : undefined}
                  aria-label={o.count != null ? `${o.label}, ${o.count}` : undefined}
                  checked={draft.includes(o.value)}
                  onCheckedChange={(c) => toggle(o.value, c)}
                >
                  {o.label}
                </MenuItem>
              ))}
            </Options>
          </>
        ) : (
          <Empty role="status">No matches</Empty>
        )}

        <Divider weight="weak" decorative />
        <Footer>
          <Summary role="status">
            {draft.length === 0
              ? 'None selected'
              : `${draft.length} of ${options.length} selected`}
          </Summary>
          <Button
            size="sm"
            intent="secondary"
            variant="ghost"
            disabled={draft.length === 0}
            onClick={() => setDraft([])}
          >
            Clear
          </Button>
          <Button size="sm" intent="primary" variant="fill" onClick={done}>
            Done
          </Button>
        </Footer>
      </Panel>
    </FilterPopover>
  );
}

FilterMenu.displayName = 'FilterMenu';

export default FilterMenu;
