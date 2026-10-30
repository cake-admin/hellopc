import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fn, userEvent, within, screen } from 'storybook/test';

import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Page navigation for a table or list (Figma "page select", node 134:8294). Pair
it with **Rows Per Page** for a complete table footer.

Figma ships four styles; they collapse into two props here:

| Figma style | Props |
| --- | --- |
| \`simple\` | \`variant="numbers"\`, no \`maxPageButtons\` — every page gets a button |
| \`complex (no menu)\` / \`complex (with menu)\` | \`variant="numbers"\` + \`maxPageButtons\` — the middle collapses into a "…" menu |
| \`dropdown\` | \`variant="dropdown"\` — a NumberDropdown + "of N pages" |

There's no Radix pagination primitive, so this follows the established
pagination accessibility pattern instead of forcing one: a \`<nav aria-label>\`
landmark wrapping a list, with the current page marked \`aria-current="page"\`.
Radix owns the parts that need real behavior — the "…" overflow is a
\`DropdownMenu\`, and the dropdown style is the Radix-\`Select\`-backed
**NumberDropdown**.

It composes what already exists rather than rebuilding it: **IconButton** for
every nav control and the "…" trigger, and **Menu Container** + **Menu Item**
for the overflow menu (which brings the hello pc **Scrollbar** along with it, so a
long page list scrolls). Every value resolves from hello pc tokens that mirror the
Figma variables 1:1, and the **Theme** toolbar re-themes each example live.

## Usage

\`\`\`tsx
import { Pagination } from '@/hellopc/components/Pagination';

// simple — every page shown
<Pagination count={5} defaultPage={1} onPageChange={setPage} />

// complex — collapse the middle once past 4 buttons
<Pagination count={13} maxPageButtons={4} page={page} onPageChange={setPage} />

// dropdown
<Pagination count={13} variant="dropdown" page={page} onPageChange={setPage} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| page button | \`--radius-1000\` pill, \`--type-size-caption\` (12px), \`--font-weight-bold\`, \`--color-surfaces-inverse-container\` |
| current page | \`--color-secondary-secondary-overlay\` + \`aria-current="page"\` |
| page hover / press | \`--color-secondary-secondary-overlay-hover\` / \`--color-tonal-tonal-secondary-overlay-press\` |
| row gap | \`--space-075\` (6px) |
| nav controls | **IconButton** \`size="sm"\` \`intent="secondary"\` \`variant="ghost"\` |
| "…" overflow trigger | **IconButton** \`size="md"\` (40px), same intent/variant |
| overflow menu | **Menu Container** + **Menu Item** (\`selected\` marks the current page) |
| "of N pages" | \`--type-size-body\` (14px), \`--color-text-icon-primary\` |
| focus ring | \`--stroke-200\` \`--color-primary-primary\` at \`--space-025\` offset |

The page button is the one piece not built from the shared \`Button\`: hello pc's
ghost/secondary Button carries a permanent underline so it reads as a link
(WCAG 1.4.1), which is wrong on a numeric pager, and Button has no
"current page" state. It's styled from the same tokens Button uses.

## Accessibility

- The pager is a \`<nav>\` landmark with an accessible name, so assistive tech
  users can jump straight to it.
- The current page is marked \`aria-current="page"\` — not conveyed by the
  background tint alone.
- Every control has a descriptive accessible name ("Go to next page", "Go to
  page 4"), so the pager isn't announced as a row of bare numbers.
- First/prev are disabled on page 1 and next/last on the final page, so
  keyboard users can't walk past the ends.
- The "…" overflow is a Radix \`DropdownMenu\`: keyboard operable, and dismissing
  it by clicking away deliberately skips Radix's focus restore so it doesn't
  paint a focus ring the user didn't ask for (Escape still restores focus,
  which keyboard users need).

## Do / Don't

| Do | Don't |
| --- | --- |
| Set \`maxPageButtons\` once a list runs past a handful of pages. | Render 50 page buttons in a row. |
| Use \`variant="dropdown"\` when space is tight. | Cram a long numeric pager into a narrow toolbar. |
| Pair it with **Rows Per Page** in a table footer. | Show a pager with no indication of total size. |
| Drive \`page\` from your data-fetching state. | Let the pager and the table disagree about the page. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    count: 13,
    defaultPage: 1,
    variant: 'numbers',
    maxPageButtons: 4,
    showFirstLast: true,
  },
  argTypes: {
    count: { control: 'number', table: { category: 'Content' } },
    page: { control: false, table: { category: 'State' } },
    defaultPage: { control: 'number', table: { category: 'State' } },
    variant: {
      control: 'inline-radio',
      options: ['numbers', 'dropdown'],
      table: { category: 'Appearance', defaultValue: { summary: 'numbers' } },
    },
    maxPageButtons: { control: 'number', table: { category: 'Behavior' } },
    showFirstLast: { control: 'boolean', table: { category: 'Behavior' } },
    label: { control: 'text', table: { category: 'Accessibility' } },
    onPageChange: { action: 'page change', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive the pager from the Controls panel. */
export const Playground: Story = {};

export const Simple: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma `style=simple` — no `maxPageButtons`, so every page gets its own ' +
          'button. The current page carries the secondary-overlay pill and ' +
          '`aria-current="page"`.',
      },
    },
  },
  render: () => <Pagination count={5} defaultPage={1} />,
};

export const Complex: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma `style=complex` — with `maxPageButtons` set, the middle of the ' +
          'range collapses behind a "…" control. Activating it opens a Radix ' +
          '`DropdownMenu` built from **Menu Container** and **Menu Item**, listing ' +
          'the hidden pages with the current one selected. The list scrolls via ' +
          'the hello pc **Scrollbar**.',
      },
    },
  },
  render: () => <Pagination count={13} maxPageButtons={4} defaultPage={1} />,
};

export const DropdownVariant: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma `style=dropdown` — a **NumberDropdown** plus "of N pages", for ' +
          'toolbars too tight for a numeric pager.',
      },
    },
  },
  render: () => <Pagination count={13} variant="dropdown" defaultPage={1} />,
};

export const Controlled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Drive `page` from your own state (and your data fetching) with ' +
          '`onPageChange`. Without `page`, the component tracks it internally ' +
          'from `defaultPage`.',
      },
    },
  },
  render: function ControlledPager() {
    const [page, setPage] = React.useState(4);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <Pagination count={13} maxPageButtons={5} page={page} onPageChange={setPage} />
        <span style={{ fontFamily: 'var(--font-family)', fontSize: 14, color: 'var(--color-text-icon-secondary)' }}>
          Showing page {page}
        </span>
      </div>
    );
  },
};

export const Boundaries: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'At the first page the first/previous controls are disabled; at the last ' +
          'page next/last are. A single-page pager disables every control.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Pagination count={13} maxPageButtons={4} defaultPage={1} />
      <Pagination count={13} maxPageButtons={4} defaultPage={13} />
      <Pagination count={1} />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: simple, collapsed, mid-range (ellipsis on both sides), ' +
          'dropdown, and without the first/last controls. Audit under both themes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Pagination count={5} defaultPage={2} />
      <Pagination count={13} maxPageButtons={4} defaultPage={1} />
      <Pagination count={20} maxPageButtons={5} defaultPage={10} />
      <Pagination count={13} variant="dropdown" defaultPage={3} />
      <Pagination count={13} maxPageButtons={4} defaultPage={2} showFirstLast={false} />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): navigation + the overflow menu. */
const changed = fn();
export const NavigationWorks: Story = {
  tags: ['!autodocs'],
  render: () => <Pagination count={13} maxPageButtons={4} defaultPage={1} onPageChange={changed} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    changed.mockClear();

    // page 1 is current, and the back controls are disabled at the start
    await expect(canvas.getByRole('button', { name: 'Go to page 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(canvas.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();

    // next advances
    await userEvent.click(canvas.getByRole('button', { name: 'Go to next page' }));
    await expect(changed).toHaveBeenCalledWith(2);

    // the overflow menu lists the collapsed pages and can jump to one
    await userEvent.click(canvas.getByRole('button', { name: /^Show pages/ }));
    const hidden = await screen.findByRole('menuitem', { name: '7' });
    await userEvent.click(hidden);
    await expect(changed).toHaveBeenCalledWith(7);
  },
};
