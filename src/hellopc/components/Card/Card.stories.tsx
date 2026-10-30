import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { Card } from './Card';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

/** A padded content block — cards add no padding of their own, so content brings it. */
const Body = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-200)',
      padding: 'var(--space-500)',
      fontFamily: 'var(--font-family)',
    }}
  >
    {children}
  </div>
);

/** Representative card content used across the examples. */
const SampleContent = (
  <Body>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-200)' }}>
      <span
        style={{
          fontSize: 'var(--type-size-subject)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-icon-primary)',
        }}
      >
        Project Atlas
      </span>
      <Badge color="green">Active</Badge>
    </div>
    <p style={{ margin: 0, fontSize: 'var(--type-size-body)', color: 'var(--color-text-icon-secondary)', lineHeight: 1.4 }}>
      A shared workspace for the platform team. Twelve members, three open reviews.
    </p>
    <div style={{ display: 'flex', gap: 'var(--space-100)' }}>
      <Button size="sm" variant="tonal" intent="secondary">Details</Button>
      <Button size="sm">Open</Button>
    </div>
  </Body>
);

const meta = {
  title: 'Components/Card/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
An elevated surface that frames a slot of content (Figma \`&Card\`, node
182:11794). Card is a container and nothing more: a 24px-rounded
\`--color-surfaces-container\` surface that lifts off the page with a token drop
shadow and clips its content to the rounded corners. What goes inside is yours —
plain content, or the card templates that slot in.

Every color, radius, and shadow value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

Being presentational, Card **wraps no Radix primitive** — there is none for a
surface and nothing interactive to delegate, so it renders a semantic \`<div>\`
(the same call the static **Badge** makes). The slot is **flush**: Card adds no
inner padding, so edge-to-edge media reaches the corners (that's what
\`overflow: hidden\` is for). Content that needs insets brings its own padding —
the examples wrap content in a padded body, and the templates do the same.

Use Card to group related content into a raised unit. For an overlay that traps
focus use **Modal**; for a flat grouping with no lift, a plain bordered surface
is lighter than a Card.

## Usage

\`\`\`tsx
import { Card } from '@/hellopc/components/Card';

// content brings its own padding
<Card>
  <div style={{ padding: 'var(--space-500)' }}>…</div>
</Card>

// reserved for a future raised/floating treatment (currently == low)
<Card elevation="high">…</Card>

// edge-to-edge media (the flush slot + overflow:hidden clip it to the corners)
<Card>
  <img src="cover.jpg" alt="" style={{ width: '100%', display: 'block' }} />
  <div style={{ padding: 'var(--space-500)' }}>…</div>
</Card>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| surface | \`--color-surfaces-container\` |
| corner radius | \`--radius-400\` (24px) |
| elevation · low, high | \`--elevation-0\` (Figma \`elevation/0\`, resting) |
| clipping | \`overflow: hidden\` (media bleeds to the rounded corners) |
| slot padding | none — content owns its insets |

## Accessibility

- Card is presentational — a plain \`<div>\`. It adds no role or heading; the
  content inside carries the structure (a heading, a link, etc.).
- To make a card a labelled region, pass \`role="region"\` +
  \`aria-label\`/\`aria-labelledby\` (or render it around an \`<article>\`); the
  component spreads props through, so add semantics at the call site.
- For a **clickable** card, put a real \`<button>\`/\`<a>\` inside (e.g. a title
  link) rather than an \`onClick\` on the surface — the whole card as one button
  hides its inner controls from assistive tech.
- Elevation is a visual cue only; never rely on the shadow alone to convey
  state.

## Do / Don't

| Do | Don't |
| --- | --- |
| Let content bring its own padding | Assume Card pads its slot for you |
| Use \`overflow: hidden\` to bleed media to the corners | Add a nested rounded wrapper to re-clip what Card already clips |
| Use the default \`elevation="low"\` | Reach for \`elevation="high"\` expecting a stronger shadow — it currently renders identically, pending a confirmed raised spec |
| Use **Modal** for focus-trapping overlays | Build a dialog out of a Card |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    elevation: 'low',
  },
  argTypes: {
    children: { control: false, table: { category: 'Content' } },
    elevation: {
      control: 'inline-radio',
      options: ['low', 'high'],
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <Card {...args}>{SampleContent}</Card>
    </div>
  ),
};

/**
 * `low` and `high` side by side. Both currently render the Figma
 * `elevation/0` resting shadow (`--elevation-0`) — `high` is reserved for a
 * raised/floating treatment once that spec is confirmed against Figma.
 */
export const Elevation: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ width: 300 }}>
        <Card elevation="low">{SampleContent}</Card>
      </div>
      <div style={{ width: 300 }}>
        <Card elevation="high">{SampleContent}</Card>
      </div>
    </div>
  ),
};

/**
 * The slot is flush, so an image (or any media/background) bleeds to the top
 * corners — `overflow: hidden` clips it to the 24px radius. Padded content sits
 * below it.
 */
export const FlushMedia: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 360 }}>
      <Card>
        <div
          style={{
            height: 140,
            background:
              'linear-gradient(135deg, var(--color-primary-primary), var(--color-tonal-tonal))',
          }}
        />
        {SampleContent}
      </Card>
    </div>
  ),
};

/**
 * QA pass — both elevations with content. Audit them under both themes with the
 * **Theme** toolbar (the surface, shadow, and text all re-theme).
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ width: 280 }}>
        <Card elevation="low">
          <div style={{ height: 100, background: 'var(--color-surfaces-on-container)' }} />
          {SampleContent}
        </Card>
      </div>
      <div style={{ width: 280 }}>
        <Card elevation="high">{SampleContent}</Card>
      </div>
    </div>
  ),
};
