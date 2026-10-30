import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';

import { IconButton } from '../Button/IconButton';
import { MenuContainer } from '../Menu/MenuContainer';
import { MenuItem } from '../Menu/MenuItem';
import { NumberDropdown } from '../NumberDropdown/NumberDropdown';

/**
 * hello pc Pagination — page navigation for a table or list (Figma "page select",
 * node 134:8294). Figma ships four styles; they collapse into two props here:
 *
 * - `simple` → `variant="numbers"` with no `maxPageButtons` (every page shown)
 * - `complex (no menu)` / `complex (with menu)` → `variant="numbers"` with
 *   `maxPageButtons` set, so the middle collapses into a "…" menu
 * - `dropdown` → `variant="dropdown"` (a NumberDropdown + "of N pages")
 *
 * Follows the established pagination accessibility pattern rather than forcing a
 * primitive that doesn't exist: a `<nav aria-label>` landmark wrapping a list,
 * with the current page marked `aria-current="page"`. Radix owns the parts that
 * need real behavior — the "…" overflow is a `DropdownMenu`, and the dropdown
 * style is the Radix-`Select`-backed `NumberDropdown`.
 *
 * Composes what already exists instead of rebuilding it: **IconButton** for
 * every nav control and the "…" trigger, **MenuContainer** + **MenuItem** for
 * the overflow menu (which brings the hello pc Scrollbar with it), and
 * **NumberDropdown** for the dropdown style.
 */

/* Figma 134:8303 intrinsic page-button geometry: a 40px-tall pill with a 39px
   minimum width, so single digits stay circular and wider numbers grow. */
const PAGE_BUTTON_SIZE = 40;
const PAGE_BUTTON_MIN_WIDTH = 39;

const Nav = styled.nav`
  font-family: var(--font-family);
`;

const Row = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-075);
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Cell = styled.li`
  display: inline-flex;
  align-items: center;
`;

/**
 * A page number. Deliberately *not* the shared Button: hello pc's ghost/secondary
 * Button carries a permanent underline (it reads as a link, per WCAG 1.4.1),
 * which is wrong on a numeric pager, and Button has no "current page" state.
 * The tokens below are the same ones Button uses, so it stays in the system.
 */
const PageButton = styled.button<{ $current: boolean }>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  appearance: none;
  height: ${PAGE_BUTTON_SIZE}px;
  min-width: ${PAGE_BUTTON_MIN_WIDTH}px;
  padding: 0 var(--space-100);
  border: none;
  border-radius: var(--radius-1000);
  background: ${(p) => (p.$current ? 'var(--color-secondary-secondary-overlay)' : 'transparent')};
  color: var(--color-surfaces-inverse-container);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.2px;
  line-height: 1.35;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover:not(:disabled) {
    background: var(--color-secondary-secondary-overlay-hover);
  }
  &:active:not(:disabled) {
    background: var(--color-tonal-tonal-secondary-overlay-press);
  }
  &:disabled {
    cursor: not-allowed;
    color: var(--color-disabled-disabled-inverse);
  }

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

const Meta = styled.span`
  display: inline-flex;
  align-items: center;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  white-space: nowrap;
`;

const DropdownGroup = styled.li`
  display: inline-flex;
  align-items: center;
  gap: var(--space-300);
`;

export type PaginationVariant = 'numbers' | 'dropdown';

/** One rendered slot in the pager: a page, or a collapsed run of pages. */
type PageCell = { type: 'page'; page: number } | { type: 'ellipsis'; pages: number[] };

/**
 * Decide which pages get their own button. Always keeps the first, last, and
 * current page, then grows a window outwards from the current page until the
 * budget is spent; whatever is left over collapses into "…" runs.
 */
export const buildPageCells = (count: number, current: number, max?: number): PageCell[] => {
  const all = Array.from({ length: count }, (_, i) => i + 1);
  if (!max || count <= max) return all.map((page) => ({ type: 'page', page }));

  const visible = new Set<number>([1, count, current]);
  for (let d = 1; visible.size < max && d < count; d += 1) {
    if (current - d >= 1) visible.add(current - d);
    if (visible.size < max && current + d <= count) visible.add(current + d);
  }

  const sorted = [...visible].sort((a, b) => a - b);
  const cells: PageCell[] = [];
  sorted.forEach((page, i) => {
    const prev = sorted[i - 1];
    if (i > 0 && page - prev > 1) {
      cells.push({
        type: 'ellipsis',
        pages: Array.from({ length: page - prev - 1 }, (_, k) => prev + 1 + k),
      });
    }
    cells.push({ type: 'page', page });
  });
  return cells;
};

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Total number of pages. */
  count: number;
  /** Controlled current page (1-based). */
  page?: number;
  /** Uncontrolled initial page (1-based). @default 1 */
  defaultPage?: number;
  /** Fires with the new page whenever the user navigates. */
  onPageChange?: (page: number) => void;
  /**
   * `numbers` renders a button per page (Figma simple/complex); `dropdown`
   * renders a NumberDropdown + "of N pages" (Figma dropdown).
   * @default 'numbers'
   */
  variant?: PaginationVariant;
  /**
   * Maximum page buttons before the middle collapses behind a "…" menu (Figma
   * `complex`). Omit to render every page (Figma `simple`).
   */
  maxPageButtons?: number;
  /** Renders the jump-to-first / jump-to-last controls. @default true */
  showFirstLast?: boolean;
  /** Accessible name for the nav landmark. @default 'Pagination' */
  label?: string;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      count,
      page,
      defaultPage = 1,
      onPageChange,
      variant = 'numbers',
      maxPageButtons,
      showFirstLast = true,
      label = 'Pagination',
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultPage);
    const current = Math.min(Math.max(page ?? uncontrolled, 1), Math.max(count, 1));

    /* Same dismissal handling as Breadcrumb: Radix restores focus to the
       trigger on close, which is right for Escape but paints an unwanted focus
       ring when the user simply clicked away. */
    const dismissedByPointer = React.useRef(false);

    const goTo = (next: number) => {
      const clamped = Math.min(Math.max(next, 1), count);
      if (clamped === current) return;
      if (page === undefined) setUncontrolled(clamped);
      onPageChange?.(clamped);
    };

    const navButton = (
      key: string,
      icon: React.ReactNode,
      buttonLabel: string,
      target: number,
      disabled: boolean,
    ) => (
      <Cell key={key}>
        <IconButton
          label={buttonLabel}
          icon={icon}
          size="sm"
          intent="secondary"
          variant="ghost"
          disabled={disabled}
          onClick={() => goTo(target)}
        />
      </Cell>
    );

    const atStart = current <= 1;
    const atEnd = current >= count;

    return (
      <Nav ref={ref} aria-label={label} {...props}>
        <Row>
          {showFirstLast
            ? navButton('first', <ChevronsLeft />, 'Go to first page', 1, atStart)
            : null}
          {navButton('prev', <ChevronLeft />, 'Go to previous page', current - 1, atStart)}

          {variant === 'dropdown' ? (
            <DropdownGroup>
              <NumberDropdown
                aria-label="Page"
                options={Array.from({ length: count }, (_, i) => i + 1)}
                value={current}
                onValueChange={goTo}
              />
              <Meta>of {count} pages</Meta>
            </DropdownGroup>
          ) : (
            buildPageCells(count, current, maxPageButtons).map((cell) =>
              cell.type === 'page' ? (
                <Cell key={`page-${cell.page}`}>
                  <PageButton
                    type="button"
                    $current={cell.page === current}
                    aria-current={cell.page === current ? 'page' : undefined}
                    aria-label={`Go to page ${cell.page}`}
                    onClick={() => goTo(cell.page)}
                  >
                    {cell.page}
                  </PageButton>
                </Cell>
              ) : (
                <Cell key={`gap-${cell.pages[0]}`}>
                  <RadixDropdownMenu.Root>
                    <RadixDropdownMenu.Trigger asChild>
                      <IconButton
                        label={`Show pages ${cell.pages[0]} to ${cell.pages[cell.pages.length - 1]}`}
                        icon={<MoreHorizontal />}
                        size="md"
                        intent="secondary"
                        variant="ghost"
                      />
                    </RadixDropdownMenu.Trigger>
                    <RadixDropdownMenu.Portal>
                      <RadixDropdownMenu.Content
                        asChild
                        sideOffset={8}
                        align="center"
                        onPointerDownOutside={() => {
                          dismissedByPointer.current = true;
                        }}
                        onCloseAutoFocus={(event) => {
                          if (dismissedByPointer.current) event.preventDefault();
                          dismissedByPointer.current = false;
                        }}
                      >
                        <MenuContainer width="max-content" maxHeight={200} style={{ minWidth: 80 }}>
                          {cell.pages.map((p) => (
                            <RadixDropdownMenu.Item asChild key={p}>
                              <MenuItem
                                showLeftSlot={false}
                                showRightSlot={false}
                                selected={p === current}
                                onClick={() => goTo(p)}
                              >
                                {p}
                              </MenuItem>
                            </RadixDropdownMenu.Item>
                          ))}
                        </MenuContainer>
                      </RadixDropdownMenu.Content>
                    </RadixDropdownMenu.Portal>
                  </RadixDropdownMenu.Root>
                </Cell>
              ),
            )
          )}

          {navButton('next', <ChevronRight />, 'Go to next page', current + 1, atEnd)}
          {showFirstLast ? navButton('last', <ChevronsRight />, 'Go to last page', count, atEnd) : null}
        </Row>
      </Nav>
    );
  },
);

Pagination.displayName = 'Pagination';

export default Pagination;
