import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fn, userEvent, within, screen } from 'storybook/test';

import { RowsPerPage } from './RowsPerPage';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination/Rows Per Page',
  component: RowsPerPage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The page-size control that sits alongside **Pagination** (Figma "row select",
node 134:8568): a "Rows per page:" label, a numeric dropdown, and the
"1-25 of 123" range readout. Together they make a table footer.

Pure composition — the dropdown is the existing **NumberDropdown**, which is
Radix \`Select\` underneath (that's where Figma's \`with menu\` state comes from,
including the menu's hello pc **Scrollbar**). This component supplies only the
label, the layout, and the range text, so there's nothing rebuilt here.

## Usage

\`\`\`tsx
import { RowsPerPage, Pagination } from '@/hellopc/components/Pagination';

<RowsPerPage
  options={[10, 25, 50, 100]}
  value={pageSize}
  onValueChange={setPageSize}
  page={page}
  total={123}
/>

// the range readout is computed from page x value, clamped to total —
// or replace it entirely
<RowsPerPage total={123} page={5} rangeLabel="Showing the last batch" />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| label / range text | \`--type-size-body\` (14px), \`--font-weight-regular\`, \`--color-text-icon-primary\`, 0.2px tracking |
| label ↔ dropdown gap | \`--space-300\` (16px) |
| group gap | \`--space-500\` (24px) |
| dropdown | **NumberDropdown** \`size="md"\` (40px) — its own tokens |

## Accessibility

- The dropdown takes its accessible name from \`label\` (the trailing colon is
  stripped), so it's announced as "Rows per page" rather than an unnamed combo
  box.
- The range readout is plain text next to the control. If your table updates
  live as the page size changes, put the readout in an \`aria-live="polite"\`
  region at the page level so the change is announced.
- Everything keyboard-operable comes from Radix \`Select\` via NumberDropdown.

## Do / Don't

| Do | Don't |
| --- | --- |
| Offer a short, predictable set of sizes (10/25/50/100). | Offer twenty arbitrary page sizes. |
| Pass \`total\` and \`page\` so the range stays truthful. | Hand-write a range that can drift from the data. |
| Reset to page 1 when the page size changes. | Leave the user on a page that no longer exists. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    options: [10, 25, 50, 100],
    defaultValue: 25,
    label: 'Rows per page:',
    total: 123,
    page: 1,
  },
  argTypes: {
    options: { control: false, table: { category: 'Content' } },
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: 'number', table: { category: 'State' } },
    label: { control: 'text', table: { category: 'Content' } },
    total: { control: 'number', table: { category: 'Content' } },
    page: { control: 'number', table: { category: 'Content' } },
    rangeLabel: { control: 'text', table: { category: 'Content' } },
    onValueChange: { action: 'rows per page change', table: { category: 'Events' } },
  },
} satisfies Meta<typeof RowsPerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive the control from the Controls panel. */
export const Playground: Story = {};

export const Default: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma `style=without menu` — the resting state. Opening the dropdown ' +
          'gives Figma’s `with menu` state, which NumberDropdown already owns.',
      },
    },
  },
  render: () => <RowsPerPage total={123} page={1} defaultValue={25} />,
};

export const RangeReadout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The range is computed from `page` × the selected size and clamped to ' +
          '`total`, so the final page reads "101-123 of 123" rather than ' +
          'overshooting. Omit `total` to hide it.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RowsPerPage total={123} page={1} defaultValue={25} />
      <RowsPerPage total={123} page={5} defaultValue={25} />
      <RowsPerPage total={0} page={1} defaultValue={25} />
      <RowsPerPage defaultValue={25} />
    </div>
  ),
};

export const TableFooter: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'padded',
    docs: {
      description: {
        story:
          'The intended pairing: **Rows Per Page** on one side, **Pagination** on ' +
          'the other. Changing the page size resets to page 1 so the user never ' +
          'lands on a page that no longer exists.',
      },
    },
  },
  render: function Footer() {
    const total = 123;
    const [size, setSize] = React.useState(25);
    const [page, setPage] = React.useState(1);
    const count = Math.max(1, Math.ceil(total / size));
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
          width: 820,
          maxWidth: '100%',
        }}
      >
        <RowsPerPage
          total={total}
          page={page}
          value={size}
          onValueChange={(next) => {
            setSize(next);
            setPage(1);
          }}
        />
        <Pagination count={count} maxPageButtons={4} page={page} onPageChange={setPage} />
      </div>
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: each page size, a custom `rangeLabel`, and a custom label. ' +
          'Audit under both themes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RowsPerPage total={123} page={1} defaultValue={10} />
      <RowsPerPage total={123} page={2} defaultValue={50} />
      <RowsPerPage total={123} page={1} rangeLabel="Showing everything" />
      <RowsPerPage label="Items per page:" total={40} page={1} defaultValue={10} />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): picking a size fires the change. */
const sized = fn();
export const PickingSizeFires: Story = {
  tags: ['!autodocs'],
  render: () => <RowsPerPage total={123} page={1} defaultValue={25} onValueChange={sized} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    sized.mockClear();

    await expect(canvas.getByText('1-25 of 123')).toBeInTheDocument();

    // the dropdown is named from `label`, minus the trailing colon
    await userEvent.click(canvas.getByRole('combobox', { name: 'Rows per page' }));
    await userEvent.click(await screen.findByRole('option', { name: '50' }));
    await expect(sized).toHaveBeenCalledWith(50);
  },
};
