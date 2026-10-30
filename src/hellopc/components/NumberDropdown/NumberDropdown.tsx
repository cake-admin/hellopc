import React from 'react';
import { Select as RadixSelect } from 'radix-ui';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

import { InputLabel } from '../Elements/InputLabel';
import { HelperString, type HelperTone } from '../Elements/HelperString';
import { nativeScrollbarStyles } from '../Elements/Scrollbar';

/**
 * hello pc NumberDropdown — a compact, numeric-only select (Figma
 * "NumberDropdown", node 67:4660) for small closed numeric ranges (page
 * size, quantity caps, pagination counts). Composed from the reusable form
 * elements — `InputLabel` above and `HelperString` below (neither shown in
 * this Figma frame, included for consistency with `Dropdown`/`TextInput`) —
 * and built on the Radix `Select` primitive, same as `Dropdown`: Radix owns
 * behavior + accessibility, hello pc owns the visuals.
 *
 * Unlike `Dropdown`, this field is intrinsically **narrow** (hugs its digit
 * content, capped at Figma's 240px) rather than filling its container, and
 * the menu shows a **persistent selected highlight** (not just hover) since
 * picking a number is a quick glance-and-confirm interaction.
 *
 * Every color/spacing/radius/stroke value resolves from the hello pc token
 * custom properties, whose names mirror the Figma variables 1:1 and re-theme
 * via `[data-theme]`.
 *
 * State model:
 *  - default (no value): `--color-surfaces-on-container-high` fill,
 *    `--color-stroke-border` hairline; hover raises it to `--color-stroke-border-high`.
 *  - open (`data-state=open`): white `--color-surfaces-container` fill with a
 *    `--stroke-150` `--color-primary-primary` border; the arrow flips up.
 *  - has value (closed, chosen): `--color-stroke-border-high` border, primary text
 *    (extrapolated from `Dropdown`'s "finish selecting" state — not exported
 *    for this component, but kept consistent across the family).
 *  - disabled: flat `--color-disabled-disabled` fill, no border (also
 *    extrapolated — no disabled row was exported for this component).
 *
 * Deviations from Figma (design corrections, verified against tokens.json):
 *  - Menu item text is spec'd as raw "Segoe UI" in Figma (a legacy asset not
 *    migrated to Rookery) — corrected to `--font-family` per the devkit's
 *    "Rookery New only" rule.
 *  - The selected item's "Semibold" (600) weight has no matching token (only
 *    `--font-weight-medium` 500 / `--font-weight-bold` 700 exist); using
 *    `--font-weight-medium`, the closer of the two.
 */

/** Trigger height + arrow slot size per size (Figma 40pt/24px, 32pt/18px). */
const TRIGGER_HEIGHT = { md: 40, sm: 32 } as const;
const ARROW_SIZE = { md: 24, sm: 18 } as const;
/** Compact field widths per Figma: 80pt for md, 64pt for sm. */
const FIELD_WIDTH = { md: 80, sm: 64 } as const;
/** Menu item row height (Figma "menu items", 36pt). */
const ITEM_HEIGHT = 36;

export interface NumberDropdownOption {
  /** The numeric value. Also used as the visible label unless overridden. */
  value: number;
  /** Visible text for the option (defaults to `String(value)`). */
  label?: string;
  /** Dims and blocks selection of this single option. @default false */
  disabled?: boolean;
}

const Root = styled.div<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  flex-direction: column;
  gap: var(--space-050);
  width: ${(p) => FIELD_WIDTH[p.$size]}px;
  max-width: 240px;
  font-family: var(--font-family);
`;

/** Label + trigger group (tighter than the helper gap, per the Figma stack). */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
`;

const Trigger = styled(RadixSelect.Trigger)<{ $size: 'sm' | 'md' }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-100);
  width: 100%;
  height: ${(p) => TRIGGER_HEIGHT[p.$size]}px;
  padding: 0 var(--space-200);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container-high);
  border: var(--stroke-100) solid var(--color-stroke-border);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
  cursor: pointer;
  outline: none;
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease;

  &:hover:not([data-state='open']):not(:disabled) {
    border-color: var(--color-stroke-border-high);
  }

  /* Has a chosen value: keeps the greyish surface with the darker hairline. */
  &[data-has-value='true']:not([data-state='open']) {
    border-color: var(--color-stroke-border-high);
  }

  /* Open: white surface + 1.5px primary border. */
  &[data-state='open'] {
    background: var(--color-surfaces-container);
    border: var(--stroke-150) solid var(--color-primary-primary);
  }

  &:focus-visible {
    border: var(--stroke-150) solid var(--color-primary-primary);
  }

  &:disabled {
    background: var(--color-disabled-disabled);
    border-color: transparent;
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }

  /* Same HCT trigger affordance as Dropdown — collapsed stroke tokens. */
  :root[data-theme='win hct'] &:hover:not([data-state='open']):not(:disabled),
  [data-theme='win hct'] &:hover:not([data-state='open']):not(:disabled) {
    background: var(--color-surfaces-inverse-container);
    border-color: var(--color-primary-primary);
    color: var(--color-text-icon-inverse);
  }

  :root[data-theme='win hct'] &[data-state='open'],
  [data-theme='win hct'] &[data-state='open'] {
    background: var(--color-surfaces-inverse-container);
    color: var(--color-text-icon-inverse);
  }
`;

/** Value slot — inherits trigger ink; placeholder stays placeholder-colored. */
const Value = styled(RadixSelect.Value)`
  flex: 1;
  min-width: 0;
  padding: 0 var(--space-100);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  line-height: 1.35;
  color: inherit;

  &[data-placeholder],
  ${Trigger}:not([data-has-value='true']) & {
    color: var(--color-text-icon-placeholder);
  }

  ${Trigger}:disabled & {
    color: var(--color-disabled-disabled-inverse);
  }

  :root[data-theme='win hct'] ${Trigger}:hover:not([data-state='open']):not(:disabled) &,
  [data-theme='win hct'] ${Trigger}:hover:not([data-state='open']):not(:disabled) &,
  :root[data-theme='win hct'] ${Trigger}[data-state='open'] &,
  [data-theme='win hct'] ${Trigger}[data-state='open'] & {
    color: inherit;
  }
`;

/** Arrow, sized per trigger size; pinned to the trailing edge; flips while open. */
const Arrow = styled(RadixSelect.Icon)<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: auto;
  width: ${(p) => ARROW_SIZE[p.$size]}px;
  height: ${(p) => ARROW_SIZE[p.$size]}px;
  color: currentColor;
  transition: transform 150ms ease;

  ${Trigger}[data-state='open'] & {
    transform: rotate(180deg);
  }

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const Content = styled(RadixSelect.Content)`
  z-index: 1;
  width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
  background: var(--color-surfaces-container);
  border-radius: var(--radius-200);
  box-shadow: var(--elevation-3);
  overflow: hidden;

  :root[data-theme='win hct'] &,
  [data-theme='win hct'] & {
    border: var(--stroke-100) solid var(--color-stroke-border);
    box-shadow: none;
  }
`;

const Viewport = styled(RadixSelect.Viewport)`
  padding: var(--space-050);
  display: flex;
  flex-direction: column;
  gap: var(--space-025);

  /* Native-overflow scrollbar shared with the Scrollbar element, so Radix
     Select's own viewport matches every other hello pc scrollbar. */
  ${nativeScrollbarStyles}
`;

const Item = styled(RadixSelect.Item)`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-100);
  width: 100%;
  min-height: ${ITEM_HEIGHT}px;
  padding: var(--space-100);
  border-radius: var(--radius-50);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.35;
  color: var(--color-text-icon-secondary);
  cursor: pointer;
  outline: none;
  user-select: none;

  /* Highlighted (pointer/keyboard hover) — not shown in this Figma frame,
     added for consistency with Dropdown's item interaction feedback. */
  &[data-highlighted] {
    background: var(--color-tonal-tonal-secondary-overlay-hover);
    color: var(--color-text-icon-on-tonal-secondary);
  }

  /* Current selection — a persistent primary-tonal wash, per the Figma menu
     screenshot (item "2" highlighted while closed/idle). */
  &[data-state='checked'] {
    background: var(--color-tonal-tonal-overlay);
    color: var(--color-text-icon-on-tonal);
    font-weight: var(--font-weight-medium);
  }

  /* HCT: secondary-overlay hover is solid white (good); keep inverse text. */
  :root[data-theme='win hct'] &[data-highlighted],
  [data-theme='win hct'] &[data-highlighted] {
    background: var(--color-surfaces-inverse-container);
    color: var(--color-text-icon-inverse);
  }

  &[data-disabled] {
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export interface NumberDropdownProps {
  /** Label text above the field (renders an `InputLabel`, wired via `htmlFor`). */
  label?: string;
  /** Shows the label's 16px info icon. @default false */
  showLabelInfo?: boolean;
  /**
   * Marks the field required: appends the label's "(required)" suffix and sets
   * the Radix `required` flag.
   * @default false
   */
  required?: boolean;
  /** Helper text below the field (renders a `HelperString`, wired via `aria-describedby`). */
  helperText?: React.ReactNode;
  /** Placeholder shown in the trigger before a value is chosen. @default '0' */
  placeholder?: string;
  /** The numeric options rendered in the menu, e.g. `[1, 2, 3, 4, 5]`. */
  options?: (number | NumberDropdownOption)[];
  /** Controlled selected value. */
  value?: number;
  /** Uncontrolled initial value. */
  defaultValue?: number;
  /** Fires with the new numeric value when the selection changes. */
  onValueChange?: (value: number) => void;
  /** Field height: `md` 40px (24px arrow), `sm` 32px (18px arrow). @default 'md' */
  size?: 'sm' | 'md';
  /** Dims the whole field and blocks interaction. @default false */
  disabled?: boolean;
  /** Field name for form submission. */
  name?: string;
  /** Explicit id for the trigger (defaults to a generated id wired to the label). */
  id?: string;
  /** Accessible name for the trigger — required when `label` is omitted. */
  'aria-label'?: string;
}

const normalizeOptions = (options: (number | NumberDropdownOption)[]): NumberDropdownOption[] =>
  options.map((opt) => (typeof opt === 'number' ? { value: opt } : opt));

export const NumberDropdown = React.forwardRef<HTMLButtonElement, NumberDropdownProps>(
  (
    {
      label,
      showLabelInfo = false,
      required = false,
      helperText,
      placeholder = '0',
      options = [],
      value,
      defaultValue,
      onValueChange,
      size = 'md',
      disabled = false,
      name,
      id,
      'aria-label': ariaLabel,
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const triggerId = id ?? generatedId;
    const helperId = `${triggerId}-helper`;

    const normalized = normalizeOptions(options);

    // Radix Select values are strings; the public API stays numeric.
    const [innerValue, setInnerValue] = React.useState(defaultValue);
    const currentValue = value ?? innerValue;
    const hasValue = currentValue != null;
    const stringValue = currentValue != null ? String(currentValue) : undefined;

    const tone: HelperTone = disabled ? 'disabled' : 'greyscale';

    return (
      <Root $size={size}>
        <FieldGroup>
          {label ? (
            <InputLabel
              htmlFor={triggerId}
              size="sm"
              required={required}
              showInfo={showLabelInfo}
              disabled={disabled}
            >
              {label}
            </InputLabel>
          ) : null}
          <RadixSelect.Root
            value={stringValue}
            onValueChange={(next) => {
              const parsed = Number(next);
              setInnerValue(parsed);
              onValueChange?.(parsed);
            }}
            disabled={disabled}
            required={required}
            name={name}
          >
            <Trigger
              ref={ref}
              id={triggerId}
              $size={size}
              data-has-value={hasValue}
              aria-label={ariaLabel}
              aria-describedby={helperText != null ? helperId : undefined}
            >
              <Value placeholder={placeholder} />
              <Arrow $size={size}>
                <ChevronDown />
              </Arrow>
            </Trigger>
            <RadixSelect.Portal>
              <Content position="popper" sideOffset={4}>
                <Viewport>
                  {normalized.map((opt) => (
                    <Item key={opt.value} value={String(opt.value)} disabled={opt.disabled}>
                      <RadixSelect.ItemText>{opt.label ?? String(opt.value)}</RadixSelect.ItemText>
                    </Item>
                  ))}
                </Viewport>
              </Content>
            </RadixSelect.Portal>
          </RadixSelect.Root>
        </FieldGroup>
        {helperText != null ? (
          <HelperString id={helperId} tone={tone}>
            {helperText}
          </HelperString>
        ) : null}
      </Root>
    );
  },
);

NumberDropdown.displayName = 'NumberDropdown';
