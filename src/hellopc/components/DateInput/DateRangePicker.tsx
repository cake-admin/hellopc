import React from 'react';

import { DateInput, type DateInputProps } from './DateInput';

/**
 * hello pc Date Range Picker — the Figma combined Date Input (`type=double`,
 * node 4890:19510) plus a range Calendar (selected 2). A thin mode wrapper
 * around DateInput so products can import a named range control without
 * passing `mode`.
 */
export type DateRangePickerProps = Omit<
  DateInputProps,
  'mode' | 'value' | 'defaultValue' | 'onValueChange' | 'aria-label'
>;

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (props, ref) => <DateInput ref={ref} mode="range" {...props} />,
);

DateRangePicker.displayName = 'DateRangePicker';

export default DateRangePicker;
