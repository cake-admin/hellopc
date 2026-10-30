import React from 'react';
import styled from 'styled-components';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';

import { IconButton } from '../Button/IconButton';
import { MenuContainer } from '../Menu/MenuContainer';
import { MenuItem } from '../Menu/MenuItem';

/**
 * hello pc Breadcrumb — the trail showing where the current page sits in the
 * hierarchy (Figma "Breadcrumb", node 134:7943). Figma ships two styles:
 * `simple` (the whole trail inline) and `complex` (the middle of a long trail
 * collapsed behind a "…" overflow menu) — here that's one component, driven by
 * `maxItems`.
 *
 * No Radix primitive covers a breadcrumb trail, so the trail itself is the
 * correct semantic markup — a `<nav aria-label>` landmark wrapping an ordered
 * list, with the last crumb marked `aria-current="page"`. The overflow menu is
 * where behavior is needed, and that *is* Radix: a `DropdownMenu` composing the
 * existing hello pc pieces rather than rebuilding them — `IconButton` as the
 * trigger, `MenuContainer` as the surface, and `MenuItem` for each hidden
 * crumb. Styled entirely from hello pc token custom properties, which mirror the
 * Figma variables and re-theme via `[data-theme]`.
 */

const Nav = styled.nav`
  font-family: var(--font-family);
`;

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-075);
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: inline-flex;
  align-items: center;
`;

/** The separator chevron — decorative, so it's hidden from assistive tech. */
const Separator = styled.li`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--color-text-icon-primary);

  svg {
    width: 24px;
    height: 24px;
  }
`;

/** Shared crumb typography (Figma `&breadcrumb.link`). */
const crumbType = `
  padding: var(--space-050) 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  white-space: nowrap;
  border-radius: var(--radius-50);
`;

const CrumbLink = styled.a`
  ${crumbType}
  color: var(--color-text-icon-secondary);
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

/** A crumb with no destination — same type, no affordance. */
const CrumbText = styled.span`
  ${crumbType}
  color: var(--color-text-icon-secondary);
`;

/** The final crumb: the current page, in the primary accent per Figma. */
const CurrentCrumb = styled.span`
  ${crumbType}
  color: var(--color-primary-primary);
`;

export interface BreadcrumbItem {
  /** Visible crumb label. */
  label: React.ReactNode;
  /** Destination. Omit for a crumb that isn't navigable. */
  href?: string;
  /** Activation handler — use for router-driven navigation. */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface BreadcrumbProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The trail, root first. The **last** item is the current page. */
  items: BreadcrumbItem[];
  /**
   * Collapse the middle of the trail behind a "…" overflow menu once the trail
   * is longer than this (Figma `style=complex`). Leave unset for the full
   * inline trail (`style=simple`).
   */
  maxItems?: number;
  /** How many leading crumbs stay visible when collapsed. @default 1 */
  itemsBeforeCollapse?: number;
  /** How many trailing crumbs stay visible when collapsed. @default 2 */
  itemsAfterCollapse?: number;
  /** Accessible name for the nav landmark. @default 'Breadcrumb' */
  label?: string;
  /** Accessible name for the overflow control. @default 'Show hidden breadcrumbs' */
  overflowLabel?: string;
}

/** Renders one crumb: link, plain text, or the current page. */
const renderCrumb = (item: BreadcrumbItem, isCurrent: boolean) => {
  if (isCurrent) {
    return <CurrentCrumb aria-current="page">{item.label}</CurrentCrumb>;
  }
  if (item.href || item.onClick) {
    return (
      <CrumbLink href={item.href} onClick={item.onClick}>
        {item.label}
      </CrumbLink>
    );
  }
  return <CrumbText>{item.label}</CrumbText>;
};

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      maxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 2,
      label = 'Breadcrumb',
      overflowLabel = 'Show hidden breadcrumbs',
      ...props
    },
    ref,
  ) => {
    const lastIndex = items.length - 1;

    /* Radix returns focus to the trigger when the menu closes. That's right for
       Escape — keyboard users need focus back — but when the menu is dismissed
       by clicking the page, the restored focus inherits the :focus-visible
       state from the menu item it came from and paints a focus ring nobody
       asked for. Track pointer dismissals and skip the restore for those only. */
    const dismissedByPointer = React.useRef(false);

    /* Collapse only when it actually hides something — otherwise the overflow
       control would open an empty menu. */
    const hidden =
      maxItems !== undefined && items.length > maxItems
        ? items.slice(itemsBeforeCollapse, Math.max(itemsBeforeCollapse, items.length - itemsAfterCollapse))
        : [];
    const collapsed = hidden.length > 0;

    const leading = collapsed ? items.slice(0, itemsBeforeCollapse) : items;
    const trailing = collapsed ? items.slice(items.length - itemsAfterCollapse) : [];

    /* Build the crumb cells first, then interleave separators between them. */
    const cells: React.ReactNode[] = [];

    leading.forEach((item, i) => {
      cells.push(<Item key={`lead-${i}`}>{renderCrumb(item, !collapsed && i === lastIndex)}</Item>);
    });

    if (collapsed) {
      cells.push(
        <Item key="overflow">
          <RadixDropdownMenu.Root>
            <RadixDropdownMenu.Trigger asChild>
              <IconButton
                label={overflowLabel}
                icon={<MoreHorizontal />}
                size="xs"
                intent="secondary"
                variant="ghost"
              />
            </RadixDropdownMenu.Trigger>
            <RadixDropdownMenu.Portal>
              <RadixDropdownMenu.Content
                asChild
                sideOffset={8}
                align="start"
                onPointerDownOutside={() => {
                  dismissedByPointer.current = true;
                }}
                onCloseAutoFocus={(event) => {
                  if (dismissedByPointer.current) event.preventDefault();
                  dismissedByPointer.current = false;
                }}
              >
                <MenuContainer width="max-content">
                  {hidden.map((item, i) => (
                    <RadixDropdownMenu.Item asChild key={`hidden-${i}`}>
                      <MenuItem
                        showLeftSlot={false}
                        showRightSlot={false}
                        onClick={item.onClick as React.MouseEventHandler<HTMLButtonElement>}
                      >
                        {item.label}
                      </MenuItem>
                    </RadixDropdownMenu.Item>
                  ))}
                </MenuContainer>
              </RadixDropdownMenu.Content>
            </RadixDropdownMenu.Portal>
          </RadixDropdownMenu.Root>
        </Item>,
      );

      trailing.forEach((item, i) => {
        const index = items.length - trailing.length + i;
        cells.push(<Item key={`trail-${i}`}>{renderCrumb(item, index === lastIndex)}</Item>);
      });
    }

    return (
      <Nav ref={ref} aria-label={label} {...props}>
        <List>
          {cells.map((cell, i) => (
            <React.Fragment key={i}>
              {i > 0 ? (
                <Separator aria-hidden role="presentation">
                  <ChevronRight />
                </Separator>
              ) : null}
              {cell}
            </React.Fragment>
          ))}
        </List>
      </Nav>
    );
  },
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
