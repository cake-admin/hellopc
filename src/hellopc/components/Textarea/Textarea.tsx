import React from 'react';
import styled from 'styled-components';

import { InputLabel } from '../Elements/InputLabel';
import { HelperString, type HelperTone } from '../Elements/HelperString';

export type TextareaStatus = 'default' | 'success' | 'error';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  status?: TextareaStatus;
  /** Character limit — sets the native `maxLength` and shows the helper counter ("0/250"). */
  maxLength?: number;
  /**
   * Visible lines before the field scrolls. People can drag the corner to make
   * it taller (vertical resize only).
   * @default 3
   */
  rows?: number;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  width: 100%;
  font-family: var(--font-family);
`;

/** Label + box, 4px apart (Figma hellopc.textarea 3964:7713 "Label + Input"). */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  width: 100%;
`;

const Box = styled.div<{ $status: TextareaStatus }>`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container-high);
  border: var(--stroke-100) solid var(--color-stroke-border);
  transition: background 120ms ease, border-color 120ms ease;

  /* Hover: a darker border on the onContainer surface (Figma state=hover). */
  &:hover:not(:focus-within) {
    background: var(--color-surfaces-on-container);
    border-color: var(--color-stroke-border-high);
  }

  /* Finished typing: a filled field rests on the container surface. */
  &:has(textarea:not(:placeholder-shown)) {
    background: var(--color-surfaces-container);
  }

  /* Typing (focus): container surface + 1.5px primary border. */
  &:focus-within {
    background: var(--color-surfaces-container);
    border: var(--stroke-150) solid var(--color-primary-primary);
  }

  ${(p) =>
    p.$status === 'success' &&
    `
    &, &:hover:not(:focus-within), &:focus-within, &:has(textarea:not(:placeholder-shown)) {
      background: var(--color-success-success-overlay);
      border: var(--stroke-150) solid var(--color-success-success);
    }
    & textarea:not(:disabled) { color: var(--color-text-icon-on-surface); }
  `}
  ${(p) =>
    p.$status === 'error' &&
    `
    &, &:hover:not(:focus-within), &:focus-within, &:has(textarea:not(:placeholder-shown)) {
      background: var(--color-error-error-overlay);
      border: var(--stroke-150) solid var(--color-error-error);
    }
    & textarea:not(:disabled) { color: var(--color-text-icon-on-surface); }
  `}

  /* Disabled: flat fill with a disabledInverse border; everything dims. */
  &:has(textarea:disabled) {
    background: var(--color-disabled-disabled);
    border: var(--stroke-100) solid var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }
`;

const Field = styled.textarea<{ $rows: number }>`
  flex: 1;
  min-width: 0;
  /* "rows" lines of 14px × 1.35 (3 ≈ the Figma 60px content box). */
  min-height: calc(var(--type-size-body) * 1.35 * ${(p) => p.$rows});
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  resize: vertical;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-primary);

  /* Figma binds the textarea placeholder to text+icon/secondary. */
  &::placeholder {
    color: var(--color-text-icon-secondary);
  }
  &:disabled {
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
    resize: none;
    &::placeholder {
      color: var(--color-disabled-disabled-inverse);
    }
  }
`;

/**
 * hello pc Textarea — multi-line text entry (Figma `hellopc.textarea`, node
 * 3964:7713), composed from the reusable form elements like TextInput:
 * `InputLabel` above, the resizable box, and `HelperString` (with an optional
 * character counter) below. States: default, hover, typing (focus), finished
 * typing (has text), disabled, success, error.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      showLabelInfo = false,
      required = false,
      helperText,
      status = 'default',
      maxLength,
      rows = 3,
      disabled,
      id,
      value,
      defaultValue,
      placeholder = ' ',
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const helperId = `${fieldId}-helper`;

    // Focus (helper turns info while typing) and length (counter); controlled
    // values are read directly.
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
            <InputLabel htmlFor={fieldId} size="md" required={required} showInfo={showLabelInfo} disabled={disabled}>
              {label}
            </InputLabel>
          ) : null}
          <Box $status={status}>
            <Field
              ref={ref}
              id={fieldId}
              rows={rows}
              $rows={rows}
              disabled={disabled}
              required={required}
              maxLength={maxLength}
              value={value}
              defaultValue={defaultValue}
              placeholder={placeholder}
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

Textarea.displayName = 'Textarea';

export default Textarea;
