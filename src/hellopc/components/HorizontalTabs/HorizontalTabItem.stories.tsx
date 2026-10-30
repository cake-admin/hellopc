import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { HorizontalTabItem } from './HorizontalTabItem';
import { HorizontalTabs, HorizontalTabsList } from './HorizontalTabs';

/** Triggers need Radix Tabs context, so every example sits in a bar. */
const Bar = ({
  children,
  defaultValue = 'home',
}: {
  children: ReactNode;
  defaultValue?: string;
}) => (
  <HorizontalTabs defaultValue={defaultValue}>
    <HorizontalTabsList aria-label="Sections" scrollButtons="never">
      {children}
    </HorizontalTabsList>
  </HorizontalTabs>
);

const meta = {
  title: 'Components/Horizontal Tabs/Horizontal Tab Item',
  component: HorizontalTabItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
One tab in a horizontal tab bar (Figma ".elements/tab_item", node 149:8842).

A Radix \`Tabs.Trigger\`, so selection, roving **Left/Right** focus, and the
\`role="tab"\` / \`aria-selected\` / panel wiring come from the primitive. Figma's
\`status\` axis (selected / not selected) is Radix's \`data-state\`; its \`state\`
axis (default/hover/press/disabled) is CSS pseudo-classes plus \`disabled\`.

Although Figma reuses the vertical row's component name, this is a **distinctly
different skin** — worth knowing if you're comparing the two:

| | Vertical row | Horizontal tab |
| --- | --- | --- |
| height / radius | 32px, \`--radius-150\` | 48px, \`--radius-300\` |
| selected indicator | 4×16px leading bar | 4px **bottom underline** |
| selected label | \`--color-primary-primary\` | \`--color-text-icon-on-tonal\` |

> **Requires context.** Must be rendered inside \`HorizontalTabsList\` within
> \`HorizontalTabs\`.

## Usage

\`\`\`tsx
import {
  HorizontalTabs, HorizontalTabsList, HorizontalTabsContent, HorizontalTabItem,
} from '@/hellopc/components/HorizontalTabs';

<HorizontalTabs defaultValue="home">
  <HorizontalTabsList aria-label="Sections">
    <HorizontalTabItem value="home">Home</HorizontalTabItem>
    <HorizontalTabItem value="about">About</HorizontalTabItem>
    <HorizontalTabItem value="archived" disabled>Archived</HorizontalTabItem>
  </HorizontalTabsList>

  <HorizontalTabsContent value="home">…</HorizontalTabsContent>
  <HorizontalTabsContent value="about">…</HorizontalTabsContent>
</HorizontalTabs>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| tab | 48px tall, \`--radius-300\` (16px); outer inset \`--space-100\` |
| label row | \`--space-150\` (10px) top / \`--space-100\` (8px) bottom / \`--space-200\` (12px) sides |
| label | \`--type-size-body\` (14px), 0.1px tracking; \`--font-weight-medium\`, \`--font-weight-bold\` when selected |
| label color | \`--color-text-icon-primary\`; selected \`--color-text-icon-on-tonal\`; disabled \`--color-disabled-disabled-inverse\` |
| selected fill | \`--color-tonal-tonal-overlay\` → hover \`--color-tonal-tonal-overlay-hover\` → press \`--color-tonal-tonal-overlay-press\` |
| unselected fill | transparent → hover \`--color-tonal-tonal-secondary-overlay-hover\` → press \`--color-tonal-tonal-secondary-overlay-press\` |
| underline | 4px, \`--color-primary-primary\`, \`--radius-1000\`, inset \`--space-300\` |
| focus ring | \`--stroke-200\` \`--color-primary-primary\`, inset |

The 48px tab and 4px underline are intrinsic geometry from Figma 149:8843. The
underline slot is **always rendered** (transparent when unselected) so selecting
a tab never nudges its label. Following Figma, a **disabled tab keeps neither
the fill nor the underline** even when it's the selected tab.

## Accessibility

- Radix supplies the \`tablist\`/\`tab\`/\`tabpanel\` roles and \`aria-selected\`, and
  links each tab to its panel.
- Horizontal orientation means **Left/Right** arrows move between tabs, with
  **Home/End** jumping to the ends. Only the selected tab is in the tab order;
  Tab moves on to the panel.
- Selection isn't color-only — the selected tab also goes bold and gains the
  underline (WCAG 1.4.1).
- Always give \`HorizontalTabsList\` an \`aria-label\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep labels short — tabs sit side by side. | Write sentence-length tab labels. |
| Let the bar scroll when tabs overflow. | Shrink labels until they're unreadable. |
| Use tabs to switch views of one subject. | Use tabs to navigate to separate pages — use links. |
| Give every tab a matching panel. | Leave a tab pointing at no panel. |
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
      <HorizontalTabs defaultValue="home">
        <HorizontalTabsList aria-label="Sections" scrollButtons="never">
          {Story()}
        </HorizontalTabsList>
      </HorizontalTabs>
    ),
  ],
} satisfies Meta<typeof HorizontalTabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — selected, because its `value` matches the bar's
 *  `defaultValue`. */
export const Playground: Story = {};

export const Status: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma’s `status` axis, which is Radix `data-state` here. The selected ' +
          'tab takes the tonal fill, the bold on-tonal label, and the underline.',
      },
    },
  },
  decorators: [],
  render: () => (
    <Bar>
      <HorizontalTabItem value="home">Home</HorizontalTabItem>
      <HorizontalTabItem value="about">About</HorizontalTabItem>
      <HorizontalTabItem value="shop">Shop</HorizontalTabItem>
      <HorizontalTabItem value="settings">Settings</HorizontalTabItem>
    </Bar>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A disabled tab is skipped by arrow-key navigation. Per Figma it keeps ' +
          '**neither** the fill nor the underline even when it is the selected ' +
          'tab — shown second.',
      },
    },
  },
  decorators: [],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Bar>
        <HorizontalTabItem value="home">Home</HorizontalTabItem>
        <HorizontalTabItem value="archived" disabled>
          Archived
        </HorizontalTabItem>
      </Bar>
      <Bar defaultValue="archived">
        <HorizontalTabItem value="home">Home</HorizontalTabItem>
        <HorizontalTabItem value="archived" disabled>
          Disabled + selected
        </HorizontalTabItem>
      </Bar>
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: selected, unselected, disabled, and disabled+selected. Hover ' +
          'and press each, and audit under both themes — the tonal overlays are ' +
          'translucent, so they must hold on either surface.',
      },
    },
  },
  decorators: [],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Bar>
        <HorizontalTabItem value="home">Selected</HorizontalTabItem>
        <HorizontalTabItem value="b">Not selected</HorizontalTabItem>
        <HorizontalTabItem value="c" disabled>
          Disabled
        </HorizontalTabItem>
      </Bar>
      <Bar defaultValue="c">
        <HorizontalTabItem value="b">Not selected</HorizontalTabItem>
        <HorizontalTabItem value="c" disabled>
          Disabled + selected
        </HorizontalTabItem>
      </Bar>
    </div>
  ),
};

/** Pure interaction test (hidden from docs): selection and Left/Right arrows. */
export const SelectionAndArrowKeys: Story = {
  tags: ['!autodocs'],
  decorators: [],
  render: () => (
    <Bar>
      <HorizontalTabItem value="home">Home</HorizontalTabItem>
      <HorizontalTabItem value="about">About</HorizontalTabItem>
      <HorizontalTabItem value="archived" disabled>
        Archived
      </HorizontalTabItem>
    </Bar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const home = canvas.getByRole('tab', { name: 'Home' });
    const about = canvas.getByRole('tab', { name: 'About' });

    await expect(home).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(about);
    await expect(about).toHaveAttribute('aria-selected', 'true');
    await expect(home).toHaveAttribute('aria-selected', 'false');

    // horizontal orientation: ArrowLeft steps back to the previous tab
    about.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(home).toHaveAttribute('aria-selected', 'true');

    // the disabled tab is not selectable
    await userEvent.click(canvas.getByRole('tab', { name: 'Archived' }));
    await expect(canvas.getByRole('tab', { name: 'Archived' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  },
};
