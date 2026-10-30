import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { DateInput } from './DateInput';

const meta = {
  title: 'Components/Date Input',
  component: DateInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Date Input collects a typed \`MM/DD/YY\` date and opens the hello pc
[Calendar](?path=/docs/components-calendar--docs) from a trailing
[Icon Button](?path=/docs/components-icon-button--docs). The typed segment
hugs its value the same way Time Input does — clicking it focuses for entry,
it does not open the calendar. It composes [Input
Label](?path=/docs/elements-input-label--docs) with [Helper
String](?path=/docs/elements-helper-string--docs). Use
[Date Range Picker](?path=/docs/components-date-range-picker--docs) (or
\`mode="range"\`) for a start/end interval in one combined field. Use Time
Input when the value also needs a time of day.

Every color, spacing, radius, stroke, and type value resolves from hello pc CSS
custom properties mirroring the Figma variables. The **Theme** toolbar
re-themes every example live; nothing is hardcoded.

Typed digits may overflow six characters so \`MMDDYYYY\` can be entered; the
visible value always collapses to \`MM/DD/YY\`. Two-digit years expand with a
rolling **+20** window: \`2000 + yy\`, unless that date is more than 20 years
ahead of today, in which case it becomes \`1900 + yy\` (in 2026, \`46\` → 2046
and \`47\` → 1947). Only the IconButton opens the calendar, in a Radix
Popover aligned to the bottom-center of the icon (it flips when there is no
room). Cancel discards the draft; OK writes the field.

## Usage

\`\`\`tsx
<DateInput />
<DateInput label="Appointment date" required showLabelInfo />
<DateInput defaultValue="09/30/26" />
<DateInput mode="range" />
<DateInput status="error" helperText="Choose a valid date" />
<DateInput mode="range" disabled />
\`\`\`

## Design tokens used

| Part · state | Tokens |
| --- | --- |
| resting field | \`--color-surfaces-on-container-high\`, \`--stroke-100\`, \`--color-stroke-border\` |
| hover | \`--color-stroke-border-high\` |
| typing / focus | \`--color-surfaces-container\`, \`--stroke-150\`, \`--color-primary-primary\` |
| validation | \`--color-success-success-overlay\` / \`--color-success-success\`; \`--color-error-error-overlay\` / \`--color-error-error\` |
| calendar action | **IconButton** \`xs\` \`ghost\` \`secondary\` |
| range dash | \`--font-weight-bold\`, \`--color-text-icon-primary\`, \`--space-050\` (4px) on both sides |
| disabled | \`--color-disabled-disabled\`, \`--color-disabled-disabled-inverse\` |
| labels / helper | reused InputLabel and HelperString token recipes |
| layout / shape | \`--space-050\`, \`--space-200\`, \`--radius-200\` |

The field is \`inline-flex\` and hugs \`MM/DD/YY\`, like Time Input. Range is
one control: two segments, an em dash, and the IconButton.
The popover Calendar is documented on its own page.

## Accessibility

- The visible label is a real \`<label htmlFor>\` that focuses the (start)
  text input. Supply an \`aria-label\` for a labelless single field.
  \`startLabel\` / \`endLabel\` name the two range segments for assistive tech.
- The calendar control is a real IconButton (\`aria-haspopup="dialog"\`) that
  opens a \`role="dialog"\` Calendar. Clicking a typed segment focuses it for
  entry and does not open the panel.
- Error state applies \`aria-invalid\` and Helper String is wired through
  \`aria-describedby\`; disabled state blocks typing and calendar actions.
- Parent forms should validate calendar ordering for ranges and any product
  rules such as minimum/maximum dates.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use the \`MM/DD/YY\` display contract consistently within a product flow. | Mix regional date formats in adjacent controls. |
| Use range mode (or Date Range Picker) when one helper covers both dates. | Build a date range from two unrelated single controls. |
| Validate date availability and ordering in the parent form. | Treat formatting as proof the date is allowed. |
| Let users type or choose from the hello pc Calendar. | Reintroduce a native \`<input type="date">\` picker beside this field. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Select date',
    required: false,
    showLabelInfo: true,
    showHelper: true,
    status: 'default',
    disabled: false,
    onValueChange: fn(),
    onRangeValueChange: fn(),
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range'], table: { category: 'Appearance' } },
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
    value: { control: 'text', table: { category: 'Behavior' } },
    defaultValue: { control: 'text', table: { category: 'Behavior' } },
    rangeValue: { control: false, table: { category: 'Behavior' } },
    defaultRangeValue: { control: false, table: { category: 'Behavior' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    onRangeValueChange: { action: 'rangeValueChange', table: { category: 'Events' } },
    'aria-label': { control: 'text', table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Modes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The Figma single and double variants. Range is one combined field ' +
          '(`MM/DD/YY — MM/DD/YY`) with a shared helper string.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <DateInput label="Select date" showLabelInfo />
      <DateInput mode="range" showLabelInfo />
    </div>
  ),
};

export const FilledValues: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prepopulated values preserve the Figma display format. The calendar action ' +
          'writes the single date, or both ends of a range, on OK.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <DateInput label="Appointment date" defaultValue="09/30/26" helperText="Local date" />
      <DateInput
        mode="range"
        defaultRangeValue={{ start: '09/30/26', end: '10/03/26' }}
      />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Focus a default field to view the primary Figma typing border. Success and error use ' +
          'the shared hello pc semantic overlays; disabled blocks text entry and picker activation.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <DateInput label="Default / focus to edit" />
      <DateInput label="Success" defaultValue="09/30/26" status="success" helperText="Date available" />
      <DateInput label="Error" status="error" helperText="Choose a valid date" />
      <DateInput label="Disabled" disabled />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix covers the Figma single/range variants alongside filled, validation, ' +
          'and disabled states. Audit under both themes with the Theme toolbar.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <DateInput label="Resting" showLabelInfo />
      <DateInput label="Filled" defaultValue="09/30/26" />
      <DateInput label="Error" status="error" helperText="Choose a valid date" />
      <DateInput label="Disabled" disabled />
      <DateInput mode="range" />
      <DateInput mode="range" status="success" helperText="Date range available" />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): typing formats a date and announces it through onValueChange. */
export const FormatsDate: Story = {
  tags: ['!autodocs'],
  args: { label: 'Meeting date', helperText: undefined, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Meeting date');

    await userEvent.type(input, '010126');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('01/01/26');
    await expect(input).toHaveValue('01/01/26');
  },
};

/** Pure interaction test: eight typed digits collapse a four-digit year to YY. */
export const CollapsesFourDigitYear: Story = {
  tags: ['!autodocs'],
  args: { label: 'Historic date', helperText: undefined, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Historic date');

    await userEvent.type(input, '01011984');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('01/01/84');
    await expect(input).toHaveValue('01/01/84');
  },
};

/** Pure interaction test: years more than 20 ahead of now resolve to 19xx in the calendar. */
export const WindowsTwoDigitYear: Story = {
  tags: ['!autodocs'],
  args: { label: 'Archive date', helperText: undefined, defaultValue: '01/01/47' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /from calendar/i }));
    const dialog = await within(document.body).findByRole('dialog', { name: 'Choose date' });
    const from2000 = 2047;
    const fullYear = from2000 > new Date().getFullYear() + 20 ? 1947 : from2000;
    await expect(within(dialog).getByRole('button', { name: String(fullYear) })).toBeVisible();
  },
};

/** Pure interaction test: OK on the calendar writes the field. */
export const PicksFromCalendar: Story = {
  tags: ['!autodocs'],
  args: { label: 'Meeting date', helperText: undefined, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /from calendar/i }));
    const dialog = await within(document.body).findByRole('dialog', { name: 'Choose date' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Today' }));
    await userEvent.click(within(dialog).getByRole('button', { name: 'OK' }));
    await expect(args.onValueChange).toHaveBeenCalled();
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    await expect(canvas.getByLabelText('Meeting date')).toHaveValue(`${mm}/${dd}/${yy}`);
  },
};
