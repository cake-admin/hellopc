import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { type ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Home, Settings, ShoppingBag, User } from 'lucide-react';

import { SidebarItem } from './SidebarItem';
import { SidebarSubItem } from './SidebarSubItem';
import { Sidebar, SidebarList } from './Sidebar';

/** Triggers need Radix Tabs context, so every example sits in a rail. */
const Rail = ({
  children,
  defaultValue = 'home',
}: {
  children: ReactNode;
  defaultValue?: string;
}) => (
  <Sidebar defaultValue={defaultValue}>
    <SidebarList aria-label="Sidebar" style={{ width: 268 }}>
      {children}
    </SidebarList>
  </Sidebar>
);

const meta = {
  title: 'Components/Sidebar/Sidebar Item',
  component: SidebarItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A top-level row in an app sidebar (Figma ".elements/sidebar_item", node
156:8735) — taller than a vertical tab row, with a leading icon and an optional
disclosure chevron.

A Radix \`Tabs.Trigger\`, so selection, roving **Up/Down** focus, and the
\`role="tab"\` / \`aria-selected\` / panel wiring come from the primitive. Figma's
\`status\` axis is Radix's \`data-state\`; its \`state\` axis
(default/hover/press/disabled) is CSS pseudo-classes plus \`disabled\`.

**Not a variant of \`VerticalTabItem\`** — the two differ in nearly every
dimension, so they're separate components that happen to share a rail:

| | Vertical Tab Item | Sidebar Item |
| --- | --- | --- |
| row / radius | 32px, \`--radius-150\` | 48px, \`--radius-200\` |
| leading icon | none | 24px |
| trailing control | none | optional chevron |
| selected fill | \`--color-tonal-tonal-overlay\` | \`--color-tonal-tonal-lightest\` |
| selected label | \`--color-primary-primary\` | \`--color-text-icon-on-tonal\` |
| indicator | 4×16px | 4×32px |

> **Requires context.** Must be rendered inside \`SidebarList\` within
> \`Sidebar\`.

### In a collapsed rail

Inside a collapsed \`SidebarNav\` the row reshapes itself — it reads the collapsed
state from context, so there's no prop to pass:

- The **icon centres** and the label goes *visually hidden* rather than being
  removed, so it stays in the accessibility tree and a screen-reader user still
  hears the row's name. (It used to merely be clipped by the 80px rail, which
  looked right by accident and would have broken if the width changed.)
- The **disclosure chevron is dropped** — there's no room for it, and the
  group's sub-items aren't shown in a collapsed rail anyway.

Since the label is invisible in that state, **give every row an icon**: it's the
only thing a sighted user has to go on.

## Usage

\`\`\`tsx
import {
  Sidebar, SidebarList, SidebarContent, SidebarItem, SidebarSubItem,
} from '@/hellopc/components/Sidebar';

<Sidebar defaultValue="home">
  <SidebarList aria-label="Main navigation">
    <SidebarItem value="home" icon={<Home />}>Home</SidebarItem>

    {/* a row that owns children takes \`expanded\` */}
    <SidebarItem value="shop" icon={<ShoppingBag />} expanded={open} onExpandedChange={setOpen}>
      Shop
    </SidebarItem>
    {open ? <SidebarSubItem value="deals">Deals</SidebarSubItem> : null}
  </SidebarList>

  <SidebarContent value="home">…</SidebarContent>
</Sidebar>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| row | 48px (40px content + \`--space-050\` block padding), \`--radius-200\` (12px), \`--space-300\` inline |
| content gap | \`--space-300\` (16px) |
| label | \`--type-size-body\` (14px), 0.1px tracking; \`--font-weight-medium\`, \`--font-weight-bold\` when selected |
| label / icon color | \`--color-text-icon-primary\`; selected \`--color-text-icon-on-tonal\`; disabled \`--color-disabled-disabled-inverse\` |
| selected fill | \`--color-tonal-tonal-lightest\` → hover \`--color-tonal-tonal-overlay-hover\` → press \`--color-tonal-tonal-overlay-press\` |
| unselected fill | transparent → hover \`--color-tonal-tonal-secondary-overlay-hover\` → press \`--color-tonal-tonal-secondary-overlay-press\` |
| indicator | 4×32px, \`--color-text-icon-on-tonal\`, \`--radius-1000\` |
| focus ring | \`--stroke-200\` \`--color-primary-primary\`, inset |

The 48px row, 24px icon, and 4×32px indicator are intrinsic geometry from Figma
156:8736. Following Figma, a **disabled row keeps neither the fill nor the
indicator** even when it's the selected tab. The leading icon inherits
\`currentColor\`, so it turns on-tonal along with the label.

Two things worth knowing:

- **The chevron is optional here, though Figma draws it on every variant.** It's
  a disclosure control, so it appears only when you pass \`expanded\` — a row with
  no children shouldn't advertise one. Figma's specimen simply always has
  children.
- **The chevron is drawn inside the trigger, not as its own button.** A button
  can't nest inside a button, and \`Tabs.Trigger\` is a button — so the row itself
  both selects and toggles, and \`aria-expanded\` says so.

## Accessibility

- Radix supplies the \`tablist\`/\`tab\`/\`tabpanel\` roles and \`aria-selected\`, and
  links each row to its panel.
- **Up/Down** arrows move between rows, **Home/End** jump to the ends. Only the
  selected row is in the tab order; Tab moves on to the panel.
- Selection is never color-only — the selected row also goes bold and gains the
  leading indicator (WCAG 1.4.1).
- The leading icon is \`aria-hidden\`; the label carries the accessible name.
- A collapsible row carries \`aria-expanded\`, so activating it announces that it
  also opens or closes its group.
- Always give \`SidebarList\` an \`aria-label\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Give each row a recognisable leading icon. | Mix icon and icon-less rows in one rail. |
| Pass \`expanded\` only on rows that own sub-items. | Show a chevron on a row with no children. |
| Use \`SidebarSubItem\` for the nested level. | Indent a \`SidebarItem\` by hand to fake nesting. |
| Keep labels short so they don't truncate. | Rely on the ellipsis to hide long labels. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    value: 'home',
    children: 'Home',
    disabled: false,
  },
  argTypes: {
    value: { control: 'text', table: { category: 'Content' } },
    children: { control: 'text', table: { category: 'Content' } },
    icon: { control: false, table: { category: 'Content' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    expanded: { control: 'boolean', table: { category: 'State' } },
  },
  decorators: [
    (Story) => (
      <Sidebar defaultValue="home">
        <SidebarList aria-label="Sidebar" style={{ width: 268 }}>
          {Story()}
        </SidebarList>
      </Sidebar>
    ),
  ],
} satisfies Meta<typeof SidebarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — the row renders selected because its `value`
 *  matches the rail's `defaultValue`. */
export const Playground: Story = {
  args: { icon: <Home /> },
};

export const Status: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma’s `status` axis, which is Radix `data-state` here. The selected ' +
          'row takes the tonal/lightest fill, the bold on-tonal label and icon, ' +
          'and the 4×32px leading indicator.',
      },
    },
  },
  decorators: [],
  render: () => (
    <Rail>
      <SidebarItem value="home" icon={<Home />}>
        Home (selected)
      </SidebarItem>
      <SidebarItem value="shop" icon={<ShoppingBag />}>
        Shop
      </SidebarItem>
      <SidebarItem value="account" icon={<User />}>
        Account
      </SidebarItem>
    </Rail>
  ),
};

export const Collapsible: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Pass `expanded` to a row that owns sub-items and it grows the trailing ' +
          'chevron plus `aria-expanded`. Activating the row selects it **and** ' +
          'toggles its group.',
      },
    },
  },
  decorators: [],
  render: function CollapsibleRow() {
    const [open, setOpen] = React.useState(true);
    return (
      <Rail defaultValue="shop">
        <SidebarItem value="home" icon={<Home />}>
          Home
        </SidebarItem>
        <SidebarItem
          value="shop"
          icon={<ShoppingBag />}
          expanded={open}
          onExpandedChange={setOpen}
        >
          Shop
        </SidebarItem>
        {open ? (
          <>
            <SidebarSubItem value="deals">Deals</SidebarSubItem>
            <SidebarSubItem value="new">New arrivals</SidebarSubItem>
          </>
        ) : null}
        <SidebarItem value="settings" icon={<Settings />}>
          Settings
        </SidebarItem>
      </Rail>
    );
  },
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A disabled row is skipped by arrow-key navigation. Per Figma it keeps ' +
          '**neither** the fill nor the indicator even when it is the selected ' +
          'row — shown second.',
      },
    },
  },
  decorators: [],
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <Rail>
        <SidebarItem value="home" icon={<Home />}>
          Home
        </SidebarItem>
        <SidebarItem value="archived" icon={<ShoppingBag />} disabled>
          Archived
        </SidebarItem>
      </Rail>
      <Rail defaultValue="archived">
        <SidebarItem value="home" icon={<Home />}>
          Home
        </SidebarItem>
        <SidebarItem value="archived" icon={<ShoppingBag />} disabled>
          Disabled + selected
        </SidebarItem>
      </Rail>
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: selected, unselected, collapsible, disabled, and ' +
          'disabled+selected. Hover and press each row, and audit under both ' +
          'themes — the tonal fills are translucent, so they must hold on either ' +
          'surface.',
      },
    },
  },
  decorators: [],
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <Rail>
        <SidebarItem value="home" icon={<Home />}>
          Selected
        </SidebarItem>
        <SidebarItem value="b" icon={<ShoppingBag />}>
          Not selected
        </SidebarItem>
        <SidebarItem value="c" icon={<Settings />} expanded={false}>
          Collapsible
        </SidebarItem>
        <SidebarItem value="d" icon={<User />} disabled>
          Disabled
        </SidebarItem>
      </Rail>
      <Rail defaultValue="d">
        <SidebarItem value="b" icon={<ShoppingBag />}>
          Not selected
        </SidebarItem>
        <SidebarItem value="d" icon={<User />} disabled>
          Disabled + selected
        </SidebarItem>
      </Rail>
    </div>
  ),
};

/** Pure interaction test (hidden from docs): selection, arrow keys, and the
 *  disclosure state. */
export const SelectionAndDisclosure: Story = {
  tags: ['!autodocs'],
  decorators: [],
  render: function Test() {
    const [open, setOpen] = React.useState(false);
    return (
      <Rail>
        <SidebarItem value="home" icon={<Home />}>
          Home
        </SidebarItem>
        <SidebarItem value="shop" icon={<ShoppingBag />} expanded={open} onExpandedChange={setOpen}>
          Shop
        </SidebarItem>
        {open ? <SidebarSubItem value="deals">Deals</SidebarSubItem> : null}
      </Rail>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const home = canvas.getByRole('tab', { name: 'Home' });
    const shop = canvas.getByRole('tab', { name: 'Shop' });

    await expect(home).toHaveAttribute('aria-selected', 'true');
    await expect(shop).toHaveAttribute('aria-expanded', 'false');

    // activating the collapsible row selects it and opens its group
    await userEvent.click(shop);
    await expect(shop).toHaveAttribute('aria-selected', 'true');
    await expect(shop).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('tab', { name: 'Deals' })).toBeInTheDocument();

    // vertical orientation: ArrowUp steps back to the previous row
    shop.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(home).toHaveAttribute('aria-selected', 'true');
  },
};
