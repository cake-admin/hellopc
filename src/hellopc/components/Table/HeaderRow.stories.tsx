import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Plus, ArrowUpDown } from 'lucide-react';

import { HeaderRow, HeaderCell } from './HeaderRow';
import { DataRow, DataCell } from './DataRow';
import { IconButton } from '../Button/IconButton';
import { Badge } from '../Badge/Badge';

/** A fixed-width table frame so the header renders at a realistic column width. */
const Frame = ({ children, width = 640 }: { children: React.ReactNode; width?: number }) => (
  <div
    role="table"
    style={{
      width,
      border: '1px solid var(--color-stroke-border)',
      borderRadius: 'var(--radius-150)',
      overflow: 'hidden',
    }}
  >
    <div role="rowgroup">{children}</div>
  </div>
);

const meta = {
  title: 'Components/Table/Header Row',
  component: HeaderRow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The column-label row for a table (Figma \`HeaderRow\`, node 171:9834). It mirrors
**Data Row**'s three-part frame — an empty leading rail over the selection
checkbox, a flexible run of **Header Cell**s, and an empty trailing rail over
the row action — so every header sits directly above its column.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

A cell is a medium-weight label plus an optional \`actions\` slot for column
controls (sort, add, filter). Those controls are existing **IconButton**s
(\`size="xs"\`), not a bespoke widget — the header composes what already exists.
Set \`active\` to color a label with the primary token when its column is sorted
or emphasized. It renders ARIA grid semantics (\`role="row"\` /
\`role="columnheader"\`); compose it inside a container that supplies
\`role="table"\` and a header row group.

## Usage

\`\`\`tsx
import { HeaderRow, HeaderCell } from '@/hellopc/components/Table';
import { IconButton } from '@/hellopc/components/Button';

<HeaderRow>
  <HeaderCell>Name</HeaderCell>
  <HeaderCell>Plan</HeaderCell>

  {/* a sortable / emphasized column */}
  <HeaderCell active actions={<IconButton size="xs" variant="tonal" label="Sort" icon={<ArrowUpDown />} />}>
    Status
  </HeaderCell>

  {/* multiple column controls */}
  <HeaderCell
    active
    actions={
      <>
        <IconButton size="xs" variant="tonal" label="Sort team" icon={<ArrowUpDown />} />
        <IconButton size="xs" variant="ghost" label="Add team" icon={<Plus />} />
      </>
    }
  >
    Team
  </HeaderCell>
</HeaderRow>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| header background | \`--color-surfaces-container\` |
| cell rule | \`--stroke-100\` bottom, \`--color-stroke-border\` |
| cell padding / gap | \`--space-100\` (8px) padding, \`--space-100\` label gap, \`--space-050\` action gap |
| label | \`--type-size-body\` (14px), \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| label · active | \`--color-primary-primary\` |
| column controls | **IconButton** \`size="xs"\` (24px, 16px icon) |
| rail width / row height | 48px (intrinsic geometry, Figma 171:9834) |

## Accessibility

- The row is \`role="row"\`; label cells are \`role="columnheader"\`, so a table
  container (\`role="table"\` / native \`<table>\`) can associate them with the body
  cells below.
- Each column control is an **IconButton** with a required \`label\` — screen
  readers announce "Sort", "Add", etc. even though only the icon shows.
- \`active\` is a visual emphasis (primary label color); pair it with the control's
  own \`aria-pressed\`/\`aria-sort\` on the container when you wire real sorting —
  color alone is not the sort signal.

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep one **Header Cell** per body column | Merge two columns under one header and let the body drift |
| Use **IconButton** \`actions\` for sort/add/filter | Build a custom clickable label to fake a control |
| Mark the sorted column \`active\` | Color several headers primary at once — emphasis loses meaning |
| Give every control a clear \`label\` | Ship icon-only controls with no accessible name |
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: false, table: { category: 'Content' } },
  },
} satisfies Meta<typeof HeaderRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: () => (
    <Frame>
      <HeaderRow>
        <HeaderCell>Name</HeaderCell>
        <HeaderCell>Plan</HeaderCell>
        <HeaderCell>Team</HeaderCell>
        <HeaderCell>Status</HeaderCell>
      </HeaderRow>
    </Frame>
  ),
};

/**
 * A plain header — four medium-weight labels, one per column, over an empty
 * leading/trailing rail.
 */
export const Labels: Story = {
  render: () => (
    <Frame>
      <HeaderRow>
        <HeaderCell>Name</HeaderCell>
        <HeaderCell>Plan</HeaderCell>
        <HeaderCell>Team</HeaderCell>
        <HeaderCell>Status</HeaderCell>
      </HeaderRow>
    </Frame>
  ),
};

/**
 * Column controls live in each cell's `actions` slot as `xs` **IconButton**s —
 * one for a single sort, two where a column also adds. The `active` column shows
 * the primary label color.
 */
export const WithActions: Story = {
  render: () => (
    <Frame>
      <HeaderRow>
        <HeaderCell>Name</HeaderCell>
        <HeaderCell>Plan</HeaderCell>
        <HeaderCell
          active
          actions={
            <IconButton size="xs" variant="tonal" label="Sort team" icon={<ArrowUpDown />} />
          }
        >
          Team
        </HeaderCell>
        <HeaderCell
          active
          actions={
            <>
              <IconButton
                size="xs"
                variant="tonal"
                label="Sort status"
                icon={<ArrowUpDown />}
              />
              <IconButton size="xs" variant="ghost" label="Add status" icon={<Plus />} />
            </>
          }
        >
          Status
        </HeaderCell>
      </HeaderRow>
    </Frame>
  ),
};

/**
 * The header over a small body, showing columns aligned to their **Data Row**s.
 * Audit it under both themes with the **Theme** toolbar.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <HeaderRow>
        <HeaderCell>Name</HeaderCell>
        <HeaderCell>Plan</HeaderCell>
        <HeaderCell
          active
          actions={
            <IconButton size="xs" variant="tonal" label="Sort status" icon={<ArrowUpDown />} />
          }
        >
          Status
        </HeaderCell>
      </HeaderRow>
      <DataRow>
        <DataCell>Ada Lovelace</DataCell>
        <DataCell>Pro</DataCell>
        <DataCell>
          <Badge color="green">Online</Badge>
        </DataCell>
      </DataRow>
      <DataRow stripe="inverse">
        <DataCell>Alan Turing</DataCell>
        <DataCell>Team</DataCell>
        <DataCell>
          <Badge color="secondary" tone="subtle" dot={false}>
            Away
          </Badge>
        </DataCell>
      </DataRow>
    </Frame>
  ),
};
