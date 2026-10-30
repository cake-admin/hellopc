import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PanelsTopLeft } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { ModalTitle } from './ModalTitle';

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 520, maxWidth: '100%' }}>{children}</div>
);

/**
 * Dialog.Title and Dialog.Description require Radix Dialog context. The
 * component is always used inside a dialog in product code, so the docs
 * preview provides the same context instead of rendering an invalid standalone
 * header.
 */
const DialogPreview = ({ children }: { children: React.ReactNode }) => (
  <Dialog.Root open>
    <Dialog.Content
      aria-describedby={undefined}
      style={{ position: 'relative', width: '100%', maxWidth: '100%' }}
    >
      {children}
    </Dialog.Content>
  </Dialog.Root>
);

const meta = {
  title: 'Components/Modal/Modal Title',
  component: ModalTitle,
  decorators: [
    (Story) => (
      <DialogPreview>
        <Story />
      </DialogPreview>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal Title is the header region of a modal dialog. It presents the dialog's
primary heading, optional supporting text, an optional leading icon, and a
close action. Use it inside a Radix Dialog content surface; use a page heading
instead when the content is not a transient modal.

Every color, spacing, radius, and type value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

The heading and subtitle render through Radix \`Dialog.Title\` and
\`Dialog.Description\`. The close action composes the existing 40px ghost
\`IconButton\`; provide \`onClose\` and update the owning Dialog's open state.
When \`onClose\` is omitted, no close button is rendered.

## Usage

\`\`\`tsx
<ModalTitle title="Title" />
<ModalTitle title="Title" subtitle="Subtitle" />
<ModalTitle title="Team members" modalIcon="success" />
<ModalTitle title="Settings" onClose={() => setOpen(false)} />
<ModalTitle title="Preferences" subtitle="Configure your experience" modalIcon="icon" modalIconSlot={<PanelsTopLeft />} onClose={close} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| header surface | \`--color-surfaces-container\` |
| header padding | \`--space-300\` (16px vertical), \`--space-500\` (24px horizontal) |
| content gap · close separation | \`--space-100\` (8px) |
| title | \`--color-text-icon-primary\`, \`--font-weight-medium\`, \`--type-size-subtitle\` |
| subtitle | \`--color-text-icon-secondary\`, \`--font-weight-regular\`, \`--type-size-body\` |
| leading icon | ModalIcon semantic color tokens plus \`--space-050\` |
| close action | IconButton \`ghost · secondary · md\` tokens |

Figma node 97:5727 specifies 40px leading and close controls, with a 24px
glyph slot.

## Accessibility

- Radix \`Dialog.Title\` and \`Dialog.Description\` provide the heading and
  description semantics consumed by the owning Dialog.
- The close action is the existing IconButton, which uses Radix
  \`AccessibleIcon\` to announce its \`closeLabel\`.
- The close control retains the shared IconButton keyboard focus ring.
- Keep the title concise; long text truncates to preserve the header layout.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use a concise title that describes the dialog's task. | Use a page heading as a modal title. |
| Provide a subtitle only when it adds useful context. | Repeat the title in the subtitle. |
| Wire \`onClose\` to the owning Dialog state. | Treat this header as the component that owns dialog state. |
| Use a familiar leading glyph to reinforce the dialog context. | Add multiple competing actions to the header. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    onClose: fn(),
    closeLabel: 'Close dialog',
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    subtitle: { control: 'text', table: { category: 'Content' } },
    modalIcon: {
      control: 'inline-radio',
      options: ['icon', 'info', 'success', 'warning', 'error'],
      table: { category: 'Content' },
    },
    modalIconSlot: { control: false, table: { category: 'Content' } },
    closeLabel: { control: 'text', table: { category: 'Accessibility' } },
    onClose: { action: 'close', table: { category: 'Events' } },
  },
} satisfies Meta<typeof ModalTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Content: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Add supporting text and a semantic ModalIcon treatment when they clarify the dialog’s purpose.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ModalTitle title="Title only" />
        <ModalTitle title="Add team members" subtitle="Invite people to this workspace" />
        <ModalTitle
          title="Team members"
          subtitle="Manage access and invitations"
          modalIcon="success"
          onClose={fn()}
        />
      </div>
    </Frame>
  ),
};

export const CloseAction: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The optional close action reuses the existing 40px ghost IconButton and is omitted when the parent modal does not allow direct dismissal.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ModalTitle title="Dismissible dialog" subtitle="Select the close action to leave" onClose={fn()} />
        <ModalTitle title="Required action" subtitle="Complete the flow to continue" />
      </div>
    </Frame>
  ),
};

export const TextOverflow: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The title and subtitle preserve the header’s single-line layout by truncating long content.',
      },
    },
  },
  render: () => (
    <Frame>
      <ModalTitle
        title="This is an intentionally long modal title that truncates instead of colliding with close"
        subtitle="This intentionally long supporting message truncates to preserve the header layout."
        modalIcon="warning"
        onClose={fn()}
      />
    </Frame>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'QA matrix for title-only, supporting-text, leading-icon, and close-action combinations. Audit under every Theme toolbar mode.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ModalTitle title="Title only" />
        <ModalTitle title="With subtitle" subtitle="Supporting context" />
          <ModalTitle title="With icon" modalIcon="info" />
        <ModalTitle title="With close" onClose={fn()} />
        <ModalTitle title="Complete header" subtitle="Supporting context" modalIcon="icon" modalIconSlot={<PanelsTopLeft />} onClose={fn()} />
      </div>
    </Frame>
  ),
};

/** Pure interaction test (hidden from docs): close action fires the supplied callback. */
export const CloseFires: Story = {
  tags: ['!autodocs'],
  args: { title: 'Settings', onClose: fn(), closeLabel: 'Close settings' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Close settings' }));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
