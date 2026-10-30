import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
An **independent** on/off control — each checkbox stands alone, so any number
can be checked at once. Use it for multi-select lists, "accept the terms"
gating, and boolean settings that are saved with a form. For **one choice from
a set** use Radio; for a single setting that applies **instantly** use Switch.

Supports a third **indeterminate** state for a parent "select all" whose
children are only partially selected. Every color, radius, stroke, and spacing
value resolves from the hello pc design tokens as CSS custom properties
(\`--color-*\`, \`--radius-*\`, \`--stroke-*\`, \`--space-*\`), whose names mirror
the Figma variables 1:1 — the **Theme** toolbar toggle re-themes every example
on this page live via \`[data-theme]\`.

Built on the Radix \`Checkbox\` primitive: it renders \`role="checkbox"\` with
\`aria-checked\` (including \`"mixed"\` for indeterminate), toggles with Space,
and exposes \`data-state\`. hello pc supplies only the visuals — an 18px rounded
box in a 24px target, a check/dash mark (lucide, inheriting \`currentColor\`),
a hover fill, and a focus ring. Works controlled (\`checked\` +
\`onCheckedChange\`) or uncontrolled (\`defaultChecked\`); indeterminate is
controlled-only.

## Usage

\`\`\`tsx
<Checkbox label="Subscribe to updates" />
<Checkbox label="Selected" defaultChecked />
<Checkbox label="Accept terms" checked={ok} onCheckedChange={setOk} />
<Checkbox label="Select all" checked="indeterminate" onCheckedChange={…} />
<Checkbox label="Unavailable" disabled />
<Checkbox aria-label="Row 3" />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Box border (unchecked) | \`--stroke-150\` \`--color-text-icon-secondary\` |
| Box fill (checked / indeterminate) | \`--color-primary-primary\`, hover \`--color-primary-primary-hover\` |
| Box fill (unchecked hover) | \`--color-primary-primary-overlay\` |
| Mark (check / dash) | \`--color-text-icon-inverse\` |
| Focus ring (22px) | \`--stroke-150\` \`--color-primary-primary\` |
| Disabled | box \`--color-disabled-disabled-inverse\`, border + mark \`--color-disabled-disabled\` |
| Label | \`--font-family\` + \`--type-size-body\`, \`--color-text-icon-primary\`; disabled \`--color-disabled-disabled-inverse\` |
| Shape / gap | \`--radius-50\` box, \`--radius-100\` target + ring, \`--space-100\` label gap |

## Accessibility

- Radix provides \`role="checkbox"\`, \`aria-checked\` (\`"mixed"\` when
  indeterminate), and Space to toggle — don't re-implement any of it.
- The visible \`label\` is wired via \`<label htmlFor>\`, so clicking the text
  toggles the box. A labelless checkbox must pass \`aria-label\`.
- The check/dash marks are \`aria-hidden\` — the state is conveyed by
  \`aria-checked\`, not the glyph.
- The focus ring is drawn on \`:focus-visible\` and never removed.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for independent, multi-select options. | Use for one-of-many — that's Radio. |
| Reserve indeterminate for a parent "select all". | Set indeterminate as a normal user-selectable state. |
| Give every box a label or \`aria-label\`. | Ship an unlabeled checkbox. |
| Use for settings saved on submit. | Use for a setting that applies instantly — that's Switch. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Subscribe to updates',
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: { control: 'boolean', table: { category: 'State' } },
    defaultChecked: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'State' } },
    label: { control: 'text', table: { category: 'Content' } },
    'aria-label': { control: 'text', table: { category: 'Content' } },
    name: { control: 'text', table: { category: 'Content' } },
    value: { control: 'text', table: { category: 'Content' } },
    onCheckedChange: { action: 'checkedChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Checked: Story = {
  args: { label: 'Selected', defaultChecked: true },
  parameters: {
    docs: {
      description: {
        story:
          'A checked box: solid `--color-primary-primary` fill with a white ' +
          '(`--color-text-icon-inverse`) checkmark.',
      },
    },
  },
};

export const Indeterminate: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The `indeterminate` state (a dash) is for a parent "select all" whose ' +
          'children are only partly selected — set it via a controlled `checked` ' +
          'value. Toggle the parent below to see it resolve to all-on / all-off.',
      },
    },
  },
  render: () => {
    const Demo = () => {
      const [items, setItems] = useState([true, false, true]);
      const all = items.every(Boolean);
      const none = items.every((v) => !v);
      const parent: boolean | 'indeterminate' = all ? true : none ? false : 'indeterminate';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Checkbox
            label="Select all"
            checked={parent}
            onCheckedChange={(c) => setItems(items.map(() => c === true))}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 28 }}>
            {['Email', 'SMS', 'Push'].map((name, i) => (
              <Checkbox
                key={name}
                label={name}
                checked={items[i]}
                onCheckedChange={(c) =>
                  setItems(items.map((v, j) => (j === i ? c === true : v)))
                }
              />
            ))}
          </div>
        </div>
      );
    };
    return <Demo />;
  },
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Disabled in every state: the box flattens to ' +
          '`--color-disabled-disabled-inverse` with a `--color-disabled-disabled` ' +
          'border and mark, and the label dims.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Unchecked + disabled" disabled />
      <Checkbox label="Checked + disabled" defaultChecked disabled />
      <Checkbox label="Indeterminate + disabled" checked="indeterminate" disabled />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: unchecked / checked / indeterminate, each enabled and ' +
          'disabled. Use it with the Theme toolbar to audit both `light.a` and ' +
          '`dark.a` at a glance.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" checked="indeterminate" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Checkbox label="Unchecked" disabled />
        <Checkbox label="Checked" defaultChecked disabled />
        <Checkbox label="Indeterminate" checked="indeterminate" disabled />
      </div>
    </div>
  ),
};

/** Pure interaction test (hidden from the docs page): toggling fires `onCheckedChange(true)`. */
export const TogglesFire: Story = {
  tags: ['!autodocs'],
  args: { label: 'Accept terms', onCheckedChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: /accept terms/i });
    await userEvent.click(box);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
