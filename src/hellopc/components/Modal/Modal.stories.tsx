import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PanelsTopLeft } from 'lucide-react';

import { Button } from '../Button/Button';
import { Modal } from './Modal';
import { ModalContent } from './ModalContent';
import { ModalFooter } from './ModalFooter';

const meta = {
  title: 'Components/Modal/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal is the elevated dialog surface that combines the Modal elements into a
complete, accessible dialog. Use it for transient, focused tasks that must
interrupt the current flow; use inline page sections or a non-modal popover for
content that should not trap focus.

Every color, spacing, radius, and shadow value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded — including the \`--elevation-5\` drop shadow.

Modal wraps Radix \`Dialog\`, so it owns focus trapping, scroll locking, escape
and overlay dismissal, and the \`dialog\` role. The header is built from the
reusable \`ModalTitle\`; the body and footer are **slots**. Drop in the other
Modal elements (\`ModalContent\`, \`ModalFooter\`), images, or custom hello pc
content. A Radix Dialog exposes a single accessible description, so when the
header \`subtitle\` is set, any \`ModalContent\` in the body should pass
\`descriptionAsDialogDescription={false}\` so only one description is registered.

## Usage

\`\`\`tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open modal</Button>
<Modal
  open={open}
  onOpenChange={setOpen}
  title="Title"
  subtitle="Subtitle"
  modalIcon="icon"
  modalIconSlot={<PanelsTopLeft />}
  footer={<ModalFooter onPrimaryAction={() => setOpen(false)} onSecondaryAction={() => setOpen(false)} />}
>
  <ModalContent
    subtitle="Subtitle"
    description="Supporting content."
    descriptionAsDialogDescription={false}
  />
</Modal>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| surface | \`--color-surfaces-container\` |
| corner radius | \`--radius-400\` (24px) |
| elevation | \`--elevation-5\` (Figma \`elevation/5\`) |
| scrim · color | \`--color-overlay-scrim\` — a white-tinted veil in light (\`rgba(255, 255, 255, 0.6)\`), black-tinted in dark (\`rgba(0, 0, 0, 0.3)\`) |
| scrim · blur | \`backdrop-filter: blur(12px)\` — fixed in both themes, not tokenized |
| body gap | \`--space-100\` (8px) |
| max height inset | \`--space-800\` (48px) |
| header / content / footer | composed \`ModalTitle\`, \`ModalContent\`, \`ModalFooter\` tokens |

Figma node 105:5863 specifies a 448px default width that may grow to 640px.
Width is intrinsic modal geometry.

## Accessibility

- Radix Dialog provides the \`dialog\` role, focus trap, initial focus, scroll
  lock, and escape/overlay dismissal.
- \`ModalTitle\` supplies the required \`Dialog.Title\`; the header subtitle
  becomes the \`Dialog.Description\` when present.
- Keep exactly one \`Dialog.Description\` per modal — opt body content out with
  \`descriptionAsDialogDescription={false}\` when the header already provides it.
- The close control reuses the shared IconButton and its focus ring; set
  \`showClose={false}\` only when dismissal is handled elsewhere.
- In Win HCT, \`--color-overlay-scrim\` resolves to opaque white — the blur
  has nothing translucent left to soften, which is expected in that mode.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use a modal for a focused, interrupting task. | Use a modal for non-blocking, ambient content. |
| Compose the body from existing hello pc components. | Rebuild inputs, buttons, or checkboxes inside it. |
| Keep a single accessible description per dialog. | Register two \`Dialog.Description\` elements. |
| Wire the footer actions to the modal open state. | Leave a modal with no way to dismiss it. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    modalIcon: 'icon',
    showClose: true,
    onOpenChange: fn(),
  },
  argTypes: {
    open: { control: false, table: { category: 'State' } },
    defaultOpen: { control: 'boolean', table: { category: 'State' } },
    showClose: { control: 'boolean', table: { category: 'Appearance' } },
    title: { control: 'text', table: { category: 'Content' } },
    subtitle: { control: 'text', table: { category: 'Content' } },
    modalIcon: {
      control: 'inline-radio',
      options: ['icon', 'info', 'success', 'warning', 'error'],
      table: { category: 'Content' },
    },
    modalIconSlot: { control: false, table: { category: 'Content' } },
    closeLabel: { control: 'text', table: { category: 'Accessibility' } },
    children: { control: false, table: { category: 'Content' } },
    footer: { control: false, table: { category: 'Content' } },
    onOpenChange: { action: 'open change', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — open the modal, then drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          open={open}
          onOpenChange={setOpen}
          modalIconSlot={<PanelsTopLeft />}
          footer={
            <ModalFooter
              onPrimaryAction={() => setOpen(false)}
              onSecondaryAction={() => setOpen(false)}
              primaryActionLabel="Save changes"
              secondaryActionLabel="Cancel"
            />
          }
        >
          <ModalContent
            subtitle="Subtitle"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor lorem quis vulputate rhoncus. Donec ornare enim purus."
            descriptionAsDialogDescription={false}
          />
        </Modal>
      </>
    );
  },
};

export const Composition: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The full Figma composition: a ModalTitle header, a ModalContent body, and a ModalFooter — all reusing existing hello pc components.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open composed modal</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Title"
          subtitle="Subtitle"
          modalIcon="icon"
          modalIconSlot={<PanelsTopLeft />}
          footer={
            <ModalFooter
              onPrimaryAction={() => setOpen(false)}
              onSecondaryAction={() => setOpen(false)}
              primaryActionLabel="Primary"
              secondaryActionLabel="Secondary"
            />
          }
        >
          <ModalContent
            subtitle="Subtitle"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor lorem quis vulputate rhoncus. Donec ornare enim purus."
            descriptionAsDialogDescription={false}
          />
        </Modal>
      </>
    );
  },
};

export const WithoutFooter: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The footer slot is optional. Omit it for informational dialogs whose only dismissal is the header close control.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal open={open} onOpenChange={setOpen} title="Heads up" subtitle="A quick note">
          <ModalContent
            description="This modal has no footer, so the header close control is the only way to dismiss it."
            descriptionAsDialogDescription={false}
          />
        </Modal>
      </>
    );
  },
};

export const SemanticIcon: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The header leading icon accepts the semantic ModalIcon treatments to reinforce success, warning, and error dialogs.',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button intent="secondary" onClick={() => setOpen(true)}>
          Open error modal
        </Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Delete project"
          subtitle="This action cannot be undone"
          modalIcon="error"
          footer={
            <ModalFooter
              primaryActionLabel="Delete"
              secondaryActionLabel="Cancel"
              onPrimaryAction={() => setOpen(false)}
              onSecondaryAction={() => setOpen(false)}
            />
          }
        >
          <ModalContent
            description="All files and history for this project will be permanently removed."
            descriptionAsDialogDescription={false}
          />
        </Modal>
      </>
    );
  },
};

/** Pure interaction test (hidden from docs): opening reveals the dialog, and the close control dismisses it. */
export const OpensAndCloses: Story = {
  tags: ['!autodocs'],
  args: { title: 'Settings', subtitle: 'Manage your preferences', closeLabel: 'Close settings' },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal {...args} open={open} onOpenChange={setOpen}>
          <ModalContent
            description="Dialog body content."
            descriptionAsDialogDescription={false}
          />
        </Modal>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));

    const dialog = await within(document.body).findByRole('dialog');
    await expect(dialog).toBeInTheDocument();
    await expect(within(dialog).getByText('Settings')).toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole('button', { name: 'Close settings' }));
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};
