import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Components/Password Input',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Password Input is a password-creation field composed from [Input
Label](?path=/docs/elements-input-label--docs), Radix's accessible password
toggle, [Helper String](?path=/docs/elements-helper-string--docs), and
[Password Menu](?path=/docs/elements-password-menu--docs). Use it when the
form should expose password policy guidance as the user types; use Text Input
for non-secret values and PIN Input for a fixed numeric credential.

Every color, spacing, radius, stroke, and type value resolves from hello pc CSS
custom properties that mirror the Figma variables. The **Theme** toolbar
re-themes the field, strength menu, and every state live; nothing is
hardcoded.

The native password input remains the submitted form control. Radix owns its
masked/revealed type and the eye-toggle semantics. The component supports
controlled and uncontrolled values; without a \`strength\` override it
calculates the Figma policy feedback (lowercase, uppercase, numeric, and at
least eight characters) and opens Password Menu while focus remains inside the
input/eye group. \`status\` overlays validation chrome and suppresses the menu.

## Usage

\`\`\`tsx
<PasswordInput label="Enter password" placeholder="Choose a password" />
<PasswordInput label="New password" required showLabelInfo />
<PasswordInput label="Password" autoComplete="current-password" showStrengthMenu={false} />
<PasswordInput label="Password" status="error" helperText="Invalid password" />
<PasswordInput label="Password" defaultValue="CorrectHorse1" status="success" />
<PasswordInput aria-label="New password" />
\`\`\`

## Design tokens used

| Part · state | Tokens |
| --- | --- |
| default field | \`--color-surfaces-on-container-high\`, \`--stroke-100\`, \`--color-stroke-border\` |
| hover | \`--color-stroke-border-high\` |
| typing / focus | \`--color-surfaces-container\`, \`--stroke-150\`, \`--color-primary-primary\` |
| success | \`--color-success-success-overlay\`, \`--color-success-success\` |
| error | \`--color-error-error-overlay\`, \`--color-error-error\` |
| disabled | \`--color-disabled-disabled\`, \`--color-disabled-disabled-inverse\` |
| text / placeholder / eye | \`--color-text-icon-primary\`, \`--color-text-icon-placeholder\`, \`--color-text-icon-secondary\`, \`--type-size-body\` |
| layout / shape | \`--space-050\`, \`--space-100\`, \`--space-200\`, \`--radius-200\`, \`--radius-1000\` |
| focusable eye action | \`--stroke-200\`, \`--color-primary-primary\`, \`--radius-1000\` |
| policy overlay | Password Menu's token recipe: \`--color-surfaces-container\`, \`--elevation-3\`, semantic progress and requirement tokens |

Figma intrinsic geometry is a 320px-wide field, 40px input, and 24px visibility
slot. Password Menu is placed one \`--stroke-100\` below the field group, which
matches the 68px Figma typing-state offset.

## Accessibility

- Supply \`label\`, or supply \`aria-label\` for a labelless field. Input Label
  is a real \`<label htmlFor>\`, so clicking it focuses the password input.
- Radix provides a real button that toggles masked/revealed type, with an
  updated “Show password” / “Hide password” accessible name.
- \`status="error"\` sets \`aria-invalid\`; helper text is associated through
  \`aria-describedby\`; \`required\` is both visibly communicated and native.
- Focus uses the primary border for the entire field and a tokenized ring for
  the eye action. Disabled inputs and toggles are not interactive.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use a visible label and keep the requirements aligned with submit validation. | Treat the strength display as server-side password validation. |
| Let Password Menu open while users create a password. | Show strength guidance for a current-password sign-in field unless needed. |
| Use \`status="error"\` plus explanatory helper text for a rejected password. | Rely on the red field treatment without explaining the failure. |
| Provide custom \`requirements\` and \`metRequirementIds\` together for a custom policy. | Reuse the built-in requirement ids for an unrelated policy. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Enter password',
    placeholder: 'Placeholder goes here',
    helperText: 'Use a secure password',
    required: true,
    showLabelInfo: true,
    status: 'default',
    disabled: false,
    showStrengthMenu: true,
    onChange: fn(),
    onValueChange: fn(),
    onVisibilityChange: fn(),
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    placeholder: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    showLabelInfo: { control: 'boolean', table: { category: 'Content' } },
    requirements: { control: false, table: { category: 'Content' } },
    metRequirementIds: { control: false, table: { category: 'Content' } },
    status: {
      control: 'inline-radio',
      options: ['default', 'success', 'error'],
      table: { category: 'State' },
    },
    required: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    visible: { control: 'boolean', table: { category: 'State' } },
    defaultVisible: { control: 'boolean', table: { category: 'State' } },
    showStrengthMenu: { control: 'boolean', table: { category: 'Behavior' } },
    strength: {
      control: 'inline-radio',
      options: ['empty', 'weak', 'medium', 'strong'],
      table: { category: 'Behavior' },
    },
    strengthLabel: { control: 'text', table: { category: 'Behavior' } },
    autoComplete: {
      control: 'inline-radio',
      options: ['new-password', 'current-password'],
      table: { category: 'Behavior' },
    },
    onChange: { action: 'change', table: { category: 'Events' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    onVisibilityChange: { action: 'visibilityChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  /*
   * Password Menu is intentionally positioned below its focused field. Reserve
   * its Figma card height in every interactive canvas so Storybook does not
   * crop it or add an inner scrollbar.
   */
  <div style={{ width: 320, minHeight: 320 }}>{children}</div>
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
          'Default, validation, and disabled states. Focus the first field to open Password Menu; ' +
          'error and success use their semantic overlay and 1.5px border tokens.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <PasswordInput label="Default / focus to see guidance" placeholder="Choose a password" />
      <PasswordInput label="Error" defaultValue="password" status="error" helperText="Invalid Password" />
      <PasswordInput label="Success" defaultValue="Password1" status="success" helperText="Password accepted" />
      <PasswordInput label="Disabled" placeholder="Choose a password" helperText="This field is unavailable" disabled />
    </div>
  ),
};

export const StrengthGuidance: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Focus or type in this field to open Password Menu. The initial value meets every ' +
          'Figma policy rule, so all requirements and the progressbar are strong.',
      },
    },
  },
  render: () => (
    <Frame>
      <PasswordInput label="New password" defaultValue="LenovoPass1" autoFocus />
    </Frame>
  ),
};

export const CustomPolicy: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'For a custom policy, provide the requirements and their fulfilled ids together; ' +
          'the visible rules then remain accurate even when they are met out of sequence.',
      },
    },
  },
  render: () => (
    <Frame>
      <PasswordInput
        label="Enterprise password"
        defaultValue="Enterprise#2026"
        autoFocus
        strength="strong"
        requirements={[
          { id: 'lower', label: 'At least one lowercase', metAt: 'weak' },
          { id: 'upper', label: 'At least one uppercase', metAt: 'medium' },
          { id: 'symbol', label: 'At least one symbol', metAt: 'strong' },
          { id: 'length', label: 'Minimum 12 characters', metAt: 'strong' },
        ]}
        metRequirementIds={['lower', 'upper', 'symbol', 'length']}
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
          'The QA matrix covers resting, filled, error, success, disabled, and masked/revealed ' +
          'visibility. Audit it with the Theme toolbar under both system themes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 320 }}>
      <PasswordInput label="Resting" placeholder="Choose a password" required showLabelInfo />
      <PasswordInput label="Filled (masked)" defaultValue="Password1" />
      <PasswordInput label="Filled (revealed)" defaultValue="Password1" visible />
      <PasswordInput label="Error" defaultValue="password" status="error" helperText="Invalid Password" />
      <PasswordInput label="Success" defaultValue="Password1" status="success" helperText="Password accepted" />
      <PasswordInput label="Disabled" placeholder="Choose a password" disabled />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): typing calculates strength and the Radix toggle reveals it. */
export const TypesAndReveals: Story = {
  tags: ['!autodocs'],
  args: {
    label: 'New password',
    helperText: undefined,
    onChange: fn(),
    onValueChange: fn(),
    onVisibilityChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('New password');

    await userEvent.type(input, 'Password1');
    await expect(args.onChange).toHaveBeenCalled();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('Password1');
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(args.onVisibilityChange).toHaveBeenLastCalledWith(true);
    await expect(input).toHaveAttribute('type', 'text');
  },
};
