import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Button } from '../Button/Button';
import { RichTooltip } from './RichTooltip';

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
  title: 'Components/Tooltip/Rich',
  component: RichTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Rich Tooltip provides structured, contextual guidance with an optional title,
step indicator, close control, and actions (Figma node 128:8611). Use it for
short product tours or guided explanations attached to a specific trigger. Use
**Simple Tooltip** for one-line definitions and Modal for blocking decisions or
long workflows.

Every color, radius, spacing, type, blur, and shadow color resolves from hello pc
CSS custom properties that mirror Figma variables. The **Theme** toolbar
re-themes every example live; nothing is hardcoded. The Figma high-blur surface
keeps its precise two-layer shadow: 0×8×24 light plus 0×4×48 heavy.

Although named “Rich Tooltip” in Figma, this component wraps Radix \`Popover\`
because it contains focusable actions; ARIA tooltips must not contain
interactive controls. Radix owns click/keyboard opening, focus handling,
Escape/outside dismissal, portal positioning, and collision avoidance. The
surface reuses hello pc **IconButton** for close and **Button** for default actions.

## Usage

\`\`\`tsx
<RichTooltip trigger="Learn more">Contextual guidance</RichTooltip>
<RichTooltip trigger="Start tour" title="Create a workspace" stepperText="Step 1 of 4">Choose a name first.</RichTooltip>
<RichTooltip trigger="Tip" showFooter={false}>Read-only rich guidance.</RichTooltip>
<RichTooltip trigger="Tip" showHeader={false}>Body and actions only.</RichTooltip>
<RichTooltip trigger="Tip" actions={<Button>Continue</Button>}>Custom action slot.</RichTooltip>
<RichTooltip trigger="Controlled" open={open} onOpenChange={setOpen}>Controlled state.</RichTooltip>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| blurred surface | \`--color-surfaces-container-blur-high\`, 45px backdrop blur |
| title | \`--font-family\`, \`--type-size-subtitle\`, \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| body | \`--font-family\`, \`--type-size-body\` (14px), \`--font-weight-regular\`, \`--color-text-icon-primary\` |
| step text | \`--type-size-body\`, \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| padding / gaps / shape | \`--space-500\`, \`--space-300\`, \`--space-200\`, \`--space-100\`, \`--radius-400\` |
| elevation | \`--elevation-5\` (Figma \`elevation/5\`) |
| trigger focus ring | \`--stroke-200\`, \`--color-primary-primary\`, \`--space-025\` offset |
| actions | delegated to reusable \`Button\` and \`IconButton\` tokens |

## Accessibility

- Rich Tooltip uses Radix Popover so its close and action buttons remain valid,
  reachable keyboard controls instead of being placed inside \`role="tooltip"\`.
- The heading and body are connected to the popover through
  \`aria-labelledby\` and \`aria-describedby\`.
- Escape and outside interaction dismiss the surface. The visible close
  IconButton has the accessible label “Close tooltip”.
- If trigger content is only an icon, provide \`triggerAriaLabel\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for optional, contextual guidance anchored to one control. | Use for required consent or destructive confirmation — use Modal. |
| Keep the title, body, and actions concise. | Turn it into a multi-page form. |
| Replace \`actions\` with existing hello pc Buttons when needed. | Rebuild private button styles inside the tooltip. |
| Provide clear step text for guided sequences. | Show “Step 1 of 4” when no sequence exists. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    trigger: <TriggerLabel>Open rich tooltip</TriggerLabel>,
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    title: 'Title',
    showHeader: true,
    showTitle: true,
    showClose: true,
    showFooter: true,
    showStepper: true,
    stepperText: 'Step 1 of 4',
    secondaryActionLabel: 'Secondary',
    primaryActionLabel: 'Primary',
    defaultOpen: true,
    side: 'bottom',
    align: 'center',
    sideOffset: 12,
    width: 448,
    onOpenChange: fn(),
    onClose: fn(),
    onSecondaryAction: fn(),
    onPrimaryAction: fn(),
  },
  argTypes: {
    trigger: { control: false, table: { category: 'Content' } },
    children: { control: 'text', table: { category: 'Content' } },
    triggerAriaLabel: { control: 'text', table: { category: 'Content' } },
    title: { control: 'text', table: { category: 'Content' } },
    stepperText: { control: 'text', table: { category: 'Content' } },
    actions: { control: false, table: { category: 'Content' } },
    secondaryActionLabel: { control: 'text', table: { category: 'Content' } },
    primaryActionLabel: { control: 'text', table: { category: 'Content' } },
    showHeader: { control: 'boolean', table: { category: 'Appearance' } },
    showTitle: { control: 'boolean', table: { category: 'Appearance' } },
    showClose: { control: 'boolean', table: { category: 'Appearance' } },
    showFooter: { control: 'boolean', table: { category: 'Appearance' } },
    showStepper: { control: 'boolean', table: { category: 'Appearance' } },
    width: { control: 'text', table: { category: 'Appearance' } },
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
    open: { control: 'boolean', table: { category: 'State' } },
    defaultOpen: { control: 'boolean', table: { category: 'State' } },
    onOpenChange: { action: 'openChange', table: { category: 'Events' } },
    onClose: { action: 'close', table: { category: 'Events' } },
    onSecondaryAction: { action: 'secondaryAction', table: { category: 'Events' } },
    onPrimaryAction: { action: 'primaryAction', table: { category: 'Events' } },
  },
} satisfies Meta<typeof RichTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const ReadOnly: Story = {
  args: { showFooter: false },
  parameters: {
    docs: {
      description: {
        story:
          'Hide the footer for structured but read-only guidance. The title and close IconButton remain available.',
      },
    },
  },
};

export const CustomActions: Story = {
  args: {
    showStepper: false,
    actions: (
      <>
        <Button size="md" intent="secondary" variant="outline">
          Remind me later
        </Button>
        <Button size="md">Continue</Button>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'The action slot accepts existing hello pc Buttons, preserving one source of truth for button behavior and styling.',
      },
    },
  },
};

export const Minimal: Story = {
  args: {
    showHeader: false,
    showFooter: false,
    children: 'A concise block of structured guidance without header or actions.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Header and footer can both be removed, but use Simple Tooltip instead when the remaining content is only a short phrase.',
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
          'QA examples for full, read-only, and minimal compositions. Audit backdrop blur and both shadow layers under every Theme toolbar mode.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 520, padding: 80 }}>
      <RichTooltip trigger={<TriggerLabel>Full</TriggerLabel>} defaultOpen>
        Full guidance with step progress and both default actions.
      </RichTooltip>
      <RichTooltip trigger={<TriggerLabel>Read only</TriggerLabel>} defaultOpen showFooter={false}>
        Structured guidance without actions.
      </RichTooltip>
    </div>
  ),
};

/** Pure interaction test (hidden from docs): trigger opens and close IconButton dismisses. */
export const OpensAndCloses: Story = {
  tags: ['!autodocs'],
  args: { defaultOpen: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /open rich tooltip/i }));
    await expect(await within(document.body).findByRole('dialog')).toBeVisible();
    await userEvent.click(within(document.body).getByRole('button', { name: /close tooltip/i }));
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};
