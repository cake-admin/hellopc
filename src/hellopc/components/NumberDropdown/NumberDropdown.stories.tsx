import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { NumberDropdown } from './NumberDropdown';

const meta = {
  title: 'Components/Number Dropdown',
  component: NumberDropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A compact, numeric-only select for small closed ranges — page size, quantity
caps, pagination counts. Composed from the reusable form elements:
[Input Label](?path=/docs/elements-input-label--docs) above and an optional
[Helper String](?path=/docs/elements-helper-string--docs) below (neither shown
in this Figma frame, included for consistency with
[Dropdown](?path=/docs/components-dropdown--docs)). Use \`Dropdown\` instead
for text options; use this when every option is a number.

Every color, spacing, radius, and stroke value resolves from the hello pc design
tokens as CSS custom properties, whose names mirror the Figma variables 1:1 —
the **Theme** toolbar toggle re-themes every example on this page live via
\`[data-theme]\`.

Unlike \`Dropdown\`, this field has a fixed compact width — 80px at \`md\` or
64px at \`sm\`, exactly matching the Figma component — and the menu shows a
**persistent selected highlight**, not just a hover wash, since picking a
number is a quick glance-and-confirm interaction. Built on the Radix
\`Select\` primitive — Radix owns behavior and accessibility; hello pc owns the
visuals.

## Usage

\`\`\`tsx
<NumberDropdown options={[1, 2, 3, 4, 5]} />
<NumberDropdown label="Rows per page" options={[10, 25, 50, 100]} defaultValue={25} />
<NumberDropdown size="sm" options={[1, 2, 3]} />
<NumberDropdown options={[1, 2, 3]} disabled />
<NumberDropdown options={[{ value: 1, label: '1 seat' }, { value: 2, label: '2 seats' }]} />
\`\`\`

## Design tokens used

| Part · state | Background | Border | Text |
| --- | --- | --- | --- |
| trigger · resting | \`--color-surfaces-on-container-high\` | \`--stroke-100\` \`--color-stroke-border\` | \`--color-text-icon-placeholder\` |
| trigger · hover | \`--color-surfaces-on-container-high\` | \`--color-stroke-border-high\` | – |
| trigger · open | \`--color-surfaces-container\` | \`--stroke-150\` \`--color-primary-primary\` | \`--color-text-icon-primary\` |
| trigger · has value | \`--color-surfaces-on-container-high\` | \`--color-stroke-border-high\` | \`--color-text-icon-primary\` |
| trigger · disabled | \`--color-disabled-disabled\` | none | \`--color-disabled-disabled-inverse\` |
| menu · container | \`--color-surfaces-container\` | \`--radius-200\`, \`--elevation-3\` | – |
| menu item · resting | transparent | \`--radius-50\` | \`--color-text-icon-secondary\` |
| menu item · highlighted | \`--color-tonal-tonal-secondary-overlay-hover\` | – | \`--color-text-icon-on-tonal-secondary\` |
| menu item · selected | \`--color-tonal-tonal-overlay\` | – | \`--color-text-icon-on-tonal\` |
| menu item · disabled | transparent | – | \`--color-disabled-disabled-inverse\` |

Trigger shape is \`--radius-200\` (12px); fixed widths are 80px (\`md\`) /
64px (\`sm\`); heights are 40px (\`md\`, 24px arrow) / 32px (\`sm\`, 18px
arrow). Menu items are 36px tall, \`--space-100\` padding, \`--space-025\`
gap, \`--space-050\` viewport padding.

**Deviations from Figma** (design corrections): menu item text is
corrected from Figma's raw "Segoe UI" to \`--font-family\`; the selected item's
"Semibold" weight has no matching token, so it uses \`--font-weight-medium\`.

## Accessibility

- Radix renders a real listbox: the trigger has \`role="combobox"\`, options
  have \`role="option"\`, and the current value is announced.
- Keyboard: open with Space/Enter/↑/↓, move with the arrows, type-ahead to
  jump, Enter to choose, Escape to close — all provided by Radix.
- The label is a real \`<label htmlFor>\`; a labelless field must get an
  \`aria-label\`. The helper is wired via \`aria-describedby\`.
- Focus is conveyed by the primary border (\`--stroke-150\`) — restyled, never
  removed.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use it when every option is a number (page size, counts). | Use it for text options — use \`Dropdown\` instead. |
| Keep the option list short (≈5–10 values). | Use it for large open-ended numeric ranges — use \`NumberInput\`'s stepper. |
| Always provide a label (or \`aria-label\`). | Use the placeholder as the label. |
| Set a sensible \`defaultValue\` when one exists. | Pre-open the menu to "show" the options. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: '0',
    helperText: undefined,
    options: [1, 2, 3, 4, 5],
    size: 'md',
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
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Appearance' } },
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: 'number', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    name: { control: false, table: { category: 'Behavior' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof NumberDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The state walk: open the first field to see the open chrome (white ' +
          'surface, primary border, arrow up, selected item highlighted); the ' +
          'second shows a chosen value while closed; disabled flattens to the ' +
          'disabled tokens.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <NumberDropdown {...args} label="Open me" />
      <NumberDropdown {...args} label="Has value" defaultValue={3} />
      <NumberDropdown {...args} label="Disabled" defaultValue={3} disabled />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Two heights (Figma 40pt / 32pt): `md` 40px with a 24px arrow, `sm` ' +
          '32px with an 18px arrow.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <NumberDropdown label="Medium (40px)" options={[1, 2, 3, 4, 5]} />
      <NumberDropdown label="Small (32px)" size="sm" options={[1, 2, 3, 4, 5]} />
    </div>
  ),
};

export const CustomLabels: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Options accept a plain `number[]` or `{ value, label }` objects when ' +
          'the display text needs a unit or word around the number.',
      },
    },
  },
  render: () => (
    <NumberDropdown
      label="Party size"
      defaultValue={2}
      options={[
        { value: 1, label: '1 guest' },
        { value: 2, label: '2 guests' },
        { value: 3, label: '3 guests' },
        { value: 4, label: '4 guests' },
      ]}
    />
  ),
};

export const RowsPerPage: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A realistic pagination control: `Dropdown`-family fields compose ' +
          'freely alongside plain text, matching their inline baseline.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-family)', fontSize: 'var(--type-size-body)' }}>
        Rows per page:
      </span>
      <NumberDropdown options={[10, 25, 50, 100]} defaultValue={25} size="sm" aria-label="Rows per page" />
    </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
      <NumberDropdown label="Resting" options={[1, 2, 3, 4, 5]} required showLabelInfo />
      <NumberDropdown label="Has value" defaultValue={2} options={[1, 2, 3, 4, 5]} helperText="Example helper string" />
      <NumberDropdown label="No helper" defaultValue={1} options={[1, 2, 3, 4, 5]} />
      <NumberDropdown label="Disabled" defaultValue={2} options={[1, 2, 3, 4, 5]} disabled />
    </div>
  ),
};

/** Pure interaction test (hidden from the docs page): opening and choosing an option fires onValueChange with a number. */
export const SelectsFire: Story = {
  tags: ['!autodocs'],
  args: { label: 'Count', options: [1, 2, 3, 4, 5], onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: /count/i });
    await userEvent.click(trigger);
    // Radix Select renders the listbox in a portal, outside canvasElement.
    const option = await waitFor(() => within(document.body).getByRole('option', { name: '3' }));
    await userEvent.click(option);
    await expect(args.onValueChange).toHaveBeenCalledWith(3);
    await expect(trigger).toHaveTextContent('3');
  },
};
