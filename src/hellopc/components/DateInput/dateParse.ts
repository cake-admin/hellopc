/**
 * Display-date helpers for Date Input / Calendar.
 *
 * Visible contract is always `MM/DD/YY`. Two-digit years expand with a
 * rolling window: `2000 + yy`, unless that lands more than
 * `YEAR_FUTURE_WINDOW` years ahead of now — then `1900 + yy`. In 2026 that
 * means `46` → 2046 and `47` → 1947. Four-digit typed years collapse to the
 * last two digits (`1984` → `84`) and then expand through the same window.
 */

/** Years ahead of the current calendar year that still map to 20xx. */
export const YEAR_FUTURE_WINDOW = 20;

export function expandTwoDigitYear(yy: number, now = new Date()): number {
  const from2000 = 2000 + yy;
  if (from2000 > now.getFullYear() + YEAR_FUTURE_WINDOW) {
    return 1900 + yy;
  }
  return from2000;
}

export function sanitizeDateDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8);
}

/** Progressive `MM/DD/YY` formatting. Eight digits (`MMDDYYYY`) collapse the year to YY. */
export function formatDateInput(value: string): string {
  const digits = sanitizeDateDigits(value);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  const month = digits.slice(0, 2);
  const day = digits.slice(2, 4);
  const yearPart = digits.slice(4);
  const yy = yearPart.length >= 4 ? yearPart.slice(-2) : yearPart;
  return `${month}/${day}/${yy}`;
}

export function parseDisplayDate(value: string, now = new Date()): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return null;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = expandTwoDigitYear(Number(match[3]), now);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

export function isValidDisplayDate(value: string, now = new Date()): boolean {
  return parseDisplayDate(value, now) !== null;
}

export function dateToDisplay(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

export function isoToDisplay(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? `${match[2]}/${match[3]}/${match[1].slice(-2)}` : '';
}

export function displayToIso(value: string, now = new Date()): string {
  const date = parseDisplayDate(value, now);
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}
