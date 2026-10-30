import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { FileUpload } from './FileUpload';

const sampleImage = new File(['sample image'], 'profile.png', { type: 'image/png' });

const meta = {
  title: 'Components/File Upload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
File Upload is an image-upload dropzone with a primary browse action. It
composes the existing [Button](?path=/docs/components-button-button--docs) for
file selection and [Helper String](?path=/docs/elements-helper-string--docs)
for the restrictions line. Use it for one image asset at a time; use a
specialized attachment list when multiple files, queueing, or per-file upload
progress are required.

Every color, spacing, radius, and type value resolves from hello pc CSS custom
properties. The **Theme** toolbar re-themes all dropzone states live; nothing
is hardcoded.

The native file input handles selection, while the component provides an
accessible drag/drop target, keyboard-operable Button, accept/max-size
validation, and controlled or uncontrolled uploaded-file state. The supplied
Figma node contains no real image content or remote upload API: pass
\`previewUrl\` to render a selected image and use \`loading\` while the parent
persists it.

## Usage

\`\`\`tsx
<FileUpload onFileChange={uploadImage} />
<FileUpload accept=".png,.jpg,.jpeg" maxSize={2 * 1024 * 1024} />
<FileUpload loading />
<FileUpload defaultFile={imageFile} previewUrl={imagePreviewUrl} />
<FileUpload status="error" errorMessage="File type is not supported" />
<FileUpload disabled />
\`\`\`

## Design tokens used

| Part · state | Tokens |
| --- | --- |
| resting dropzone | \`--color-stroke-border\`, \`--stroke-100\`, \`--radius-300\` |
| hover | \`--color-tonal-tonal-lightest\` |
| dragging | \`--color-tonal-tonal-overlay\`, \`--stroke-200\`, \`--color-text-icon-on-tonal\` |
| loading | \`--color-tonal-tonal-overlay\`, \`--stroke-200\`, \`--color-text-icon-on-tonal\` |
| media panel | \`--color-tonal-tonal\`, \`--radius-200\`, \`--color-text-icon-on-tonal\` |
| disabled | \`--color-disabled-disabled\`, \`--color-disabled-disabled-inverse\` |
| primary action | reused Button fill · primary token recipe |
| delete action | \`--color-primary-primary\`, \`--color-primary-primary-overlay\`, \`--radius-1000\` |
| error chip | \`--color-warning-warn-overlay\`, \`--color-warning-warn\`, \`--radius-1000\` |
| restrictions | reused HelperString greyscale/warning/disabled token recipe |
| layout | \`--space-100\`, \`--space-300\`, \`--space-800\`, \`--radius-300\` |

Figma intrinsic geometry is a maximum 480px-wide dropzone, 48px media panel,
24px icon slots, 40px action controls, and a 24px dropzone radius.

## Accessibility

- The visible upload/update Button triggers the native file input and has a
  descriptive label plus upload icon; the input retains an accessible picker
  name for assistive technology and test automation.
- The dropzone is a labelled group with drag/drop support. It never relies on
  drag-and-drop alone; the Button provides an equivalent keyboard path.
- Loading exposes \`aria-busy\`; validation exposes \`aria-invalid\` and a
  status chip. The parent must announce remote upload errors that occur after
  \`onFileChange\`.
- The delete control has a file-specific accessible name and tokenized focus
  ring. Disabled state blocks every action.

## Do / Don't

| Do | Don't |
| --- | --- |
| Enforce the same accept/size rules on the server. | Treat client-side accept filtering as security validation. |
| Pass a preview URL only after it is safe to display. | Hard-code a brand or user-image preview in the component. |
| Use \`loading\` for the parent upload lifecycle. | Pretend a file is persisted immediately after selection. |
| Use the provided delete action to clear a one-file upload. | Add multiple-file queue behavior to this single-file component. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onFileChange: fn(),
    onRemove: fn(),
    onError: fn(),
    loading: false,
    disabled: false,
    accept: '.bmp,.gif,.ico,.jpg,.jpeg,.png',
    maxSize: 5 * 1024 * 1024,
  },
  argTypes: {
    file: { control: false, table: { category: 'Content' } },
    defaultFile: { control: false, table: { category: 'Content' } },
    previewUrl: { control: 'text', table: { category: 'Content' } },
    restrictions: { control: 'text', table: { category: 'Content' } },
    prompt: { control: 'text', table: { category: 'Content' } },
    uploadLabel: { control: 'text', table: { category: 'Content' } },
    updateLabel: { control: 'text', table: { category: 'Content' } },
    errorMessage: { control: 'text', table: { category: 'Content' } },
    status: {
      control: 'inline-radio',
      options: ['default', 'loading', 'error', 'uploaded'],
      table: { category: 'State' },
    },
    loading: { control: 'boolean', table: { category: 'State' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    accept: { control: 'text', table: { category: 'Behavior' } },
    maxSize: { control: 'number', table: { category: 'Behavior' } },
    onFileChange: { action: 'fileChange', table: { category: 'Events' } },
    onRemove: { action: 'remove', table: { category: 'Events' } },
    onError: { action: 'error', table: { category: 'Events' } },
    'aria-label': { control: 'text', table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const DragStates: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Hover the first dropzone and drag a file over it to view the tonal hover and dashed dragging states. ' +
          'Loading uses the matching tonal surface with a solid border and spinner.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 480 }}>
      <FileUpload />
      <FileUpload loading />
    </div>
  ),
};

export const Validation: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The Figma error treatment places a warning chip inside the ordinary dropzone rather than recoloring ' +
          'the whole component. Try selecting an unsupported file in the first example.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 480 }}>
      <FileUpload accept=".png" />
      <FileUpload status="error" errorMessage="File type is not supported" />
      <FileUpload disabled />
    </div>
  ),
};

export const Uploaded: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Uploaded uses an actual file object and retains the Figma update/delete action arrangement. ' +
          'Pass `previewUrl` when a safe image preview is available from application state.',
      },
    },
  },
  render: () => <FileUpload defaultFile={sampleImage} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix covers resting, loading, disabled, validation, and uploaded states. ' +
          'Audit this under both themes with the Theme toolbar.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 480 }}>
      <FileUpload />
      <FileUpload loading />
      <FileUpload disabled />
      <FileUpload status="error" errorMessage="File type is not supported" />
      <FileUpload defaultFile={sampleImage} />
    </div>
  ),
};

/** Pure interaction test (hidden from docs): a supported native file upload fires onFileChange. */
export const SelectsFile: Story = {
  tags: ['!autodocs'],
  args: { onFileChange: fn(), onError: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Image upload file picker');
    const file = new File(['image'], 'logo.png', { type: 'image/png' });

    await userEvent.upload(input, file);
    await expect(args.onFileChange).toHaveBeenCalledWith(file);
    await expect(canvas.getByRole('button', { name: 'Remove logo.png' })).toBeInTheDocument();
  },
};
