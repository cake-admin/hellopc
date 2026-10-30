import React from 'react';
import { Checkbox as RadixCheckbox } from 'radix-ui';
import styled from 'styled-components';
import { Check, Minus } from 'lucide-react';

/**
 * hello pc Checkbox — an independent on/off (or tri-state) control, built on the
 * Radix `Checkbox` primitive (Figma "&checkbox", node 52:2384) and styled from
 * the hello pc token custom properties (`--color-*`, `--radius-*`, `--stroke-*`,
 * `--space-*`), which mirror the Figma variables and re-theme via `[data-theme]`.
 *
 * Radix owns behavior + accessibility (role, keyboard, `data-state` incl.
 * `indeterminate`); hello pc owns the visuals — an 18px rounded box inside a 24px
 * target, a checkmark/dash mark, a hover fill, and a focus ring.
 */

/** The check (✓) and dash (–) marks — lucide icons that inherit `currentColor`. */
const Mark = styled(RadixCheckbox.Indicator)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-icon-inverse);
  & > svg {
    width: 16px;
    height: 16px;
  }
`;

/** The 18px visual box — border + fill are driven from the Root's data-state. */
const Box = styled.span`
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border-radius: var(--radius-50);
  border: var(--stroke-150) solid var(--color-text-icon-secondary);
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 120ms ease, border-color 120ms ease;
`;

/** 24px touch target: focus ring + the state-driven box/mark colors. */
const Root = styled(RadixCheckbox.Root)`
  all: unset;
  position: relative;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: var(--radius-100);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  /* Unchecked hover: a translucent primary fill inside the box. */
  &[data-state='unchecked']:hover:not([data-disabled]) ${Box} {
    background: var(--color-primary-primary-overlay);
  }

  /* Checked / indeterminate: solid primary box, deepening on hover. */
  &[data-state='checked'] ${Box},
  &[data-state='indeterminate'] ${Box} {
    background: var(--color-primary-primary);
    border-color: var(--color-primary-primary);
  }
  &[data-state='checked']:hover:not([data-disabled]) ${Box},
  &[data-state='indeterminate']:hover:not([data-disabled]) ${Box} {
    background: var(--color-primary-primary-hover);
    border-color: var(--color-primary-primary-hover);
  }

  /* Disabled: muted filled box; the mark (if any) dims too. */
  &[data-disabled] {
    cursor: not-allowed;
  }
  &[data-disabled] ${Box} {
    background: var(--color-disabled-disabled-inverse);
    border-color: var(--color-disabled-disabled);
  }
  &[data-disabled] ${Mark} {
    color: var(--color-disabled-disabled);
  }

  /* Show the check when checked, the dash when indeterminate. */
  &[data-state='checked'] .cb-dash {
    display: none;
  }
  &[data-state='indeterminate'] .cb-check {
    display: none;
  }

  /* Focus ring: 22px (inset 1px), restyled — never removed. */
  &:focus-visible::after {
    content: '';
    position: absolute;
    inset: 1px;
    border: var(--stroke-150) solid var(--color-primary-primary);
    border-radius: var(--radius-100);
    pointer-events: none;
  }
`;

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);
  cursor: pointer;

  &:has([data-disabled]) {
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }
`;

export interface CheckboxProps {
  /**
   * Controlled state. `true` / `false`, or `'indeterminate'` for a partial
   * selection (e.g. a "select all" that only some children satisfy). Pair with
   * `onCheckedChange`.
   */
  checked?: boolean | 'indeterminate';
  /**
   * Initial state for uncontrolled usage. Ignored when `checked` is provided.
   * @default false
   */
  defaultChecked?: boolean;
  /** Fired with the next state whenever the user toggles. */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  /** Disables the checkbox. @default false */
  disabled?: boolean;
  /** Marks the field required in a form. @default false */
  required?: boolean;
  /**
   * Visible text label, wired via `<label htmlFor>` so clicking it toggles.
   * When omitted, pass `aria-label` to keep an accessible name.
   */
  label?: string;
  /** Accessible name for a labelless checkbox. Required when `label` is omitted. */
  'aria-label'?: string;
  /** Form field name submitted with the value. */
  name?: string;
  /** Form value submitted when checked. @default 'on' */
  value?: string;
  /** Explicit id (auto-generated when omitted). */
  id?: string;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;

    const control = (
      <Root id={checkboxId} ref={ref} {...props}>
        <Box>
          <Mark>
            <Check className="cb-check" aria-hidden strokeWidth={3} />
            <Minus className="cb-dash" aria-hidden strokeWidth={3} />
          </Mark>
        </Box>
      </Root>
    );

    if (!label) return control;

    return (
      <Label htmlFor={checkboxId}>
        {control}
        <span>{label}</span>
      </Label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
