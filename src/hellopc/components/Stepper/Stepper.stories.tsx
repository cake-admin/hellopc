import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Stepper, type StepperStep } from './Stepper';

const SAMPLE_STEPS: StepperStep[] = [
  { title: 'Stepper title', description: 'Description' },
  { title: 'Stepper title', description: 'Description' },
  { title: 'Stepper title', description: 'Description' },
  { title: 'Stepper title', description: 'Description' },
];

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
    {children}
  </div>
);

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A progress trail for multi-step flows — wizards, onboarding, checkout. Use
\`orientation="vertical"\` (Figma \`&vertical.stepper\`) when space allows a
stacked list, or \`orientation="horizontal"\` (\`&horizontal.stepper\`) for a
compact toolbar-width trail. For a single determinate percentage of work, use
ProgressBar instead; for mutually exclusive view switching, use ContentSwitcher.

Every color, spacing, radius, and type value resolves from hello pc CSS custom
properties that mirror Figma variables (\`color/success/success\` ⇄
\`--color-success-success\`). The **Theme** toolbar toggle re-themes every
example on this page live via \`[data-theme]\`; nothing is hardcoded.

Renders a \`<nav>\` landmark wrapping an ordered list. Stages derive from
\`activeIndex\` (complete → current → incomplete). Connectors after completed
steps use the success stroke; connectors after the current step and beyond use
the border stroke. Markers match Radio glyph geometry but are **not** the Radio
form control. Pass \`onStepClick\` only when steps should be activatable;
without it the stepper is display-only (no focus stops).

## Usage

\`\`\`tsx
<Stepper steps={steps} activeIndex={2} />
<Stepper steps={steps} activeIndex={1} orientation="horizontal" />
<Stepper steps={steps} activeIndex={0} showDescription={false} />
<Stepper steps={steps} activeIndex={2} onStepClick={setStep} />
<Stepper steps={[{ title: 'Account' }, { title: 'Plan' }]} activeIndex={0} />
<Stepper steps={steps} activeIndex={2} aria-label="Checkout progress" />
\`\`\`

## Design tokens used

| Part · stage | Tokens |
| --- | --- |
| Complete marker | \`--color-success-success\` disc, \`--color-text-icon-inverse\` check, \`--radius-1000\` |
| Current marker | \`--stroke-200\` \`--color-primary-primary\` ring, 8px \`--color-primary-primary\` dot |
| Incomplete marker | \`--stroke-200\` \`--color-text-icon-secondary\` ring |
| Complete / incomplete title | \`--type-size-body\`, \`--font-weight-regular\`, \`--color-text-icon-primary\` |
| Current title | \`--type-size-body\`, \`--font-weight-medium\`, \`--color-text-icon-secondary\` |
| Description | \`--type-size-caption\`, \`--color-text-icon-secondary\` |
| Connector complete | \`--stroke-100\` \`--color-success-success\`, 40px length |
| Connector incomplete | \`--stroke-100\` \`--color-stroke-border\`, 40px length |
| Layout | \`--space-050\` icon↔text, \`--space-100\` horizontal gap, \`--space-200\` connector pad |

Figma intrinsic geometry (nodes 5326:2949 / 5326:2970): 24px marker slot, 16px
glyph, 40px connector.

## Accessibility

- The root is a \`<nav>\` landmark; default \`aria-label\` is \`"Progress"\` —
  override it when the page has more than one stepper.
- Steps render in an ordered list; the current step gets \`aria-current="step"\`.
- Without \`onStepClick\` the stepper is display-only — no tab stops, no
  interactive roles on markers.
- With \`onStepClick\`, non-current steps render as buttons with a restyled
  \`:focus-visible\` ring (\`--stroke-200\` \`--color-primary-primary\`).
- Markers are \`aria-hidden\`; the title text is the accessible name.

## Do / Don't

| Do | Don't |
| --- | --- |
| Drive stage from a single \`activeIndex\`. | Hand-paint per-step colors outside the token map. |
| Give the landmark a specific \`aria-label\` when multiple steppers share a page. | Nest Radio / Checkbox inside steps for the markers. |
| Use \`onStepClick\` only when navigating back/forward is allowed. | Use Stepper for mutually exclusive view tabs — use ContentSwitcher. |
| Keep titles short; put detail in \`description\`. | Put actions or form fields inside a step row. |
| Prefer vertical when descriptions wrap. | Force a long horizontal trail that overflows without a plan. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    steps: SAMPLE_STEPS,
    activeIndex: 2,
    orientation: 'vertical',
    showDescription: true,
    onStepClick: fn(),
    'aria-label': 'Progress',
  },
  argTypes: {
    steps: { control: false, table: { category: 'Content' } },
    activeIndex: { control: { type: 'number', min: 0, max: 3 }, table: { category: 'State' } },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      table: { category: 'Appearance' },
    },
    showDescription: { control: 'boolean', table: { category: 'Appearance' } },
    'aria-label': { control: 'text', table: { category: 'Content' } },
    onStepClick: { action: 'stepClick', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Orientations: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma ships two compositions: `&vertical.stepper` (stacked, connectors ' +
          'pad with `--space-200` under the 24px marker) and `&horizontal.stepper` ' +
          '(row with `--space-100` gaps). Same stages and tokens either way.',
      },
    },
  },
  render: () => (
    <Row>
      <Stepper steps={SAMPLE_STEPS} activeIndex={2} orientation="vertical" />
      <Stepper steps={SAMPLE_STEPS} activeIndex={2} orientation="horizontal" />
    </Row>
  ),
};

export const Stages: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Three marker stages (Figma `&stepper.item`): `complete` (success disc + ' +
          'check), `current` (primary ring + dot, medium title), `incomplete` ' +
          '(secondary ring). Driven here by `activeIndex={1}` on a three-step trail.',
      },
    },
  },
  render: () => (
    <Stepper
      steps={[
        { title: 'Complete', description: 'Description' },
        { title: 'Current', description: 'Description' },
        { title: 'Incomplete', description: 'Description' },
      ]}
      activeIndex={1}
    />
  ),
};

export const WithoutDescription: Story = {
  args: { showDescription: false, activeIndex: 1 },
  parameters: {
    docs: {
      description: {
        story:
          'Figma `showDescription=false` — titles only. Useful in tight horizontal ' +
          'layouts where the description would crowd the connector.',
      },
    },
  },
};

export const DisplayOnly: Story = {
  args: { onStepClick: undefined, activeIndex: 2 },
  parameters: {
    docs: {
      description: {
        story:
          'Omit `onStepClick` for a read-only progress trail — no buttons, no tab ' +
          'stops. The current step still announces via `aria-current="step"`.',
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
          'QA matrix: both orientations × mid-flow active index, plus a titles-only ' +
          'row. Audit under both Theme toolbar modes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Row>
        <Stepper steps={SAMPLE_STEPS} activeIndex={2} orientation="vertical" />
        <Stepper steps={SAMPLE_STEPS} activeIndex={2} orientation="horizontal" />
      </Row>
      <Row>
        <Stepper
          steps={SAMPLE_STEPS}
          activeIndex={0}
          orientation="vertical"
          showDescription={false}
        />
        <Stepper
          steps={SAMPLE_STEPS}
          activeIndex={3}
          orientation="horizontal"
          showDescription={false}
        />
      </Row>
    </div>
  ),
};

/** Pure interaction test (hidden from the docs page): clicking a step fires onStepClick. */
export const StepClicksFire: Story = {
  tags: ['!autodocs'],
  args: {
    steps: [
      { title: 'One', description: 'A' },
      { title: 'Two', description: 'B' },
      { title: 'Three', description: 'C' },
    ],
    activeIndex: 1,
    onStepClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    await expect(buttons).toHaveLength(2);
    await userEvent.click(buttons[0]);
    await expect(args.onStepClick).toHaveBeenCalledWith(0);
  },
};
