import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MoreVertical } from 'lucide-react';

import { GroupRow } from './GroupRow';
import { DataRow, DataCell } from './DataRow';
import { HeaderRow, HeaderCell } from './HeaderRow';
import { Table } from './Table';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';

/**
 * A fixed-width native `<table>` frame so a group row renders at a realistic
 * width (block display, like **Table**).
 */
const Frame = ({ children, width = 720 }: { children: React.ReactNode; width?: number }) => (
  <table
    aria-label="Grouped requests"
    style={{
      display: 'block',
      boxSizing: 'content-box',
      width,
      borderCollapse: 'collapse',
      border: '1px solid var(--color-stroke-border)',
      borderRadius: 'var(--radius-150)',
      overflow: 'hidden',
    }}
  >
    <tbody style={{ display: 'block' }}>{children}</tbody>
  </table>
);

const GroupAction = (
  <Button size="sm" intent="secondary" variant="outline">
    Group action
  </Button>
);

const More = (label: string) => (
  <IconButton size="sm" variant="ghost" intent="secondary" label={label} icon={<MoreVertical />} />
);

/** Columns: rail + 3 cells + rail. */
const COLS = 5;

const meta = {
  title: 'Components/Table/Group Row',
  component: GroupRow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The header row for a group of table rows (Figma \`hellopc.table.row.group\`, node
18237:263) — a request and its items, a fleet and its devices. A chevron toggle
expands or collapses the group; a title sits over a meta line, with an optional
status **Badge**, one group-level action and a "more" menu at the trailing edge.
Use it when rows have a natural parent; for a flat list, filter or sort instead.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

It renders a native \`<tr>\` with one \`<td>\` spanning the table (\`colSpan\`), and
composes existing pieces: the toggle is an **IconButton** (\`size="sm"\`, ghost),
the action a **Button** (\`size="sm"\`, secondary outline), the status a
**Badge**. \`expanded\` works controlled (with \`onExpandedChange\`) or
uncontrolled (\`defaultExpanded\`); render the member **Data Row**s after it only
while expanded. There is no count and no select-all on the group row.

## Usage

\`\`\`tsx
<GroupRow title="Group title" meta="Created 18 Mar 2025 · Due 12 Jun 2025" colSpan={5} />
<GroupRow title="Q3 refresh" status={<Badge color="amber">Draft</Badge>} colSpan={5} />
<GroupRow title="Q3 refresh" action={<Button size="sm" intent="secondary" variant="outline">Approve</Button>} />
<GroupRow title="Q3 refresh" more={<IconButton size="sm" variant="ghost" intent="secondary" label="More for Q3 refresh" icon={<MoreVertical />} />} />
<GroupRow title="Q3 refresh" expanded={open} onExpandedChange={setOpen} controls="r1 r2" />
{open && <DataRow id="r1">…</DataRow>}
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| row background | \`--color-surfaces-on-container-low\` |
| bottom rule | \`--stroke-100\` · \`--color-stroke-border\` |
| padding | \`--space-100\` top/bottom/left (8px), \`--space-300\` right (16px) |
| item gap | \`--space-200\` (12px) |
| title | \`--type-size-body\` (14px), \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| meta | \`--type-size-caption\` (12px), \`--font-weight-regular\`, \`--color-text-icon-secondary\` |
| title ↔ meta gap | \`--space-025\` (2px) |
| toggle / more | **IconButton** \`size="sm"\` (32px) \`variant="ghost"\` \`intent="secondary"\` |
| action | **Button** \`size="sm"\` \`intent="secondary"\` \`variant="outline"\` |
| status | **Badge** (own tokens) |
| row height | 56px (intrinsic geometry, Figma 18237:263) |

## Accessibility

- The chevron is a disclosure button: \`aria-expanded\` reflects the state and
  \`aria-controls\` lists the member rows (\`controls\`, space-separated ids). Its
  name is "Expand <title>" / "Collapse <title>" — pass \`toggleLabel\` when the
  title is not plain text.
- Member rows stay ordinary table rows (no treegrid), so screen-reader table
  navigation keeps working and no roving-focus model is needed.
- Set \`colSpan\` to the table's column count (cells + both rails) so the row's
  single cell spans the grid.
- Give the "more" **IconButton** a group-specific label ("More for Q3 refresh").

## Do / Don't

| Do | Don't |
| --- | --- |
| Group rows that share a real parent (request → items) | Use group rows as decorative section dividers |
| Keep one group-level action; put the rest in "more" | Line up several buttons on the group row |
| Render member rows only while expanded | Hide members with CSS while keeping them in the tab order |
| Show status with a **Badge** | Encode status in the title text color |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: 'Group title',
    meta: 'Created 18 Mar 2025 · Due 12 Jun 2025',
    defaultExpanded: false,
    colSpan: COLS,
    onExpandedChange: fn(),
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    meta: { control: 'text', table: { category: 'Content' } },
    status: { control: false, table: { category: 'Content' } },
    action: { control: false, table: { category: 'Content' } },
    more: { control: false, table: { category: 'Content' } },
    toggleLabel: { control: 'text', table: { category: 'Content' } },
    expanded: { control: 'boolean', table: { category: 'State' } },
    defaultExpanded: { control: 'boolean', table: { category: 'State' } },
    controls: { control: 'text', table: { category: 'Behavior' } },
    colSpan: { control: 'number', table: { category: 'Behavior' } },
    onExpandedChange: { action: 'expandedChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof GroupRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => (
    <Frame>
      <GroupRow
        {...args}
        status={<Badge color="amber">Draft</Badge>}
        action={GroupAction}
        more={More('More for group')}
      />
    </Frame>
  ),
};

/**
 * Collapsed (chevron right) and expanded (chevron down) — Figma `expanded`.
 * The rest of the row is identical in both states.
 */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <GroupRow
        title="Group title"
        meta="Created 18 Mar 2025 · Due 12 Jun 2025"
        status={<Badge color="amber">Draft</Badge>}
        action={GroupAction}
        more={More('More for collapsed group')}
        colSpan={COLS}
      />
      <GroupRow
        title="Group title"
        meta="Created 18 Mar 2025 · Due 12 Jun 2025"
        status={<Badge color="amber">Draft</Badge>}
        action={GroupAction}
        more={More('More for expanded group')}
        defaultExpanded
        colSpan={COLS}
      />
    </Frame>
  ),
};

/**
 * Every slot is optional (Figma `showMeta` / `showStatus` / `showAction` /
 * `showMore`): from the full row down to a title-only group.
 */
export const Slots: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <GroupRow
        title="Full"
        meta="Meta line"
        status={<Badge color="amber">Draft</Badge>}
        action={GroupAction}
        more={More('More for Full')}
        colSpan={COLS}
      />
      <GroupRow title="No status" meta="Meta line" action={GroupAction} colSpan={COLS} />
      <GroupRow title="No meta" status={<Badge color="green">Approved</Badge>} more={More('More for No meta')} colSpan={COLS} />
      <GroupRow title="Title only" colSpan={COLS} />
    </Frame>
  ),
};

type Item = { id: string; name: string; qty: string; status: string };
const GROUPS: { id: string; title: string; meta: string; draft: boolean; items: Item[] }[] = [
  {
    id: 'g1',
    title: 'Q3 laptop refresh',
    meta: 'Created 18 Mar 2025 · Due 12 Jun 2025',
    draft: true,
    items: [
      { id: 'g1-1', name: 'ThinkPad X1 Carbon', qty: '24', status: 'Pending' },
      { id: 'g1-2', name: 'ThinkPad T14s', qty: '12', status: 'Pending' },
    ],
  },
  {
    id: 'g2',
    title: 'New hire kits',
    meta: 'Created 2 Apr 2025 · Due 30 Apr 2025',
    draft: false,
    items: [
      { id: 'g2-1', name: 'ThinkVision P27h', qty: '8', status: 'Shipped' },
      { id: 'g2-2', name: 'ThinkPad USB-C Dock', qty: '8', status: 'Shipped' },
    ],
  },
];

function GroupedTable() {
  const [open, setOpen] = React.useState<Record<string, boolean>>({ g1: true, g2: false });
  return (
    <div style={{ width: 720 }}>
      <Table
        aria-label="Purchase requests"
        header={
          <HeaderRow>
            <HeaderCell>Item</HeaderCell>
            <HeaderCell>Quantity</HeaderCell>
            <HeaderCell>Status</HeaderCell>
          </HeaderRow>
        }
      >
        {GROUPS.map((g) => (
          <React.Fragment key={g.id}>
            <GroupRow
              title={g.title}
              meta={g.meta}
              status={g.draft ? <Badge color="amber">Draft</Badge> : undefined}
              action={
                <Button size="sm" intent="secondary" variant="outline">
                  {g.draft ? 'Submit' : 'Track'}
                </Button>
              }
              more={More(`More for ${g.title}`)}
              expanded={open[g.id]}
              onExpandedChange={(next) => setOpen((o) => ({ ...o, [g.id]: next }))}
              controls={g.items.map((i) => i.id).join(' ')}
              colSpan={COLS}
            />
            {open[g.id]
              ? g.items.map((i, n) => (
                  <DataRow
                    key={i.id}
                    id={i.id}
                    stripe={n % 2 ? 'inverse' : 'default'}
                    checkboxLabel={`Select ${i.name}`}
                  >
                    <DataCell>{i.name}</DataCell>
                    <DataCell>{i.qty}</DataCell>
                    <DataCell>{i.status}</DataCell>
                  </DataRow>
                ))
              : null}
          </React.Fragment>
        ))}
      </Table>
    </div>
  );
}

/**
 * Group rows inside a **Table**: each group's member **Data Row**s render only
 * while it is expanded, and the toggle's `aria-controls` lists their ids.
 */
export const InTable: Story = {
  parameters: { controls: { disable: true } },
  render: () => <GroupedTable />,
};

/**
 * QA matrix — collapsed/expanded × full/minimal slots, over member rows.
 * Audit it under light, dark, and win hct with the **Theme** toolbar.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Frame>
        <GroupRow
          title="Collapsed · full"
          meta="Created 18 Mar 2025 · Due 12 Jun 2025"
          status={<Badge color="amber">Draft</Badge>}
          action={GroupAction}
          more={More('More for collapsed full')}
          colSpan={COLS}
        />
        <GroupRow title="Collapsed · minimal" colSpan={COLS} />
      </Frame>
      <GroupedTable />
    </div>
  ),
};

/** Clicking the chevron fires `onExpandedChange` and flips `aria-expanded` and the name. */
export const ExpandToggles: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Frame>
      <GroupRow {...args} />
    </Frame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Expand Group title' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    await expect(args.onExpandedChange).toHaveBeenCalledWith(true);
    const collapse = canvas.getByRole('button', { name: 'Collapse Group title' });
    await expect(collapse).toHaveAttribute('aria-expanded', 'true');
  },
};
