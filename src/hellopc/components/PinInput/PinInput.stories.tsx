import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { PinInput } from './PinInput';

const meta = {
  title: 'Components/Pin Input',
  component: PinInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A masked, multi-digit PIN or one-time-code field. It composes the reusable
[Input Label](?path=/docs/elements-input-label--docs), Radix's OTP field, the
existing [Icon Button](?path=/docs/components-button-icon-button--docs) eye
action, and [Helper String](?path=/docs/elements-helper-string--docs). Use it
for a short authentication code; use [Text Input](?path=/docs/components-text-input--docs)
for an ordinary password or free-form secret.

Every color, spacing, radius, and type value resolves from hello pc design tokens
as CSS custom properties; the **Theme** toolbar re-themes every example live.
Nothing is hardcoded.

Radix owns numeric validation, SMS/browser one-time-code autofill, pasting,
roving focus, Backspace navigation, and the combined submitted value. The
component masks code characters by default and uses the existing 32px
\`IconButton\` to toggle visibility. It supports controlled and uncontrolled
values; use \`onValueChange\` to own the value, and \`onComplete\` to submit or
advance only after all slots have been filled.

## Usage

\`\`\`tsx
<PinInput label="Verification code" />
<PinInput label="Verification code" helperText="Enter the six-digit code" />
<PinInput label="Verification code" defaultValue="123456" />
<PinInput label="Verification code" visible />
<PinInput label="Verification code" length={4} />
<PinInput label="Verification code" status="error" helperText="That code is incorrect" />
<PinInput label="Verification code" disabled />
\`\`\`

## Design tokens used

| Part · state | Background | Border / text |
| --- | --- | --- |
| cell · default | \`--color-surfaces-on-container-high\` | \`--stroke-100\` \`--color-stroke-border\` |
| cell · hover | \`--color-surfaces-on-container-high\` | \`--color-stroke-border-high\` |
| cell · typing | \`--color-surfaces-on-container-high\` | \`--stroke-150\` \`--color-primary-primary\` |
| cell · complete | \`--color-surfaces-container\` | \`--stroke-150\` \`--color-primary-primary\` |
| cell · error | \`--color-surfaces-on-container-high\` | \`--stroke-150\` \`--color-error-error\` |
| cell · disabled | \`--color-disabled-disabled\` | no border; \`--color-disabled-disabled-inverse\` |
| label / helper | – | reused \`InputLabel\` / \`HelperString\` token recipes |
| visibility action | IconButton ghost · secondary | its documented token recipe |

The Figma cell geometry is 30×40px, with \`--space-050\` between cells,
\`--space-300\` before the 32px eye action, \`--radius-200\` cell corners, and
\`--space-050\` between the label, code row, and helper.

## Accessibility

- Radix provides numeric validation, paste/autofill handling, roving focus,
  keyboard navigation, and a single native hidden form value.
- Provide \`label\`; a labelless field must receive \`aria-label\`. The helper
  is connected with \`aria-describedby\`, and error state sets \`aria-invalid\`.
- Each digit slot has an explicit accessible position name. The visibility
  action is an existing \`IconButton\` with a stateful accessible name.
- Focus is never removed: the current/entered slots receive the primary
  \`--stroke-150\` border; disabled blocks all slots and the visibility action.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use \`autoComplete="one-time-code"\` for verification codes. | Split a code into unrelated text inputs. |
| Show a specific error in \`helperText\` with \`status="error"\`. | Signal an incorrect PIN with color alone. |
| Use \`onComplete\` only after server-side validation is ready. | Treat client-side completion as authentication. |
| Keep the Figma-standard six slots unless the identity service requires another length. | Use this for a free-form password. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Verification code',
    helperText: 'Enter the six-digit code',
    length: 6,
    status: 'default',
    required: false,
    showLabelInfo: false,
    visible: false,
    showVisibilityToggle: true,
    disabled: false,
    onValueChange: fn(),
    onComplete: fn(),
    onVisibleChange: fn(),
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    showLabelInfo: { control: 'boolean', table: { category: 'Content' } },
    showVisibilityToggle: { control: 'boolean', table: { category: 'Content' } },
    length: { control: 'number', table: { category: 'Appearance' } },
    visible: { control: 'boolean', table: { category: 'Appearance' } },
    status: {
      control: 'inline-radio',
      options: ['default', 'error'],
      table: { category: 'State' },
    },
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: 'text', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    name: { control: 'text', table: { category: 'Behavior' } },
    autoComplete: {
      control: 'inline-radio',
      options: ['one-time-code', 'off'],
      table: { category: 'Behavior' },
    },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    onComplete: { action: 'complete', table: { category: 'Events' } },
    onVisibleChange: { action: 'visibleChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof PinInput>;

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
          'Hover the first PIN to see the high border; focus and enter digits to see ' +
          'the primary typing treatment. The completed field uses the white container ' +
          'surface; error and disabled map to their semantic token treatments.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PinInput label="Default / try typing" helperText="Enter the six-digit code" required showLabelInfo />
      <PinInput label="Completed" defaultValue="123456" helperText="Code entered" />
      <PinInput label="Error" status="error" helperText="That code is incorrect" />
      <PinInput label="Disabled" defaultValue="123456" helperText="Code expired" disabled />
    </div>
  ),
};

export const Visibility: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The eye action reuses the existing `IconButton` in its ghost/secondary ' +
          'treatment. Click it to switch between secure dots and visible numeric digits.',
      },
    },
  },
  render: () => <PinInput label="PIN" defaultValue="123456" helperText="Use the eye action to reveal" />,
};

export const Lengths: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Six slots are the Figma standard. Use a different `length` only when the ' +
          'authentication service explicitly requires it.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PinInput label="Four-digit code" length={4} />
      <PinInput label="Six-digit code" length={6} />
    </div>
  ),
};

export const WithoutVisibilityToggle: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Hide the eye only when revealing the PIN is prohibited by the security ' +
          'requirements; code characters remain masked by default.',
      },
    },
  },
  render: () => <PinInput label="Secure code" showVisibilityToggle={false} helperText="Enter the code from your authenticator" />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: empty, partial, complete, error, and disabled states. Use it ' +
          'with the Theme toolbar to audit both `light.a` and `dark.a`.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PinInput label="Empty" helperText="Enter the six-digit code" required showLabelInfo />
      <PinInput label="Partial" defaultValue="12" helperText="Continue entering digits" />
      <PinInput label="Completed" defaultValue="123456" helperText="Code entered" />
      <PinInput label="Error" status="error" helperText="That code is incorrect" />
      <PinInput label="Disabled" defaultValue="123456" helperText="Code expired" disabled />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): typing completes the code, then the eye reveals it. */
export const CompletesAndReveals: Story = {
  tags: ['!autodocs'],
  args: {
    label: 'Verification code',
    helperText: 'Enter the code',
    onValueChange: fn(),
    onComplete: fn(),
    onVisibleChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const firstSlot = canvas.getByRole('textbox', { name: /verification code digit 1/i });

    await userEvent.type(firstSlot, '123456');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('123456');
    await expect(args.onComplete).toHaveBeenCalledWith('123456');

    await userEvent.click(canvas.getByRole('button', { name: /show pin/i }));
    await expect(args.onVisibleChange).toHaveBeenCalledWith(true);
  },
};
