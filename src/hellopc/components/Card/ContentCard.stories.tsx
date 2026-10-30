import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { BadgeCheck } from 'lucide-react';

import { ContentCard } from './ContentCard';
import { Card } from './Card';
import { Button } from '../Button/Button';

const BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

/** A placeholder media fill for the square slot. */
const MediaFill = (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, var(--color-tonal-tonal), var(--color-surfaces-on-container))',
    }}
  />
);

/** The Figma button group: a secondary before a primary. */
const ButtonGroup = (
  <>
    <Button size="sm" variant="tonal" intent="secondary">Label</Button>
    <Button size="sm">Primary</Button>
  </>
);

const meta = {
  title: 'Components/Card/Content Card',
  component: ContentCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The horizontal content card template (Figma \`_elements / content card\`, node
183:11846). It's content that slots into a **Card**: a text column (eyebrow,
title, body, actions) beside a square media slot.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

The template owns the layout and type scale; the buttons and media are yours —
compose a hello pc **Button** group into \`actions\` (a secondary *before* a
primary, per the button-group rule) and any node into \`media\`. Being
presentational it wraps no Radix primitive. Slot it into a \`<Card>\`, which
supplies the surface and elevation.

## Usage

\`\`\`tsx
import { Card, ContentCard } from '@/hellopc/components/Card';
import { Button } from '@/hellopc/components/Button';

<Card>
  <ContentCard
    leadingIcon={<BadgeCheck />}
    leadingText="Leading text"
    title="Content card title"
    body="Lorem ipsum…"
    actions={
      <>
        <Button size="sm" variant="tonal" intent="secondary">Label</Button>
        <Button size="sm">Primary</Button>
      </>
    }
    media={<img src="cover.jpg" alt="" />}
  />
</Card>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| padding / column gap | \`--space-500\` (24px) padding, \`--space-600\` (32px) between text and media |
| text stack gaps | \`--space-300\` (16px), \`--space-200\` (12px) header, \`--space-500\` (24px) body group |
| leading | \`--type-size-subject\` (16px), \`--color-text-icon-secondary\` |
| title | \`--type-size-subtitle\` (18px), \`--font-weight-bold\`, \`--color-text-icon-primary\` |
| body | \`--type-size-body\` (14px), \`--color-text-icon-secondary\` |
| media | 200px square, \`--radius-300\` (16px), \`overflow: hidden\` |
| actions | hello pc **Button** group (secondary before primary) |
| surface + elevation | provided by the enclosing **Card** |

## Accessibility

- The title renders as an \`<h3>\`; keep heading order coherent with the page.
- \`leadingIcon\` is decorative (\`aria-hidden\`); the leading text carries meaning.
- Give real media an \`alt\` (or \`alt=""\` if purely decorative); the slot doesn't
  add one for you.

## Do / Don't

| Do | Don't |
| --- | --- |
| Place the secondary Button before the primary | Lead with the primary — it breaks the action hierarchy |
| Use the media slot for a square image or illustration | Stretch a wide banner into the 200px square |
| Slot it into a \`<Card>\` | Render it bare — it has no surface or elevation of its own |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    leadingText: 'Leading text',
    title: 'Content card title',
    body: BODY,
  },
  argTypes: {
    leadingText: { control: 'text', table: { category: 'Content' } },
    title: { control: 'text', table: { category: 'Content' } },
    body: { control: 'text', table: { category: 'Content' } },
    leadingIcon: { control: false, table: { category: 'Content' } },
    actions: { control: false, table: { category: 'Content' } },
    media: { control: false, table: { category: 'Content' } },
  },
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 560 }}>
      <Card>
        <ContentCard {...args} leadingIcon={<BadgeCheck />} actions={ButtonGroup} media={MediaFill} />
      </Card>
    </div>
  ),
};

/** The default content card: text column, a secondary→primary button group, and a square media slot. */
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 560 }}>
      <Card>
        <ContentCard
          leadingIcon={<BadgeCheck />}
          leadingText="Leading text"
          title="Content card title"
          body={BODY}
          actions={ButtonGroup}
          media={MediaFill}
        />
      </Card>
    </div>
  ),
};

/** Text only — omit `media` and the card collapses to a single column. */
export const NoMedia: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 420 }}>
      <Card>
        <ContentCard
          leadingIcon={<BadgeCheck />}
          leadingText="Leading text"
          title="Content card title"
          body={BODY}
          actions={ButtonGroup}
        />
      </Card>
    </div>
  ),
};

/** Theme/QA pass — audit under both themes with the **Theme** toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 560 }}>
      <Card>
        <ContentCard
          leadingIcon={<BadgeCheck />}
          leadingText="Leading text"
          title="Content card title"
          body={BODY}
          actions={ButtonGroup}
          media={MediaFill}
        />
      </Card>
    </div>
  ),
};
