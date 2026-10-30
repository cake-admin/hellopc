import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { ProgressBar } from './ProgressBar';

/** Storybook documentation chrome — intentionally narrower than the Figma specimen. */
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 700, maxWidth: '100%' }}>{children}</div>
);

const meta = {
  title: 'Components/Progress Indicators/Progress Bar',
  component: ProgressBar,
  decorators: [
    (Story, context) =>
      context.viewMode === 'docs' ? (
        <Frame><Story /></Frame>
      ) : (
        <Story />
      ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Progress Bar communicates a determinate amount of completed work. Select a
semantic color to reflect the operation’s meaning and use the thin or thick
Figma track treatment to suit available emphasis. Use an indeterminate loading
indicator when the amount of work cannot be known.

Every color, spacing, radius, and type value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

The bar wraps Radix \`Progress\`, which exposes determinate progress semantics.
It composes HelperString for its optional feedback row, while the label/value
row is local because InputLabel has no matching right-aligned value slot.
Pass numeric \`value\` and \`max\`; the rendered fill clamps invalid values
while Radix communicates the resulting range to assistive technology.

## Usage

\`\`\`tsx
<ProgressBar value={30} />
<ProgressBar color="success" value={75} label="Upload" labelValue="75MB" />
<ProgressBar color="error" value={20} helperText="Upload failed" />
<ProgressBar width="thin" value={50} />
<ProgressBar value={12} max={24} showLabelIcon={false} />
<ProgressBar label={null} aria-label="Installation progress" showHelper={false} value={90} />
\`\`\`

## Design tokens used

| Part · variant | Tokens |
| --- | --- |
| track | \`--color-stroke-border\`, \`--radius-1000\` |
| info indicator | \`--color-info-info\` |
| primary indicator | \`--color-primary-primary\` |
| secondary indicator | \`--color-secondary-secondary\` |
| success indicator | \`--color-success-success\` |
| warn indicator | \`--color-warning-warn\` |
| error indicator | \`--color-error-error\` |
| layout gap | \`--space-050\`, \`--space-100\` |
| label and value | \`--color-text-icon-primary\`, \`--font-weight-medium\`, \`--type-size-subject\` |
| helper and percentage | HelperString tokens plus \`--color-text-icon-secondary\` |

Figma intrinsic track geometry is 12px for \`thin\` and 18px for \`thick\`.

## Accessibility

- Radix Progress supplies the \`progressbar\` role and the value/min/max
  semantics from \`value\` and \`max\`.
- A visible label automatically names the progressbar through
  \`aria-labelledby\`. When \`label={null}\`, provide \`aria-label\`.
- The component is display-only and deliberately has no focus stop or
  interactive keyboard behavior.

## Do / Don't

| Do | Don't |
| --- | --- |
| Provide a numeric value and meaningful label for important work. | Use a determinate progress bar when progress is unknown. |
| Use semantic colors to reflect state or operation type. | Use color as the only explanation of an error. |
| Use \`max\` for non-percentage units such as bytes or steps. | Convert data to a hardcoded CSS fill width. |
| Keep helper text concise and actionable. | Add controls inside the progress bar. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    value: 30,
    max: 100,
    color: 'info',
    width: 'thick',
    label: 'Label',
    labelValue: '40MB',
    helperText: 'Example helper string',
    showHelper: true,
    showLabelIcon: true,
    showHelperIcon: true,
    showValue: true,
    helperTone: 'greyscale',
  },
  argTypes: {
    value: { control: { type: 'number', min: 0 }, table: { category: 'Behavior' } },
    max: { control: { type: 'number', min: 1 }, table: { category: 'Behavior' } },
    color: {
      control: 'inline-radio',
      options: ['info', 'primary', 'secondary', 'success', 'warn', 'error'],
      table: { category: 'Appearance' },
    },
    width: {
      control: 'inline-radio',
      options: ['thin', 'thick'],
      table: { category: 'Appearance' },
    },
    label: { control: 'text', table: { category: 'Content' } },
    labelValue: { control: 'text', table: { category: 'Content' } },
    helperText: { control: 'text', table: { category: 'Content' } },
    showLabelIcon: { control: 'boolean', table: { category: 'Content' } },
    showHelper: { control: 'boolean', table: { category: 'Content' } },
    showHelperIcon: { control: 'boolean', table: { category: 'Content' } },
    showValue: { control: 'boolean', table: { category: 'Content' } },
    helperTone: {
      control: 'inline-radio',
      options: ['greyscale', 'info', 'success', 'warning', 'error', 'disabled'],
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Colors: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'All six Figma semantic indicator colors use their corresponding hello pc token while the track remains neutral.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {(['info', 'primary', 'secondary', 'success', 'warn', 'error'] as const).map((color) => (
          <ProgressBar key={color} color={color} label={color} labelValue="40MB" value={30} />
        ))}
      </div>
    </Frame>
  ),
};

export const Widths: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Figma thick is an 18px track; thin is 12px. Both preserve the same semantic value and color behavior.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ProgressBar width="thick" label="Thick" labelValue="30%" value={30} />
        <ProgressBar width="thin" label="Thin" labelValue="30%" value={30} />
      </div>
    </Frame>
  ),
};

export const Content: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The label value, informational glyph, reusable HelperString, and percentage can each be configured without changing progress semantics.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ProgressBar label="Upload" labelValue="40MB" helperText="Sending media files" value={30} />
        <ProgressBar label="Background task" showLabelIcon={false} showHelperIcon={false} showValue={false} value={60} />
        <ProgressBar label={null} aria-label="Install progress" showHelper={false} value={90} color="success" />
      </div>
    </Frame>
  ),
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Semantic colors communicate outcome or operation type; pair error/warning colors with explanatory HelperString content.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ProgressBar color="success" label="Complete" labelValue="100%" helperText="Upload complete" helperTone="success" value={100} />
        <ProgressBar color="warn" label="Storage warning" labelValue="85%" helperText="Storage is nearly full" helperTone="warning" value={85} />
        <ProgressBar color="error" label="Upload failed" labelValue="30%" helperText="Retry to continue" helperTone="error" value={30} />
      </div>
    </Frame>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'QA matrix for every Figma color × thickness pair. Audit the indicator and label contrast under both themes.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(['info', 'primary', 'secondary', 'success', 'warn', 'error'] as const).flatMap((color) => [
          <ProgressBar key={`${color}-thick`} color={color} width="thick" label={`${color} · thick`} labelValue="30%" value={30} />,
          <ProgressBar key={`${color}-thin`} color={color} width="thin" label={`${color} · thin`} labelValue="30%" value={30} />,
        ])}
      </div>
    </Frame>
  ),
};

/** Pure interaction test (hidden from docs): Radix exposes determinate values and the visible label. */
export const ExposesProgressSemantics: Story = {
  tags: ['!autodocs'],
  args: { value: 12, max: 24, label: 'Installation', labelValue: '12 of 24' },
  decorators: [(Story) => <Frame>{Story()}</Frame>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const progressbar = canvas.getByRole('progressbar', { name: 'Installation' });

    await expect(progressbar).toHaveAttribute('aria-valuenow', '12');
    await expect(progressbar).toHaveAttribute('aria-valuemax', '24');
  },
};
