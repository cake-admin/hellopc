import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Mail, Search, X } from 'lucide-react';

import { TextInput } from './TextInput';

const meta = {
  title: 'Components/Text Input',
  component: TextInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A single-line text field, **composed from the reusable form elements**:
[Input Label](?path=/docs/elements-input-label--docs) above, the input box,
and [Helper String](?path=/docs/elements-helper-string--docs) below — stacked
with a \`--space-100\` label gap and a \`--space-050\` helper gap per the
Figma auto-layout. Use Textarea (future) for multi-line text.

Every color, spacing, radius, and stroke value resolves from the hello pc design
tokens as CSS custom properties, whose names mirror the Figma variables 1:1 —
the **Theme** toolbar toggle re-themes every example on this page live via
\`[data-theme]\`.

The field walks the Figma state machine on its own: resting → hover (border
darkens) → **typing** (white surface, 1.5px primary border, helper turns
info) → **finished typing** (white surface, hairline border). \`status\`
overlays validation (success/error tint + border, helper matches), and
\`disabled\` flattens everything. Renders a native \`<input>\` — no Radix
primitive exists for text fields; the label is wired via \`htmlFor\` and the
helper via \`aria-describedby\`.

## Usage

\`\`\`tsx
<TextInput label="Email" placeholder="you@lenovo.com" />
<TextInput label="Email" required helperText="Use your work email" />
<TextInput label="Search" startIcon={<Search />} endIcon={<X />} />
<TextInput label="Bio" maxLength={250} helperText="Keep it short" />
<TextInput label="Email" status="error" helperText="This field is required" />
<TextInput label="Email" size="sm" />
<TextInput label="Email" disabled />
\`\`\`

## Design tokens used

| State | Field | Helper tone |
| --- | --- | --- |
| resting | \`--color-surfaces-on-container-high\` fill, \`--stroke-100\` \`--color-stroke-border\` | greyscale |
| hover | border \`--color-stroke-border-high\` | greyscale |
| typing (focus) | \`--color-surfaces-container\` fill, \`--stroke-150\` \`--color-primary-primary\` | info |
| finished (has value) | \`--color-surfaces-container\` fill, \`--stroke-100\` \`--color-stroke-border\` | greyscale |
| success | \`--color-success-success-overlay\` fill, \`--stroke-150\` \`--color-success-success\` | success |
| error | \`--color-error-error-overlay\` fill, \`--stroke-150\` \`--color-error-error\` | error |
| disabled | \`--color-disabled-disabled\` fill, no border; text/icons \`--color-disabled-disabled-inverse\` | disabled |

Shape is \`--radius-200\` (12px); heights are 40px (\`md\`, 24px slot icons) /
32px (\`sm\`, 18px icons); paddings are \`--space-200\` box + \`--space-100\`
inner text inset; slot icons sit in \`--color-text-icon-secondary\`; text is
\`--type-size-body\` with \`--color-text-icon-placeholder\` placeholders.

## Accessibility

- The label is a real \`<label htmlFor>\` — clicking it focuses the input; a
  labelless field must get \`aria-label\` (passed through to the input).
- The helper is wired via \`aria-describedby\`, so guidance and errors are
  announced with the field; \`status="error"\` also sets \`aria-invalid\`.
- Focus is conveyed by the typing border (\`--stroke-150\` primary) — restyled,
  never removed.
- \`required\` renders the visible "(required)" suffix *and* sets the native
  attribute.

## Do / Don't

| Do | Don't |
| --- | --- |
| Always provide a label (or \`aria-label\`). | Use placeholder text as the label. |
| Put errors in \`helperText\` with \`status="error"\`. | Signal errors with color alone. |
| Use \`maxLength\` to get the counter for free. | Show a counter without enforcing a limit. |
| Use \`size="sm"\` in dense layouts only. | Mix field sizes within one form. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Placeholder goes here',
    helperText: 'Example helper string',
    size: 'md',
    status: 'default',
    required: false,
    showLabelInfo: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    showLabelInfo: { control: 'boolean', table: { category: 'Content' } },
    startIcon: { control: false, table: { category: 'Content' } },
    endIcon: { control: false, table: { category: 'Content' } },
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Appearance' } },
    status: {
      control: 'inline-radio',
      options: ['default', 'success', 'error'],
      table: { category: 'State' },
    },
    required: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    maxLength: { control: 'number', table: { category: 'Behavior' } },
    onChange: { action: 'change', table: { category: 'Events' } },
  },
} satisfies Meta<typeof TextInput>;

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
          'The state walk: click into the first field and type to see resting → ' +
          'typing (primary border, info helper) → finished. `status` renders the ' +
          'success/error treatments; disabled flattens to the disabled tokens.',
      },
    },
  },
  render: () => (
    <Stack>
      <TextInput label="Resting / try typing" placeholder="Placeholder goes here" helperText="Example helper string" required showLabelInfo />
      <TextInput label="Success" defaultValue="Finished typing!" status="success" helperText="Example helper string" />
      <TextInput label="Error" defaultValue="Finished typing!" status="error" helperText="Example helper string" />
      <TextInput label="Disabled" placeholder="Placeholder goes here" helperText="Example helper string" disabled />
    </Stack>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Two heights (Figma 40pt / 32pt): `md` 40px with 24px slot icons, ' +
          '`sm` 32px with 18px icons. Labels render at 14px in both.',
      },
    },
  },
  render: () => (
    <Stack>
      <TextInput label="Medium (40px)" placeholder="Placeholder goes here" startIcon={<Search />} endIcon={<X />} helperText="Example helper string" />
      <TextInput label="Small (32px)" size="sm" placeholder="Placeholder goes here" startIcon={<Search />} endIcon={<X />} helperText="Example helper string" />
    </Stack>
  ),
};

export const WithSlots: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Leading and trailing slots inside the box — icons inherit ' +
          '`--color-text-icon-secondary` and size to the field (24px / 18px).',
      },
    },
  },
  render: () => (
    <Stack>
      <TextInput label="Search" placeholder="Search components" startIcon={<Search />} />
      <TextInput label="Email" placeholder="you@lenovo.com" startIcon={<Mail />} endIcon={<X />} />
    </Stack>
  ),
};

export const WithCounter: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`maxLength` sets the native limit and shows the helper counter, which ' +
          'tracks as you type (try it) and follows the helper tone.',
      },
    },
  },
  render: () => (
    <Stack>
      <TextInput label="Bio" placeholder="Tell us about yourself" helperText="Keep it short" maxLength={250} />
      <TextInput label="At the limit" defaultValue={'x'.repeat(20)} status="error" helperText="Character limit reached" maxLength={20} />
    </Stack>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: both sizes across resting / filled / success / error / ' +
          'disabled. Use it with the Theme toolbar to audit both `light.a` and ' +
          '`dark.a` at a glance.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      {(['md', 'sm'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 320 }}>
          <TextInput size={size} label="Resting" placeholder="Placeholder goes here" helperText="Example helper string" required showLabelInfo startIcon={<Search />} endIcon={<X />} />
          <TextInput size={size} label="Filled" defaultValue="Finished typing!" helperText="Example helper string" />
          <TextInput size={size} label="Success" defaultValue="Finished typing!" status="success" helperText="Example helper string" maxLength={250} />
          <TextInput size={size} label="Error" defaultValue="Finished typing!" status="error" helperText="Example helper string" maxLength={16} />
          <TextInput size={size} label="Disabled" placeholder="Placeholder goes here" helperText="Example helper string" disabled />
        </div>
      ))}
    </div>
  ),
};

/** Pure interaction test (hidden from the docs page): typing fires onChange and updates the counter. */
export const TypesFire: Story = {
  tags: ['!autodocs'],
  args: { label: 'Name', helperText: 'Your full name', maxLength: 50, onChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/name/i);
    await userEvent.type(input, 'Ada');
    await expect(args.onChange).toHaveBeenCalled();
    await expect(canvas.getByText('3/50')).toBeInTheDocument();
  },
};
