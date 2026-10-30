import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Boxes, Home, LifeBuoy, Settings, ShoppingBag, Sparkles } from 'lucide-react';

import { SidebarNav } from './SidebarNav';
import { Sidebar, SidebarContent } from './Sidebar';
import { SidebarItem } from './SidebarItem';
import { SidebarSubItem } from './SidebarSubItem';
import { SidebarBlock } from './SidebarBlock';
import { SidebarSectionHeader, SidebarDivider } from './SidebarSection';

const Mark = () => (
  <span
    style={{
      display: 'block',
      width: '100%',
      height: '100%',
      borderRadius: 8,
      background: 'linear-gradient(-45deg, #5066ff 23%, #3b92f9 50%, #75adfd 77%)',
    }}
  />
);

/** Rows shared by the examples. */
const rows = (expanded: boolean, setExpanded: (v: boolean) => void) => (
  <>
    <SidebarBlock
      item={
        <SidebarItem value="home" icon={<Home />} expanded={expanded} onExpandedChange={setExpanded}>
          Home
        </SidebarItem>
      }
    >
      {expanded ? (
        <>
          <SidebarSubItem value="overview">Overview</SidebarSubItem>
          <SidebarSubItem value="activity">Activity</SidebarSubItem>
        </>
      ) : null}
    </SidebarBlock>
    <SidebarItem value="shop" icon={<ShoppingBag />}>
      Shop
    </SidebarItem>
    <SidebarItem value="devices" icon={<Boxes />}>
      Devices
    </SidebarItem>
    <SidebarDivider />
    <SidebarSectionHeader>Features</SidebarSectionHeader>
    <SidebarItem value="whats-new" icon={<Sparkles />}>
      What&apos;s new
    </SidebarItem>
    <SidebarItem value="support" icon={<LifeBuoy />}>
      Support
    </SidebarItem>
    <SidebarItem value="settings" icon={<Settings />}>
      Settings
    </SidebarItem>
  </>
);

const meta = {
  title: 'Components/Sidebar/Sidebar Nav',
  component: SidebarNav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The app sidebar shell (Figma "Sidebar", node 160:9393): a brand header, the
navigation rail, and a footer holding the collapse toggle and the signed-in
user. This is the assembled component the sidebar rows were built for.

It **composes** rather than rebuilds: the rail is \`SidebarList\` (so the rows
keep their Radix Tabs behavior), the footer rule is \`SidebarDivider\`, the user
avatar is the hello pc **Avatar**, and every control is an **IconButton**. Rows go
in as children.

Figma's two axes map to props: \`collapsed\` toggles the 280px rail down to an
80px icon rail, and \`surface\` covers the \`platform\` axis — \`solid\` is the
opaque web panel with a right-hand edge, \`translucent\` the windows rail that
sits on whatever is behind it.

It goes inside \`Sidebar\` (the Tabs root) so panels can sit beside it.

## Usage

\`\`\`tsx
import {
  Sidebar, SidebarNav, SidebarContent,
  SidebarItem, SidebarSubItem, SidebarBlock,
  SidebarSectionHeader, SidebarDivider,
} from '@/hellopc/components/Sidebar';

const [collapsed, setCollapsed] = useState(false);

<Sidebar defaultValue="home">
  <SidebarNav
    aria-label="Main navigation"
    logo={<AppMark />}
    productName="Lenovo"
    appName="Appname"
    collapsed={collapsed}
    onCollapsedChange={setCollapsed}
    user={{ name: 'Jane Doe', onAction: openAccountMenu }}
  >
    <SidebarItem value="home" icon={<Home />}>Home</SidebarItem>
    <SidebarDivider />
    <SidebarSectionHeader>Features</SidebarSectionHeader>
    <SidebarItem value="settings" icon={<Settings />}>Settings</SidebarItem>
  </SidebarNav>

  <SidebarContent value="home">…</SidebarContent>
</Sidebar>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| rail padding | \`--space-500\` top, \`--space-200\` sides + bottom |
| row gap | \`--space-050\` (4px) |
| brand↔rail gap | \`--space-500\` (24px) |
| brand row | 40px tall, 32px logo, \`--space-300\` gap (\`--space-150\` collapsed) |
| brand text | \`--type-size-subtitle\` (18px), −0.4px tracking, \`--color-text-icon-primary\`; product name regular over a bold app name |
| solid surface | \`--color-surfaces-container\` + \`--stroke-100\` \`--color-stroke-border\` right edge |
| footer rows | \`--space-200\` block / \`--space-300\` inline |
| user name | \`--type-size-caption\` (12px), \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| collapse toggle / user action | **IconButton** \`size="sm"\` \`intent="secondary"\` \`variant="ghost"\` |
| user avatar | **Avatar** \`size="sm"\` (32px) |

The 280/80px widths and the 40px brand row are intrinsic geometry from Figma
160:9394.

> **Correction worth noting.** The rail's spacing was originally taken from the
> sidebar *block*'s sub-item container (2px gap, 4px padding). This node shows
> the top-level rail is **4px gap with no padding of its own** — the inset comes
> from this shell. \`SidebarList\` was corrected to match.

## Collapsing

Collapsing is more than a width change, and the rows need to know about it — so
\`SidebarNav\` publishes the state on context rather than requiring you to thread
a prop through every child:

- **Row labels go visually hidden**, not removed. The icon centres and the label
  stays in the accessibility tree, so a screen-reader user still hears "Shop".
  (Previously the label merely got *clipped* by the 80px rail — that looked
  right by accident and would have broken if the width ever changed.)
- **Section headers become rules.** Figma's collapsed variants render a divider
  in that slot instead of the label (node 160:9430 in place of 160:9458): an
  80px rail has no room for a word, and a truncated "Feat…" is worse than a
  clean separator.
- **Disclosure chevrons disappear**, since there's no room for one and the
  group's sub-items aren't shown anyway.

## Overflow

The rail scrolls when the rows outgrow it, so a long nav never overruns the
footer. It uses the hello pc **Scrollbar** element — the rail is an ordinary div we
own, so nothing stops it hosting a ScrollArea (unlike **Modal** or a Select
viewport, where Radix owns the scroll container and the shared
\`nativeScrollbarStyles\` are used instead).

No \`maxHeight\` is needed: as a flex item with \`flex: 1; min-height: 0\` the
scroll root takes a definite height from the flex layout, which the viewport's
\`height: 100%\` resolves against.

Radix positions ScrollArea scrollbars **absolutely over** the viewport, so
nothing reserves space for them by default and rows would run underneath. The
row list carries a \`--space-200\` right inset — the bar's full track (4px thumb
plus a 4px inset each side) — so the two never overlap.

## Accessibility

- The shell is a \`<nav>\` landmark; pass \`aria-label\` so it's a named region
  users can jump to. That label is forwarded to the \`tablist\` inside.
- The rows keep their tabs behavior: **Up/Down** arrows move between them,
  **Home/End** jump to the ends, and only the selected row is in the tab order.
- The collapse toggle is a real \`IconButton\` whose accessible name **changes
  with state** ("Collapse sidebar" ↔ "Expand sidebar"), so it's never a mystery
  control.
- Collapsing hides the labels visually, but each row keeps its accessible name
  in the tree — a screen-reader user loses nothing. Sighted users of an
  icon-only rail rely on recognisable icons, so give every row one.
- The logo is \`aria-hidden\`; the brand text carries the name.
- The footer rule is decorative and hidden from assistive tech.

## Do / Don't

| Do | Don't |
| --- | --- |
| Give every row an icon — they're all that survives collapsing. | Ship icon-less rows in a rail that can collapse. |
| Pass \`aria-label\` so the landmark and tablist are named. | Leave the nav unnamed. |
| Use \`surface="solid"\` when the rail sits on a page. | Use \`translucent\` over content with no backdrop behind it. |
| Keep the row list short enough to scan without scrolling. | Stack twenty rows and rely on scrolling. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    'aria-label': 'Main navigation',
    productName: 'Lenovo',
    appName: 'Appname',
    collapsed: false,
    surface: 'solid',
  },
  argTypes: {
    children: { control: false, table: { category: 'Content' } },
    logo: { control: false, table: { category: 'Content' } },
    productName: { control: 'text', table: { category: 'Content' } },
    appName: { control: 'text', table: { category: 'Content' } },
    user: { control: false, table: { category: 'Content' } },
    collapsed: { control: 'boolean', table: { category: 'State' } },
    surface: {
      control: 'inline-radio',
      options: ['translucent', 'solid'],
      table: { category: 'Appearance', defaultValue: { summary: 'translucent' } },
    },
    'aria-label': { control: 'text', table: { category: 'Accessibility' } },
  },
  render: function Render(args) {
    const [collapsed, setCollapsed] = React.useState(Boolean(args.collapsed));
    const [group, setGroup] = React.useState(true);
    React.useEffect(() => setCollapsed(Boolean(args.collapsed)), [args.collapsed]);

    return (
      <div style={{ display: 'flex', height: 620, background: 'var(--color-surfaces-on-container-high)' }}>
        <Sidebar defaultValue="home">
          <SidebarNav
            {...args}
            logo={<Mark />}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            user={{ name: 'Jane Doe', onAction: fn() }}
          >
            {rows(group && !collapsed, setGroup)}
          </SidebarNav>
          {['home', 'overview', 'activity', 'shop', 'devices', 'whats-new', 'support', 'settings'].map(
            (v) => (
              <SidebarContent key={v} value={v} style={{ padding: 24 }}>
                Panel content for {v}.
              </SidebarContent>
            ),
          )}
        </Sidebar>
      </div>
    );
  },
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — toggle `collapsed` and `surface` from the Controls
 *  panel, or use the rail's own collapse button. */
export const Playground: Story = {};

export const Collapsed: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The 80px icon rail. The brand text and row labels drop away, the logo ' +
          'centres, and the footer shows just the avatar — but every row keeps its ' +
          'accessible name, so nothing is lost to a screen reader.',
      },
    },
  },
  args: { collapsed: true },
};

export const Overflowing: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A rail with more rows than fit. The row list scrolls and the footer ' +
          'stays put — previously the rows overran it and the collapse control ' +
          'ended up sitting in the middle of the list.',
      },
    },
  },
  render: function Overflow() {
    const items = [
      ['home', 'Home', <Home key="h" />],
      ['shop', 'Shop', <ShoppingBag key="s" />],
      ['devices', 'Devices', <Boxes key="d" />],
      ['whats-new', "What's new", <Sparkles key="w" />],
      ['support', 'Support', <LifeBuoy key="l" />],
      ['settings', 'Settings', <Settings key="g" />],
    ] as const;
    return (
      <div style={{ display: 'flex', height: 420 }}>
        <Sidebar defaultValue="home">
          <SidebarNav
            aria-label="Main navigation"
            surface="solid"
            logo={<Mark />}
            productName="Lenovo"
            appName="Appname"
            onCollapsedChange={fn()}
            user={{ name: 'Jane Doe', onAction: fn() }}
          >
            {[0, 1, 2].map((pass) =>
              items.map(([value, label, icon]) => (
                <SidebarItem key={`${pass}-${value}`} value={`${pass}-${value}`} icon={icon}>
                  {label}
                </SidebarItem>
              )),
            )}
          </SidebarNav>
        </Sidebar>
      </div>
    );
  },
};

export const Surfaces: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma’s `platform` axis. `solid` is the opaque web panel with a ' +
          'right-hand edge; `translucent` is the windows rail, which takes its ' +
          'background from whatever sits behind it.',
      },
    },
  },
  render: function Surfaces() {
    const [group, setGroup] = React.useState(true);
    return (
      <div style={{ display: 'flex', height: 560 }}>
        {(['solid', 'translucent'] as const).map((surface) => (
          <div
            key={surface}
            style={{
              display: 'flex',
              background:
                surface === 'translucent'
                  ? 'linear-gradient(135deg, #dbe4ff, #f5f0ff)'
                  : 'var(--color-surfaces-on-container-high)',
            }}
          >
            <Sidebar defaultValue="home">
              <SidebarNav
                aria-label={`Main navigation (${surface})`}
                surface={surface}
                logo={<Mark />}
                productName="Lenovo"
                appName="Appname"
                user={{ name: 'Jane Doe' }}
              >
                {rows(group, setGroup)}
              </SidebarNav>
            </Sidebar>
          </div>
        ))}
      </div>
    );
  },
};

export const WithoutFooterControls: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The collapse toggle renders only when `onCollapsedChange` is supplied, ' +
          'and the user row only when `user` is. A rail that can’t collapse ' +
          'shouldn’t show a control that does nothing.',
      },
    },
  },
  render: function NoFooter() {
    const [group, setGroup] = React.useState(true);
    return (
      <div style={{ display: 'flex', height: 520 }}>
        <Sidebar defaultValue="home">
          <SidebarNav aria-label="Main navigation" surface="solid" logo={<Mark />} appName="Appname">
            {rows(group, setGroup)}
          </SidebarNav>
        </Sidebar>
      </div>
    );
  },
};

/** Pure interaction test (hidden from docs): collapsing keeps row names, and
 *  the toggle renames itself. */
export const CollapseKeepsAccessibleNames: Story = {
  tags: ['!autodocs'],
  render: function Test() {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <div style={{ display: 'flex', height: 520 }}>
        <Sidebar defaultValue="shop">
          <SidebarNav
            aria-label="Main navigation"
            surface="solid"
            logo={<Mark />}
            appName="Appname"
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            user={{ name: 'Jane Doe' }}
          >
            <SidebarItem value="shop" icon={<ShoppingBag />}>
              Shop
            </SidebarItem>
            <SidebarItem value="settings" icon={<Settings />}>
              Settings
            </SidebarItem>
          </SidebarNav>
        </Sidebar>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // the nav landmark and the tablist inside it are both named
    await expect(canvas.getByRole('navigation')).toHaveAccessibleName('Main navigation');
    await expect(canvas.getByRole('tablist')).toHaveAccessibleName('Main navigation');

    await userEvent.click(canvas.getByRole('button', { name: 'Collapse sidebar' }));

    // the toggle renames itself, and the rows keep their accessible names
    await expect(canvas.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
    await expect(canvas.getByRole('tab', { name: 'Shop' })).toBeInTheDocument();
    await expect(canvas.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
  },
};
