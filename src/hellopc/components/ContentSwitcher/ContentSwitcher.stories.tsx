import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Home, LayoutGrid, List, Rows3 } from 'lucide-react';

import { ContentSwitcher, type ContentSwitcherOption } from './ContentSwitcher';

const TABS: ContentSwitcherOption[] = [
  { value: 'one', label: 'Tab name' },
  { value: 'two', label: 'Tab name' },
  { value: 'three', label: 'Tab name' },
  { value: 'four', label: 'Tab name' },
];

const VIEWS: ContentSwitcherOption[] = [
  { value: 'home', label: 'Home', icon: <Home /> },
  { value: 'grid', label: 'Grid view', icon: <LayoutGrid /> },
  { value: 'list', label: 'List view', icon: <List /> },
  { value: 'rows', label: 'Compact rows', icon: <Rows3 /> },
];

const meta = {
  title: 'Components/Content Switcher',
  component: ContentSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A segmented control for switching between a small set of mutually exclusive
views (Figma "&content switcher", node 149:9094) — a filled pill slides between
segments on a tinted track.

Wraps the Radix \`ToggleGroup\` primitive in single-selection mode, which supplies
roving arrow-key focus, \`data-state\`, and disabled handling.

**Why \`ToggleGroup\` and not \`Tabs\`:** a switcher is a *control*, not
necessarily a tab set. Radix \`Tabs\` triggers emit \`aria-controls\` pointing at a
panel, so using Tabs without panels leaves dangling references. \`ToggleGroup\`
reports a value and lets you drive whatever you're switching — a panel, a chart
mode, a list density. If you genuinely have labelled panels, reach for
**Horizontal Tabs** instead.

The segments are the existing hello pc **Button** and **IconButton**, not bespoke
markup: Figma builds them from \`&button\` / \`&icon button\`, and the
selected/unselected treatments map exactly onto the \`fill\` and \`ghost\`
variants.

## Usage

\`\`\`tsx
import { ContentSwitcher } from '@/hellopc/components/ContentSwitcher';

const [view, setView] = useState('grid');

<ContentSwitcher
  aria-label="View mode"
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
  ]}
  value={view}
  onValueChange={setView}
/>

// icon-only — each label becomes the segment's accessible name
<ContentSwitcher
  aria-label="View mode"
  iconOnly
  options={[
    { value: 'grid', label: 'Grid view', icon: <LayoutGrid /> },
    { value: 'list', label: 'List view', icon: <List /> },
  ]}
/>

// neutral treatment, small
<ContentSwitcher aria-label="Range" intent="secondary" size="sm" options={…} />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| track (primary) | \`--color-primary-primary-overlay\`, \`--radius-1000\` |
| track (secondary) | \`--color-secondary-secondary-overlay\`, \`--radius-1000\` |
| track inset | \`--space-025\` (2px) at \`md\`; flush at \`sm\` (per Figma) |
| segment gap | \`--space-025\` (2px) |
| selected (primary) | **Button** \`fill\`/\`primary\` → \`--color-primary-primary\` + \`--color-text-icon-on-primary\` |
| selected (secondary) | **Button** \`fill\`/\`secondary\` → \`--color-secondary-secondary\` + \`--color-text-icon-inverse\` |
| unselected | **Button** \`ghost\` — transparent, label in the intent's color |
| selected elevation | \`--elevation-0\` (Figma \`elevation/0\`) |
| segment sizing | Button/IconButton \`sm\` (32px) and \`md\` (40px) |

On dark (\`data-theme="dark.a"\`) and Windows HCT (\`data-theme="win hct"\`),
overlay washes collapse or sit too close to the canvas. The track keeps a
\`--color-stroke-border\` inset edge; HCT swaps the track fill to
\`--color-surfaces-container\` so ghost labels stay readable. Unselected hover
uses \`--color-surfaces-inverse-container\` + \`--color-text-icon-inverse\` with a
\`--color-primary-primary\` edge (same spirit as Dropdown), and selected segments
keep a primary edge when elevation shadows flatten.

Two notes on the reuse:

- This is the second component (after **Pagination**) to need a ghost/secondary
  button *without* the link underline, so \`underline\` is now a documented
  **Button** prop rather than another private fork. The switcher passes
  \`underline={false}\` — the track already makes it obvious these are controls.
- Figma colors the unselected secondary label \`--color-surfaces-inverse-container\`
  (#121318) while hello pc's ghost/secondary Button uses \`--color-secondary-secondary\`
  (#282626). Both read as near-black; the Button token is kept so the switcher
  stays consistent with every other ghost button. Worth reconciling in Figma.

## Accessibility

- Radix renders a group of toggle buttons carrying \`aria-pressed\`, with roving
  focus: **Tab** reaches the group, **arrow keys** move between segments.
- Always pass \`aria-label\` — an unnamed group of "Tab name" buttons tells a
  screen-reader user nothing.
- Selection is never color-only: the selected segment changes fill *and* gains
  the elevation shadow, and \`aria-pressed\` reports it.
- Icon-only segments still carry a real accessible name via each option's
  \`label\` (IconButton wraps Radix \`AccessibleIcon\`), so they're never announced
  as unlabelled buttons.
- Re-pressing the active segment can't clear the selection — a switcher always
  has exactly one view chosen.
- If the switcher controls a region elsewhere on the page, point
  \`aria-controls\` at it and keep that region's updates in a live region if they
  aren't otherwise obvious.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use it for 2–5 mutually exclusive views. | Use it for a long list — that's a Dropdown. |
| Keep segment labels one or two words. | Write sentence-length segment labels. |
| Give icon-only segments a real \`label\`. | Ship icon segments with no accessible name. |
| Use **Horizontal Tabs** when you have labelled panels. | Force this into a tab pattern with \`aria-controls\` to nothing. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    options: TABS,
    defaultValue: 'one',
    size: 'md',
    intent: 'primary',
    iconOnly: false,
    'aria-label': 'Tab selection',
  },
  argTypes: {
    options: { control: false, table: { category: 'Content' } },
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: 'text', table: { category: 'State' } },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    intent: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },
    iconOnly: { control: 'boolean', table: { category: 'Appearance' } },
    onValueChange: { action: 'value change', table: { category: 'Events' } },
  },
} satisfies Meta<typeof ContentSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel. */
export const Playground: Story = {};

export const Intents: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Figma’s `style` axis: `primary` tints the track indigo and fills the ' +
          'selected segment with the primary color; `secondary` uses the neutral ' +
          'ink family.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ContentSwitcher aria-label="Primary" options={TABS} defaultValue="one" />
      <ContentSwitcher aria-label="Secondary" options={TABS} defaultValue="one" intent="secondary" />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`md` is 40px with a 2px track inset; `sm` is 32px and sits flush, ' +
          'matching Figma’s M and S variants.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ContentSwitcher aria-label="Medium" options={TABS} defaultValue="one" size="md" />
      <ContentSwitcher aria-label="Small" options={TABS} defaultValue="one" size="sm" />
    </div>
  ),
};

export const IconOnly: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With `iconOnly`, each segment renders an **IconButton** and its `label` ' +
          'becomes the accessible name — so a view switcher is still announced ' +
          'properly rather than as four unlabelled buttons.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ContentSwitcher aria-label="View mode" options={VIEWS} defaultValue="home" iconOnly />
      <ContentSwitcher
        aria-label="View mode"
        options={VIEWS}
        defaultValue="home"
        iconOnly
        intent="secondary"
      />
      <ContentSwitcher aria-label="View mode" options={VIEWS} defaultValue="home" iconOnly size="sm" />
      <ContentSwitcher
        aria-label="View mode"
        options={VIEWS}
        defaultValue="home"
        iconOnly
        size="sm"
        intent="secondary"
      />
    </div>
  ),
};

export const Controlled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Drive `value` from your own state to actually switch content. Note that ' +
          're-pressing the active segment does not clear it — the switcher always ' +
          'has one view selected.',
      },
    },
  },
  render: function ControlledSwitcher() {
    const [view, setView] = React.useState('grid');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <ContentSwitcher
          aria-label="View mode"
          options={[
            { value: 'grid', label: 'Grid' },
            { value: 'list', label: 'List' },
            { value: 'rows', label: 'Compact' },
          ]}
          value={view}
          onValueChange={setView}
        />
        <div
          style={{
            padding: 'var(--space-300)',
            borderRadius: 'var(--radius-300)',
            background: 'var(--color-surfaces-on-container-high)',
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--type-size-body)',
          }}
        >
          Showing the <strong>{view}</strong> view.
        </div>
      </div>
    );
  },
};

export const DisabledSegment: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A segment can be disabled individually — it dims and arrow-key ' +
          'navigation skips it.',
      },
    },
  },
  render: () => (
    <ContentSwitcher
      aria-label="Range"
      defaultValue="day"
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'year', label: 'Year', disabled: true },
      ]}
    />
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix: every intent × size, labelled and icon-only. Audit under ' +
          'both themes — the track is a translucent overlay, so it has to hold on ' +
          'either surface.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['primary', 'secondary'] as const).map((intent) =>
        (['md', 'sm'] as const).map((size) => (
          <div key={`${intent}-${size}`} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <ContentSwitcher
              aria-label={`${intent} ${size}`}
              options={TABS}
              defaultValue="one"
              intent={intent}
              size={size}
            />
            <ContentSwitcher
              aria-label={`${intent} ${size} icons`}
              options={VIEWS}
              defaultValue="home"
              intent={intent}
              size={size}
              iconOnly
            />
          </div>
        )),
      )}
    </div>
  ),
};

/** Pure interaction test (hidden from docs): selection, and that re-pressing
 *  the active segment can't clear it. */
const changed = fn();
export const SelectionCannotBeCleared: Story = {
  tags: ['!autodocs'],
  render: () => (
    <ContentSwitcher
      aria-label="View mode"
      defaultValue="grid"
      onValueChange={changed}
      options={[
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    changed.mockClear();

    const grid = canvas.getByRole('button', { name: 'Grid' });
    const list = canvas.getByRole('button', { name: 'List' });

    await expect(grid).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(list);
    await expect(changed).toHaveBeenCalledWith('list');
    await expect(list).toHaveAttribute('aria-pressed', 'true');
    await expect(grid).toHaveAttribute('aria-pressed', 'false');

    // re-pressing the active segment must not deselect it
    changed.mockClear();
    await userEvent.click(list);
    await expect(changed).not.toHaveBeenCalled();
    await expect(list).toHaveAttribute('aria-pressed', 'true');
  },
};
