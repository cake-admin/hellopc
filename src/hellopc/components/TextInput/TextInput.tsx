import React from 'react';
import styled from 'styled-components';

import { InputLabel } from '../Elements/InputLabel';
import { HelperString, type HelperTone } from '../Elements/HelperString';

/**
 * hello pc TextInput — a single-line text field (Figma "&text input", node
 * 54:2506), composed from the reusable form elements: `InputLabel` above,
 * the input box, and `HelperString` below. Styled entirely from the hello pc
 * token custom properties; every gap/padding is a `--space-*` token per the
 * Figma auto-layout.
 *
 * State model (matching the Figma variants):
 *  - default: `--color-surfaces-on-container-high` fill, `--color-stroke-border`
 *    hairline; hover raises the border to `--color-stroke-border-high`.
 *  - typing (focus): white `--color-surfaces-container` fill with a
 *    `--stroke-150` `--color-primary-primary` border; the helper turns info.
 *  - finished typing (has value): keeps the white fill with the hairline.
 *  - success / error (`status`): tinted `…Overlay` fill + `--stroke-150`
 *    semantic border; the helper matches.
 *  - disabled: flat `--color-disabled-disabled` fill, no border.
 *
 * No Radix primitive exists for text fields — a native `<input>` (already
 * fully accessible) wired to the label via `htmlFor` and to the helper via
 * `aria-describedby`.
 */

/** Container height + slot icon size per size (Figma 40pt / 32pt). */
const HEIGHT = { md: 40, sm: 32 } as const;
const SLOT_ICON = { md: 24, sm: 18 } as const;

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
  padding: 0 var(--space-200);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container-high);
  border: var(--stroke-100) solid var(--color-stroke-border);
  transition: background 120ms ease, border-color 120ms ease;

  &:hover:not(:focus-within) {
    border-color: var(--color-stroke-border-high);
  }

  /* Finished typing: a filled field rests on the white container surface. */
  &:has(input:not(:placeholder-shown)) {
    background: var(--color-surfaces-container);
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

  /* Disabled: flat fill, no border, everything dims. */
  &:has(input:disabled) {
    background: var(--color-disabled-disabled);
    border-color: transparent;
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }
`;

/** Leading/trailing slots — icons inherit `--color-text-icon-secondary`. */
const Slot = styled.span<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: var(--space-050);
  color: var(--color-text-icon-secondary);

  & > svg {
    width: ${(p) => SLOT_ICON[p.$size]}px;
    height: ${(p) => SLOT_ICON[p.$size]}px;
  }

  ${Box}:has(input:disabled) & {
    color: var(--color-disabled-disabled-inverse);
  }
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 var(--space-100);
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
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

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
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
   * Validation state: tints the field and the helper with the success/error
   * tokens and sets `aria-invalid` on error.
   * @default 'default'
   */
  status?: 'default' | 'success' | 'error';
  /** Field height: `md` 40px (24px slot icons), `sm` 32px (18px icons). @default 'md' */
  size?: 'sm' | 'md';
  /** Leading icon/content inside the field (inherits `--color-text-icon-secondary`). */
  startIcon?: React.ReactNode;
  /** Trailing icon/content inside the field. */
  endIcon?: React.ReactNode;
  /** Character limit — sets the native `maxLength` and shows the helper counter. */
  maxLength?: number;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      showLabelInfo = false,
      required = false,
      helperText,
      status = 'default',
      size = 'md',
      startIcon,
      endIcon,
      maxLength,
      disabled,
      id,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}-helper`;

    // Track focus (helper turns info while typing) and length (counter) for
    // uncontrolled usage; controlled values are read directly.
    const [focused, setFocused] = React.useState(false);
    const [innerLength, setInnerLength] = React.useState(String(defaultValue ?? '').length);
    const length = value != null ? String(value).length : innerLength;

    const showHelper = helperText != null || maxLength != null;
    const tone: HelperTone = disabled
      ? 'disabled'
      : status === 'success'
        ? 'success'
        : status === 'error'
          ? 'error'
          : focused
            ? 'info'
            : 'greyscale';

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
            {startIcon ? (
              <Slot $size={size} aria-hidden>
                {startIcon}
              </Slot>
            ) : null}
            <Input
              ref={ref}
              id={inputId}
              disabled={disabled}
              required={required}
              maxLength={maxLength}
              value={value}
              defaultValue={defaultValue}
              aria-invalid={status === 'error' || undefined}
              aria-describedby={showHelper ? helperId : undefined}
              onChange={(e) => {
                setInnerLength(e.target.value.length);
                onChange?.(e);
              }}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              {...props}
            />
            {endIcon ? (
              <Slot $size={size} aria-hidden>
                {endIcon}
              </Slot>
            ) : null}
          </Box>
        </FieldGroup>
        {showHelper ? (
          <HelperString
            id={helperId}
            tone={tone}
            showIcon={helperText != null}
            count={maxLength != null ? length : undefined}
            max={maxLength}
          >
            {helperText}
          </HelperString>
        ) : null}
      </Root>
    );
  },
);

TextInput.displayName = 'TextInput';
