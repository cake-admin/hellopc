import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Home, ShoppingBag } from 'lucide-react';

import { SidebarSubItem } from './SidebarSubItem';
import { SidebarItem } from './SidebarItem';
import { Sidebar, SidebarList } from './Sidebar';

/** Triggers need Radix Tabs context, so every example sits in a rail. */
const Rail = ({
  children,
  defaultValue = 'deals',
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
  title: 'Components/Sidebar/Sidebar Sub-item',
  component: SidebarSubItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A nested row beneath a **Sidebar Item** (Figma ".elements/sidebar_item"
sub-item, node 156:8794) — the second level of an app sidebar.

The **same primitive** as the parent row (a Radix \`Tabs.Trigger\`), so it's a
peer in the same roving-focus rail rather than a separate widget: arrow keys walk
parents and children in one sequence, and one row across the rail is selected at
a time.

Differences from the parent row, all from Figma:

1. It indents past the parent's icon column so the labels line up.
2. No leading icon, no indicator, no chevron — the indent carries the nesting.
3. Selected-at-rest carries **no fill**, just the bold on-tonal label.
4. Disabled paints a solid \`--color-disabled-disabled\` fill, where the parent
   row stays transparent.

> **Worth a designer's eye:** #4 is a real inconsistency between the two Figma
> components, not a decision made here — the same one the vertical tab rows
> have. Implemented faithfully rather than quietly normalised.

> **Requires context.** Must be rendered inside \`SidebarList\` within
> \`Sidebar\`.

## Usage

\`\`\`tsx
import {
  Sidebar, SidebarList, SidebarItem, SidebarSubItem,
} from '@/hellopc/components/Sidebar';

<Sidebar defaultValue="deals">
  <SidebarList aria-label="Main navigation">
    <SidebarItem value="shop" icon={<ShoppingBag />} expanded={open} onExpandedChange={setOpen}>
      Shop
    </SidebarItem>
    {open ? (
      <>
        <SidebarSubItem value="deals">Deals</SidebarSubItem>
        <SidebarSubItem value="new">New arrivals</SidebarSubItem>
      </>
    ) : null}
  </SidebarList>
</Sidebar>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| row | \`--radius-150\` (8px); \`--space-200\` (12px) block, \`--space-300\` (16px) trailing |
| leading inset | \`calc(--space-300 * 2 + 24px)\` = 56px — the parent's padding + icon + gap |
| label | \`--type-size-body\` (14px), 0.1px tracking; \`--font-weight-medium\`, \`--font-weight-bold\` when selected |
| label color | \`--color-text-icon-primary\`; selected \`--color-text-icon-on-tonal\`; disabled \`--color-disabled-disabled-inverse\` |
| selected fill | none at rest → hover \`--color-tonal-tonal-overlay-hover\` → press \`--color-tonal-tonal-overlay-press\` |
| unselected fill | transparent → hover \`--color-tonal-tonal-secondary-overlay-hover\` → press \`--color-tonal-tonal-secondary-overlay-press\` |
| disabled fill | \`--color-disabled-disabled\` |
| focus ring | \`--stroke-200\` \`--color-primary-primary\`, inset |

Two deliberate departures from the raw Figma values, both flagged so they're not
silent:

- **The indent is 56px, where Figma says 54px.** 56px is exactly the parent's
  inline padding + 24px icon + gap, so the two labels line up; 54px would leave
  them 2px out. That reads as a drafting artifact, so the value is derived from
  the parent's own tokens rather than hardcoding 54.
- **Figma defines no press state** for the sub-item (only default/hover/
  disabled). One is added for parity with the parent row, since a clickable row
  with no press feedback feels broken.

## Accessibility

- Because sub-items are ordinary tabs in the same \`tablist\`, arrow keys move
  through parents and children in one sequence — no second keyboard model.
- The nesting is **visual only**. Screen readers hear a flat list of tabs, so
  write labels that stand on their own ("Shop deals" rather than a bare "Deals")
  when the parent context matters.
- Selection is not color-only: the selected sub-item is also bold.
- Long labels truncate rather than reflowing the row.

## Do / Don't

| Do | Don't |
| --- | --- |
| Place sub-items directly after their parent row. | Scatter them away from the row they belong to. |
| Keep nesting to one level. | Nest sub-items under sub-items. |
| Write labels that make sense read on their own. | Depend on visual indentation to supply the meaning. |
| Use a real \`SidebarSubItem\`. | Fake nesting with padding on a \`SidebarItem\`. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    value: 'deals',
    children: 'Sub-item',
    disabled: false,
  },
  argTypes: {
    value: { control: 'text', table: { category: 'Content' } },
    children: { control: 'text', table: { category: 'Content' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
  },
  decorators: [
    (Story) => (
      <Sidebar defaultValue="deals">
        <SidebarList aria-label="Sidebar" style={{ width: 268 }}>
          {Story()}
        </SidebarList>
      </Sidebar>
    ),
  ],
} satisfies Meta<typeof SidebarSubItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — selected, because its `value` matches the rail's
 *  `defaultValue`. */
export const Playground: Story = {};

export const Nesting: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Sub-items sit directly beneath their parent row, indented so their ' +
          'labels line up with the parent’s label rather than its icon. The ' +
          'selected sub-item has no fill at rest — only the bold on-tonal label.',
      },
    },
  },
  decorators: [],
  render: () => (
    <Rail>
      <SidebarItem value="home" icon={<Home />}>
        Home
      </SidebarItem>
      <SidebarItem value="shop" icon={<ShoppingBag />} expanded>
        Shop
      </SidebarItem>
      <SidebarSubItem value="deals">Deals</SidebarSubItem>
      <SidebarSubItem value="new">New arrivals</SidebarSubItem>
      <SidebarSubItem value="clearance">Clearance</SidebarSubItem>
    </Rail>
  ),
};

export const Status: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Selected versus not selected. Hover either to see the tonal overlay — ' +
          'the accent overlay when selected, the neutral one when not.',
      },
    },
  },
  decorators: [],
  render: () => (
    <Rail>
      <SidebarSubItem value="deals">Selected</SidebarSubItem>
      <SidebarSubItem value="new">Not selected</SidebarSubItem>
    </Rail>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Unlike the parent row, a disabled sub-item paints a solid ' +
          '`--color-disabled-disabled` fill — faithful to Figma, and flagged above ' +
          'as an inconsistency between the two components.',
      },
    },
  },
  decorators: [],
  render: () => (
    <Rail>
      <SidebarSubItem value="deals">Enabled</SidebarSubItem>
      <SidebarSubItem value="new" disabled>
        Disabled
      </SidebarSubItem>
    </Rail>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: selected, unselected, disabled, disabled+selected, and a ' +
          'truncating label — beside a full parent/child rail for indent ' +
          'comparison. Audit under both themes.',
      },
    },
  },
  decorators: [],
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <Rail defaultValue="a">
        <SidebarSubItem value="a">Selected</SidebarSubItem>
        <SidebarSubItem value="b">Not selected</SidebarSubItem>
        <SidebarSubItem value="c" disabled>
          Disabled
        </SidebarSubItem>
        <SidebarSubItem value="d">A sub-item label far too long to fit here</SidebarSubItem>
      </Rail>
      <Rail defaultValue="c">
        <SidebarSubItem value="b">Not selected</SidebarSubItem>
        <SidebarSubItem value="c" disabled>
          Disabled + selected
        </SidebarSubItem>
      </Rail>
      <Rail defaultValue="shop">
        <SidebarItem value="shop" icon={<ShoppingBag />} expanded>
          Parent row
        </SidebarItem>
        <SidebarSubItem value="child">Child row</SidebarSubItem>
      </Rail>
    </div>
  ),
};

/** Pure interaction test (hidden from docs): sub-items are peers of the parent
 *  rows in one roving-focus tablist. */
export const SubItemsArePeerTabs: Story = {
  tags: ['!autodocs'],
  decorators: [],
  render: () => (
    <Rail defaultValue="shop">
      <SidebarItem value="shop" icon={<ShoppingBag />} expanded>
        Shop
      </SidebarItem>
      <SidebarSubItem value="deals">Deals</SidebarSubItem>
    </Rail>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const parent = canvas.getByRole('tab', { name: 'Shop' });
    const child = canvas.getByRole('tab', { name: 'Deals' });

    await expect(parent).toHaveAttribute('aria-selected', 'true');

    // selecting the sub-item deselects the parent — one selection per rail
    await userEvent.click(child);
    await expect(child).toHaveAttribute('aria-selected', 'true');
    await expect(parent).toHaveAttribute('aria-selected', 'false');

    // and arrow keys walk between the two levels
    child.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(parent).toHaveAttribute('aria-selected', 'true');
  },
};
