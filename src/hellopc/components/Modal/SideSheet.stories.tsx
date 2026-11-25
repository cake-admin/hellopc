import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { Button } from '../Button/Button';
import { HorizontalTabItem } from '../HorizontalTabs/HorizontalTabItem';
import { HorizontalTabsContent } from '../HorizontalTabs/HorizontalTabs';
import { TextInput } from '../TextInput/TextInput';
import { SideSheet, type SideSheetDensity, type SideSheetProps, type SideSheetSize } from './SideSheet';

/* Story chrome — raw px is fine here (not the component). */
const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>{children}</div>
);

const Fields = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <TextInput label="Full name" defaultValue="Alex Morgan" />
    <TextInput label="Email" defaultValue="alex.morgan@example.com" />
    <TextInput label="Phone" defaultValue="+1 555 0100" />
    <TextInput label="Company" defaultValue="Contoso" />
    <TextInput label="Role" defaultValue="IT administrator" />
  </div>
);

const Actions = ({ onDone }: { onDone: () => void }) => (
  <>
    <Button size="sm" variant="outline" intent="secondary" onClick={onDone}>
      Cancel
    </Button>
    <Button size="sm" onClick={onDone}>
      Save
    </Button>
  </>
);

const TABS = ['Overview', 'Hierarchy', 'Notes', 'History'];

/** A trigger button plus a controlled SideSheet — every story opens one this way. */
const Demo = ({
  trigger = 'Open side sheet',
  withTabs = false,
  withFooter = true,
  withAction = true,
  ...props
}: Partial<SideSheetProps> & {
  trigger?: string;
  withTabs?: boolean;
  withFooter?: boolean;
  withAction?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" variant="outline" intent="secondary" onClick={() => setOpen(true)}>
        {trigger}
      </Button>
      <SideSheet
        title="Contact details"
        {...props}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          props.onOpenChange?.(next);
        }}
        headerAction={withAction ? <Button size="sm">Edit</Button> : undefined}
        footer={withFooter ? <Actions onDone={() => setOpen(false)} /> : undefined}
        tabs={
          withTabs
            ? TABS.map((t) => (
                <HorizontalTabItem key={t} value={t}>
                  {t}
                </HorizontalTabItem>
              ))
            : undefined
        }
      >
        {withTabs
          ? TABS.map((t) => (
              <HorizontalTabsContent key={t} value={t}>
                {t === 'Overview' ? <Fields /> : <p style={{ margin: 0 }}>{t} for this contact.</p>}
              </HorizontalTabsContent>
            ))
          : props.children ?? <Fields />}
      </SideSheet>
    </>
  );
};

const meta = {
  title: 'Components/Modal/Side Sheet',
  component: SideSheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Side Sheet is a full-height panel that slides in from the right edge over the
modal scrim (Figma \`hellopc.side.sheet\`, formerly \`hellopc.drawer\`). Use it
to view or edit a record without leaving the page — a contact, a device, a
ticket. Use **Modal** for a short, centred decision ("Delete this file?"), and
an inline page section when the content should not block the rest of the page.

Every color, spacing, radius, shadow, and type value resolves from hello pc CSS
custom properties that mirror Figma variables. The **Theme** toolbar re-themes
every example on this page live; nothing is hardcoded.

Side Sheet wraps Radix \`Dialog\` and is **modal** — it traps focus, locks page
scroll, closes on Esc or a scrim click, and returns focus to the control that
opened it. It is controlled (\`open\` + \`onOpenChange\`) or uncontrolled
(\`defaultOpen\`). The header is the title, an optional description, an
optional \`headerAction\` (usually one small Button), and a close IconButton.
\`tabs\` adds a HorizontalTabs bar under the header; then \`children\` are the
\`HorizontalTabsContent\` panels. The body scrolls on its own between the
fixed header and the optional \`footer\`. A non-modal (push) variant is not
part of v1.

## Usage

\`\`\`tsx
<SideSheet open={open} onOpenChange={setOpen} title="Contact details">…</SideSheet>
<SideSheet title="Contact details" description="Last edited today" … />
<SideSheet title="Contact details" headerAction={<Button size="sm">Edit</Button>} … />
<SideSheet title="Contact details" size="lg" … />
<SideSheet title="Contact details" density="compact" … />
<SideSheet title="Contact details" footer={<><Button size="sm" variant="outline" intent="secondary">Cancel</Button><Button size="sm">Save</Button></>} … />
<SideSheet title="Contact details" tabs={<><HorizontalTabItem value="overview">Overview</HorizontalTabItem>…</>}><HorizontalTabsContent value="overview">…</HorizontalTabsContent></SideSheet>
\`\`\`

## Design tokens used

| Part | Default density | Compact density |
| --- | --- | --- |
| surface | \`--color-surfaces-container\` | same |
| elevation | \`--elevation-5\` (Figma \`elevation/5\`) | same |
| corners | \`--radius-300\` (16px) top-left + bottom-left only | same |
| scrim | \`--color-overlay-scrim\` + \`blur(12px)\` (shared with Modal) | same |
| width | sm 400 / md 480 / lg 640px (intrinsic), max \`100vw\` | same |
| header padding · gap | \`--space-400\` / \`--space-500\` (20/24px) · \`--space-100\` | \`--space-200\` / \`--space-300\` (12/16px) |
| title | \`--type-size-title\` (20px) \`--font-weight-bold\` \`--color-text-icon-primary\` | \`--type-size-subject\` (16px) |
| description | \`--type-size-body\` \`--font-weight-regular\` \`--color-text-icon-secondary\`, \`--space-050\` below the title | same |
| header action | consumer Button, usually \`size="sm"\` (32px) | same |
| close | IconButton \`size="sm"\` (32px, 24px icon) \`intent="secondary"\` \`variant="ghost"\` | same |
| tabs | HorizontalTabs \`size="default"\` (48px), \`--space-500\` side inset | \`size="compact"\` (~36px), \`--space-300\` inset |
| rules (under tabs, over footer) | \`--stroke-100\` \`--color-stroke-border\` | same |
| content padding | \`--space-500\` (24px) | \`--space-300\` (16px) |
| footer | ModalFooter \`divider\`, \`--space-300\` / \`--space-500\` (16/24px), actions gap \`--space-100\` | ModalFooter \`density="compact"\` — \`--space-200\` / \`--space-300\` (12/16px) |

Where Figma and the build differ, on purpose:

- **The title group grows.** Figma fixes it at 27px (22px compact), which clips
  the description; here it sizes to its content.
- **Inactive tab labels are medium 14.** The tab item's Figma description says
  "bold 14", but the rendered tabs (and the existing HorizontalTabs) use bold
  only for the selected tab. The sheet follows HorizontalTabs.
- **Compact paddings map to tokens.** Figma's compact variants use raw px
  (12/16/6/8/4); they map exactly onto \`--space-200\`, \`--space-300\`,
  \`--space-075\`, \`--space-100\`, \`--space-050\`.
- **Right edge only.** The sheet always enters from the physical right edge,
  in right-to-left layouts too. An RTL mirror is a follow-up.

## Accessibility

- Radix Dialog gives the \`dialog\` role with \`aria-modal\`, the focus trap,
  initial focus inside the sheet, scroll lock, Esc and scrim dismissal, and
  focus return to the trigger.
- \`title\` renders through \`Dialog.Title\`, so it names the dialog;
  \`description\` renders through \`Dialog.Description\`. When there is no
  description the \`aria-describedby\` link is removed rather than left dangling.
- The close control is an IconButton with an accessible name — set
  \`closeLabel\` when "Close" is not specific enough (e.g. "Close contact details").
- The scrolling content area is a keyboard-focusable \`region\` named by the
  title, so keyboard users can scroll read-only content with the arrow keys.
  It shows the standard focus ring.
- The tab bar is a full Radix tablist (Left/Right, Home/End). Name it with
  \`tabsLabel\`.
- The slide-in animation is turned off under \`prefers-reduced-motion\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use a side sheet to view or edit one record in context. | Use it for a quick yes/no decision — use Modal. |
| Keep one primary action in the footer ("Save"), after "Cancel". | Stack several primary buttons in the header and footer. |
| Use \`density="compact"\` for long forms in dense, data-heavy screens. | Mix densities between the header, tabs and footer. |
| Give the close control a specific \`closeLabel\` when several sheets exist. | Remove every way to close the sheet. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    title: 'Contact details',
    description: 'Short supporting description',
    size: 'md',
    density: 'default',
    closeLabel: 'Close',
    tabsLabel: 'Sections',
    onOpenChange: fn(),
    onTabChange: fn(),
  },
  argTypes: {
    open: { control: false, table: { category: 'State' } },
    defaultOpen: { control: 'boolean', table: { category: 'State' } },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    density: {
      control: 'inline-radio',
      options: ['default', 'compact'],
      table: { category: 'Appearance' },
    },
    title: { control: 'text', table: { category: 'Content' } },
    description: { control: 'text', table: { category: 'Content' } },
    headerAction: { control: false, table: { category: 'Content' } },
    tabs: { control: false, table: { category: 'Content' } },
    footer: { control: false, table: { category: 'Content' } },
    children: { control: false, table: { category: 'Content' } },
    tabsLabel: { control: 'text', table: { category: 'Accessibility' } },
    closeLabel: { control: 'text', table: { category: 'Accessibility' } },
    tabValue: { control: false, table: { category: 'State' } },
    defaultTabValue: { control: 'text', table: { category: 'State' } },
    onOpenChange: { action: 'open change', table: { category: 'Events' } },
    onTabChange: { action: 'tab change', table: { category: 'Events' } },
  },
} satisfies Meta<typeof SideSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — open the sheet, then drive every prop from the Controls panel below. */
export const Playground: Story = {
  render: (args) => <Demo {...args} withTabs />,
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`sm` 400px, `md` 480px (default), `lg` 640px — always the full viewport height. ' +
          'Pick the narrowest width that fits the record without horizontal scrolling.',
      },
    },
  },
  render: () => (
    <Row>
      {(['sm', 'md', 'lg'] as SideSheetSize[]).map((s) => (
        <Demo key={s} size={s} trigger={`Open ${s}`} title={`Contact details (${s})`} />
      ))}
    </Row>
  ),
};

export const Density: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`compact` tightens the header (12/16px, 16px title), the tabs (~36px), the content ' +
          'inset (16px) and the footer (12/16px) — about 50px more room for content.',
      },
    },
  },
  render: () => (
    <Row>
      {(['default', 'compact'] as SideSheetDensity[]).map((d) => (
        <Demo key={d} density={d} withTabs trigger={`Open ${d}`} />
      ))}
    </Row>
  ),
};

export const HeaderContent: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The description and the header action are optional. The title group grows to fit ' +
          'a description (Figma clips it at a fixed height).',
      },
    },
  },
  render: () => (
    <Row>
      <Demo trigger="Title only" withAction={false} withFooter={false} />
      <Demo trigger="With description" description="Last edited today by Alex" withAction={false} />
      <Demo trigger="With description + action" description="Last edited today by Alex" />
    </Row>
  ),
};

export const WithTabs: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`tabs` adds a HorizontalTabs bar under the header with a rule beneath it. Pass ' +
          '`HorizontalTabItem`s as `tabs` and the matching `HorizontalTabsContent` panels as ' +
          '`children`. The first tab is selected unless `defaultTabValue` or `tabValue` says otherwise.',
      },
    },
  },
  render: () => <Demo withTabs />,
};

export const LongContent: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Only the content area scrolls; the header, tabs and footer stay put. The content ' +
          'uses the shared hello pc scrollbar.',
      },
    },
  },
  render: () => (
    <Demo trigger="Open long sheet">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <TextInput key={i} label={`Field ${i + 1}`} />
        ))}
      </div>
    </Demo>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: every size × density, with tabs and footer. Open each under light.a, ' +
          'dark.a and win hct from the Theme toolbar.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['default', 'compact'] as SideSheetDensity[]).map((d) => (
        <Row key={d}>
          {(['sm', 'md', 'lg'] as SideSheetSize[]).map((s) => (
            <Demo
              key={s}
              size={s}
              density={d}
              withTabs
              description="Short supporting description"
              trigger={`${s} · ${d}`}
            />
          ))}
        </Row>
      ))}
    </div>
  ),
};

/** Pure interaction test (hidden from docs): opens, Esc closes, focus returns to the trigger. */
export const OpensAndEscCloses: Story = {
  tags: ['!autodocs'],
  render: (args) => <Demo {...args} trigger="Open sheet" withTabs />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(trigger);

    const sheet = await within(document.body).findByRole('dialog');
    await expect(sheet).toHaveAccessibleName('Contact details');
    await expect(sheet).toHaveAccessibleDescription('Short supporting description');
    await expect(within(sheet).getByRole('tablist')).toHaveAccessibleName('Sections');
    // The scrolling body is a named, keyboard-focusable region.
    const region = within(sheet).getByRole('region', { name: 'Contact details' });
    await expect(region).toHaveAttribute('tabindex', '0');
    region.focus();
    await expect(region).toHaveFocus();
    await expect(within(sheet).getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** Pure interaction test (hidden from docs): `tabs` passed as a Fragment still
 *  selects the first tab, and switching tabs starts the new panel at the top. */
export const FragmentTabsAndScrollReset: Story = {
  tags: ['!autodocs'],
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button size="sm" onClick={() => setOpen(true)}>
          Open sheet
        </Button>
        <SideSheet
          {...args}
          open={open}
          onOpenChange={setOpen}
          tabs={
            <>
              <HorizontalTabItem value="overview">Overview</HorizontalTabItem>
              <HorizontalTabItem value="notes">Notes</HorizontalTabItem>
            </>
          }
        >
          <HorizontalTabsContent value="overview">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Array.from({ length: 14 }, (_, i) => (
                <TextInput key={i} label={`Field ${i + 1}`} />
              ))}
            </div>
          </HorizontalTabsContent>
          <HorizontalTabsContent value="notes">
            <div style={{ height: 2000 }}>Notes for this contact.</div>
          </HorizontalTabsContent>
        </SideSheet>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open sheet' }));
    const sheet = await within(document.body).findByRole('dialog');

    // Fragment children are unwrapped, so the first tab is selected.
    await expect(within(sheet).getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    const scroller = within(sheet).getByRole('tabpanel').parentElement as HTMLElement;
    scroller.scrollTop = 400;
    await waitFor(() => expect(scroller.scrollTop).toBeGreaterThan(0));

    await userEvent.click(within(sheet).getByRole('tab', { name: 'Notes' }));
    await expect(within(sheet).getByRole('tabpanel')).toHaveTextContent('Notes for this contact.');
    await expect(scroller.scrollTop).toBe(0);
  },
};

/** Pure interaction test (hidden from docs): the close control and a footer action both dismiss. */
export const CloseControlsDismiss: Story = {
  tags: ['!autodocs'],
  args: { closeLabel: 'Close contact details' },
  render: (args) => <Demo {...args} trigger="Open sheet" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Open sheet' }));
    let sheet = await body.findByRole('dialog');
    await userEvent.click(within(sheet).getByRole('button', { name: 'Close contact details' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());

    await userEvent.click(canvas.getByRole('button', { name: 'Open sheet' }));
    sheet = await body.findByRole('dialog');
    await userEvent.click(within(sheet).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
