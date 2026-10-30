import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { VerticalTabItem } from './VerticalTabItem';
import { VerticalTabs, VerticalTabsList } from './VerticalTabs';

/** Triggers need Radix Tabs context, so every example sits in a rail. */
const Rail = ({
  children,
  defaultValue = 'home',
}: {
  children: ReactNode;
  defaultValue?: string;
}) => (
  <VerticalTabs defaultValue={defaultValue}>
    <VerticalTabsList aria-label="Sections" style={{ width: 268 }}>
      {children}
    </VerticalTabsList>
  </VerticalTabs>
);

const meta = {
  title: 'Components/Vertical Tabs/Vertical Tab Item',
  component: VerticalTabItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A top-level row in a vertical tab rail (Figma ".elements/vert_tab_item", node
145:8456) — the settings-style navigation where the rail sits beside its panel.

It's a Radix \`Tabs.Trigger\`, so selection, roving **Up/Down** focus, and the
\`role="tab"\` / \`aria-selected\` / panel wiring come from the primitive. Nothing
here tracks selection by hand: Figma's \`status\` axis (selected / not selected)
is Radix's \`data-state\`, and its \`state\` axis
(default/hover/press/disabled) is CSS pseudo-classes plus the \`disabled\` prop.

> **Requires context.** \`VerticalTabItem\` must be rendered inside
> \`VerticalTabsList\` within \`VerticalTabs\` — Radix throws otherwise. See
> **Vertical Tabs** for the container.

## Usage

\`\`\`tsx
import {
  VerticalTabs, VerticalTabsList, VerticalTabsContent, VerticalTabItem,
} from '@/hellopc/components/VerticalTabs';

<VerticalTabs defaultValue="home">
  <VerticalTabsList aria-label="Settings sections">
    <VerticalTabItem value="home">Home</VerticalTabItem>
    <VerticalTabItem value="account">Account</VerticalTabItem>
    <VerticalTabItem value="archived" disabled>Archived</VerticalTabItem>
  </VerticalTabsList>

  <VerticalTabsContent value="home">…</VerticalTabsContent>
  <VerticalTabsContent value="account">…</VerticalTabsContent>
</VerticalTabs>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| row | 32px tall, \`--radius-150\` (8px); inset \`--space-300\` leading / \`--space-100\` trailing / \`--space-050\` block |
| label | \`--type-size-body\` (14px), 0.1px tracking; \`--font-weight-medium\` unselected, \`--font-weight-bold\` selected |
| label color | \`--color-text-icon-primary\`; selected \`--color-primary-primary\`; disabled \`--color-disabled-disabled-inverse\` |
| selected fill | \`--color-tonal-tonal-overlay\` → hover \`--color-tonal-tonal-overlay-hover\` → press \`--color-tonal-tonal-overlay-press\` |
| unselected fill | transparent → hover \`--color-tonal-tonal-secondary-overlay-hover\` → press \`--color-tonal-tonal-secondary-overlay-press\` |
| indicator | 4×16px, \`--color-primary-primary\`, \`--radius-1000\` |
| focus ring | \`--stroke-200\` \`--color-primary-primary\`, inset |

The 32px row and the 4×16px indicator are intrinsic geometry from Figma
145:8457, cited in the source. Following Figma, a **disabled row keeps neither
the fill nor the indicator** even when it's the selected tab.

## Accessibility

- Radix supplies the \`tablist\`/\`tab\`/\`tabpanel\` roles and \`aria-selected\`, and
  links each row to its panel — so the rail is announced as tabs, not buttons.
- Vertical orientation means **Up/Down** arrows move between rows, with
  **Home/End** jumping to the ends. Only the selected row is in the tab order;
  Tab moves on to the panel.
- Selection is never conveyed by color alone — the selected row also goes bold
  and gains the leading indicator (WCAG 1.4.1).
- Always give \`VerticalTabsList\` an \`aria-label\` so the rail has a name.
- Long labels truncate with an ellipsis rather than reflowing the fixed row.

## Do / Don't

| Do | Don't |
| --- | --- |
| Give the rail an \`aria-label\` describing what it navigates. | Leave the tablist unnamed. |
| Keep labels short so they don't truncate. | Rely on the ellipsis to hide long labels. |
| Use \`VerticalTabSubItem\` for a nested level. | Indent a \`VerticalTabItem\` by hand to fake nesting. |
| Use \`activationMode="manual"\` when a panel is expensive to load. | Let automatic activation fire heavy fetches on arrow-key browsing. |
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
    disabled: { control: 'boolean', table: { category: 'State' } },
  },
  decorators: [
    (Story) => (
      <VerticalTabs defaultValue="home">
        <VerticalTabsList aria-label="Sections" style={{ width: 268 }}>
          {Story()}
        </VerticalTabsList>
      </VerticalTabs>
    ),
  ],
} satisfies Meta<typeof VerticalTabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — the row renders selected because its `value`
 *  matches the rail's `defaultValue`. */
export const Playground: Story = {};

export const Status: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma’s `status` axis, which is Radix `data-state` here. The selected ' +
          'row takes the tonal fill, the accent bold label, and the leading ' +
          'indicator; the rest stay quiet until hovered.',
      },
    },
  },
  decorators: [],
  render: () => (
    <Rail>
      <VerticalTabItem value="home">Home (selected)</VerticalTabItem>
      <VerticalTabItem value="account">Account</VerticalTabItem>
      <VerticalTabItem value="privacy">Privacy</VerticalTabItem>
    </Rail>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A disabled row is skipped by arrow-key navigation. Per Figma it keeps ' +
          '**neither** the fill nor the indicator even when it is the selected ' +
          'tab — shown second below.',
      },
    },
  },
  decorators: [],
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <Rail>
        <VerticalTabItem value="home">Home</VerticalTabItem>
        <VerticalTabItem value="archived" disabled>
          Archived (disabled)
        </VerticalTabItem>
      </Rail>
      <Rail defaultValue="archived">
        <VerticalTabItem value="home">Home</VerticalTabItem>
        <VerticalTabItem value="archived" disabled>
          Disabled + selected
        </VerticalTabItem>
      </Rail>
    </div>
  ),
};

export const Truncation: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A label longer than the rail truncates with an ellipsis rather than ' +
          'wrapping and breaking the fixed 32px row.',
      },
    },
  },
  decorators: [],
  render: () => (
    <Rail>
      <VerticalTabItem value="home">Home</VerticalTabItem>
      <VerticalTabItem value="long">
        A tab label far too long to fit inside the rail
      </VerticalTabItem>
    </Rail>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: selected, unselected, disabled, and disabled+selected. ' +
          'Hover and press each row, and audit under both themes — the tonal ' +
          'overlays are translucent, so they must hold up on either surface.',
      },
    },
  },
  decorators: [],
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      <Rail>
        <VerticalTabItem value="home">Selected</VerticalTabItem>
        <VerticalTabItem value="b">Not selected</VerticalTabItem>
        <VerticalTabItem value="c" disabled>
          Disabled
        </VerticalTabItem>
      </Rail>
      <Rail defaultValue="c">
        <VerticalTabItem value="a">Not selected</VerticalTabItem>
        <VerticalTabItem value="c" disabled>
          Disabled + selected
        </VerticalTabItem>
      </Rail>
    </div>
  ),
};

/** Pure interaction test (hidden from docs): selection and Up/Down arrows. */
export const SelectionAndArrowKeys: Story = {
  tags: ['!autodocs'],
  decorators: [],
  render: () => (
    <Rail>
      <VerticalTabItem value="home">Home</VerticalTabItem>
      <VerticalTabItem value="account">Account</VerticalTabItem>
      <VerticalTabItem value="archived" disabled>
        Archived
      </VerticalTabItem>
    </Rail>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const home = canvas.getByRole('tab', { name: 'Home' });
    const account = canvas.getByRole('tab', { name: 'Account' });

    // Radix marks the default as selected
    await expect(home).toHaveAttribute('aria-selected', 'true');

    // clicking selects
    await userEvent.click(account);
    await expect(account).toHaveAttribute('aria-selected', 'true');
    await expect(home).toHaveAttribute('aria-selected', 'false');

    // vertical orientation: ArrowUp moves back to the previous row
    account.focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(home).toHaveAttribute('aria-selected', 'true');

    // the disabled row is not selectable
    await userEvent.click(canvas.getByRole('tab', { name: 'Archived' }));
    await expect(canvas.getByRole('tab', { name: 'Archived' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  },
};
