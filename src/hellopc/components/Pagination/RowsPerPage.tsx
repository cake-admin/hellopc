import React from 'react';
import styled from 'styled-components';

import { NumberDropdown } from '../NumberDropdown/NumberDropdown';

/**
 * hello pc RowsPerPage — the page-size control that sits alongside Pagination
 * (Figma "row select", node 134:8568): a "Rows per page:" label, a numeric
 * dropdown, and the "1-25 of 123" range readout.
 *
 * Pure composition — the dropdown is the existing **NumberDropdown** (Radix
 * `Select` underneath, which is where Figma's `with menu` state comes from), so
 * this component only supplies the label, the layout, and the range text.
 */

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-500);
  font-family: var(--font-family);
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
`;

const Text = styled.span`
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  white-space: nowrap;
`;

export interface RowsPerPageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Selectable page sizes. @default [10, 25, 50, 100] */
  options?: number[];
  /** Controlled rows-per-page value. */
  value?: number;
  /** Uncontrolled initial value. */
  defaultValue?: number;
  /** Fires with the new rows-per-page value. */
  onValueChange?: (value: number) => void;
  /** Text before the dropdown. @default 'Rows per page:' */
  label?: string;
  /** Total number of rows — renders the "1-25 of 123" range readout. */
  total?: number;
  /** Current page (1-based), used to compute the range. @default 1 */
  page?: number;
  /** Replaces the computed range text entirely. */
  rangeLabel?: React.ReactNode;
}

export const RowsPerPage = React.forwardRef<HTMLDivElement, RowsPerPageProps>(
  (
    {
      options = [10, 25, 50, 100],
      value,
      defaultValue,
      onValueChange,
      label = 'Rows per page:',
      total,
      page = 1,
      rangeLabel,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? options[0]);
    const size = value ?? uncontrolled;

    const handleChange = (next: number) => {
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    /* "1-25 of 123" — clamped so the last page doesn't overshoot the total. */
    const range = React.useMemo(() => {
      if (rangeLabel !== undefined) return rangeLabel;
      if (total === undefined) return null;
      if (total === 0) return '0 of 0';
      const start = (page - 1) * size + 1;
      const end = Math.min(page * size, total);
      return `${start}-${end} of ${total}`;
    }, [rangeLabel, total, page, size]);

    return (
      <Group ref={ref} {...props}>
        <Field>
          <Text>{label}</Text>
          <NumberDropdown
            aria-label={label.replace(/:$/, '')}
            options={options}
            value={size}
            onValueChange={handleChange}
          />
        </Field>
        {range !== null ? <Text>{range}</Text> : null}
      </Group>
    );
  },
);

RowsPerPage.displayName = 'RowsPerPage';

export default RowsPerPage;
