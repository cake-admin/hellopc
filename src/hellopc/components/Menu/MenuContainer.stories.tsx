import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Copy, Files, FolderOpen, Search, Settings, Trash2 } from 'lucide-react';

import { Divider } from '../Elements/Divider';
import { TextInput } from '../TextInput/TextInput';
import { MenuContainer } from './MenuContainer';
import { MenuHeader } from './MenuHeader';
import { MenuItem } from './MenuItem';

const meta = {
  title: 'Components/Menu/Menu Container',
  component: MenuContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Menu Container is the elevated surface that groups menu content. It is a slot:
it owns the container background, radius, shadow, padding, and scroll behavior,
and renders whatever children it is given — Menu Header, Menu Item, Divider, or
arbitrary content such as a text input. Use it as the body of a dropdown,
command palette, or contextual menu. For a single non-elevated separator use
Divider directly; for the actionable rows use Menu Item.

Every color, spacing, radius, and shadow value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

Scrolling is delegated to the shared **Scrollbar** element (\`Elements/Scrollbar\`,
the hello pc Radix \`ScrollArea\` wrapper) rather than re-styled here. Set
\`maxHeight\` to cap the content height; the tokenized scrollbar only appears
when the content overflows. The container is intentionally semantic-neutral so
it can host non-menu content — pass \`role="menu"\` yourself when the children
are actual menu items.

## Usage

\`\`\`tsx
<MenuContainer><MenuItem>Refresh</MenuItem></MenuContainer>
<MenuContainer role="menu" aria-label="Actions">…</MenuContainer>
<MenuContainer maxHeight={240}>{/* scrolls when tall */}</MenuContainer>
<MenuContainer width="100%">{/* fill parent */}</MenuContainer>
<MenuContainer>
  <MenuHeader>Workspace</MenuHeader>
  <MenuItem>Switch workspace</MenuItem>
  <Divider />
  <TextInput aria-label="Filter" placeholder="Filter…" />
</MenuContainer>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| surface | \`--color-surfaces-container\` |
| corner | \`--radius-300\` |
| shadow | \`--elevation-3\` (Figma \`elevation/3\`) |
| content slot | \`--space-100\` (padding), \`--space-050\` (row gap) |
| scrollbar track inset | \`--space-050\` |
| scrollbar thumb | \`--color-stroke-border-high\`, \`--radius-50\` |

The 4px scrollbar thumb is intrinsic Figma geometry.

## Accessibility

- The container renders a neutral surface, so it never fabricates a menu role
  for non-menu content. When composing Menu Items, set \`role="menu"\` and an
  \`aria-label\` on the container so assistive tech announces the grouping.
- Radix \`ScrollArea\` provides accessible, cross-browser scrolling; keyboard
  focus still moves through the real focusable children.
- Keep interactive children (Menu Item, TextInput) as the focus stops; the
  container itself is not focusable.

## Do / Don't

| Do | Don't |
| --- | --- |
| Compose headers, items, dividers, and inputs as children. | Re-implement item or header visuals inside the container. |
| Set \`maxHeight\` for long lists so they scroll. | Let an unbounded menu grow past the viewport. |
| Add \`role="menu"\` when children are menu items. | Force a menu role onto arbitrary form content. |
| Use one container per floating surface. | Nest containers to fake grouping — use headers/dividers. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    width: 320,
  },
  argTypes: {
    children: { control: false, table: { category: 'Content' } },
    maxHeight: { control: 'text', table: { category: 'Appearance' } },
    width: { control: 'text', table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof MenuContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive playground — a mixed-content layout showing the container as a
 * true slot: a header, filterable text input, a divider, and menu items.
 */
export const Playground: Story = {
  args: {
    'aria-label': 'Project actions',
    children: (
      <>
        <MenuHeader>Projects</MenuHeader>
        <TextInput aria-label="Filter projects" placeholder="Filter…" startIcon={<Search />} size="sm" />
        <Divider />
        <MenuItem leftSlot={<FolderOpen />} showRightSlot={false}>Open project</MenuItem>
        <MenuItem leftSlot={<Files />} showRightSlot={false}>Duplicate</MenuItem>
        <MenuItem leftSlot={<Settings />} showRightSlot={false}>Project settings</MenuItem>
      </>
    ),
  },
};

export const MenuLayout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A conventional actions menu: composed entirely from Menu Header, Menu Item, and Divider. ' +
          'The container adds the surface, elevation, and padding.',
      },
    },
  },
  render: () => (
    <MenuContainer role="menu" aria-label="File actions">
      <MenuHeader>File</MenuHeader>
      <MenuItem leftSlot={<FolderOpen />} showRightSlot={false}>Open</MenuItem>
      <MenuItem leftSlot={<Copy />} showRightSlot={false}>Copy</MenuItem>
      <Divider />
      <MenuItem leftSlot={<Trash2 />} showRightSlot={false} selected>Delete</MenuItem>
    </MenuContainer>
  ),
};

export const MixedContentLayout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Because it is a slot, the container can hold non-menu content such as a search field ' +
          'above a divided list of results.',
      },
    },
  },
  render: () => (
    <MenuContainer aria-label="Command palette">
      <TextInput aria-label="Search commands" placeholder="Search commands…" startIcon={<Search />} />
      <Divider weight="weak" />
      <MenuHeader>Recent</MenuHeader>
      <MenuItem showLeftSlot={false} showRightSlot={false}>Rename file</MenuItem>
      <MenuItem showLeftSlot={false} showRightSlot={false}>Move to folder</MenuItem>
    </MenuContainer>
  ),
};

export const Scrolling: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With `maxHeight` set, overflowing content scrolls inside the shared `Scrollbar` element and the ' +
          'tokenized scrollbar thumb (`--color-stroke-border-high`) appears.',
      },
    },
  },
  render: () => (
    <MenuContainer role="menu" aria-label="Long list" maxHeight={220}>
      <MenuHeader>All items</MenuHeader>
      {Array.from({ length: 12 }, (_, index) => (
        <MenuItem key={index} showLeftSlot={false} showRightSlot={false}>
          Menu item {index + 1}
        </MenuItem>
      ))}
    </MenuContainer>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: a fixed-width menu layout beside a mixed-content layout. Audit the surface, ' +
          'shadow, and scrollbar contrast under both themes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <MenuContainer role="menu" aria-label="Actions">
        <MenuHeader>Actions</MenuHeader>
        <MenuItem showLeftSlot={false} showRightSlot={false}>First action</MenuItem>
        <MenuItem showLeftSlot={false} showRightSlot={false} selected>Second action</MenuItem>
        <Divider />
        <MenuItem showLeftSlot={false} showRightSlot={false} disabled>Disabled action</MenuItem>
      </MenuContainer>
      <MenuContainer aria-label="Filtered list" maxHeight={200}>
        <TextInput aria-label="Filter" placeholder="Filter…" startIcon={<Search />} size="sm" />
        <Divider weight="weak" />
        {Array.from({ length: 8 }, (_, index) => (
          <MenuItem key={index} showLeftSlot={false} showRightSlot={false}>
            Result {index + 1}
          </MenuItem>
        ))}
      </MenuContainer>
    </div>
  ),
};

/** Pure interaction test (hidden from docs): renders composed children on the surface. */
export const RendersComposedChildren: Story = {
  tags: ['!autodocs'],
  args: {
    'aria-label': 'Test menu',
    role: 'menu',
    children: (
      <>
        <MenuHeader>Section</MenuHeader>
        <MenuItem showLeftSlot={false} showRightSlot={false}>Composed item</MenuItem>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Section')).toBeVisible();
    await expect(canvas.getByRole('menuitem', { name: 'Composed item' })).toBeVisible();
  },
};
