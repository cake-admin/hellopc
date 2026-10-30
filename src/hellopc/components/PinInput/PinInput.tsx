import React from 'react';
import { unstable_OneTimePasswordField as RadixOtp } from 'radix-ui';
import styled, { css } from 'styled-components';
import { Eye, EyeOff } from 'lucide-react';

import { IconButton } from '../Button/IconButton';
import { HelperString, type HelperTone } from '../Elements/HelperString';
import { InputLabel } from '../Elements/InputLabel';

/**
 * hello pc PinInput — a masked multi-digit PIN / one-time-code field (Figma
 * "&Pin Input", node 69:4796). It composes the reusable `InputLabel` above,
 * Radix's OTP field for digit input, the existing `IconButton` visibility
 * control, and `HelperString` below.
 *
 * Radix owns the input behavior: numeric validation, pasting/autofill,
 * roving focus, Backspace navigation, and the single submitted field value.
 * hello pc owns the visual treatment. The Figma component has six 30×40px cells,
 * 4px cell gaps, a 16px eye-action gap, and a 32px eye button.
 *
 * State model (matching the Figma variants):
 * - default: `--color-surfaces-on-container-high`, `--color-stroke-border`.
 * - hover: the cell borders raise to `--color-stroke-border-high`.
 * - typing: entered/current cells use a `--stroke-150`
 *   `--color-primary-primary` border.
 * - selected (all digits entered): every cell uses the white container fill
 *   and primary border.
 * - disabled: `--color-disabled-disabled`, no border; label/helper/icon dim.
 * - error: `--stroke-150` `--color-error-error`; helper turns error.
 *
 * The Figma `CircleFilled` glyph is represented by the browser's password
 * masking supplied through Radix's `type="password"` rather than a remote
 * seven-day Figma asset. This preserves real OTP input semantics.
 */

/** Figma node 69:4796 intrinsic PIN-cell and visibility-control geometry. */
const CELL_WIDTH = 30;
const CELL_HEIGHT = 40;

type PinStatus = 'default' | 'error';

const Root = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: var(--space-050);
  font-family: var(--font-family);
`;

/** Figma groups the label and code row with a 4px gap. */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
`;

const CodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
`;

const OtpRoot = styled(RadixOtp.Root)`
  display: flex;
  align-items: center;
  gap: var(--space-050);
`;

const cellStyles = ($status: PinStatus, $filled: boolean, $completed: boolean) => {
  if ($status === 'error') {
    return css`
      border: var(--stroke-150) solid var(--color-error-error);
    `;
  }

  if ($completed) {
    return css`
      background: var(--color-surfaces-container);
      border: var(--stroke-150) solid var(--color-primary-primary);
    `;
  }

  if ($filled) {
    return css`
      border: var(--stroke-150) solid var(--color-primary-primary);
    `;
  }

  return css``;
};

const OtpInput = styled(RadixOtp.Input)<{
  $status: PinStatus;
  $filled: boolean;
  $completed: boolean;
}>`
  box-sizing: border-box;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;
  padding: var(--space-100) var(--space-050);
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container-high);
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.35;
  text-align: center;
  outline: none;
  caret-color: transparent;
  transition: background 120ms ease, border-color 120ms ease;

  ${OtpRoot}:hover:not([data-disabled]) & {
    border-color: var(--color-stroke-border-high);
  }

  ${OtpRoot}:focus-within & {
    border-color: var(--color-stroke-border-high);
  }

  ${(p) => cellStyles(p.$status, p.$filled, p.$completed)}

  &:focus-visible {
    border: var(--stroke-150) solid
      ${(p) => (p.$status === 'error' ? 'var(--color-error-error)' : 'var(--color-primary-primary)')};
  }

  &:disabled {
    background: var(--color-disabled-disabled);
    border-color: transparent;
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }
`;

export interface PinInputProps {
  /** Label text above the PIN slots (renders an `InputLabel`). */
  label?: string;
  /** Shows the label's 16px info icon. @default false */
  showLabelInfo?: boolean;
  /** Appends the label's "(required)" suffix and marks the field required. @default false */
  required?: boolean;
  /** Helper text below the PIN slots (renders a `HelperString`). */
  helperText?: React.ReactNode;
  /**
   * Validation state. `error` changes every cell border and the helper to the
   * error tokens, and exposes `aria-invalid`.
   * @default 'default'
   */
  status?: PinStatus;
  /**
   * Number of numeric PIN slots. The Figma component uses six; reduce only
   * when the authentication service explicitly uses a different code length.
   * @default 6
   */
  length?: number;
  /** Controlled PIN value. Only numeric characters up to `length` are retained. */
  value?: string;
  /** Uncontrolled initial PIN value. */
  defaultValue?: string;
  /** Fires whenever Radix changes the sanitized numeric PIN value. */
  onValueChange?: (value: string) => void;
  /** Fires once the PIN reaches `length` digits. */
  onComplete?: (value: string) => void;
  /** Makes the PIN visible as digits instead of password dots. @default false */
  visible?: boolean;
  /** Called when the visibility eye button changes state. */
  onVisibleChange?: (visible: boolean) => void;
  /** Shows the existing 32px IconButton eye action. @default true */
  showVisibilityToggle?: boolean;
  /** Dims the slots, helper, and eye action, blocking every interaction. @default false */
  disabled?: boolean;
  /** Field name for form submission (Radix submits the combined PIN value). */
  name?: string;
  /** Explicit id for the first slot (defaults to a generated id wired to the label). */
  id?: string;
  /** Accessible name for a labelless field. Required when `label` is omitted. */
  'aria-label'?: string;
  /** Enables browser/SMS one-time-code autofill. @default 'one-time-code' */
  autoComplete?: 'one-time-code' | 'off';
}

const sanitizePin = (value: string, length: number) => value.replace(/\D/g, '').slice(0, length);

export const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(
  (
    {
      label,
      showLabelInfo = false,
      required = false,
      helperText,
      status = 'default',
      length = 6,
      value,
      defaultValue,
      onValueChange,
      onComplete,
      visible,
      onVisibleChange,
      showVisibilityToggle = true,
      disabled = false,
      name,
      id,
      'aria-label': ariaLabel,
      autoComplete = 'one-time-code',
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const firstSlotId = id ?? generatedId;
    const helperId = `${firstSlotId}-helper`;

    const [innerValue, setInnerValue] = React.useState(() => sanitizePin(defaultValue ?? '', length));
    const [innerVisible, setInnerVisible] = React.useState(false);
    const currentValue = sanitizePin(value ?? innerValue, length);
    const isVisible = visible ?? innerVisible;
    const isComplete = currentValue.length === length;
    const tone: HelperTone = disabled ? 'disabled' : status === 'error' ? 'error' : 'greyscale';

    const setVisibility = (next: boolean) => {
      setInnerVisible(next);
      onVisibleChange?.(next);
    };

    const handleValueChange = (next: string) => {
      const sanitized = sanitizePin(next, length);
      setInnerValue(sanitized);
      onValueChange?.(sanitized);
      if (sanitized.length === length) onComplete?.(sanitized);
    };

    return (
      <Root>
        <FieldGroup>
          {label ? (
            <InputLabel
              htmlFor={firstSlotId}
              size="sm"
              required={required}
              showInfo={showLabelInfo}
              disabled={disabled}
            >
              {label}
            </InputLabel>
          ) : null}
          <CodeRow>
            <OtpRoot
              ref={ref}
              value={currentValue}
              onValueChange={handleValueChange}
              validationType="numeric"
              type={isVisible ? 'text' : 'password'}
              autoComplete={autoComplete}
              disabled={disabled}
              name={name}
              aria-label={ariaLabel}
              aria-describedby={helperText != null ? helperId : undefined}
              aria-invalid={status === 'error' || undefined}
            >
              {Array.from({ length }, (_, index) => (
                <OtpInput
                  key={index}
                  id={index === 0 ? firstSlotId : undefined}
                  index={index}
                  $status={status}
                  $filled={Boolean(currentValue[index])}
                  $completed={isComplete}
                  aria-label={`${label ?? ariaLabel ?? 'PIN'} digit ${index + 1} of ${length}`}
                />
              ))}
              <RadixOtp.HiddenInput required={required} />
            </OtpRoot>
            {showVisibilityToggle ? (
              <IconButton
                type="button"
                size="sm"
                intent="secondary"
                variant="ghost"
                disabled={disabled}
                label={isVisible ? 'Hide PIN' : 'Show PIN'}
                icon={isVisible ? <EyeOff /> : <Eye />}
                onClick={() => setVisibility(!isVisible)}
              />
            ) : null}
          </CodeRow>
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

PinInput.displayName = 'PinInput';
