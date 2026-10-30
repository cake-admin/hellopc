import React from 'react';
import styled, { css } from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { addMonths, isSameDay, startOfMonth } from './dateParse';

/**
 * hello pc Calendar (Figma `&calendar`, node 4890:20174) — the month grid,
 * month picker, and year picker used by Date Input and Date Range Picker.
 *
 * The panel is a 252×330 popover surface: header (prev/next + Month/Year
 * `xs` buttons), a 7-column 32×24 day grid or a 3-column month/year picker,
 * and a footer (Today, Cancel, OK). Range mode paints a contiguous
 * `--color-tonal-tonal-lightest` ribbon that wraps row to row, with start/end
 * as tonal chips on top.
 *
 * Reuses hello pc Button and IconButton. No Radix primitive covers a date
 * grid, so the panel is a labelled dialog-shaped `<div>` with a `role="grid"`
 * for the days. Popover chrome (portal, focus trap) lives on the field that
 * opens it.
 */

/** Figma 4890:20175 — years shown on one picker page (not a spacing token). */
const YEAR_PAGE_SIZE = 15;

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export type CalendarMode = 'single' | 'range';
export type CalendarView = 'day' | 'month' | 'year';

export interface CalendarRangeValue {
  start: Date | null;
  end: Date | null;
}

export interface CalendarProps {
  /**
   * Single-date grid or a start/end range (Figma selected 1 vs selected 2).
   * @default 'single'
   */
  mode?: CalendarMode;
  /** Controlled selected date for `mode="single"`. */
  value?: Date | null;
  /** Uncontrolled initial date for `mode="single"`. */
  defaultValue?: Date | null;
  /** Fires on each day click in single mode (draft). OK still goes through `onConfirm`. */
  onValueChange?: (date: Date | null) => void;
  /** Controlled start/end for `mode="range"`. */
  rangeValue?: CalendarRangeValue;
  /** Uncontrolled initial range. */
  defaultRangeValue?: CalendarRangeValue;
  /** Fires on each range-draft change. */
  onRangeValueChange?: (range: CalendarRangeValue) => void;
  /**
   * Starting inner view. Stories use this to show the month/year pickers.
   * @default 'day'
   */
  defaultView?: CalendarView;
  /** Accessible name for the panel. @default 'Choose date' */
  'aria-label'?: string;
  /** Footer Today — jumps the grid to today and selects it. */
  onToday?: () => void;
  /** Footer Cancel. */
  onCancel?: () => void;
  /** Footer OK. Receives the draft single date or range. */
  onConfirm?: (next: Date | CalendarRangeValue | null) => void;
}

type DayTone = 'empty' | 'outside' | 'inRange' | 'start' | 'end' | 'selected';

/** 7×32px columns + 6×2px gaps + 8px body padding on each side = 252px. */
const Panel = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: calc((7 * var(--space-600)) + (6 * var(--space-025)) + (2 * var(--space-100)));
  max-width: 100%;
  overflow: hidden;
  border-radius: var(--radius-400);
  background: var(--color-surfaces-container);
  box-shadow: var(--elevation-3);
  font-family: var(--font-family);
  color: var(--color-text-icon-primary);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-300) var(--space-100);
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);
`;

const HeaderCluster = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

const Body = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-100);
  min-height: calc(
    var(--space-500) + var(--space-100) + (6 * var(--space-500)) + (5 * var(--space-025))
  );
  padding: var(--space-100);
`;

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, var(--space-600));
  column-gap: var(--space-025);
  justify-content: center;
`;

const Weekday = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-600);
  height: var(--space-500);
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1px;
  line-height: 1.35;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, var(--space-600));
  column-gap: var(--space-025);
  row-gap: var(--space-025);
  justify-content: center;
  overflow: visible;
`;

const DayCell = styled.div<{
  $ribbon: boolean;
  $roundLeft: boolean;
  $roundRight: boolean;
  $extendRight: boolean;
}>`
  position: relative;
  width: var(--space-600);
  height: var(--space-500);

  ${(p) =>
    p.$ribbon &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: ${p.$extendRight ? 'calc(var(--space-025) * -1)' : '0'};
        background: var(--color-tonal-tonal-lightest);
        border-radius: ${p.$roundLeft && p.$roundRight
          ? 'var(--radius-1000)'
          : p.$roundLeft
            ? 'var(--radius-1000) 0 0 var(--radius-1000)'
            : p.$roundRight
              ? '0 var(--radius-1000) var(--radius-1000) 0'
              : '0'};
        pointer-events: none;
      }
    `}
`;

const DayButton = styled.button<{ $tone: DayTone }>`
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  border-radius: var(--radius-1000);
  background: transparent;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1px;
  line-height: 1.35;
  cursor: pointer;

  ${(p) =>
    p.$tone === 'outside' &&
    css`
      color: var(--color-text-icon-placeholder);
    `}

  ${(p) =>
    (p.$tone === 'start' || p.$tone === 'end' || p.$tone === 'selected') &&
    css`
      background: var(--color-tonal-tonal);
      color: var(--color-text-icon-on-tonal-inverse);
    `}

  &:hover:not(:disabled) {
    ${(p) =>
      p.$tone === 'empty' || p.$tone === 'outside'
        ? css`
            background: var(--color-secondary-secondary-overlay);
          `
        : ''}
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

const PickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-100);
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-300) var(--space-200);
  border-top: var(--stroke-100) solid var(--color-stroke-border);
`;

const FooterEnd = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
`;

const EMPTY_RANGE: CalendarRangeValue = { start: null, end: null };

const daysInMonthGrid = (month: Date) => {
  const first = startOfMonth(month);
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    return { date, inMonth: date.getMonth() === month.getMonth() };
  });
};

const yearPageStart = (year: number) => year - 9;

const orderRange = (a: Date, b: Date): CalendarRangeValue =>
  a.getTime() <= b.getTime() ? { start: a, end: b } : { start: b, end: a };

const inInclusiveRange = (date: Date, start: Date, end: Date) => {
  const t = date.getTime();
  return t >= start.getTime() && t <= end.getTime();
};

const ribbonFor = (tone: DayTone, col: number) => {
  const isStart = tone === 'start';
  const isEnd = tone === 'end';
  const ribbon = tone === 'inRange' || isStart || isEnd;
  const roundLeft = isStart || (ribbon && col === 0);
  const roundRight = isEnd || (ribbon && col === 6);
  return {
    ribbon,
    roundLeft,
    roundRight,
    extendRight: ribbon && !roundRight,
  };
};

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = 'single',
      value,
      defaultValue = null,
      onValueChange,
      rangeValue,
      defaultRangeValue,
      onRangeValueChange,
      defaultView = 'day',
      'aria-label': ariaLabel = 'Choose date',
      onToday,
      onCancel,
      onConfirm,
    },
    ref,
  ) => {
    const isRange = mode === 'range';
    const [view, setView] = React.useState<CalendarView>(defaultView);
    const [innerValue, setInnerValue] = React.useState<Date | null>(defaultValue);
    const [innerRange, setInnerRange] = React.useState<CalendarRangeValue>(
      defaultRangeValue ?? EMPTY_RANGE,
    );
    const [hovered, setHovered] = React.useState<Date | null>(null);

    const selected = value !== undefined ? value : innerValue;
    const range = {
      start: rangeValue?.start !== undefined ? rangeValue.start : innerRange.start,
      end: rangeValue?.end !== undefined ? rangeValue.end : innerRange.end,
    };

    const seed = (isRange ? range.start ?? range.end : selected) ?? new Date();
    const [displayedMonth, setDisplayedMonth] = React.useState(() => startOfMonth(seed));

    const setSelected = (next: Date | null) => {
      setInnerValue(next);
      onValueChange?.(next);
    };

    const setRange = (next: CalendarRangeValue) => {
      setInnerRange(next);
      onRangeValueChange?.(next);
    };

    const goToday = () => {
      const today = new Date();
      setDisplayedMonth(startOfMonth(today));
      setView('day');
      if (isRange) {
        setRange({ start: today, end: null });
      } else {
        setSelected(today);
      }
      onToday?.();
    };

    const confirm = () => {
      if (isRange) {
        onConfirm?.(range.start ? range : null);
      } else {
        onConfirm?.(selected);
      }
    };

    const handleDayClick = (date: Date) => {
      setDisplayedMonth(startOfMonth(date));
      if (!isRange) {
        setSelected(date);
        return;
      }
      if (!range.start || range.end) {
        setRange({ start: date, end: null });
        return;
      }
      setRange(orderRange(range.start, date));
    };

    const previewEnd =
      isRange && range.start && !range.end && hovered && !isSameDay(hovered, range.start)
        ? hovered
        : range.end;
    const previewRange =
      isRange && range.start && previewEnd ? orderRange(range.start, previewEnd) : range;

    const dayTone = (date: Date, inMonth: boolean): DayTone => {
      if (isRange && previewRange.start) {
        const start = previewRange.start;
        const end = previewRange.end;
        if (end && isSameDay(date, start) && isSameDay(date, end)) return 'selected';
        if (isSameDay(date, start) && end && !isSameDay(start, end)) return 'start';
        if (end && isSameDay(date, end) && !isSameDay(start, end)) return 'end';
        if (end && inInclusiveRange(date, start, end)) return 'inRange';
        if (!end && isSameDay(date, start)) return 'selected';
      }
      if (!isRange && selected && isSameDay(date, selected)) return 'selected';
      if (!inMonth) return 'outside';
      return 'empty';
    };

    const monthLabel = MONTHS[displayedMonth.getMonth()];
    const yearLabel = String(displayedMonth.getFullYear());
    const years = Array.from(
      { length: YEAR_PAGE_SIZE },
      (_, i) => yearPageStart(displayedMonth.getFullYear()) + i,
    );

    const stepHeader = (direction: -1 | 1) => {
      if (view === 'year') {
        setDisplayedMonth(
          new Date(displayedMonth.getFullYear() + direction * YEAR_PAGE_SIZE, displayedMonth.getMonth(), 1),
        );
        return;
      }
      if (view === 'month') {
        setDisplayedMonth(new Date(displayedMonth.getFullYear() + direction, displayedMonth.getMonth(), 1));
        return;
      }
      setDisplayedMonth(addMonths(displayedMonth, direction));
    };

    return (
      <Panel ref={ref} role="dialog" aria-label={ariaLabel}>
        <Header>
          <HeaderCluster>
            <IconButton
              type="button"
              label={view === 'year' ? 'Previous years' : view === 'month' ? 'Previous year' : 'Previous month'}
              icon={<ChevronLeft />}
              size="xs"
              intent="secondary"
              variant="ghost"
              onClick={() => stepHeader(-1)}
            />
            <Button
              type="button"
              size="xs"
              intent={view === 'month' ? 'primary' : 'secondary'}
              variant={view === 'month' ? 'fill' : 'tonal'}
              underline={false}
              aria-pressed={view === 'month'}
              onClick={() => setView((v) => (v === 'month' ? 'day' : 'month'))}
            >
              {monthLabel}
            </Button>
            <Button
              type="button"
              size="xs"
              intent={view === 'year' ? 'primary' : 'secondary'}
              variant={view === 'year' ? 'fill' : 'tonal'}
              underline={false}
              aria-pressed={view === 'year'}
              onClick={() => setView((v) => (v === 'year' ? 'day' : 'year'))}
            >
              {yearLabel}
            </Button>
            <IconButton
              type="button"
              label={view === 'year' ? 'Next years' : view === 'month' ? 'Next year' : 'Next month'}
              icon={<ChevronRight />}
              size="xs"
              intent="secondary"
              variant="ghost"
              onClick={() => stepHeader(1)}
            />
          </HeaderCluster>
        </Header>

        <Body>
          {view === 'day' ? (
            <>
              <WeekdayRow aria-hidden>
                {WEEKDAYS.map((day, i) => (
                  <Weekday key={`${day}-${i}`}>{day}</Weekday>
                ))}
              </WeekdayRow>
              <DayGrid role="grid" aria-label={`${monthLabel} ${yearLabel}`}>
                {daysInMonthGrid(displayedMonth).map(({ date, inMonth }, index) => {
                  const tone = dayTone(date, inMonth);
                  const isToday = isSameDay(date, new Date());
                  const ribbon = ribbonFor(tone, index % 7);
                  return (
                    <DayCell
                      key={date.toISOString()}
                      $ribbon={ribbon.ribbon}
                      $roundLeft={ribbon.roundLeft}
                      $roundRight={ribbon.roundRight}
                      $extendRight={ribbon.extendRight}
                    >
                      <DayButton
                        type="button"
                        $tone={tone}
                        aria-label={date.toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        aria-current={isToday ? 'date' : undefined}
                        aria-selected={
                          tone === 'selected' || tone === 'start' || tone === 'end' || undefined
                        }
                        onMouseEnter={() => setHovered(date)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleDayClick(date)}
                      >
                        {date.getDate()}
                      </DayButton>
                    </DayCell>
                  );
                })}
              </DayGrid>
            </>
          ) : view === 'month' ? (
            <PickerGrid>
              {MONTHS.map((name, index) => {
                const selectedMonth = index === displayedMonth.getMonth();
                return (
                  <Button
                    key={name}
                    type="button"
                    size="xs"
                    fullWidth
                    intent={selectedMonth ? 'primary' : 'secondary'}
                    variant={selectedMonth ? 'tonal' : 'ghost'}
                    underline={false}
                    aria-pressed={selectedMonth}
                    onClick={() => {
                      setDisplayedMonth(new Date(displayedMonth.getFullYear(), index, 1));
                      setView('day');
                    }}
                  >
                    {name}
                  </Button>
                );
              })}
            </PickerGrid>
          ) : (
            <PickerGrid>
              {years.map((year) => {
                const selectedYear = year === displayedMonth.getFullYear();
                return (
                  <Button
                    key={year}
                    type="button"
                    size="xs"
                    fullWidth
                    intent={selectedYear ? 'primary' : 'secondary'}
                    variant={selectedYear ? 'tonal' : 'ghost'}
                    underline={false}
                    aria-pressed={selectedYear}
                    onClick={() => {
                      setDisplayedMonth(new Date(year, displayedMonth.getMonth(), 1));
                      setView('day');
                    }}
                  >
                    {year}
                  </Button>
                );
              })}
            </PickerGrid>
          )}
        </Body>

        <Footer>
          <Button type="button" size="sm" intent="secondary" variant="tonal" onClick={goToday}>
            Today
          </Button>
          <FooterEnd>
            <Button type="button" size="sm" intent="secondary" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" size="sm" intent="primary" variant="fill" onClick={confirm}>
              OK
            </Button>
          </FooterEnd>
        </Footer>
      </Panel>
    );
  },
);

Calendar.displayName = 'Calendar';

export default Calendar;
