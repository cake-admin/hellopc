import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Dropdown, type DropdownOption } from './Dropdown';

const OPTIONS: DropdownOption[] = [
  { label: 'Menu item one', value: 'one' },
  { label: 'Menu item two', value: 'two' },
  { label: 'Menu item three', value: 'three' },
  { label: 'Menu item four', value: 'four' },
];

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A single-select field, **composed from the reusable form elements**:
[Input Label](?path=/docs/elements-input-label--docs) above, the select
trigger, and [Helper String](?path=/docs/elements-helper-string--docs) below —
stacked with a \`--space-100\` label gap and a \`--space-050\` helper gap per
the Figma auto-layout. Use [Radio](?path=/docs/components-radio--docs) instead
when there are only a few options and they should all be visible at once.

Every color, spacing, radius, and stroke value resolves from the hello pc design
tokens as CSS custom properties, whose names mirror the Figma variables 1:1 —
the **Theme** toolbar toggle re-themes every example on this page live via
\`[data-theme]\`.

The trigger walks the Figma state machine: resting (\`--color-stroke-border\`
hairline) → hover (border darkens to \`--color-stroke-border-high\`) → **open**
(white surface, 1.5px primary border, the arrow flips up) → **finish
selecting** (greyish surface, \`--color-stroke-border-high\` border, the chosen
value shown). \`disabled\` flattens everything.

Built on the Radix \`Select\` primitive — Radix owns the behavior and
accessibility (listbox roles, typeahead, arrow-key roving focus, Escape to
close, \`data-state\`); hello pc owns the visuals. The label is wired via
\`htmlFor\` and the helper via \`aria-describedby\`.

## Usage

\`\`\`tsx
<Dropdown label="Country" options={options} />
<Dropdown label="Country" required helperText="Pick one" options={options} />
<Dropdown label="Country" defaultValue="one" options={options} />
<Dropdown label="Country" placeholder="Choose a region" options={options} />
<Dropdown label="Country" disabled options={options} />
<Dropdown label="Country" options={[{ label: 'Blocked', value: 'x', disabled: true }]} />
\`\`\`

## Design tokens used

| Part · state | Background | Border | Text |
| --- | --- | --- | --- |
| trigger · resting | \`--color-surfaces-on-container-high\` | \`--stroke-100\` \`--color-stroke-border\` | \`--color-text-icon-placeholder\` |
| trigger · hover | \`--color-surfaces-on-container-high\` | \`--color-stroke-border-high\` | – |
| trigger · open | \`--color-surfaces-container\` | \`--stroke-150\` \`--color-primary-primary\` | \`--color-text-icon-primary\` |
| trigger · has value | \`--color-surfaces-on-container-high\` | \`--color-stroke-border-high\` | \`--color-text-icon-primary\` |
| trigger · disabled | \`--color-disabled-disabled\` | none | \`--color-disabled-disabled-inverse\` |
| menu · container | \`--color-surfaces-container\` | \`--radius-300\`, \`--elevation-3\` | – |
| menu item · resting | transparent | \`--radius-200\` | \`--color-secondary-secondary\` |
| menu item · highlighted | \`--color-tonal-tonal-secondary-overlay-hover\` | – | \`--color-text-icon-on-tonal-secondary\` |
| menu item · press | \`--color-tonal-tonal-secondary-overlay-press\` | – | – |
| menu item · disabled | transparent | – | \`--color-disabled-disabled-inverse\` |

On Windows HCT (\`data-theme="win hct"\`), stroke/surface tokens collapse, so the
trigger hover/open states use \`--color-surfaces-inverse-container\` +
\`--color-primary-primary\`, highlighted items use the inverse surface, and a
checked (non-highlighted) item keeps \`--color-text-icon-primary\` so it stays
readable on the dark menu.
Trigger shape is \`--radius-200\` (12px); height is 40px with a 24px arrow;
paddings are \`--space-200\` trigger + \`--space-100\` inner text inset. Menu
items are 36px tall with \`--space-100\` padding; text is \`--type-size-body\`.

**Deviations from Figma** (design corrections): the chosen value renders in
\`--color-text-icon-primary\` rather than Figma's placeholder grey.

## Accessibility

- Radix renders a real listbox: the trigger has \`role="combobox"\`, options
  have \`role="option"\`, and the current value is announced.
- Keyboard: open with Space/Enter/↑/↓, move with the arrows, type-ahead to
  jump, Enter to choose, Escape to close — all provided by Radix.
- The label is a real \`<label htmlFor>\`; a labelless field must get an
  \`aria-label\`. The helper is wired via \`aria-describedby\`.
- Focus is conveyed by the primary border (\`--stroke-150\`) — restyled, never
  removed. \`required\` renders the visible "(required)" suffix.

## Do / Don't

| Do | Don't |
| --- | --- |
| Always provide a label (or \`aria-label\`). | Use the placeholder as the label. |
| Use for 5+ options or space-constrained forms. | Use it for 2–4 always-visible choices (use Radio). |
| Keep option labels short and scannable. | Pack long sentences into menu items. |
| Set a \`defaultValue\` when a sensible default exists. | Pre-open the menu to "show" the options. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Select...',
    helperText: 'Example helper string',
    options: OPTIONS,
    required: false,
    showLabelInfo: false,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    showLabelInfo: { control: 'boolean', table: { category: 'Content' } },
    options: { control: false, table: { category: 'Content' } },
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: 'text', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    name: { control: false, table: { category: 'Behavior' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 320 }}>{children}</div>
);
const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  decorators: [(Story) => <Frame>{Story()}</Frame>],
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The state walk: open the first field to see the open chrome (white ' +
          'surface, primary border, arrow up); the second shows "finish ' +
          'selecting" with a value; disabled flattens to the disabled tokens.',
      },
    },
  },
  render: (args) => (
    <Stack>
      <Dropdown {...args} label="Default / open me" helperText="Example helper string" required showLabelInfo />
      <Dropdown {...args} label="Finish selecting" defaultValue="two" helperText="Example helper string" />
      <Dropdown {...args} label="Disabled" defaultValue="two" helperText="Example helper string" disabled />
    </Stack>
  ),
};

export const WithValue: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A `defaultValue` puts the field in the "finish selecting" state: the ' +
          'greyish surface keeps a `--color-stroke-border-high` border and the ' +
          'chosen value renders in `--color-text-icon-primary`.',
      },
    },
  },
  render: (args) => (
    <Frame>
      <Dropdown {...args} label="Region" defaultValue="three" helperText="You can change it any time" />
    </Frame>
  ),
};

export const DisabledOption: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Individual options can be disabled — they render in ' +
          '`--color-disabled-disabled-inverse` and cannot be highlighted or ' +
          'chosen. Open the menu to see the third item blocked.',
      },
    },
  },
  render: (args) => (
    <Frame>
      <Dropdown
        {...args}
        label="Plan"
        helperText="Some plans are unavailable"
        options={[
          { label: 'Starter', value: 'starter' },
          { label: 'Pro', value: 'pro' },
          { label: 'Enterprise (contact sales)', value: 'ent', disabled: true },
        ]}
      />
    </Frame>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: resting / has value / disabled, with and without a ' +
          'helper. Use it with the Theme toolbar to audit both `light.a` and ' +
          '`dark.a` at a glance.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 320 }}>
      <Dropdown label="Resting" placeholder="Select..." options={OPTIONS} helperText="Example helper string" required showLabelInfo />
      <Dropdown label="Has value" defaultValue="two" options={OPTIONS} helperText="Example helper string" />
      <Dropdown label="No helper" defaultValue="one" options={OPTIONS} />
      <Dropdown label="Disabled" defaultValue="two" options={OPTIONS} helperText="Example helper string" disabled />
    </div>
  ),
};

/** Pure interaction test (hidden from the docs page): opening and choosing an option fires onValueChange. */
export const SelectsFire: Story = {
  tags: ['!autodocs'],
  args: { label: 'Fruit', helperText: 'Pick one', options: OPTIONS, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /fruit/i });
    await userEvent.click(trigger);
    // Radix Select renders the listbox in a portal, outside canvasElement.
    const option = await waitFor(() => within(document.body).getByRole('option', { name: 'Menu item two' }));
    await userEvent.click(option);
    await expect(args.onValueChange).toHaveBeenCalledWith('two');
    await expect(trigger).toHaveTextContent('Menu item two');
  },
};
