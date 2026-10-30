import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Spinner } from './Spinner';

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 440, maxWidth: '100%' }}>{children}</div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
    {children}
  </div>
);

const meta = {
  title: 'Components/Progress Indicators/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Spinner communicates that work is in progress when no meaningful completion
amount is available. Use it inside a loading region, button, or initial page
state. Use Progress Bar instead when an operation can report a determinate
amount of completed work.

Every color, spacing, radius, and type value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

Spinner wraps Radix \`Progress\` with \`value={null}\`, so it announces
indeterminate \`progressbar\` semantics. Its Figma \`filled\` variants become
the visual \`fill\` arc; they do not communicate task completion. The arc
rotates by default using only \`transform\`, and respects reduced-motion
preferences by remaining static.

## Usage

\`\`\`tsx
<Spinner />
<Spinner aria-label="Loading search results" />
<Spinner size="sm" />
<Spinner size="md" color="greyscale" />
<Spinner fill="1/2" />
<Spinner animated={false} fill="3/4" />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| primary arc | \`--color-primary-primary\` |
| greyscale arc | \`--color-text-icon-primary\` |
| inactive ring | \`--color-stroke-border-low\` |
| circular shape | \`--radius-1000\` |

Figma node 90:4969 defines intrinsic 16px, 24px, and 32px diameters with
2px, 3px, and 4px ring widths, respectively.

## Accessibility

- Radix Progress supplies the \`progressbar\` role and indeterminate semantics
  because Spinner passes \`value={null}\`.
- Give every Spinner a specific \`aria-label\` when more than one loading
  region is present; the default name is \`Loading\`.
- Spinner has no focus stop because it is display-only.
- Motion uses GPU-only \`transform\` and stops when
  \`prefers-reduced-motion: reduce\` is active.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use Spinner while a result has no reliable completion amount. | Use it to communicate an exact upload percentage. |
| Give concurrent loading regions distinct accessible labels. | Leave several spinners named only \`Loading\` on the same view. |
| Use the greyscale treatment for secondary context. | Invent non-semantic spinner colors. |
| Use \`animated={false}\` for a static status illustration. | Animate in a way that ignores reduced-motion preferences. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    color: 'primary',
    fill: '3/4',
    size: 'lg',
    animated: true,
    'aria-label': 'Loading',
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['primary', 'greyscale'],
      table: { category: 'Appearance' },
    },
    fill: {
      control: 'inline-radio',
      options: ['all', '3/4', '2/3', '1/2', '1/3', '1/4', '1/8', 'none'],
      table: { category: 'Appearance' },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    animated: { control: 'boolean', table: { category: 'Behavior' } },
    'aria-label': { control: 'text', table: { category: 'Accessibility' } },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Colors: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The two Figma color treatments resolve through semantic hello pc tokens.',
      },
    },
  },
  render: () => (
    <Row>
      <Spinner color="primary" aria-label="Primary loading" />
      <Spinner color="greyscale" aria-label="Greyscale loading" />
    </Row>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Figma size variants are 16px (`sm`), 24px (`md`), and 32px (`lg`).',
      },
    },
  },
  render: () => (
    <Row>
      <Spinner size="sm" aria-label="Small loading" />
      <Spinner size="md" aria-label="Medium loading" />
      <Spinner size="lg" aria-label="Large loading" />
    </Row>
  ),
};

export const FillStates: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The Figma `filled` frame set maps to the static visual arc; the spinner remains semantically indeterminate in every case.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: 20, justifyContent: 'start' }}>
        {(['all', '3/4', '2/3', '1/2', '1/3', '1/4', '1/8', 'none'] as const).map((fill) => (
          <div key={fill} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <Spinner fill={fill} animated={false} aria-label={`${fill} filled loading`} />
            <span>{fill}</span>
          </div>
        ))}
      </div>
    </Frame>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'QA matrix for both color treatments and every Figma fill state. Audit under all Theme toolbar modes.',
      },
    },
  },
  render: () => (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {(['primary', 'greyscale'] as const).map((color) => (
          <Row key={color}>
            {(['all', '3/4', '2/3', '1/2', '1/3', '1/4', '1/8', 'none'] as const).map((fill) => (
              <Spinner
                key={fill}
                color={color}
                fill={fill}
                animated={false}
                aria-label={`${color} ${fill} spinner`}
              />
            ))}
          </Row>
        ))}
      </div>
    </Frame>
  ),
};

/** Pure interaction test (hidden from docs): exposes indeterminate Radix progress semantics. */
export const ExposesIndeterminateProgressSemantics: Story = {
  tags: ['!autodocs'],
  args: { 'aria-label': 'Loading application' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const spinner = canvas.getByRole('progressbar', { name: 'Loading application' });

    await expect(spinner).not.toHaveAttribute('aria-valuenow');
    await expect(spinner).toHaveAttribute('data-state', 'indeterminate');
  },
};
