import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { InputLabel } from './InputLabel';

const meta = {
  title: 'Elements/Input Label',
  component: InputLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The label row that sits **above a form field** — a reusable form element, not
a standalone page heading. \`TextInput\` composes it, and future fields
(Textarea, Select, …) should too; only reach for it directly when building a
new field component.

Every color, spacing, and type value resolves from the hello pc design tokens as
CSS custom properties (\`--color-*\`, \`--space-*\`, \`--type-*\`), whose names
mirror the Figma variables 1:1 — the **Theme** toolbar toggle re-themes every
example on this page live via \`[data-theme]\`.

Built on the Radix \`Label\` primitive: it renders a real \`<label>\` (wire it
to the control with \`htmlFor\`) and prevents accidental text selection on
double-click. The row lays out as: text ·4px· optional info icon, with the
"(required)" suffix pushed to the right edge.

## Usage

\`\`\`tsx
<InputLabel htmlFor="email">Email</InputLabel>
<InputLabel htmlFor="email" required>Email</InputLabel>
<InputLabel htmlFor="email" showInfo>Email</InputLabel>
<InputLabel htmlFor="email" size="sm">Email</InputLabel>   // inside fields
<InputLabel htmlFor="email" disabled>Email</InputLabel>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Text | \`--font-weight-medium\`, \`--color-text-icon-primary\`; \`md\` \`--type-size-subject\` (16px) / \`sm\` \`--type-size-body\` (14px) |
| Info icon (16px) | inherits the text color via \`currentColor\` |
| "(required)" suffix | \`--font-weight-regular\` \`--type-size-helper\`, \`--color-text-icon-placeholder\` |
| Disabled | text + icon \`--color-disabled-disabled-inverse\` (the suffix keeps its color) |
| Gaps | \`--space-050\` text↔icon, \`--space-100\` before the suffix |

## Accessibility

- Renders a native \`<label>\` — always pass \`htmlFor\` so clicking it focuses
  the field and assistive tech links the two.
- Radix \`Label\` prevents text selection on double-click (a native label
  annoyance), nothing else — the semantics are the platform's.
- The info icon is \`aria-hidden\` decoration; put the actual guidance in the
  field's helper string, not in the icon alone.
- "(required)" is visible text (not just an asterisk), so it's announced as-is.

## Do / Don't

| Do | Don't |
| --- | --- |
| Compose it inside field components, wired via \`htmlFor\`. | Use it as a general text style — it's a form label. |
| Use \`size="sm"\` inside fields (TextInput does). | Mix label sizes within one form. |
| Mark required fields with \`required\`. | Add your own asterisk conventions. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Label',
    size: 'md',
    required: false,
    showInfo: false,
    disabled: false,
  },
  argTypes: {
    children: { control: 'text', table: { category: 'Content' } },
    size: { control: 'inline-radio', options: ['sm', 'md'], table: { category: 'Appearance' } },
    required: { control: 'boolean', table: { category: 'Content' } },
    showInfo: { control: 'boolean', table: { category: 'Content' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    htmlFor: { control: 'text', table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof InputLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 320 }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  decorators: [(Story) => <Frame>{Story()}</Frame>],
};

export const FullRow: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The complete row from the Figma spec: label text, info icon, and the ' +
          '"(required)" suffix pushed to the right edge of the field width.',
      },
    },
  },
  render: () => (
    <Frame>
      <InputLabel htmlFor="demo" required showInfo>
        Label
      </InputLabel>
    </Frame>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Two type sizes: `md` 16px (`--type-size-subject`) standalone, `sm` ' +
          '14px (`--type-size-body`) as composed inside TextInput.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <InputLabel size="md" showInfo required>
        Medium (16px)
      </InputLabel>
      <InputLabel size="sm" showInfo required>
        Small (14px)
      </InputLabel>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Disabled dims the text + icon to `--color-disabled-disabled-inverse`; ' +
          'the "(required)" suffix keeps `--color-text-icon-placeholder` per spec.',
      },
    },
  },
  render: () => (
    <Frame>
      <InputLabel disabled required showInfo>
        Label
      </InputLabel>
    </Frame>
  ),
};

/** Pure DOM test (hidden from the docs page): the required suffix renders. */
export const RequiredRenders: Story = {
  tags: ['!autodocs'],
  args: { children: 'Email', required: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('(required)')).toBeInTheDocument();
  },
};
