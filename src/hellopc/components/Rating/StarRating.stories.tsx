import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import type { ReactNode } from 'react';

import { StarRating } from './StarRating';

const meta = {
  title: 'Components/Rating/Star Rating',
  component: StarRating,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A read-only star score — how a supplier, product or review was rated. It shows a
result; it doesn't take input. To ask people for a score, use \`Rating\` (a
numbered scale); for thumbs up/down results use \`Thumbs Rating\`.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded. The star colors are the Figma 1.3.0
\`color/rating/*\` tokens; in Windows High Contrast they map to system colors
(filled = Highlight, empty = GrayText).

Whole stars are drawn (the score is rounded for the stars; \`showValue\` shows the
exact number, "4.0"). The whole component is one image to assistive technology
with a sentence name — "Approved supplier: Rated 4 out of 5 stars" — so the
stars, value and label aren't read one by one.

## Usage

\`\`\`tsx
<StarRating value={4} />
<StarRating value={3} showValue />
<StarRating value={4.3} valueText="4.3 (128)" />
<StarRating value={5} label="Approved supplier" />
<StarRating value={2} size="lg" showValue label="Relationship" />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Filled star | fill \`--color-rating-filled\`, edge \`--color-rating-outline\` |
| Empty star | outline \`--color-rating-empty\` |
| Size | 28px (\`sm\`) / 32px (\`lg\`) stars, \`--space-050\` apart |
| Value | \`--color-text-icon-primary\`; \`sm\` \`--type-size-caption\` bold, \`lg\` \`--type-size-title\` bold |
| Label | \`--color-text-icon-primary\`; \`sm\` \`--type-size-caption\` regular, \`lg\` \`--type-size-subject\` medium |
| Gaps | value/stars/label \`--space-050\` (\`sm\`) / \`--space-100\` (\`lg\`) |

## Accessibility

- \`role="img"\` with a full-sentence name ("Rated 4 out of 5 stars"); the stars,
  value and label inside are hidden so nothing is announced twice. Pass
  \`aria-label\` to word it differently.
- Filled vs outline shape carries the score, so it doesn't rely on color alone.
- It isn't focusable — there's nothing to do with it.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use to show a score someone already gave | Use to collect a score — that's \`Rating\` |
| Add \`showValue\` when the exact number matters | Rely on half-filled stars (they aren't drawn) |
| Keep the scale at 5 | Change \`max\` between screens |
| Label what was rated when it isn't obvious | Leave a row of stars unexplained |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { value: 4, size: 'sm' },
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 5, step: 0.1 }, table: { category: 'Content' } },
    max: { control: { type: 'number', min: 1, max: 10 }, table: { category: 'Content' } },
    valueText: { control: 'text', table: { category: 'Content' } },
    label: { control: 'text', table: { category: 'Content' } },
    size: { control: 'inline-radio', options: ['sm', 'lg'], table: { category: 'Appearance' } },
    showValue: { control: 'boolean', table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** Every score, 0–5 (Figma `rating`). */
export const Scores: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      {[0, 1, 2, 3, 4, 5].map((v) => (
        <StarRating key={v} value={v} showValue />
      ))}
    </Stack>
  ),
};

/** `sm` (28px stars, 12px text) and `lg` (32px stars, bold 20 value, medium 16 label). */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      <StarRating value={3} size="sm" showValue label="Approved supplier" />
      <StarRating value={3} size="lg" showValue label="Approved supplier" />
    </Stack>
  ),
};

/** QA matrix — size × 0–5. Audit under every theme via the toolbar (win hct maps stars to system colors). */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
      {(['sm', 'lg'] as const).flatMap((s) =>
        [0, 1, 2, 3, 4, 5].map((v) => <StarRating key={`${s}-${v}`} size={s} value={v} showValue label="Score" />),
      )}
    </div>
  ),
};

/** Announced as one image with a full sentence. */
export const AccessibleName: Story = {
  tags: ['!autodocs'],
  args: { value: 4, label: 'Approved supplier', showValue: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Approved supplier: Rated 4 out of 5 stars' })).toBeInTheDocument();
  },
};
