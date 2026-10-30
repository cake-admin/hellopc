import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Divider } from './Divider';

const meta = {
  title: 'Elements/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Divider separates adjacent groups of related content without adding a new
heading or interactive control. Use the default primary rule between distinct
content groups; use weak only where the separation should deliberately recede.
Use a heading, spacing, or a Card boundary when content needs stronger
structure.

Every color and inset resolves from hello pc CSS custom properties mirroring Figma
variables. The **Theme** toolbar re-themes every example live; nothing is
hardcoded.

Divider renders a non-interactive \`<div role="separator">\`. Horizontal
dividers fill their parent width; vertical dividers stretch to the height of a
flex or grid parent. It has no focus or event behavior and composes no other
element because it is itself a presentational primitive.

## Usage

\`\`\`tsx
<Divider />
<Divider weight="weak" />
<Divider direction="vertical" />
<Divider direction="vertical" weight="weak" />
<section><Divider /></section>
\`\`\`

## Design tokens used

| Part · variant | Tokens |
| --- | --- |
| primary rule | \`--color-stroke-border\`, \`--stroke-100\` |
| weak rule | \`--color-stroke-border-low\`, \`--stroke-100\` |
| clear inset | \`--space-025\` |
| horizontal geometry | \`--space-025 + --space-025 + --stroke-100\` |
| vertical geometry | \`--space-025 + --space-025 + --stroke-100\` |

The Figma specimen is a 118px preview line. The component intentionally fills
its parent instead, which preserves the same stroke and inset at any usable
layout length.

## Accessibility

- Divider exposes the semantic \`separator\` role, so assistive technology can
  announce a content boundary without introducing a focus stop.
- The \`aria-orientation\` attribute reflects the selected direction.
- Do not add a label unless the division itself has meaningful, non-obvious
  semantics; a heading is usually clearer.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use a divider to separate sibling content groups. | Use it as a substitute for section headings. |
| Let horizontal dividers fill their container. | Hardcode specimen widths from Figma into layouts. |
| Put vertical dividers in a parent with a resolved height. | Expect a vertical divider to create height by itself. |
| Choose weak sparingly for low-emphasis separation. | Use multiple rules to compensate for missing spacing. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    direction: 'horizontal',
    weight: 'primary',
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      table: { category: 'Appearance' },
    },
    weight: {
      control: 'inline-radio',
      options: ['primary', 'weak'],
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

const HorizontalFrame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 320 }}>{children}</div>
);

const VerticalFrame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', height: 118 }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  decorators: [
    (Story, context) =>
      context.args.direction === 'vertical' ? (
        <VerticalFrame>{Story()}</VerticalFrame>
      ) : (
        <HorizontalFrame>{Story()}</HorizontalFrame>
      ),
  ],
};

export const Directions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Horizontal dividers fill a content column; vertical dividers stretch within a parent ' +
          'whose height is defined by its surrounding layout.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
      <HorizontalFrame><Divider /></HorizontalFrame>
      <VerticalFrame><Divider direction="vertical" /></VerticalFrame>
    </div>
  ),
};

export const Weights: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Primary uses the standard border token; weak uses the lower-contrast border-low token.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
      <Divider weight="primary" />
      <Divider weight="weak" />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'QA matrix for both Figma directions and weights. Audit stroke contrast under both themes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 320 }}>
        <Divider />
        <Divider weight="weak" />
      </div>
      <VerticalFrame><Divider direction="vertical" /></VerticalFrame>
      <VerticalFrame><Divider direction="vertical" weight="weak" /></VerticalFrame>
    </div>
  ),
};

/** Pure interaction test (hidden from docs): semantic separator orientation is exposed. */
export const ExposesSeparatorSemantics: Story = {
  tags: ['!autodocs'],
  args: { direction: 'vertical' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  },
};
