import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { MoreVertical, Sparkles } from 'lucide-react';

import { DataCard } from './DataCard';
import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { ContentSwitcher } from '../ContentSwitcher/ContentSwitcher';
import { Table } from '../Table/Table';
import { HeaderRow, HeaderCell } from '../Table/HeaderRow';
import { DataRow, DataCell } from '../Table/DataRow';

const Segments = (
  <ContentSwitcher
    size="sm"
    intent="secondary"
    aria-label="Business group"
    options={[
      { value: 'all', label: 'All' },
      { value: 'idg', label: 'IDG' },
      { value: 'isg', label: 'ISG' },
      { value: 'ssg', label: 'SSG' },
    ]}
  />
);
const AiSummary = (
  <Button size="sm" intent="primary" variant="tonal" startIcon={<Sparkles />}>
    AI summary
  </Button>
);
const More = <IconButton size="sm" variant="ghost" intent="secondary" label="More for Pipeline health" icon={<MoreVertical />} />;
const ViewAll = (
  <Button size="sm" intent="primary" variant="ghost">
    View all
  </Button>
);

const ROWS = [
  { name: 'Northwest Health System', stage: 'Develop', close: '20 Sep 2026', revenue: '$1,250,000', status: 'On track' },
  { name: 'Riverside Data Center', stage: 'Execute', close: '15 Nov 2026', revenue: '$480,000', status: 'Past due' },
  { name: 'Metro Transit Authority', stage: 'Qualify', close: '02 Dec 2026', revenue: '$96,500', status: 'On hold' },
] as const;

/** The default content: a small read-only **Table**. */
const PipelineTable = (
  <Table
    aria-label="Pipeline health"
    header={
      <HeaderRow>
        <HeaderCell>Opportunity</HeaderCell>
        <HeaderCell>Stage</HeaderCell>
        <HeaderCell>Close date</HeaderCell>
        <HeaderCell>Revenue (USD)</HeaderCell>
        <HeaderCell>Status</HeaderCell>
      </HeaderRow>
    }
  >
    {ROWS.map((r) => (
      <DataRow key={r.name} selectable={false}>
        <DataCell>{r.name}</DataCell>
        <DataCell>{r.stage}</DataCell>
        <DataCell>{r.close}</DataCell>
        <DataCell>{r.revenue}</DataCell>
        <DataCell>{r.status}</DataCell>
      </DataRow>
    ))}
  </Table>
);

const Frame = ({ children, width = 960 }: { children: React.ReactNode; width?: number }) => (
  <div style={{ width }}>{children}</div>
);

const meta = {
  title: 'Components/Card/Data Card',
  component: DataCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A card that holds data — a table, a chart, KPIs, or a mix — with a consistent
header and footer (Figma \`hellopc.data.card\`, node 18275:745; from the Sales
Sphere "Pipeline health" and "Recent orders" modules). Use it to frame a data
module on a dashboard. For marketing or navigation content use **Content
Card** / **Simple Card**; for a bare surface use **Card**.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

DataCard is **not a Card variant**: it is flat (1px border, 12px radius, no
shadow) and owns its structure. It renders a \`<section>\` named by its title,
with slots for existing pieces — \`tools\` (a segments **ContentSwitcher**
\`size="sm"\`, an "AI summary" **Button**, a "more" **IconButton**), the
\`children\` content well (bordered, 8px radius — a **Table** by default), and a
footer with a \`sources\` line and a \`footerAction\` ("View all" **Button**). Every
slot except \`title\` is optional; the footer only renders when it has content.

## Usage

\`\`\`tsx
<DataCard title="Pipeline health">{table}</DataCard>
<DataCard title="Pipeline health" description="Open opportunities by stage.">{table}</DataCard>
<DataCard title="Pipeline health" tools={<>{segments}{aiSummary}{more}</>}>{table}</DataCard>
<DataCard title="Pipeline health" sources="Sources: Salesforce · As of 05 Dec 2026" footerAction={<Button size="sm" intent="primary" variant="ghost">View all</Button>}>{table}</DataCard>
<DataCard title="Recent orders" headingLevel="h3">{chart}</DataCard>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| card | \`--color-surfaces-container\`, \`--stroke-100\` · \`--color-stroke-border\`, \`--radius-200\` (12px), no shadow |
| card padding / section gap | \`--space-500\` (24px) / \`--space-300\` (16px) |
| header gap · title ↔ description | \`--space-300\` (16px) · \`--space-050\` (4px) |
| title | \`--type-size-title\` (20px), \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| description | \`--type-size-body\` (14px), \`--font-weight-regular\` |
| tools gap / footer gap | \`--space-100\` (8px) |
| content well | \`--stroke-100\` · \`--color-stroke-border\`, \`--radius-150\` (8px) |
| sources | \`--type-size-caption\` (12px), \`--font-weight-regular\` |
| tools / action | **ContentSwitcher** \`size="sm"\`, **Button** \`size="sm"\` (primary tonal / primary ghost), **IconButton** \`size="sm"\` |

## Accessibility

- The card is a \`<section>\` labelled by its title, so it appears as a named
  region. Set \`headingLevel\` so the title fits the page's heading outline.
- Label the segments **ContentSwitcher** (\`aria-label\`) and make the "more"
  **IconButton** label card-specific ("More for Pipeline health").
- The content keeps its own semantics — a **Table** needs its own \`aria-label\`.
- "View all" should say where it goes when several cards share a page — pass
  an \`aria-label\` such as "View all opportunities".

## Do / Don't

| Do | Don't |
| --- | --- |
| Say where the data comes from and how fresh it is in \`sources\` | Leave people guessing whether numbers are live |
| Keep tools to segments, AI summary, and one more menu | Fill the header with buttons |
| Put one data view in the content well | Stack unrelated tables in one card |
| Use **Card** for non-data content | Add a shadow or change the radius to make it "pop" |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: 'Pipeline health',
    description: 'An optional short description of what this card shows and why it is useful.',
    sources: 'Sources: Source name · As of 05 Dec 2026',
    headingLevel: 'h2',
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    sources: { control: 'text', table: { category: 'Content' } },
    tools: { control: false, table: { category: 'Content' } },
    children: { control: false, table: { category: 'Content' } },
    footerAction: { control: false, table: { category: 'Content' } },
    headingLevel: { control: 'inline-radio', options: ['h2', 'h3', 'h4'], table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof DataCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => (
    <Frame>
      <DataCard {...args} tools={<>{Segments}{AiSummary}{More}</>} footerAction={ViewAll}>
        {PipelineTable}
      </DataCard>
    </Frame>
  ),
};

/**
 * Every slot is optional: the full card (Figma defaults), a card without
 * description or tools, and a title-and-content card with no footer.
 */
export const Slots: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Frame>
        <DataCard
          title="Pipeline health"
          description="Open opportunities by stage."
          tools={<>{Segments}{AiSummary}{More}</>}
          sources="Sources: Salesforce · As of 05 Dec 2026"
          footerAction={ViewAll}
        >
          {PipelineTable}
        </DataCard>
      </Frame>
      <Frame>
        <DataCard title="Recent orders" sources="As of 05 Dec 2026" footerAction={ViewAll}>
          {PipelineTable}
        </DataCard>
      </Frame>
      <Frame>
        <DataCard title="Top accounts">{PipelineTable}</DataCard>
      </Frame>
    </div>
  ),
};

/**
 * Any data view goes in the content well — here a KPI strip instead of a table.
 * The well's border and radius frame it the same way.
 */
export const CustomContent: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame width={640}>
      <DataCard title="This quarter" tools={More} sources="As of 05 Dec 2026">
        <div style={{ display: 'flex', gap: 24, padding: 16 }}>
          {[
            ['Revenue', '$1.83M'],
            ['Deals won', '42'],
            ['Win rate', '31%'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 'var(--type-size-caption)', color: 'var(--color-text-icon-secondary)' }}>{k}</span>
              <span style={{ fontSize: 'var(--type-size-subtitle)', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </DataCard>
    </Frame>
  ),
};

/**
 * QA matrix: the full card and a minimal one. Audit it under light, dark, and
 * win hct with the **Theme** toolbar.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Frame>
        <DataCard
          title="Card title"
          description="An optional short description of what this card shows and why it is useful."
          tools={<>{Segments}{AiSummary}{More}</>}
          sources="Sources: Source name · As of 05 Dec 2026"
          footerAction={ViewAll}
        >
          {PipelineTable}
        </DataCard>
      </Frame>
      <Frame width={480}>
        <DataCard title="Minimal">
          <div style={{ padding: 16 }}>Content</div>
        </DataCard>
      </Frame>
    </div>
  ),
};

/** The card is a region named by its title; its tools and View all are reachable. */
export const RegionAndActions: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Frame>
      <DataCard {...args} tools={<>{Segments}{More}</>} footerAction={ViewAll}>
        {PipelineTable}
      </DataCard>
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Pipeline health' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 2, name: 'Pipeline health' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'IDG' }));
    await expect(canvas.getByRole('radio', { name: 'IDG' })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('button', { name: 'View all' })).toBeEnabled();
  },
};
