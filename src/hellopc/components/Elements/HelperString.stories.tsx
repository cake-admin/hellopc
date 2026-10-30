import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { HelperString } from './HelperString';

const meta = {
  title: 'Elements/Helper String',
  component: HelperString,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The assistive line that sits **under a form field** — guidance, validation
feedback, and an optional character counter. A reusable form element:
\`TextInput\` composes it (and drives its tone from the field state), and
future fields should too.

A semantic **tone** picks the icon and color pair: \`greyscale\` for resting
guidance, \`info\` while the user is typing, \`success\`/\`warning\`/\`error\`
for validation, and \`disabled\` when the field is. Every color, spacing, and
type value resolves from the hello pc design tokens as CSS custom properties —
the **Theme** toolbar toggle re-themes every example on this page live via
\`[data-theme]\`.

Renders a plain \`<div>\` (no Radix primitive applies to static text). Give it
an \`id\` and reference it from the field via \`aria-describedby\` — TextInput
wires this automatically.

## Usage

\`\`\`tsx
<HelperString>Use your work email</HelperString>
<HelperString tone="info">Checking availability…</HelperString>
<HelperString tone="success">Looks good</HelperString>
<HelperString tone="error">This field is required</HelperString>
<HelperString tone="error" count={250} max={250}>Too long</HelperString>
<HelperString showIcon={false}>Plain text, no icon</HelperString>
\`\`\`

## Design tokens used

| Tone | Text + icon |
| --- | --- |
| greyscale | \`--color-text-icon-secondary\` |
| info | \`--color-info-info\` |
| success | \`--color-success-success\` |
| warning | \`--color-warning-warn\` |
| error | \`--color-error-error\` |
| disabled | \`--color-disabled-disabled-inverse\` |

Text is \`--type-size-helper\` regular; icon is 16px and inherits the tone via
\`currentColor\`; icon↔text and text↔counter gaps are \`--space-100\`. The
counter uses the same tone color and the hello pc type (the Figma layer still
carried a legacy non-hello pc counter style — corrected here, flagged to design).

## Accessibility

- Wire it to the field with \`id\` + \`aria-describedby\` so assistive tech
  reads the guidance with the field (TextInput does this for you).
- The tone icon is \`aria-hidden\` — never encode meaning in the icon alone;
  the text carries it.
- Don't rely on color alone for validation: error/success text should say so.

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep helper text short and actionable. | Write paragraphs — link out for long guidance. |
| Switch tone with the field state (typing → info, invalid → error). | Leave an error tone on after the user fixes the value. |
| Use the counter with a real \`maxLength\`. | Show a counter with no enforced limit. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Example helper string',
    tone: 'greyscale',
    showIcon: true,
  },
  argTypes: {
    children: { control: 'text', table: { category: 'Content' } },
    tone: {
      control: 'inline-radio',
      options: ['greyscale', 'info', 'success', 'warning', 'error', 'disabled'],
      table: { category: 'Appearance' },
    },
    showIcon: { control: 'boolean', table: { category: 'Content' } },
    count: { control: 'number', table: { category: 'Content' } },
    max: { control: 'number', table: { category: 'Content' } },
  },
} satisfies Meta<typeof HelperString>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const Tones: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'All six tones (the Figma "type" variants) with their icons: info, ' +
          'check-circle, warning triangle, error, and the neutral/disabled info.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <HelperString tone="greyscale">Resting guidance</HelperString>
      <HelperString tone="info">Active guidance while typing</HelperString>
      <HelperString tone="success">Validation passed</HelperString>
      <HelperString tone="warning">Heads-up, check this</HelperString>
      <HelperString tone="error">Validation failed</HelperString>
      <HelperString tone="disabled">Field is disabled</HelperString>
    </div>
  ),
};

export const WithCounter: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The right-aligned `count/max` counter shares the tone color. At the ' +
          'limit it typically rides an `error` tone (TextInput manages this ' +
          'wiring from `maxLength`).',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <HelperString tone="greyscale" count={0} max={250}>
        Example helper string
      </HelperString>
      <HelperString tone="error" count={250} max={250}>
        Character limit reached
      </HelperString>
      <HelperString count={12} max={250} showIcon={false} />
    </div>
  ),
};

/** Pure DOM test (hidden from the docs page): text + counter render. */
export const CounterRenders: Story = {
  tags: ['!autodocs'],
  args: { children: 'Helper', count: 3, max: 10 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Helper')).toBeInTheDocument();
    await expect(canvas.getByText('3/10')).toBeInTheDocument();
  },
};
