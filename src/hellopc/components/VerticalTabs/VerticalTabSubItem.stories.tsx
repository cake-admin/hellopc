import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { VerticalTabSubItem } from './VerticalTabSubItem';
import { VerticalTabItem } from './VerticalTabItem';
import { VerticalTabs, VerticalTabsList } from './VerticalTabs';

/** Triggers need Radix Tabs context, so every example sits in a rail. */
const Rail = ({
  children,
  defaultValue = 'general',
}: {
  children: ReactNode;
  defaultValue?: string;
}) => (
  <VerticalTabs defaultValue={defaultValue}>
    <VerticalTabsList aria-label="Sections" style={{ width: 220 }}>
      {children}
    </VerticalTabsList>
  </VerticalTabs>
);

const meta = {
  title: 'Components/Vertical Tabs/Vertical Tab Sub-item',
  component: VerticalTabSubItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A nested row beneath a **Vertical Tab Item** (Figma
".elements/vert_tab_subitem", node 145:8584) — the second level of a vertical
rail, e.g. *Settings → Privacy → Cookies*.

It's the **same primitive** as the parent row (a Radix \`Tabs.Trigger\`), so it's
a peer in the same roving-focus rail rather than a separate widget — arrow keys
walk parents and sub-items alike, and only one row across the whole rail is
selected at a time.

Four deliberate differences from the parent row, all taken from Figma:

1. It indents to \`--space-600\` (32px) instead of \`--space-300\` (16px).
2. It has **no** leading indicator — the indent carries the nesting.
3. Selected-at-rest carries **no fill**, just the bold accent label.
4. Disabled paints a solid \`--color-disabled-disabled\` fill, where the parent
   row stays transparent.

> **Worth a designer's eye:** #4 is a genuine inconsistency between the two
> Figma components, not a decision made here. It's implemented faithfully rather
> than quietly normalised — if the rows should match, the fix belongs in Figma
> first.

> **Requires context.** Must be rendered inside \`VerticalTabsList\` within
> \`VerticalTabs\`.

## Usage

\`\`\`tsx
import {
  VerticalTabs, VerticalTabsList, VerticalTabItem, VerticalTabSubItem,
} from '@/hellopc/components/VerticalTabs';

<VerticalTabs defaultValue="cookies">
  <VerticalTabsList aria-label="Settings sections">
    <VerticalTabItem value="general">General</VerticalTabItem>

    <VerticalTabItem value="privacy">Privacy</VerticalTabItem>
    <VerticalTabSubItem value="cookies">Cookies</VerticalTabSubItem>
    <VerticalTabSubItem value="tracking">Tracking</VerticalTabSubItem>
  </VerticalTabsList>
</VerticalTabs>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| row | 32px tall, \`--radius-150\` (8px); inset \`--space-600\` (32px) leading / \`--space-100\` trailing |
| label | \`--type-size-body\` (14px), 0.1px tracking; \`--font-weight-medium\`, \`--font-weight-bold\` when selected |
| label color | \`--color-text-icon-primary\`; selected \`--color-primary-primary\`; disabled \`--color-disabled-disabled-inverse\` |
| selected fill | none at rest → hover \`--color-tonal-tonal-overlay-hover\` → press \`--color-tonal-tonal-overlay-press\` |
| unselected fill | transparent → hover \`--color-tonal-tonal-secondary-overlay-hover\` → press \`--color-tonal-tonal-secondary-overlay-press\` |
| disabled fill | \`--color-disabled-disabled\` |
| focus ring | \`--stroke-200\` \`--color-primary-primary\`, inset |

Figma defines no **press** state for the sub-item (only default/hover/disabled).
A press treatment is added here for parity with the parent row, since a
clickable row with no press feedback feels broken — flagged so it's a known
addition rather than a silent one.

## Accessibility

- Because sub-items are ordinary tabs in the same \`tablist\`, arrow keys move
  through parents and children in one sequence — no separate keyboard model to
  learn.
- The nesting is **visual only**. Screen readers hear a flat list of tabs, so
  write labels that stand on their own ("Privacy cookies" rather than a bare
  "Cookies") when the parent context matters.
- Selection is not color-only: the selected sub-item is also bold.
- Long labels truncate rather than reflowing the fixed row.

## Do / Don't

| Do | Don't |
| --- | --- |
| Place sub-items directly after their parent row. | Scatter sub-items away from the row they belong to. |
| Keep nesting to one level. | Indent sub-items under sub-items. |
| Write labels that make sense read on their own. | Depend on visual indentation to supply the meaning. |
| Use a real \`VerticalTabSubItem\`. | Fake nesting with padding on a \`VerticalTabItem\`. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    value: 'general',
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
      <VerticalTabs defaultValue="general">
        <VerticalTabsList aria-label="Sections" style={{ width: 220 }}>
          {Story()}
        </VerticalTabsList>
      </VerticalTabs>
    ),
  ],
} satisfies Meta<typeof VerticalTabSubItem>;

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
          'Sub-items sit directly beneath their parent row. Note the selected ' +
          'sub-item has no fill at rest — only the bold accent label — and no ' +
          'leading indicator, since the 32px indent already conveys the nesting.',
      },
    },
  },
  decorators: [],
  render: () => (
    <Rail defaultValue="cookies">
      <VerticalTabItem value="general">General</VerticalTabItem>
      <VerticalTabItem value="privacy">Privacy</VerticalTabItem>
      <VerticalTabSubItem value="cookies">Cookies</VerticalTabSubItem>
      <VerticalTabSubItem value="tracking">Tracking</VerticalTabSubItem>
      <VerticalTabItem value="about">About</VerticalTabItem>
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
    <Rail defaultValue="cookies">
      <VerticalTabSubItem value="cookies">Selected</VerticalTabSubItem>
      <VerticalTabSubItem value="tracking">Not selected</VerticalTabSubItem>
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
    <Rail defaultValue="cookies">
      <VerticalTabSubItem value="cookies">Enabled</VerticalTabSubItem>
      <VerticalTabSubItem value="tracking" disabled>
        Disabled
      </VerticalTabSubItem>
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
        <VerticalTabSubItem value="a">Selected</VerticalTabSubItem>
        <VerticalTabSubItem value="b">Not selected</VerticalTabSubItem>
        <VerticalTabSubItem value="c" disabled>
          Disabled
        </VerticalTabSubItem>
        <VerticalTabSubItem value="d">
          A sub-item label far too long to fit
        </VerticalTabSubItem>
      </Rail>
      <Rail defaultValue="c">
        <VerticalTabSubItem value="b">Not selected</VerticalTabSubItem>
        <VerticalTabSubItem value="c" disabled>
          Disabled + selected
        </VerticalTabSubItem>
      </Rail>
      <Rail defaultValue="privacy">
        <VerticalTabItem value="privacy">Parent row</VerticalTabItem>
        <VerticalTabSubItem value="child">Child row</VerticalTabSubItem>
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
    <Rail defaultValue="privacy">
      <VerticalTabItem value="privacy">Privacy</VerticalTabItem>
      <VerticalTabSubItem value="cookies">Cookies</VerticalTabSubItem>
    </Rail>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const parent = canvas.getByRole('tab', { name: 'Privacy' });
    const child = canvas.getByRole('tab', { name: 'Cookies' });

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
