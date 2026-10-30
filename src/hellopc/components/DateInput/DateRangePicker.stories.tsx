import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { DateRangePicker } from './DateRangePicker';

const meta = {
  title: 'Components/Date Range Picker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Date Range Picker is the Figma combined Date Input (\`type=double\`, node
4890:19510) with a shared range [Calendar](?path=/docs/components-calendar--docs)
(selected 2). It is the named export for \`<DateInput mode="range" />\` so
product code can import a range control without a mode flag. Use a single
Date Input when there is only one date.

Every color, spacing, radius, stroke, and type value resolves from hello pc CSS
custom properties. The **Theme** toolbar re-themes every example live;
nothing is hardcoded.

The control is one 40px field that hugs \`MM/DD/YY — MM/DD/YY\` plus an
IconButton. Each segment still accepts typed \`MM/DD/YY\` (including overflow
\`MMDDYYYY\` and the +20 year window). Only the IconButton opens the range
Calendar, anchored to the icon; OK writes both start and end. Hover and
selection use the wrapping tonal ribbon on the grid.

## Usage

\`\`\`tsx
<DateRangePicker />
<DateRangePicker label="Travel dates" required showLabelInfo />
<DateRangePicker defaultRangeValue={{ start: '09/30/26', end: '10/03/26' }} />
<DateRangePicker status="error" helperText="Choose a valid interval" />
<DateRangePicker disabled />
\`\`\`

## Design tokens used

| Part · state | Tokens |
| --- | --- |
| field | same recipe as Date Input; hugs content, \`--radius-200\` |
| range dash | \`--font-weight-bold\`, \`--color-text-icon-primary\`, \`--space-050\` (4px) on both sides |
| calendar action | **IconButton** \`xs\` \`ghost\` \`secondary\` |

## Accessibility

- One visible \`<label htmlFor>\` names the control. \`startLabel\` and
  \`endLabel\` are the accessible names of the two typed segments. The shared
  helper is referenced from both via \`aria-describedby\`.
- The calendar IconButton opens a \`role="dialog"\` range Calendar, aligned
  to the bottom-center of the icon. Typed segments do not open the panel.
- Validate chronological order in the parent form — the control formats
  dates; it does not prove the interval is allowed.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use this when one helper and one validation rule cover both dates. | Place two unrelated Date Inputs for a single interval. |
| Let the range Calendar set start and end together. | Require the user to open two native pickers for one range. |
| Keep the \`MM/DD/YY\` display contract. | Mix four-digit years in one segment and two-digit in the other. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Select date range',
    startLabel: 'Start date',
    endLabel: 'End date',
    required: false,
    showLabelInfo: true,
    showHelper: true,
    status: 'default',
    disabled: false,
    onRangeValueChange: fn(),
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    startLabel: { control: 'text', table: { category: 'Content' } },
    endLabel: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    showLabelInfo: { control: 'boolean', table: { category: 'Content' } },
    required: { control: 'boolean', table: { category: 'State' } },
    status: {
      control: 'inline-radio',
      options: ['default', 'success', 'error'],
      table: { category: 'State' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    showHelper: { control: 'boolean', table: { category: 'Behavior' } },
    rangeValue: { control: false, table: { category: 'Behavior' } },
    defaultRangeValue: { control: false, table: { category: 'Behavior' } },
    onRangeValueChange: { action: 'rangeValueChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const FilledValues: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'A prepopulated interval. The calendar action opens the shared range Calendar.',
      },
    },
  },
  args: {
    defaultRangeValue: { start: '09/30/26', end: '10/03/26' },
  },
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Success, error, and disabled use the same semantic overlays as Date Input.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <DateRangePicker />
      <DateRangePicker
        status="success"
        defaultRangeValue={{ start: '09/30/26', end: '10/03/26' }}
        helperText="Date range available"
      />
      <DateRangePicker status="error" helperText="Choose a valid interval" />
      <DateRangePicker disabled />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'QA matrix. Audit under both themes with the Theme toolbar.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <DateRangePicker />
      <DateRangePicker defaultRangeValue={{ start: '09/30/26', end: '10/03/26' }} />
      <DateRangePicker status="error" helperText="Choose a valid interval" />
      <DateRangePicker disabled />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): the calendar commits a range. */
export const CommitsRangeFromCalendar: Story = {
  tags: ['!autodocs'],
  args: { helperText: undefined, onRangeValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /from calendar/i }));
    const dialog = await within(document.body).findByRole('dialog', { name: 'Choose date' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Today' }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'OK' }));
    await expect(args.onRangeValueChange).toHaveBeenCalled();
  },
};
