import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { AiFeedback } from './AiFeedback';

const meta = {
  title: 'Components/AI/Feedback',
  component: AiFeedback,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The row under an AI response for rating it and acting on it: like, dislike,
copy, regenerate. Use it under assistant replies (usually through
\`AiMessageResponse\`'s \`feedback\` prop). To show a recorded thumbs result
read-only, use \`Thumbs Rating\`.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

Like and dislike are a Radix single \`ToggleGroup\`: picking one clears the
other, and pressing the chosen one again clears it. A chosen thumb gets the
tonal secondary fill and a filled glyph. Copy and regenerate are plain
\`IconButton\`s; Copy announces "Copied". Works controlled (\`value\` +
\`onValueChange\`) or uncontrolled (\`defaultValue\`). If a dislike should open a
short feedback form, open it from \`onValueChange\`.

## Usage

\`\`\`tsx
<AiFeedback onValueChange={rate} onCopy={copy} onRegenerate={retry} />
<AiFeedback value={rating} onValueChange={setRating} />
<AiFeedback defaultValue="liked" showRegenerate={false} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Buttons | 24px, \`--radius-1000\`, 16px glyphs, \`--space-025\` apart |
| Default | glyph \`--color-secondary-secondary\`; hover \`--color-secondary-secondary-overlay\`, press \`-overlay-hover\` |
| Liked / disliked | \`--color-tonal-tonal-secondary-overlay\`, glyph \`--color-text-icon-on-tonal-secondary\` (filled) |
| Copy / regenerate | **IconButton** xs · ghost · secondary |
| Focus ring | \`--stroke-300\` \`--color-primary-primary\` |

## Accessibility

- A \`role="group"\` named "Response feedback".
- Like/dislike are a single-choice pair ("Good response", "Bad response"):
  Radix exposes them as radios that report \`aria-checked\`; arrow keys move
  between them.
- Copy announces "Copied" through a polite live region.

## Do / Don't

| Do | Don't |
| --- | --- |
| Put feedback under answers that can be wrong | Ask for feedback on system notices |
| Follow a dislike with a short optional form | Force a reason before recording a dislike |
| Keep the order: like, dislike, copy, regenerate | Reorder or add unrelated actions |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { onValueChange: fn(), onCopy: fn(), onRegenerate: fn() },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    value: { control: 'inline-radio', options: ['liked', 'disliked', null], table: { category: 'State' } },
    defaultValue: { control: 'inline-radio', options: ['liked', 'disliked', null], table: { category: 'State' } },
    showRegenerate: { control: 'boolean', table: { category: 'Appearance' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    onCopy: { action: 'copy', table: { category: 'Events' } },
    onRegenerate: { action: 'regenerate', table: { category: 'Events' } },
  },
} satisfies Meta<typeof AiFeedback>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** Default, liked and disliked (Figma `state`). */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <AiFeedback onCopy={() => {}} onRegenerate={() => {}} />
      <AiFeedback defaultValue="liked" onCopy={() => {}} onRegenerate={() => {}} />
      <AiFeedback defaultValue="disliked" onCopy={() => {}} onRegenerate={() => {}} />
    </div>
  ),
};

/** QA matrix — state × regenerate on/off. Audit under every theme. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 16 }}>
      {([null, 'liked', 'disliked'] as const).flatMap((v) => [
        <AiFeedback key={`${v}-a`} defaultValue={v} onCopy={() => {}} onRegenerate={() => {}} />,
        <AiFeedback key={`${v}-b`} defaultValue={v} onCopy={() => {}} showRegenerate={false} />,
      ])}
    </div>
  ),
};

/** Like toggles on and off; copy fires. */
export const TogglesFire: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const like = canvas.getByRole('radio', { name: 'Good response' });
    await userEvent.click(like);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('liked');
    await userEvent.click(like);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy' }));
    await expect(args.onCopy).toHaveBeenCalled();
  },
};
