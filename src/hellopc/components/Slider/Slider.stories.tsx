import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Slider, type SliderType } from './Slider';

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
);

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
);

const TYPES: SliderType[] = ['continuous', 'discrete'];

const meta = {
  title: 'Components/Slider/Single',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Slider selects one value along a bounded track (Figma \`&slider\`, node
125:6383). Use \`continuous\` for fine adjustments such as volume or image
filters; use \`discrete\` when the allowed positions should be visibly
countable. Use **Range Slider** when users must select a lower and upper bound,
and NumberInput alone when exact typed entry is the primary interaction.

Every color, radius, spacing, type, and elevation value resolves from hello pc
CSS custom properties that mirror Figma variables. The **Theme** toolbar
re-themes every example live; nothing is hardcoded.

Slider wraps Radix \`Slider\`, which owns pointer dragging, keyboard behavior,
controlled/uncontrolled state, hidden form inputs, and disabled semantics. The
optional exact-value field composes the existing **NumberInput** rather than
rebuilding input chrome. Hover, keyboard focus, and dragging expose the
current-value marker.

## Usage

\`\`\`tsx
<Slider />
<Slider defaultValue={25} />
<Slider type="discrete" step={10} tickCount={11} />
<Slider showValueInput={false} />
<Slider showEndpoints={false} aria-label="Volume" />
<Slider value={volume} onValueChange={setVolume} />
<Slider defaultValue={50} disabled />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| inactive track | \`--color-stroke-border\`; disabled \`--color-disabled-disabled\` |
| active track + thumb | \`--color-primary-primary\`; disabled \`--color-disabled-disabled-inverse\` |
| hover / focus / press state layer | \`--color-primary-primary-overlay-hover\`, \`--color-primary-primary-overlay-press\` |
| thumb elevation | \`--elevation-0\` |
| marker | \`--color-primary-primary\`, \`--color-text-icon-on-primary\`, \`--radius-1000\`, \`--space-050\`, \`--space-100\` |
| endpoint labels | \`--font-family\`, \`--type-size-body\`, \`--color-text-icon-primary\` |
| track / tick shape | \`--radius-50\`, \`--radius-1000\`, \`--space-025\` |
| row spacing | \`--space-100\` padding, \`--space-300\` gap |

## Accessibility

- Radix exposes the thumb as \`role="slider"\` with \`aria-valuemin\`,
  \`aria-valuemax\`, and \`aria-valuenow\`, and supports arrows, Page Up/Down,
  Home, and End.
- Keep a visible contextual label near the component. When context is not
  visible, pass \`aria-label\` to name the thumb.
- Keyboard focus uses the same high-visibility state layer as hover; focus is
  restyled, never removed.
- The synchronized NumberInput provides an exact-entry alternative without
  replacing slider keyboard behavior.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for relative adjustments where immediate visual feedback helps. | Use for a binary choice — use Switch. |
| Use discrete ticks only when values snap to meaningful steps. | Add decorative ticks that imply unavailable values. |
| Give the slider an accessible, contextual name. | Rely on endpoint numbers as the slider's name. |
| Keep the value input when precise entry matters. | Force dragging as the only way to enter an exact value. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    defaultValue: 50,
    type: 'continuous',
    min: 0,
    max: 100,
    step: 1,
    tickCount: 9,
    showEndpoints: true,
    showValueInput: true,
    inputSuffix: '%',
    disabled: false,
    'aria-label': 'Value',
    onValueChange: fn(),
    onValueCommit: fn(),
  },
  argTypes: {
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: 'number', table: { category: 'State' } },
    type: { control: 'inline-radio', options: TYPES, table: { category: 'Appearance' } },
    tickCount: { control: 'number', table: { category: 'Appearance' } },
    showEndpoints: { control: 'boolean', table: { category: 'Appearance' } },
    showValueInput: { control: 'boolean', table: { category: 'Appearance' } },
    inputSuffix: { control: 'text', table: { category: 'Content' } },
    formatValue: { control: false, table: { category: 'Content' } },
    'aria-label': { control: 'text', table: { category: 'Content' } },
    min: { control: 'number', table: { category: 'Behavior' } },
    max: { control: 'number', table: { category: 'Behavior' } },
    step: { control: 'number', table: { category: 'Behavior' } },
    width: { control: 'text', table: { category: 'Appearance' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    name: { control: 'text', table: { category: 'Behavior' } },
    className: { control: false, table: { category: 'Appearance' } },
    style: { control: false, table: { category: 'Appearance' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    onValueCommit: { action: 'valueCommit', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Slider>;

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
          'Continuous supports fine values; discrete adds nine evenly spaced visual ticks and should be paired with a meaningful `step`.',
      },
    },
  },
  render: () => (
    <Stack>
      <Slider type="continuous" defaultValue={50} />
      <Slider type="discrete" defaultValue={50} step={12.5} tickCount={9} />
    </Stack>
  ),
};

export const OptionalContent: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Endpoint labels and the synchronized NumberInput are independent optional content. Keep the input when precise entry matters.',
      },
    },
  },
  render: () => (
    <Stack>
      <Slider defaultValue={35} />
      <Slider defaultValue={35} showValueInput={false} />
      <Slider defaultValue={35} showEndpoints={false} showValueInput={false} aria-label="Volume" />
    </Stack>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled styling uses the disabled track/thumb tokens and disables both Radix dragging and the composed NumberInput.',
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
          'QA matrix for both types across enabled and disabled states. Audit hover, focus, drag markers, and all Theme toolbar modes.',
      },
    },
  },
  render: () => (
    <Stack>
      {[false, true].map((disabled) => (
        <Row key={String(disabled)}>
          {TYPES.map((type) => (
            <Slider
              key={type}
              type={type}
              defaultValue={50}
              step={type === 'discrete' ? 12.5 : 1}
              disabled={disabled}
            />
          ))}
        </Row>
      ))}
    </Stack>
  ),
};

/** Pure interaction test (hidden from docs): ArrowRight changes the Radix slider value. */
export const KeyboardChangesValue: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: 50, onValueChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider');
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onValueChange).toHaveBeenCalledWith(51);
  },
};
