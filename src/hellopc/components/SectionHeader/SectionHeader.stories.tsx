import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import type { ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

import { Button, IconButton } from '../Button';
import { SectionHeader } from './SectionHeader';

const meta = {
  title: 'Components/Section Header',
  component: SectionHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The header at the top of a page section or card: a heading, an optional count,
an optional supporting line, and room for a couple of actions on the right. Use
one per section or card. Use \`sm\` inside cards, \`md\` for page sections, and \`lg\`
for a page title that sits inside the content area. For a page's own top bar or a
tab strip, use those components instead.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

Renders a \`<div>\` with the title as a real heading (\`h2\` by default; set
\`headingLevel\` to fit the page outline — the visual size comes from \`size\`, not
the level). The count reuses \`Counter\` (secondary · subtle). Actions are a slot:
pass up to two \`Button\`s — secondary outline, then primary fill, primary
rightmost — and put anything more in an overflow \`IconButton\` menu. The header
stretches to its container's width.

## Usage

\`\`\`tsx
<SectionHeader title="Devices" />
<SectionHeader title="Devices" count={12} />
<SectionHeader title="Devices" description="Managed by your organization" />
<SectionHeader size="sm" title="Recent activity" actions={<Button size="sm" intent="secondary" variant="outline">View all</Button>} />
<SectionHeader size="lg" title="Fleet overview" actions={<Button>Add device</Button>} />
<SectionHeader title="Reports" headingLevel={3} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Title | \`--color-text-icon-primary\`; \`sm\` \`--type-size-subject\` medium, \`md\` \`--type-size-title\` bold, \`lg\` \`--type-size-page\` bold (−0.4px tracking); line-height 1.35 |
| Description | \`--color-text-icon-secondary\`, regular; \`sm\` \`--type-size-caption\`, \`md\` \`--type-size-body\`, \`lg\` \`--type-size-subject\`; 0.2px tracking |
| Count | **Counter** secondary · subtle (\`--color-secondary-secondary-overlay\` / \`--color-secondary-secondary\`) |
| Gaps | title ↔ description \`--space-025\`; title ↔ count and between actions \`--space-100\`; title group ↔ actions \`--space-300\` (minimum) |
| Actions | **Button** / **IconButton** — their own tokens |

## Accessibility

- The title is a real heading, so screen-reader users can jump between sections.
  Set \`headingLevel\` so headings nest correctly on the page (don't skip levels).
- The count is read as part of the heading's row. If it needs context ("12
  devices"), say so in the title or an \`aria-label\` on the section.
- Actions are ordinary buttons with visible labels; an overflow \`IconButton\`
  needs a \`label\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use one header per section or card | Stack several headers in one card |
| Keep to two visible actions, primary rightmost | Line up a row of equal buttons |
| Match button size to the header (\`sm\` buttons with \`sm\`/\`md\`, \`md\` with \`lg\`) | Put large buttons in a small card header |
| Pick \`headingLevel\` from the page outline | Use \`lg\` just to make a heading bigger |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { title: 'Section title', size: 'md' },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    count: { control: 'number', table: { category: 'Content' } },
    actions: { control: false, table: { category: 'Content' } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], table: { category: 'Appearance' } },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6], table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 720 }}>{children}</div>
);

const smActions = (
  <>
    <Button size="sm" intent="secondary" variant="outline">
      View all
    </Button>
    <Button size="sm">Add</Button>
  </>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** `sm` (cards), `md` (page sections), `lg` (page titles in content), each with its matching button size. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      <SectionHeader size="sm" title="Section title" actions={smActions} />
      <SectionHeader size="md" title="Section title" actions={smActions} />
      <SectionHeader
        size="lg"
        title="Section title"
        actions={
          <>
            <Button intent="secondary" variant="outline">
              View all
            </Button>
            <Button>Add</Button>
          </>
        }
      />
    </Stack>
  ),
};

/** Optional count (Counter secondary · subtle) and supporting description. */
export const CountAndDescription: Story = {
  args: { count: 12, description: 'Short supporting description' },
};

/** Two visible actions at most — extras go in an overflow menu. */
export const WithOverflow: Story = {
  args: {
    actions: (
      <>
        {smActions}
        <IconButton label="More actions" icon={<MoreHorizontal />} size="sm" intent="secondary" variant="ghost" />
      </>
    ),
  },
};

/** QA matrix — size × count/description on and off. Audit under every theme via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Stack key={s}>
          <SectionHeader size={s} title={`Section title · ${s}`} actions={smActions} />
          <SectionHeader
            size={s}
            title={`Section title · ${s}`}
            count={12}
            description="Short supporting description"
            actions={smActions}
          />
        </Stack>
      ))}
    </Stack>
  ),
};

/** The title renders as the requested heading level. */
export const HeadingLevel: Story = {
  tags: ['!autodocs'],
  args: { title: 'Reports', headingLevel: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 3, name: 'Reports' })).toBeInTheDocument();
  },
};
