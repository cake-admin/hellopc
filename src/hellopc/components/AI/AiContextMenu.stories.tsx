import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { BookOpen, Calendar } from 'lucide-react';

import { AiContextMenu, AI_CONTEXT_OPTIONS, type AiContextOption } from './AiContextMenu';

const meta = {
  title: 'Components/AI/Context Menu',
  component: AiContextMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **+** button of the AI query input and the menu it opens: context types a
person can attach to a prompt (Ticket, Power, Application, …), a divider, then
**File**, which opens the system file picker. \`AiQueryInput\` renders it for you
when you pass \`contextOptions\` or \`onFilesSelected\`; use it on its own only when
building a custom prompt surface. For a general-purpose action menu use the
\`Menu\` pieces directly.

Every color, radius, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

Built on Radix \`DropdownMenu\`; the trigger is the hello pc \`IconButton\` and the
surface and rows are the existing \`MenuContainer\`, \`MenuItem\` and \`Divider\`. It
opens above the trigger, start-aligned. **Click + in each example to open it.**
Selection is controlled: pass \`selected\` and update it from \`onToggle\`. Without
\`onFilesSelected\` the divider and **File** item are not rendered; the picked
files are handed back as \`File[]\` — uploading them is the app's job.

## Usage

\`\`\`tsx
<AiContextMenu onToggle={toggle} onFilesSelected={upload} />
<AiContextMenu selected={['power']} onToggle={toggle} />
<AiContextMenu options={myOptions} onToggle={toggle} />
<AiContextMenu onFilesSelected={upload} accept=".pdf,image/*" multiple={false} />
<AiContextMenu onFilesSelected={upload} options={[]} />
<AiContextMenu disabled />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Trigger | \`IconButton\` sm · ghost · secondary (\`--color-secondary-secondary\`, overlay hover / press) |
| Surface | \`MenuContainer\`: \`--color-surfaces-container\`, \`--radius-300\`, \`--elevation-3\`, padding \`--space-100\`, row gap \`--space-050\` |
| Row | \`MenuItem\`: \`--font-family\`, \`--type-size-body\`, \`--color-secondary-secondary\`; hover / press \`--color-tonal-tonal-secondary-overlay-hover\` / \`-press\`; \`--radius-200\`, padding \`--space-100\`, gap \`--space-100\` |
| Selected row | \`--color-tonal-tonal-overlay\` (hover / press \`-hover\` / \`-press\`), text \`--color-text-icon-on-tonal\`, \`--font-weight-medium\`, trailing check |
| Divider | \`Divider\` primary: \`--stroke-100\` \`--color-stroke-border\` |
| Focus ring | \`--stroke-200\` \`--color-primary-primary\`, offset \`--space-025\` |
| Position | 8px above the trigger (Figma 19163:8542), 8px collision padding |

## Accessibility

- Radix provides \`role="menu"\` / \`menuitem\`, arrow-key roving focus,
  typeahead, and Esc to close with focus returned to +.
- The + is icon-only, so it is named by \`triggerLabel\` (default "Add context
  or files"). Rename it if your menu only adds files or only adds context.
- Selection isn't shown by color alone: a selected row also gets a trailing
  check and medium weight.
- **File** activates a hidden \`<input type="file">\`, so the system picker
  handles keyboard and screen-reader use.
- Focus is restyled on each row and on the trigger, never removed.

## Do / Don't

| Do | Don't |
| --- | --- |
| Let \`AiQueryInput\` render it via \`contextOptions\` / \`onFilesSelected\` | Render a second + next to the query input's own |
| Keep context labels short nouns ("Ticket", "Power") — they become chips | Use long sentences; the chip truncates them |
| Pass \`accept\` when the assistant only reads some file types | Accept every type and fail after upload |
| Reflect \`selected\` from your state so the check matches the chips | Leave \`selected\` static while chips change |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { onToggle: fn(), onFilesSelected: fn() },
  argTypes: {
    options: { control: false, table: { category: 'Content' } },
    fileLabel: { control: 'text', table: { category: 'Content' } },
    triggerLabel: { control: 'text', table: { category: 'Content' } },
    width: { control: 'number', table: { category: 'Appearance' } },
    selected: {
      control: 'check',
      options: AI_CONTEXT_OPTIONS.map((o) => o.value),
      table: { category: 'State' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    accept: { control: 'text', table: { category: 'Behavior' } },
    multiple: { control: 'boolean', table: { category: 'Behavior' } },
    onToggle: { action: 'toggle', table: { category: 'Events' } },
    onFilesSelected: { action: 'filesSelected', table: { category: 'Events' } },
  },
  decorators: [
    // Room above the trigger: the menu opens upward.
    (Story) => (
      <div style={{ paddingTop: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AiContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** Controlled selection: choosing a type toggles its check, the way the query input's chips do. */
export const Selection: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [selected, setSelected] = useState<string[]>(['power']);
    return (
      <AiContextMenu
        {...args}
        selected={selected}
        onToggle={(v) => {
          args.onToggle?.(v);
          setSelected((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
        }}
      />
    );
  },
};

const CUSTOM: AiContextOption[] = [
  { value: 'kb', label: 'Knowledge base', icon: <BookOpen /> },
  { value: 'calendar', label: 'Calendar', icon: <Calendar /> },
];

/** Product-specific context types: pass your own `options` (16px glyphs inherit color). */
export const CustomOptions: Story = { args: { options: CUSTOM } };

/** Context only: without `onFilesSelected` the divider and File item are omitted. */
export const ContextOnly: Story = { args: { onFilesSelected: undefined } };

/** Files only: an empty `options` list leaves just File — rename the trigger to match. */
export const FilesOnly: Story = { args: { options: [], triggerLabel: 'Attach files' } };

/** Disabled: the + trigger is inert (`--color-disabled-disabled-inverse` glyph). */
export const Disabled: Story = { args: { disabled: true } };

/** Opening the menu and choosing a type fires onToggle with its value. */
export const TogglesFire: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Add context or files' }));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByRole('menuitem', { name: 'File' })).toBeInTheDocument();
    await userEvent.click(await body.findByRole('menuitem', { name: 'Ticket' }));
    await expect(args.onToggle).toHaveBeenCalledWith('ticket');
  },
};
