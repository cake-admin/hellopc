import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import type { ReactNode } from 'react';

import { ThumbsRating } from './ThumbsRating';

const meta = {
  title: 'Components/Rating/Thumbs Rating',
  component: ThumbsRating,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A read-only thumbs up / down result — what someone said about an answer, an
article or a recommendation. It shows the result; it doesn't take input. To let
people give feedback on an AI response, use \`AiFeedback\`; for a star score, use
\`Star Rating\`.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

The chosen thumb is filled in primary; the other stays an outline. \`value={null}\`
shows two outlines (no rating yet). It's one image to assistive technology,
named "Feedback: thumbs up" (or "thumbs down", "no rating").

## Usage

\`\`\`tsx
<ThumbsRating value="up" />
<ThumbsRating value="down" label="Feedback" />
<ThumbsRating value={null} label="Not rated yet" />
<ThumbsRating value="up" size="lg" label="Helpful" />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Selected thumb | fill + stroke \`--color-primary-primary\` |
| Unselected thumb | outline \`--color-rating-empty\` |
| Size | 28px (\`sm\`) / 32px (\`lg\`), \`--space-050\` apart |
| Label | \`--color-text-icon-primary\`; \`sm\` \`--type-size-caption\` regular, \`lg\` \`--type-size-subject\` medium; \`--space-100\` from the thumbs |

## Accessibility

- \`role="img"\` named "<label>: thumbs up" (label defaults to "Feedback"); the
  glyphs and visible label are hidden so nothing is read twice.
- Filled vs outline shows the result without relying on color.
- Not focusable — it's a result, not a control.

## Do / Don't

| Do | Don't |
| --- | --- |
| Show a recorded thumbs result | Use it as clickable feedback — that's \`AiFeedback\` |
| Show \`value={null}\` when nothing's recorded | Hide the component and leave a gap |
| Label what the result is about | Mix thumbs and stars for the same question |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { value: 'up', label: 'Feedback', size: 'sm' },
  argTypes: {
    value: { control: 'inline-radio', options: ['up', 'down', null], table: { category: 'Content' } },
    label: { control: 'text', table: { category: 'Content' } },
    size: { control: 'inline-radio', options: ['sm', 'lg'], table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof ThumbsRating>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** No rating, thumbs up, thumbs down (Figma `value` none / up / down). */
export const Values: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row>
      <ThumbsRating value={null} label="Feedback" />
      <ThumbsRating value="up" label="Feedback" />
      <ThumbsRating value="down" label="Feedback" />
    </Row>
  ),
};

/** QA matrix — size × value. Audit under every theme via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['sm', 'lg'] as const).map((s) => (
        <Row key={s}>
          <ThumbsRating size={s} value={null} label="Feedback" />
          <ThumbsRating size={s} value="up" label="Feedback" />
          <ThumbsRating size={s} value="down" label="Feedback" />
        </Row>
      ))}
    </div>
  ),
};

/** Announced as one image named by its result. */
export const AccessibleName: Story = {
  tags: ['!autodocs'],
  args: { value: 'down', label: 'Feedback' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Feedback: thumbs down' })).toBeInTheDocument();
  },
};
