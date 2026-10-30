import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toast as RadixToast } from 'radix-ui';
import styled from 'styled-components';

import { Toast, type ToastLayout, type ToastStatus, type ToastVariant } from './Toast';

const STATUSES: ToastStatus[] = ['info', 'success', 'warning', 'error', 'neutral'];
const VARIANTS: ToastVariant[] = ['pop-out', 'inline'];
const LAYOUTS: ToastLayout[] = ['simple', 'complex'];

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

/**
 * Radix `Toast.Root` only renders once a `Toast.Viewport` is mounted, and it
 * portals its content into that viewport regardless of where Root sits in
 * the tree. Real apps mount one fixed-position Viewport near the app root;
 * this preview overrides that positioning so the toast renders inline in the
 * docs canvas instead of teleporting to the browser's corner.
 */
const ToastPreview = ({ children }: { children: React.ReactNode }) => (
  <RadixToast.Provider>
    {children}
    <RadixToast.Viewport
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
        maxWidth: 640,
        margin: 0,
        padding: 0,
        listStyle: 'none',
        outline: 'none',
      }}
    />
  </RadixToast.Provider>
);

const meta = {
  title: 'Components/Toast',
  component: Toast,
  decorators: [
    (Story) => (
      <ToastPreview>
        <Story />
      </ToastPreview>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Toast is a transient notification surface, covering both Figma layouts:
\`&Toast Simple\` (node 108:5974, the default) and \`&Toast Complex\` (node
109:6541, \`layout="complex"\`). Use it for short-lived, non-blocking feedback
— a saved confirmation, a background error, an undoable action — that the
user doesn't need to acknowledge to keep working. Use \`Modal\` instead when
the message must interrupt the flow and block interaction until the user
responds.

Every color, spacing, radius, and shadow value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded — including the \`pop-out\` surface's
two-layer drop shadow.

Toast wraps Radix \`Toast\`, so it owns the live-region role and urgency,
auto-dismiss timing, and the swipe-to-dismiss gesture. It renders the message
only: mount a single \`Toast.Provider\` + \`Toast.Viewport\` (from \`radix-ui\`)
once near your app root — positioned and stacked however your product needs —
and render \`Toast\` instances into it. The status icon composes the same
semantic \`ModalIcon\` glyphs used by \`Modal\`, the action buttons compose the
existing \`Button\`, and the close control composes \`IconButton\`.

## Layouts

- **\`simple\`** (default) — a single row: icon, text, actions, and dismiss all
  inline. Actions and the close control share one trailing group.
- **\`complex\`** — stacks a footer row below the icon/text/dismiss row,
  indented to align under the text column. The footer holds an optional
  \`timestamp\` caption alongside the actions, freeing the top row for just the
  message and the dismiss control. Use it when a toast needs a timestamp, or
  when actions would otherwise crowd the dismiss button on one line.

## Usage

\`\`\`tsx
import { Toast as RadixToast } from 'radix-ui';
import { Toast } from '@cake-admin/cakeand';

// once, near the app root — position/stack the Viewport however your product needs
<RadixToast.Provider>
  <App />
  <RadixToast.Viewport />
</RadixToast.Provider>

// wherever a notification is triggered
<Toast status="success" title="Changes saved" onDismiss={() => setOpen(false)} />
<Toast status="error" variant="inline" title="Upload failed" description="Check your connection and try again." />
<Toast
  status="warning"
  title="Storage almost full"
  primaryActionLabel="Manage"
  secondaryActionLabel="Dismiss"
  onPrimaryAction={openStorageSettings}
/>

// complex layout — adds a timestamp/actions footer under the message
<Toast
  layout="complex"
  status="info"
  title="Title"
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  timestamp="01/01/2024 • 9:00 AM"
  secondaryActionLabel="Secondary"
  primaryActionLabel="Primary"
  onDismiss={() => setOpen(false)}
/>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| corner radius | \`--radius-400\` (24px) |
| pop-out surface | \`--color-surfaces-container-blur\`, 45px backdrop blur |
| pop-out elevation | \`--elevation-3\` (Figma \`elevation/3\`) |
| inline surface | \`--color-surfaces-on-container-high\` (no elevation) |
| accessibility outline | \`--stroke-100\` \`--color-stroke-border-container\` border — genuinely transparent in light/dark; forced-colors (Windows High Contrast) repaints it to give the surface an edge |
| status icon | \`--color-info-info\`, \`--color-success-success\`, \`--color-warning-warn\`, \`--color-error-error\`, \`--color-text-icon-primary\` (neutral) |
| title | \`--type-size-subject\` (16px), \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| description / timestamp | \`--type-size-body\` (14px) / \`--type-size-caption\` (12px), \`--font-weight-regular\`, \`--color-text-icon-secondary\` |
| \`simple\` row padding | \`--space-500\` (24px) leading, \`--space-300\` (16px) trailing/vertical |
| \`simple\` content gaps | \`--space-300\` (16px) icon↔text, \`--space-500\` (24px) content↔actions, \`--space-100\` (8px) actions↔close |
| \`complex\` layout padding | \`--space-300\` (16px) on every side, \`--space-300\` (16px) between the content row and the footer |
| \`complex\` content gaps | \`--space-300\` (16px) icon↔text, \`--space-600\` (32px) text↔close, \`--space-075\` (6px) title↔description |
| \`complex\` footer | \`--space-700\` (40px) indent (icon width + gap), \`--space-300\` (16px) timestamp↔actions |

Figma's Simple layout specifies a 640px width and Complex specifies 480px;
treat both as a maximum, not a fixed size — Toast fills whatever width its
Viewport allows.

## Accessibility

- Radix Toast renders an announced live region: \`type="foreground"\` (default)
  is assertive, \`type="background"\` is polite — match the urgency of the
  message.
- The toast auto-dismisses after \`duration\` (5000ms by default); Radix pauses
  the timer on hover/focus and resumes on blur, and a user can swipe to
  dismiss early. Pass \`duration={Infinity}\` for toasts that require an
  explicit action.
- The close control only renders when \`onDismiss\` is supplied — always give
  the user a way to dismiss toasts that don't already auto-dismiss quickly.
- \`onDismiss\` and \`onOpenChange\` are separate callbacks: update your own
  \`open\` state in response to either one so the toast actually unmounts.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use Toast for transient, non-blocking feedback. | Use Toast for content the user must read before continuing — use Modal. |
| Keep the title short; put detail in \`description\`. | Pack a paragraph into the title. |
| Offer at most one primary and one secondary action. | Stack more than two actions in a toast. |
| Keep the action order Secondary → Primary (the Figma \`&Button Group\` rule — the built-in actions already do). | Swap the order in a custom \`actions\` slot; the primary action stays trailing. |
| Reach for \`layout="complex"\` when you need a timestamp. | Use \`complex\` just to fit more actions — keep the action count the same either way. |
| Mount one \`Toast.Provider\`/\`Viewport\` per app. | Nest a Provider/Viewport inside every toast call site. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    status: 'info',
    variant: 'pop-out',
    layout: 'simple',
    title: 'Title',
    description: 'Lorem ipsum dolor sit amet.',
    // The complex footer shows a timestamp beside the actions (per Figma
    // 109:6541). Defaulted so flipping the Playground to layout="complex"
    // matches the spec instead of showing an empty footer-left.
    timestamp: '01/01/2024 • 9:00 AM',
    secondaryActionLabel: 'Secondary',
    primaryActionLabel: 'Primary',
    onSecondaryAction: fn(),
    onPrimaryAction: fn(),
    onDismiss: fn(),
    // Radix auto-dismisses after `duration` (5000ms default) with no
    // hover/focus. Docs examples should stay put until dismissed — flip this
    // control to a finite value to try the real auto-dismiss behavior.
    duration: Infinity,
  },
  argTypes: {
    status: { control: 'inline-radio', options: STATUSES, table: { category: 'Appearance' } },
    variant: { control: 'inline-radio', options: VARIANTS, table: { category: 'Appearance' } },
    layout: { control: 'inline-radio', options: LAYOUTS, table: { category: 'Appearance' } },
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    timestamp: { control: 'text', table: { category: 'Content' } },
    icon: { control: false, table: { category: 'Content' } },
    actions: { control: false, table: { category: 'Content' } },
    secondaryActionLabel: { control: 'text', table: { category: 'Content' } },
    primaryActionLabel: { control: 'text', table: { category: 'Content' } },
    secondaryActionDisabled: { control: 'boolean', table: { category: 'State' } },
    primaryActionDisabled: { control: 'boolean', table: { category: 'State' } },
    dismissLabel: { control: 'text', table: { category: 'Accessibility' } },
    open: { control: false, table: { category: 'State' } },
    defaultOpen: { control: 'boolean', table: { category: 'State' } },
    duration: { control: 'number', table: { category: 'Behavior' } },
    type: {
      control: 'inline-radio',
      options: ['foreground', 'background'],
      table: { category: 'Behavior' },
    },
    onSecondaryAction: { action: 'secondary action', table: { category: 'Events' } },
    onPrimaryAction: { action: 'primary action', table: { category: 'Events' } },
    onDismiss: { action: 'dismiss', table: { category: 'Events' } },
    onOpenChange: { action: 'open change', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Toast>;

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
        <Toast
          key={status}
          status={status}
          title="Title"
          description="Lorem ipsum dolor sit amet."
          secondaryActionLabel="Secondary"
          primaryActionLabel="Primary"
          duration={Infinity}
        />
      ))}
    </Stack>
  ),
};

export const Surface: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`pop-out` is an elevated, blurred surface for floating placement; `inline` is a flush, opaque banner with no elevation for embedding in page content.',
      },
    },
  },
  render: () => (
    <Stack>
      {VARIANTS.map((variant) => (
        <Toast
          key={variant}
          variant={variant}
          status="info"
          title={`variant="${variant}"`}
          description="Lorem ipsum dolor sit amet."
          secondaryActionLabel="Secondary"
          primaryActionLabel="Primary"
          duration={Infinity}
        />
      ))}
    </Stack>
  ),
};

export const Layouts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`simple` keeps everything in one row; `complex` stacks a timestamp + actions footer under the message, indented to align with the text column.',
      },
    },
  },
  render: () => (
    <Stack>
      <Toast
        layout="simple"
        status="info"
        title='layout="simple"'
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        secondaryActionLabel="Secondary"
        primaryActionLabel="Primary"
        onDismiss={fn()}
        duration={Infinity}
      />
      <Toast
        layout="complex"
        status="info"
        title='layout="complex"'
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        timestamp="01/01/2024 • 9:00 AM"
        secondaryActionLabel="Secondary"
        primaryActionLabel="Primary"
        onDismiss={fn()}
        duration={Infinity}
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
          'Description, actions, and the close control are all optional — compose only the slots a given notification needs.',
      },
    },
  },
  render: () => (
    <Stack>
      <Toast status="success" title="Title only" duration={Infinity} />
      <Toast
        status="info"
        title="With description"
        description="Lorem ipsum dolor sit amet."
        duration={Infinity}
      />
      <Toast status="warning" title="With one action" primaryActionLabel="Manage" duration={Infinity} />
      <Toast
        status="error"
        title="With dismiss"
        description="Lorem ipsum dolor sit amet."
        onDismiss={fn()}
        duration={Infinity}
      />
    </Stack>
  ),
};

export const ComplexContentSlots: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'In `layout="complex"`, the timestamp and actions are independent — omit either and the footer row collapses to just the one that remains, or disappears entirely if neither is present.',
      },
    },
  },
  render: () => (
    <Stack>
      <Toast
        layout="complex"
        status="success"
        title="Timestamp, no actions"
        timestamp="9:00 AM"
        onDismiss={fn()}
        duration={Infinity}
      />
      <Toast
        layout="complex"
        status="info"
        title="Actions, no timestamp"
        description="Lorem ipsum dolor sit amet."
        secondaryActionLabel="Secondary"
        primaryActionLabel="Primary"
        duration={Infinity}
      />
      <Toast
        layout="complex"
        status="warning"
        title="Neither"
        description="Lorem ipsum dolor sit amet."
        onDismiss={fn()}
        duration={Infinity}
      />
    </Stack>
  ),
};

export const DisabledAction: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Disable an action while it processes — for example, an undo request in flight.',
      },
    },
  },
  render: () => (
    <Toast
      status="success"
      title="File deleted"
      secondaryActionLabel="Undo"
      secondaryActionDisabled
      primaryActionLabel="Dismiss"
      onPrimaryAction={fn()}
      duration={Infinity}
    />
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix for every status × surface × layout combination. Audit under both themes, including Win HCT for the accessibility outline.',
      },
    },
  },
  render: () => (
    <Stack>
      {LAYOUTS.flatMap((layout) =>
        VARIANTS.flatMap((variant) =>
          STATUSES.map((status) => (
            <Toast
              key={`${layout}-${variant}-${status}`}
              layout={layout}
              variant={variant}
              status={status}
              title="Title"
              description="Lorem ipsum dolor sit amet."
              timestamp={layout === 'complex' ? '01/01/2024 • 9:00 AM' : undefined}
              secondaryActionLabel="Secondary"
              primaryActionLabel="Primary"
              onDismiss={fn()}
              duration={Infinity}
            />
          )),
        ),
      )}
    </Stack>
  ),
};

/** Pure interaction test (hidden from docs): the close control dismisses the toast. */
export const DismissesOnClose: Story = {
  tags: ['!autodocs'],
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Toast
        open={open}
        onOpenChange={setOpen}
        status="info"
        title="Dismiss me"
        onDismiss={() => setOpen(false)}
        duration={Infinity}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Dismiss me')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss notification' }));
    await expect(canvas.queryByText('Dismiss me')).not.toBeInTheDocument();
  },
};

/** Pure interaction test (hidden from docs): the primary action fires its handler. */
export const PrimaryActionFires: Story = {
  tags: ['!autodocs'],
  args: { description: undefined, secondaryActionLabel: undefined },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Primary' }));
    await expect(args.onPrimaryAction).toHaveBeenCalled();
  },
};
