import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import type { ReactNode } from 'react';

import { AvatarGroup, type AvatarGroupPerson } from './AvatarGroup';

const PEOPLE: AvatarGroupPerson[] = [
  { name: 'Emma Wright', initials: 'EW' },
  { name: 'Diego López', initials: 'DL' },
  { name: 'Sam Jones', initials: 'SJ' },
  { name: 'Mia Kim', initials: 'MK' },
  { name: 'Priya Nair', initials: 'PN' },
  { name: 'Tom Becker', initials: 'TB' },
];

const meta = {
  title: 'Components/Avatar/Avatar Group',
  component: AvatarGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A compact stack of overlapping avatars — who's on a project, in a thread, or
assigned to a task. Up to \`max\` people show; the rest collapse into a "+N" chip.
For a single person, use \`Avatar\`; for a full member list, use a list or table.

Every color, spacing, and type value resolves from hello pc token custom
properties — the **Theme** toolbar toggle re-themes every example on this page
live. Nothing is hardcoded.

The first person sits on top. Without photos, colors cycle primary → teal →
amber → violet so neighbours differ (override per person with \`color\`). Each
avatar has a 2px ring in the surface color so the overlap reads as a cut-out. With
\`showTooltips\` (default) every avatar is a tab stop with a tooltip of the full
name, and the "+N" chip lists the hidden names.

## Usage

\`\`\`tsx
<AvatarGroup label="Project members" people={people} />
<AvatarGroup label="Reviewers" people={people} max={2} size="sm" />
<AvatarGroup label="Assignees" people={withPhotos} max={4} size="lg" />
<AvatarGroup label="Watchers" people={people} showTooltips={false} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| Avatar colors | **Avatar** \`color\`: primary \`--color-primary-primary-overlay\`; teal / amber / violet \`--color-badge-<hue>-light\` + \`--color-badge-text-icon-on-<hue>-light\` |
| Cut-out ring | \`--stroke-200\` \`--color-surfaces-container\` |
| Overlap | \`--space-075\` (\`sm\`) / \`--space-100\` (\`md\`) / \`--space-150\` (\`lg\`) |
| Overflow chip | \`--color-surfaces-on-container-low\`, \`--color-text-icon-secondary\`, medium; \`--type-size-caption\` / \`-body\` / \`-subject\` |
| Tooltip | **SimpleTooltip** |

## Accessibility

- The stack is a \`role="group"\` named by \`label\` ("Project members").
- Each avatar is named by the person's full name — never just initials. The
  "+N" chip is named "3 more: Sam Jones, Mia Kim, …".
- With tooltips, each avatar is a focusable button that shows the name; without,
  each is an image with that name and nothing is focusable.

## Do / Don't

| Do | Don't |
| --- | --- |
| Name the group with \`label\` | Leave a stack of initials unexplained |
| Keep \`max\` small (2–4) | Show a long row of overlapping faces |
| Use photos when you have them | Mix sizes in one group |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { label: 'Project members', people: PEOPLE, max: 3, size: 'md' },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    people: { control: 'object', table: { category: 'Content' } },
    overflowLabel: { control: false, table: { category: 'Content' } },
    max: { control: 'inline-radio', options: [2, 3, 4], table: { category: 'Appearance' } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], table: { category: 'Appearance' } },
    showTooltips: { control: 'boolean', table: { category: 'Behavior' } },
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/** `max` 2 / 3 / 4 visible (Figma `visible`), each with the "+N" chip for the rest. */
export const Visible: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      {([2, 3, 4] as const).map((m) => (
        <AvatarGroup key={m} label={`Members, ${m} shown`} people={PEOPLE} max={m} />
      ))}
    </Stack>
  ),
};

/** `sm` 32px, `md` 40px, `lg` 48px. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <AvatarGroup key={s} label={`Members, ${s}`} people={PEOPLE} size={s} />
      ))}
    </Stack>
  ),
};

/** No overflow chip when everyone fits. */
export const AllShown: Story = {
  args: { people: PEOPLE.slice(0, 3), max: 3 },
};

/** QA matrix — size × visible count. Audit under every theme via the toolbar. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Stack>
      {(['sm', 'md', 'lg'] as const).flatMap((s) =>
        ([2, 3, 4] as const).map((m) => (
          <AvatarGroup key={`${s}-${m}`} label={`Members ${s} ${m}`} people={PEOPLE} size={s} max={m} />
        )),
      )}
    </Stack>
  ),
};

/** The group and each avatar are named; the overflow chip lists hidden people. */
export const AccessibleNames: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Project members' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Emma Wright' })).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: '3 more: Mia Kim, Priya Nair, Tom Becker' }),
    ).toBeInTheDocument();
  },
};
