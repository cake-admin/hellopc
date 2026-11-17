import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { AiFileAttachment } from './AiFileAttachment';

const meta = {
  title: 'Components/AI/File Attachment',
  component: AiFileAttachment,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A file attached to a prompt, shown above the text in \`AiQueryInput\`. It is
added from **File** in the + context menu (or by drag-and-drop / paste). Use it
only inside the AI query input; for standalone uploads use \`FileUpload\`.

Every value resolves from hello pc token custom properties, including the AI
segment family (\`--color-ai-<segment>-*\`) that tints the file-type tile — the
**Theme** toolbar toggle re-themes this page live.

Static content: the upload itself is the app's job; the tile reflects
\`status\`. Remove and Retry reuse \`IconButton\`; Uploading reuses \`Spinner\`.
The glyph defaults by extension (image vs document) and can be overridden.

## Usage

\`\`\`tsx
<AiFileAttachment name="Battery-health-report.pdf" details="PDF · 2.4 MB" onRemove={remove} />
<AiFileAttachment name="Screenshot.png" details="Image · 282.6 KB" segment="commercial" />
<AiFileAttachment name="Battery-health-report.pdf" status="uploading" onRemove={cancel} />
<AiFileAttachment name="Battery-health-report.pdf" status="error" onRetry={retry} onRemove={remove} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Tile | \`--color-surfaces-container\`, \`--stroke-100\` \`--color-stroke-border\` (error \`--color-error-error\`), \`--radius-300\`, \`--elevation-0\`, padding/gap \`--space-200\` |
| File-type tile | 40px, \`--radius-200\`, \`--color-ai-<segment>-surface-start\` → \`-end\`; glyph \`--color-ai-<segment>-flat\`. Error: \`--color-surfaces-on-container\` + \`--color-text-icon-error-on-surface-icon\` |
| Name | \`--type-size-body\`, \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| Details | \`--type-size-caption\`, \`--color-text-icon-secondary\`; error \`--color-text-icon-error-on-surface-text-destructive-btn\` |
| Actions | \`IconButton\` xs · ghost · secondary |

## Accessibility

- Remove and Retry are real buttons named for the file ("Remove Screenshot.png").
- The name truncates visually; the full name is in \`title\`.
- Uploading sets \`aria-busy\` and the Spinner announces "Uploading <name>".
- Error is shown by color **and** the "Upload failed" text.

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep failed files visible with Retry | Silently drop a failed upload |
| Block Send while a file is uploading | Send a prompt that references a half-uploaded file |
| Match \`segment\` to the query input | Mix segments in one input |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { name: 'Battery-health-report.pdf', details: 'PDF · 2.4 MB', onRemove: fn(), onRetry: fn() },
  argTypes: {
    name: { control: 'text', table: { category: 'Content' } },
    details: { control: 'text', table: { category: 'Content' } },
    icon: { control: false, table: { category: 'Content' } },
    segment: { control: 'inline-radio', options: ['consumer', 'commercial', 'internal'], table: { category: 'Appearance' } },
    status: { control: 'inline-radio', options: ['uploading', 'ready', 'error'], table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onRemove: { action: 'remove', table: { category: 'Events' } },
    onRetry: { action: 'retry', table: { category: 'Events' } },
  },
} satisfies Meta<typeof AiFileAttachment>;

export default meta;
type Story = StoryObj<typeof meta>;

const Grid = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 16 }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** Images get the image glyph automatically (by extension). */
export const Image: Story = { args: { name: 'Screenshot 2026-11-12 152044.png', details: 'Image · 282.6 KB' } };

/** Uploading: spinner in the tile, "Uploading…" — the query input blocks Send meanwhile. */
export const Uploading: Story = { args: { status: 'uploading' } };

/** Error: error ring and glyph, "Upload failed", Retry + remove. */
export const ErrorState: Story = { name: 'Error', args: { status: 'error' } };

/** QA matrix — segment × Uploading / Ready / Error. Audit under both themes via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      {(['consumer', 'commercial', 'internal'] as const).flatMap((s) =>
        (['uploading', 'ready', 'error'] as const).map((st) => (
          <AiFileAttachment
            key={s + st}
            segment={s}
            status={st}
            name="Battery-health-report.pdf"
            details="PDF · 2.4 MB"
            onRemove={() => {}}
            onRetry={() => {}}
          />
        )),
      )}
    </Grid>
  ),
};

/** Retry and remove fire their handlers. */
export const ActionsFire: Story = {
  tags: ['!autodocs'],
  args: { status: 'error' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Retry uploading/ }));
    await expect(args.onRetry).toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: /Remove/ }));
    await expect(args.onRemove).toHaveBeenCalled();
  },
};
