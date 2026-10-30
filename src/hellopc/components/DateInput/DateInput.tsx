import React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import styled from 'styled-components';
import { CalendarDays } from 'lucide-react';

import { IconButton } from '../Button/IconButton';
import { HelperString, InputLabel, type HelperTone } from '../Elements';
import { Calendar, type CalendarRangeValue } from './Calendar';
import {
  dateToDisplay,
  formatDateInput,
  parseDisplayDate,
} from './dateParse';

/**
 * hello pc DateInput — an MM/DD/YY field with a hello pc Calendar popover
 * (Figma "Date Input", nodes 4890:19504 / 4890:19510 + `&calendar`
 * 4890:20174). It composes InputLabel and HelperString. `mode="range"` is
 * one combined control (`MM/DD/YY — MM/DD/YY`), not two fields.
 *
 * The typed segments behave like Time Input: they hug `MM/DD/YY` and accept
 * overflow digits (`MMDDYYYY` collapses to `MM/DD/YY`). Two-digit years
 * expand with a +20 rolling window (see `dateParse`). Only the trailing
 * IconButton opens the calendar, aligned to the bottom-center of the icon
 * (Radix flips it when there is no room).
 *
 * State model:
 * - default: `--color-surfaces-on-container-high` / border hairline.
 * - hover: `--color-stroke-border-high`.
 * - typing: white surface + `--stroke-150` primary border.
 * - validation/disabled: the established hello pc form-field semantic treatment.
 */

/** Figma 4890:19504 / 4890:19510 — field chrome (not a spacing token). */
const FIELD_HEIGHT = 40;

export interface DateRangeValue {
  start: string;
  end: string;
}

type DateStatus = 'default' | 'success' | 'error';

const Root = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-050);
  max-width: 100%;
  font-family: var(--font-family);
`;

const DateFieldRoot = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  width: max-content;
  max-width: 100%;
  gap: var(--space-050);
`;

const Box = styled.div<{ $status: DateStatus }>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  flex: none;
  width: max-content;
  height: ${FIELD_HEIGHT}px;
  max-width: 100%;
  padding: 0 0 0 var(--space-200);
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

/** Hug MM/DD/YY. The ch unit is the 0 glyph and leaves a tail after YY. */
const TextInput = styled.input<{ $bold?: boolean }>`
  box-sizing: content-box;
  flex: none;
  field-sizing: content;
  width: auto;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: ${(p) => (p.$bold ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)')};
  line-height: 1.35;
  color: var(--color-text-icon-primary);

  &::placeholder {
    color: var(--color-text-icon-placeholder);
    font-weight: var(--font-weight-regular);
  }

  &:disabled {
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;

    &::placeholder {
      color: var(--color-disabled-disabled-inverse);
    }
  }
`;

const RangeDash = styled.span`
  flex-shrink: 0;
  padding: 0 var(--space-050);
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

const CalendarAnchor = styled(RadixPopover.Anchor)`
  display: inline-flex;
  flex-shrink: 0;
`;

const PopoverContent = styled(RadixPopover.Content)`
  z-index: 1100;
  padding: 0;
  border: none;
  background: transparent;
  outline: none;
`;

export interface DateInputProps {
  /** Renders one date field or the Figma combined range field. @default 'single' */
  mode?: 'single' | 'range';
  /**
   * Visible label. Range mode uses one label for the combined control.
   * @default 'Select date' (single) / 'Select date range' (range)
   */
  label?: string;
  /** Accessible name for the range start segment. @default 'Start date' */
  startLabel?: string;
  /** Accessible name for the range end segment. @default 'End date' */
  endLabel?: string;
  /** Shows the InputLabel info icon. @default false */
  showLabelInfo?: boolean;
  /** Marks every date input required. @default false */
  required?: boolean;
  /** Helper content below the field, replacing the Figma default guidance. */
  helperText?: React.ReactNode;
  /** Hides the HelperString. @default true */
  showHelper?: boolean;
  /** Validation state for the field. @default 'default' */
  status?: DateStatus;
  /** Disables date typing and the calendar action. @default false */
  disabled?: boolean;
  /** Controlled MM/DD/YY value for `mode="single"`. */
  value?: string;
  /** Uncontrolled MM/DD/YY value for `mode="single"`. */
  defaultValue?: string;
  /** Fires with the formatted MM/DD/YY single-date value. */
  onValueChange?: (value: string) => void;
  /** Controlled MM/DD/YY start/end values for `mode="range"`. */
  rangeValue?: DateRangeValue;
  /** Uncontrolled MM/DD/YY start/end values for `mode="range"`. */
  defaultRangeValue?: DateRangeValue;
  /** Fires with start/end values whenever either range input changes. */
  onRangeValueChange?: (value: DateRangeValue) => void;
  /** Accessible name for a labelless single date field. */
  'aria-label'?: string;
}

const toCalendarRange = (range: DateRangeValue): CalendarRangeValue => ({
  start: parseDisplayDate(range.start),
  end: parseDisplayDate(range.end),
});

interface FieldShellProps {
  label: string;
  showLabelInfo: boolean;
  required: boolean;
  status: DateStatus;
  disabled: boolean;
  inputId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  calendar: React.ReactNode;
  calendarName: string;
  children: React.ReactNode;
}

const FieldShell = ({
  label,
  showLabelInfo,
  required,
  status,
  disabled,
  inputId,
  open,
  setOpen,
  calendar,
  calendarName,
  children,
}: FieldShellProps) => {
  const iconRef = React.useRef<HTMLButtonElement>(null);

  return (
    <DateFieldRoot>
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
      <RadixPopover.Root open={open} onOpenChange={setOpen} modal>
        <Box $status={status}>
          {children}
          <CalendarAnchor>
            <IconButton
              ref={iconRef}
              type="button"
              label={`Choose ${calendarName} from calendar`}
              icon={<CalendarDays />}
              size="xs"
              intent="secondary"
              variant="ghost"
              disabled={disabled}
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            />
          </CalendarAnchor>
        </Box>
        <RadixPopover.Portal>
          <PopoverContent
            side="bottom"
            align="center"
            sideOffset={8}
            collisionPadding={8}
            avoidCollisions
            onPointerDownOutside={(event) => {
              const target = event.detail.originalEvent.target as Node | null;
              if (target && iconRef.current?.contains(target)) event.preventDefault();
            }}
          >
            {calendar}
          </PopoverContent>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    </DateFieldRoot>
  );
};

interface SingleFieldProps {
  label: string;
  showLabelInfo: boolean;
  required: boolean;
  status: DateStatus;
  disabled: boolean;
  value: string;
  helperId?: string;
  ariaLabel?: string;
  onChange: (value: string) => void;
}

const SingleField = ({
  label,
  showLabelInfo,
  required,
  status,
  disabled,
  value,
  helperId,
  ariaLabel,
  onChange,
}: SingleFieldProps) => {
  const generatedId = React.useId();
  const inputId = `${generatedId}-input`;
  const [open, setOpen] = React.useState(false);
  const parsed = parseDisplayDate(value);

  const commit = (next: Date | CalendarRangeValue | null) => {
    if (next instanceof Date) onChange(dateToDisplay(next));
    setOpen(false);
  };

  return (
    <FieldShell
      label={label}
      showLabelInfo={showLabelInfo}
      required={required}
      status={status}
      disabled={disabled}
      inputId={inputId}
      open={open}
      setOpen={setOpen}
      calendarName={(ariaLabel ?? label) || 'date'}
      calendar={
        <Calendar
          key={String(open)}
          defaultValue={parsed}
          onCancel={() => setOpen(false)}
          onConfirm={commit}
        />
      }
    >
      <TextInput
        id={inputId}
        value={value}
        disabled={disabled}
        required={required}
        inputMode="numeric"
        autoComplete="off"
        placeholder="MM/DD/YY"
        size={8}
        aria-label={ariaLabel ?? label}
        aria-describedby={helperId}
        aria-invalid={status === 'error' || undefined}
        onChange={(event) => onChange(formatDateInput(event.target.value))}
        onBlur={(event) => onChange(formatDateInput(event.target.value))}
      />
    </FieldShell>
  );
};

interface RangeFieldProps {
  label: string;
  startLabel: string;
  endLabel: string;
  showLabelInfo: boolean;
  required: boolean;
  status: DateStatus;
  disabled: boolean;
  rangeValue: DateRangeValue;
  helperId?: string;
  onChange: (key: keyof DateRangeValue, value: string) => void;
  onRangeChange: (value: DateRangeValue) => void;
}

const RangeField = ({
  label,
  startLabel,
  endLabel,
  showLabelInfo,
  required,
  status,
  disabled,
  rangeValue,
  helperId,
  onChange,
  onRangeChange,
}: RangeFieldProps) => {
  const generatedId = React.useId();
  const startId = `${generatedId}-start`;
  const endId = `${generatedId}-end`;
  const [open, setOpen] = React.useState(false);

  const commit = (next: Date | CalendarRangeValue | null) => {
    if (next && !(next instanceof Date)) {
      onRangeChange({
        start: next.start ? dateToDisplay(next.start) : '',
        end: next.end ? dateToDisplay(next.end) : next.start ? dateToDisplay(next.start) : '',
      });
    }
    setOpen(false);
  };

  return (
    <FieldShell
      label={label}
      showLabelInfo={showLabelInfo}
      required={required}
      status={status}
      disabled={disabled}
      inputId={startId}
      open={open}
      setOpen={setOpen}
      calendarName={label || 'date range'}
      calendar={
        <Calendar
          key={String(open)}
          mode="range"
          defaultRangeValue={toCalendarRange(rangeValue)}
          onCancel={() => setOpen(false)}
          onConfirm={commit}
        />
      }
    >
      <TextInput
        $bold
        id={startId}
        value={rangeValue.start}
        disabled={disabled}
        required={required}
        inputMode="numeric"
        autoComplete="off"
        placeholder="MM/DD/YY"
        size={8}
        aria-label={startLabel}
        aria-describedby={helperId}
        aria-invalid={status === 'error' || undefined}
        onChange={(event) => onChange('start', formatDateInput(event.target.value))}
        onBlur={(event) => onChange('start', formatDateInput(event.target.value))}
      />
      <RangeDash aria-hidden>—</RangeDash>
      <TextInput
        $bold
        id={endId}
        value={rangeValue.end}
        disabled={disabled}
        required={required}
        inputMode="numeric"
        autoComplete="off"
        placeholder="MM/DD/YY"
        size={8}
        aria-label={endLabel}
        aria-describedby={helperId}
        aria-invalid={status === 'error' || undefined}
        onChange={(event) => onChange('end', formatDateInput(event.target.value))}
        onBlur={(event) => onChange('end', formatDateInput(event.target.value))}
      />
    </FieldShell>
  );
};

export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  (
    {
      mode = 'single',
      label,
      startLabel = 'Start date',
      endLabel = 'End date',
      showLabelInfo = false,
      required = false,
      helperText,
      showHelper = true,
      status = 'default',
      disabled = false,
      value,
      defaultValue,
      onValueChange,
      rangeValue,
      defaultRangeValue,
      onRangeValueChange,
      'aria-label': ariaLabel,
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const helperId = `${generatedId}-helper`;
    const [innerValue, setInnerValue] = React.useState(() => formatDateInput(defaultValue ?? ''));
    const [innerRangeValue, setInnerRangeValue] = React.useState<DateRangeValue>(() => ({
      start: formatDateInput(defaultRangeValue?.start ?? ''),
      end: formatDateInput(defaultRangeValue?.end ?? ''),
    }));

    const resolvedLabel = label ?? (mode === 'range' ? 'Select date range' : 'Select date');
    const currentValue = formatDateInput(value ?? innerValue);
    const currentRangeValue = {
      start: formatDateInput(rangeValue?.start ?? innerRangeValue.start),
      end: formatDateInput(rangeValue?.end ?? innerRangeValue.end),
    };
    const tone: HelperTone = disabled
      ? 'disabled'
      : status === 'success'
        ? 'success'
        : status === 'error'
          ? 'error'
          : 'greyscale';
    const resolvedHelperText =
      helperText ??
      (mode === 'range' ? 'Enter a start and end date for the range' : 'Enter a date or pick from calendar');

    const updateSingle = (next: string) => {
      setInnerValue(next);
      onValueChange?.(next);
    };

    const updateRange = (key: keyof DateRangeValue, next: string) => {
      const updated = { ...currentRangeValue, [key]: next };
      setInnerRangeValue(updated);
      onRangeValueChange?.(updated);
    };

    const replaceRange = (updated: DateRangeValue) => {
      setInnerRangeValue(updated);
      onRangeValueChange?.(updated);
    };

    return (
      <Root ref={ref}>
        {mode === 'range' ? (
          <RangeField
            label={resolvedLabel}
            startLabel={startLabel}
            endLabel={endLabel}
            showLabelInfo={showLabelInfo}
            required={required}
            status={status}
            disabled={disabled}
            rangeValue={currentRangeValue}
            helperId={showHelper ? helperId : undefined}
            onChange={updateRange}
            onRangeChange={replaceRange}
          />
        ) : (
          <SingleField
            label={resolvedLabel}
            showLabelInfo={showLabelInfo}
            required={required}
            status={status}
            disabled={disabled}
            value={currentValue}
            helperId={showHelper ? helperId : undefined}
            ariaLabel={ariaLabel}
            onChange={updateSingle}
          />
        )}
        {showHelper ? (
          <HelperString id={helperId} tone={tone}>
            {resolvedHelperText}
          </HelperString>
        ) : null}
      </Root>
    );
  },
);

DateInput.displayName = 'DateInput';
