import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within, screen } from 'storybook/test';

import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

const trail: BreadcrumbItem[] = [
  { label: 'Page title', href: '#root' },
  { label: 'Page title', href: '#one' },
  { label: 'Page title', href: '#two' },
  { label: 'Page title' },
];

const longTrail: BreadcrumbItem[] = [
  { label: 'Products', href: '#products' },
  { label: 'Laptops', href: '#laptops' },
  { label: 'ThinkPad', href: '#thinkpad' },
  { label: 'X1 Carbon', href: '#x1' },
  { label: 'Gen 12', href: '#gen12' },
  { label: 'Specifications' },
];

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The trail showing where the current page sits in the hierarchy (Figma
"Breadcrumb", node 134:7943). Use it on pages nested two or more levels deep so
users can see the path and jump back up it.

Figma ships two styles — \`simple\` (the whole trail inline) and \`complex\` (a
long trail with its middle collapsed behind a "…" overflow menu). Here that's
**one component**: set \`maxItems\` and the middle collapses automatically.

No Radix primitive covers a breadcrumb trail, so the trail is the correct
semantic markup — a \`<nav aria-label>\` landmark around an ordered list, with
the last crumb marked \`aria-current="page"\`. The overflow menu is where real
behavior is needed, and that **is** Radix: a \`DropdownMenu\` that composes the
existing hello pc pieces instead of rebuilding them — **IconButton** as the
trigger, **Menu Container** as the surface, and **Menu Item** for each hidden
crumb. Every value resolves from hello pc tokens that mirror the Figma variables
1:1, and the **Theme** toolbar re-themes every example live via \`[data-theme]\`.

## Usage

\`\`\`tsx
import { Breadcrumb } from '@/hellopc/components/Breadcrumb';

// simple — the whole trail inline
<Breadcrumb
  items={[
    { label: 'Products', href: '/products' },
    { label: 'Laptops', href: '/products/laptops' },
    { label: 'X1 Carbon' }, // last item = current page
  ]}
/>

// complex — collapse the middle once the trail exceeds 4 crumbs
<Breadcrumb items={longTrail} maxItems={4} />

// router-driven navigation
<Breadcrumb
  items={[{ label: 'Home', onClick: () => navigate('/') }, { label: 'Settings' }]}
/>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| crumb type | \`--type-size-subject\` (16px), \`--font-weight-medium\` |
| crumb color | \`--color-text-icon-secondary\` |
| current page | \`--color-primary-primary\`, \`aria-current="page"\` |
| crumb padding | \`--space-050\` (4px) block |
| trail gap | \`--space-075\` (6px) |
| separator | 24px chevron, \`--color-text-icon-primary\` |
| focus ring | \`--stroke-200\` \`--color-primary-primary\`, \`--space-025\` (2px) offset |
| overflow control | **IconButton** \`size="xs"\` \`intent="secondary"\` \`variant="ghost"\` |
| overflow menu | **Menu Container** surface + **Menu Item** rows |

## Accessibility

- The trail is a \`<nav>\` landmark with an accessible name (\`label\`, default
  "Breadcrumb"), so assistive tech users can jump straight to it.
- It's an ordered list (\`<ol>\`/\`<li>\`), which conveys both the sequence and the
  number of levels.
- The last crumb carries \`aria-current="page"\` and is **not** a link — it's
  where you already are.
- Separators are \`aria-hidden\` decoration, so the trail isn't read out as a
  string of chevrons.
- Links keep a visible \`:focus-visible\` ring and underline on hover — the
  accent color is never the only cue.
- The overflow menu is a Radix \`DropdownMenu\`, so it's fully keyboard
  operable (Enter/Space to open, arrows to move, Escape to close) and its
  trigger has an accessible name via \`IconButton\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Order crumbs root → current page. | Reverse the order or omit the current page. |
| Set \`maxItems\` on deep trails so they don't wrap awkwardly. | Let a 7-level trail run off the edge. |
| Keep crumb labels short — mirror the page titles. | Put full sentences in a crumb. |
| Use it to reflect **hierarchy**. | Use it as a history/back trail — that's not what it means. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    items: trail,
  },
  argTypes: {
    items: { control: false, table: { category: 'Content' } },
    maxItems: { control: 'number', table: { category: 'Behavior' } },
    itemsBeforeCollapse: {
      control: 'number',
      table: { category: 'Behavior', defaultValue: { summary: '1' } },
    },
    itemsAfterCollapse: {
      control: 'number',
      table: { category: 'Behavior', defaultValue: { summary: '2' } },
    },
    label: { control: 'text', table: { category: 'Accessibility' } },
    overflowLabel: { control: 'text', table: { category: 'Accessibility' } },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — edit the trail behavior from the Controls panel. */
export const Playground: Story = {};

export const Simple: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma `style=simple` — the whole trail inline. Every crumb links up ' +
          'the hierarchy except the last, which is the current page in the ' +
          'primary accent.',
      },
    },
  },
  render: () => <Breadcrumb items={trail} />,
};

export const Complex: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma `style=complex` — with `maxItems` set, the middle of the trail ' +
          'collapses behind a "…" control. Activating it opens a Radix ' +
          '`DropdownMenu` built from the hello pc **Menu Container** and **Menu ' +
          'Item** components, listing the hidden crumbs.',
      },
    },
  },
  render: () => <Breadcrumb items={longTrail} maxItems={4} />,
};

export const CollapseBoundaries: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`itemsBeforeCollapse` and `itemsAfterCollapse` decide how much of the ' +
          'trail stays visible around the overflow control.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Breadcrumb items={longTrail} maxItems={4} itemsBeforeCollapse={1} itemsAfterCollapse={2} />
      <Breadcrumb items={longTrail} maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={1} />
      <Breadcrumb items={longTrail} maxItems={4} itemsBeforeCollapse={1} itemsAfterCollapse={1} />
    </div>
  ),
};

export const NonNavigableCrumbs: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A crumb with neither `href` nor `onClick` renders as plain text — for ' +
          'a level that exists in the hierarchy but has no page of its own.',
      },
    },
  },
  render: () => (
    <Breadcrumb
      items={[
        { label: 'Products', href: '#products' },
        { label: 'Archived' },
        { label: 'ThinkPad X1' },
      ]}
    />
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: simple, collapsed, a two-crumb minimum, and a non-navigable ' +
          'level. Audit under both themes — the secondary crumbs, the accent ' +
          'current page, and the separator should all read cleanly.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Breadcrumb items={trail} />
      <Breadcrumb items={longTrail} maxItems={4} />
      <Breadcrumb items={[{ label: 'Home', href: '#home' }, { label: 'Settings' }]} />
      <Breadcrumb items={[{ label: 'Products', href: '#p' }, { label: 'Archived' }, { label: 'X1' }]} />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): the overflow menu opens and its
 *  hidden crumbs are actionable. */
const pick = fn();
export const OverflowMenuOpens: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Breadcrumb
      items={[
        { label: 'Products', href: '#products' },
        { label: 'Laptops', onClick: pick },
        { label: 'ThinkPad', onClick: pick },
        { label: 'X1 Carbon', href: '#x1' },
        { label: 'Specifications' },
      ]}
      maxItems={4}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    pick.mockClear();

    // the current page is marked, and the middle crumbs are hidden
    await expect(canvas.getByText('Specifications')).toHaveAttribute('aria-current', 'page');
    await expect(canvas.queryByText('Laptops')).toBeNull();

    // open the overflow menu — it portals, so query the whole screen
    await userEvent.click(canvas.getByRole('button', { name: 'Show hidden breadcrumbs' }));
    const item = await screen.findByRole('menuitem', { name: 'Laptops' });

    await userEvent.click(item);
    await expect(pick).toHaveBeenCalled();
  },
};
