import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ReactNode } from 'react';

import { EmptyState } from './EmptyState';

const meta = {
  title: 'Components/Empty State',
  component: EmptyState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
What a view shows when it has nothing to show — no items yet, no search
results, a failed load, no permission, or nothing left to do. It names the
situation, says why or what to try, and offers a way forward. Use it inside a
card, panel, table body or page region; for a temporary message about an action,
use \`Toast\`, and for an inline problem with a field, use the field's helper text.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

\`type\` picks the scenario's circle color and default icon; \`icon\` overrides the
glyph (or \`null\` hides it). Actions are a primary fill button and an optional
secondary outline button before it — the row disappears when there are none. It
has no background or border of its own: it takes its host's surface, centred and
capped at 368px (\`sm\`) or 448px (\`lg\`).

## Usage

\`\`\`tsx
<EmptyState title="Nothing here yet" description="Create your first item to get started." primaryAction={{ label: 'Create', onClick: create }} />
<EmptyState type="no-results" title="No results found" secondaryAction={{ label: 'Clear filters', onClick: clear }} />
<EmptyState type="error" title="Something went wrong" primaryAction={{ label: 'Try again', onClick: retry }} secondaryAction={{ label: 'Contact support', onClick: help }} />
<EmptyState type="no-access" title="You don't have access" primaryAction={{ label: 'Request access', onClick: request }} />
<EmptyState type="success" title="You're all caught up" />
<EmptyState size="lg" title="No devices yet" />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Circle · first-use | \`--color-surfaces-primary\`, icon \`--color-primary-primary\` |
| Circle · no-results | \`--color-secondary-secondary-overlay\`, icon \`--color-text-icon-secondary\` |
| Circle · error | \`--color-error-error-overlay\`, icon \`--color-error-error\` |
| Circle · no-access | \`--color-warning-warn-overlay\`, icon \`--color-warning-warn\` |
| Circle · success | \`--color-success-success-overlay\`, icon \`--color-success-success\` |
| Circle shape | \`--radius-1000\`; 48px (\`sm\`) / 64px (\`lg\`), icon \`--space-500\` / \`--space-600\` |
| Title | \`--color-text-icon-primary\`; \`sm\` \`--type-size-subject\` medium, \`lg\` \`--type-size-title\` bold |
| Description | \`--color-text-icon-secondary\`, regular, \`--type-size-body\` (\`sm\`) / \`--type-size-subject\` (\`lg\`) |
| Layout | padding \`--space-500\`, stack gap \`--space-300\`, title ↔ description \`--space-050\`, action gap \`--space-100\` |
| Actions | **Button** \`sm\` (\`sm\` size) / \`md\` (\`lg\` size) — primary fill, secondary outline |

## Accessibility

- The title is a real heading (\`h3\` by default — set \`headingLevel\` to fit the
  page), so screen-reader users find the state when they move by headings.
- The icon is decorative (\`aria-hidden\`); the title and description carry the
  meaning, so write them to stand alone.
- It isn't a live region. If an empty state replaces content after an action
  (e.g. a search), announce the result count elsewhere.
- Button labels name the outcome ("Request access", not "OK").

## Do / Don't

| Do | Don't |
| --- | --- |
| Say what happened and what to do next | Show a bare "No data" |
| Offer one clear primary action | Offer several competing actions |
| Use \`no-results\` with a way to clear the search or filters | Leave people stuck with filters on |
| Keep titles short and specific | Blame the person ("You entered it wrong") |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: 'Nothing here yet',
    description: 'Create your first item to get started.',
    primaryAction: { label: 'Create', onClick: fn() },
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    icon: { control: false, table: { category: 'Content' } },
    primaryAction: { control: false, table: { category: 'Content' } },
    secondaryAction: { control: false, table: { category: 'Content' } },
    type: {
      control: 'inline-radio',
      options: ['first-use', 'no-results', 'error', 'no-access', 'success'],
      table: { category: 'Appearance' },
    },
    size: { control: 'inline-radio', options: ['sm', 'lg'], table: { category: 'Appearance' } },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6], table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

const Grid = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
    {children}
  </div>
);

const SCENARIOS = [
  {
    type: 'first-use' as const,
    title: 'Nothing here yet',
    description: 'Create your first item to get started.',
    primaryAction: { label: 'Create' },
  },
  {
    type: 'no-results' as const,
    title: 'No results found',
    description: 'Try a different search, or clear your filters.',
    secondaryAction: { label: 'Clear filters' },
  },
  {
    type: 'error' as const,
    title: 'Something went wrong',
    description: "We couldn't load this content. Check your connection and try again.",
    primaryAction: { label: 'Try again' },
    secondaryAction: { label: 'Contact support' },
  },
  {
    type: 'no-access' as const,
    title: "You don't have access",
    description: 'Ask an admin to give you access to this area.',
    primaryAction: { label: 'Request access' },
  },
  {
    type: 'success' as const,
    title: "You're all caught up",
    description: "There's nothing that needs your attention right now.",
  },
];

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** The five scenarios (Figma `type`) with their default icons, colors and actions. */
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      {SCENARIOS.map((s) => (
        <EmptyState key={s.type} {...s} />
      ))}
    </Grid>
  ),
};

/** `sm` for cards and panels (48px circle, sm buttons); `lg` for a page or large region (64px circle, md buttons). */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      <EmptyState size="sm" {...SCENARIOS[2]} />
      <EmptyState size="lg" {...SCENARIOS[2]} />
    </Grid>
  ),
};

/** No actions: the action row collapses (e.g. `success`). `icon={null}` hides the circle. */
export const WithoutActionsOrIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      <EmptyState type="success" title="You're all caught up" />
      <EmptyState icon={null} title="No activity this week" description="Activity from your devices shows up here." />
    </Grid>
  ),
};

/** QA matrix — every scenario at both sizes. Audit under every theme via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      {SCENARIOS.flatMap((s) => [
        <EmptyState key={`${s.type}-sm`} size="sm" {...s} />,
        <EmptyState key={`${s.type}-lg`} size="lg" {...s} />,
      ])}
    </Grid>
  ),
};

/** The primary action fires its handler; the title is a heading. */
export const ActionFires: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Nothing here yet' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Create' }));
    await expect(args.primaryAction?.onClick).toHaveBeenCalled();
  },
};
