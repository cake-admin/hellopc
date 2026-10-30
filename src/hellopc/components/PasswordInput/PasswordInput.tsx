import React from 'react';
import { unstable_PasswordToggleField as RadixPasswordToggleField } from 'radix-ui';
import styled from 'styled-components';
import { Eye, EyeOff } from 'lucide-react';

import {
  HelperString,
  InputLabel,
  PasswordMenu,
  type HelperTone,
  type PasswordRequirement,
  type PasswordStrength,
} from '../Elements';

/**
 * hello pc PasswordInput — a password-creation field (Figma "&password input",
 * node 72:5338), composed from `InputLabel`, Radix's password-toggle field,
 * `HelperString`, and the hello pc `PasswordMenu`.
 *
 * Radix owns password masking and the accessible visibility toggle; hello pc
 * owns the field chrome and the policy feedback. The password menu opens
 * while the field group has focus, so it stays available when the user moves
 * between the input and the eye toggle.
 *
 * State model (matching Figma):
 * - default: `--color-surfaces-on-container-high` + hairline border.
 * - hover: border raises to `--color-stroke-border-high`.
 * - typing: white surface and `--stroke-150` primary border, with the
 *   PasswordMenu visible below the field.
 * - error / success: semantic overlay fill + `--stroke-150` semantic border;
 *   error helper tone matches.
 * - disabled: the established hello pc disabled field treatment (not exported
 *   in this Figma component): disabled fill, no border, dim text/action.
 */

/** Figma node 72:5338 intrinsic input/eye geometry. */
const FIELD_HEIGHT = 40;
const EYE_SIZE = 24;

type PasswordStatus = 'default' | 'success' | 'error';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  width: 100%;
  max-width: 320px;
  font-family: var(--font-family);
`;

const FieldGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
`;

const Box = styled.div<{ $status: PasswordStatus }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: ${FIELD_HEIGHT}px;
  padding: 0 var(--space-200);
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container-high);
  transition: background 120ms ease, border-color 120ms ease;

  &:hover:not(:focus-within) {
    border-color: var(--color-stroke-border-high);
  }

  &:focus-within {
    background: var(--color-surfaces-container);
    border: var(--stroke-150) solid var(--color-primary-primary);
  }

  ${(p) =>
    p.$status === 'success' &&
    `
      &, &:hover:not(:focus-within), &:focus-within {
        background: var(--color-success-success-overlay);
        border: var(--stroke-150) solid var(--color-success-success);
      }
    `}

  ${(p) =>
    p.$status === 'error' &&
    `
      &, &:hover:not(:focus-within), &:focus-within {
        background: var(--color-error-error-overlay);
        border: var(--stroke-150) solid var(--color-error-error);
      }
    `}

  &:has(input:disabled) {
    background: var(--color-disabled-disabled);
    border-color: transparent;
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }
`;

const Input = styled(RadixPasswordToggleField.Input)`
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 var(--space-100);
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.35;
  color: var(--color-text-icon-primary);

  &::placeholder {
    color: var(--color-text-icon-placeholder);
  }

  &:disabled {
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;

    &::placeholder {
      color: var(--color-disabled-disabled-inverse);
    }
  }
`;

const Toggle = styled(RadixPasswordToggleField.Toggle)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${EYE_SIZE}px;
  height: ${EYE_SIZE}px;
  padding: 0;
  border: none;
  border-radius: var(--radius-1000);
  background: transparent;
  color: var(--color-text-icon-secondary);
  cursor: pointer;

  &:disabled {
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }

  &:focus-visible::after {
    position: absolute;
    inset: calc(var(--space-025) * -1);
    border: var(--stroke-200) solid var(--color-primary-primary);
    border-radius: var(--radius-1000);
    content: '';
    pointer-events: none;
  }

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

/** PasswordMenu begins one stroke below the Figma field group (68px top). */
const StrengthMenu = styled.div`
  position: absolute;
  top: calc(100% + var(--stroke-100));
  left: 0;
  z-index: 1;
`;

const calculateStrength = (password: string): PasswordStrength => {
  if (password.length === 0) return 'empty';
  if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && password.length >= 8) {
    return 'strong';
  }
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) return 'medium';
  return 'weak';
};

const calculateMetRequirementIds = (password: string): string[] => {
  const met: string[] = [];
  if (/[a-z]/.test(password)) met.push('lowercase');
  if (/[A-Z]/.test(password)) met.push('uppercase');
  if (/\d/.test(password)) met.push('numeric');
  if (password.length >= 8) met.push('length');
  return met;
};

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange' | 'value' | 'defaultValue'> {
  /** Label text above the field (renders an `InputLabel`, wired via `htmlFor`). */
  label?: string;
  /** Shows the label's 16px info icon. @default false */
  showLabelInfo?: boolean;
  /** Appends "(required)" to the label and sets the native required attribute. @default false */
  required?: boolean;
  /** Helper text below the input (renders a `HelperString`). */
  helperText?: React.ReactNode;
  /** Validation state: semantic chrome and helper tone. @default 'default' */
  status?: PasswordStatus;
  /** Controlled password value. */
  value?: string;
  /** Uncontrolled initial password value. */
  defaultValue?: string;
  /** Fires with the native input change event. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Fires with the raw password value whenever it changes. */
  onValueChange?: (value: string) => void;
  /** Fires when the Radix visibility toggle changes state. */
  onVisibilityChange?: (visible: boolean) => void;
  /** Controlled visibility for the password. */
  visible?: boolean;
  /** Uncontrolled initial visibility. @default false */
  defaultVisible?: boolean;
  /** Shows the PasswordMenu while the field or its eye toggle has focus. @default true */
  showStrengthMenu?: boolean;
  /** Overrides automatically calculated password strength. */
  strength?: PasswordStrength;
  /** Overrides the visible PasswordMenu strength label. */
  strengthLabel?: string;
  /** Overrides the default password-policy requirements in PasswordMenu. */
  requirements?: PasswordRequirement[];
  /** Satisfied custom-policy requirement ids; defaults to the built-in rule checks. */
  metRequirementIds?: string[];
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      showLabelInfo = false,
      required = false,
      helperText,
      status = 'default',
      value,
      defaultValue,
      onChange,
      onValueChange,
      onVisibilityChange,
      visible,
      defaultVisible = false,
      showStrengthMenu = true,
      strength,
      strengthLabel,
      requirements,
      metRequirementIds: metRequirementIdsProp,
      disabled,
      id,
      autoComplete = 'new-password',
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;
    const fieldGroupRef = React.useRef<HTMLDivElement>(null);
    const [innerValue, setInnerValue] = React.useState(defaultValue ?? '');
    const [focused, setFocused] = React.useState(false);
    const [innerVisible, setInnerVisible] = React.useState(defaultVisible);

    const currentValue = value ?? innerValue;
    const currentVisible = visible ?? innerVisible;
    const currentStrength = strength ?? calculateStrength(currentValue);
    const metRequirementIds = metRequirementIdsProp ?? calculateMetRequirementIds(currentValue);
    const tone: HelperTone = disabled
      ? 'disabled'
      : status === 'success'
        ? 'success'
        : status === 'error'
          ? 'error'
          : focused
            ? 'info'
            : 'greyscale';
    const showHelper = helperText != null;
    const showMenu = showStrengthMenu && focused && status === 'default' && !disabled;

    return (
      <Root>
        <FieldGroup
          ref={fieldGroupRef}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={() => {
            window.setTimeout(() => setFocused(Boolean(fieldGroupRef.current?.contains(document.activeElement))));
          }}
        >
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
          <RadixPasswordToggleField.Root
            visible={currentVisible}
            onVisibilityChange={(next) => {
              setInnerVisible(next);
              onVisibilityChange?.(next);
            }}
          >
            <Box $status={status}>
              <Input
                ref={ref}
                id={inputId}
                value={currentValue}
                defaultValue={undefined}
                disabled={disabled}
                required={required}
                autoComplete={autoComplete === 'current-password' ? 'current-password' : 'new-password'}
                aria-invalid={status === 'error' || undefined}
                aria-describedby={showHelper ? helperId : undefined}
                onChange={(event) => {
                  setInnerValue(event.target.value);
                  onValueChange?.(event.target.value);
                  onChange?.(event);
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                {...props}
              />
              <Toggle disabled={disabled} aria-label={currentVisible ? 'Hide password' : 'Show password'}>
                {currentVisible ? <EyeOff /> : <Eye />}
              </Toggle>
            </Box>
          </RadixPasswordToggleField.Root>
          {showMenu ? (
            <StrengthMenu
            >
              <PasswordMenu
              strength={currentStrength}
              statusLabel={strengthLabel}
              requirements={requirements}
              metRequirementIds={metRequirementIds}
              />
            </StrengthMenu>
          ) : null}
        </FieldGroup>
        {showHelper ? (
          <HelperString id={helperId} tone={tone}>
            {helperText}
          </HelperString>
        ) : null}
      </Root>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
