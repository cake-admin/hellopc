import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { TimeInput } from './TimeInput';

const meta = {
  title: 'Components/Time Input',
  component: TimeInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Time Input collects a 12-hour time through separate hours and minutes segments
plus an AM/PM selector. It composes [Input
Label](?path=/docs/elements-input-label--docs) and [Helper
String](?path=/docs/elements-helper-string--docs); use \`mode="range"\` when
one shared helper describes a start/end interval. Use Number Input for a
quantity rather than a clock time.

Every color, spacing, radius, stroke, and type value resolves from hello pc CSS
custom properties that mirror the Figma variables. The **Theme** toolbar
re-themes every example live; nothing is hardcoded.

Hours and minutes render as native numeric-text inputs for predictable mobile
keyboards and form behavior. Extra digits overflow the 2-character slot so
\`0934\` fills hours and minutes together, and 24-hour values (\`1924\`) convert
to 12-hour + AM/PM. Radix ToggleGroup owns the mutually exclusive AM/PM
selector. Values remain segment objects while a user is typing; on blur,
hours clamp to 01–12 and minutes to 00–59. The range mode is independently
controlled through \`rangeValue\` / \`onRangeValueChange\`.

## Usage

\`\`\`tsx
<TimeInput />
<TimeInput label="Appointment time" required showLabelInfo />
<TimeInput defaultValue={{ hours: '09', minutes: '30', period: 'AM' }} />
<TimeInput mode="range" startLabel="Start time" endLabel="End time" />
<TimeInput status="error" helperText="Choose a valid time" />
<TimeInput mode="range" disabled />
\`\`\`

## Design tokens used

| Part · state | Tokens |
| --- | --- |
| resting time control | \`--color-surfaces-on-container-high\`, \`--stroke-100\`, \`--color-stroke-border\` |
| hover | \`--color-stroke-border-high\` |
| editing / focus | \`--color-surfaces-container\`, \`--stroke-150\`, \`--color-primary-primary\` |
| active period | \`--color-primary-primary\`, \`--color-text-icon-on-primary\` |
| inactive period | \`--color-tonal-tonal-secondary-overlay\`, \`--color-text-icon-on-tonal-secondary\` |
| inactive-period hover | \`--color-tonal-tonal-secondary-overlay-hover\` |
| validation | \`--color-success-success-overlay\` / \`--color-success-success\`; \`--color-error-error-overlay\` / \`--color-error-error\` |
| disabled | \`--color-disabled-disabled\`, \`--color-disabled-disabled-inverse\` |
| labels / helper | reused InputLabel and HelperString token recipes |
| layout / focus | \`--space-050\`, \`--space-100\`, \`--space-200\`, \`--space-800\`, \`--radius-200\`, \`--radius-100\`, \`--stroke-200\` |

Figma intrinsic geometry is a 40px-high time control. The range fields use the
Figma \`--space-800\` (48px) gap and wrap only when the available layout is too
narrow.

## Accessibility

- Each label is a real \`<label htmlFor>\` that focuses its hours segment; use
  the component in a labelled context rather than relying on placeholders.
- Hours/minutes expose clear segment names and numeric mobile input modes.
  Normalization happens on blur, so an incomplete value is not overwritten
  mid-entry.
- Radix ToggleGroup makes AM/PM a mutually exclusive keyboard-operable choice.
- Validation sets \`aria-invalid\` through the group’s validation styling and
  Helper String supplies explanatory text; disabled fields disable all inputs
  and period choices.

## Do / Don't

| Do | Don't |
| --- | --- |
| Let 24-hour typing (\`1924\`) convert to 12-hour + PM. | Keep 24-hour numbers in the displayed hour segment. |
| Use range mode for one start/end interval. | Place two separate Time Inputs when their validation is shared. |
| Add helper guidance for timezone or duration context. | Assume a time alone communicates its timezone. |
| Validate chronological ranges in the parent form. | Treat the component’s segment bounds as range-order validation. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Select time',
    required: true,
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
    value: { control: false, table: { category: 'Behavior' } },
    defaultValue: { control: false, table: { category: 'Behavior' } },
    rangeValue: { control: false, table: { category: 'Behavior' } },
    defaultRangeValue: { control: false, table: { category: 'Behavior' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    onRangeValueChange: { action: 'rangeValueChange', table: { category: 'Events' } },
    'aria-label': { control: 'text', table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof TimeInput>;

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
          'The Figma component’s single and double variants. Range renders one shared Helper String ' +
          'and the 48px `--space-800` gap between the start and end time controls.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <TimeInput label="Select time" required showLabelInfo />
      <TimeInput mode="range" required showLabelInfo />
    </div>
  ),
};

export const FilledValues: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prepopulated values remain segmented so authors can validate and update a period independently. ' +
          'Click a period choice or edit an individual segment to see the editing treatment.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <TimeInput
        label="Appointment time"
        defaultValue={{ hours: '09', minutes: '30', period: 'AM' }}
        helperText="Local time"
      />
      <TimeInput
        mode="range"
        defaultRangeValue={{
          start: { hours: '09', minutes: '00', period: 'AM' },
          end: { hours: '05', minutes: '30', period: 'PM' },
        }}
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
          'Focus a default control to see the Figma editing border. Success and error use the shared ' +
          'form-field semantic overlays; disabled dims every input and period choice.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <TimeInput label="Default / focus to edit" />
      <TimeInput
        label="Success"
        defaultValue={{ hours: '10', minutes: '15', period: 'AM' }}
        status="success"
        helperText="Time available"
      />
      <TimeInput label="Error" status="error" helperText="Choose a valid time" />
      <TimeInput label="Disabled" disabled />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: both Figma modes with default, filled, validation, and disabled treatments. ' +
          'Audit this under both themes with the Theme toolbar.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <TimeInput label="Resting" required showLabelInfo />
      <TimeInput label="Filled" defaultValue={{ hours: '09', minutes: '30', period: 'AM' }} />
      <TimeInput label="Error" status="error" helperText="Choose a valid time" />
      <TimeInput label="Disabled" disabled />
      <TimeInput mode="range" />
      <TimeInput mode="range" status="success" helperText="Time range available" />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): entering segments and selecting PM report a normalized time value. */
export const EditsAndSelectsPeriod: Story = {
  tags: ['!autodocs'],
  args: { label: 'Meeting time', helperText: undefined, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const hours = canvas.getByLabelText('Meeting time hours');
    const minutes = canvas.getByLabelText('Meeting time minutes');

    await userEvent.type(hours, '9');
    await userEvent.tab();
    await userEvent.type(minutes, '7');
    await userEvent.tab();
    await userEvent.click(canvas.getByRole('button', { name: 'PM' }));

    await expect(args.onValueChange).toHaveBeenLastCalledWith({ hours: '09', minutes: '07', period: 'PM' });
    await expect(canvas.getByRole('button', { name: 'PM' })).toHaveAttribute('data-state', 'on');
  },
};

/** Pure interaction test: four digits in hours fill hours and minutes (`0934` → 09:34). */
export const OverflowsIntoMinutes: Story = {
  tags: ['!autodocs'],
  args: { label: 'Meeting time', helperText: undefined, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const hours = canvas.getByLabelText('Meeting time hours');

    await userEvent.type(hours, '0934');

    await expect(args.onValueChange).toHaveBeenLastCalledWith({ hours: '09', minutes: '34', period: 'AM' });
    await expect(hours).toHaveValue('09');
    await expect(canvas.getByLabelText('Meeting time minutes')).toHaveValue('34');
  },
};

/** Pure interaction test: 24-hour `1924` becomes 07:24 PM. */
export const ConvertsMilitaryTime: Story = {
  tags: ['!autodocs'],
  args: { label: 'Meeting time', helperText: undefined, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const hours = canvas.getByLabelText('Meeting time hours');

    await userEvent.type(hours, '1924');

    await expect(args.onValueChange).toHaveBeenLastCalledWith({ hours: '07', minutes: '24', period: 'PM' });
    await expect(hours).toHaveValue('07');
    await expect(canvas.getByLabelText('Meeting time minutes')).toHaveValue('24');
    await expect(canvas.getByRole('button', { name: 'PM' })).toHaveAttribute('data-state', 'on');
  },
};
