import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Home, Settings, ShoppingBag } from 'lucide-react';

import { SidebarBlock } from './SidebarBlock';
import { SidebarItem } from './SidebarItem';
import { SidebarSubItem } from './SidebarSubItem';
import { Sidebar, SidebarList } from './Sidebar';

/** The rows are Radix Tabs triggers, so every example sits in a rail. */
const Rail = ({
  children,
  defaultValue = 'home',
}: {
  children: React.ReactNode;
  defaultValue?: string;
}) => (
  <Sidebar defaultValue={defaultValue}>
    <SidebarList aria-label="Main navigation" style={{ width: 268 }}>
      {children}
    </SidebarList>
  </Sidebar>
);

const meta = {
  title: 'Components/Sidebar/Sidebar Block',
  component: SidebarBlock,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A grouped sidebar section (Figma ".elements/sidebar_block", node 157:9049): a
parent **Sidebar Item** sitting full-bleed across the top of a tinted panel,
with its **Sidebar Sub-item**s stacked beneath.

Purely presentational — it groups rows and paints the surface. The rows keep
their own Radix \`Tabs.Trigger\` behavior, so the block still lives inside a
\`SidebarList\` and takes part in the same roving-focus rail. Nothing is
rebuilt here; the block composes the two row components directly.

The parent row goes in the \`item\` prop rather than being the first child,
because the two regions are laid out differently: the parent is full-bleed, the
sub-items sit in an inset panel.

## Usage

\`\`\`tsx
import {
  Sidebar, SidebarList, SidebarBlock, SidebarItem, SidebarSubItem,
} from '@/hellopc/components/Sidebar';

const [open, setOpen] = useState(true);

<Sidebar defaultValue="home">
  <SidebarList aria-label="Main navigation">
    <SidebarBlock
      item={
        <SidebarItem value="home" icon={<Home />} expanded={open} onExpandedChange={setOpen}>
          Home
        </SidebarItem>
      }
    >
      {open ? (
        <>
          <SidebarSubItem value="overview">Overview</SidebarSubItem>
          <SidebarSubItem value="activity">Activity</SidebarSubItem>
        </>
      ) : null}
    </SidebarBlock>
  </SidebarList>
</Sidebar>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| panel | \`--radius-200\` (12px), clipped |
| translucent surface | \`--color-surfaces-container-pop-windows\` |
| solid surface | \`--color-surfaces-container-pop-web\` |
| sub-item inset | \`--space-050\` (4px) translucent, \`--space-025\` (2px) solid |
| sub-item gap | \`--space-025\` (2px) |

Row-level tokens live on **Sidebar Item** and **Sidebar Sub-item**.

> ### Token gap worth fixing
>
> \`--color-surfaces-container-pop-web\` is defined in the **dark** and **win
> hct** themes but **not in \`light.a\`**. Used bare it resolves to nothing in the
> default theme, and the solid panel would come out transparent. Until the light
> value is added, \`surface="solid"\` falls back to
> \`--color-surfaces-on-container-high\` so it still reads as a surface. This is a
> gap to close in the token source, not a styling decision — Figma shows
> \`#f0f0f0\` for the light web surface.
>
> Separately, Figma's local value for the translucent surface is
> \`rgba(255,255,255,0.7)\` while the token is \`rgba(255,255,255,0.3)\`. The token
> wins here, since it's the system's source of truth — but the two should agree.

## Accessibility

- The block adds no semantics of its own: it's a styled \`<div>\` wrapping rows
  that are already tabs, so the \`tablist\` stays a flat list of tabs.
- Because the sub-items are ordinary tabs in the same rail, **Up/Down** arrows
  walk straight through the block — the grouping is visual, not a separate
  keyboard scope.
- Collapse by not rendering the sub-items (as in the examples) rather than
  hiding them with CSS, so collapsed rows aren't reachable by keyboard or
  announced by a screen reader.
- The parent row carries \`aria-expanded\` via \`SidebarItem\`'s \`expanded\` prop,
  so the disclosure state is exposed rather than implied by the chevron.

## Do / Don't

| Do | Don't |
| --- | --- |
| Put the parent row in \`item\` and the children in \`children\`. | Pass the parent row as a child — the regions are styled differently. |
| Unmount the sub-items when collapsed. | Hide them with \`display: none\` and leave them focusable. |
| Keep one block per navigable group. | Nest a block inside a block. |
| Pair \`expanded\` on the parent with rendering its children. | Show a chevron whose state doesn't match what's visible. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    surface: 'translucent',
  },
  argTypes: {
    item: { control: false, table: { category: 'Content' } },
    children: { control: false, table: { category: 'Content' } },
    surface: {
      control: 'inline-radio',
      options: ['translucent', 'solid'],
      table: { category: 'Appearance', defaultValue: { summary: 'translucent' } },
    },
  },
  render: (args) => (
    <Rail>
      <SidebarBlock
        {...args}
        item={
          <SidebarItem value="home" icon={<Home />} expanded>
            Home
          </SidebarItem>
        }
      >
        <SidebarSubItem value="overview">Sub-item</SidebarSubItem>
        <SidebarSubItem value="activity">Sub-item</SidebarSubItem>
        <SidebarSubItem value="archived" disabled>
          Sub-item
        </SidebarSubItem>
        <SidebarSubItem value="reports">Sub-item</SidebarSubItem>
      </SidebarBlock>
    </Rail>
  ),
} satisfies Meta<typeof SidebarBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — switch the surface treatment in the Controls panel. */
export const Playground: Story = {};

export const Surfaces: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma’s `platform` axis: `translucent` is the acrylic wash ' +
          '(`platform=windows`), `solid` the flat panel (`platform=web`). Note the ' +
          'solid panel is currently running on a fallback in the light theme — see ' +
          'the token gap above.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {(['translucent', 'solid'] as const).map((surface) => (
        <Rail key={surface} defaultValue="home">
          <SidebarBlock
            surface={surface}
            item={
              <SidebarItem value="home" icon={<Home />} expanded>
                Home
              </SidebarItem>
            }
          >
            <SidebarSubItem value={`${surface}-a`}>Sub-item</SidebarSubItem>
            <SidebarSubItem value={`${surface}-b`}>Sub-item</SidebarSubItem>
            <SidebarSubItem value={`${surface}-c`} disabled>
              Sub-item
            </SidebarSubItem>
          </SidebarBlock>
        </Rail>
      ))}
    </div>
  ),
};

export const Collapsing: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Drive the group from the parent row’s `expanded` prop and render the ' +
          'sub-items conditionally. Unmounting them (rather than hiding them) keeps ' +
          'collapsed rows out of the tab order and off screen readers.',
      },
    },
  },
  render: function Collapsible() {
    const [open, setOpen] = React.useState(true);
    return (
      <Rail>
        <SidebarBlock
          item={
            <SidebarItem value="home" icon={<Home />} expanded={open} onExpandedChange={setOpen}>
              Home
            </SidebarItem>
          }
        >
          {open ? (
            <>
              <SidebarSubItem value="overview">Overview</SidebarSubItem>
              <SidebarSubItem value="activity">Activity</SidebarSubItem>
            </>
          ) : null}
        </SidebarBlock>
      </Rail>
    );
  },
};

export const InANavigation: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Blocks sit alongside plain rows in one rail. Arrow keys walk straight ' +
          'through everything — the grouping is visual, not a separate keyboard ' +
          'scope.',
      },
    },
  },
  render: () => (
    <Rail defaultValue="overview">
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
    </Rail>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: both surfaces, expanded and collapsed, with a disabled and a ' +
          'selected sub-item. Audit under both themes — the translucent surface is ' +
          'an overlay, so it has to hold on either background.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {(['translucent', 'solid'] as const).map((surface) => (
        <div key={surface} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Rail defaultValue={`${surface}-sel`}>
            <SidebarBlock
              surface={surface}
              item={
                <SidebarItem value={`${surface}-home`} icon={<Home />} expanded>
                  Expanded
                </SidebarItem>
              }
            >
              <SidebarSubItem value={`${surface}-a`}>Sub-item</SidebarSubItem>
              <SidebarSubItem value={`${surface}-dis`} disabled>
                Disabled
              </SidebarSubItem>
              <SidebarSubItem value={`${surface}-sel`}>Selected</SidebarSubItem>
            </SidebarBlock>
          </Rail>
          <Rail defaultValue={`${surface}-c`}>
            <SidebarBlock
              surface={surface}
              item={
                <SidebarItem value={`${surface}-c`} icon={<Settings />} expanded={false}>
                  Collapsed
                </SidebarItem>
              }
            />
          </Rail>
        </div>
      ))}
    </div>
  ),
};

/** Pure interaction test (hidden from docs): the block groups rows without
 *  breaking the single rail they belong to. */
export const RowsStayOneRail: Story = {
  tags: ['!autodocs'],
  render: function Test() {
    const [open, setOpen] = React.useState(true);
    return (
      <Rail>
        <SidebarBlock
          item={
            <SidebarItem value="home" icon={<Home />} expanded={open} onExpandedChange={setOpen}>
              Home
            </SidebarItem>
          }
        >
          {open ? <SidebarSubItem value="overview">Overview</SidebarSubItem> : null}
        </SidebarBlock>
        <SidebarItem value="shop" icon={<ShoppingBag />}>
          Shop
        </SidebarItem>
      </Rail>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // one tablist across the block and the row outside it
    await expect(canvas.getAllByRole('tablist')).toHaveLength(1);
    await expect(canvas.getAllByRole('tab')).toHaveLength(3);

    // a sub-item inside the block selects like any other tab
    const overview = canvas.getByRole('tab', { name: 'Overview' });
    await userEvent.click(overview);
    await expect(overview).toHaveAttribute('aria-selected', 'true');

    // collapsing unmounts it rather than hiding it
    await userEvent.click(canvas.getByRole('tab', { name: 'Home' }));
    await expect(canvas.queryByRole('tab', { name: 'Overview' })).toBeNull();
  },
};
