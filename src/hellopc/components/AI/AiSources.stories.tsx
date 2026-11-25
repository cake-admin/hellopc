import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { AiSources } from './AiSources';

const meta = {
  title: 'Components/AI/Sources',
  component: AiSources,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Where an AI answer came from: a "Sources:" lead-in and a list of links to each
origin. Use it under assistant replies (usually through \`AiMessageResponse\`'s
\`sources\` prop) whenever the answer draws on documents or pages.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

Each source is a hello pc \`Link\` at 12px — regular weight as Figma draws them,
and still underlined so the links don't rely on color. The list wraps onto more
lines instead of overflowing.

## Usage

\`\`\`tsx
<AiSources sources={[{ label: 'Product guide', href: '/guide' }, { label: 'Release notes', href: '/notes' }]} />
<AiSources heading="Based on:" sources={sources} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Glyph + lead-in | \`--color-text-icon-secondary\`; 14px link glyph; lead-in \`--type-size-caption\` medium |
| Source links | **Link** sm, regular weight — \`--color-text-icon-link\` |
| Gaps | \`--space-050\` |

## Accessibility

- Sources are a real list of links (\`<ul>\`), named "Sources", so screen-reader
  users hear how many there are.
- Each link names its source — never "link" or a raw URL.

## Do / Don't

| Do | Don't |
| --- | --- |
| Link each source to its origin | List sources as plain text |
| Keep labels short ("Product guide") | Paste long URLs as labels |
| Show only the sources the answer used | Pad the list with loosely related pages |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    sources: [
      { label: 'Product guide', href: '#product-guide' },
      { label: 'Support articles', href: '#support' },
      { label: 'Release notes', href: '#release-notes' },
    ],
  },
  argTypes: {
    sources: { control: 'object', table: { category: 'Content' } },
    heading: { control: 'text', table: { category: 'Content' } },
  },
  decorators: [
    // Placeholder href="#" links would navigate the whole Storybook window
    // (<base target="_parent">); cancel navigation for those only.
    (Story) => (
      <div
        onClickCapture={(e) => {
          if ((e.target as HTMLElement).closest('a[href^="#"]')) e.preventDefault();
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AiSources>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** QA matrix — one, three and many sources (wraps). Audit under every theme. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
      <AiSources sources={[{ label: 'Product guide', href: '#a' }]} />
      <AiSources
        sources={[
          { label: 'Product guide', href: '#a' },
          { label: 'Support articles', href: '#b' },
          { label: 'Release notes', href: '#c' },
        ]}
      />
      <AiSources
        sources={['Warranty policy', 'Battery FAQ', 'Driver catalog', 'Fleet report', 'Admin guide'].map((l, i) => ({
          label: l,
          href: `#s${i}`,
        }))}
      />
    </div>
  ),
};

/** Sources are a named list of links. */
export const LinksList: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Sources' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('link')).toHaveLength(3);
  },
};
