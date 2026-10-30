import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { RadioGroup, Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  subcomponents: { Radio },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A **single-select** control set — the user picks exactly one option from a
short, mutually-exclusive list. Use it when all options are worth showing at
once (2–7 or so). For many options use a Select; for independent on/off
choices use Checkbox, and for a single instant on/off use Switch.

Composed of two pieces: **\`RadioGroup\`** owns the selected value and keyboard
navigation, and **\`Radio\`** is one option inside it. Every color, radius,
stroke, and spacing value resolves from the hello pc design tokens as CSS custom
properties (\`--color-*\`, \`--radius-*\`, \`--stroke-*\`, \`--space-*\`), whose
names mirror the Figma variables 1:1 — the **Theme** toolbar toggle re-themes
every example on this page live via \`[data-theme]\`.

Built on the Radix \`RadioGroup\` primitive: it renders \`role="radiogroup"\`
with \`role="radio"\` items, moves selection with the arrow keys (roving
tabindex), and selects with Space. hello pc supplies only the visuals — a 24px
target with a 16px ring, an 8px selected dot, a hover wash, and a focus ring.

## Usage

\`\`\`tsx
<RadioGroup defaultValue="standard" aria-label="Shipping speed">
  <Radio value="standard" label="Standard" />
  <Radio value="express" label="Express" />
  <Radio value="overnight" label="Overnight" disabled />
</RadioGroup>

// Controlled, laid out in a row:
<RadioGroup value={plan} onValueChange={setPlan} orientation="horizontal" aria-label="Plan">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
</RadioGroup>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Ring (unchecked) | \`--stroke-200\` \`--color-text-icon-secondary\` |
| Ring + dot (checked) | \`--color-primary-primary\`, hover \`--color-primary-primary-hover\` |
| Hover wash (24px) | \`--color-surfaces-primary\` |
| Focus ring (20px) | \`--stroke-200\` \`--color-primary-primary\` |
| Disabled | ring \`--color-disabled-disabled\`, disc \`--color-disabled-disabled-inverse\`, dot \`--color-disabled-disabled\` |
| Label | \`--font-family\` + \`--type-size-body\`, \`--color-text-icon-primary\`; disabled \`--color-disabled-disabled-inverse\` |
| Shape / gap | \`--radius-1000\` ring, dot, wash; \`--space-100\` (vertical / label) · \`--space-300\` (horizontal) |

## Accessibility

- Radix provides \`role="radiogroup"\` + \`role="radio"\`, arrow-key selection
  (roving tabindex), and Space to select — don't re-implement any of it.
- **Give the group a name**: a visible heading wired with \`aria-labelledby\`,
  or an \`aria-label\` on \`RadioGroup\` — otherwise assistive tech can't say
  what the choices are for.
- Each \`Radio\`'s visible \`label\` is wired via \`<label htmlFor>\`, so
  clicking the text selects the option. A labelless radio must pass
  \`aria-label\`.
- The focus ring is drawn on \`:focus-visible\` and never removed.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for one choice from a small, visible set. | Use for multi-select — that's Checkbox. |
| Always name the group (heading or \`aria-label\`). | Ship an unlabeled group. |
| Preselect a sensible default when one exists. | Force a hidden/empty initial state when a default is obvious. |
| Keep option labels parallel and short. | Mix a Radio group with unrelated toggles. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    defaultValue: 'standard',
    orientation: 'vertical',
    disabled: false,
    'aria-label': 'Shipping speed',
    onValueChange: fn(),
  },
  argTypes: {
    defaultValue: { control: 'text', table: { category: 'State' } },
    value: { control: 'text', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'State' } },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      table: { category: 'Appearance' },
    },
    name: { control: 'text', table: { category: 'Content' } },
    'aria-label': { control: 'text', table: { category: 'Content' } },
    children: { control: false, table: { category: 'Content' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const SHIPPING = (
  <>
    <Radio value="standard" label="Standard (5–7 days)" />
    <Radio value="express" label="Express (2–3 days)" />
    <Radio value="overnight" label="Overnight" />
  </>
);

/** Interactive playground — drive the group props from the Controls panel below. */
export const Playground: Story = {
  render: (args) => <RadioGroup {...args}>{SHIPPING}</RadioGroup>,
};

export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The default layout: options stacked with a `--space-100` gap. Arrow ' +
          'keys move the selection; the chosen option shows the primary ring + dot.',
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="express" aria-label="Shipping speed">
      {SHIPPING}
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Row layout (`orientation="horizontal"`, `--space-300` gap) for short ' +
          'labels or compact forms.',
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="pro" orientation="horizontal" aria-label="Plan">
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" />
      <Radio value="team" label="Team" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A single option can be disabled, or the whole group via ' +
          '`RadioGroup disabled`. Disabled radios flatten to a ' +
          '`--color-disabled-disabled-inverse` disc with a ' +
          '`--color-disabled-disabled` ring, and the label dims.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <RadioGroup defaultValue="express" aria-label="One option disabled">
        <Radio value="standard" label="Standard" />
        <Radio value="express" label="Express" />
        <Radio value="overnight" label="Overnight" disabled />
      </RadioGroup>
      <RadioGroup defaultValue="a" disabled aria-label="Whole group disabled">
        <Radio value="a" label="Selected + disabled" />
        <Radio value="b" label="Unselected + disabled" />
      </RadioGroup>
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: unselected vs selected, each in enabled and disabled ' +
          'states. Use it with the Theme toolbar to audit both `light.a` and ' +
          '`dark.a` at a glance.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <RadioGroup defaultValue="on" aria-label="Enabled">
        <Radio value="off" label="Unselected" />
        <Radio value="on" label="Selected" />
      </RadioGroup>
      <RadioGroup defaultValue="on" disabled aria-label="Disabled">
        <Radio value="off" label="Unselected" />
        <Radio value="on" label="Selected" />
      </RadioGroup>
    </div>
  ),
};

/** Pure interaction test (hidden from the docs page): selecting fires `onValueChange`. */
export const SelectsFire: Story = {
  tags: ['!autodocs'],
  args: { onValueChange: fn() },
  render: (args) => (
    <RadioGroup {...args} defaultValue="standard">
      {SHIPPING}
    </RadioGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const express = canvas.getByRole('radio', { name: /express/i });
    await userEvent.click(express);
    await expect(args.onValueChange).toHaveBeenCalledWith('express');
  },
};
