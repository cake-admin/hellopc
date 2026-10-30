import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { MoreVertical, ArrowRight } from 'lucide-react';

import { SimpleCard } from './SimpleCard';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';

const BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

/** A placeholder media fill for the full-bleed top slot. */
const MediaFill = (
  <div
    style={{
      height: 180,
      background: 'linear-gradient(135deg, var(--color-tonal-tonal), var(--color-surfaces-on-container))',
    }}
  />
);

const MenuButton = (
  <IconButton size="sm" variant="ghost" intent="secondary" label="More options" icon={<MoreVertical />} />
);

const Actions = (
  <Button size="sm" variant="outline" intent="secondary" endIcon={<ArrowRight />}>
    Label
  </Button>
);

const meta = {
  title: 'Components/Card/Simple Card',
  component: SimpleCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The vertical media card template (Figma \`_elements / simple card\`, node
183:11859). It's content that slots into a **Card**: a full-bleed media area on
top, then a title with an optional overflow menu, a body paragraph, and an
actions row.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

The media is **full-bleed** so it reaches the card's rounded corners — the
enclosing **Card**'s \`overflow: hidden\` clips it — while the rest sits in padded
content. The template owns the layout and type scale; the media, menu, and
buttons are yours (a hello pc **IconButton** in \`menu\`, **Button**s in
\`actions\`). Being presentational it wraps no Radix primitive. Slot it into a
\`<Card>\`, which supplies the surface and elevation.

## Usage

\`\`\`tsx
import { Card, SimpleCard } from '@/hellopc/components/Card';
import { Button } from '@/hellopc/components/Button';
import { IconButton } from '@/hellopc/components/Button';

<Card>
  <SimpleCard
    media={<img src="cover.jpg" alt="" />}
    title="Simple card title"
    menu={<IconButton size="sm" variant="ghost" label="More options" icon={<MoreVertical />} />}
    body="Lorem ipsum…"
    actions={<Button size="sm" variant="outline" intent="secondary" endIcon={<ArrowRight />}>Label</Button>}
  />
</Card>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| content padding | \`--space-500\` (24px) |
| stack gaps | \`--space-500\` (24px), \`--space-300\` (16px), \`--space-200\` (12px) title row |
| media | full-bleed (\`overflow: hidden\`), \`--color-surfaces-on-container\` placeholder |
| title | \`--type-size-subtitle\` (18px), \`--font-weight-bold\`, \`--color-text-icon-primary\` |
| body | \`--type-size-body\` (14px), \`--color-text-icon-secondary\` |
| menu | hello pc **IconButton** (\`size="sm"\`, ghost) |
| actions | hello pc **Button** / button group |
| surface + elevation | provided by the enclosing **Card** |

## Accessibility

- The title renders as an \`<h3>\`; keep heading order coherent with the page.
- The \`menu\` **IconButton** requires a \`label\` — it announces "More options"
  even though only the "⋮" glyph shows.
- Give real media an \`alt\` (or \`alt=""\` if decorative); the slot adds none.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use full-bleed media so it meets the Card's corners | Pad the media — it should reach the rounded edges |
| Put row-level overflow actions in \`menu\` | Crowd the title row with several icon buttons |
| Slot it into a \`<Card>\` | Render it bare — it has no surface or elevation of its own |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: 'Simple card title',
    body: BODY,
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    body: { control: 'text', table: { category: 'Content' } },
    media: { control: false, table: { category: 'Content' } },
    menu: { control: false, table: { category: 'Content' } },
    actions: { control: false, table: { category: 'Content' } },
  },
} satisfies Meta<typeof SimpleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Card>
        <SimpleCard {...args} media={MediaFill} menu={MenuButton} actions={Actions} />
      </Card>
    </div>
  ),
};

/** The default simple card: full-bleed media, title + overflow menu, body, and an outline action. */
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 320 }}>
      <Card>
        <SimpleCard media={MediaFill} title="Simple card title" menu={MenuButton} body={BODY} actions={Actions} />
      </Card>
    </div>
  ),
};

/** No media — the card starts at the title, useful for a compact text card. */
export const NoMedia: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 320 }}>
      <Card>
        <SimpleCard title="Simple card title" menu={MenuButton} body={BODY} actions={Actions} />
      </Card>
    </div>
  ),
};

/** Theme/QA pass — audit under both themes with the **Theme** toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ width: 300 }}>
        <Card>
          <SimpleCard media={MediaFill} title="Simple card title" menu={MenuButton} body={BODY} actions={Actions} />
        </Card>
      </div>
      <div style={{ width: 300 }}>
        <Card elevation="high">
          <SimpleCard title="Simple card title" menu={MenuButton} body={BODY} actions={Actions} />
        </Card>
      </div>
    </div>
  ),
};
