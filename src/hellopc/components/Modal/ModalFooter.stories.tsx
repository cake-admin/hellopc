import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { ModalFooter } from './ModalFooter';

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 453, maxWidth: '100%' }}>{children}</div>
);

const meta = {
  title: 'Components/Modal/Modal Footer',
  component: ModalFooter,
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal Footer is the bottom action region of a modal dialog. It pairs an
optional acknowledgement checkbox with a secondary and primary action. Use it
with Modal Title and Modal Content; use a standard Button group outside a
dialog.

Every color, spacing, radius, and type value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

The footer is a layout component. Its default checkbox is the existing
Radix-wrapped \`Checkbox\`, and its actions are existing \`Button\` instances:
secondary ghost first, primary filled second. Supply \`checkbox\` or
\`actions\` to replace either slot with a different hello pc composition.

## Usage

\`\`\`tsx
<ModalFooter onPrimaryAction={save} onSecondaryAction={close} />
<ModalFooter checkboxLabel="Don't show this again" onCheckboxCheckedChange={setDismissed} />
<ModalFooter primaryActionLabel="Delete" onPrimaryAction={remove} />
<ModalFooter checkbox={<Checkbox label="I understand" />} />
<ModalFooter actions={<Button>Continue</Button>} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| footer surface | \`--color-surfaces-container\` |
| footer inset | \`--space-300\` (16px vertical), \`--space-500\` (24px horizontal) |
| checkbox label gap | \`--space-100\` (8px) |
| action group gap | \`--space-300\` (16px) |
| checkbox label | \`--color-text-icon-secondary\`, \`--font-weight-medium\`, \`--type-size-body\` |
| default checkbox | Checkbox tokens, including \`--color-text-icon-secondary\` and \`--color-primary-primary\` |
| secondary action | Button \`secondary · ghost · sm\` tokens |
| primary action | Button \`primary · fill · sm\` tokens |

Figma node 97:5766 specifies a 453px reference width. Width belongs to the
surrounding dialog surface, so Modal Footer fills its parent.

## Accessibility

- The default Checkbox uses Radix Checkbox semantics, keyboard handling, and
  its associated visible label.
- The default actions are native buttons with visible text labels and preserve
  the shared Button focus treatment.
- Keep the secondary action before the primary action so keyboard and visual
  hierarchy stay predictable.
- If replacing either slot, provide components with equivalent accessible names
  and keyboard behavior.

## Do / Don't

| Do | Don't |
| --- | --- |
| Place the secondary action before the primary action. | Reverse the action hierarchy. |
| Use the checkbox for a small acknowledgement or preference. | Put required form validation in the footer checkbox. |
| Compose existing hello pc controls in replacement slots. | Rebuild local buttons or checkbox UI. |
| Let the parent dialog control width. | Add a fixed width to the footer itself. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    checkboxLabel: 'Don’t remind me again',
    secondaryActionLabel: 'Cancel',
    primaryActionLabel: 'Save changes',
    onCheckboxCheckedChange: fn(),
    onSecondaryAction: fn(),
    onPrimaryAction: fn(),
  },
  argTypes: {
    checkbox: { control: false, table: { category: 'Content' } },
    actions: { control: false, table: { category: 'Content' } },
    checkboxLabel: { control: 'text', table: { category: 'Content' } },
    checkboxChecked: {
      control: 'inline-radio',
      options: [true, false, 'indeterminate'],
      table: { category: 'State' },
    },
    defaultCheckboxChecked: { control: 'boolean', table: { category: 'State' } },
    checkboxDisabled: { control: 'boolean', table: { category: 'State' } },
    secondaryActionLabel: { control: 'text', table: { category: 'Content' } },
    secondaryActionDisabled: { control: 'boolean', table: { category: 'State' } },
    primaryActionLabel: { control: 'text', table: { category: 'Content' } },
    primaryActionDisabled: { control: 'boolean', table: { category: 'State' } },
    onCheckboxCheckedChange: { action: 'checkbox change', table: { category: 'Events' } },
    onSecondaryAction: { action: 'secondary action', table: { category: 'Events' } },
    onPrimaryAction: { action: 'primary action', table: { category: 'Events' } },
  },
} satisfies Meta<typeof ModalFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const ActionHierarchy: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The secondary ghost action precedes the filled primary action, preserving the hierarchy defined by the Figma Button Group.',
      },
    },
  },
  render: () => <ModalFooter secondaryActionLabel="Cancel" primaryActionLabel="Save changes" />,
};

export const ReplacementSlots: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Replace either slot with existing hello pc controls when a dialog needs a different acknowledgement or action composition.',
      },
    },
  },
  render: () => (
    <ModalFooter
      checkbox={<Checkbox label="I understand the consequences" />}
      actions={<Button size="sm">Continue</Button>}
    />
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The default checkbox and either action can be disabled independently, retaining their shared component semantics and tokens.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ModalFooter checkboxDisabled primaryActionDisabled />
      <ModalFooter secondaryActionDisabled />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'QA matrix for the default, custom-slot, and disabled compositions. Audit all examples under every Theme toolbar mode.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ModalFooter secondaryActionLabel="Cancel" primaryActionLabel="Save" />
      <ModalFooter defaultCheckboxChecked secondaryActionLabel="Back" primaryActionLabel="Continue" />
      <ModalFooter checkboxDisabled primaryActionDisabled />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): default action callbacks receive activation. */
export const PrimaryActionFires: Story = {
  tags: ['!autodocs'],
  args: { primaryActionLabel: 'Confirm', onPrimaryAction: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm' }));
    await expect(args.onPrimaryAction).toHaveBeenCalledTimes(1);
  },
};
