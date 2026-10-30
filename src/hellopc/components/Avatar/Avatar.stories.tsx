import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Avatar, type AvatarSize } from './Avatar';

const SIZES: AvatarSize[] = ['sm', 'md', 'lg'];

/** A real portrait so the image path is exercised; the broken-URL stories use a
 *  deliberately bad path to show the fallback. */
const PHOTO = 'https://i.pravatar.cc/150?img=47';

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
);

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The circular representation of a person (Figma "&avatar", node 142:8305). Shows
a photo when there is one and degrades gracefully — **photo → initials → person
glyph** — so a missing or broken image never leaves an empty circle.

Wraps the Radix \`Avatar\` primitive, which owns the genuinely fiddly part: the
image loading lifecycle. The fallback stays up until the image has actually
loaded and returns if it errors, which is exactly the case hand-rolled avatars
get wrong.

Two of Figma's variant axes aren't really appearance, so they're modelled as
what they are:

| Figma | Here |
| --- | --- |
| \`size=small / medium / large\` | \`size="sm" / "md" / "lg"\` (32 / 40 / 48px) |
| \`size=focus\` | a real \`:focus-visible\` ring — only when interactive |
| \`content=initials / image / icon\` | derived from \`initials\` / \`src\` (glyph is the last resort) |
| \`content=check\` | \`selected\` — a picked-option state |
| \`showBadge\` | \`badge\` |

Every value resolves from hello pc tokens that mirror the Figma variables 1:1, and
the **Theme** toolbar re-themes each example live via \`[data-theme]\`.

## Usage

\`\`\`tsx
import { Avatar } from '@/hellopc/components/Avatar';

// photo, falling back to initials while it loads
<Avatar src={user.photoUrl} alt={user.name} initials="AB" />

// initials only
<Avatar initials="A" size="lg" />

// no photo and no initials — the person glyph
<Avatar />

// presence dot + clickable (renders a <button> and gains the focus ring)
<Avatar src={user.photoUrl} alt={user.name} badge onClick={openProfileMenu} />

// selected, for avatars used as pickable options
<Avatar initials="A" selected />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| circle | \`--radius-1000\` (full), \`--color-primary-primary-overlay\` surface |
| initials / glyph | \`--color-primary-primary\`, \`--type-size-subject\` (16px), \`--font-weight-medium\` |
| selected | \`--color-primary-primary\` fill, \`--color-text-icon-on-primary\` check |
| presence dot | 8px, \`--color-success-success\`, \`--stroke-100\` ring in \`--color-surfaces-container\` |
| focus ring | \`--stroke-300\` (3px) \`--color-primary-primary\`, \`--space-025\` offset |

Diameters (32 / 40 / 48px) and the glyph sizes inside them are intrinsic
geometry from Figma 142:8305, cited in the source.

**One known gap:** Figma draws a subtle white 40% ring around the photo variant
(\`--white/40a\`). No hello pc token carries that value, so it is deliberately
omitted rather than hardcoded — worth adding as a token if the ring matters.

## Accessibility

- \`alt\` describes **the person**, not the word "avatar" — screen readers
  already announce it as an image.
- The fallback initials are plain text, so they're read out; the person glyph is
  \`aria-hidden\` decoration, since a nameless placeholder isn't worth announcing.
- The presence dot ships with visually-hidden text (\`badgeLabel\`, default
  "Online"), so presence is never conveyed by color alone (WCAG 1.4.1).
- Passing \`onClick\` renders a real \`<button>\` — focusable, activatable by
  Enter/Space, and showing the Figma focus ring. A decorative avatar stays a
  \`<span>\` and out of the tab order.
- An interactive avatar with no \`alt\` or \`initials\` needs an \`aria-label\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Give \`initials\` alongside \`src\` so a slow or broken image degrades well. | Rely on the image alone and risk an empty circle. |
| Describe the person in \`alt\` ("Ada Lovelace"). | Write \`alt="avatar"\` or \`alt="profile picture"\`. |
| Use \`onClick\` when the avatar opens a menu or profile. | Wrap a decorative avatar in a click handler on a \`div\`. |
| Keep initials to 1–2 characters. | Cram a full name into the circle. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    initials: 'A',
    size: 'md',
    selected: false,
    badge: false,
  },
  argTypes: {
    src: { control: 'text', table: { category: 'Content' } },
    alt: { control: 'text', table: { category: 'Content' } },
    initials: { control: 'text', table: { category: 'Content' } },
    size: {
      control: 'inline-radio',
      options: SIZES,
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    selected: { control: 'boolean', table: { category: 'State' } },
    badge: { control: 'boolean', table: { category: 'State' } },
    badgeLabel: { control: 'text', table: { category: 'Accessibility' } },
    delayMs: { control: 'number', table: { category: 'Behavior' } },
    onClick: { control: false, table: { category: 'Events' } },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel. */
export const Playground: Story = {};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Figma `size=small / medium / large` — 32, 40, and 48px diameters.',
      },
    },
  },
  render: () => (
    <Row>
      {SIZES.map((size) => (
        <Avatar key={size} size={size} initials="A" />
      ))}
    </Row>
  ),
};

export const Content: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The three content states, in the order the component falls back through ' +
          'them: photo, then initials, then the person glyph.',
      },
    },
  },
  render: () => (
    <Row>
      <Avatar size="lg" src={PHOTO} alt="Ada Lovelace" initials="AL" />
      <Avatar size="lg" initials="A" />
      <Avatar size="lg" />
    </Row>
  ),
};

export const FallbackBehavior: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A broken image URL falls back rather than leaving an empty circle — to ' +
          'initials when they are supplied, otherwise to the person glyph. This is ' +
          'the Radix loading lifecycle doing the work.',
      },
    },
  },
  render: () => (
    <Row>
      <Avatar size="lg" src="https://example.invalid/missing.png" alt="Ada Lovelace" initials="AL" />
      <Avatar size="lg" src="https://example.invalid/missing.png" alt="Unknown person" />
    </Row>
  ),
};

export const WithBadge: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The presence dot (Figma `showBadge`) sits outside the clipped circle so ' +
          'it is never cut off, with a ring so it reads against a photo. It carries ' +
          'visually-hidden text, so presence is not color-only.',
      },
    },
  },
  render: () => (
    <Row>
      {SIZES.map((size) => (
        <Avatar key={size} size={size} src={PHOTO} alt="Ada Lovelace" initials="AL" badge />
      ))}
      <Avatar size="lg" initials="A" badge />
      <Avatar size="lg" badge />
    </Row>
  ),
};

export const Selected: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma `content=check` — a filled primary circle with an inverse check, ' +
          'for avatars used as pickable options (an attendee picker, a share sheet).',
      },
    },
  },
  render: () => (
    <Row>
      {SIZES.map((size) => (
        <Avatar key={size} size={size} selected />
      ))}
    </Row>
  ),
};

export const Interactive: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With `onClick` the avatar renders as a real `<button>` — Tab to it to see ' +
          'Figma’s focus ring (`size=focus`). Without `onClick` it stays a `<span>` ' +
          'and out of the tab order.',
      },
    },
  },
  render: () => (
    <Row>
      <Avatar src={PHOTO} alt="Ada Lovelace" initials="AL" onClick={fn()} />
      <Avatar initials="A" size="lg" onClick={fn()} />
      <Avatar aria-label="Open profile menu" size="lg" badge onClick={fn()} />
    </Row>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: every size × content state, with and without the presence dot, ' +
          'plus the selected treatment. Audit under both themes — the overlay ' +
          'surface, the accent initials, and the dot ring should all hold up.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {SIZES.map((size) => (
        <Row key={size}>
          <Avatar size={size} src={PHOTO} alt="Ada Lovelace" initials="AL" />
          <Avatar size={size} initials="A" />
          <Avatar size={size} />
          <Avatar size={size} src={PHOTO} alt="Ada Lovelace" initials="AL" badge />
          <Avatar size={size} initials="A" badge />
          <Avatar size={size} badge />
          <Avatar size={size} selected />
        </Row>
      ))}
    </div>
  ),
};

/** Pure interaction test (hidden from docs): interactive avatars are real
 *  buttons, and the presence dot is announced rather than color-only. */
const activated = fn();
export const InteractiveIsAButton: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Avatar aria-label="Open profile menu" initials="A" badge onClick={activated} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    activated.mockClear();

    const button = canvas.getByRole('button', { name: /Open profile menu/ });
    await userEvent.click(button);
    await expect(activated).toHaveBeenCalled();

    // presence is exposed as text, not just the green dot
    await expect(canvas.getByText('Online')).toBeInTheDocument();
  },
};
