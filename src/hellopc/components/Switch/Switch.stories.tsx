import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A binary on/off control built on the Radix \`Switch\` primitive and styled with
hello pc tokens. Use it for **instant-effect settings** — flipping it applies the
change immediately. For choices that are submitted later with a form, use a
Checkbox instead.

Works controlled (\`checked\` + \`onCheckedChange\`, you own the state) or
uncontrolled (\`defaultChecked\`, the switch owns it). Radix owns the
accessibility and state machine (\`role="switch"\`, keyboard, \`data-state\`);
hello pc owns the visuals via the design-token CSS custom properties
(\`--color-*\`, \`--radius-*\`, \`--space-*\`, 1:1 with the Figma variables) —
the **Theme** toolbar toggle re-themes every example on this page live via
\`[data-theme]\`.

Matches the hello pc Toggle spec: a 38×24 pill track with an 18px thumb inset
3px. While pressed, the thumb stretches to 27px (anchored to the side it's
on) and springs back on release — try holding a click on any example.

## Usage

\`\`\`tsx
<Switch label="Enable notifications" />
<Switch label="Email digests" defaultChecked />
<Switch label="Beta features" checked={on} onCheckedChange={setOn} />
<Switch label="SMS" disabled />
<Switch aria-label="Enable notifications" />
\`\`\`

## Design tokens used

Custom-property names mirror the Figma variables
(\`color/secondary/secondaryHover\` ⇄ \`--color-secondary-secondary-hover\`).

| Part | Tokens |
| --- | --- |
| Track (off) | \`--color-secondary-secondary\`, hover \`--color-secondary-secondary-hover\`, pressed \`--color-secondary-secondary\` |
| Track (on) | \`--color-primary-primary\`, hover \`--color-primary-primary-hover\`, pressed \`--color-primary-primary-press\` |
| Track (disabled) | \`--color-disabled-disabled-inverse\` |
| Thumb | \`--color-surfaces-container\`; disabled \`--color-disabled-disabled\`; stretches 18→27px while pressed |
| Focus ring | \`--stroke-200\` \`--color-primary-primary\` stroke, 2px outside the track |
| Label | \`--font-family\` + \`--type-size-body\`, \`--color-text-icon-primary\`; disabled \`--color-disabled-disabled-inverse\` |
| Shape / gap | \`--radius-1000\` track + thumb, \`--space-100\` label gap |

## Accessibility

- Radix provides \`role="switch"\`, the checked state, and Space/Enter keyboard
  toggling — don't re-implement any of it.
- A visible \`label\` is wired via \`<label htmlFor>\`, so clicking the text
  toggles the control.
- **Labelless switches must pass \`aria-label\`** — the control otherwise has no
  accessible name.
- The two-layer focus ring stays visible on any surface; focus is restyled,
  never removed.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for settings that apply instantly. | Use for choices submitted later — that's a Checkbox. |
| Give every switch a label (visible or \`aria-label\`). | Ship an unlabeled switch. |
| Use one switch per independent setting. | Use two switches for mutually exclusive options — use radios. |
| Keep labels short and stateless ("Email digests"). | Bake the state into the label ("Notifications are on"). |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Enable notifications',
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: { control: 'boolean', table: { category: 'State' } },
    defaultChecked: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    label: { control: 'text', table: { category: 'Content' } },
    'aria-label': { control: 'text', table: { category: 'Content' } },
    onCheckedChange: { action: 'checkedChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const On: Story = {
  args: { defaultChecked: true },
  parameters: {
    docs: {
      description: {
        story:
          'Checked via `defaultChecked` (uncontrolled). The track switches to ' +
          '`--color-primary-primary` and the thumb slides right.',
      },
    },
  },
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Both disabled states: the track flattens to ' +
          '`--color-disabled-disabled-inverse` with a `--color-disabled-disabled` ' +
          'thumb, the label dims to `--color-disabled-disabled-inverse`, and the ' +
          'cursor signals not-allowed.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Switch label="Off + disabled" disabled />
      <Switch label="On + disabled" disabled defaultChecked />
    </div>
  ),
};

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': 'Enable notifications' },
  parameters: {
    docs: {
      description: {
        story:
          'A bare control for table rows or tight layouts. **`aria-label` is ' +
          'required here** — without a visible label it is the only accessible ' +
          'name the switch has.',
      },
    },
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: off/on × default/disabled, plus a labelless control. ' +
          'Hold a click on the enabled ones to see the pressed thumb stretch. ' +
          'Use it with the Theme toolbar to audit both `light.a` and `dark.a` ' +
          'at a glance.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Switch label="Off" />
        <Switch label="On" defaultChecked />
        <Switch aria-label="Labelless" />
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Switch label="Off + disabled" disabled />
        <Switch label="On + disabled" disabled defaultChecked />
      </div>
    </div>
  ),
};

/** Pure interaction test (hidden from the docs page): toggling fires `onCheckedChange(true)`. */
export const TogglesFire: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch');
    await userEvent.click(toggle);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
