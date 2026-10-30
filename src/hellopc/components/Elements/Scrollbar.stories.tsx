import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import styled from 'styled-components';

import { Scrollbar } from './Scrollbar';

const Panel = styled.div`
  box-sizing: border-box;
  width: 280px;
  border-radius: var(--radius-300);
  border: var(--stroke-100) solid var(--color-stroke-border);
  background: var(--color-surfaces-container);
  overflow: hidden;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding: var(--space-300);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
`;

const WideRow = styled.div`
  display: flex;
  gap: var(--space-300);
  padding: var(--space-300);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-secondary);
  white-space: nowrap;
`;

const rows = (n: number) =>
  Array.from({ length: n }, (_, i) => <div key={i}>Item {i + 1}</div>);

const meta = {
  title: 'Elements/Scrollbar',
  component: Scrollbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The hello pc scroll surface (Figma "Scrollbar", node 123:6261). Wrap any
overflowing content and it gets the design-system scrollbar: a grey thumb that
**rests thin (4px) and widens (8px) while you interact with it**. Use it
wherever a bounded region needs to scroll — menus, panels, long lists, wide
tables.

Wraps the Radix \`ScrollArea\` primitive, so overflow, drag, keyboard, touch,
and momentum scrolling all come from the primitive — only the look is themed.
Every color and dimension resolves from hello pc tokens whose names mirror the
Figma variables 1:1, and the **Theme** toolbar re-themes the thumb live via
\`[data-theme]\` (grey on light, lighter grey on dark).

## Behavior

- \`type="auto"\` (default) shows the scrollbar only when content overflows;
  \`"hover"\`, \`"scroll"\`, and \`"always"\` are forwarded straight to Radix.
- Set \`maxHeight\` for a vertical scroller, \`maxWidth\` for a horizontal one, or
  both with \`orientation="both"\`.
- The thumb widens from 4px to 8px on hover/drag (Figma's \`scrolling\`
  variant); the transition respects \`prefers-reduced-motion\`.

## Usage

\`\`\`tsx
import { Scrollbar } from '@/hellopc/components/Elements';

<Scrollbar maxHeight={240}>
  <LongList />
</Scrollbar>

// horizontal
<Scrollbar orientation="horizontal" maxWidth={360}>
  <WideTable />
</Scrollbar>
\`\`\`

For surfaces that own their own native scroll and can't host a \`ScrollArea\`
(e.g. a Radix \`Select\` viewport), apply the shared \`nativeScrollbarStyles\`
instead so the scrollbar still matches:

\`\`\`tsx
import { nativeScrollbarStyles } from '@/hellopc/components/Elements';

const Viewport = styled(Select.Viewport)\`
  \${nativeScrollbarStyles}
\`;
\`\`\`

## Where it's used

Every scrolling surface in the system routes through this element — there are no
hand-rolled scrollbars left:

| Component | How |
| --- | --- |
| **Menu Container** | composes \`<Scrollbar>\` directly |
| **Dropdown** | \`nativeScrollbarStyles\` (Radix \`Select\` owns its viewport) |
| **Number Dropdown** | \`nativeScrollbarStyles\` (same) |
| **Modal** | \`nativeScrollbarStyles\` (Radix \`Dialog.Content\` is the scroll container) |

## Design tokens used

| Part | Tokens |
| --- | --- |
| thumb | \`--color-stroke-border-high\`, \`--radius-50\` (4px) |
| thumb width | 4px at rest → 8px on hover/drag (Figma bar geometry, node 123:6261) |
| track inset | \`--space-050\` (4px) around the thumb |
| native fallback | \`nativeScrollbarStyles\` — same \`--color-stroke-border-high\` / \`--radius-50\` |

## Accessibility

- Radix keeps the region **natively scrollable**, so keyboard and screen-reader
  scrolling keep working — the styled thumb is a pointer affordance layered on
  top, never a replacement.
- The primitive doesn't trap focus or alter tab order; focusable content inside
  scrolls into view normally.
- The thumb rests thin but stays the token grey (\`--color-stroke-border-high\`),
  which meets contrast against the container surfaces in both themes; the
  widen-on-hover is an enhancement, not the only signal that it's scrollable.

## Do / Don't

| Do | Don't |
| --- | --- |
| Wrap a **bounded** region (\`maxHeight\`/\`maxWidth\`) so there's something to scroll. | Wrap unbounded content — with no cap nothing overflows. |
| Reuse this element (or \`nativeScrollbarStyles\`) for every scroll surface. | Hand-roll \`::-webkit-scrollbar\` rules per component. |
| Let \`type="auto"\` hide the bar when content fits. | Force \`type="always"\` on short content that never scrolls. |
| Keep content keyboard-reachable inside the viewport. | Rely on the thumb as the only way to scroll. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    type: 'auto',
    orientation: 'vertical',
    maxHeight: 220,
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['auto', 'hover', 'scroll', 'always'],
      table: { category: 'Behavior', defaultValue: { summary: 'auto' } },
    },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'both'],
      table: { category: 'Behavior', defaultValue: { summary: 'vertical' } },
    },
    maxHeight: { control: 'number', table: { category: 'Layout' } },
    maxWidth: { control: 'number', table: { category: 'Layout' } },
    children: { control: false, table: { category: 'Content' } },
    viewportProps: { control: false, table: { category: 'Content' } },
  },
} satisfies Meta<typeof Scrollbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — cap the height, switch `type`, and scroll. */
export const Playground: Story = {
  render: (args) => (
    <Panel>
      <Scrollbar {...args}>
        <Rows>{rows(20)}</Rows>
      </Scrollbar>
    </Panel>
  ),
};

export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The common case: a `maxHeight`-bounded region scrolls vertically. The ' +
          'thumb rests at 4px and widens to 8px when you hover or drag it.',
      },
    },
  },
  render: () => (
    <Panel>
      <Scrollbar maxHeight={220}>
        <Rows>{rows(20)}</Rows>
      </Scrollbar>
    </Panel>
  ),
};

export const Horizontal: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Set `orientation="horizontal"` and a `maxWidth` to scroll a wide row sideways.',
      },
    },
  },
  render: () => (
    <Panel style={{ width: 360 }}>
      <Scrollbar orientation="horizontal" maxWidth={360}>
        <WideRow>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i}>Column {i + 1}</div>
          ))}
        </WideRow>
      </Scrollbar>
    </Panel>
  ),
};

export const Both: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`orientation="both"` renders both scrollbars plus the corner where they ' +
          'meet — for content that overflows in two directions.',
      },
    },
  },
  render: () => (
    <Panel style={{ width: 320 }}>
      <Scrollbar orientation="both" maxHeight={220} maxWidth={320}>
        <div style={{ padding: 'var(--space-300)', width: 560 }}>
          <Rows style={{ padding: 0 }}>{rows(20)}</Rows>
        </div>
      </Scrollbar>
    </Panel>
  ),
};

export const AlwaysVisible: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`type="always"` keeps the bar on-screen even when idle — useful when a ' +
          'region is scrollable but the overflow isn’t otherwise obvious.',
      },
    },
  },
  render: () => (
    <Panel>
      <Scrollbar type="always" maxHeight={220}>
        <Rows>{rows(20)}</Rows>
      </Scrollbar>
    </Panel>
  ),
};

/** Pure interaction test (hidden from docs): the viewport actually scrolls. */
export const ScrollsViewport: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Panel>
      <Scrollbar type="always" maxHeight={160}>
        <Rows>{rows(30)}</Rows>
      </Scrollbar>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvasElement.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]');
    await expect(viewport).not.toBeNull();
    // content overflows its bounded viewport
    await expect(viewport!.scrollHeight).toBeGreaterThan(viewport!.clientHeight);
    // and it scrolls
    viewport!.scrollTop = 80;
    await expect(viewport!.scrollTop).toBe(80);
    await expect(canvas.getByText('Item 1')).toBeInTheDocument();
  },
};
