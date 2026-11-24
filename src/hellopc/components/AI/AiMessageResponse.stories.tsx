import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { AiMessageResponse } from './AiMessageResponse';

const SOURCES = [
  { label: 'Product guide', href: '#product-guide' },
  { label: 'Support articles', href: '#support' },
  { label: 'Release notes', href: '#release-notes' },
];

const REPLY = [
  'Got it. I’m pulling in all updates scoped to the NA region and creating a draft plan.',
  'Can I start this plan for you? Or would you like to change these steps?',
];

const meta = {
  title: 'Components/AI/Message Response',
  component: AiMessageResponse,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The assistant's reply in an AI conversation: one or more paragraphs, then
optionally where the answer came from (\`sources\`), the one action it offers
(\`action\`), and a feedback row (\`feedback\`). Put attachments such as cards or
plan steps directly below it in the conversation. The person's own prompt is
entered with \`AiQueryInput\`.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

It has no bubble — it sits on the conversation surface. Strings in \`children\`
become paragraphs. It composes \`AiSources\`, \`AiButton\` (tinted by \`segment\`)
and \`AiFeedback\`; sources and feedback are off unless you pass them.

## Usage

\`\`\`tsx
<AiMessageResponse>{['First paragraph.', 'Second paragraph.']}</AiMessageResponse>
<AiMessageResponse action={{ label: 'Start deployment plan', onClick: start }}>{reply}</AiMessageResponse>
<AiMessageResponse sources={sources}>{reply}</AiMessageResponse>
<AiMessageResponse feedback={{ onValueChange: rate, onCopy: copy, onRegenerate: retry }}>{reply}</AiMessageResponse>
<AiMessageResponse segment="commercial" action={{ label: 'Open report' }}>{reply}</AiMessageResponse>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Paragraphs | \`--color-text-icon-primary\`, \`--type-size-body\` regular, 1.35, 0.2px; \`--space-200\` apart |
| Block | stack gap \`--space-200\`; padding \`--space-300\` top/bottom, \`--space-600\` right |
| Sources | **AiSources** |
| Action | **AiButton** — \`--color-ai-<segment>-fill-start/-end\`, \`--color-ai-<segment>-on-fill\` |
| Feedback | **AiFeedback** |

## Accessibility

- Renders an \`<article>\`, so each reply is a distinct unit. While a reply
  streams in, announce it from the conversation's \`aria-live\` log region, not
  from this block.
- Sources are real links; feedback buttons are named and report their state (\`aria-checked\`).
- Offer one primary action at most, labelled with what it does.

## Do / Don't

| Do | Don't |
| --- | --- |
| Show sources when the answer draws on documents | Present unsourced claims as facts |
| Offer one clear AI action | Stack several AI buttons |
| Add feedback where answers can be wrong | Add feedback to system messages |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: REPLY,
    segment: 'consumer',
    action: { label: 'Start deployment plan', onClick: fn() },
  },
  argTypes: {
    children: { control: false, table: { category: 'Content' } },
    sources: { control: 'object', table: { category: 'Content' } },
    action: { control: 'object', table: { category: 'Content' } },
    feedback: { control: false, table: { category: 'Content' } },
    segment: {
      control: 'inline-radio',
      options: ['consumer', 'commercial', 'internal'],
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof AiMessageResponse>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** Sources above the action, feedback at the bottom (Figma `showSources` + `showFeedback`). */
export const WithSourcesAndFeedback: Story = {
  args: { sources: SOURCES, feedback: { onCopy: fn(), onRegenerate: fn(), onValueChange: fn() } },
};

/** The action takes the segment's AI gradient. */
export const Segments: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {(['consumer', 'commercial', 'internal'] as const).map((s) => (
        <AiMessageResponse key={s} segment={s} action={{ label: 'Start deployment plan' }}>
          {REPLY[0]}
        </AiMessageResponse>
      ))}
    </div>
  ),
};

/** QA matrix — text only, with action, with sources + feedback. Audit under every theme. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AiMessageResponse>{REPLY}</AiMessageResponse>
      <AiMessageResponse action={{ label: 'Start deployment plan' }}>{REPLY}</AiMessageResponse>
      <AiMessageResponse
        sources={SOURCES}
        action={{ label: 'Start deployment plan' }}
        feedback={{ onCopy: () => {}, defaultValue: 'liked' }}
      >
        {REPLY}
      </AiMessageResponse>
      <AiMessageResponse action={{ label: 'Start deployment plan', disabled: true }}>{REPLY[1]}</AiMessageResponse>
    </div>
  ),
};

/** The action fires; the reply is an article with paragraphs. */
export const ActionFires: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('article')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Start deployment plan' }));
    await expect(args.action?.onClick).toHaveBeenCalled();
  },
};
