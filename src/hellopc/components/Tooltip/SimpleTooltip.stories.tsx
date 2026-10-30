import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { SimpleTooltip } from './SimpleTooltip';

const TriggerLabel = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      padding: '8px 12px',
      borderRadius: 8,
      background: 'var(--color-surfaces-on-container)',
      color: 'var(--color-text-icon-primary)',
      fontFamily: 'var(--font-family)',
    }}
  >
    {children}
  </span>
);

const meta = {
  title: 'Components/Tooltip/Simple',
  component: SimpleTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Simple Tooltip provides a short, supplemental text description (Figma node
128:8606). Use it to clarify an unfamiliar control or truncated label. Keep it
brief and non-interactive; use **Rich Tooltip** when the surface needs a title,
actions, or structured guidance.

Every color, radius, spacing, type, and shadow resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

Simple Tooltip wraps Radix \`Tooltip\`. Radix owns hover/focus timing,
\`aria-describedby\`, portal positioning, collision avoidance, and Escape
dismissal. The trigger renders as a real button and accepts non-interactive
content; do not nest another button inside it.

## Usage

\`\`\`tsx
<SimpleTooltip trigger="Info">Explains this setting</SimpleTooltip>
<SimpleTooltip trigger="Keyboard shortcuts" side="bottom">Press Ctrl + K</SimpleTooltip>
<SimpleTooltip trigger={<InfoIcon />} triggerAriaLabel="About storage">Stored locally</SimpleTooltip>
<SimpleTooltip trigger="Long label" maxWidth={200}>A longer explanation that wraps.</SimpleTooltip>
<SimpleTooltip trigger="Delayed" delayDuration={500}>Opens after half a second</SimpleTooltip>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| inverse surface | \`--color-surfaces-inverse-container\` |
| text | \`--color-text-icon-inverse\`, \`--font-family\`, \`--type-size-caption\`, \`--font-weight-regular\` |
| padding / shape | \`--space-100\` vertical, \`--space-200\` horizontal, \`--radius-200\` |
| elevation | \`--elevation-2\` (Figma \`elevation/2\`) |
| trigger focus ring | \`--stroke-200\`, \`--color-primary-primary\`, \`--space-025\` offset |

## Accessibility

- Radix connects the tooltip to its trigger with \`aria-describedby\` and opens
  it for both pointer hover and keyboard focus.
- If trigger content is only an icon, provide \`triggerAriaLabel\` so the button
  itself has an accessible name.
- Tooltip content must remain supplemental and non-interactive. Links, buttons,
  and required instructions belong in Rich Tooltip or persistent page content.
- Escape dismisses the surface, and reduced-motion preferences disable its
  entrance animation.

## Do / Don't

| Do | Don't |
| --- | --- |
| Explain unfamiliar icons or concise terms. | Repeat a visible, self-explanatory label. |
| Keep copy short enough to scan without interaction. | Put paragraphs, links, or actions inside. |
| Provide an accessible name for icon-only triggers. | Assume the tooltip text names the trigger action. |
| Place required instructions visibly in the page. | Hide critical information behind hover. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    trigger: <TriggerLabel>Hover or focus</TriggerLabel>,
    children: 'Tooltip text',
    open: undefined,
    defaultOpen: false,
    delayDuration: 0,
    side: 'top',
    align: 'center',
    sideOffset: 8,
    maxWidth: 280,
    onOpenChange: fn(),
  },
  argTypes: {
    trigger: { control: false, table: { category: 'Content' } },
    children: { control: 'text', table: { category: 'Content' } },
    triggerAriaLabel: { control: 'text', table: { category: 'Content' } },
    open: { control: 'boolean', table: { category: 'State' } },
    defaultOpen: { control: 'boolean', table: { category: 'State' } },
    delayDuration: { control: 'number', table: { category: 'Behavior' } },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      table: { category: 'Appearance' },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      table: { category: 'Appearance' },
    },
    sideOffset: { control: 'number', table: { category: 'Appearance' } },
    maxWidth: { control: 'text', table: { category: 'Appearance' } },
    onOpenChange: { action: 'openChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof SimpleTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Wrapping: Story = {
  args: {
    children:
      'A longer tooltip can wrap for supplemental context, but required instructions should remain visible in the page.',
    maxWidth: 220,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Copy wraps up to `maxWidth`; the Figma maximum is 280px. Prefer shorter phrasing whenever possible.',
      },
    },
  },
};

export const Placements: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Radix supports all four preferred sides and automatically flips or shifts when the requested placement would collide.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 80, padding: 80 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <SimpleTooltip
          key={side}
          trigger={<TriggerLabel>{side}</TriggerLabel>}
          side={side}
        >
          {side} tooltip
        </SimpleTooltip>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA examples for short and wrapping content. Audit inverse contrast and both elevation layers under every Theme toolbar mode.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 80, padding: 80 }}>
      <SimpleTooltip trigger={<TriggerLabel>Short</TriggerLabel>}>
        Tooltip text
      </SimpleTooltip>
      <SimpleTooltip trigger={<TriggerLabel>Wrapping</TriggerLabel>} maxWidth={180}>
        Longer supplemental text wraps within the configured maximum width.
      </SimpleTooltip>
    </div>
  ),
};

/** Pure interaction test (hidden from docs): hovering opens the Radix tooltip. */
export const OpensOnHover: Story = {
  tags: ['!autodocs'],
  args: { open: undefined, defaultOpen: false, delayDuration: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button'));
    await expect(await within(document.body).findByRole('tooltip')).toBeVisible();
  },
};
