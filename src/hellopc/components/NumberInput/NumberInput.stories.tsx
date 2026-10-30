import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { NumberInput } from './NumberInput';

const meta = {
  title: 'Components/Number Input',
  component: NumberInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A numeric stepper field, **composed from the reusable form elements**:
[Input Label](?path=/docs/elements-input-label--docs) above and an optional
[Helper String](?path=/docs/elements-helper-string--docs) below — stacked with
a \`--space-100\` label gap per the Figma auto-layout. The decrement/increment
buttons **reuse [Icon Button](?path=/docs/components-button-icon-button--docs)**
(\`variant="ghost"\`, \`intent="secondary"\`) rather than reimplementing icon
buttons from scratch.

Every color, spacing, radius, and stroke value resolves from the hello pc design
tokens as CSS custom properties, whose names mirror the Figma variables 1:1 —
the **Theme** toolbar toggle re-themes every example on this page live via
\`[data-theme]\`.

The field walks the Figma state machine on its own: resting/hover (dim
secondary-colored value) → **typing** (white surface, 1.5px primary border,
value promotes to full-strength ink) → **finished typing** (white surface,
darker hairline). \`status\` overlays validation (success/error tint + border),
and \`disabled\` flattens everything — but keeps a visible border, unlike
\`TextInput\`'s borderless disabled (verified against the Figma export).
Renders a native \`<input type="number">\` with the browser spin arrows hidden
in favor of the hello pc stepper buttons; arrow-key stepping still works for free.

## Usage

\`\`\`tsx
<NumberInput label="Quantity" />
<NumberInput label="Quantity" required helperText="Max 10 per order" max={10} />
<NumberInput label="Quantity" defaultValue={2} min={0} max={10} />
<NumberInput label="Quantity" step={5} />
<NumberInput label="Quantity" status="error" helperText="Out of stock" />
<NumberInput label="Quantity" size="sm" />
<NumberInput label="Quantity" disabled />
\`\`\`

## Design tokens used

| State | Field | Value text |
| --- | --- | --- |
| resting / hover | \`--color-surfaces-on-container-high\` fill, \`--stroke-100\` \`--color-stroke-border\` (hover: \`-high\`) | \`--color-text-icon-secondary\` |
| typing (focus) | \`--color-surfaces-container\` fill, \`--stroke-150\` \`--color-primary-primary\` | \`--color-text-icon-primary\` |
| finished (has value) | \`--color-surfaces-container\` fill, \`--stroke-100\` \`--color-stroke-border-high\` | \`--color-text-icon-primary\` |
| success | \`--color-success-success-overlay\` fill, \`--stroke-150\` \`--color-success-success\` | \`--color-text-icon-primary\` |
| error | \`--color-error-error-overlay\` fill, \`--stroke-150\` \`--color-error-error\` | \`--color-text-icon-primary\` |
| disabled | \`--color-disabled-disabled\` fill, \`--stroke-100\` \`--color-disabled-disabled-inverse\` border | \`--color-disabled-disabled-inverse\` |

Shape is \`--radius-200\` (12px); heights are 40px (\`md\`) / 32px (\`sm\`), matching
the stepper buttons' \`IconButton\` \`md\`/\`sm\` diameters 1:1; the value inset is
\`--space-200\` leading / \`--space-100\` trailing.

## Accessibility

- The label is a real \`<label htmlFor>\`; a labelless field must get
  \`aria-label\`. The helper (when present) is wired via \`aria-describedby\`.
- The stepper buttons get accessible names derived from the field label
  ("Decrease Quantity" / "Increase Quantity") via \`IconButton\`'s required
  \`label\` prop, and are real, independently focusable \`<button>\`s.
- Native \`min\`/\`max\`/\`step\` attributes give the browser's own spinbutton
  semantics; arrow-key stepping keeps working even though the visual spin
  arrows are hidden. Buttons disable themselves at the \`min\`/\`max\` bound.
- Focus is conveyed by the typing border (\`--stroke-150\` primary) — restyled,
  never removed. \`status="error"\` also sets \`aria-invalid\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Set \`min\`/\`max\` whenever the value has real bounds. | Let users step past a physically impossible quantity. |
| Use \`step\` to match the domain (e.g. \`5\` for a pack size). | Force single-unit stepping when the domain moves in bulk. |
| Put validation errors in \`helperText\` with \`status="error"\`. | Signal errors with color alone. |
| Use \`size="sm"\` in dense layouts only. | Mix field sizes within one form. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Label',
    helperText: undefined,
    size: 'md',
    status: 'default',
    required: false,
    showLabelInfo: false,
    disabled: false,
    step: 1,
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    suffix: { control: 'text', table: { category: 'Content' } },
    showLabelInfo: { control: 'boolean', table: { category: 'Content' } },
    showDecrement: { control: 'boolean', table: { category: 'Content' } },
    showIncrement: { control: 'boolean', table: { category: 'Content' } },
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Appearance' } },
    status: {
      control: 'inline-radio',
      options: ['default', 'success', 'error'],
      table: { category: 'State' },
    },
    required: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: 'number', table: { category: 'State' } },
    min: { control: 'number', table: { category: 'Behavior' } },
    max: { control: 'number', table: { category: 'Behavior' } },
    step: { control: 'number', table: { category: 'Behavior' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 200 }}>{children}</div>
);
const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 200 }}>{children}</div>
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
          'The state walk: click the first field and step or type to see ' +
          'resting → typing (primary border) → finished. `status` renders the ' +
          'success/error treatments; disabled flattens to the disabled tokens ' +
          '(with a visible border, unlike TextInput).',
      },
    },
  },
  render: () => (
    <Stack>
      <NumberInput label="Resting / try stepping" required showLabelInfo />
      <NumberInput label="Success" defaultValue={4} status="success" helperText="In stock" />
      <NumberInput label="Error" defaultValue={99} status="error" helperText="Exceeds stock" max={20} />
      <NumberInput label="Disabled" defaultValue={2} disabled />
    </Stack>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Two heights (Figma 40pt / 32pt): `md` 40px with 40px stepper ' +
          'buttons, `sm` 32px with 32px buttons — both use `IconButton`\'s ' +
          '24px icon.',
      },
    },
  },
  render: () => (
    <Stack>
      <NumberInput label="Medium (40px)" defaultValue={3} />
      <NumberInput label="Small (32px)" size="sm" defaultValue={3} />
    </Stack>
  ),
};

export const MinMaxStep: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`min`/`max` clamp the value and disable the stepper button at the ' +
          'bound; `step` sets the increment (try the pack-size example).',
      },
    },
  },
  render: () => (
    <Stack>
      <NumberInput label="Seats (0–4)" defaultValue={0} min={0} max={4} helperText="Max 4 per booking" />
      <NumberInput label="Pack size" defaultValue={10} min={0} step={5} helperText="Steps by 5" />
    </Stack>
  ),
};

export const SingleStepper: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`showDecrement`/`showIncrement` hide either stepper button — useful ' +
          'for count-up-only or count-down-only fields.',
      },
    },
  },
  render: () => (
    <Stack>
      <NumberInput label="Count up only" defaultValue={0} showDecrement={false} />
      <NumberInput label="Count down only" defaultValue={10} showIncrement={false} />
    </Stack>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: both sizes across resting / filled / success / ' +
          'error / disabled. Use it with the Theme toolbar to audit both ' +
          '`light.a` and `dark.a` at a glance.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 200 }}>
          <NumberInput size={size} label="Resting" required showLabelInfo />
          <NumberInput size={size} label="Filled" defaultValue={4} />
          <NumberInput size={size} label="Success" defaultValue={4} status="success" helperText="In stock" />
          <NumberInput size={size} label="Error" defaultValue={99} status="error" helperText="Exceeds stock" max={20} />
          <NumberInput size={size} label="Disabled" defaultValue={2} disabled />
        </div>
      ))}
    </div>
  ),
};

/** Pure interaction test (hidden from the docs page): the stepper buttons increment/decrement and clamp at the bounds. */
export const StepsFire: Story = {
  tags: ['!autodocs'],
  args: { label: 'Quantity', defaultValue: 1, min: 0, max: 2, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const increment = canvas.getByRole('button', { name: /increase quantity/i });
    const decrement = canvas.getByRole('button', { name: /decrease quantity/i });
    const input = canvas.getByLabelText(/quantity/i);

    await userEvent.click(increment);
    await expect(args.onValueChange).toHaveBeenCalledWith(2);
    await expect(input).toHaveValue(2);

    // At max: the increment button clamps and disables.
    await userEvent.click(increment);
    await expect(increment).toBeDisabled();

    await userEvent.click(decrement);
    await userEvent.click(decrement);
    await userEvent.click(decrement);
    await expect(decrement).toBeDisabled();
    await expect(input).toHaveValue(0);
  },
};
