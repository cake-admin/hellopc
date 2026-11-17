import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import { Link } from './Link';

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A text link that navigates — to another page, a section, or an external
resource. Links navigate; **buttons perform actions**: if clicking runs a
command (save, delete, open a dialog), use \`Button\` instead, and never style a
link to look like a button. Use \`inverse\` on colored fills such as banners and
promos.

Every color, spacing, radius, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

Always renders a real \`<a>\`, always underlined. \`external\` adds the trailing
open-in-new icon, opens in a new tab and tells screen readers so; \`icon\` swaps
in another trailing glyph. Hover, press, and focus are CSS states, not props.
There is no visited state (hello pc apps are native, with no browsing history).
Link is standalone: Figma's instances can't wrap mid-sentence, so for a link
inside running body copy, keep the paragraph's own type and wrap just the words.

## Usage

\`\`\`tsx
<Link href="/warranty">View warranty details</Link>
<Link href="/support" size="lg">Contact support</Link>
<Link href="https://lenovo.com/support" external>Lenovo support site</Link>
<Link href="/tips" icon={<ArrowRight />}>See all tips</Link>
<Link href="/offers" inverse>See offers</Link>
<Link disabled>Report unavailable</Link>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Text · default / hover / press | \`--color-text-icon-link\` / \`-link-hover\` / \`-link-press\` |
| Text · disabled | \`--color-text-icon-disabled\` |
| Text · inverse | \`--color-text-icon-on-primary\` (all states; disabled at 50% opacity) |
| Type | \`--font-family\`, \`--font-weight-medium\`; \`sm\` \`--type-size-caption\`, \`md\` \`--type-size-body\`, \`lg\` \`--type-size-subject\`; line-height 1.35 |
| Icon | trailing, same size as the text, \`currentColor\`; icon ↔ text gap \`--space-050\` |
| Focus ring | \`--stroke-300\` in the link color, \`--radius-50\`, 4px (\`--space-050\`) out at the sides |
| Target | 24px minimum height |

## Accessibility

- It's a native \`<a href>\`: Enter follows it and it's announced as a link.
  Write text that names the destination ("View warranty details", not "Click
  here") — screen-reader users often navigate by a list of links.
- The underline is never removed, so links don't rely on color alone
  (WCAG 1.4.1). The 24px minimum height meets the target size (WCAG 2.5.8).
- \`external\` adds visually hidden "(opens in a new window)" text, so the
  change of context isn't a surprise.
- \`disabled\` drops the \`href\`, sets \`aria-disabled="true"\` and leaves the tab
  order. Prefer removing a link that has nowhere to go.
- Focus is restyled (3px ring in the link color), never removed.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use a link to go somewhere | Use a link to run an action — that's \`Button\` |
| Mark links that leave the app with \`external\` | Open new windows without warning |
| Use \`inverse\` on colored fills | Put the standard link on a colored surface |
| Write descriptive link text | Write "Click here" or "Learn more" on its own |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { href: '#', children: 'View warranty details', onClick: fn() },
  decorators: [
    // Storybook's preview sets <base target="_parent">, so following an
    // example's href="#" would navigate the whole Storybook window. Cancel
    // navigation for those placeholder links only; onClick still fires.
    (Story) => (
      <div
        onClickCapture={(e) => {
          if ((e.target as HTMLElement).closest('a[href="#"]')) e.preventDefault();
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    children: { control: 'text', table: { category: 'Content' } },
    href: { control: 'text', table: { category: 'Content' } },
    icon: { control: false, table: { category: 'Content' } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], table: { category: 'Appearance' } },
    inverse: { control: 'boolean', table: { category: 'Appearance' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    external: { control: 'boolean', table: { category: 'Behavior' } },
    onClick: { action: 'click', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
);

/** Chrome for inverse examples: a primary-fill banner (story layout, not the component). */
const Banner = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      background: 'var(--color-primary-primary)',
    }}
  >
    {children}
  </div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** `sm` 12px, `md` 14px (default, body copy), `lg` 16px — the icon follows the text size. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row>
      <Link href="#" size="sm" external>Small link</Link>
      <Link href="#" size="md" external>Medium link</Link>
      <Link href="#" size="lg" external>Large link</Link>
    </Row>
  ),
};

/** `external`: trailing open-in-new icon, new tab, and a screen-reader hint. `icon` swaps the glyph. */
export const Icons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row>
      <Link href="https://www.lenovo.com" external>Lenovo support site</Link>
      <Link href="#" icon={<ArrowRight />}>See all tips</Link>
    </Row>
  ),
};

/** On colored fills use `inverse` — `--color-text-icon-on-primary` in every state. */
export const Inverse: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Banner>
      <Link href="#" inverse>See offers</Link>
      <Link href="#" inverse external>Open the store</Link>
      <Link inverse disabled>Unavailable</Link>
    </Banner>
  ),
};

/** Disabled: `--color-text-icon-disabled`, no `href`, out of the tab order. Use sparingly. */
export const Disabled: Story = { args: { disabled: true } };

/** QA matrix — size × default / disabled, standard and inverse. Audit under every theme via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Row key={s}>
          <Link href="#" size={s}>Default</Link>
          <Link href="#" size={s} external>External</Link>
          <Link size={s} disabled>Disabled</Link>
        </Row>
      ))}
      <Banner>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Link key={s} href="#" size={s} inverse external>
            Inverse {s}
          </Link>
        ))}
      </Banner>
    </div>
  ),
};

/** Clicking fires onClick; a disabled link swallows the click. */
export const ClicksFire: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Row>
      <Link {...args}>Enabled</Link>
      <Link {...args} disabled>
        Off
      </Link>
    </Row>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Enabled'));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    const off = canvas.getByText('Off').closest('a')!;
    await expect(off).toHaveAttribute('aria-disabled', 'true');
    await expect(off).not.toHaveAttribute('href');
    await userEvent.click(off, { pointerEventsCheck: 0 });
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
