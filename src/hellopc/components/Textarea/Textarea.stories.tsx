import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ReactNode } from 'react';

import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Multi-line text entry — comments, descriptions, feedback, notes. Use it when the
answer can run to a sentence or more; for a short single value (a name, a
search), use \`TextInput\`. For a read-only value, use \`Field\`.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

Composed like \`TextInput\`: an \`InputLabel\` above (wired with \`htmlFor\`), a
native \`<textarea>\`, and a \`HelperString\` below (wired with \`aria-describedby\`).
\`maxLength\` sets the native limit and shows a "0/250" counter in the helper
row. The field shows three lines by default (\`rows\`) and can be dragged taller.
It works controlled (\`value\` + \`onChange\`) or uncontrolled (\`defaultValue\`).
States follow Figma: default, hover, typing (focus), finished typing (has text),
disabled, success and error.

## Usage

\`\`\`tsx
<Textarea label="Comments" placeholder="Add a comment" />
<Textarea label="Description" required helperText="Shown on the device page" maxLength={250} />
<Textarea label="Notes" rows={6} />
<Textarea label="Feedback" status="error" helperText="Tell us a little more" />
<Textarea label="Feedback" status="success" helperText="Thanks — saved" />
<Textarea label="Reason" disabled defaultValue="Locked by your admin" />
\`\`\`

## Design tokens used

| Part / state | Tokens |
| --- | --- |
| Box · default | \`--color-surfaces-on-container-high\`, \`--stroke-100\` \`--color-stroke-border\`, \`--radius-200\`, padding \`--space-100\` \`--space-200\` |
| Box · hover | \`--color-surfaces-on-container\`, border \`--color-stroke-border-high\` |
| Box · typing (focus) | \`--color-surfaces-container\`, \`--stroke-150\` \`--color-primary-primary\` |
| Box · finished typing | \`--color-surfaces-container\`, \`--color-stroke-border\` |
| Box · success / error | \`--color-success-success-overlay\` / \`--color-error-error-overlay\`, \`--stroke-150\` \`--color-success-success\` / \`--color-error-error\` |
| Box · disabled | \`--color-disabled-disabled\`, border \`--color-disabled-disabled-inverse\` |
| Text | \`--type-size-body\` regular, 1.35, 0.2px; \`--color-text-icon-primary\`; placeholder \`--color-text-icon-secondary\` |
| Label | **InputLabel** \`md\` (medium 16, "(required)" suffix, optional info icon) |
| Helper + counter | **HelperString** — greyscale, info while typing, success, error, disabled |
| Gaps | label ↔ box \`--space-050\`; box ↔ helper \`--space-050\` |

## Accessibility

- The label is a real \`<label for>\`, so clicking it focuses the field and screen
  readers announce it. Without a visible label, pass \`aria-label\`.
- Helper text and the counter are linked with \`aria-describedby\`, so they're read
  after the label.
- Error sets \`aria-invalid\`; the error is shown by color **and** the helper's icon
  and text — write the helper so it says what to fix.
- \`required\` sets the native attribute and shows "(required)".

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for answers that can run to a sentence or more | Use for a single short value — that's \`TextInput\` |
| Show a counter when there's a limit | Cut people off with no warning |
| Say what to fix in the error helper | Show "Invalid" alone |
| Size \`rows\` to the expected answer | Make a one-line box for long answers |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Label',
    placeholder: 'Placeholder goes here',
    helperText: 'Example helper string',
    maxLength: 250,
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    showLabelInfo: { control: 'boolean', table: { category: 'Content' } },
    rows: { control: { type: 'number', min: 2, max: 12 }, table: { category: 'Appearance' } },
    status: {
      control: 'inline-radio',
      options: ['default', 'success', 'error'],
      table: { category: 'State' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'Behavior' } },
    maxLength: { control: 'number', table: { category: 'Behavior' } },
    onChange: { action: 'change', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

const Grid = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
    {children}
  </div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** Validation: success and error tint the box and the helper, and error sets `aria-invalid`. */
export const Validation: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      <Textarea label="Label" required showLabelInfo defaultValue="Finished typing!" status="success" helperText="Example helper string" maxLength={250} />
      <Textarea label="Label" required showLabelInfo defaultValue="Finished typing!" status="error" helperText="Example helper string" maxLength={250} />
    </Grid>
  ),
};

/** Disabled: flat disabled fill with a disabledInverse border; text, helper and counter dim. */
export const Disabled: Story = { args: { disabled: true } };

/** QA matrix — default, finished typing, disabled, success, error. Hover and focus a field to see those states. Audit under every theme. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      <Textarea label="Label" required showLabelInfo placeholder="Placeholder goes here" helperText="Example helper string" maxLength={250} />
      <Textarea label="Label" required showLabelInfo defaultValue="Finished typing!" helperText="Example helper string" maxLength={250} />
      <Textarea label="Label" required showLabelInfo placeholder="Placeholder goes here" helperText="Example helper string" maxLength={250} disabled />
      <Textarea label="Label" required showLabelInfo defaultValue="Finished typing!" status="success" helperText="Example helper string" maxLength={250} />
      <Textarea label="Label" required showLabelInfo defaultValue="Finished typing!" status="error" helperText="Example helper string" maxLength={250} />
    </Grid>
  ),
};

/** Typing updates the counter and fires onChange; the label and helper are wired to the field. */
export const TypesAndCounts: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByLabelText(/Label/);
    await expect(field).toHaveAttribute('aria-describedby');
    await userEvent.type(field, 'Hello');
    await expect(args.onChange).toHaveBeenCalled();
    await expect(canvas.getByText('5/250')).toBeInTheDocument();
  },
};
