import React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

import { Button } from '../Button/Button';
import { Counter } from '../Counter/Counter';

/**
 * Shared plumbing for the Table filter popovers (**Filter Menu**, **Filter Rule
 * Builder**) and their trigger buttons in the **Filter Bar**.
 *
 * Behavior is Radix `Popover` (portal, collision handling, focus moved into
 * the panel on open, Esc / outside-click dismiss). The trigger is a real hello pc
 * **Button** wrapped in `Popover.Anchor` — not `Popover.Trigger`, which would
 * have to render a second `<button>` or use `asChild` — so this file wires the
 * trigger's `aria-haspopup` / `aria-expanded` / `aria-controls` and returns
 * focus to it on close, exactly like **DateInput**'s calendar.
 */

/** Figma 18259:2253 / 18224:820 — popover surface: 1px border, 8px radius, elevation 3. */
const Content = styled(RadixPopover.Content)`
  box-sizing: border-box;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  max-width: calc(100vw - var(--space-300));
  background: var(--color-surfaces-container);
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-150);
  box-shadow: var(--elevation-3);
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  outline: none;
`;

const AnchorWrap = styled(RadixPopover.Anchor)`
  display: inline-flex;
`;

/** Props a trigger receives from `FilterPopover` — spread them onto the Button. */
export interface FilterPopoverTriggerProps {
  ref: React.Ref<HTMLButtonElement>;
  onClick: () => void;
  'aria-haspopup': 'dialog';
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
}

export interface FilterPopoverProps {
  /** Controlled open state. */
  open: boolean;
  /** Fires when the popover asks to open or close (trigger click, Esc, outside click). */
  onOpenChange: (open: boolean) => void;
  /** Renders the trigger; spread the given props onto a **Button**. */
  renderTrigger: (props: FilterPopoverTriggerProps) => React.ReactNode;
  /** Accessible name of the dialog panel. */
  label: string;
  /** Panel width (Figma fixes it per component). */
  width: number | string;
  /** Panel content. */
  children: React.ReactNode;
  /** Horizontal alignment against the trigger. @default 'start' */
  align?: 'start' | 'center' | 'end';
}

/** Internal: the anchored, dialog-semantics popover used by the filter pieces. */
export function FilterPopover({
  open,
  onOpenChange,
  renderTrigger,
  label,
  width,
  children,
  align = 'start',
}: FilterPopoverProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentId = React.useId();

  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange} modal>
      <AnchorWrap>
        {renderTrigger({
          ref: triggerRef,
          onClick: () => onOpenChange(!open),
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
          'aria-controls': open ? contentId : undefined,
        })}
      </AnchorWrap>
      <RadixPopover.Portal>
        <Content
          id={contentId}
          aria-label={label}
          side="bottom"
          align={align}
          sideOffset={4}
          collisionPadding={8}
          style={{ width }}
          onInteractOutside={(event) => {
            const target = event.detail.originalEvent.target as Element | null;
            if (!target) return;
            // A click on the trigger toggles it itself; don't also dismiss here.
            if (triggerRef.current?.contains(target)) {
              event.preventDefault();
              return;
            }
            // Controls inside the panel (the rule builder's Dropdowns = Radix
            // Select) portal their menus to <body>, outside this content. Picking
            // an option there is an interaction *with* the panel, so it must not
            // dismiss it (which would discard the draft without Apply).
            if (
              typeof target.closest === 'function' &&
              target.closest('[data-radix-popper-content-wrapper], [role="listbox"]')
            ) {
              event.preventDefault();
            }
          }}
          onCloseAutoFocus={(event) => {
            // Anchor (not Trigger) means Radix has no trigger to refocus — do it.
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          {children}
        </Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}

const TriggerLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
`;

export type FilterTriggerAppearance = 'filter' | 'link';

export interface FilterTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Button text — the filter name, or "Name: value" once applied. */
  children: React.ReactNode;
  /**
   * A filter is applied: `filter` triggers switch from outline to tonal (Figma
   * filter bar `state=applied`).
   * @default false
   */
  applied?: boolean;
  /**
   * `filter` — secondary outline/tonal pill with a chevron (one per filter);
   * `link` — primary ghost, for "Advanced filters".
   * @default 'filter'
   */
  appearance?: FilterTriggerAppearance;
  /** Leading 16px icon (e.g. a filter glyph). */
  startIcon?: React.ReactNode;
  /** Active-rule count shown as a **Counter** after the label. */
  count?: number;
  /** Show the trailing chevron. @default true for `filter`, false for `link` */
  chevron?: boolean;
}

/**
 * A filter-bar trigger button: a `size="sm"` **Button** that reads as outline
 * until its filter is applied, then tonal — with an optional **Counter**.
 */
export const FilterTrigger = React.forwardRef<HTMLButtonElement, FilterTriggerProps>(
  (
    { children, applied = false, appearance = 'filter', startIcon, count, chevron, ...props },
    ref,
  ) => {
    const isFilter = appearance === 'filter';
    const showChevron = chevron ?? isFilter;
    return (
      <Button
        ref={ref}
        type="button"
        size="sm"
        intent={isFilter ? 'secondary' : 'primary'}
        variant={isFilter ? (applied ? 'tonal' : 'outline') : 'ghost'}
        underline={false}
        startIcon={startIcon}
        endIcon={showChevron ? <ChevronDown /> : undefined}
        {...props}
      >
        <TriggerLabel>
          {children}
          {count != null && count > 0 ? <Counter count={count} /> : null}
        </TriggerLabel>
      </Button>
    );
  },
);

FilterTrigger.displayName = 'FilterTrigger';
