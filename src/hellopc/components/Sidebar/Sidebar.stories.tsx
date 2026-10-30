import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Home, Settings, ShoppingBag } from 'lucide-react';

import { Sidebar, SidebarList, SidebarContent } from './Sidebar';
import { SidebarItem } from './SidebarItem';
import { SidebarSubItem } from './SidebarSubItem';
import { SidebarBlock } from './SidebarBlock';

const Panel = ({ title }: { title: string }) => (
  <div
    style={{
      padding: 'var(--space-300)',
      borderRadius: 'var(--radius-300)',
      background: 'var(--color-surfaces-on-container-high)',
      minWidth: 240,
      fontFamily: 'var(--font-family)',
      fontSize: 'var(--type-size-body)',
    }}
  >
    Panel content for {title}.
  </div>
);

const meta = {
  title: 'Components/Sidebar/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The container for a sidebar rail and its panels.

A thin wrapper over Radix \`Tabs\` with \`orientation="vertical"\`, which supplies
roving focus on **Up/Down** (Home/End to jump), the \`tablist\` / \`tab\` /
\`tabpanel\` roles, \`aria-selected\`, and the trigger↔panel wiring. **Sidebar
Item**, **Sidebar Sub-item**, and **Sidebar Block** go inside \`SidebarList\`.

| Export | Radix part | Role |
| --- | --- | --- |
| \`Sidebar\` | \`Tabs.Root\` | Owns selection; pins vertical orientation |
| \`SidebarList\` | \`Tabs.List\` | The rail (\`role="tablist"\`) |
| \`SidebarContent\` | \`Tabs.Content\` | A panel (\`role="tabpanel"\`) |

**Why this exists.** The sidebar rows are Radix \`Tabs.Trigger\`s, which throw
without a Tabs context. That context used to come from \`VerticalTabs\`, so a
sidebar needed an import from an unrelated family. This container provides it
from the sidebar family instead — a sidebar is now built entirely from Sidebar
imports.

> ### Is a sidebar really tabs?
>
> This models the sidebar as an **in-page view switcher**, which is what tabs
> semantics describe: one region swapping between panels.
>
> If your rows **change the URL**, tabs are the wrong pattern — navigation
> should be a \`<nav>\` of links marked \`aria-current="page"\` (what **Breadcrumb**
> and **Pagination** do). Tabs would announce "tab" instead of a link and point
> \`aria-controls\` at panels that may not exist. Worth deciding deliberately
> rather than inheriting.

The rail's spacing comes from the assembled sidebar (node 160:9406): rows are
stacked with a \`--space-050\` (4px) gap and the rail carries **no padding of its
own** — the inset comes from whatever wraps it, normally \`SidebarNav\`.

**Scrolling.** \`SidebarList\` doesn't scroll by itself; it grows to fit its rows.
\`SidebarNav\` wraps it in the hello pc **Scrollbar** element so a long rail scrolls
instead of overrunning the footer. Using \`SidebarList\` bare, cap and scroll it
yourself — the simplest way is the same \`Scrollbar\` element:

\`\`\`tsx
<Scrollbar maxHeight={480}>
  <SidebarList aria-label="Main navigation">…</SidebarList>
</Scrollbar>
\`\`\`

Note that Radix positions ScrollArea scrollbars **absolutely over** the
viewport, so reserve the bar's track (\`--space-200\`) on the row list or the rows
will run underneath it.

## Usage

\`\`\`tsx
import {
  Sidebar, SidebarList, SidebarContent, SidebarItem, SidebarSubItem, SidebarBlock,
} from '@/hellopc/components/Sidebar';

<Sidebar defaultValue="home">
  <SidebarList aria-label="Main navigation">
    <SidebarItem value="home" icon={<Home />}>Home</SidebarItem>
    <SidebarItem value="shop" icon={<ShoppingBag />}>Shop</SidebarItem>
  </SidebarList>

  <SidebarContent value="home">…</SidebarContent>
  <SidebarContent value="shop">…</SidebarContent>
</Sidebar>

// controlled, deferring selection until Enter/Space
<Sidebar value={section} onValueChange={setSection} activationMode="manual">…</Sidebar>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| root layout | \`display: flex\`, \`--space-500\` (24px) rail↔panel gap |
| rail | column, \`--space-050\` (4px) between rows, no padding of its own |
| panel | \`--type-size-body\`, \`--color-text-icon-primary\` |
| panel focus ring | \`--stroke-200\` \`--color-primary-primary\` at \`--space-025\` offset |

Row-level tokens live on the row components.

## Accessibility

- Radix supplies the full tabs pattern: \`tablist\`/\`tab\`/\`tabpanel\`,
  \`aria-selected\`, and \`aria-controls\`↔\`aria-labelledby\` between row and panel.
- **Up/Down** move between rows, **Home/End** jump to the ends. Only the
  selected row is in the tab order, so Tab moves into the panel.
- Always pass \`aria-label\` to \`SidebarList\` — an unnamed rail tells a
  screen-reader user nothing about what it navigates.
- Panels are focusable so keyboard users can reach content with no focusable
  children of its own.
- Prefer \`activationMode="manual"\` when selecting a row triggers an expensive
  fetch, so arrow-key browsing doesn't fire one per row.

## Do / Don't

| Do | Don't |
| --- | --- |
| Name the rail with \`aria-label\`. | Ship an unnamed tablist. |
| Give every row a matching \`SidebarContent\`. | Leave a row pointing at no panel. |
| Use it when rows swap a panel in place. | Use it for route navigation — use links. |
| Unmount collapsed sub-items. | Hide them with CSS and leave them focusable. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    defaultValue: 'home',
  },
  argTypes: {
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: 'text', table: { category: 'State' } },
    activationMode: {
      control: 'inline-radio',
      options: ['automatic', 'manual'],
      table: { category: 'Behavior', defaultValue: { summary: 'automatic' } },
    },
    onValueChange: { action: 'section change', table: { category: 'Events' } },
    children: { control: false, table: { category: 'Content' } },
  },
  render: (args) => (
    <Sidebar {...args}>
      <SidebarList aria-label="Main navigation" style={{ width: 268 }}>
        <SidebarBlock
          item={
            <SidebarItem value="home" icon={<Home />} expanded>
              Home
            </SidebarItem>
          }
        >
          <SidebarSubItem value="overview">Overview</SidebarSubItem>
          <SidebarSubItem value="activity">Activity</SidebarSubItem>
        </SidebarBlock>
        <SidebarItem value="shop" icon={<ShoppingBag />}>
          Shop
        </SidebarItem>
        <SidebarItem value="settings" icon={<Settings />}>
          Settings
        </SidebarItem>
      </SidebarList>

      {['home', 'overview', 'activity', 'shop', 'settings'].map((v) => (
        <SidebarContent key={v} value={v}>
          <Panel title={v} />
        </SidebarContent>
      ))}
    </Sidebar>
  ),
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — a full rail with a block, plain rows, and panels. */
export const Playground: Story = {};

export const ManualActivation: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With `activationMode="manual"`, arrow keys move focus without selecting ' +
          '— the user confirms with Enter or Space. Use it when switching rows ' +
          'kicks off an expensive fetch.',
      },
    },
  },
  render: () => (
    <Sidebar defaultValue="home" activationMode="manual">
      <SidebarList aria-label="Main navigation" style={{ width: 268 }}>
        <SidebarItem value="home" icon={<Home />}>
          Home
        </SidebarItem>
        <SidebarItem value="shop" icon={<ShoppingBag />}>
          Shop
        </SidebarItem>
      </SidebarList>
      <SidebarContent value="home">
        <Panel title="home" />
      </SidebarContent>
      <SidebarContent value="shop">
        <Panel title="shop" />
      </SidebarContent>
    </Sidebar>
  ),
};

/** Pure interaction test (hidden from docs): the rail swaps panels and is named. */
export const SwitchingRowsSwapsPanels: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('home');

    await userEvent.click(canvas.getByRole('tab', { name: 'Shop' }));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('shop');

    await expect(canvas.getByRole('tablist')).toHaveAccessibleName('Main navigation');
  },
};
