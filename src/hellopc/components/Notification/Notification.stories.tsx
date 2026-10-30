import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import styled from 'styled-components';

import { Notification, type NotificationStatus } from './Notification';

const STATUSES: NotificationStatus[] = ['info', 'success', 'warning', 'error', 'neutral'];

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 480px;
  max-width: 100%;
`;

const meta = {
  title: 'Components/Notification',
  component: Notification,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A **persistent** notification-center card (Figma "Notifications", node
113:5543). Use it for a browsable list of past events — an inbox, a bell-icon
panel, an activity feed — where each item carries an unread state and a
timestamp and stays until the user dismisses it.

This is **not** a Toast. Toast is a transient popup (a Radix \`Toast\` that
auto-dismisses and announces to a live region); Notification is a durable card
the user comes back to. Reach for Toast for fleeting "saved"/"failed"
feedback, and Notification for the record of what happened.

Every color, spacing, radius, and shadow value resolves from the hello pc design
tokens as CSS custom properties, whose names mirror the Figma variables 1:1 —
the **Theme** toolbar toggle re-themes every example on this page live via
\`[data-theme]\`, including the resting drop shadow.

No Radix primitive covers a notification-center card, so the card is a
semantic \`<article>\` (labelled by its title / described by its description);
its interactive parts reuse the Radix-backed hello pc components — the status
glyph is the shared **ModalIcon**, the actions are **Button**, and the close
control is **IconButton**.

## Usage

\`\`\`tsx
<Notification status="info" title="Title" description="…" timestamp="7/20/22 • 8:22 PM" />
<Notification status="success" title="Backup complete" unread timestamp="9:00 AM" />
<Notification
  status="warning"
  title="Storage almost full"
  description="You're using 95% of your plan."
  timestamp="7/20/22 • 8:22 PM"
  unread
  secondaryActionLabel="Dismiss"
  primaryActionLabel="Manage"
  onPrimaryAction={openStorage}
  onDismiss={() => remove(id)}
/>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| surface | \`--color-surfaces-on-container-high\`, \`--radius-400\` (24px) |
| drop shadow | \`--elevation-0\` (Figma \`elevation/0\`) |
| status icon | \`--color-info-info\`, \`--color-success-success\`, \`--color-warning-warn\`, \`--color-error-error\`, \`--color-text-icon-primary\` (neutral) |
| title | \`--type-size-subject\` (16px), \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| description | \`--type-size-body\` (14px), \`--font-weight-regular\`, \`--color-text-icon-secondary\` |
| unread "New" | \`--type-size-body\` (14px), \`--font-weight-medium\`, \`--color-error-error\` |
| timestamp | \`--type-size-body\` (14px), \`--font-weight-regular\`, \`--color-text-icon-secondary\` |
| structure padding / gap | \`--space-300\` (16px) padding, \`--space-300\` between the content row and footer |
| content gaps | \`--space-300\` (16px) icon↔text, \`--space-600\` (32px) text↔close, \`--space-075\` (6px) title↔description |
| footer | \`--space-700\` (40px) indent (icon width + gap), \`--space-050\` (4px) within the meta line, \`--space-100\` (8px) between actions |

Figma draws the card at 400px, but that truncates a normal message; the card
maxes at **480px** (matching the Toast-complex sibling) and fills whatever
narrower width its container allows.

## Accessibility

- The card is an \`<article>\` labelled by its title and described by its
  description, so assistive tech announces the whole notification as a unit.
- The unread state is **visible text** ("New"), not color alone — it's read
  out, satisfying WCAG 1.4.1.
- The close control only renders when \`onDismiss\` is supplied, and reuses
  \`IconButton\` (Radix \`AccessibleIcon\`), so it always has the accessible name
  \`dismissLabel\`.
- If notifications arrive live (e.g. pushed into an open panel), make the
  **container** an \`aria-live="polite"\` region — don't turn each card into a
  live region.
- Actions keep the Figma \`&Button Group\` order: Secondary before Primary.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use for a durable, browsable list of notifications. | Use for transient "saved"/"failed" feedback — that's Toast. |
| Mark unattended items \`unread\`; clear it once seen. | Leave everything \`unread\` forever. |
| Keep the title short; put detail in \`description\`. | Pack a paragraph into the title. |
| Offer at most one primary + one secondary action. | Stack more than two actions in a card. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    status: 'info',
    title: 'Title',
    description: 'Lorem ipsum dolor sit amet, consecter adipiscing elit.',
    timestamp: '7/20/22 • 8:22 PM',
    unread: true,
    secondaryActionLabel: 'Secondary',
    primaryActionLabel: 'Primary',
    onSecondaryAction: fn(),
    onPrimaryAction: fn(),
    onDismiss: fn(),
  },
  argTypes: {
    status: { control: 'inline-radio', options: STATUSES, table: { category: 'Appearance' } },
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    timestamp: { control: 'text', table: { category: 'Content' } },
    unread: { control: 'boolean', table: { category: 'State' } },
    icon: { control: false, table: { category: 'Content' } },
    actions: { control: false, table: { category: 'Content' } },
    secondaryActionLabel: { control: 'text', table: { category: 'Content' } },
    primaryActionLabel: { control: 'text', table: { category: 'Content' } },
    secondaryActionDisabled: { control: 'boolean', table: { category: 'State' } },
    primaryActionDisabled: { control: 'boolean', table: { category: 'State' } },
    dismissLabel: { control: 'text', table: { category: 'Accessibility' } },
    onSecondaryAction: { action: 'secondary action', table: { category: 'Events' } },
    onPrimaryAction: { action: 'primary action', table: { category: 'Events' } },
    onDismiss: { action: 'dismiss', table: { category: 'Events' } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, maxWidth: '100%', padding: 24, boxSizing: 'border-box' }}>
        {Story()}
      </div>
    ),
  ],
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Statuses: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Each status drives the leading icon and its color; `neutral` is Figma\'s colorless "greyscale" status.',
      },
    },
  },
  render: () => (
    <Stack>
      {STATUSES.map((status) => (
        <Notification
          key={status}
          status={status}
          title="Title"
          description="Lorem ipsum dolor sit amet, consecter adipiscing elit."
          timestamp="7/20/22 • 8:22 PM"
          unread
          secondaryActionLabel="Secondary"
          primaryActionLabel="Primary"
          onDismiss={fn()}
        />
      ))}
    </Stack>
  ),
};

export const UnreadState: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The `unread` flag prepends a red **New** indicator before the ' +
          'timestamp. It’s visible text, not color alone — read out as "New" ' +
          'by assistive tech. Clear it once the user has seen the item.',
      },
    },
  },
  render: () => (
    <Stack>
      <Notification
        status="info"
        title="Unread"
        description="Lorem ipsum dolor sit amet."
        timestamp="7/20/22 • 8:22 PM"
        unread
        onDismiss={fn()}
      />
      <Notification
        status="info"
        title="Read"
        description="Lorem ipsum dolor sit amet."
        timestamp="7/20/22 • 8:22 PM"
        onDismiss={fn()}
      />
    </Stack>
  ),
};

export const ContentSlots: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Description, timestamp, unread indicator, actions, and the close ' +
          'control are all optional — the footer collapses to only what remains, ' +
          'and disappears entirely when a card has none of them.',
      },
    },
  },
  render: () => (
    <Stack>
      <Notification status="success" title="Title only" />
      <Notification status="info" title="With timestamp" timestamp="9:00 AM" onDismiss={fn()} />
      <Notification
        status="warning"
        title="With one action"
        description="Lorem ipsum dolor sit amet."
        timestamp="9:00 AM"
        unread
        primaryActionLabel="Manage"
      />
      <Notification
        status="error"
        title="Actions, no timestamp"
        description="Lorem ipsum dolor sit amet."
        secondaryActionLabel="Secondary"
        primaryActionLabel="Primary"
        onDismiss={fn()}
      />
    </Stack>
  ),
};

export const NotificationCenter: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A realistic stack — unread items on top, read below. In a live panel, ' +
          'wrap the list in an `aria-live="polite"` region so new arrivals are ' +
          'announced without making each card a live region.',
      },
    },
  },
  render: () => (
    <Stack role="list" aria-label="Notifications">
      <Notification
        role="listitem"
        status="error"
        title="Payment failed"
        description="Your card was declined. Update your billing details."
        timestamp="7/20/22 • 8:22 PM"
        unread
        secondaryActionLabel="Later"
        primaryActionLabel="Update"
        onDismiss={fn()}
      />
      <Notification
        role="listitem"
        status="success"
        title="Backup complete"
        description="12,480 files backed up to the cloud."
        timestamp="7/20/22 • 6:03 PM"
        unread
        onDismiss={fn()}
      />
      <Notification
        role="listitem"
        status="info"
        title="New comment on “Q3 roadmap”"
        description="Ada: Can we push the launch a week?"
        timestamp="7/19/22 • 4:11 PM"
        primaryActionLabel="Reply"
        onDismiss={fn()}
      />
    </Stack>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: every status × read/unread. Audit under both themes — the ' +
          'resting drop shadow and the red unread indicator should read cleanly ' +
          'on light and dark.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {[true, false].map((unread) => (
        <Stack key={String(unread)}>
          {STATUSES.map((status) => (
            <Notification
              key={status}
              status={status}
              title="Title"
              description="Lorem ipsum dolor sit amet."
              timestamp="7/20/22 • 8:22 PM"
              unread={unread}
              secondaryActionLabel="Secondary"
              primaryActionLabel="Primary"
              onDismiss={fn()}
            />
          ))}
        </Stack>
      ))}
    </div>
  ),
};

/** Pure interaction test (hidden from docs): the close control fires onDismiss. */
export const DismissFires: Story = {
  tags: ['!autodocs'],
  args: { onDismiss: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss notification' }));
    await expect(args.onDismiss).toHaveBeenCalled();
  },
};
