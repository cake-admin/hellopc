import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';

import { Rating } from './Rating';

const SATISFACTION = [
  'Completely dissatisfied',
  'Dissatisfied',
  'Indifferent',
  'Generally satisfied',
  'Completely satisfied',
];

const meta = {
  title: 'Components/Rating/Rating',
  component: Rating,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A horizontal scale of numbered options — 1 to \`count\` — for satisfaction and
Likert-style questions where the answer is one point on a scale. Each option can
carry a caption ("Dissatisfied" … "Completely satisfied"), and an optional
leading **N/A** lets people skip a question that doesn't apply. For a choice
between named alternatives use \`RadioGroup\`; for picking a number from a
range use \`Slider\` or \`NumberInput\`.

Every color, radius, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. The option colors are the \`--color-control-*\` tokens, which map to
Windows system colors in win hct.

Built on Radix \`RadioGroup\`, so it behaves as a form control: works controlled
(\`value\` + \`onValueChange\`) or uncontrolled (\`defaultValue\`), submits under
\`name\`, honors \`required\`. Values are \`"1"\`…\`"count"\` and \`"na"\`. Pass
\`options\` instead of \`count\` / \`captions\` for custom values, labels, or
per-option \`disabled\`.

## Usage

\`\`\`tsx
<Rating aria-label="How satisfied are you?" />
<Rating aria-label="Satisfaction" captions={['Dissatisfied', 'Indifferent', 'Satisfied']} count={3} />
<Rating aria-labelledby="q1" showNa captions={captions} />
<Rating aria-label="Would you recommend us?" value={answer} onValueChange={setAnswer} />
<Rating aria-label="Effort" count={10} showCaptions={false} />
<Rating aria-label="Locked answer" defaultValue="4" disabled />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Tile · default / hover / press | \`--color-control-fill\` / \`-fill-hover\` / \`-fill-press\`; ring \`--stroke-100\` \`--color-control-border\` (hover \`--stroke-200\` \`--color-control-border-hover\`) |
| Tile · selected | \`--color-control-selected-fill\` (hover \`-selected-fill-hover\`, press \`-selected-fill-press\`), value \`--color-control-on-selected\` |
| Tile · disabled | \`--color-control-disabled-fill\`, \`--stroke-100\` \`--color-control-disabled-border\`, value \`--color-text-icon-disabled\`; selected + disabled: \`--stroke-200\` \`--color-text-icon-disabled\` ring |
| Value | \`--type-size-subject\` (16px), \`--font-weight-bold\`, \`--color-control-on-fill\` |
| Caption | \`--type-size-caption\` (12px), \`--font-weight-regular\`, \`--color-text-icon-secondary\` (disabled \`--color-text-icon-disabled\`) |
| Shape | 48×40 tile, \`--radius-200\`, padding \`--space-100\`; option 86px wide, tile ↔ caption \`--space-100\` |
| Spacing | numbered options \`--space-600\` (32px) apart; N/A ↔ divider ↔ scale \`--space-300\` (16px) |
| N/A divider | **Divider** vertical, \`--color-stroke-border\`, 64px (\`--space-900\`) tall |
| Focus ring | \`--stroke-300\` \`--color-control-focus-ring\`, hugging the tile |

## Accessibility

- Radix provides \`role="radiogroup"\` / \`role="radio"\`, roving focus, and arrow
  keys that move **and** select — Tab enters and leaves the scale as one stop.
- Name the question: pass \`aria-label\` or \`aria-labelledby\` pointing at the
  visible question text. Without it the group is announced with no context.
- Each option's name is its value plus caption ("4 Generally satisfied"), so
  screen-reader users hear the meaning, not just the number.
- Selection isn't color-only: the selected tile changes fill **and** text
  color, and a disabled selection keeps a 2px ring.
- Focus is restyled (3px ring), never removed. Tiles are 48×40, above the 24px
  minimum target size.

## Do / Don't

| Do | Don't |
| --- | --- |
| Caption every point, or at least both ends, so the scale has meaning | Leave people guessing whether 1 is best or worst |
| Offer \`showNa\` when a question may not apply | Force an answer that skews results |
| Keep one direction: low → high, left → right | Mix scale directions between questions |
| Use 5 or 7 points for satisfaction, 10 for effort/likelihood | Use a Rating for named choices — that's \`RadioGroup\` |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { 'aria-label': 'How satisfied are you?', captions: SATISFACTION, onValueChange: fn() },
  argTypes: {
    captions: { control: 'object', table: { category: 'Content' } },
    naLabel: { control: 'text', table: { category: 'Content' } },
    naCaption: { control: 'text', table: { category: 'Content' } },
    options: { control: false, table: { category: 'Content' } },
    count: {
      control: 'inline-radio',
      options: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      table: { category: 'Appearance' },
    },
    showCaptions: { control: 'boolean', table: { category: 'Appearance' } },
    showNa: { control: 'boolean', table: { category: 'Appearance' } },
    value: { control: 'text', table: { category: 'State' } },
    defaultValue: { control: 'text', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    required: { control: 'boolean', table: { category: 'Behavior' } },
    name: { control: 'text', table: { category: 'Behavior' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** N/A + 1–5 with a selection (Figma sticker): N/A sits before a divider and reports `"na"`. */
export const WithNa: Story = { args: { showNa: true, defaultValue: '4' } };

/** Scale length: `count` 2–10 (Figma `count`). Three points here, captioned No / Maybe / Yes. */
export const Counts: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Rating aria-label="Three-point" count={3} captions={['No', 'Maybe', 'Yes']} />
      <Rating aria-label="Ten-point" count={10} showCaptions={false} />
    </div>
  ),
};

/** Controlled: the consumer owns the answer — here echoed below the scale. */
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [value, setValue] = useState('3');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Rating {...args} value={value} onValueChange={setValue} />
        <span style={{ fontFamily: 'var(--font-family)', color: 'var(--color-text-icon-secondary)' }}>
          Answer: {value}
        </span>
      </div>
    );
  },
};

/** Disabled: the whole scale is locked; a selected answer keeps a 2px ring. Per-option `disabled` via `options`. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Rating aria-label="Locked answer" captions={SATISFACTION} defaultValue="4" disabled />
      <Rating
        aria-label="Partly available"
        options={[
          { value: 'no', label: '1', caption: 'No' },
          { value: 'maybe', label: '2', caption: 'Maybe', disabled: true },
          { value: 'yes', label: '3', caption: 'Yes' },
        ]}
      />
    </div>
  ),
};

/** QA matrix — N/A + 5 with a selection, 3-point, disabled. Audit under every theme via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <Rating aria-label="N/A to five" showNa captions={SATISFACTION} defaultValue="4" />
      <Rating aria-label="One to five" captions={SATISFACTION} />
      <Rating aria-label="One to three" count={3} captions={['No', 'Maybe', 'Yes']} defaultValue="1" />
      <Rating aria-label="Disabled" captions={SATISFACTION} defaultValue="2" disabled />
    </div>
  ),
};

/** Clicking selects and fires onValueChange; arrow keys move and select. */
export const SelectsFire: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const three = canvas.getByRole('radio', { name: /3\s*Indifferent/ });
    await userEvent.click(three);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('3');
    await expect(three).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowRight}');
    // Radix roving focus moves focus (and so selection) in a timeout.
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith('4'), { timeout: 3000 });
  },
};
