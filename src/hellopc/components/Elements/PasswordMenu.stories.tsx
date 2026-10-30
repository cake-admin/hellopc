import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { PasswordMenu } from './PasswordMenu';

const meta = {
  title: 'Elements/Password Menu',
  component: PasswordMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Password Menu is static password-strength and policy feedback for an owning
password field. It does **not** collect, validate, or store a password; pair it
with [Text Input](?path=/docs/components-text-input--docs) or a future
password-input field that owns those responsibilities. It composes
[Helper String](?path=/docs/elements-helper-string--docs) for the status-icon
requirement rows and optionally composes
[Input Label](?path=/docs/elements-input-label--docs) above the card when the
menu needs to be associated with its owning field.

Every color, spacing, radius, type value, and elevation resolves from hello pc
tokens as CSS custom properties. The **Theme** toolbar re-themes every example
live; nothing is hardcoded.

This is semantic non-interactive feedback: a labelled region with a native
progressbar and requirements list. The parent password field computes
\`strength\` after applying its own policy and passes the resulting status in.
There is deliberately no Radix primitive here — Radix would not add behavior
to a static status panel.

## Usage

\`\`\`tsx
<PasswordMenu />
<PasswordMenu strength="weak" />
<PasswordMenu strength="medium" />
<PasswordMenu strength="strong" />
<PasswordMenu label="Password" htmlFor="new-password" showLabelInfo />
<PasswordMenu strength="strong" title="Your password is ready" />
<PasswordMenu requirements={customRequirements} strength="medium" />
<PasswordMenu requirements={customRequirements} metRequirementIds={['lower']} />
\`\`\`

## Design tokens used

| Part · state | Tokens |
| --- | --- |
| card | \`--color-surfaces-container\`, \`--radius-200\`, \`--elevation-3\` |
| header / list | \`--space-300\` padding, \`--space-100\` stack gap |
| card title | \`--font-family\`, \`--font-weight-medium\`, \`--type-size-body\`, \`--color-text-icon-primary\` |
| progress track | \`--color-stroke-border\`, \`--radius-1000\` |
| weak progress | \`--color-error-error\` |
| medium progress | \`--color-warning-warn\` |
| strong progress | \`--color-success-success\` |
| divider | \`--stroke-100\`, \`--color-stroke-border\` |
| requirement row | reused \`HelperString\`; \`--color-text-icon-primary\` text with \`--color-success-success\` / \`--color-error-error\` icon |
| optional external label | reused \`InputLabel\` token recipe |

Figma intrinsic geometry is a 320px card, 12px progress track, and
\`--space-050\` outer gap. The card floats over the field it annotates, so it
takes \`--elevation-3\` — the same overlay level as Dropdown and Menu.

## Accessibility

- The card is a labelled \`<section>\`, with its title as the default accessible
  name; use \`aria-label\` only when a more specific name is needed.
- Strength is a real \`progressbar\` with numeric and text values, while the
  requirements are a semantic list. The status text is politely announced when
  the parent updates \`strength\`.
- The optional \`label\` uses the real \`InputLabel\`; pair it with \`htmlFor\`
  to identify the owning password field. Do not use the card title as a
  substitute for the password field's label.
- Requirement text stays primary-colored; semantic color is reinforced by the
  success/error icon, so status is not conveyed by color alone.

## Do / Don't

| Do | Don't |
| --- | --- |
| Compute strength from your actual server/client policy before passing it in. | Treat \`strength="strong"\` as proof a password is secure. |
| Keep the requirement list aligned with the policy enforced on submit. | Show requirements that the form does not enforce. |
| Associate an optional external label with the password input through \`htmlFor\`. | Use the card title as the password input label. |
| Use it for password-creation guidance. | Use it for PIN or OTP entry. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    strength: 'empty',
    title: 'Pick a password',
    showLabelInfo: false,
    required: false,
    disabled: false,
  },
  argTypes: {
    strength: {
      control: 'inline-radio',
      options: ['empty', 'weak', 'medium', 'strong'],
      table: { category: 'State' },
    },
    title: { control: 'text', table: { category: 'Content' } },
    statusLabel: { control: 'text', table: { category: 'Content' } },
    requirements: { control: false, table: { category: 'Content' } },
    metRequirementIds: { control: false, table: { category: 'Behavior' } },
    label: { control: 'text', table: { category: 'Content' } },
    htmlFor: { control: 'text', table: { category: 'Behavior' } },
    showLabelInfo: { control: 'boolean', table: { category: 'Content' } },
    required: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    'aria-label': { control: 'text', table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof PasswordMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Strengths: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The Figma state matrix: empty, weak (lowercase met), medium ' +
          '(lowercase + uppercase), and strong (all four requirements).',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {(['empty', 'weak', 'medium', 'strong'] as const).map((strength) => (
        <PasswordMenu key={strength} strength={strength} />
      ))}
    </div>
  ),
};

export const WithExternalLabel: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'An optional `InputLabel` may identify the owning password field. ' +
          'The Figma default has no outer label; add one only in the parent-field context.',
      },
    },
  },
  render: () => (
    <PasswordMenu
      label="Password"
      htmlFor="new-password"
      required
      showLabelInfo
      strength="medium"
    />
  ),
};

export const CustomPolicy: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Supply policy-specific requirement labels and the minimum strength at ' +
          'which each becomes satisfied, keeping visible feedback aligned with enforcement.',
      },
    },
  },
  render: () => (
    <PasswordMenu
      title="Set your account password"
      strength="medium"
      requirements={[
        { id: 'lower', label: 'At least one lowercase', metAt: 'weak' },
        { id: 'upper', label: 'At least one uppercase', metAt: 'medium' },
        { id: 'symbol', label: 'At least one symbol', metAt: 'strong' },
        { id: 'length', label: 'Minimum 12 characters', metAt: 'strong' },
      ]}
    />
  ),
};

export const StatusOverride: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`statusLabel` changes the visible and announced strength text without ' +
          'changing the tokenized strength color or requirements logic.',
      },
    },
  },
  render: () => <PasswordMenu strength="strong" statusLabel="Great choice" />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: all four strengths plus an optional external label. ' +
          'Audit this story under both themes using the Theme toolbar.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {(['empty', 'weak', 'medium', 'strong'] as const).map((strength) => (
        <PasswordMenu key={strength} strength={strength} />
      ))}
      <PasswordMenu label="Password" htmlFor="password" strength="strong" disabled />
    </div>
  ),
};

/** Semantic test (hidden from docs): strength exposes the correct progress value and requirements list. */
export const StrengthSemantics: Story = {
  tags: ['!autodocs'],
  args: { strength: 'medium' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '43');
    await expect(canvas.getByText('Medium')).toBeInTheDocument();
    await expect(canvas.getByRole('list')).toBeInTheDocument();
  },
};
