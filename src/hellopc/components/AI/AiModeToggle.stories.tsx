import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ReactNode } from 'react';
import { Globe } from 'lucide-react';

import { AiModeToggle } from './AiModeToggle';

const meta = {
  title: 'Components/AI/Mode Toggle',
  component: AiModeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A 32px toggle icon button that switches an input **mode** on or off inside the
AI query input — voice input by default. It replaces the earlier radio. Use it
for a mode the user turns on and leaves on; for a one-shot action (attach,
send) use \`IconButton\` instead.

Every color resolves from hello pc token custom properties — the system tokens
plus the AI segment family (\`--color-ai-<segment>-*\`) — and the **Theme**
toolbar toggle re-themes every example on this page live via \`[data-theme]\`.

Built on the Radix \`Toggle\` primitive: it renders a real \`<button>\` with
\`aria-pressed\`. Works controlled (\`pressed\` + \`onPressedChange\`) or
uncontrolled (\`defaultPressed\`). When pressed, the default microphone fills its
capsule (the arc and stem stay outlined), matching the Figma filled-icon On
state. The glyph is swappable: pass \`icon\`, plus \`pressedIcon\` for its filled
On version — a custom icon isn't filled automatically, since filling an
arbitrary outline icon breaks its shape.

## Usage

\`\`\`tsx
<AiModeToggle />
<AiModeToggle defaultPressed />
<AiModeToggle segment="commercial" pressed={voice} onPressedChange={setVoice} />
<AiModeToggle label="Web search" icon={<Globe />} />
<AiModeToggle disabled />
\`\`\`

## Design tokens used

| State | Tokens |
| --- | --- |
| Off | glyph \`--color-secondary-secondary\`; hover \`--color-secondary-secondary-overlay\`, press \`--color-secondary-secondary-overlay-hover\` |
| On | fill \`--color-ai-<segment>-surface-start\` → \`-surface-end\` (39.06°); glyph \`--color-ai-<segment>-flat\` |
| Disabled | glyph \`--color-disabled-disabled-inverse\`, no fill |
| Focus ring | \`--stroke-300\` \`--color-primary-primary\`, 2px outside |
| Shape | \`--radius-1000\`, 32px circle, 24px glyph slot |

## Accessibility

- Radix provides \`aria-pressed\`, Space/Enter toggling, and disabled semantics.
- The control is icon-only, so \`label\` (default "Voice input") is required
  context — it renders as visually hidden text via Radix \`AccessibleIcon\`.
  Name the **mode**, not the state ("Voice input", not "Turn on voice").
- Pressed state isn't conveyed by color alone: the surface changes and the
  default glyph fills. For a custom \`icon\`, pass a filled \`pressedIcon\` to keep
  that second cue.
- Focus is restyled (3px primary ring), never removed.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for persistent modes (voice, web search) | Use for one-shot actions — that's \`IconButton\` |
| Match \`segment\` to the surrounding query input | Mix segments inside one input |
| Give each mode a clear \`label\` | Rely on the glyph alone to explain the mode |
| Disable when the mode is unavailable on the device | Hide it and shift the toolbar layout |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { onPressedChange: fn() },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    icon: { control: false, table: { category: 'Content' } },
    pressedIcon: { control: false, table: { category: 'Content' } },
    segment: {
      control: 'inline-radio',
      options: ['consumer', 'commercial', 'internal'],
      table: { category: 'Appearance' },
    },
    pressed: { control: 'boolean', table: { category: 'State' } },
    defaultPressed: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onPressedChange: { action: 'pressedChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof AiModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** Pressed (Figma State=On): segment surface gradient behind a filled glyph in the segment accent. */
export const On: Story = { args: { defaultPressed: true } };

/** Each segment's On state — consumer (indigo→violet), commercial (teal→blue), internal (red→amber). */
export const Segments: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row>
      <AiModeToggle segment="consumer" defaultPressed />
      <AiModeToggle segment="commercial" defaultPressed />
      <AiModeToggle segment="internal" defaultPressed />
    </Row>
  ),
};

/** Swap the glyph for another mode — keep a matching `label`. */
export const CustomIcon: Story = { args: { label: 'Web search', icon: <Globe /> } };

/** Unavailable: glyph dims to `--color-disabled-disabled-inverse`, no hover. */
export const Disabled: Story = { args: { disabled: true } };

/** QA matrix — segment × Off / On / Disabled. Audit under both themes via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['consumer', 'commercial', 'internal'] as const).map((s) => (
        <Row key={s}>
          <AiModeToggle segment={s} />
          <AiModeToggle segment={s} defaultPressed />
          <AiModeToggle segment={s} disabled />
        </Row>
      ))}
    </div>
  ),
};

/** Clicking flips aria-pressed and fires onPressedChange. */
export const TogglesFire: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Voice input' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPressedChange).toHaveBeenCalledWith(true);
  },
};
