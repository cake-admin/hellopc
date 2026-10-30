import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ChevronRight, Folder, Settings } from 'lucide-react';

import { MenuItem } from './MenuItem';

const meta = {
  title: 'Components/Menu/Menu Item',
  component: MenuItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Menu Item is a compact action row for application menus. Its
\`variant="sub-item"\` variation provides the Figma sub-item indentation for
hierarchical menu content. Use Button for actions outside a menu and Checkbox
for independent form selection.

Every color, spacing, radius, and type value resolves from hello pc CSS custom
properties mirroring Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

The component renders a native \`<button role="menuitem">\`, so it is usable
standalone or inside a menu/list parent without requiring a Radix menu root.
Hover and pressed Figma variants are CSS interaction states, while
\`selected\` and \`disabled\` are explicit component state. The optional
checkbox reuses the hello pc Checkbox component as a separate sibling control to
avoid nesting interactive elements.

## Usage

\`\`\`tsx
<MenuItem>Refresh</MenuItem>
<MenuItem selected>Current workspace</MenuItem>
<MenuItem variant="sub-item">Nested folder</MenuItem>
<MenuItem showCheckbox defaultChecked>Select filters</MenuItem>
<MenuItem leftSlot={<Folder />} rightSlot={<ChevronRight />}>Projects</MenuItem>
<MenuItem disabled>Unavailable action</MenuItem>
\`\`\`

## Design tokens used

| Part · state | Tokens |
| --- | --- |
| row layout | \`--space-100\`, \`--radius-200\`, \`--type-size-body\` |
| sub-item indent | \`--space-500\` |
| idle text | \`--color-secondary-secondary\` |
| idle hover / press | \`--color-tonal-tonal-secondary-overlay-hover\` / \`--color-tonal-tonal-secondary-overlay-press\` |
| selected | \`--color-tonal-tonal-overlay\`, \`--color-text-icon-on-tonal\` |
| selected hover / press | \`--color-tonal-tonal-overlay-hover\` / \`--color-tonal-tonal-overlay-press\` |
| disabled | \`--color-disabled-disabled\`, \`--color-disabled-disabled-inverse\` |
| focus | \`--stroke-200\`, \`--color-primary-primary\`, \`--radius-100\` |
| checkbox | reused Checkbox token recipe |

Figma intrinsic geometry is a 36px row with 16px slot icons. Both variations
have a 12px radius; sub-items add a 24px left inset.

## Accessibility

- The action is a native button with \`role="menuitem"\`, so Enter and Space
  trigger it naturally. Put related rows in a parent with \`role="menu"\` when
  building a full menu.
- Decorative slots are hidden from assistive technology; the visible text is
  the action’s accessible name.
- Focus is visibly restyled with a primary token ring; disabled items use the
  native \`disabled\` attribute and cannot be activated.
- When \`showCheckbox\` is enabled, Checkbox remains an independent labelled
  control beside the menu action; it is not nested inside the row button.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use \`selected\` for the current menu choice. | Use selected styling as a substitute for keyboard focus. |
| Use \`sub-item\` only for a genuine child relationship. | Indent a top-level item only to align arbitrary content. |
| Provide a meaningful text label alongside icons. | Create an icon-only menu row. |
| Use Checkbox for multi-select controls. | Make a row button and checkbox one nested interactive control. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Menu item',
    variant: 'item',
    selected: false,
    disabled: false,
    showLeftSlot: true,
    showRightSlot: true,
    showCheckbox: false,
    onClick: fn(),
    onCheckedChange: fn(),
  },
  argTypes: {
    children: { control: 'text', table: { category: 'Content' } },
    leftSlot: { control: false, table: { category: 'Content' } },
    rightSlot: { control: false, table: { category: 'Content' } },
    showLeftSlot: { control: 'boolean', table: { category: 'Content' } },
    showRightSlot: { control: 'boolean', table: { category: 'Content' } },
    variant: {
      control: 'inline-radio',
      options: ['item', 'sub-item'],
      table: { category: 'Appearance' },
    },
    selected: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    showCheckbox: { control: 'boolean', table: { category: 'Behavior' } },
    checked: { control: 'boolean', table: { category: 'Behavior' } },
    defaultChecked: { control: 'boolean', table: { category: 'Behavior' } },
    onClick: { action: 'click', table: { category: 'Events' } },
    onCheckedChange: { action: 'checkedChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const MenuFrame = ({ children }: { children: React.ReactNode }) => (
  <div role="menu" style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 378 }}>
    {children}
  </div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  decorators: [(Story) => <MenuFrame>{Story()}</MenuFrame>],
};

export const Variations: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Top-level items use the 8px inset, while `sub-item` applies the Figma 24px left inset. ' +
          'Slots remain 16px and use the current text color.',
      },
    },
  },
  render: () => (
    <MenuFrame>
      <MenuItem leftSlot={<Folder />} rightSlot={<ChevronRight />}>Projects</MenuItem>
      <MenuItem variant="sub-item">Design system</MenuItem>
      <MenuItem variant="sub-item" selected>hello pc</MenuItem>
    </MenuFrame>
  ),
};

export const SelectionAndCheckbox: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Selected items use the primary tonal overlay and medium text. The top-level variation may ' +
          'also compose the reusable Checkbox as an independent sibling control.',
      },
    },
  },
  render: () => (
    <MenuFrame>
      <MenuItem selected>Current workspace</MenuItem>
      <MenuItem showCheckbox defaultChecked>Include archived projects</MenuItem>
      <MenuItem showCheckbox>Include draft projects</MenuItem>
    </MenuFrame>
  ),
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Hover and press are native CSS states: hover or press the first two rows to inspect their ' +
          'secondary-tonal overlays. Disabled uses the Figma muted fill and native disabled semantics.',
      },
    },
  },
  render: () => (
    <MenuFrame>
      <MenuItem leftSlot={<Settings />}>Hover or press me</MenuItem>
      <MenuItem selected>Selected — hover or press me</MenuItem>
      <MenuItem disabled>Unavailable action</MenuItem>
      <MenuItem disabled selected>Unavailable current action</MenuItem>
    </MenuFrame>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix covers both Figma variations and their default, selected, disabled, and ' +
          'checkbox treatments. Audit it under both themes with the Theme toolbar.',
      },
    },
  },
  render: () => (
    <MenuFrame>
      <MenuItem>Top-level idle</MenuItem>
      <MenuItem selected>Top-level selected</MenuItem>
      <MenuItem disabled>Top-level disabled</MenuItem>
      <MenuItem showCheckbox defaultChecked>Top-level checkbox</MenuItem>
      <MenuItem variant="sub-item">Sub-item idle</MenuItem>
      <MenuItem variant="sub-item" selected>Sub-item selected</MenuItem>
      <MenuItem variant="sub-item" disabled>Sub-item disabled</MenuItem>
    </MenuFrame>
  ),
};

/** Pure interaction test (hidden from docs): row activation and the optional Checkbox both fire. */
export const ActivatesAndChecks: Story = {
  tags: ['!autodocs'],
  args: {
    children: 'Refresh data',
    showCheckbox: true,
    onClick: fn(),
    onCheckedChange: fn(),
  },
  render: (args) => (
    <MenuFrame>
      <MenuItem {...args} />
    </MenuFrame>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Refresh data' }));
    await expect(args.onClick).toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Refresh data' }));
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
