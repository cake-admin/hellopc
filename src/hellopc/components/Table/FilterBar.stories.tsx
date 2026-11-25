import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Bookmark, ChevronDown, LayoutGrid, List, RotateCw, Search } from 'lucide-react';

import { FilterBar, type FilterBarLayout } from './FilterBar';
import { FilterMenu, type FilterMenuOption } from './FilterMenu';
import { FilterRuleBuilder, type FilterRuleSet } from './FilterRuleBuilder';
import { Table } from './Table';
import { ActionBar } from './ActionBar';
import { HeaderRow, HeaderCell } from './HeaderRow';
import { DataRow, DataCell } from './DataRow';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { ContentSwitcher } from '../ContentSwitcher/ContentSwitcher';
import { TextInput } from '../TextInput/TextInput';

const STATUS: FilterMenuOption[] = [
  { value: 'online', label: 'Online', count: 941 },
  { value: 'offline', label: 'Offline', count: 287 },
];
const OS: FilterMenuOption[] = [
  { value: 'win11', label: 'Windows 11', count: 812 },
  { value: 'win10', label: 'Windows 10', count: 264 },
  { value: 'chromeos', label: 'ChromeOS', count: 96 },
  { value: 'macos', label: 'macOS', count: 41 },
  { value: 'ubuntu', label: 'Ubuntu', count: 12 },
  { value: 'other', label: 'Other', count: 3 },
];
const GROUP: FilterMenuOption[] = [
  { value: 'eng', label: 'Engineering', count: 512 },
  { value: 'sales', label: 'Sales', count: 230 },
];
const DEVICE: FilterMenuOption[] = [
  { value: 'laptop', label: 'Laptop', count: 980 },
  { value: 'desktop', label: 'Desktop', count: 248 },
];
const FIELDS = [
  { label: 'Status', value: 'status' },
  { label: 'Device name', value: 'device' },
  { label: 'OS type', value: 'os' },
];
const OPERATORS = [
  { label: 'Is', value: 'is' },
  { label: 'Is not', value: 'not' },
  { label: 'Contains', value: 'contains' },
];
const NO_RULES: FilterRuleSet = { match: 'all', rules: [] };

const SavedView = (
  <Button size="sm" intent="secondary" variant="outline" startIcon={<Bookmark />} endIcon={<ChevronDown />}>
    Standard view
  </Button>
);
const Sort = (
  <Button size="sm" intent="secondary" variant="ghost" endIcon={<ChevronDown />}>
    Sort: Last used
  </Button>
);
const ViewSwitcher = (
  <ContentSwitcher
    size="sm"
    intent="secondary"
    iconOnly
    aria-label="View"
    options={[
      { value: 'grid', label: 'Grid view', icon: <LayoutGrid /> },
      { value: 'list', label: 'List view', icon: <List /> },
    ]}
  />
);

type Applied = {
  status: string[];
  os: string[];
  group: string[];
  device: string[];
  rules: FilterRuleSet;
  search: string;
};
const NONE: Applied = { status: [], os: [], group: [], device: [], rules: NO_RULES, search: '' };
const SOME: Applied = {
  ...NONE,
  status: ['online'],
  os: ['win11', 'win10'],
  rules: { match: 'all', rules: [{ id: 'r1', field: 'device', operator: 'contains', value: 'PF4' }] },
};

/**
 * A fully wired filter bar: each filter is controlled, and Reset all clears
 * every one of them — menus, rules, and search.
 */
function DemoFilterBar({
  layout = 'full',
  initial = NONE,
  withSearch = false,
  withSort = false,
  withViewSwitcher = false,
  onResetAll,
}: {
  layout?: FilterBarLayout;
  initial?: Applied;
  withSearch?: boolean;
  withSort?: boolean;
  withViewSwitcher?: boolean;
  onResetAll?: () => void;
}) {
  const [f, setF] = React.useState<Applied>(initial);
  const set = <K extends keyof Applied>(k: K) => (v: Applied[K]) => setF((p) => ({ ...p, [k]: v }));
  const applied =
    f.status.length + f.os.length + f.group.length + f.device.length + f.rules.rules.length > 0 ||
    f.search !== '';

  const search = (
    <div style={{ width: 240 }}>
      <TextInput
        size="sm"
        aria-label="Search devices"
        placeholder="Search"
        startIcon={<Search />}
        value={f.search}
        onChange={(e) => set('search')(e.target.value)}
      />
    </div>
  );

  return (
    <FilterBar
      layout={layout}
      savedView={SavedView}
      filters={
        layout === 'full' ? (
          <>
            <FilterMenu label="Status" options={STATUS} value={f.status} onValueChange={set('status')} />
            <FilterMenu label="OS type" options={OS} value={f.os} onValueChange={set('os')} />
            <FilterMenu label="Group" options={GROUP} value={f.group} onValueChange={set('group')} />
            <FilterMenu label="Device type" options={DEVICE} value={f.device} onValueChange={set('device')} />
          </>
        ) : (
          <FilterRuleBuilder
            fields={FIELDS}
            operators={OPERATORS}
            triggerAppearance="filter"
            triggerLabel="Filters"
            value={f.rules}
            onApply={set('rules')}
          />
        )
      }
      advancedFilters={
        <FilterRuleBuilder fields={FIELDS} operators={OPERATORS} value={f.rules} onApply={set('rules')} />
      }
      search={withSearch || layout === 'compact' ? search : undefined}
      sort={withSort || layout === 'compact' ? Sort : undefined}
      viewSwitcher={withViewSwitcher || layout === 'compact' ? ViewSwitcher : undefined}
      resetDisabled={!applied}
      onResetAll={() => {
        // Reset all clears everything the bar controls (decision for 1.3.0:
        // Figma marks shared filter state as pending).
        setF(NONE);
        onResetAll?.();
      }}
    />
  );
}

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 1040, background: 'var(--color-surfaces-container)' }}>{children}</div>
);

const meta = {
  title: 'Components/Table/Filter Bar',
  component: FilterBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The bar above a table, below the **Action Bar** (Figma \`hellopc.table.filter.bar\`,
node 18225:394). \`full\` shows a saved-view picker, one button per common filter,
"Advanced filters", and Reset all (optional search, sort, view switcher);
\`compact\` — the former \`hellopc.toolbar\`, for small tables and cards — shows
one "Filters" button with a count, sort, search, view switcher, and Reset all.
Use it with column-header filters, not instead of them. Keep one search per
table: when the bar shows search, leave the Action Bar's \`end\` slot empty.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

FilterBar is a **layout shell**: it owns the 48px row, spacing, the divider after
the saved view, and the Reset all button; every control is an existing piece you
pass into a slot — **Filter Menu**s (outline, then tonal + value once applied:
"Status: Online", "OS type: 2 selected"), a **Filter Rule Builder** for
Advanced filters (its **Counter** shows active rules), a **TextInput**, a sort
**Button**, an icon-only **ContentSwitcher**. Reset all is disabled while nothing
is applied (\`resetDisabled\`); \`onResetAll\` should clear **everything** — every
menu, every rule, and the search. Pass the bar to **Table**'s \`filterBar\` slot.

## Usage

\`\`\`tsx
<FilterBar filters={<FilterMenu label="Status" options={statuses} />} onResetAll={resetAll} resetDisabled={!anyApplied} />
<FilterBar savedView={<Button size="sm" intent="secondary" variant="outline">Standard view</Button>} filters={…} />
<FilterBar filters={…} advancedFilters={<FilterRuleBuilder fields={fields} operators={ops} />} />
<FilterBar filters={…} search={<TextInput size="sm" aria-label="Search" />} sort={sortButton} viewSwitcher={viewSwitcher} />
<FilterBar layout="compact" filters={<FilterRuleBuilder triggerAppearance="filter" triggerLabel="Filters" … />} />
<Table actionBar={…} filterBar={<FilterBar … />} header={…}>{rows}</Table>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| bar | \`--color-surfaces-container\`, bottom \`--stroke-100\` · \`--color-stroke-border\` |
| padding | \`--space-100\` × \`--space-300\` (8 × 16px) |
| item gap | \`--space-100\` (8px) |
| view divider | **Divider** \`direction="vertical"\`, 24px tall |
| filter buttons | **Button** \`size="sm"\` secondary — \`outline\` idle, \`tonal\` applied |
| Advanced filters | **Button** \`size="sm"\` primary ghost + **Counter** |
| Reset all | **Button** \`size="sm"\` primary ghost (disabled while nothing applies) |
| bar height | 48px (intrinsic geometry, Figma 18225:394) |

## Accessibility

- The bar is a \`role="toolbar"\` with an \`aria-label\` (default "Table filters").
  Like the **Action Bar**, it keeps normal Tab order (no roving focus) because it
  hosts a text field.
- Each filter button announces its state in its name ("OS type: 2 selected")
  and \`aria-expanded\`; the popovers are labelled dialogs that return focus to
  their button.
- Reset all is a real disabled button while there is nothing to reset, so it is
  skipped by Tab rather than doing nothing.
- Give the search field an \`aria-label\`; give the view switcher one too.

## Do / Don't

| Do | Don't |
| --- | --- |
| Put the most-used 3–5 filters on the bar; the rest in Advanced filters | Line up every column as a filter button |
| Clear menus, rules, and search on Reset all | Reset only some filters and leave others applied |
| Use \`compact\` for small tables and cards | Use \`full\` in a card with no room for its filters |
| Keep one search per table | Show search in both the Action Bar and the Filter Bar |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    layout: 'full',
    resetDisabled: false,
    onResetAll: fn(),
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['full', 'compact'], table: { category: 'Appearance' } },
    savedView: { control: false, table: { category: 'Content' } },
    filters: { control: false, table: { category: 'Content' } },
    advancedFilters: { control: false, table: { category: 'Content' } },
    search: { control: false, table: { category: 'Content' } },
    sort: { control: false, table: { category: 'Content' } },
    viewSwitcher: { control: false, table: { category: 'Content' } },
    resetLabel: { control: 'text', table: { category: 'Content' } },
    resetDisabled: { control: 'boolean', table: { category: 'State' } },
    'aria-label': { control: 'text', table: { category: 'Content' } },
    onResetAll: { action: 'resetAll', table: { category: 'Events' } },
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => (
    <Frame>
      <FilterBar
        {...args}
        savedView={SavedView}
        filters={
          args.layout === 'compact' ? (
            <FilterRuleBuilder fields={FIELDS} operators={OPERATORS} triggerAppearance="filter" triggerLabel="Filters" />
          ) : (
            <>
              <FilterMenu label="Status" options={STATUS} />
              <FilterMenu label="OS type" options={OS} />
            </>
          )
        }
        advancedFilters={<FilterRuleBuilder fields={FIELDS} operators={OPERATORS} />}
        sort={args.layout === 'compact' ? Sort : undefined}
        viewSwitcher={args.layout === 'compact' ? ViewSwitcher : undefined}
      />
    </Frame>
  ),
};

/**
 * `layout="full"`, idle and applied (Figma `state=default` / `applied`): applied
 * filter buttons turn tonal and show their value, Advanced filters shows its
 * rule count, and Reset all enables.
 */
export const Full: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Frame>
        <DemoFilterBar />
      </Frame>
      <Frame>
        <DemoFilterBar initial={SOME} />
      </Frame>
    </div>
  ),
};

/**
 * `layout="compact"` — one "Filters" button (count when applied, opens the rule
 * builder), sort, search, view switcher, Reset all — for small tables and cards.
 */
export const Compact: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Frame>
        <DemoFilterBar layout="compact" />
      </Frame>
      <Frame>
        <DemoFilterBar layout="compact" initial={SOME} />
      </Frame>
    </div>
  ),
};

/**
 * The optional right-hand controls on a `full` bar: search, sort, and the
 * icon-only view switcher.
 */
export const OptionalControls: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <DemoFilterBar withSearch withSort withViewSwitcher />
    </Frame>
  ),
};

/** In a **Table**: the bar goes in the `filterBar` slot, between the Action Bar and the header. */
export const InTable: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 1040 }}>
      <Table
        aria-label="Devices"
        actionBar={
          <ActionBar actions={<IconButton size="sm" variant="ghost" intent="secondary" label="Refresh" icon={<RotateCw />} />} />
        }
        filterBar={<DemoFilterBar initial={SOME} />}
        header={
          <HeaderRow>
            <HeaderCell>Device</HeaderCell>
            <HeaderCell>OS</HeaderCell>
            <HeaderCell>Status</HeaderCell>
          </HeaderRow>
        }
      >
        {[
          ['ThinkPad X1 Carbon PF4A', 'Windows 11', 'Online'],
          ['ThinkPad T14s PF4B', 'Windows 10', 'Online'],
          ['ThinkCentre M90q PF4C', 'Windows 11', 'Online'],
        ].map(([d, o, s], i) => (
          <DataRow key={d} stripe={i % 2 ? 'inverse' : 'default'} checkboxLabel={`Select ${d}`}>
            <DataCell>{d}</DataCell>
            <DataCell>{o}</DataCell>
            <DataCell>{s}</DataCell>
          </DataRow>
        ))}
      </Table>
    </div>
  ),
};

/**
 * QA matrix: full and compact, idle and applied. Audit it under light, dark, and
 * win hct with the **Theme** toolbar.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Frame>
        <DemoFilterBar />
      </Frame>
      <Frame>
        <DemoFilterBar initial={SOME} />
      </Frame>
      <Frame>
        <DemoFilterBar layout="compact" />
      </Frame>
      <Frame>
        <DemoFilterBar layout="compact" initial={SOME} />
      </Frame>
    </div>
  ),
};

/** Reset all clears every filter: menus go back to outline, the rule count clears, Reset all disables. */
export const ResetClearsAll: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Frame>
      <DemoFilterBar initial={SOME} onResetAll={args.onResetAll} />
    </Frame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Status: Online' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'OS type: 2 selected' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Advanced filters 1' })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Reset all' }));
    await expect(args.onResetAll).toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'Status' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'OS type' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Advanced filters' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Reset all' })).toBeDisabled();
  },
};
