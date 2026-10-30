import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  RotateCw,
  Search,
  ChevronDown,
  Tag as TagIcon,
  FolderPlus,
  Trash2,
  ArrowUpDown,
  Info,
} from 'lucide-react';

import { Table, TableFooter } from './Table';
import { ActionBar } from './ActionBar';
import { HeaderRow, HeaderCell } from './HeaderRow';
import { DataRow, DataCell } from './DataRow';
import { IconButton } from '../Button/IconButton';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

/** Sample records for the demo table. */
type Person = { id: number; name: string; plan: string; team: string; online: boolean };

const NAMES = [
  'Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson', 'Edsger Dijkstra',
  'Barbara Liskov', 'Donald Knuth', 'Margaret Hamilton', 'Linus Torvalds', 'Radia Perlman',
  'Ken Thompson', 'Frances Allen', 'Tim Berners-Lee', 'Adele Goldberg', 'Vint Cerf',
  'Shafi Goldwasser', 'John McCarthy', 'Karen Spärck Jones', 'Dennis Ritchie', 'Sophie Wilson',
  'Guido van Rossum', 'Anita Borg', 'Bjarne Stroustrup',
];
const PLANS = ['Free', 'Pro', 'Team', 'Enterprise'];
const TEAMS = ['Platform', 'Design', 'Research', 'Infra'];

const ROWS: Person[] = NAMES.map((name, i) => ({
  id: i + 1,
  name,
  plan: PLANS[i % PLANS.length],
  team: TEAMS[i % TEAMS.length],
  online: i % 3 !== 0,
}));

/** The trailing per-row info affordance. */
const InfoAction = (
  <span aria-hidden style={{ display: 'inline-flex', width: 24, height: 24, color: 'var(--color-text-icon-secondary)' }}>
    <Info width="100%" height="100%" strokeWidth={2} />
  </span>
);

const BulkActions = (
  <>
    <Button size="sm" variant="tonal" intent="primary" endIcon={<ChevronDown />}>Action</Button>
    <Button size="sm" variant="tonal" intent="secondary" startIcon={<TagIcon />}>Label</Button>
    <Button size="sm" variant="tonal" intent="secondary" startIcon={<FolderPlus />}>Group</Button>
    <Button size="sm" variant="tonal" intent="secondary" startIcon={<Trash2 />}>Delete</Button>
  </>
);

/**
 * A fully-wired demo table: composes the parts, holds the paging + selection
 * state, and drives select-all ↔ per-row checkboxes exactly as an app would.
 */
function DemoTable({
  pageSize = 7,
  maxBodyHeight,
  interactive = false,
}: {
  pageSize?: number;
  maxBodyHeight?: number | string;
  interactive?: boolean;
}) {
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const pageRows = maxBodyHeight != null ? ROWS : ROWS.slice((page - 1) * pageSize, page * pageSize);
  const pageIds = pageRows.map((r) => r.id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someSelected = pageIds.some((id) => selected.has(id));
  const headerChecked: boolean | 'indeterminate' = allSelected ? true : someSelected ? 'indeterminate' : false;

  const toggleAll = (checked: boolean | 'indeterminate') => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked === true) pageIds.forEach((id) => next.add(id));
      else pageIds.forEach((id) => next.delete(id));
      return next;
    });
  };
  const toggleRow = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div style={{ width: 680 }}>
      <Table
        aria-label="Team members"
        maxBodyHeight={maxBodyHeight}
        actionBar={
          <ActionBar
            checked={headerChecked}
            onCheckedChange={toggleAll}
            selected={someSelected}
            actions={<IconButton size="sm" variant="ghost" intent="secondary" label="Refresh" icon={<RotateCw />} />}
            selectedActions={BulkActions}
            end={<IconButton size="sm" variant="ghost" intent="secondary" label="Search" icon={<Search />} />}
          />
        }
        header={
          <HeaderRow>
            <HeaderCell>Name</HeaderCell>
            <HeaderCell>Plan</HeaderCell>
            <HeaderCell active actions={<IconButton size="xs" variant="tonal" label="Sort team" icon={<ArrowUpDown />} />}>
              Team
            </HeaderCell>
            <HeaderCell active actions={<IconButton size="xs" variant="tonal" label="Sort status" icon={<ArrowUpDown />} />}>
              Status
            </HeaderCell>
          </HeaderRow>
        }
        footer={
          maxBodyHeight != null ? undefined : (
            <TableFooter page={page} pageSize={pageSize} total={ROWS.length} onPageChange={setPage} maxPageButtons={7} />
          )
        }
      >
        {pageRows.map((r, i) => (
          <DataRow
            key={r.id}
            stripe={i % 2 ? 'inverse' : 'default'}
            selected={selected.has(r.id)}
            interactive={interactive}
            onSelectedChange={() => toggleRow(r.id)}
            checkboxLabel={`Select ${r.name}`}
            action={InfoAction}
          >
            <DataCell>{r.name}</DataCell>
            <DataCell>{r.plan}</DataCell>
            <DataCell>
              <Badge color="secondary" tone="subtle" dot={false}>{r.team}</Badge>
            </DataCell>
            <DataCell>
              <Badge color={r.online ? 'green' : 'disabled'}>{r.online ? 'Online' : 'Offline'}</Badge>
            </DataCell>
          </DataRow>
        ))}
      </Table>
    </div>
  );
}

const meta = {
  title: 'Components/Table/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The assembled data table (Figma \`table templates\`, node 178:10143). It stacks
the table parts into one 4px-rounded surface: an **Action Bar** on top, a
**Header Row** over a scrollable body of **Data Row**s, and a **Table Footer**
(a results range + **Pagination**) at the bottom.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes the whole table on this
page live; nothing is hardcoded.

Table is a **composition shell, not a data grid**: it owns the frame, the ARIA
\`role="table"\` grouping, and body scrolling, while the rows, cells, selection,
and paging are the parts you pass as slots — each already token-styled and
accessible. It reuses everything built for the family (**Action Bar**,
**Header Row** / **Header Cell**, **Data Row** / **Data Cell**), plus
**Pagination** in the footer and the hello pc scrollbar look on the body.

The Figma \`state\` axis (default / hover / select / select all) isn't a set of
Table variants — it's the parts in different states: a Data Row's hover lift
and \`selected\`, and the Action Bar's \`selected\` bulk-action mode. The
examples wire the classic select-all ↔ per-row relationship in component state;
copy that pattern.

## Usage

\`\`\`tsx
import { Table, TableFooter, ActionBar, HeaderRow, HeaderCell, DataRow, DataCell }
  from '@/hellopc/components/Table';

<Table
  aria-label="Team members"
  actionBar={<ActionBar checked={headerChecked} onCheckedChange={toggleAll} selected={anySelected} … />}
  header={
    <HeaderRow>
      <HeaderCell>Name</HeaderCell>
      <HeaderCell active actions={<IconButton size="xs" variant="tonal" label="Sort" icon={<ArrowUpDown />} />}>Status</HeaderCell>
    </HeaderRow>
  }
  footer={<TableFooter page={page} pageSize={7} total={rows.length} onPageChange={setPage} maxPageButtons={7} />}
>
  {pageRows.map((r, i) => (
    <DataRow key={r.id} stripe={i % 2 ? 'inverse' : 'default'} selected={sel.has(r.id)} onSelectedChange={() => toggle(r.id)}>
      <DataCell>{r.name}</DataCell>
      <DataCell><Badge color="green">Online</Badge></DataCell>
    </DataRow>
  ))}
</Table>

// tall body → scrolls with the hello pc scrollbar; the header stays fixed above it
<Table maxBodyHeight={320} header={…}>{manyRows}</Table>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| table surface | \`--radius-50\` (4px), \`--color-surfaces-container\`, \`overflow: hidden\` |
| body scroll | \`nativeScrollbarStyles\` (\`--color-stroke-border-high\` thumb, \`--radius-50\`) |
| footer | \`--space-100\` padding, \`--space-500\` gap, right-aligned |
| footer range | \`--type-size-body\` (14px), \`--font-weight-regular\`, \`--color-text-icon-primary\` |
| footer pager | **Pagination** (\`count\` = \`ceil(total / pageSize)\`) |
| action bar | **Action Bar** (Checkbox · IconButton · tonal Button · TextInput) |
| header / body | **Header Row** / **Data Row** (own token tables) |

## Accessibility

- The grid is \`role="table"\` with an \`aria-label\` (or \`aria-labelledby\`); the
  header sits in one \`role="rowgroup"\`, the body in another, and each row/cell
  carries \`role="row"\` / \`gridcell\` / \`columnheader\`.
- The body scroll region keeps rows as direct children (native-styled overflow,
  not a nested \`ScrollArea\`) so that rowgroup → row ownership is never broken.
- The **Action Bar** (\`role="toolbar"\`) and the footer's **Pagination**
  (\`<nav>\`) are siblings of the grid, each with its own label — they're table
  chrome, not table rows.
- Mirror row selection into the Action Bar's select-all checkbox with
  \`'indeterminate'\` for a partial selection; give each row checkbox a
  record-specific \`checkboxLabel\` ("Select Ada Lovelace").

## Do / Don't

| Do | Don't |
| --- | --- |
| Compose the parts as slots and hold selection/paging in state | Expect Table to own your data or fetch pages |
| Set \`maxBodyHeight\` for long tables so the header stays fixed | Let a 500-row table push the pager off-screen |
| Keep the Header Row's column count equal to the Data Rows' | Add a header cell without a matching body column |
| Drive \`TableFooter\` from the same \`page\`/\`pageSize\` as the body | Show "1–25 of 123" while the body renders a different slice |
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: false, table: { category: 'Content' } },
    actionBar: { control: false, table: { category: 'Content' } },
    header: { control: false, table: { category: 'Content' } },
    footer: { control: false, table: { category: 'Content' } },
    maxBodyHeight: { control: 'number', table: { category: 'Appearance' } },
    'aria-label': { control: 'text', table: { category: 'Accessibility' } },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — a fully-wired table with selection and paging. */
export const Playground: Story = {
  render: () => <DemoTable />,
};

/**
 * The default assembly: Action Bar, a fixed Header Row, seven striped Data Rows,
 * and a paginated footer. Toggle a row (or select-all) to see the Action Bar
 * switch into bulk-action mode.
 */
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <DemoTable />,
};

/**
 * `interactive` adds a pointer cursor for click-through rows. Hover lift
 * (Figma `state=hover`) already applies to every non-disabled, non-selected row.
 */
export const InteractiveRows: Story = {
  parameters: { controls: { disable: true } },
  render: () => <DemoTable interactive />,
};

/**
 * A tall body capped with `maxBodyHeight` scrolls behind the hello pc scrollbar
 * while the Action Bar and Header Row stay fixed. (Paging is replaced by scroll
 * here, so the footer is omitted.)
 */
export const ScrollingBody: Story = {
  parameters: { controls: { disable: true } },
  render: () => <DemoTable maxBodyHeight={320} />,
};

/**
 * The full table for a theme/QA pass — audit it under both themes with the
 * **Theme** toolbar.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => <DemoTable />,
};

/**
 * Selecting via the Action Bar's select-all switches the bar into bulk-action
 * mode (the "Delete" button appears).
 */
export const SelectionFlow: Story = {
  tags: ['!autodocs'],
  render: () => <DemoTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // No bulk action visible until something is selected.
    expect(canvas.queryByRole('button', { name: 'Delete' })).toBeNull();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all rows' }));
    await expect(canvas.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  },
};
