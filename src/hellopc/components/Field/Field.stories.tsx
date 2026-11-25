import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import type { ReactNode } from 'react';

import { Badge } from '../Badge';
import { Field, FieldGroup } from './Field';

const meta = {
  title: 'Components/Field',
  component: Field,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A read-only label and value — one row of facts in a detail view, side sheet or
card ("Functional area: IT Infrastructure"). It displays data; it is **not** a
form field. To collect input, use \`TextInput\`, \`Dropdown\` and the other inputs.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

Renders a description list: \`<dt>\` for the label, \`<dd>\` for the value. Stack
fields in a \`FieldGroup\` so they share one \`<dl>\` (a lone \`Field\` wraps itself).
\`layout="inline"\` puts the label in a 160px column beside the value;
\`"stacked"\` puts it above. \`href\` turns the value into a \`Link\`; \`meta\` adds a
provenance line; \`info\` adds a tooltip behind an info icon. The value accepts
any node — a Badge, a Rating, an Avatar — and wraps rather than truncating.

## Usage

\`\`\`tsx
<Field label="Functional area">IT Infrastructure, Cloud, AI</Field>
<Field label="Owner" layout="stacked">Alex Kim</Field>
<Field label="Ticket" href="/tickets/4821">INC-4821</Field>
<Field label="Warranty" meta="Updated Nov 3 · By Alex Kim">Premier, through 2028</Field>
<Field label="Tier" info="Set by your account manager">Gold</Field>
<FieldGroup><Field label="Model">ThinkPad X1</Field><Field label="Serial">PF3K21</Field></FieldGroup>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Label | \`--color-text-icon-secondary\`, \`--type-size-body\` regular, 0.2px tracking |
| Value | \`--color-text-icon-primary\`, \`--type-size-body\` medium, 0.1px tracking |
| Value · link | **Link** \`md\` — \`--color-text-icon-link\` |
| Meta | \`--color-text-icon-placeholder\`, \`--type-size-caption\` regular (Figma 10px; no 10px token yet) |
| Info icon | 16px (\`--space-300\`), label color; **SimpleTooltip** |
| Inline layout | 160px label column, \`--space-300\` gap |
| Stacked layout | label ↔ value \`--space-050\` |
| Value ↔ meta | \`--space-025\` |
| Between fields | **FieldGroup** \`--space-200\` |

## Accessibility

- Label/value pairs are a description list, so screen readers announce them as
  terms and definitions, and the relationship survives without the visual layout.
- \`info\` renders a real button with an accessible name ("About Functional
  area"), so the tooltip text is reachable from the keyboard.
- Link values are ordinary links named by their text.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use Field to show facts in detail views | Use it to collect input — that's a form control |
| Group related fields in a \`FieldGroup\` | Build key–value rows from loose text |
| Keep labels short nouns | Put sentences in the label column |
| Pick one layout per group | Mix inline and stacked in the same list |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { label: 'Functional area', children: 'IT Infrastructure, Cloud, AI', layout: 'inline' },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    children: { control: 'text', table: { category: 'Content' } },
    meta: { control: 'text', table: { category: 'Content' } },
    info: { control: 'text', table: { category: 'Content' } },
    href: { control: 'text', table: { category: 'Content' } },
    layout: { control: 'inline-radio', options: ['inline', 'stacked'], table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ children, width = 480 }: { children: ReactNode; width?: number }) => (
  <div style={{ maxWidth: width }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** `inline` (label column beside the value) and `stacked` (label above), as text and link values. */
export const Layouts: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
      <FieldGroup>
        <Field label="Functional area">IT Infrastructure, Cloud, AI</Field>
        <Field label="Functional area" href="#field">
          IT Infrastructure, Cloud, AI
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Functional area" layout="stacked">
          IT Infrastructure, Cloud, AI
        </Field>
        <Field label="Functional area" layout="stacked" href="#field">
          IT Infrastructure, Cloud, AI
        </Field>
      </FieldGroup>
    </div>
  ),
};

/** `info` adds a tooltip behind a focusable info icon; `meta` adds a provenance line. */
export const InfoAndMeta: Story = {
  args: { info: 'Set by your account manager', meta: 'Updated Nov 3, 2026 · By Alex Kim' },
};

/** A detail panel: a FieldGroup with mixed values, including a Badge. */
export const DetailPanel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <FieldGroup>
        <Field label="Model">ThinkPad X1 Carbon Gen 12</Field>
        <Field label="Serial number">PF3K21XY</Field>
        <Field label="Status">
          <span>
            <Badge color="green" tone="subtle">
              Active
            </Badge>
          </span>
        </Field>
        <Field label="Ticket" href="#field">
          INC-4821
        </Field>
        <Field label="Warranty" meta="Updated Nov 3, 2026 · By Alex Kim" info="Coverage from the purchase record">
          Premier Support, through March 2028
        </Field>
      </FieldGroup>
    </Frame>
  ),
};

/** QA matrix — layout × text/link × meta/info. Audit under every theme via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
      {(['inline', 'stacked'] as const).map((layout) => (
        <FieldGroup key={layout}>
          <Field layout={layout} label="Text">
            IT Infrastructure, Cloud, AI
          </Field>
          <Field layout={layout} label="Link" href="#field">
            IT Infrastructure, Cloud, AI
          </Field>
          <Field layout={layout} label="With meta" meta="Updated Nov 3 · By Alex Kim">
            Premier Support
          </Field>
          <Field layout={layout} label="With info" info="Explains the label">
            Gold
          </Field>
        </FieldGroup>
      ))}
    </div>
  ),
};

/** Renders a description list: label as term, value as definition. */
export const DescriptionListSemantics: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('term')).toHaveTextContent('Functional area');
    await expect(canvas.getByRole('definition')).toHaveTextContent('IT Infrastructure, Cloud, AI');
  },
};
