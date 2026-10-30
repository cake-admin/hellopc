import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { MenuItem } from './MenuItem';
import { MenuHeader } from './MenuHeader';

const meta = {
  title: 'Components/Menu/Menu Header',
  component: MenuHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Menu Header labels a group of related menu actions. Use it when a menu has
multiple understandable sections; omit it for short, single-purpose menus.
Use Menu Item for selectable actions and Divider to separate groups without a
text label.

Every color, spacing, and type value resolves from hello pc CSS custom properties
that mirror Figma variables. The **Theme** toolbar re-themes every example
live; nothing is hardcoded.

The component wraps Radix \`DropdownMenu.Label\`, rendering a non-interactive,
non-focusable menu group label. It belongs inside \`DropdownMenu.Content\` in a
production dropdown menu and does not trigger an action or manage menu state.

## Usage

\`\`\`tsx
<MenuHeader>Workspace</MenuHeader>
<MenuHeader>Actions</MenuHeader>
<DropdownMenu.Content><MenuHeader>Settings</MenuHeader></DropdownMenu.Content>
<MenuHeader id="recent-projects">Recent projects</MenuHeader>
<MenuHeader className="custom-menu-label">Saved views</MenuHeader>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| horizontal inset | \`--space-150\` |
| vertical inset | \`--space-075\` |
| text | \`--color-text-icon-primary\` |
| typography | \`--font-family\`, \`--type-size-body\`, \`--font-weight-medium\` |

The generated Figma reference has 10.5px/7px padding but no corresponding
variables. This component maps those values to the nearest available hello pc
spacing tokens: 10px (\`space-150\`) and 6px (\`space-075\`).

## Accessibility

- Radix \`DropdownMenu.Label\` creates a non-interactive label; it does not
  create a keyboard stop or duplicate a menu item role.
- Keep header text concise and descriptive so menu sections are understandable
  when users navigate between actions.
- Do not make a header clickable. Put actionable content in Menu Item or a
  dedicated Button instead.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use headers to name meaningful action groups. | Use a header for every one or two items. |
| Place it before the group it describes. | Make it selectable or focusable. |
| Pair unlabelled groups with Divider when appropriate. | Use it as a replacement for a page heading. |
| Use Menu Item for actions below it. | Add button-like visual states to a static label. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Header',
  },
  argTypes: {
    children: { control: 'text', table: { category: 'Content' } },
  },
} satisfies Meta<typeof MenuHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const MenuFrame = ({ children }: { children: React.ReactNode }) => (
  <div role="menu" style={{ display: 'flex', flexDirection: 'column', width: 378 }}>
    {children}
  </div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  decorators: [(Story) => <MenuFrame>{Story()}</MenuFrame>],
};

export const InMenuContext: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A header identifies its following related Menu Items without becoming an actionable or ' +
          'focusable item itself.',
      },
    },
  },
  render: () => (
    <MenuFrame>
      <MenuHeader>Workspace</MenuHeader>
      <MenuItem>Switch workspace</MenuItem>
      <MenuItem>Invite collaborators</MenuItem>
    </MenuFrame>
  ),
};

export const GroupedMenu: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Use one concise header per meaningful menu group, not as decoration for individual rows.',
      },
    },
  },
  render: () => (
    <MenuFrame>
      <MenuHeader>File</MenuHeader>
      <MenuItem>New file</MenuItem>
      <MenuItem>Open file</MenuItem>
      <MenuHeader>Edit</MenuHeader>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
    </MenuFrame>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Menu Header has one static Figma treatment. Audit its tokenized contrast in both themes.',
      },
    },
  },
  render: () => (
    <MenuFrame>
      <MenuHeader>Section label</MenuHeader>
    </MenuFrame>
  ),
};

/** Pure interaction test (hidden from docs): the Radix label remains non-interactive. */
export const RendersStaticLabel: Story = {
  tags: ['!autodocs'],
  args: { children: 'Recent projects' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Recent projects')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Recent projects' })).not.toBeInTheDocument();
  },
};
