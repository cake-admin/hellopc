import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Calendar } from './Calendar';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Calendar is the hello pc date panel (Figma \`&calendar\`, node 4890:20174): a
compact month grid with Month/Year pickers and Today / Cancel / OK. Date Input
and Date Range Picker open it in a Radix Popover, aligned to the calendar
icon; this page documents the panel on its own so the Figma states (default,
selected 1, selected 2, month picker, year picker) can be audited without a
field.

Every color, radius, spacing, type, and elevation value resolves from hello pc
CSS custom properties. The **Theme** toolbar re-themes every example live;
nothing is hardcoded.

The header reuses **IconButton** (prev/next, \`xs\`) and **Button** (Month,
Year \`xs\`; Today / Cancel / OK \`sm\`). Day cells are 32×24 token-sized hit
targets (\`--space-600\` × \`--space-500\`) with \`--space-025\` gutters. Range
mode paints a contiguous \`--color-tonal-tonal-lightest\` ribbon that wraps
across rows, with start/end as tonal chips on top. Selection is a draft until
OK; Cancel discards it.

## Usage

\`\`\`tsx
<Calendar />
<Calendar defaultValue={new Date(2026, 2, 15)} />
<Calendar mode="range" defaultRangeValue={{ start: new Date(2026, 2, 14), end: new Date(2026, 2, 19) }} />
<Calendar defaultView="month" />
<Calendar defaultView="year" />
<Calendar onConfirm={apply} onCancel={close} />
\`\`\`

## Design tokens used

| Part · state | Tokens |
| --- | --- |
| panel | \`--color-surfaces-container\`, \`--radius-400\`, \`--elevation-3\` |
| header / footer rules | \`--stroke-100\`, \`--color-stroke-border\`; header inset \`--space-300\` / \`--space-100\`; footer inset \`--space-300\` / \`--space-200\` |
| month / year (resting) | **Button** \`xs\` \`tonal\` \`secondary\` |
| month / year (active picker) | **Button** \`xs\` \`fill\` \`primary\` |
| prev / next | **IconButton** \`xs\` \`ghost\` \`secondary\` |
| weekday labels | \`--type-size-body\`, \`--font-weight-bold\`, \`--color-text-icon-primary\` |
| day (resting) | transparent, \`--type-size-caption\`, \`--color-text-icon-primary\` |
| day (outside month) | \`--color-text-icon-placeholder\` |
| day (hover) | \`--color-secondary-secondary-overlay\` |
| day (selected / range ends) | \`--color-tonal-tonal\`, \`--color-text-icon-on-tonal-inverse\`, \`--radius-1000\` |
| day (in range ribbon) | \`--color-tonal-tonal-lightest\`; row-wrap rounding via \`--radius-1000\` |
| Today | **Button** \`sm\` \`tonal\` \`secondary\` |
| Cancel | **Button** \`sm\` \`ghost\` \`secondary\` |
| OK | **Button** \`sm\` \`fill\` \`primary\` |
| picker grid | 3 columns, \`--space-100\` gaps |

Figma intrinsic geometry is a 252px-wide panel (7×\`--space-600\` columns +
6×\`--space-025\` gutters + body padding). Header and footer size to their
\`xs\` / \`sm\` buttons.

## Accessibility

- The panel is a \`role="dialog"\` labelled "Choose date" (override with
  \`aria-label\`). Days sit in a \`role="grid"\` named by the visible month.
- Selected days set \`aria-selected\`; today sets \`aria-current="date"\`.
- Month and Year buttons are \`aria-pressed\` while that picker is open.
  Prev/next IconButtons have view-specific names (month, year, or year page).
- Footer actions are real hello pc Buttons. Focus rings use the primary stroke
  token; never remove them.

## Do / Don't

| Do | Don't |
| --- | --- |
| Open Calendar from Date Input / Date Range Picker in product UI. | Drop a native \`<input type="date">\` picker next to these fields. |
| Treat OK as commit and Cancel as discard. | Write the field on every day click unless the product is a live preview. |
| Use \`mode="range"\` for an interval — the ribbon wraps across rows. | Simulate a range by coordinating two unrelated Calendars. |
| Let Month/Year pickers change the displayed grid. | Paginate years with a free-text year field beside the grid. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onValueChange: fn(),
    onRangeValueChange: fn(),
    onCancel: fn(),
    onConfirm: fn(),
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['single', 'range'], table: { category: 'Appearance' } },
    defaultView: {
      control: 'inline-radio',
      options: ['day', 'month', 'year'],
      table: { category: 'Appearance' },
    },
    value: { control: false, table: { category: 'Behavior' } },
    defaultValue: { control: false, table: { category: 'Behavior' } },
    rangeValue: { control: false, table: { category: 'Behavior' } },
    defaultRangeValue: { control: false, table: { category: 'Behavior' } },
    'aria-label': { control: 'text', table: { category: 'Accessibility' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    onRangeValueChange: { action: 'rangeValueChange', table: { category: 'Events' } },
    onToday: { action: 'today', table: { category: 'Events' } },
    onCancel: { action: 'cancel', table: { category: 'Events' } },
    onConfirm: { action: 'confirm', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Calendar>;

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
          'Single selection (Figma selected 1) versus a start/end range (selected 2). ' +
          'The range ribbon is contiguous and wraps from Saturday into the next Sunday.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
      <Calendar defaultValue={new Date(2026, 2, 15)} />
      <Calendar
        mode="range"
        defaultRangeValue={{ start: new Date(2026, 2, 14), end: new Date(2026, 2, 19) }}
      />
    </div>
  ),
};

export const Pickers: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Month picker and year picker — the same 3-column `xs` Button grid Figma uses, with the ' +
          'current value as a primary tonal chip.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
      <Calendar defaultView="month" defaultValue={new Date(2026, 2, 1)} />
      <Calendar defaultView="year" defaultValue={new Date(2026, 2, 1)} />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix of the Figma `&calendar` states. Audit under both themes with the Theme toolbar.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
      <Calendar />
      <Calendar defaultValue={new Date(2026, 2, 15)} />
      <Calendar
        mode="range"
        defaultRangeValue={{ start: new Date(2026, 2, 14), end: new Date(2026, 2, 19) }}
      />
      <Calendar defaultView="month" defaultValue={new Date(2026, 2, 1)} />
      <Calendar defaultView="year" defaultValue={new Date(2026, 2, 1)} />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): Today + OK commits a date. */
export const TodayConfirms: Story = {
  tags: ['!autodocs'],
  args: { onConfirm: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Today' }));
    await userEvent.click(canvas.getByRole('button', { name: 'OK' }));
    await expect(args.onConfirm).toHaveBeenCalled();
    const committed = (args.onConfirm as ReturnType<typeof fn>).mock.calls.at(-1)?.[0] as Date;
    await expect(committed).toBeInstanceOf(Date);
  },
};

/** Pure interaction test: opening the year picker shows the surrounding decade. */
export const OpensYearPicker: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: new Date(2026, 2, 15) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '2026' }));
    await expect(canvas.getByRole('button', { name: '2017' })).toBeVisible();
  },
};
