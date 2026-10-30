import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { RangeSlider, type SliderType } from './Slider';

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
);

const TYPES: SliderType[] = ['continuous', 'discrete'];

const meta = {
  title: 'Components/Slider/Range',
  component: RangeSlider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Range Slider selects a lower and upper bound along one track (Figma
\`&slider.double\`, node 125:7821). Use it for price, date, score, or filter
ranges. Use the single **Slider** when only one value changes, and use two
NumberInputs when the relationship between values does not benefit from a
shared visual scale.

Every color, radius, spacing, type, and elevation value resolves from hello pc
CSS custom properties that mirror Figma variables. The **Theme** toolbar
re-themes every example live; nothing is hardcoded.

Range Slider wraps Radix \`Slider\` with two thumbs. Radix owns pointer and
keyboard interaction, thumb ordering, the minimum gap, controlled/uncontrolled
state, form inputs, and disabled semantics. The exact-value fields compose the
existing **NumberInput** on both sides and stay synchronized with the thumbs.
Hover, keyboard focus, and dragging expose each thumb's current-value marker.

## Usage

\`\`\`tsx
<RangeSlider />
<RangeSlider defaultValue={[20, 80]} />
<RangeSlider type="discrete" step={10} tickCount={11} />
<RangeSlider minStepsBetweenThumbs={2} step={5} />
<RangeSlider showValueInput={false} />
<RangeSlider value={range} onValueChange={setRange} />
<RangeSlider defaultValue={[10, 50]} disabled />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| inactive track | \`--color-stroke-border\`; disabled \`--color-disabled-disabled\` |
| selected range + thumbs | \`--color-primary-primary\`; disabled \`--color-disabled-disabled-inverse\` |
| hover / focus / press state layer | \`--color-primary-primary-overlay-hover\`, \`--color-primary-primary-overlay-press\` |
| thumb elevation | \`--elevation-0\` |
| markers | \`--color-primary-primary\`, \`--color-text-icon-on-primary\`, \`--radius-1000\`, \`--space-050\`, \`--space-100\` |
| endpoint labels | \`--font-family\`, \`--type-size-body\`, \`--color-text-icon-primary\` |
| track / tick shape | \`--radius-50\`, \`--radius-1000\`, \`--space-025\` |
| row spacing | \`--space-100\` padding, \`--space-300\` gap |

## Accessibility

- Radix exposes two \`role="slider"\` thumbs with their own current/min/max
  values and supports arrows, Page Up/Down, Home, and End.
- Supply distinct \`aria-label\` values for the lower and upper thumbs; the
  defaults are “Minimum value” and “Maximum value”.
- \`minStepsBetweenThumbs\` prevents an invalid or unusably narrow range at
  both pointer and keyboard level.
- Both synchronized NumberInputs provide exact-entry alternatives and inherit
  the same disabled state as the slider.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for two bounds on the same scale. | Use for two unrelated values. |
| Give each thumb a distinct accessible name. | Label both thumbs “Value”. |
| Set \`minStepsBetweenThumbs\` when zero-width ranges are invalid. | Correct invalid ranges only after form submission. |
| Keep exact-value inputs for precise filters. | Force users to drag to an exact price or score. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    defaultValue: [10, 50],
    type: 'continuous',
    min: 0,
    max: 100,
    step: 1,
    tickCount: 9,
    minStepsBetweenThumbs: 0,
    showEndpoints: true,
    showValueInput: true,
    inputSuffix: '%',
    disabled: false,
    'aria-label': ['Minimum value', 'Maximum value'],
    onValueChange: fn(),
    onValueCommit: fn(),
  },
  argTypes: {
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: false, table: { category: 'State' } },
    type: { control: 'inline-radio', options: TYPES, table: { category: 'Appearance' } },
    tickCount: { control: 'number', table: { category: 'Appearance' } },
    showEndpoints: { control: 'boolean', table: { category: 'Appearance' } },
    showValueInput: { control: 'boolean', table: { category: 'Appearance' } },
    inputSuffix: { control: 'text', table: { category: 'Content' } },
    formatValue: { control: false, table: { category: 'Content' } },
    'aria-label': { control: false, table: { category: 'Content' } },
    min: { control: 'number', table: { category: 'Behavior' } },
    max: { control: 'number', table: { category: 'Behavior' } },
    step: { control: 'number', table: { category: 'Behavior' } },
    minStepsBetweenThumbs: { control: 'number', table: { category: 'Behavior' } },
    width: { control: 'text', table: { category: 'Appearance' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    name: { control: 'text', table: { category: 'Behavior' } },
    className: { control: false, table: { category: 'Appearance' } },
    style: { control: false, table: { category: 'Appearance' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    onValueCommit: { action: 'valueCommit', table: { category: 'Events' } },
  },
} satisfies Meta<typeof RangeSlider>;

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
          'Continuous supports fine lower/upper bounds; discrete adds visible positions and should use a matching `step`.',
      },
    },
  },
  render: () => (
    <Stack>
      <RangeSlider type="continuous" defaultValue={[10, 50]} />
      <RangeSlider type="discrete" defaultValue={[12.5, 50]} step={12.5} tickCount={9} />
    </Stack>
  ),
};

export const MinimumGap: Story = {
  args: { defaultValue: [30, 60], step: 10, minStepsBetweenThumbs: 2 },
  parameters: {
    docs: {
      description: {
        story:
          '`minStepsBetweenThumbs={2}` with a step of 10 keeps at least 20 units between the lower and upper values.',
      },
    },
  },
};

export const WithoutInputs: Story = {
  args: { showValueInput: false },
  parameters: {
    docs: {
      description: {
        story:
          'Hide exact-value inputs for compact layouts only when precise typed entry is not required.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled styling applies to both Radix thumbs, the selected range, and both composed NumberInputs.',
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
          'QA matrix for both range types across enabled and disabled states. Audit both thumb markers and all Theme toolbar modes.',
      },
    },
  },
  render: () => (
    <Stack>
      {[false, true].map((disabled) =>
        TYPES.map((type) => (
          <RangeSlider
            key={`${type}-${disabled}`}
            type={type}
            defaultValue={[12.5, 50]}
            step={type === 'discrete' ? 12.5 : 1}
            disabled={disabled}
          />
        )),
      )}
    </Stack>
  ),
};

/** Pure interaction test (hidden from docs): keyboard input moves the lower thumb. */
export const KeyboardChangesLowerValue: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: [10, 50], onValueChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const [lowerThumb] = canvas.getAllByRole('slider');
    lowerThumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onValueChange).toHaveBeenCalledWith([11, 50]);
  },
};
