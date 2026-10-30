import React from 'react';
import styled from 'styled-components';
import { Minus, Plus } from 'lucide-react';

import { InputLabel } from '../Elements/InputLabel';
import { HelperString, type HelperTone } from '../Elements/HelperString';
import { IconButton } from '../Button/IconButton';

/**
 * hello pc NumberInput — a numeric stepper field (Figma "NumberInput", node
 * 63:4244), composed from the reusable form elements: `InputLabel` above,
 * the value input with inline decrement/increment buttons, and an optional
 * `HelperString` below (not present in this Figma frame, included for
 * consistency with `TextInput`/`Dropdown`).
 *
 * The stepper buttons **reuse `IconButton`** (`variant="ghost"`,
 * `intent="secondary"`) rather than reimplementing icon buttons — this also
 * explains the circular hover halo captured in the Figma "typing" screenshot:
 * it's just `IconButton`'s always-circular hit target.
 *
 * Figma naming quirk: the component's "Left slot"/"Right slot" props are
 * swapped from their visual position — the slot named `showRightIcon` renders
 * the *decrement* button first (visually left) and `showLeftIcon` renders the
 * *increment* button second (visually right). This component uses sane names
 * (`showDecrement`/`showIncrement`) instead.
 *
 * Every color/spacing/radius/stroke value resolves from the hello pc token
 * custom properties, whose names mirror the Figma variables 1:1 and re-theme
 * via `[data-theme]`.
 *
 * State model (matching the Figma variants):
 *  - default/hover (pristine, not yet edited): `--color-surfaces-on-container-high`
 *    fill, dim `--color-text-icon-secondary` value text; hover raises the
 *    border to `--color-stroke-border-high`.
 *  - typing (focus): white `--color-surfaces-container` fill, `--stroke-150`
 *    `--color-primary-primary` border, value promotes to
 *    `--color-text-icon-primary`.
 *  - finished typing (has a value, blurred): keeps the white fill with the
 *    `--color-stroke-border-high` hairline.
 *  - success / error (`status`): tinted `…Overlay` fill + `--stroke-150`
 *    semantic border.
 *  - disabled: flat `--color-disabled-disabled` fill **with a visible**
 *    `--color-disabled-disabled-inverse` **border** — verified against the
 *    Figma export; this is a real deviation from `TextInput`'s borderless
 *    disabled chrome, not an oversight.
 */

/** Container height + stepper diameter per size (Figma 40pt / 32pt — both map
 *  1:1 onto `IconButton`'s `md`/`sm` diameters). */
const HEIGHT = { md: 40, sm: 32 } as const;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  width: 100%;
  font-family: var(--font-family);
`;

/** Label + box group (tighter than the helper gap, per the Figma stack). */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
`;

const Box = styled.div<{ $size: 'sm' | 'md'; $status: 'default' | 'success' | 'error' }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: ${(p) => HEIGHT[p.$size]}px;
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container-high);
  border: var(--stroke-100) solid var(--color-stroke-border);
  overflow: hidden;
  transition: background 120ms ease, border-color 120ms ease;

  &:hover:not(:focus-within) {
    border-color: var(--color-stroke-border-high);
  }

  /* Finished typing: a dirtied field rests on the white container surface
     with the darker hairline. */
  &:has(input:not(:placeholder-shown)):not(:focus-within) {
    border-color: var(--color-stroke-border-high);
  }

  /* Typing (focus): white surface + 1.5px primary border. */
  &:focus-within {
    background: var(--color-surfaces-container);
    border: var(--stroke-150) solid var(--color-primary-primary);
  }

  /* Validation states override the resting/hover/focus chrome. */
  ${(p) =>
    p.$status === 'success' &&
    `
    &, &:hover:not(:focus-within), &:focus-within, &:has(input:not(:placeholder-shown)) {
      background: var(--color-success-success-overlay);
      border: var(--stroke-150) solid var(--color-success-success);
    }
  `}
  ${(p) =>
    p.$status === 'error' &&
    `
    &, &:hover:not(:focus-within), &:focus-within, &:has(input:not(:placeholder-shown)) {
      background: var(--color-error-error-overlay);
      border: var(--stroke-150) solid var(--color-error-error);
    }
  `}

  /* Disabled: flat fill, but (unlike TextInput) NumberInput keeps a visible
     border per the Figma "disabled" variant. */
  &:has(input:disabled) {
    background: var(--color-disabled-disabled);
    border-color: var(--color-disabled-disabled-inverse);
  }
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 var(--space-100) 0 var(--space-200);
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.35;
  color: var(--color-text-icon-secondary);

  /* Hide native spin arrows — the hello pc stepper buttons replace them. */
  appearance: textfield;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: var(--color-text-icon-secondary);
  }

  /* A committed value (typing or finished typing) promotes to full-strength ink. */
  &:focus,
  &:not(:placeholder-shown) {
    color: var(--color-text-icon-primary);
  }

  &:disabled {
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
    &::placeholder {
      color: var(--color-disabled-disabled-inverse);
    }
  }
`;

const Suffix = styled.span`
  flex-shrink: 0;
  padding-right: var(--space-100);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.35;
  color: var(--color-text-icon-secondary);

  ${Box}:focus-within & {
    color: var(--color-text-icon-primary);
  }

  ${Box}:has(input:disabled) & {
    color: var(--color-disabled-disabled-inverse);
  }
`;

/** Decrement/increment sit flush against the box's trailing edge, adjacent
 *  with no gap (per the Figma layout). */
const Stepper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'type'
  > {
  /** Label text above the field (renders an `InputLabel`, wired via `htmlFor`). */
  label?: string;
  /** Shows the label's 16px info icon. @default false */
  showLabelInfo?: boolean;
  /**
   * Marks the field required: appends the label's "(required)" suffix and sets
   * the native `required` attribute.
   * @default false
   */
  required?: boolean;
  /** Helper text below the field (renders a `HelperString`, wired via `aria-describedby`). */
  helperText?: React.ReactNode;
  /**
   * Validation state: tints the field with the success/error tokens and sets
   * `aria-invalid` on error.
   * @default 'default'
   */
  status?: 'default' | 'success' | 'error';
  /** Field height: `md` 40px (40px stepper buttons), `sm` 32px (32px buttons). @default 'md' */
  size?: 'sm' | 'md';
  /** Controlled numeric value. */
  value?: number;
  /** Uncontrolled initial value. */
  defaultValue?: number;
  /** Lower bound — clamps typed/stepped values and disables the decrement button at the limit. */
  min?: number;
  /** Upper bound — clamps typed/stepped values and disables the increment button at the limit. */
  max?: number;
  /** Amount the stepper buttons add/subtract per click. @default 1 */
  step?: number;
  /** Non-editable text shown after the value, such as `%` or `kg`. */
  suffix?: React.ReactNode;
  /** Fires with the new value (or `undefined` if cleared) on every change. */
  onValueChange?: (value: number | undefined) => void;
  /** Shows the decrement ("−") button. @default true */
  showDecrement?: boolean;
  /** Shows the increment ("+") button. @default true */
  showIncrement?: boolean;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      label,
      showLabelInfo = false,
      required = false,
      helperText,
      status = 'default',
      size = 'md',
      value,
      defaultValue,
      min,
      max,
      step = 1,
      suffix,
      onValueChange,
      showDecrement = true,
      showIncrement = true,
      disabled,
      id,
      placeholder,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;

    const [innerValue, setInnerValue] = React.useState<number | undefined>(defaultValue);
    const currentValue = value ?? innerValue;

    const clamp = React.useCallback(
      (n: number) => {
        let next = n;
        if (min != null) next = Math.max(min, next);
        if (max != null) next = Math.min(max, next);
        return next;
      },
      [min, max],
    );

    const commit = (next: number | undefined) => {
      setInnerValue(next);
      onValueChange?.(next);
    };

    const handleStep = (direction: 1 | -1) => {
      commit(clamp((currentValue ?? 0) + direction * step));
    };

    const tone: HelperTone = disabled
      ? 'disabled'
      : status === 'success'
        ? 'success'
        : status === 'error'
          ? 'error'
          : 'greyscale';

    const atMin = min != null && currentValue != null && currentValue <= min;
    const atMax = max != null && currentValue != null && currentValue >= max;

    return (
      <Root>
        <FieldGroup>
          {label ? (
            <InputLabel
              htmlFor={inputId}
              size="sm"
              required={required}
              showInfo={showLabelInfo}
              disabled={disabled}
            >
              {label}
            </InputLabel>
          ) : null}
          <Box $size={size} $status={status}>
            <Input
              ref={ref}
              id={inputId}
              type="number"
              inputMode="numeric"
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              min={min}
              max={max}
              step={step}
              value={value ?? innerValue ?? ''}
              aria-invalid={status === 'error' || undefined}
              aria-describedby={helperText != null ? helperId : undefined}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') {
                  commit(undefined);
                  return;
                }
                const parsed = Number(raw);
                if (!Number.isNaN(parsed)) commit(parsed);
              }}
              onBlur={(e) => {
                if (currentValue != null) commit(clamp(currentValue));
                onBlur?.(e);
              }}
              onFocus={onFocus}
              {...props}
            />
            {suffix != null ? <Suffix aria-hidden>{suffix}</Suffix> : null}
            <Stepper>
              {showDecrement ? (
                <IconButton
                  type="button"
                  variant="ghost"
                  intent="secondary"
                  size={size}
                  icon={<Minus />}
                  label={`Decrease${label ? ` ${label}` : ''}`}
                  disabled={disabled || atMin}
                  onClick={() => handleStep(-1)}
                />
              ) : null}
              {showIncrement ? (
                <IconButton
                  type="button"
                  variant="ghost"
                  intent="secondary"
                  size={size}
                  icon={<Plus />}
                  label={`Increase${label ? ` ${label}` : ''}`}
                  disabled={disabled || atMax}
                  onClick={() => handleStep(1)}
                />
              ) : null}
            </Stepper>
          </Box>
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

NumberInput.displayName = 'NumberInput';
