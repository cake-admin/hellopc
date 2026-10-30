import React from 'react';
import styled, { css } from 'styled-components';
import { Check, RefreshCw } from 'lucide-react';

import { Checkbox } from '../Checkbox/Checkbox';

/**
 * hello pc MenuItem — a selectable menu row (Figma "Menu Items", node 82:4577),
 * with the Figma sub-item treatment from node 82:4634 exposed through
 * `variant="sub-item"`.
 *
 * A standalone menu row cannot safely render Radix DropdownMenu.Item outside
 * a Radix menu root, so this component uses a native button. It retains
 * keyboard activation, disabled semantics, and menuitem/menuitemcheckbox roles
 * while staying composable in menu, list, and navigation parents.
 *
 * The optional checkbox reuses the hello pc Checkbox component. It remains a
 * sibling of the row action instead of being nested in a button, avoiding
 * invalid nested interactive controls.
 */

/** Figma nodes 82:4577 / 82:4634 intrinsic row and slot geometry. */
const ROW_HEIGHT = 36;
const SLOT_SIZE = 16;

export type MenuItemVariant = 'item' | 'sub-item';

const Row = styled.div<{ $variant: MenuItemVariant; $selected: boolean; $disabled: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-100);
  width: 100%;
  min-height: ${ROW_HEIGHT}px;
  padding: var(--space-100);
  border-radius: var(--radius-200);
  background: ${(p) =>
    p.$disabled
      ? 'var(--color-disabled-disabled)'
      : p.$selected
        ? 'var(--color-tonal-tonal-overlay)'
        : 'transparent'};
  transition: background 120ms ease;

  ${(p) =>
    p.$variant === 'sub-item' &&
    css`
      padding-left: var(--space-500);
    `}

  ${(p) =>
    !p.$disabled &&
    css`
      /* \`:has\` picks up Radix's highlight: inside a DropdownMenu/ContextMenu the
         primitive marks the active item with data-highlighted (pointer hover and
         arrow-key navigation alike), and that background is the affordance —
         see the matching outline suppression on Action. */
      &:hover,
      &:has(> button[data-highlighted]) {
        background: ${p.$selected
          ? 'var(--color-tonal-tonal-overlay-hover)'
          : 'var(--color-tonal-tonal-secondary-overlay-hover)'};
      }

      &:active {
        background: ${p.$selected
          ? 'var(--color-tonal-tonal-overlay-press)'
          : 'var(--color-tonal-tonal-secondary-overlay-press)'};
      }
    `}
`;

const Action = styled.button<{ $selected: boolean; $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  flex: 1;
  min-width: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: ${(p) =>
    p.$disabled
      ? 'var(--color-disabled-disabled-inverse)'
      : p.$selected
        ? 'var(--color-text-icon-on-tonal)'
        : 'var(--color-secondary-secondary)'};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: ${(p) => (p.$selected ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)')};
  line-height: 1.35;
  text-align: left;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
    border-radius: var(--radius-100);
  }

  /* Inside a Radix menu the primitive owns the active row: it sets
     data-highlighted and moves DOM focus to the item on *pointer hover* as well
     as arrow-key navigation, which would otherwise paint a keyboard focus ring
     just for hovering. There the row highlight (see Row) is the affordance, so
     drop the ring. Standalone MenuItems are unaffected — nothing sets
     data-highlighted outside a Radix menu, so Tab still shows the ring. */
  &[data-highlighted],
  &[data-highlighted]:focus-visible {
    outline: none;
  }
`;

const Slot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${SLOT_SIZE}px;
  height: ${SLOT_SIZE}px;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const Label = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface MenuItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  /** Visible row label. */
  children: React.ReactNode;
  /** Figma `Menu Items` row or its indented `Menu Subitems` variation. @default 'item' */
  variant?: MenuItemVariant;
  /** Applies the Figma primary-tonal selected treatment. @default false */
  selected?: boolean;
  /** Disables the action and dims all row content. @default false */
  disabled?: boolean;
  /** Shows the 16px leading slot. @default true */
  showLeftSlot?: boolean;
  /** Decorative leading content; defaults to the Figma refresh glyph. */
  leftSlot?: React.ReactNode;
  /** Shows the 16px trailing slot. @default true */
  showRightSlot?: boolean;
  /** Decorative trailing content; defaults to the Figma check glyph. */
  rightSlot?: React.ReactNode;
  /**
   * Shows the reusable 24px Checkbox before the row action. This is only
   * available on the top-level `item` variation, matching Figma.
   * @default false
   */
  showCheckbox?: boolean;
  /** Controlled state for the optional Checkbox. */
  checked?: boolean;
  /** Uncontrolled initial state for the optional Checkbox. @default false */
  defaultChecked?: boolean;
  /** Fires with the next optional Checkbox value. */
  onCheckedChange?: (checked: boolean) => void;
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    {
      children,
      variant = 'item',
      selected = false,
      disabled = false,
      showLeftSlot = true,
      leftSlot,
      showRightSlot = true,
      rightSlot,
      showCheckbox = false,
      checked,
      defaultChecked = false,
      onCheckedChange,
      onClick,
      ...props
    },
    ref,
  ) => {
    const checkboxVisible = variant === 'item' && showCheckbox;
    const checkboxName = typeof children === 'string' ? children : 'Menu item';

    return (
      <Row $variant={variant} $selected={selected} $disabled={disabled}>
        {checkboxVisible ? (
          <Checkbox
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            aria-label={`Select ${checkboxName}`}
            onCheckedChange={(next) => onCheckedChange?.(next === true)}
          />
        ) : null}
        <Action
          ref={ref}
          type="button"
          $selected={selected}
          $disabled={disabled}
          disabled={disabled}
          role="menuitem"
          aria-current={selected ? 'true' : undefined}
          onClick={onClick}
          {...props}
        >
          {showLeftSlot ? <Slot aria-hidden>{leftSlot ?? <RefreshCw />}</Slot> : null}
          <Label>{children}</Label>
          {showRightSlot ? <Slot aria-hidden>{rightSlot ?? <Check />}</Slot> : null}
        </Action>
      </Row>
    );
  },
);

MenuItem.displayName = 'MenuItem';
