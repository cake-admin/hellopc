import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Info } from 'lucide-react';

import { DataRow, DataCell } from './DataRow';
import { HeaderRow, HeaderCell } from './HeaderRow';
import { Chip } from '../Chip/Chip';
import { Badge } from '../Badge/Badge';

/** A fixed-width table frame so a row renders at a realistic column width. */
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

/** The trailing row action used across the examples — a static info affordance. */
const InfoAction = (
  <span
    aria-hidden
    style={{
      display: 'inline-flex',
      width: 24,
      height: 24,
      color: 'var(--color-text-icon-secondary)',
    }}
  >
    <Info width="100%" height="100%" strokeWidth={2} />
  </span>
);

/** The demo columns reused by most stories (text · chip · badge · tag). */
const DemoCells = ({ disabled = false }: { disabled?: boolean }) => (
  <>
    <DataCell>Text</DataCell>
    <DataCell>
      <Chip type="primary" size="sm" leadingIcon={<Info aria-hidden />} disabled={disabled}>
        Text
      </Chip>
    </DataCell>
    <DataCell>
      <Badge color="secondary" tone="subtle" dot={false}>
        Tag
      </Badge>
    </DataCell>
    <DataCell>
      <Badge color={disabled ? 'disabled' : 'green'}>Online</Badge>
    </DataCell>
  </>
);

const meta = {
  title: 'Components/Table/Data Row',
  component: DataRow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A single record in a table body (Figma \`DataRow\`, node 171:9843). It lays out a
fixed leading rail with a selection **Checkbox**, a flexible run of **Data
Cell**s (the record's columns), and a fixed trailing rail for a row action.
Pair it with **Header Row** above the body so columns line up; alternate
\`stripe\` per row for zebra banding.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

The row composes what already exists rather than rebuilding it: the leading
control is the hello pc **Checkbox**, and cells hold arbitrary content — a plain
string becomes truncating body text, while richer cells take a **Chip**, a
**Badge**, or any node. It renders ARIA grid semantics (\`role="row"\` /
\`role="gridcell"\`), so drop it inside a container that supplies \`role="table"\`
and row groups (the examples here use a small frame for that).

The Figma \`state\` axis collapses into props: \`stripe\` (default / inverse
banding), \`selected\` (tonal highlight + checked box), hover lift on every
non-disabled non-selected row, \`interactive\` (pointer cursor for click-through
rows), and \`disabled\`.

## Usage

\`\`\`tsx
import { DataRow, DataCell } from '@/hellopc/components/Table';

// a basic row
<DataRow onSelectedChange={setSelected}>
  <DataCell>Ada Lovelace</DataCell>
  <DataCell>Engineering</DataCell>
</DataRow>

// zebra banding — alternate per index
<DataRow stripe={i % 2 ? 'inverse' : 'default'}>{cells}</DataRow>

// selected + a trailing action
<DataRow selected action={<InfoIcon />}>{cells}</DataRow>

// a click-through row
<DataRow interactive onClick={openDetail}>{cells}</DataRow>

// read-only table (no checkbox, rail kept for alignment)
<DataRow selectable={false}>{cells}</DataRow>

// richer cells reuse existing pills
<DataCell><Badge color="green">Online</Badge></DataCell>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| row · default stripe | \`--color-surfaces-container\` |
| row · inverse stripe | \`--color-surfaces-on-container-high\` |
| row · hover | \`--color-surfaces-on-container\` + \`--elevation-0\` |
| row · selected | \`--color-tonal-tonal-lightest\` |
| row · disabled | \`--color-disabled-disabled\` bg, \`--color-disabled-disabled-inverse\` text |
| cell rule | \`--stroke-100\` top/bottom, \`--color-stroke-border-low\` |
| cell padding | \`--space-150\` (10px) × \`--space-100\` (8px) |
| cell text | \`--type-size-body\` (14px), \`--font-weight-regular\`, \`--color-text-icon-primary\` |
| selection control | **Checkbox** (Radix, own tokens) |
| rail width / row height | 48px (intrinsic geometry, Figma 171:9843) |

## Accessibility

- The row is \`role="row"\`; its parts are \`role="gridcell"\`. Compose inside a
  container with \`role="table"\` / \`role="rowgroup"\` (or a native \`<table>\`
  wrapper) — a lone row is not a complete grid.
- Selection state is announced via \`aria-selected\`; the checkbox carries an
  \`aria-label\` (\`checkboxLabel\`, default "Select row") since it has no visible
  text.
- \`disabled\` sets \`aria-disabled\` and disables the checkbox; it does not remove
  the row from the accessibility tree.
- Focus lives on the real controls (the **Checkbox**, any action button) with
  their own token focus rings — the row background is never the only signal.

## Do / Don't

| Do | Don't |
| --- | --- |
| Alternate \`stripe\` per row for readable banding | Randomly mix stripes — the pattern should track row parity |
| Reuse **Chip** / **Badge** inside cells | Re-draw pills or status dots by hand in a cell |
| Set \`interactive\` when the whole row navigates on click | Rely on \`interactive\` for hover — hover lift is the default |
| Give the checkbox a meaningful \`checkboxLabel\` | Leave it as "Select row" when a name column exists ("Select Ada Lovelace") |
| Keep the same column count as the **Header Row** | Let body columns drift out of alignment with the header |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    stripe: 'default',
    selected: false,
    disabled: false,
    interactive: false,
    selectable: true,
    checkboxLabel: 'Select row',
    onSelectedChange: fn(),
  },
  argTypes: {
    children: { control: false, table: { category: 'Content' } },
    action: { control: false, table: { category: 'Content' } },
    checkboxLabel: { control: 'text', table: { category: 'Content' } },
    stripe: {
      control: 'inline-radio',
      options: ['default', 'inverse'],
      table: { category: 'Appearance' },
    },
    selected: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    interactive: { control: 'boolean', table: { category: 'State' } },
    selectable: { control: 'boolean', table: { category: 'State' } },
    onSelectedChange: { action: 'selectedChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof DataRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => (
    <Frame>
      <DataRow {...args} action={InfoAction}>
        <DemoCells disabled={args.disabled} />
      </DataRow>
    </Frame>
  ),
};

/**
 * Zebra banding: alternate `stripe="default"` and `stripe="inverse"` per row so
 * long tables stay readable.
 */
export const Stripes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <DataRow stripe="default" action={InfoAction}>
        <DemoCells />
      </DataRow>
      <DataRow stripe="inverse" action={InfoAction}>
        <DemoCells />
      </DataRow>
      <DataRow stripe="default" action={InfoAction}>
        <DemoCells />
      </DataRow>
    </Frame>
  ),
};

/**
 * The stateful treatments: a `selected` row (tonal highlight + checked box), a
 * default row (hover it for the Figma lift), and a `disabled` row. Selected uses
 * `--color-tonal-tonal-lightest`; disabled uses `--color-disabled-disabled`.
 */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <DataRow selected action={InfoAction}>
        <DemoCells />
      </DataRow>
      <DataRow action={InfoAction}>
        <DemoCells />
      </DataRow>
      <DataRow disabled action={InfoAction}>
        <DemoCells disabled />
      </DataRow>
    </Frame>
  ),
};

/**
 * Cells hold any content. A plain string truncates as 14px body text; pass a
 * **Chip**, a **Badge**, or a tag pill for richer columns — all reused, not
 * redrawn.
 */
export const CellContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <DataRow action={InfoAction}>
        <DataCell>Plain text</DataCell>
        <DataCell>
          <Chip type="primary" size="sm" leadingIcon={<Info aria-hidden />}>
            Chip
          </Chip>
        </DataCell>
        <DataCell>
          <Badge color="secondary" tone="subtle" dot={false}>
            Tag
          </Badge>
        </DataCell>
        <DataCell>
          <Badge color="green">Online</Badge>
        </DataCell>
      </DataRow>
    </Frame>
  ),
};

/**
 * A read-only table needs no selection: `selectable={false}` drops the checkbox
 * but keeps the leading rail so rows still align under the header.
 */
export const WithoutSelection: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <DataRow selectable={false} action={InfoAction}>
        <DemoCells />
      </DataRow>
      <DataRow selectable={false} stripe="inverse" action={InfoAction}>
        <DemoCells />
      </DataRow>
    </Frame>
  ),
};

/**
 * QA matrix — a full striped body with a header, covering both stripes plus the
 * selected and disabled states. Audit it under both themes with the **Theme**
 * toolbar.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <HeaderRow>
        <HeaderCell>Name</HeaderCell>
        <HeaderCell>Plan</HeaderCell>
        <HeaderCell>Team</HeaderCell>
        <HeaderCell active>Status</HeaderCell>
      </HeaderRow>
      <DataRow stripe="default" action={InfoAction}>
        <DemoCells />
      </DataRow>
      <DataRow stripe="inverse" action={InfoAction}>
        <DemoCells />
      </DataRow>
      <DataRow selected action={InfoAction}>
        <DemoCells />
      </DataRow>
      <DataRow disabled action={InfoAction}>
        <DemoCells disabled />
      </DataRow>
    </Frame>
  ),
};

/** Toggling the leading checkbox fires `onSelectedChange` with the next state. */
export const SelectionFires: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Frame>
      <DataRow {...args} action={InfoAction}>
        <DemoCells />
      </DataRow>
    </Frame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select row' }));
    await expect(args.onSelectedChange).toHaveBeenCalledWith(true);
  },
};
