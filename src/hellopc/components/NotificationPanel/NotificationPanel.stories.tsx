import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { NotificationPanel } from './NotificationPanel';
import { Notification } from '../Notification/Notification';

/** A representative set of list items — the panel's `Notification` children,
 *  rendered `flush` so they tile inside the panel's divided list. */
const items = (onDismiss: () => void) => (
  <>
    <Notification
      flush
      status="error"
      title="Payment failed"
      description="Your card was declined. Update your billing details."
      timestamp="7/20/22 • 8:22 PM"
      unread
      secondaryActionLabel="Later"
      primaryActionLabel="Update"
      onDismiss={onDismiss}
    />
    <Notification
      flush
      status="success"
      title="Backup complete"
      description="12,480 files backed up to the cloud."
      timestamp="7/20/22 • 6:03 PM"
      unread
      onDismiss={onDismiss}
    />
    <Notification
      flush
      status="info"
      title="New comment on “Q3 roadmap”"
      description="Ada: Can we push the launch a week?"
      timestamp="7/19/22 • 4:11 PM"
      primaryActionLabel="Reply"
      onDismiss={onDismiss}
    />
    <Notification
      flush
      status="neutral"
      title="Weekly digest ready"
      description="Your activity summary for last week is available."
      timestamp="7/18/22 • 9:00 AM"
      onDismiss={onDismiss}
    />
  </>
);

const meta = {
  title: 'Components/Notification Panel',
  component: NotificationPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The bell/inbox **panel** that holds a list of notifications (Figma
"Notification Panel", node 114:5748) — the surface behind a header's
notification bell, or a slide-in activity drawer. It frames a scrollable list
of \`Notification\` cards with a header (title + settings/close) and an
optional bottom **footer alert** — an inline "Message deleted • Undo"
snackbar.

Composes existing hello pc components rather than rebuilding them: the list items
are the **Notification** component (rendered \`flush\` so they tile with the
panel's dividers), and every control reuses **IconButton** (settings, close,
alert dismiss) and **Button** (the alert's Undo). Every color, spacing,
radius, and shadow value resolves from hello pc tokens that mirror the Figma
variables 1:1 — the **Theme** toolbar re-themes every example live via
\`[data-theme]\`, including the 45px surface blur and the drop shadow.

No Radix primitive covers a panel shell, so it's a semantic \`<section>\`
labelled by its heading; its interactive parts are the Radix-backed hello pc
controls.

## Usage

\`\`\`tsx
<NotificationPanel
  title="Notifications"
  onSettings={openSettings}
  onClose={closePanel}
  footer={{ message: 'Message deleted', actionLabel: 'Undo', onAction: undo, onDismiss: hideAlert }}
>
  {notifications.map((n) => (
    <Notification flush key={n.id} {...n} onDismiss={() => remove(n.id)} />
  ))}
</NotificationPanel>

// no-footer variation — just omit \`footer\`
<NotificationPanel onSettings={openSettings} onClose={closePanel}>
  {items}
</NotificationPanel>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| panel surface | \`--color-surfaces-container-blur\` + 45px backdrop blur, \`--radius-400\` (24px) |
| panel elevation | \`--elevation-3\` (Figma \`elevation/3\`) |
| panel edge (forced-colors) | \`--stroke-100\` \`--color-stroke-border-container\` (transparent in light/dark) |
| header title | \`--type-size-subject\` (16px), \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| list container | \`--radius-400\` (24px), \`--stroke-100\` \`--color-stroke-border-low\` border + item dividers |
| footer alert | \`--color-primary-primary-overlay\` fill, rounded bottom \`--radius-400\`; message \`--color-text-icon-primary\` |
| padding / gaps | \`--space-300\` (16px) content inset, \`--space-500\` (24px) header↔list, \`--space-100\` (8px) header actions; the footer alert is full-bleed to the panel edges with \`--space-300\` (16px) block / \`--space-600\` (32px) inline padding, and the content inset leaves the gap above it |

The panel maxes at 432px (400px list + 16px padding each side) and fills
narrower containers. The list items are \`Notification\`s with \`flush\` set —
the panel owns their rounding, clipping, and dividers.

## Accessibility

- The panel is a \`<section>\` labelled by its heading, so assistive tech
  exposes it as a named region a user can jump to.
- Every header/footer control reuses \`IconButton\`/\`Button\` (Radix-backed), so
  the settings, close, Undo, and alert-dismiss controls all have accessible
  names.
- The footer alert is a \`role="status"\` live region, so "Message deleted" is
  announced when it appears — the right urgency for an undoable action.
- Each list item keeps its own \`Notification\` semantics (labelled article,
  dismiss control). For a live panel, keep the item list itself an
  \`aria-live="polite"\` region if items stream in.

## Do / Don't

| Do | Don't |
| --- | --- |
| Compose \`Notification flush\` children; let the panel own dividers/rounding. | Nest full-shadow standalone \`Notification\`s — pass \`flush\`. |
| Use the footer alert for a transient, undoable result. | Leave the footer alert up permanently — it's a snackbar. |
| Give the panel a settings and/or close control users expect. | Hide the close control on a dismissible overlay panel. |
| Let the list scroll when it overflows the viewport. | Force every notification to fit without scrolling. |
`,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 480, boxSizing: 'border-box' }}>
        {Story()}
      </div>
    ),
  ],
  args: {
    title: 'Notifications',
    onSettings: fn(),
    onClose: fn(),
    footer: {
      message: 'Message deleted',
      actionLabel: 'Undo',
      onAction: fn(),
      onDismiss: fn(),
    },
  },
  argTypes: {
    title: { control: 'text', table: { category: 'Content' } },
    footer: { control: false, table: { category: 'Content' } },
    headerActions: { control: false, table: { category: 'Content' } },
    children: { control: false, table: { category: 'Content' } },
    settingsLabel: { control: 'text', table: { category: 'Accessibility' } },
    closeLabel: { control: 'text', table: { category: 'Accessibility' } },
    onSettings: { action: 'settings', table: { category: 'Events' } },
    onClose: { action: 'close', table: { category: 'Events' } },
  },
  render: (args) => <NotificationPanel {...args}>{items(fn())}</NotificationPanel>,
} satisfies Meta<typeof NotificationPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive the panel props from the Controls panel below. */
export const Playground: Story = {};

export const WithFooter: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The default panel: header (settings + close), a divided list of ' +
          'notifications, and the bottom footer alert — a `role="status"` "Message ' +
          'deleted • Undo" snackbar for a transient, undoable result.',
      },
    },
  },
  render: () => (
    <NotificationPanel
      onSettings={fn()}
      onClose={fn()}
      footer={{ message: 'Message deleted', actionLabel: 'Undo', onAction: fn(), onDismiss: fn() }}
    >
      {items(fn())}
    </NotificationPanel>
  ),
};

export const NoFooter: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The no-footer variation — omit `footer` and the panel is just the ' +
          'header and the notification list. Use it when there’s no transient ' +
          'result to surface.',
      },
    },
  },
  render: () => (
    <NotificationPanel onSettings={fn()} onClose={fn()}>
      {items(fn())}
    </NotificationPanel>
  ),
};

export const HeaderControls: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The header controls are independent — a settings gear, a close, both, ' +
          'or neither. Each renders only when its handler is supplied.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <NotificationPanel title="Both" onSettings={fn()} onClose={fn()}>
        {items(fn())}
      </NotificationPanel>
      <NotificationPanel title="Close only" onClose={fn()}>
        {items(fn())}
      </NotificationPanel>
    </div>
  ),
};

export const Empty: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A single notification — the list container rounds and clips a lone ' +
          'card the same way it frames a full stack.',
      },
    },
  },
  render: () => (
    <NotificationPanel onClose={fn()}>
      <Notification
        flush
        status="info"
        title="You’re all caught up"
        description="No new notifications."
        timestamp="Just now"
      />
    </NotificationPanel>
  ),
};

/** Pure interaction test (hidden from docs): the footer Undo action fires. */
const undoFn = fn();
export const FooterUndoFires: Story = {
  tags: ['!autodocs'],
  render: () => (
    <NotificationPanel
      onClose={fn()}
      footer={{ message: 'Message deleted', actionLabel: 'Undo', onAction: undoFn }}
    >
      {items(fn())}
    </NotificationPanel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    undoFn.mockClear();
    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }));
    await expect(undoFn).toHaveBeenCalled();
  },
};
