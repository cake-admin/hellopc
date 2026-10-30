import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ArrowRight, BadgeCheck } from 'lucide-react';

import { HeroCard } from './HeroCard';
import { Card } from './Card';
import { Button } from '../Button/Button';

const BODY =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const meta = {
  title: 'Components/Card/Hero Card',
  component: HeroCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The marketing hero card template (Figma \`hero card\`, node 183:11829, and its
centered \`banner card\` variant, node 183:11878). It's content that slots into a
**Card**: an optional leading eyebrow (icon + text), a large display title, one
or two body paragraphs, and an actions row.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

\`align\` covers both Figma templates in one component: \`start\` is the
left-aligned hero, \`center\` is the banner. The template owns the type scale and
layout; the button is yours — compose a hello pc **Button** into \`actions\`
(\`fill\` for the hero, \`tonal\` for the banner). Being presentational it wraps no
Radix primitive. Slot it into a \`<Card>\`, which supplies the surface and
elevation (the examples do this).

## Usage

\`\`\`tsx
import { Card, HeroCard } from '@/hellopc/components/Card';
import { Button } from '@/hellopc/components/Button';

// hero (left, fill button)
<Card>
  <HeroCard
    leadingIcon={<BadgeCheck />}
    leadingText="Leading text"
    title="Hero card title"
    body="Primary paragraph…"
    secondaryBody="Secondary paragraph…"
    actions={<Button size="lg" endIcon={<ArrowRight />}>Label</Button>}
  />
</Card>

// banner (centered, tonal button)
<Card>
  <HeroCard
    align="center"
    title="Hero card title"
    body="…"
    actions={<Button size="lg" variant="tonal" endIcon={<ArrowRight />}>Launch</Button>}
  />
</Card>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| padding / gaps | \`--space-600\` (32px) padding + body gap, \`--space-300\` (16px), \`--space-100\` (8px) |
| leading | \`--type-size-subject\` (16px), \`--font-weight-regular\`, \`--color-text-icon-primary\` |
| title | \`--type-size-hero\` (42px), \`--font-weight-bold\`, \`--color-text-icon-primary\` |
| primary body | \`--type-size-title\` (20px), \`--font-weight-regular\` |
| secondary body | \`--type-size-subject\` (16px), \`--font-weight-regular\` |
| actions | hello pc **Button** (\`size="lg"\`; \`fill\` hero / \`tonal\` banner) |
| surface + elevation | provided by the enclosing **Card** |

## Accessibility

- The title renders as an \`<h2>\` — keep the document's heading order sane around
  it (a hero is usually the top of its section).
- \`leadingIcon\` is decorative (\`aria-hidden\`); the leading text carries meaning.
- Put a real **Button** (or link) in \`actions\`; it brings its own accessible
  name and focus ring.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use \`align="center"\` for the banner treatment | Center-align long multi-paragraph copy — it's hard to read |
| Pair the hero with a \`fill\` Button, the banner with \`tonal\` | Stack several hero cards on one page — one hero per view |
| Slot it into a \`<Card>\` | Render it bare — it has no surface or elevation of its own |
| Keep the title short and declarative | Put a paragraph in the 42px title slot |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    align: 'start',
    leadingText: 'Leading text',
    title: 'Hero card title',
    body: BODY,
    secondaryBody: BODY,
  },
  argTypes: {
    leadingText: { control: 'text', table: { category: 'Content' } },
    title: { control: 'text', table: { category: 'Content' } },
    body: { control: 'text', table: { category: 'Content' } },
    secondaryBody: { control: 'text', table: { category: 'Content' } },
    leadingIcon: { control: false, table: { category: 'Content' } },
    actions: { control: false, table: { category: 'Content' } },
    align: {
      control: 'inline-radio',
      options: ['start', 'center'],
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof HeroCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 520 }}>
      <Card>
        <HeroCard
          {...args}
          leadingIcon={<BadgeCheck />}
          actions={
            <Button size="lg" variant={args.align === 'center' ? 'tonal' : 'fill'} endIcon={<ArrowRight />}>
              {args.align === 'center' ? 'Launch' : 'Label'}
            </Button>
          }
        />
      </Card>
    </div>
  ),
};

/** The left-aligned hero (Figma `hero card`): eyebrow, 42px title, two paragraphs, a `fill` Button. */
export const Hero: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 520 }}>
      <Card>
        <HeroCard
          leadingIcon={<BadgeCheck />}
          leadingText="Leading text"
          title="Hero card title"
          body={BODY}
          secondaryBody={BODY}
          actions={
            <Button size="lg" endIcon={<ArrowRight />}>
              Label
            </Button>
          }
        />
      </Card>
    </div>
  ),
};

/** The centered banner (Figma `banner card`): `align="center"` with a `tonal` Button. */
export const Banner: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 520 }}>
      <Card>
        <HeroCard
          align="center"
          leadingText="Leading text"
          title="Hero card title"
          body={BODY}
          secondaryBody={BODY}
          actions={
            <Button size="lg" variant="tonal" endIcon={<ArrowRight />}>
              Launch
            </Button>
          }
        />
      </Card>
    </div>
  ),
};

/** Both treatments for a theme/QA pass — audit them under both themes with the **Theme** toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 520 }}>
      <Card>
        <HeroCard
          leadingIcon={<BadgeCheck />}
          leadingText="Leading text"
          title="Hero card title"
          body={BODY}
          actions={
            <Button size="lg" endIcon={<ArrowRight />}>
              Label
            </Button>
          }
        />
      </Card>
      <Card>
        <HeroCard
          align="center"
          leadingText="Leading text"
          title="Hero card title"
          body={BODY}
          actions={
            <Button size="lg" variant="tonal" endIcon={<ArrowRight />}>
              Launch
            </Button>
          }
        />
      </Card>
    </div>
  ),
};
