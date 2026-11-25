import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useState, type ReactNode } from 'react';

import { AiQueryInput, type AiAttachment, type AiQueryInputStatus } from './AiQueryInput';
import { AiModeToggle } from './AiModeToggle';
import { AI_CONTEXT_OPTIONS } from './AiContextMenu';

const meta = {
  title: 'Components/AI/Query Input',
  component: AiQueryInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The prompt input for hello pc AI experiences. A multiline field sits above a
toolbar: an **add** action on the left, a **mode toggle** (voice by default)
and the **send** button on the right. The **segment** (consumer, commercial,
internal) tints the gradient ring, caret and send fill. Use it wherever a user
writes a prompt to an assistant; for ordinary form text use \`TextInput\`.

Every value resolves from hello pc token custom properties — the system tokens
plus the AI segment family \`--color-ai-<segment>-*\` (Figma \`color/ai/*\`; in
Windows High Contrast every AI color maps to a system color). The
**Theme** toolbar toggle re-themes every example on this page live.

Renders a \`<form>\` around a native auto-growing \`<textarea>\` (Enter sends,
Shift+Enter adds a line). \`status\` follows the Figma lifecycle: **Empty**
(send disabled) → **Typing** (send enabled; derived from the text) →
**Sending** (send becomes **Stop**) → **Error** (error ring + inline
message, text kept, send becomes **Retry**). Works controlled (\`value\` +
\`onValueChange\`) or uncontrolled (\`defaultValue\`; clears itself on send).
**Context and files:** set \`contextOptions\` (e.g. \`AI_CONTEXT_OPTIONS\`) and/or
\`onFilesSelected\` and + opens the context menu (\`AiContextMenu\`). A chosen
context type becomes a hello pc \`Chip\` (secondary · large) after +; **File**
opens the system picker and the app passes the files back as \`attachments\`,
rendered as \`AiFileAttachment\` tiles above the text (Send waits while any is
uploading). Toolbar slots (\`leadingActions\`, \`trailingActions\`) and a
\`footer\` slot cover other compositions.

## Usage

\`\`\`tsx
<AiQueryInput onSubmit={send} />
<AiQueryInput segment="commercial" onSubmit={send} />
<AiQueryInput status="sending" onStop={cancel} />
<AiQueryInput status="error" value={draft} onValueChange={setDraft} onRetry={send} />
<AiQueryInput trailingActions={<AiModeToggle pressed={voice} onPressedChange={setVoice} />} />
<AiQueryInput contextOptions={AI_CONTEXT_OPTIONS} onFilesSelected={upload} attachments={files} onRemoveAttachment={remove} />
<AiQueryInput footer={<Disclaimer />} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Container | \`--color-surfaces-container\`, \`--radius-400\`, padding \`--space-500\`, shadow 0 1px 2px \`--color-elevation-drop-shadow-light\` |
| Ring | \`--stroke-200\` gradient \`--color-ai-<segment>-primary-start\` → \`-primary-end\` (39.06°); error \`--color-error-error\` |
| Row gap | \`--space-600\`; error \`--space-300\` |
| Text | \`--font-family\`, \`--type-size-body\`, \`--font-weight-medium\`, \`--color-text-icon-primary\`; placeholder \`--color-text-icon-placeholder\`; caret \`--color-ai-<segment>-flat\` |
| Error message | \`HelperString\` tone \`error\` (\`--color-error-error\`) |
| Add | \`IconButton\` sm · ghost · secondary |
| Send / Stop / Retry | \`IconButton\` sm · fill with \`--color-ai-<segment>-fill-start\` → \`-fill-end\`, glyph \`--color-ai-<segment>-on-fill\`; hover \`--elevation-1\`; disabled \`--color-disabled-disabled\` / \`-inverse\` |
| Toolbar gap | \`--space-100\` |
| Context menu / chips / files | \`AiContextMenu\` (MenuContainer + MenuItem + Divider), \`Chip\` secondary · lg, \`AiFileAttachment\`; attachments → text gap \`--space-300\` |

## Accessibility

- The field has no visible label, so it carries \`aria-label\` (\`label\`, default
  "Message").
- Every toolbar action is a real \`<button>\` with an accessible name; the send
  button's name follows its role — "Send message", "Stop response", "Retry".
- Error: the field gets \`aria-invalid\` and \`aria-describedby\` pointing at the
  message, which is announced via \`role="alert"\`. The form is \`aria-busy\`
  while sending.
- The error is shown by the ring color **and** the icon + text message.
- Enter submits; Shift+Enter inserts a newline; IME composition is respected.

## Do / Don't

| Do | Don't |
| --- | --- |
| Match \`segment\` to the product audience | Mix segments on one screen |
| Keep the text on error so users can retry | Clear the draft when a send fails |
| Swap Send for Stop while a response streams | Disable the button during streaming — users need a way out |
| Put tools/attachments in \`leadingActions\` | Add more than one mode toggle without labels users can tell apart |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
    onStop: fn(),
    onRetry: fn(),
    onAdd: fn(),
    onValueChange: fn(),
  },
  argTypes: {
    placeholder: { control: 'text', table: { category: 'Content' } },
    label: { control: 'text', table: { category: 'Content' } },
    errorMessage: { control: 'text', table: { category: 'Content' } },
    value: { control: 'text', table: { category: 'Content' } },
    defaultValue: { control: 'text', table: { category: 'Content' } },
    leadingActions: { control: false, table: { category: 'Content' } },
    trailingActions: { control: false, table: { category: 'Content' } },
    footer: { control: false, table: { category: 'Content' } },
    segment: {
      control: 'inline-radio',
      options: ['consumer', 'commercial', 'internal'],
      table: { category: 'Appearance' },
    },
    maxRows: { control: { type: 'number', min: 1, max: 12 }, table: { category: 'Appearance' } },
    status: {
      control: 'inline-radio',
      options: ['idle', 'sending', 'error'],
      table: { category: 'State' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onSubmit: { action: 'submit', table: { category: 'Events' } },
    onStop: { action: 'stop', table: { category: 'Events' } },
    onRetry: { action: 'retry', table: { category: 'Events' } },
    onAdd: { action: 'add', table: { category: 'Events' } },
    onValueChange: { action: 'valueChange', table: { category: 'Events' } },
    contextOptions: { control: false, table: { category: 'Content' } },
    contexts: { control: false, table: { category: 'State' } },
    defaultContexts: { control: false, table: { category: 'State' } },
    attachments: { control: false, table: { category: 'Content' } },
    accept: { control: 'text', table: { category: 'Behavior' } },
    onContextsChange: { action: 'contextsChange', table: { category: 'Events' } },
    onFilesSelected: { action: 'filesSelected', table: { category: 'Events' } },
    onRemoveAttachment: { action: 'removeAttachment', table: { category: 'Events' } },
    onRetryAttachment: { action: 'retryAttachment', table: { category: 'Events' } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 664 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AiQueryInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>
);

const DRAFT = 'Help me deploy all NA region updates';

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** Segments (Figma Segment): the ring, caret and send fill follow the audience's AI gradient. */
export const Segments: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <Stack>
      <AiQueryInput {...args} segment="consumer" defaultValue={DRAFT} />
      <AiQueryInput {...args} segment="commercial" defaultValue={DRAFT} />
      <AiQueryInput {...args} segment="internal" defaultValue={DRAFT} />
    </Stack>
  ),
};

/** Typing (Figma State=Typing): text present, caret in the segment accent, send enabled. */
export const Typing: Story = { args: { defaultValue: DRAFT } };

/** Sending (Figma State=Sending): field cleared, send becomes a Stop button that calls `onStop`. */
export const Sending: Story = { args: { status: 'sending' } };

export const ErrorState: Story = {
  name: 'Error',
  args: { status: 'error', defaultValue: DRAFT },
  parameters: {
    docs: {
      description: {
        story:
          'Error (Figma State=Error): the ring switches to `--color-error-error`, a `HelperString` (tone `error`) explains the failure, the text is kept, and send becomes **Retry** (`onRetry`).',
      },
    },
  },
};

/** Disabled: field and every action are inert. */
export const Disabled: Story = { args: { disabled: true } };

/** A controlled mode toggle in `trailingActions` — the consumer owns the voice state. */
export const ControlledModeToggle: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [voice, setVoice] = useState(true);
    return (
      <AiQueryInput
        {...args}
        trailingActions={<AiModeToggle segment={args.segment} pressed={voice} onPressedChange={setVoice} />}
      />
    );
  },
};

const FILES: AiAttachment[] = [
  { id: '1', name: 'Screenshot 2026-11-12 152044.png', details: 'Image · 282.6 KB' },
  { id: '2', name: 'Battery-health-report.pdf', status: 'uploading' },
];

/** + opens the context menu; a context type becomes a Chip, files become tiles above the text. */
export const WithContextAndFiles: Story = {
  args: {
    contextOptions: AI_CONTEXT_OPTIONS,
    defaultContexts: ['power'],
    attachments: [FILES[0]],
    defaultValue: DRAFT,
  },
};

/** Uploading a file blocks Send; a failed upload shows Retry. */
export const FileStates: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <Stack>
      <AiQueryInput {...args} contextOptions={AI_CONTEXT_OPTIONS} attachments={FILES} defaultValue={DRAFT} />
      <AiQueryInput
        {...args}
        contextOptions={AI_CONTEXT_OPTIONS}
        attachments={[{ id: '3', name: 'Battery-health-report.pdf', status: 'error' }]}
        defaultValue={DRAFT}
      />
    </Stack>
  ),
};

const sizeLabel = (f: File) => {
  const kind = f.type.startsWith('image/') ? 'Image' : (f.name.split('.').pop() ?? 'File').toUpperCase();
  const kb = f.size / 1024;
  return `${kind} · ${kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(1)} KB`}`;
};

/** Full flow: pick **File** → tile uploads (simulated 1.5s) → ready; × removes; chips toggle from the menu. */
export const ContextAndFileFlow: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [files, setFiles] = useState<AiAttachment[]>([]);
    const add = (picked: File[]) => {
      const next = picked.map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, status: 'uploading' as const, details: sizeLabel(f) }));
      setFiles((cur) => [...cur, ...next]);
      window.setTimeout(
        () => setFiles((cur) => cur.map((a) => (next.some((n) => n.id === a.id) ? { ...a, status: 'ready' } : a))),
        1500,
      );
    };
    return (
      <AiQueryInput
        {...args}
        contextOptions={AI_CONTEXT_OPTIONS}
        onFilesSelected={add}
        attachments={files}
        onRemoveAttachment={(id) => setFiles((cur) => cur.filter((a) => a.id !== id))}
        onRetryAttachment={(id) => setFiles((cur) => cur.map((a) => (a.id === id ? { ...a, status: 'ready' } : a)))}
      />
    );
  },
};

/** End-to-end lifecycle: send → streaming (Stop) → idle. */
export const Lifecycle: Story = {
  parameters: { controls: { disable: true } },
  render: function Render(args) {
    const [status, setStatus] = useState<AiQueryInputStatus>('idle');
    return (
      <AiQueryInput
        {...args}
        status={status}
        onSubmit={(v) => {
          args.onSubmit?.(v);
          setStatus('sending');
          window.setTimeout(() => setStatus('idle'), 2500);
        }}
        onStop={() => setStatus('idle')}
      />
    );
  },
};

/** QA matrix — segment × Empty / Typing / Sending / Error. Audit under both themes via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      {(['consumer', 'commercial', 'internal'] as const).map((s) => (
        <Stack key={s}>
          <AiQueryInput segment={s} />
          <AiQueryInput segment={s} defaultValue={DRAFT} />
          <AiQueryInput segment={s} status="sending" />
          <AiQueryInput segment={s} status="error" defaultValue={DRAFT} />
        </Stack>
      ))}
    </Stack>
  ),
};

/** Typing then Enter fires onSubmit with the trimmed text and clears the field. */
export const SubmitsOnEnter: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Message' });
    const send = canvas.getByRole('button', { name: 'Send message' });
    await expect(send).toBeDisabled();
    await userEvent.type(field, '  Check my battery health  ');
    await expect(send).toBeEnabled();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith('Check my battery health', { contexts: [] });
    await expect(field).toHaveValue('');
  },
};

/** While sending, the action is Stop and calls onStop. */
export const StopFires: Story = {
  tags: ['!autodocs'],
  args: { status: 'sending' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Stop response' }));
    await expect(args.onStop).toHaveBeenCalled();
  },
};

/** Choosing a context type from + adds a removable chip. */
export const ContextChipFires: Story = {
  tags: ['!autodocs'],
  args: { contextOptions: AI_CONTEXT_OPTIONS, onContextsChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Add context or files' }));
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByRole('menuitem', { name: 'Power' }));
    await expect(args.onContextsChange).toHaveBeenCalledWith(['power']);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Power context' }));
    await expect(args.onContextsChange).toHaveBeenLastCalledWith([]);
  },
};
