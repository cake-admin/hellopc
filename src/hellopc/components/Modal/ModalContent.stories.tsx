import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Dialog } from 'radix-ui';

import { Button } from '../Button/Button';
import { ModalContent } from './ModalContent';

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 446, maxWidth: '100%' }}>{children}</div>
);

/**
 * `Dialog.Description` requires Dialog context. The component is always
 * composed in a dialog, so examples provide the same context as product code.
 */
const DialogPreview = ({ children }: { children: React.ReactNode }) => (
  <Dialog.Root open>
    <Dialog.Content
      aria-describedby={undefined}
      style={{ position: 'relative', width: '100%', maxWidth: '100%' }}
    >
      <Dialog.Title style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>
        Dialog preview
      </Dialog.Title>
      {children}
    </Dialog.Content>
  </Dialog.Root>
);

const meta = {
  title: 'Components/Modal/Modal Content',
  component: ModalContent,
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
Modal Content is the body region of a modal dialog. Use it beneath Modal Title
to introduce the dialog task and hold its controls or supporting information.
Use Modal Title for the dialog's primary accessible title; this component's
optional subtitle only organizes the body content.

Every color, spacing, and type value resolves from hello pc CSS custom properties
that mirror Figma variables. The **Theme** toolbar re-themes every example
live; nothing is hardcoded.

The summary is rendered with Radix \`Dialog.Description\`, so Modal Content must
be inside a Radix Dialog. Keep \`description\` to phrasing content; use the
\`children\` slot for structured content and compose existing hello pc controls
there instead of recreating them.

## Usage

\`\`\`tsx
<ModalContent subtitle="Subtitle" description="Supporting context." />
<ModalContent description="This cannot be undone." />
<ModalContent subtitle="Permissions">
  <Button>Save changes</Button>
</ModalContent>
<ModalContent subtitle="Delete project" description="All files will be removed." />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| content surface | \`--color-surfaces-container\` |
| content inset | \`--space-300\` (16px vertical), \`--space-500\` (24px horizontal) |
| subtitle-to-body gap | \`--space-100\` (8px) |
| body content gap | \`--space-300\` (16px) |
| subtitle | \`--color-text-icon-primary\`, \`--font-weight-medium\`, \`--type-size-subtitle\` |
| description | \`--color-text-icon-secondary\`, \`--font-weight-regular\`, \`--type-size-body\` |

Figma node 97:5762 specifies the 16px by 24px content inset and a 446px
reference width. Width belongs to the surrounding dialog surface, so the
component itself fills its parent.

## Accessibility

- Radix \`Dialog.Description\` exposes the supplied description to the owning
  dialog when it is associated through \`aria-describedby\`.
- Modal Content must be rendered inside a Radix Dialog context.
- Use Modal Title for the dialog's primary accessible name; do not use the
  body subtitle as a substitute for a dialog title.
- Interactive controls in \`children\` retain their own keyboard and focus
  behavior from the hello pc components they compose.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use the description to concisely explain the dialog task. | Repeat the Modal Title verbatim. |
| Compose existing hello pc controls in the body slot. | Rebuild buttons or form elements inside the modal. |
| Keep the subtitle optional and task-focused. | Treat it as the dialog's accessible title. |
| Let the parent dialog set the modal width. | Add fixed width styling to Modal Content. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    subtitle: 'Subtitle',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus auctor lorem quis vulputate rhoncus. Donec ornare enim purus.',
  },
  argTypes: {
    subtitle: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    children: { control: false, table: { category: 'Content' } },
  },
} satisfies Meta<typeof ModalContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
};

export const ContentSlot: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Use the body slot for existing hello pc components when the dialog needs a follow-up action or structured content.',
      },
    },
  },
  render: () => (
    <Frame>
      <ModalContent
        subtitle="Manage notification settings"
        description="Choose how this workspace should notify your team."
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Button intent="secondary">Cancel</Button>
          <Button>Save changes</Button>
        </div>
      </ModalContent>
    </Frame>
  ),
};

export const OptionalContent: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Both the body subtitle and description are optional, allowing the same content region to support concise or structured dialog bodies.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ModalContent description="This action cannot be undone." />
        <ModalContent subtitle="Project details">
          <Button>View details</Button>
        </ModalContent>
      </div>
    </Frame>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'QA matrix for the text-only, subtitle-plus-description, and structured-body compositions. Audit every case under all Theme toolbar modes.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ModalContent description="A concise dialog explanation." />
        <ModalContent subtitle="Subtitle" description="A subtitle and supporting explanation." />
        <ModalContent subtitle="Action required" description="Review the details before continuing.">
          <Button>Continue</Button>
        </ModalContent>
      </div>
    </Frame>
  ),
};

/** Pure semantic test (hidden from docs): the description is available in its Dialog context. */
export const DescriptionRenders: Story = {
  tags: ['!autodocs'],
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
  args: { description: 'Settings are saved automatically.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Settings are saved automatically.')).toBeInTheDocument();
  },
};
