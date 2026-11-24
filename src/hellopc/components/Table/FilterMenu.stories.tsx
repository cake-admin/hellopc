import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { FilterMenu, type FilterMenuOption } from './FilterMenu';

const OS_TYPES: FilterMenuOption[] = [
  { value: 'win11', label: 'Windows 11', count: 812 },
  { value: 'win10', label: 'Windows 10', count: 264 },
  { value: 'chromeos', label: 'ChromeOS', count: 96 },
  { value: 'macos', label: 'macOS', count: 41 },
  { value: 'ubuntu', label: 'Ubuntu', count: 12 },
  { value: 'other', label: 'Other', count: 3 },
];

/** Open-panel stories render in their own iframe so the modal popover never traps the docs page. */
const inIframe = (height: number) => ({
  docs: { story: { inline: false, iframeHeight: height } },
  layout: 'padded' as const,
});

const meta = {
  title: 'Components/Table/Filter Menu',
  component: FilterMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The multi-select menu behind one filter in the **Filter Bar** (Figma
\`hellopc.table.filter.menu\`, node 18259:2253), e.g. "OS type". Its trigger reads
as an outline **Button** until the filter is applied, then turns tonal and shows
the selection — "OS type: 2 selected", or the value itself when only one is
picked. Use it for filters over a known, short list of values; for conditions
("Last seen before…"), use the **Filter Rule Builder**.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

The 280px panel is a Radix \`Popover\` (portal, focus moves in, Esc and outside
click dismiss) holding a search **TextInput**, a "Select all" row, one checkbox
**MenuItem** per value with its count, and a footer with Clear (secondary ghost)
and Done (primary fill) **Button**s. Picks are a **draft**: they apply on Done;
Esc or an outside click cancels and restores the applied selection. Select all
acts on the rows the search leaves visible and goes indeterminate when only
some of them are picked. \`value\` works controlled (with \`onValueChange\`) or
uncontrolled (\`defaultValue\`).

## Usage

\`\`\`tsx
<FilterMenu label="OS type" options={osTypes} />
<FilterMenu label="OS type" options={osTypes} defaultValue={['win11', 'win10']} />
<FilterMenu label="Status" options={statuses} value={status} onValueChange={setStatus} />
<FilterMenu label="Model" options={models} maxListHeight={288} />
<FilterMenu label="OS type" options={osTypes} searchPlaceholder="Find an OS" />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| panel | \`--color-surfaces-container\`, \`--stroke-100\` · \`--color-stroke-border\`, \`--radius-150\` (8px), \`--elevation-3\` |
| panel padding | \`--space-100\` (8px) top/bottom |
| search / footer inset | \`--space-100\` × \`--space-200\` (8 × 12px) |
| search field | **TextInput** \`size="sm"\` (32px) |
| rows | **MenuItem** \`showCheckbox toggleRow\` (36px, \`--radius-200\`) |
| count / summary | \`--type-size-caption\` (12px), \`--font-weight-regular\`, \`--color-text-icon-primary\` |
| dividers | **Divider** \`weight="weak"\` (\`--color-stroke-border-low\`) |
| Clear / Done | **Button** \`size="sm"\` secondary ghost / primary fill |
| trigger | **Button** \`size="sm"\` secondary — \`outline\` idle, \`tonal\` applied |
| panel width | 280px (intrinsic geometry, Figma 18259:2253) |

## Accessibility

- The trigger is a real **Button** with \`aria-haspopup="dialog"\` and
  \`aria-expanded\`; the panel is a labelled dialog ("OS type filter"). Focus
  moves to the search field on open and returns to the trigger on close.
- Each row is one checkbox (\`role="checkbox"\`, \`aria-checked\`); "Select all"
  reports \`aria-checked="mixed"\` when partial. Counts are part of the row name
  ("Windows 11, 812").
- The "n of N selected" summary and "No matches" are \`role="status"\`, so
  changes are announced as you tick boxes or search.
- Clear is disabled while nothing is picked; Esc cancels without applying.

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep the label short — it becomes "Label: 2 selected" | Put the selection summary in the label yourself |
| Show counts when they help people choose | Show counts that don't match the current table data |
| Apply on Done, so the table re-queries once | Re-filter the table on every tick |
| Use the **Filter Rule Builder** for conditions and ranges | Stretch this menu into a free-form query editor |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'OS type',
    options: OS_TYPES,
    onValueChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    options: { control: false, table: { category: 'Content' } },
    searchPlaceholder: { control: 'text', table: { category: 'Content' } },
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: false, table: { category: 'State' } },
    open: { control: 'boolean', table: { category: 'State' } },
    maxListHeight: { control: 'number', table: { category: 'Appearance' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    onOpenChange: { action: 'openChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof FilterMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/**
 * The trigger in its three states: idle (outline, filter name), one value
 * applied (tonal, "OS type: Windows 11"), several applied (tonal, "OS type: 2
 * selected").
 */
export const TriggerStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <FilterMenu label="OS type" options={OS_TYPES} />
      <FilterMenu label="OS type" options={OS_TYPES} defaultValue={['win11']} />
      <FilterMenu label="OS type" options={OS_TYPES} defaultValue={['win11', 'win10']} />
    </div>
  ),
};

/**
 * The open panel with some values picked — Select all goes indeterminate and the
 * footer reads "2 of 6 selected" (Figma `selection=some`).
 */
export const OpenPanel: Story = {
  parameters: { controls: { disable: true }, ...inIframe(520) },
  render: () => (
    <div style={{ minHeight: 480 }}>
      <FilterMenu label="OS type" options={OS_TYPES} defaultValue={['win11', 'win10']} open />
    </div>
  ),
};

/**
 * A long value list capped with `maxListHeight` — the option list scrolls with
 * the hello pc scrollbar while search, Select all, and the footer stay put.
 */
export const LongList: Story = {
  parameters: { controls: { disable: true }, ...inIframe(460) },
  render: () => (
    <div style={{ minHeight: 420 }}>
      <FilterMenu
        label="Model"
        open
        maxListHeight={180}
        options={Array.from({ length: 14 }, (_, i) => ({
          value: `m${i}`,
          label: `ThinkPad model ${i + 1}`,
          count: 40 - i * 2,
        }))}
      />
    </div>
  ),
};

/**
 * QA matrix: the three trigger states and the open panel. Audit it under
 * light, dark, and win hct with the **Theme** toolbar.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true }, ...inIframe(560) },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 520 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <FilterMenu label="Status" options={OS_TYPES} />
        <FilterMenu label="OS type" options={OS_TYPES} defaultValue={['macos']} />
        <FilterMenu label="Device type" options={OS_TYPES} defaultValue={['win11', 'win10']} />
      </div>
      <FilterMenu label="OS type" options={OS_TYPES} defaultValue={['win11', 'win10']} open />
    </div>
  ),
};

/** Picks are a draft: ticking rows updates the summary; Done applies them and relabels the trigger. */
export const AppliesOnDone: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'OS type' }));
    const dialog = await screen.findByRole('dialog', { name: 'OS type filter' });
    const panel = within(dialog);
    await waitFor(() => expect(panel.getByRole('textbox', { name: 'Search OS type' })).toHaveFocus());

    await userEvent.click(panel.getByRole('checkbox', { name: 'Windows 11, 812' }));
    await userEvent.click(panel.getByRole('checkbox', { name: 'Windows 10, 264' }));
    await expect(panel.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute('aria-checked', 'mixed');
    await expect(panel.getByText('2 of 6 selected')).toBeInTheDocument();
    await expect(args.onValueChange).not.toHaveBeenCalled();

    await userEvent.click(panel.getByRole('button', { name: 'Done' }));
    await expect(args.onValueChange).toHaveBeenCalledWith(['win11', 'win10']);
    const trigger = canvas.getByRole('button', { name: 'OS type: 2 selected' });
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** Esc cancels: draft picks are discarded and nothing is applied. */
export const EscCancels: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'OS type' }));
    const dialog = await screen.findByRole('dialog', { name: 'OS type filter' });
    await userEvent.click(within(dialog).getByRole('checkbox', { name: 'Select all' }));
    await expect(within(dialog).getByText('6 of 6 selected')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'OS type' })).toHaveFocus();
  },
};
