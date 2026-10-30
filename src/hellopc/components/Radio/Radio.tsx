import React from 'react';
import { RadioGroup as RadixRadioGroup } from 'radix-ui';
import styled from 'styled-components';

/**
 * hello pc Radio — a single-select control set, built on the Radix `RadioGroup`
 * primitive (Figma "&radio", node 47:2341) and styled from the hello pc token
 * custom properties (`--color-*`, `--radius-*`, `--stroke-*`, `--space-*`),
 * which mirror the Figma variables and re-theme via `[data-theme]`.
 *
 * Radix owns behavior + accessibility (roles, arrow-key roving focus, Space to
 * select, `data-state`); hello pc owns the visuals.
 *
 * Spec geometry: a 24px touch target (hover wash + focus ring live here) holds
 * a 16px ring glyph with a 2px stroke; the selected dot is 8px; the focus ring
 * is 20px (inset 2px in the target).
 */

/** 16px ring + fill. Colors are driven from the parent Item's data-state. */
const Glyph = styled.span`
  position: relative;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: var(--radius-1000);
  border: var(--stroke-200) solid var(--color-text-icon-secondary);
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color 120ms ease, background 120ms ease;
`;

/** 8px selected dot — Radix only renders the Indicator when the item is checked. */
const Dot = styled(RadixRadioGroup.Indicator)`
  display: block;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-1000);
  background: var(--color-primary-primary);
  transition: background 120ms ease;
`;

/** 24px touch target: hover wash, focus ring, and the state-driven glyph colors. */
const Item = styled(RadixRadioGroup.Item)`
  all: unset;
  position: relative;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: var(--radius-1000);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover:not([data-disabled]) {
    background: var(--color-surfaces-primary);
  }

  /* Checked: primary ring + dot, deepening on hover. */
  &[data-state='checked'] ${Glyph} {
    border-color: var(--color-primary-primary);
  }
  &[data-state='checked']:hover:not([data-disabled]) ${Glyph} {
    border-color: var(--color-primary-primary-hover);
  }
  &[data-state='checked']:hover:not([data-disabled]) ${Dot} {
    background: var(--color-primary-primary-hover);
  }

  /* Disabled: filled disc with a muted ring (and a muted dot when checked). */
  &[data-disabled] {
    cursor: not-allowed;
  }
  &[data-disabled] ${Glyph} {
    border-color: var(--color-disabled-disabled);
    background: var(--color-disabled-disabled-inverse);
  }
  &[data-disabled] ${Dot} {
    background: var(--color-disabled-disabled);
  }

  /* Focus ring: 20px (inset 2px), restyled — never removed. */
  &:focus-visible::after {
    content: '';
    position: absolute;
    inset: 2px;
    border: var(--stroke-200) solid var(--color-primary-primary);
    border-radius: var(--radius-1000);
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

const Root = styled(RadixRadioGroup.Root)`
  all: unset;
  display: flex;
  flex-direction: column;
  gap: var(--space-100);

  &[data-orientation='horizontal'] {
    flex-direction: row;
    gap: var(--space-300);
  }
`;

export interface RadioGroupProps {
  /** Controlled selected value. Pair with `onValueChange`. */
  value?: string;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string;
  /** Fired with the newly selected value when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Form field name submitted with the selected value. */
  name?: string;
  /** Disables every radio in the group. @default false */
  disabled?: boolean;
  /** Marks the group as required in a form. @default false */
  required?: boolean;
  /**
   * Layout + arrow-key direction. `vertical` stacks the options;
   * `horizontal` lays them in a row.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Accessible name for the group. Provide this (or associate a visible
   * heading via `aria-labelledby`) so assistive tech announces what the
   * choices are for.
   */
  'aria-label'?: string;
  /** The `Radio` options. */
  children: React.ReactNode;
}

export interface RadioProps {
  /** The value this option contributes to the group (required, unique). */
  value: string;
  /**
   * Visible text label, wired via `<label htmlFor>` so clicking it selects the
   * option. When omitted, pass `aria-label` to keep an accessible name.
   */
  label?: string;
  /** Disables just this option. @default false */
  disabled?: boolean;
  /** Accessible name for a labelless radio. Required when `label` is omitted. */
  'aria-label'?: string;
  /** Explicit id (auto-generated when omitted). */
  id?: string;
}

/**
 * The group container. Owns the selected value + keyboard navigation; renders
 * `Radio` children.
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, ...props }, ref) => (
    <Root ref={ref} {...props}>
      {children}
    </Root>
  ),
);

RadioGroup.displayName = 'RadioGroup';

/** A single option. Must be rendered inside a `RadioGroup`. */
export const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(
  ({ value, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id ?? generatedId;

    const control = (
      <Item id={radioId} ref={ref} value={value} {...props}>
        <Glyph>
          <Dot />
        </Glyph>
      </Item>
    );

    if (!label) return control;

    return (
      <Label htmlFor={radioId}>
        {control}
        <span>{label}</span>
      </Label>
    );
  },
);

Radio.displayName = 'Radio';
