import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PanelsTopLeft } from 'lucide-react';

import { ModalIcon, type ModalIconType } from './ModalIcon';

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
    {children}
  </div>
);

const TYPES: ModalIconType[] = ['icon', 'info', 'success', 'warning', 'error', 'neutral'];

const meta = {
  title: 'Components/Modal/Modal Icon',
  component: ModalIcon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Modal Icon is the 32px leading visual for modal headers. Use a semantic type
for informational, successful, warning, or error dialogs. Use the generic
\`icon\` type only when a custom 24px glyph adds useful context. Modal Title
exclusively composes this component for its leading treatment. This shared
semantic glyph set is also what the \`Toast\` component composes for its
status icon (\`neutral\` covers Toast's colorless "greyscale" status).

Every color, spacing, radius, and type value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

Modal Icon is display-only. It uses Radix \`AccessibleIcon\` to provide a
screen-reader label when used independently. When composed by Modal Title it
is decorative, because the dialog heading already communicates the meaning.

## Usage

\`\`\`tsx
<ModalIcon type="info" />
<ModalIcon type="success" />
<ModalIcon type="warning" />
<ModalIcon type="error" />
<ModalIcon type="icon" icon={<PanelsTopLeft />} label="Workspace" />
<ModalIcon type="success" decorative />
<ModalIcon type="neutral" />
\`\`\`

## Design tokens used

| Type · part | Tokens |
| --- | --- |
| generic icon | \`--color-text-icon-primary\` |
| info | \`--color-info-info\` |
| success | \`--color-success-success\` |
| warning | \`--color-warning-warn\` |
| error | \`--color-error-error\` |
| neutral | \`--color-text-icon-primary\` (info circle-i shape) |
| glyph inset | \`--space-050\` (4px) |

Figma node 97:5706 specifies a 24px glyph with 4px state-layer padding,
producing a 32px leading item.

## Accessibility

- Standalone non-decorative icons use Radix \`AccessibleIcon\` to provide the
  visible icon with a screen-reader label.
- Set \`decorative\` when adjacent text already conveys the icon’s meaning.
- Modal Icon is display-only and has no focus stop or keyboard interaction.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use \`success\`, \`warning\`, and \`error\` for matching modal outcomes. | Use semantic colors only for decoration. |
| Mark icons decorative when Modal Title already supplies the meaning. | Announce the same meaning twice in a dialog header. |
| Supply a concise label for a standalone generic icon. | Use a generic icon where a semantic treatment exists. |
| Keep the glyph to the supplied 24px slot. | Resize the icon independently of the component. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    type: 'icon',
    label: 'Dialog icon',
    decorative: false,
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: TYPES,
      table: { category: 'Appearance' },
    },
    icon: { control: false, table: { category: 'Content' } },
    label: { control: 'text', table: { category: 'Accessibility' } },
    decorative: { control: 'boolean', table: { category: 'Accessibility' } },
  },
} satisfies Meta<typeof ModalIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Types: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The Figma type variants map to semantic hello pc color tokens; all retain the same 32px geometry.',
      },
    },
  },
  render: () => (
    <Row>
      {TYPES.map((type) => (
        <ModalIcon key={type} type={type} />
      ))}
    </Row>
  ),
};

export const CustomIcon: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The generic icon treatment accepts a custom glyph while semantic treatments retain their standard glyphs.',
      },
    },
  },
  render: () => (
    <Row>
      <ModalIcon type="icon" icon={<PanelsTopLeft />} label="Workspace" />
      <ModalIcon type="info" />
    </Row>
  ),
};

export const Decorative: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Set decorative when nearby dialog text already provides the meaningful label, as Modal Title does.',
      },
    },
  },
  render: () => <ModalIcon type="success" decorative />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'QA matrix for every modal icon treatment. Audit color contrast under all Theme toolbar modes.',
      },
    },
  },
  render: () => (
    <Row>
      {TYPES.map((type) => (
        <ModalIcon key={type} type={type} />
      ))}
    </Row>
  ),
};

/** Pure semantic test (hidden from docs): standalone icons expose their Radix accessible label. */
export const ExposesAccessibleLabel: Story = {
  tags: ['!autodocs'],
  args: { type: 'success', label: 'Operation completed' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Operation completed')).toBeInTheDocument();
  },
};
