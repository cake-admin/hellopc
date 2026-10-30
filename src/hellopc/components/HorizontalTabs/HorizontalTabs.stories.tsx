import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { HorizontalTabs, HorizontalTabsList, HorizontalTabsContent } from './HorizontalTabs';
import { HorizontalTabItem } from './HorizontalTabItem';

const Panel = ({ title }: { title: string }) => (
  <div
    style={{
      padding: 'var(--space-300)',
      borderRadius: 'var(--radius-300)',
      background: 'var(--color-surfaces-on-container-high)',
    }}
  >
    <p style={{ margin: 0 }}>Panel content for {title}.</p>
  </div>
);

const MANY = [
  'Home',
  'About',
  'Shop',
  'Settings',
  'Billing',
  'Devices',
  'Network',
  'Security',
  'Notifications',
  'Advanced',
];

const meta = {
  title: 'Components/Horizontal Tabs/Horizontal Tabs',
  component: HorizontalTabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A horizontal tab bar and its panels (Figma "&horizontal tabs", node 149:8841).

A wrapper over Radix \`Tabs\`, which supplies roving **Left/Right** focus
(Home/End to jump), the \`tablist\` / \`tab\` / \`tabpanel\` roles, \`aria-selected\`,
and the trigger↔panel wiring. **Horizontal Tab Item** provides the tabs.

Beyond the primitive, the bar adds what Figma draws around it: when the tabs
overflow, the strip scrolls and **prev/next chevron controls** appear — composed
from the hello pc **IconButton**. Radix has no scrolling of its own, so that part is
implemented here.

| Export | Radix part | Role |
| --- | --- | --- |
| \`HorizontalTabs\` | \`Tabs.Root\` | Owns selection; pins horizontal orientation |
| \`HorizontalTabsList\` | \`Tabs.List\` | The bar (\`role="tablist"\`) + scroll controls |
| \`HorizontalTabsContent\` | \`Tabs.Content\` | A panel (\`role="tabpanel"\`) |
| \`HorizontalTabItem\` | \`Tabs.Trigger\` | A tab |

## Usage

\`\`\`tsx
import {
  HorizontalTabs, HorizontalTabsList, HorizontalTabsContent, HorizontalTabItem,
} from '@/hellopc/components/HorizontalTabs';

<HorizontalTabs defaultValue="home">
  <HorizontalTabsList aria-label="Sections">
    <HorizontalTabItem value="home">Home</HorizontalTabItem>
    <HorizontalTabItem value="about">About</HorizontalTabItem>
  </HorizontalTabsList>

  <HorizontalTabsContent value="home">…</HorizontalTabsContent>
  <HorizontalTabsContent value="about">…</HorizontalTabsContent>
</HorizontalTabs>

// keep the chevrons on permanently, or drop them for swipe-only scrolling
<HorizontalTabsList aria-label="Sections" scrollButtons="always">…</HorizontalTabsList>
<HorizontalTabsList aria-label="Sections" scrollButtons="never">…</HorizontalTabsList>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| root | column, \`--space-300\` (16px) bar↔panel gap |
| scroll controls | **IconButton** \`size="md"\` (40px) \`intent="secondary"\` \`variant="ghost"\` |
| panel | \`--type-size-body\`, \`--color-text-icon-primary\` |
| panel focus ring | \`--stroke-200\` \`--color-primary-primary\` at \`--space-025\` offset |

Tab-level tokens live on **Horizontal Tab Item**.

Two deviations from the Figma node, called out rather than hidden:

- **The scroll buttons are hello pc \`IconButton\`s (circular).** Figma draws them
  with an 8px radius, but that instance comes from a non-hello pc icon-button
  component — the design system's own icon button is a pill. Reusing it keeps
  the bar consistent with every other control; if the rounded-square is
  intended, that belongs in the hello pc IconButton first.
- **A 1px × 44px element sits between the tabs and the right chevron** in the
  Figma export with no fill. It's ambiguous whether it's a divider or a spacer,
  so nothing is drawn for it. Worth confirming with the designer.

## Accessibility

- Radix supplies the full tabs pattern: \`tablist\`/\`tab\`/\`tabpanel\`,
  \`aria-selected\`, and \`aria-controls\`↔\`aria-labelledby\` between tab and panel.
- **Left/Right** move between tabs, **Home/End** jump to the ends. Only the
  selected tab is in the tab order, so Tab moves into the panel.
- Focusing a tab that's scrolled out of view brings it into view, so keyboard
  users are never driven to an invisible tab.
- The scroll controls are real \`IconButton\`s with accessible names, and they
  disable at each end rather than silently doing nothing.
- Panels are focusable so keyboard users can reach content with no focusable
  children of its own.
- Always pass \`aria-label\` to \`HorizontalTabsList\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Name the bar with \`aria-label\`. | Ship an unnamed tablist. |
| Let \`scrollButtons="auto"\` reveal the chevrons only when needed. | Force \`always\` on a bar that never overflows. |
| Keep labels short so more tabs fit before scrolling. | Rely on scrolling to hide a bloated tab set. |
| Use tabs for switching views of one subject. | Use tabs for site navigation — use links. |
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
    onValueChange: { action: 'tab change', table: { category: 'Events' } },
    children: { control: false, table: { category: 'Content' } },
  },
  render: (args) => (
    <HorizontalTabs {...args}>
      <HorizontalTabsList aria-label="Sections">
        <HorizontalTabItem value="home">Home</HorizontalTabItem>
        <HorizontalTabItem value="about">About</HorizontalTabItem>
        <HorizontalTabItem value="shop">Shop</HorizontalTabItem>
        <HorizontalTabItem value="settings">Settings</HorizontalTabItem>
      </HorizontalTabsList>
      {['home', 'about', 'shop', 'settings'].map((v) => (
        <HorizontalTabsContent key={v} value={v}>
          <Panel title={v} />
        </HorizontalTabsContent>
      ))}
    </HorizontalTabs>
  ),
} satisfies Meta<typeof HorizontalTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — the assembled bar with live panels. */
export const Playground: Story = {};

export const Overflowing: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The Figma arrangement: when the tabs outgrow their container the strip ' +
          'scrolls and the chevrons appear, disabling themselves at each end. ' +
          'Resize the docs pane — with `scrollButtons="auto"` they come and go on ' +
          'their own.',
      },
    },
  },
  render: () => (
    <div style={{ width: 520, maxWidth: '100%' }}>
      <HorizontalTabs defaultValue="Home">
        <HorizontalTabsList aria-label="Many sections">
          {MANY.map((label) => (
            <HorizontalTabItem key={label} value={label}>
              {label}
            </HorizontalTabItem>
          ))}
        </HorizontalTabsList>
        {MANY.map((label) => (
          <HorizontalTabsContent key={label} value={label}>
            <Panel title={label} />
          </HorizontalTabsContent>
        ))}
      </HorizontalTabs>
    </div>
  ),
};

export const ScrollButtonModes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`auto` (default) shows the chevrons only once the tabs overflow; ' +
          '`always` keeps them even when everything fits, so the bar’s width never ' +
          'shifts; `never` hides them and leaves swipe/trackpad scrolling.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 420 }}>
      {(['auto', 'always', 'never'] as const).map((mode) => (
        <div key={mode}>
          <p
            style={{
              margin: '0 0 4px',
              fontFamily: 'var(--font-family)',
              fontSize: 'var(--type-size-caption)',
              color: 'var(--color-text-icon-secondary)',
            }}
          >
            scrollButtons=&quot;{mode}&quot;
          </p>
          <HorizontalTabs defaultValue="Home">
            <HorizontalTabsList aria-label={`Sections (${mode})`} scrollButtons={mode}>
              {MANY.slice(0, 6).map((label) => (
                <HorizontalTabItem key={label} value={label}>
                  {label}
                </HorizontalTabItem>
              ))}
            </HorizontalTabsList>
          </HorizontalTabs>
        </div>
      ))}
    </div>
  ),
};

export const ManualActivation: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With `activationMode="manual"`, arrow keys move focus without selecting ' +
          '— the user confirms with Enter or Space. Use it when switching tabs ' +
          'starts an expensive fetch.',
      },
    },
  },
  render: () => (
    <HorizontalTabs defaultValue="home" activationMode="manual">
      <HorizontalTabsList aria-label="Sections">
        <HorizontalTabItem value="home">Home</HorizontalTabItem>
        <HorizontalTabItem value="about">About</HorizontalTabItem>
        <HorizontalTabItem value="shop">Shop</HorizontalTabItem>
      </HorizontalTabsList>
      {['home', 'about', 'shop'].map((v) => (
        <HorizontalTabsContent key={v} value={v}>
          <Panel title={v} />
        </HorizontalTabsContent>
      ))}
    </HorizontalTabs>
  ),
};

/** Pure interaction test (hidden from docs): the bar swaps panels and is named. */
export const SwitchingTabsSwapsPanels: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('home');

    await userEvent.click(canvas.getByRole('tab', { name: 'Shop' }));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('shop');

    await expect(canvas.getByRole('tablist')).toHaveAccessibleName('Sections');
  },
};

/** Pure interaction test (hidden from docs): the scroll controls exist, are
 *  named, and start disabled at the left edge. */
export const ScrollControls: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div style={{ width: 420 }}>
      <HorizontalTabs defaultValue="Home">
        <HorizontalTabsList aria-label="Many sections" scrollButtons="always">
          {MANY.map((label) => (
            <HorizontalTabItem key={label} value={label}>
              {label}
            </HorizontalTabItem>
          ))}
        </HorizontalTabsList>
      </HorizontalTabs>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const prev = canvas.getByRole('button', { name: 'Scroll tabs left' });
    const next = canvas.getByRole('button', { name: 'Scroll tabs right' });

    // at the left edge there is nothing to scroll back to
    await expect(prev).toBeDisabled();
    // ...but the tabs overflow 420px, so forward is available
    await expect(next).toBeEnabled();
  },
};
