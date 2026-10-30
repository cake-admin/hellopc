import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CheckCircle2, Info, LayoutGrid } from 'lucide-react';

import { Chip, type ChipType } from './Chip';

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
);

const TYPES: ChipType[] = ['primary', 'secondary', 'success', 'warn', 'error', 'info'];

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Chip represents a compact, discrete piece of information — a filter, a
selection, or a removable input token. Choose a \`type\` to reflect the chip's
meaning, add a leading icon for recognition, and provide \`onRemove\` to make
the chip dismissable. Use Badge for non-interactive status text and Button for
primary actions.

Every color, spacing, radius, and type value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

The chip renders a token-styled pill. Its optional clickable body becomes a
real \`<button>\` when \`onClick\` is supplied, and its optional remove control
is an icon-only \`<button>\` built on Radix \`AccessibleIcon\`, so screen
readers always announce a name for the dismiss action. Hover, focus, and
disabled map to CSS \`:hover\`, \`:focus-within\`, and the \`disabled\` prop
rather than discrete variants.

## Usage

\`\`\`tsx
<Chip>Label</Chip>
<Chip type="success" leadingIcon={<CheckCircle2 />}>Verified</Chip>
<Chip onRemove={() => remove(id)}>Removable</Chip>
<Chip onClick={() => toggle()}>Selectable</Chip>
<Chip size="sm" type="info">Compact</Chip>
<Chip disabled onRemove={fn()}>Disabled</Chip>
\`\`\`

## Design tokens used

| Part · type | Tokens |
| --- | --- |
| primary background | \`--color-primary-primary-overlay\` / \`--color-primary-primary-overlay-hover\` |
| secondary background | \`--color-secondary-secondary-overlay\` / \`--color-secondary-secondary-overlay-hover\` |
| success background | \`--color-success-success-overlay\` / \`--color-success-success-overlay-hover\` |
| warn background | \`--color-warning-warn-overlay\` / \`--color-warning-warn-overlay-hover\` |
| error background | \`--color-error-error-overlay\` / \`--color-error-error-overlay-hover\` |
| info background | \`--color-info-info-overlay\` / \`--color-info-info-overlay-hover\` |
| label | \`--color-text-icon-primary\`, \`--font-weight-bold\`, \`--type-size-body\` (lg) / \`--type-size-caption\` (sm) |
| remove hover | \`--color-secondary-secondary-overlay\` |
| shape · padding · gap | \`--radius-1000\`, \`--space-100\` (8px padding), \`--space-050\` (4px gap) |
| focus ring | \`--stroke-300\`, \`--color-primary-primary\` |
| disabled | \`--color-disabled-disabled\`, \`--color-disabled-disabled-inverse\` |

Figma intrinsic heights are 32px (\`lg\`) and 24px (\`sm\`).

## Accessibility

- The remove control is a real \`<button>\` whose icon-only glyph is named
  through Radix \`AccessibleIcon\`; customize it with \`removeLabel\`.
- A clickable body (\`onClick\`) renders as a \`<button>\`; a display-only chip
  renders no interactive element.
- The focus ring wraps the whole chip when any inner control receives keyboard
  focus.
- \`disabled\` sets \`aria-disabled\` and disables the body and remove buttons.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use chips for filters, selections, and removable tokens. | Use a chip for a primary page action — use Button. |
| Provide \`onRemove\` for dismissable input chips. | Nest a chip's remove action inside another clickable region. |
| Pair a \`type\` with a meaningful leading icon. | Rely on color alone to convey the chip's meaning. |
| Keep chip labels short and scannable. | Put long, wrapping sentences inside a chip. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Label',
    type: 'primary',
    size: 'lg',
    disabled: false,
    onRemove: fn(),
  },
  argTypes: {
    children: { control: 'text', table: { category: 'Content' } },
    leadingIcon: { control: false, table: { category: 'Content' } },
    removeLabel: { control: 'text', table: { category: 'Content' } },
    type: {
      control: 'inline-radio',
      options: TYPES,
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['lg', 'sm'],
      table: { category: 'Appearance' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onClick: { action: 'click', table: { category: 'Events' } },
    onRemove: { action: 'remove', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Types: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Each Figma `type` maps to its semantic overlay token. Use the type that matches the meaning of the information the chip represents.',
      },
    },
  },
  render: () => (
    <Row>
      {TYPES.map((type) => (
        <Chip key={type} type={type} onRemove={fn()}>
          {type}
        </Chip>
      ))}
    </Row>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Figma sizes are 32px `lg` (14px label) and 24px `sm` (12px label).',
      },
    },
  },
  render: () => (
    <Row>
      <Chip size="lg" onRemove={fn()}>
        Large
      </Chip>
      <Chip size="sm" onRemove={fn()}>
        Small
      </Chip>
    </Row>
  ),
};

export const Content: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Chips can carry a leading icon, a removable trailing button, a clickable body, or plain display-only text.',
      },
    },
  },
  render: () => (
    <Row>
      <Chip type="success" leadingIcon={<CheckCircle2 />} onRemove={fn()}>
        Verified
      </Chip>
      <Chip type="info" leadingIcon={<Info />}>
        Display only
      </Chip>
      <Chip leadingIcon={<LayoutGrid />} onClick={fn()}>
        Selectable
      </Chip>
      <Chip onRemove={fn()}>Removable</Chip>
    </Row>
  ),
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Disabled chips flatten to the neutral disabled tokens and stop responding to hover, click, and remove.',
      },
    },
  },
  render: () => (
    <Row>
      <Chip onRemove={fn()}>Enabled</Chip>
      <Chip disabled onRemove={fn()}>
        Disabled
      </Chip>
    </Row>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix for every type across both sizes and the disabled state. Audit label and background contrast under all Theme toolbar modes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {TYPES.map((type) => (
        <Row key={type}>
          <Chip type={type} size="lg" leadingIcon={<LayoutGrid />} onRemove={fn()}>
            {`${type} lg`}
          </Chip>
          <Chip type={type} size="sm" leadingIcon={<LayoutGrid />} onRemove={fn()}>
            {`${type} sm`}
          </Chip>
          <Chip type={type} disabled onRemove={fn()}>
            {`${type} off`}
          </Chip>
        </Row>
      ))}
    </div>
  ),
};

/** Pure interaction test (hidden from docs): the remove button fires its handler. */
export const RemovesFire: Story = {
  tags: ['!autodocs'],
  args: { children: 'Filter', onRemove: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Filter' }));
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};

/** Pure interaction test (hidden from docs): a disabled chip blocks removal. */
export const DisabledBlocksRemove: Story = {
  tags: ['!autodocs'],
  args: { children: 'Filter', disabled: true, onRemove: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Filter' }));
    await expect(args.onRemove).not.toHaveBeenCalled();
  },
};
