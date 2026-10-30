import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { RotateCw, Search, ChevronDown, Tag, FolderPlus, Trash2 } from 'lucide-react';

import { ActionBar } from './ActionBar';
import { IconButton } from '../Button/IconButton';
import { Button } from '../Button/Button';
import { TextInput } from '../TextInput/TextInput';

/** A fixed-width frame so the bar renders at a realistic table width. */
const Frame = ({ children, width = 640 }: { children: React.ReactNode; width?: number }) => (
  <div
    style={{
      width,
      border: '1px solid var(--color-stroke-border)',
      borderRadius: 'var(--radius-150)',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

/** The idle-state refresh control (a ghost IconButton). */
const RefreshAction = (
  <IconButton size="sm" variant="ghost" intent="secondary" label="Refresh" icon={<RotateCw />} />
);

/** The idle-state search affordance (collapsed to an icon button). */
const SearchButton = (
  <IconButton size="sm" variant="ghost" intent="secondary" label="Search" icon={<Search />} />
);

/** The expanded search field (Figma `state=search expanded`). */
const SearchField = (
  <div style={{ width: 224 }}>
    <TextInput size="md" placeholder="Search" aria-label="Search" startIcon={<Search />} />
  </div>
);

/** The bulk actions shown once rows are selected. */
const BulkActions = (
  <>
    <Button size="sm" variant="tonal" intent="primary" endIcon={<ChevronDown />}>
      Action
    </Button>
    <Button size="sm" variant="tonal" intent="secondary" startIcon={<Tag />}>
      Label
    </Button>
    <Button size="sm" variant="tonal" intent="secondary" startIcon={<FolderPlus />}>
      Group
    </Button>
    <Button size="sm" variant="tonal" intent="secondary" startIcon={<Trash2 />}>
      Delete
    </Button>
  </>
);

const meta = {
  title: 'Components/Table/Action Bar',
  component: ActionBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The toolbar above a table body (Figma \`ActionBar\`, node 171:9796). It leads
with a select-all **Checkbox** and adapts to selection: idle it shows the
table's controls (\`actions\` such as a refresh **IconButton**) with a
right-aligned \`end\` slot (a search **IconButton** that can expand into a search
**TextInput**); in selection mode (\`selected\`) it swaps in bulk-action
**Button**s and hides the idle \`end\`.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

It composes existing controls rather than rebuilding them: the leading control
is the hello pc **Checkbox** (with an \`'indeterminate'\` state for a partial
selection), the idle controls are **IconButton**s, the bulk actions are
**Button**s (\`variant="tonal"\`), and the expanded search is a **TextInput**.

There's no Radix primitive that fits: Radix \`Toolbar\` imposes roving arrow-key
focus, which breaks a search text input (arrows must move the caret, not focus).
So — like **Pagination** — the bar follows the toolbar accessibility pattern
directly (\`role="toolbar"\` + \`aria-label\`) and lets each composed control keep
its own behavior and Tab order.

## Usage

\`\`\`tsx
import { ActionBar } from '@/hellopc/components/Table';
import { IconButton, Button } from '@/hellopc/components/Button';
import { TextInput } from '@/hellopc/components/TextInput';

// idle: refresh + a collapsed search button
<ActionBar
  checked={allChecked}
  onCheckedChange={setAllChecked}
  actions={<IconButton size="sm" variant="ghost" label="Refresh" icon={<RotateCw />} />}
  end={<IconButton size="sm" variant="ghost" label="Search" icon={<Search />} />}
/>

// search expanded: swap the end slot for a field
<ActionBar
  end={<TextInput size="md" placeholder="Search" aria-label="Search" startIcon={<Search />} />}
/>

// selection mode: partial checkbox + bulk actions
<ActionBar
  selected
  checked="indeterminate"
  selectedActions={
    <>
      <Button size="sm" variant="tonal" intent="primary" endIcon={<ChevronDown />}>Action</Button>
      <Button size="sm" variant="tonal" intent="secondary" startIcon={<Trash2 />}>Delete</Button>
    </>
  }
/>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| bar background | \`--color-surfaces-container\` |
| bar padding | \`--space-100\` (8px) × \`--space-200\` (12px) |
| leading gap / action gap | \`--space-300\` (16px) |
| min cluster separation | \`--space-500\` (24px) |
| select-all control | **Checkbox** (Radix, own tokens; \`'indeterminate'\` supported) |
| idle controls | **IconButton** \`size="sm"\` \`variant="ghost"\` |
| bulk · primary ("Action") | **Button** \`variant="tonal"\` \`intent="primary"\` → \`--color-tonal-tonal\` / \`--color-text-icon-on-tonal-inverse\` |
| bulk · secondary (Label/Group/Delete) | **Button** \`variant="tonal"\` \`intent="secondary"\` → \`--color-tonal-tonal-secondary-overlay\` / \`--color-text-icon-on-tonal-secondary\` |
| search field | **TextInput** \`size="md"\` (\`--radius-200\`, \`--color-surfaces-on-container-high\`) |
| bar height | 48px (intrinsic geometry, Figma 171:9796) |

## Accessibility

- The bar is a \`role="toolbar"\` landmark with an \`aria-label\` (\`aria-label\`
  prop, default "Table actions"), grouping the table's controls.
- The select-all **Checkbox** carries an \`aria-label\` (\`checkboxLabel\`) and
  supports \`'indeterminate'\` for a partial selection — mirror it from the row
  selection state.
- Every composed control brings its own accessible name and focus ring: the
  refresh/search **IconButton**s require a \`label\`, the search **TextInput**
  needs an \`aria-label\` when it has no visible label.
- Roving focus is intentionally not used (see above); controls follow normal
  Tab order so the search field behaves like a real text input.

## Do / Don't

| Do | Don't |
| --- | --- |
| Show bulk actions only when \`selected\` | Leave Delete/Group visible when nothing is selected |
| Set \`checked="indeterminate"\` for a partial selection | Show a full check when only some rows are selected |
| Reuse **Button** / **IconButton** / **TextInput** in the slots | Re-draw tonal buttons or a search field by hand |
| Give every icon-only control a \`label\` | Ship a bare refresh/search icon with no accessible name |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    checked: false,
    selected: false,
    checkboxLabel: 'Select all rows',
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: {
      control: 'inline-radio',
      options: [false, true, 'indeterminate'],
      table: { category: 'State' },
    },
    selected: { control: 'boolean', table: { category: 'State' } },
    checkboxLabel: { control: 'text', table: { category: 'Content' } },
    actions: { control: false, table: { category: 'Content' } },
    selectedActions: { control: false, table: { category: 'Content' } },
    end: { control: false, table: { category: 'Content' } },
    onCheckedChange: { action: 'checkedChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => (
    <Frame>
      <ActionBar
        {...args}
        actions={RefreshAction}
        selectedActions={BulkActions}
        end={SearchButton}
      />
    </Frame>
  ),
};

/**
 * The idle bar: a select-all checkbox, a refresh **IconButton**, and a
 * collapsed search **IconButton** pushed to the trailing edge.
 */
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <ActionBar actions={RefreshAction} end={SearchButton} />
    </Frame>
  ),
};

/**
 * The search affordance expanded into a **TextInput** (Figma
 * `state=search expanded`) — the same bar, with a field in the `end` slot.
 */
export const SearchExpanded: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <ActionBar actions={RefreshAction} end={SearchField} />
    </Frame>
  ),
};

/**
 * Selection mode (Figma `state=selected`): the checkbox goes `indeterminate`
 * for a partial selection and the bulk actions — one primary-tonal **Button**
 * plus secondary-tonal ones — take the place of the idle controls.
 */
export const Selected: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <ActionBar selected checked="indeterminate" selectedActions={BulkActions} />
    </Frame>
  ),
};

/**
 * All three states stacked. Audit them under both themes with the **Theme**
 * toolbar.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Frame>
        <ActionBar actions={RefreshAction} end={SearchButton} />
      </Frame>
      <Frame>
        <ActionBar actions={RefreshAction} end={SearchField} />
      </Frame>
      <Frame>
        <ActionBar selected checked="indeterminate" selectedActions={BulkActions} />
      </Frame>
    </div>
  ),
};

/** Toggling the select-all checkbox fires `onCheckedChange`. */
export const SelectAllFires: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Frame>
      <ActionBar {...args} actions={RefreshAction} end={SearchButton} />
    </Frame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all rows' }));
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
