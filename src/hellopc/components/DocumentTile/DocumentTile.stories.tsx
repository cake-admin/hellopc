import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Pencil, Share2, Trash2 } from 'lucide-react';

import { DocumentTile, type DocumentTileProps } from './DocumentTile';

/** Sample preview (downscaled from the Figma photo variant, 18908:386). */
const SAMPLE_PHOTO = new URL('./assets/sample-preview.jpg', import.meta.url).href;

const META = 'Modified 22 Jun 2026 · Sam Taylor';
const MENU: DocumentTileProps['menu'] = [
  { label: 'Rename', icon: <Pencil /> },
  { label: 'Share', icon: <Share2 /> },
  { label: 'Delete', icon: <Trash2 /> },
];

/* Layout chrome for stories (raw px is fine here — it's not the component). */
const Frame = ({ layout, children }: { layout?: DocumentTileProps['layout']; children: React.ReactNode }) => (
  <div style={{ width: layout === 'compact' ? 360 : 320, maxWidth: '100%' }}>{children}</div>
);
const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>{children}</div>
);
const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
);
const Caption = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: 'var(--color-text-icon-secondary)', marginBottom: 8 }}>
    {children}
  </div>
);

const meta = {
  title: 'Components/Document Tile',
  component: DocumentTile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A file or generated document — a report, an export, an attachment, an upload.
Use the \`tile\` layout in grids (3–4 columns with \`--space-500\` gaps) where a
preview helps people recognise the file, and the \`compact\` layout in lists,
side panels, attachments, and upload results. Use \`Card\` for content that is
not a file, and \`FileUpload\` for the drop zone that *starts* an upload.

Every color, radius, spacing, and type value resolves from hello pc theme tokens
via CSS custom properties — the **Theme** toolbar toggle re-themes every example
on this page live; nothing is hardcoded.

The tile renders a \`<div>\` whose file name is the single primary target: an
\`<a>\` when you pass \`href\`, a \`<button>\` when you pass \`onOpen\`, or plain
text when neither is set. The target stretches over the whole tile, so the card
is one click target and one focus stop, while download, more, cancel, remove,
retry, and the select checkbox stay separate buttons on top. \`status\` adds
inline upload feedback on a 4px \`ProgressBar\` (\`width="hairline"\`) and swaps
the actions for cancel / remove / retry. Upload states always use the icon
preview and never show hover or selected styling (Figma defines none). The tag,
the More menu (\`DropdownMenu\` + \`MenuContainer\` + \`MenuItem\`), and the
multi-select \`Checkbox\` are the existing hello pc components.

## Usage

\`\`\`tsx
<DocumentTile fileName="Q3 report.pdf" meta="Modified 22 Jun 2026 · Sam Taylor" href="/files/q3" />
<DocumentTile preview="photo" thumbnailSrc={src} fileName="Hero.png" tag="Image" onOpen={open} />
<DocumentTile layout="compact" fileName="Notes.docx" meta="12 KB" onDownload={download} menu={items} />
<DocumentTile selected onSelectedChange={setSelected} fileName="Deck.pptx" />
<DocumentTile layout="compact" status="uploading" progress={42} timeLeft="2 mins left" onCancel={cancel} fileName="Scan.pdf" />
<DocumentTile layout="compact" status="uploaded" onRemove={remove} fileName="Scan.pdf" />
<DocumentTile layout="compact" status="error" errorMessage="File is larger than 25 MB." onRetry={retry} fileName="Scan.pdf" />
<DocumentTile fileName="Budget.xlsx" fileTypeIcon={<SheetIcon />} />
\`\`\`

## Design tokens used

| Part · state | Tokens |
| --- | --- |
| surface | \`--color-surfaces-container\`, border \`--stroke-100\` \`--color-stroke-border\`, \`--elevation-0\` |
| shape | tile \`--radius-300\`; compact \`--radius-200\`; icon block / photo badge (tile) \`--radius-150\`; photo badge (compact) \`--radius-50\` |
| tile thumbnail (icon) | \`--color-surfaces-on-container\`, glyph \`--color-text-icon-secondary\` (160px tall, 48px glyph) |
| compact icon block | \`--color-tonal-tonal\`, glyph \`--color-text-icon-on-tonal\` (40px, 24px glyph) |
| compact icon block · error | \`--color-error-error-overlay\`, glyph \`--color-error-error\` |
| photo file-type badge | \`--color-surfaces-container\`, \`--color-stroke-border\`, glyph \`--color-text-icon-secondary\` |
| hover (with \`href\` / \`onOpen\`) | \`--elevation-2\`; photo previews also \`--color-stroke-border-high\` |
| focus | \`--stroke-300\` outline in \`--color-control-focus-ring\`, outside the tile |
| selected | 2px \`--color-primary-primary\` (border + inset \`--stroke-100\` outline), no elevation |
| tag | Badge \`violet\` · \`subtle\` (\`--color-badge-violet-light\`, \`--color-badge-text-icon-on-violet-light\`) |
| file name | \`--color-text-icon-primary\`, \`--type-size-body\`, \`--font-weight-medium\`, 0.1px tracking |
| meta | \`--color-text-icon-secondary\`, \`--type-size-caption\`, \`--font-weight-regular\`, 0.2px tracking |
| actions | IconButton \`sm\` · \`ghost\` · \`secondary\` |
| upload bar | ProgressBar \`hairline\`: track \`--color-stroke-border\`; fill \`--color-primary-primary\` / \`--color-success-success\` / \`--color-error-error\` |
| upload helper | HelperString \`info\` / \`success\` / \`error\` tones |
| spacing | tile body \`--space-300\` padding, \`--space-100\` gaps; compact \`--space-200\` padding + gap (\`--space-100\` end), \`--space-025\` name-to-meta; photo badge inset \`--space-200\` |

## Accessibility

- The tile is **named by its file name**: the link or button wraps the
  visible name, so there is no separate \`aria-label\` to keep in sync. When the
  name is visually truncated, the full name is also shown in a \`SimpleTooltip\`
  on hover and focus.
- Actions are separate tab stops whose names include the file name
  ("Download Q3 report.pdf", "More actions for Q3 report.pdf", "Cancel upload
  of …"), so a list of tiles never produces a column of identical "Download"
  buttons.
- The upload bar is a Radix \`progressbar\` with \`aria-valuenow\`; a polite
  live region announces **status changes** (uploading, uploaded, failed) —
  never every percent tick.
- Errors pair the error color with an icon and text, never color alone.
- Photo previews are decorative (\`alt=""\`); the file-type badge is hidden
  from assistive tech because the file name already carries the extension.
- \`selected\` sets \`aria-current\` on the primary target; with
  \`onSelectedChange\` a real Checkbox ("Select …") carries the state.
- Focus is a 3px ring drawn outside the tile, so it never covers the preview.

## Do / Don't

| Do | Don't |
| --- | --- |
| Keep the extension in \`fileName\` and put date, owner, or size in \`meta\`. | Put actions or links inside \`meta\` — use \`onDownload\` and \`menu\`. |
| Use \`compact\` for upload results and attachment lists. | Use \`tile\` for long lists — previews cost vertical space. |
| Pass \`timeLeft\` and \`onCancel\` while uploading. | Leave a failed upload without \`errorMessage\` and \`onRetry\`. |
| Swap \`fileTypeIcon\` for the product's app icon when there is one. | Rely on the photo alone to convey the file type. |
| Give every tile in a grid the same layout and preview mode. | Mix tile and compact layouts in one collection. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    layout: 'tile',
    preview: 'icon',
    fileName: 'Document_name.pdf',
    meta: META,
    tag: 'Document',
    thumbnailSrc: SAMPLE_PHOTO,
    showThumbnail: true,
    selected: false,
    status: 'idle',
    progress: 42,
    timeLeft: '2 mins left',
    errorMessage: 'Error message.',
    href: '#document',
    menu: MENU,
    onOpen: fn(),
    onDownload: fn(),
    onCancel: fn(),
    onRemove: fn(),
    onRetry: fn(),
  },
  argTypes: {
    layout: { control: 'inline-radio', options: ['tile', 'compact'], table: { category: 'Appearance' } },
    preview: { control: 'inline-radio', options: ['icon', 'photo'], table: { category: 'Appearance' } },
    fileName: { control: 'text', table: { category: 'Content' } },
    meta: { control: 'text', table: { category: 'Content' } },
    tag: { control: 'text', table: { category: 'Content' } },
    tagColor: { control: 'text', table: { category: 'Appearance' } },
    thumbnailSrc: { control: 'text', table: { category: 'Content' } },
    fileTypeIcon: { control: false, table: { category: 'Content' } },
    showThumbnail: { control: 'boolean', table: { category: 'Appearance' } },
    selected: { control: 'boolean', table: { category: 'State' } },
    status: {
      control: 'inline-radio',
      options: ['idle', 'uploading', 'uploaded', 'error'],
      table: { category: 'State' },
    },
    progress: { control: { type: 'range', min: 0, max: 100 }, table: { category: 'State' } },
    timeLeft: { control: 'text', table: { category: 'Content' } },
    errorMessage: { control: 'text', table: { category: 'Content' } },
    successMessage: { control: 'text', table: { category: 'Content' } },
    href: { control: 'text', table: { category: 'Behavior' } },
    menu: { control: false, table: { category: 'Behavior' } },
    onOpen: { action: 'open', table: { category: 'Events' } },
    // No `action` here: an injected handler would show the multi-select
    // Checkbox on every story. The States story and KeyboardAndSelect test pass one.
    onSelectedChange: { control: false, table: { category: 'Events' } },
    onDownload: { action: 'download', table: { category: 'Events' } },
    onCancel: { action: 'cancel', table: { category: 'Events' } },
    onRemove: { action: 'remove', table: { category: 'Events' } },
    onRetry: { action: 'retry', table: { category: 'Events' } },
  },
} satisfies Meta<typeof DocumentTile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Constrains single-tile stories to the Figma specimen width (320 tile / 360 compact). */
const framed: Story['decorators'] = [
  (Story, ctx) => (
    <Frame layout={(ctx.args as DocumentTileProps).layout}>
      <Story />
    </Frame>
  ),
];

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = { decorators: framed };

export const Layouts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`tile` (Figma 17309:141) is a card with a 160px thumbnail and a two-line name, for grids. `compact` (Figma 18908:488) is a row with a 40px tonal icon block and a one-line name, for lists and upload results. Both stretch to their container; the Figma specimens are 320 and 360 wide.',
      },
    },
  },
  render: (args) => (
    <Row>
      <Frame layout="tile">
        <DocumentTile {...args} layout="tile" />
      </Frame>
      <Frame layout="compact">
        <DocumentTile {...args} layout="compact" />
      </Frame>
    </Row>
  ),
};

export const Previews: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`icon` shows the file-type glyph on `--color-surfaces-on-container` (tile) or `--color-tonal-tonal` (compact). `photo` shows `thumbnailSrc` cropped to fill, with the file-type glyph as a bordered badge so the type stays clear. Swap `fileTypeIcon` for an app icon when the product has one.',
      },
    },
  },
  render: (args) => (
    <Stack>
      <Row>
        <Frame layout="tile">
          <DocumentTile {...args} layout="tile" preview="icon" />
        </Frame>
        <Frame layout="tile">
          <DocumentTile {...args} layout="tile" preview="photo" />
        </Frame>
      </Row>
      <Row>
        <Frame layout="compact">
          <DocumentTile {...args} layout="compact" preview="icon" />
        </Frame>
        <Frame layout="compact">
          <DocumentTile {...args} layout="compact" preview="photo" />
        </Frame>
      </Row>
    </Stack>
  ),
};

export const Content: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every part except the file name is optional: drop `tag`, `meta`, `onDownload`, or `menu`, or hide the thumbnail with `showThumbnail={false}`. Long names clamp to two lines (tile) or one (compact); hover or focus the name to read it in full.',
      },
    },
  },
  render: (args) => (
    <Row>
      <Frame layout="tile">
        <Caption>Name only</Caption>
        <DocumentTile fileName="Notes.txt" href="#notes" />
      </Frame>
      <Frame layout="tile">
        <Caption>No thumbnail</Caption>
        <DocumentTile {...args} showThumbnail={false} />
      </Frame>
      <Frame layout="tile">
        <Caption>Long name</Caption>
        <DocumentTile
          {...args}
          fileName="2026 Q3 regional sales performance review — final board version with appendices.pdf"
        />
      </Frame>
      <Frame layout="compact">
        <Caption>Long name, compact</Caption>
        <DocumentTile
          {...args}
          layout="compact"
          fileName="2026 Q3 regional sales performance review — final board version.pdf"
        />
      </Frame>
    </Row>
  ),
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Hover lifts to `--elevation-2` (photo previews also darken the border to `--color-stroke-border-high`) and only applies when the tile opens something (`href` or `onOpen`). Focus is a 3px `--color-control-focus-ring` outline outside the tile — tab to a tile to see it. `selected` is a flat 2px `--color-primary-primary` border; add `onSelectedChange` to show a Checkbox for multi-select.',
      },
    },
  },
  render: function Render(args) {
    const [picked, setPicked] = React.useState<Record<string, boolean>>({ b: true });
    const toggle = (k: string) => (v: boolean) => setPicked((p) => ({ ...p, [k]: v }));
    return (
      <Stack>
        <Row>
          <Frame layout="tile">
            <Caption>Default</Caption>
            <DocumentTile {...args} />
          </Frame>
          <Frame layout="tile">
            <Caption>Selected</Caption>
            <DocumentTile {...args} preview="photo" selected />
          </Frame>
          <Frame layout="tile">
            <Caption>Multi-select</Caption>
            <DocumentTile {...args} selected={!!picked.a} onSelectedChange={toggle('a')} />
          </Frame>
        </Row>
        <Row>
          <Frame layout="compact">
            <Caption>Compact · selected</Caption>
            <DocumentTile {...args} layout="compact" selected />
          </Frame>
          <Frame layout="compact">
            <Caption>Compact · multi-select</Caption>
            <DocumentTile {...args} layout="compact" selected={!!picked.b} onSelectedChange={toggle('b')} />
          </Frame>
        </Row>
      </Stack>
    );
  },
};

export const UploadStates: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`status="uploading"` shows a 4px primary bar with `timeLeft` and "NN% uploaded" in the info tone, plus cancel. `uploaded` shows a full success bar, "Uploaded successfully." and remove (×). `error` shows a full error bar, the `errorMessage` with an error icon, and retry; the compact icon block turns `--color-error-error-overlay`. Meta, download, and more are hidden while a status is shown.',
      },
    },
  },
  render: (args) => (
    <Stack>
      <Row>
        <Frame layout="tile">
          <DocumentTile {...args} status="uploading" />
        </Frame>
        <Frame layout="tile">
          <DocumentTile {...args} status="uploaded" />
        </Frame>
        <Frame layout="tile">
          <DocumentTile {...args} status="error" />
        </Frame>
      </Row>
      <Frame layout="compact">
        <Stack>
          <DocumentTile {...args} layout="compact" status="uploading" />
          <DocumentTile {...args} layout="compact" status="uploaded" />
          <DocumentTile {...args} layout="compact" status="error" />
        </Stack>
      </Frame>
    </Stack>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix of the 22 Figma variants: layout × preview × state (default, selected, uploading, uploaded, error). Hover and focus are live — hover or tab through. Audit it under light.a, dark.a, and win hct.',
      },
    },
  },
  render: (args) => {
    const states: Array<[string, Partial<DocumentTileProps>]> = [
      ['default', {}],
      ['selected', { selected: true }],
      ['uploading', { status: 'uploading' }],
      ['uploaded', { status: 'uploaded' }],
      ['error', { status: 'error' }],
    ];
    return (
      <Stack>
        {(['tile', 'compact'] as const).map((layout) =>
          (['icon', 'photo'] as const).map((preview) => (
            <div key={`${layout}-${preview}`}>
              <Caption>
                {layout} · {preview}
              </Caption>
              <Row>
                {states
                  .filter(([, s]) => preview === 'icon' || s.status == null)
                  .map(([name, s]) => (
                    <Frame key={name} layout={layout}>
                      <DocumentTile {...args} layout={layout} preview={preview} {...s} fileName={`${name}.pdf`} />
                    </Frame>
                  ))}
              </Row>
            </div>
          )),
        )}
      </Stack>
    );
  },
};

/** Pure interaction test (hidden from docs): the file name opens; actions are separate targets named by the file. */
export const ActionsFire: Story = {
  tags: ['!autodocs'],
  decorators: framed,
  args: { href: undefined },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Document_name.pdf' }));
    await expect(args.onOpen).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole('button', { name: 'Download Document_name.pdf' }));
    await expect(args.onDownload).toHaveBeenCalledTimes(1);
    await expect(args.onOpen).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole('button', { name: 'More actions for Document_name.pdf' }));
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Rename' })).toBeVisible());
    await userEvent.keyboard('{Escape}');
  },
};

/** Pure interaction test (hidden from docs): upload progress semantics, cancel, and the status live region. */
export const UploadAnnounces: Story = {
  tags: ['!autodocs'],
  decorators: framed,
  args: { layout: 'compact', status: 'uploading', progress: 42 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', { name: 'Upload progress for Document_name.pdf' });
    await expect(bar).toHaveAttribute('aria-valuenow', '42');
    await expect(canvas.getByText('42% uploaded')).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('Uploading Document_name.pdf');
    await expect(canvas.queryByRole('button', { name: /Download/ })).toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: 'Cancel upload of Document_name.pdf' }));
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

/** Pure interaction test (hidden from docs): keyboard focus reaches the tile, then its actions, and the select checkbox toggles. */
export const KeyboardAndSelect: Story = {
  tags: ['!autodocs'],
  decorators: framed,
  args: { onSelectedChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Select Document_name.pdf' });
    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Document_name.pdf' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Download Document_name.pdf' })).toHaveFocus();
    await userEvent.click(checkbox);
    await expect(args.onSelectedChange).toHaveBeenCalledWith(true);
  },
};

/** Pure interaction test (hidden from docs): uploading without `timeLeft` shows no placeholder helper copy. */
export const UploadWithoutTimeLeft: Story = {
  tags: ['!autodocs'],
  decorators: framed,
  args: { layout: 'compact', status: 'uploading', progress: 42, timeLeft: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('42% uploaded')).toBeVisible();
    await expect(canvas.queryByText('Example helper string')).toBeNull();
  },
};

/** Pure interaction test (hidden from docs): a truncated name keeps the same focused link while the tooltip wiring settles. */
export const TruncatedNameKeepsFocus: Story = {
  tags: ['!autodocs'],
  decorators: framed,
  args: {
    layout: 'compact',
    fileName: '2026 Q3 regional sales performance review — final board version with appendices.pdf',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: /2026 Q3 regional sales/ });
    link.focus();
    await canvasElement.ownerDocument.fonts?.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await expect(canvas.getByRole('link', { name: /2026 Q3 regional sales/ })).toBe(link);
    await expect(link).toHaveFocus();
  },
};

/** Pure interaction test (hidden from docs): a name-only tile renders no empty footer row. */
export const NameOnlyHasNoFooter: Story = {
  tags: ['!autodocs'],
  decorators: framed,
  args: { meta: undefined, tag: undefined, menu: undefined, onDownload: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Document_name.pdf' });
    // The tile body holds only the name target: no tag, no footer.
    await expect(link.parentElement?.childElementCount).toBe(1);
  },
};
