import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import React from 'react';

import { VerticalTabs, VerticalTabsList, VerticalTabsContent } from './VerticalTabs';
import { VerticalTabItem } from './VerticalTabItem';
import { VerticalTabSubItem } from './VerticalTabSubItem';
import { VerticalTabsSectionHeader, VerticalTabsDivider } from './VerticalTabsSection';

const Panel = ({ title }: { title: string }) => (
  <div
    style={{
      padding: 'var(--space-300)',
      borderRadius: 'var(--radius-300)',
      background: 'var(--color-surfaces-on-container-high)',
      minWidth: 260,
    }}
  >
    <p style={{ margin: 0, fontWeight: 'var(--font-weight-medium)' as never }}>{title}</p>
    <p style={{ margin: '8px 0 0', color: 'var(--color-text-icon-secondary)' }}>
      Panel content for {title.toLowerCase()}.
    </p>
  </div>
);

const meta = {
  title: 'Components/Vertical Tabs/Vertical Tabs',
  component: VerticalTabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The container for a vertical tab rail and its panels — the settings-style
navigation where the rail sits beside the content it switches.

A thin wrapper over Radix \`Tabs\` with \`orientation="vertical"\`, which is what
makes the rail behave: roving focus on **Up/Down** (Home/End to jump), the
\`tablist\` / \`tab\` / \`tabpanel\` roles, \`aria-selected\`, and the trigger↔panel
wiring. The rows that go inside are **Vertical Tab Item** and **Vertical Tab
Sub-item**.

The full assembled navigation is Figma node 147:8707 — section headers, tab
rows, nested sub-items, and dividers stacked in one rail.

| Export | Radix part | Role |
| --- | --- | --- |
| \`VerticalTabs\` | \`Tabs.Root\` | Owns selection; forces vertical orientation |
| \`VerticalTabsList\` | \`Tabs.List\` | The rail (\`role="tablist"\`) |
| \`VerticalTabsContent\` | \`Tabs.Content\` | A panel (\`role="tabpanel"\`) |
| \`VerticalTabItem\` | \`Tabs.Trigger\` | A top-level row |
| \`VerticalTabSubItem\` | \`Tabs.Trigger\` | A nested row |
| \`VerticalTabsSectionHeader\` | — | A group label |
| \`VerticalTabsDivider\` | — | A rule between groups (reuses \`Divider\`) |

The rail's geometry comes from the assembled nav (node 147:8709):
\`--space-050\` padding, \`--space-025\` between rows, \`--radius-200\` corners. Only
the rail↔panel gap (\`--space-500\`) is a local choice, since Figma draws the nav
standalone without a panel beside it.

### Collapsible groups

A row that owns sub-items takes \`expanded\` — that renders Figma's trailing
chevron and sets \`aria-expanded\`. The chevron is drawn *inside* the row rather
than as its own button, because a button can't nest inside a button; activating
the row both selects it and toggles its group. See **Collapsible Groups** below.

## Usage

\`\`\`tsx
import {
  VerticalTabs, VerticalTabsList, VerticalTabsContent,
  VerticalTabItem, VerticalTabSubItem,
} from '@/hellopc/components/VerticalTabs';

<VerticalTabs defaultValue="general">
  <VerticalTabsList aria-label="Settings sections">
    <VerticalTabItem value="general">General</VerticalTabItem>
    <VerticalTabItem value="privacy">Privacy</VerticalTabItem>
    <VerticalTabSubItem value="cookies">Cookies</VerticalTabSubItem>
  </VerticalTabsList>

  <VerticalTabsContent value="general">…</VerticalTabsContent>
  <VerticalTabsContent value="privacy">…</VerticalTabsContent>
  <VerticalTabsContent value="cookies">…</VerticalTabsContent>
</VerticalTabs>

// controlled, and deferring selection until Enter/Space
<VerticalTabs value={tab} onValueChange={setTab} activationMode="manual">…</VerticalTabs>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| root layout | \`display: flex\`, \`--space-500\` (24px) rail↔panel gap |
| rail | column, \`--space-025\` (2px) between rows, \`--space-050\` (4px) padding, \`--radius-200\` (12px) |
| section header | \`--type-size-caption\` (12px), \`--font-weight-medium\`, \`--color-text-icon-secondary\`, 0.2px tracking; inset \`--space-100\`/\`--space-300\`/\`--space-050\` |
| divider row | the **Divider** element (\`--color-stroke-border\`, matching Figma's \`#E3E3E3\`); inset \`--space-100\` / \`--space-300\` bottom |
| group chevron | 24px, \`currentColor\` so it follows the row's label |
| panel | \`--type-size-body\`, \`--color-text-icon-primary\` |
| panel focus ring | \`--stroke-200\` \`--color-primary-primary\` at \`--space-025\` offset |

Row-level tokens live on **Vertical Tab Item** and **Vertical Tab Sub-item**.

## Accessibility

- Radix supplies the full tabs pattern: \`tablist\`/\`tab\`/\`tabpanel\`,
  \`aria-selected\`, and \`aria-controls\`↔\`aria-labelledby\` between each row and
  its panel.
- Vertical orientation means **Up/Down** move between rows and **Home/End**
  jump to the ends. Only the selected row is in the tab order, so Tab moves
  from the rail into the panel — the standard tabs model.
- Panels are focusable so keyboard users can reach content that has no
  focusable elements of its own; the focus ring is restyled, never removed.
- Always pass \`aria-label\` to \`VerticalTabsList\` — an unnamed tablist gives
  screen-reader users no idea what the rail navigates.
- Prefer \`activationMode="manual"\` when selecting a tab triggers an expensive
  fetch, so arrow-key browsing doesn't fire one per row.
- **Section headers are visual grouping only.** A \`tablist\` is specified to
  contain only tabs, so a header inside it is read as plain text, not as a group
  boundary — and the nesting of sub-items isn't exposed either. When the
  grouping genuinely carries meaning, give each section its own real heading and
  its own \`VerticalTabsList\` (see **Semantic Sections**), and write tab labels
  that stand on their own.
- A collapsible row carries \`aria-expanded\`, so activating it announces that it
  also opens or closes its group.

## Do / Don't

| Do | Don't |
| --- | --- |
| Name the rail with \`aria-label\`. | Ship an unnamed tablist. |
| Give every row a matching \`VerticalTabsContent\`. | Leave a row pointing at no panel. |
| Use tabs for switching views of one subject. | Use tabs for navigating to separate pages — use links. |
| Keep the rail short enough to scan. | Stack twenty rows and rely on scrolling. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    defaultValue: 'general',
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
    <VerticalTabs {...args}>
      <VerticalTabsList aria-label="Settings sections" style={{ width: 220 }}>
        <VerticalTabItem value="general">General</VerticalTabItem>
        <VerticalTabItem value="privacy">Privacy</VerticalTabItem>
        <VerticalTabSubItem value="cookies">Cookies</VerticalTabSubItem>
        <VerticalTabSubItem value="tracking">Tracking</VerticalTabSubItem>
        <VerticalTabItem value="about">About</VerticalTabItem>
      </VerticalTabsList>
      <VerticalTabsContent value="general">
        <Panel title="General" />
      </VerticalTabsContent>
      <VerticalTabsContent value="privacy">
        <Panel title="Privacy" />
      </VerticalTabsContent>
      <VerticalTabsContent value="cookies">
        <Panel title="Cookies" />
      </VerticalTabsContent>
      <VerticalTabsContent value="tracking">
        <Panel title="Tracking" />
      </VerticalTabsContent>
      <VerticalTabsContent value="about">
        <Panel title="About" />
      </VerticalTabsContent>
    </VerticalTabs>
  ),
} satisfies Meta<typeof VerticalTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — a full rail with nested rows and live panels. */
export const Playground: Story = {};

export const FullNavigation: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The assembled navigation from Figma 147:8707 — a section header, a ' +
          'collapsible parent row with its sub-items, more rows, a divider, and a ' +
          'second section. Every row is a tab in one rail, so arrow keys walk the ' +
          'whole thing.',
      },
    },
  },
  render: function FullNav() {
    const [general, setGeneral] = React.useState(true);
    return (
      <VerticalTabs defaultValue="home">
        <VerticalTabsList aria-label="Application sections" style={{ width: 268 }}>
          <VerticalTabsSectionHeader>General</VerticalTabsSectionHeader>
          <VerticalTabItem value="home" expanded={general} onExpandedChange={setGeneral}>
            Home
          </VerticalTabItem>
          {general ? (
            <>
              <VerticalTabSubItem value="overview">Overview</VerticalTabSubItem>
              <VerticalTabSubItem value="activity">Activity</VerticalTabSubItem>
              <VerticalTabSubItem value="reports">Reports</VerticalTabSubItem>
            </>
          ) : null}
          <VerticalTabItem value="devices">Devices</VerticalTabItem>
          <VerticalTabItem value="network">Network</VerticalTabItem>
          <VerticalTabSubItem value="wifi">Wi-Fi</VerticalTabSubItem>

          <VerticalTabsDivider />

          <VerticalTabsSectionHeader>Settings</VerticalTabsSectionHeader>
          <VerticalTabItem value="preferences">Preferences</VerticalTabItem>
        </VerticalTabsList>

        {[
          ['home', 'Home'],
          ['overview', 'Overview'],
          ['activity', 'Activity'],
          ['reports', 'Reports'],
          ['devices', 'Devices'],
          ['network', 'Network'],
          ['wifi', 'Wi-Fi'],
          ['preferences', 'Preferences'],
        ].map(([value, title]) => (
          <VerticalTabsContent key={value} value={value}>
            <Panel title={title} />
          </VerticalTabsContent>
        ))}
      </VerticalTabs>
    );
  },
};

export const CollapsibleGroups: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Pass `expanded` to a row that owns sub-items and it grows Figma’s ' +
          'trailing chevron plus `aria-expanded`. Activating the row selects it ' +
          '**and** toggles its group — the chevron lives inside the row rather ' +
          'than being its own button, since a button can’t nest inside a button.',
      },
    },
  },
  render: function Collapsible() {
    const [open, setOpen] = React.useState(false);
    return (
      <VerticalTabs defaultValue="network">
        <VerticalTabsList aria-label="Sections" style={{ width: 268 }}>
          <VerticalTabItem value="network" expanded={open} onExpandedChange={setOpen}>
            Network {open ? '(expanded)' : '(collapsed)'}
          </VerticalTabItem>
          {open ? (
            <>
              <VerticalTabSubItem value="wifi">Wi-Fi</VerticalTabSubItem>
              <VerticalTabSubItem value="vpn">VPN</VerticalTabSubItem>
            </>
          ) : null}
          <VerticalTabItem value="about">About</VerticalTabItem>
        </VerticalTabsList>
        <VerticalTabsContent value="network">
          <Panel title="Network" />
        </VerticalTabsContent>
        <VerticalTabsContent value="wifi">
          <Panel title="Wi-Fi" />
        </VerticalTabsContent>
        <VerticalTabsContent value="vpn">
          <Panel title="VPN" />
        </VerticalTabsContent>
        <VerticalTabsContent value="about">
          <Panel title="About" />
        </VerticalTabsContent>
      </VerticalTabs>
    );
  },
};

export const SemanticSections: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'When the grouping genuinely carries meaning, prefer this over ' +
          '`VerticalTabsSectionHeader`: a real heading per section, each with its ' +
          'own `VerticalTabsList` labelled by that heading. Assistive tech then ' +
          'gets named groups instead of one flat tablist — the trade-off is that ' +
          'arrow keys stay within a section and Tab moves between them.',
      },
    },
  },
  render: () => (
    <VerticalTabs defaultValue="home">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 268 }}>
        <h3
          id="vt-general"
          style={{
            margin: 0,
            padding: '8px 16px 4px',
            fontSize: 'var(--type-size-caption)',
            fontWeight: 500,
            letterSpacing: '0.2px',
            color: 'var(--color-text-icon-secondary)',
          }}
        >
          General
        </h3>
        <VerticalTabsList aria-labelledby="vt-general">
          <VerticalTabItem value="home">Home</VerticalTabItem>
          <VerticalTabItem value="devices">Devices</VerticalTabItem>
        </VerticalTabsList>

        <h3
          id="vt-settings"
          style={{
            margin: 0,
            padding: '8px 16px 4px',
            fontSize: 'var(--type-size-caption)',
            fontWeight: 500,
            letterSpacing: '0.2px',
            color: 'var(--color-text-icon-secondary)',
          }}
        >
          Settings
        </h3>
        <VerticalTabsList aria-labelledby="vt-settings">
          <VerticalTabItem value="preferences">Preferences</VerticalTabItem>
        </VerticalTabsList>
      </div>

      <VerticalTabsContent value="home">
        <Panel title="Home" />
      </VerticalTabsContent>
      <VerticalTabsContent value="devices">
        <Panel title="Devices" />
      </VerticalTabsContent>
      <VerticalTabsContent value="preferences">
        <Panel title="Preferences" />
      </VerticalTabsContent>
    </VerticalTabs>
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
          'kicks off an expensive fetch.',
      },
    },
  },
  render: () => (
    <VerticalTabs defaultValue="general" activationMode="manual">
      <VerticalTabsList aria-label="Settings sections" style={{ width: 220 }}>
        <VerticalTabItem value="general">General</VerticalTabItem>
        <VerticalTabItem value="privacy">Privacy</VerticalTabItem>
        <VerticalTabItem value="about">About</VerticalTabItem>
      </VerticalTabsList>
      <VerticalTabsContent value="general">
        <Panel title="General" />
      </VerticalTabsContent>
      <VerticalTabsContent value="privacy">
        <Panel title="Privacy" />
      </VerticalTabsContent>
      <VerticalTabsContent value="about">
        <Panel title="About" />
      </VerticalTabsContent>
    </VerticalTabs>
  ),
};

/** Pure interaction test (hidden from docs): the rail swaps panels. */
export const SwitchingTabsSwapsPanels: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // the default panel is showing
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('General');

    // selecting a nested row swaps to its panel
    await userEvent.click(canvas.getByRole('tab', { name: 'Cookies' }));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Cookies');

    // the rail is a named tablist
    await expect(canvas.getByRole('tablist')).toHaveAccessibleName('Settings sections');
  },
};

/** Pure interaction test (hidden from docs): a collapsible row exposes and
 *  toggles its group. */
export const CollapsibleRowTogglesGroup: Story = {
  tags: ['!autodocs'],
  render: function CollapsibleTest() {
    const [open, setOpen] = React.useState(false);
    return (
      <VerticalTabs defaultValue="network">
        <VerticalTabsList aria-label="Sections">
          <VerticalTabItem value="network" expanded={open} onExpandedChange={setOpen}>
            Network
          </VerticalTabItem>
          {open ? <VerticalTabSubItem value="wifi">Wi-Fi</VerticalTabSubItem> : null}
        </VerticalTabsList>
        <VerticalTabsContent value="network">
          <Panel title="Network" />
        </VerticalTabsContent>
        <VerticalTabsContent value="wifi">
          <Panel title="Wi-Fi" />
        </VerticalTabsContent>
      </VerticalTabs>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas.getByRole('tab', { name: 'Network' });

    // the disclosure state is exposed, not just drawn as a chevron
    await expect(row).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('tab', { name: 'Wi-Fi' })).toBeNull();

    await userEvent.click(row);
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('tab', { name: 'Wi-Fi' })).toBeInTheDocument();

    // and it collapses again
    await userEvent.click(row);
    await expect(row).toHaveAttribute('aria-expanded', 'false');
  },
};
