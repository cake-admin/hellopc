import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ArrowRight, Sparkles } from 'lucide-react';

import { AiButton } from './AiButton';

const meta = {
  title: 'Components/AI/AI Button',
  component: AiButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The one primary action an AI response offers — "Start deployment plan", "Open
report". Use it inside AI conversations, usually through \`AiMessageResponse\`'s
\`action\` prop. Ordinary actions use \`Button\`.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

A 32px pill in the segment's AI fill gradient with an optional 16px leading icon.
Renders a real \`<button type="button">\`.

## Usage

\`\`\`tsx
<AiButton icon={<ArrowRight />}>Start deployment plan</AiButton>
<AiButton segment="commercial">Open report</AiButton>
<AiButton segment="internal" icon={<Sparkles />}>Summarize</AiButton>
<AiButton disabled>Start deployment plan</AiButton>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Fill | \`--color-ai-<segment>-fill-start\` → \`-fill-end\` (8.35°) |
| Label / icon | \`--color-ai-<segment>-on-fill\`; \`--type-size-caption\` medium, 0.2px |
| Shape | 32px, \`--radius-1000\`, padding \`--space-100\` / \`--space-250\` right, gap \`--space-050\` |
| Hover | \`--elevation-1\` |
| Disabled | \`--color-disabled-disabled\` / \`--color-disabled-disabled-inverse\` |
| Focus ring | \`--stroke-300\` \`--color-primary-primary\` |

## Accessibility

- A native button named by its label; the icon is decorative.
- Focus is restyled, never removed.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for the single action an AI response offers | Use for ordinary page actions |
| Name the outcome ("Start deployment plan") | Write "Go" or "OK" |
| Match the segment of the surrounding AI input | Mix segments in one conversation |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { children: 'Start deployment plan', icon: <ArrowRight />, segment: 'consumer', onClick: fn() },
  argTypes: {
    children: { control: 'text', table: { category: 'Content' } },
    icon: { control: false, table: { category: 'Content' } },
    segment: { control: 'inline-radio', options: ['consumer', 'commercial', 'internal'], table: { category: 'Appearance' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onClick: { action: 'click', table: { category: 'Events' } },
  },
} satisfies Meta<typeof AiButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** QA matrix — segment × default/disabled. Audit under every theme (win hct maps AI colors to system colors). */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: 12 }}>
      {(['consumer', 'commercial', 'internal'] as const).flatMap((s) => [
        <AiButton key={`${s}-a`} segment={s} icon={<ArrowRight />}>
          Start deployment plan
        </AiButton>,
        <AiButton key={`${s}-b`} segment={s} icon={<ArrowRight />} disabled>
          Start deployment plan
        </AiButton>,
      ])}
    </div>
  ),
};

/** Clicking fires onClick. */
export const ClicksFire: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Start deployment plan' }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
