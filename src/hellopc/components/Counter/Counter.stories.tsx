import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Bell } from 'lucide-react';

import { Counter, type CounterStatus, type CounterTone } from './Counter';

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
);

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

const STATUSES: CounterStatus[] = ['primary', 'secondary', 'destructive', 'disabled'];
const TONES: CounterTone[] = ['solid', 'subtle'];

/** Renders a counter pinned to the top-right of a host icon, its main use. */
const OnIcon = ({ children }: { children: React.ReactNode }) => (
  <span style={{ position: 'relative', display: 'inline-flex', color: 'var(--color-text-icon-primary)' }}>
    <Bell />
    <span style={{ position: 'absolute', top: -6, left: 12 }}>{children}</span>
  </span>
);

const meta = {
  title: 'Components/Counter',
  component: Counter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Counter is a compact numeric badge for notification counts (Figma \`Counter\`,
node 123:6211) — unread messages, pending items, a "9+" overflow. It composes
**Badge** (the same token-styled pill and semantic colors, with no status dot)
and adds the \`popout\` separator ring for placing the count on top of an icon,
avatar, or tab. Use **Badge** for a labeled status tag and **Button** for
actions.

Every color, radius, spacing, and type value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

Because it builds on Badge, Counter renders a semantic \`<span>\` and wraps no
Radix primitive — it is presentational, with no interactive behavior to
delegate. Sharing Badge means a fix to the pill's shape or color lands in both
components at once.

## Usage

\`\`\`tsx
<Counter count="9+" />
<Counter count={3} status="destructive" />
<Counter count={12} status="primary" tone="subtle" />
<Counter count="99+" status="secondary" />
<Counter count={0} status="disabled" />

// pinned on top of an icon — enable the separator ring
<span style={{ position: 'relative' }}>
  <Bell />
  <span style={{ position: 'absolute', top: -6, right: -6 }}>
    <Counter count="9+" status="destructive" popout />
  </span>
</span>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| shape · padding · gap | \`--radius-1000\` (pill), \`--space-050\` (4px) — inherited from Badge |
| value type | \`--type-size-caption\` (12px), \`--font-weight-bold\` |
| primary | solid \`--color-primary-primary\` / subtle \`--color-primary-primary-overlay\` on \`--color-primary-primary\` |
| secondary | solid \`--color-secondary-secondary\` / subtle \`--color-secondary-secondary-overlay\` on \`--color-secondary-secondary\` |
| destructive | solid \`--color-error-error\` / subtle \`--color-error-error-overlay\` on \`--color-error-error\` |
| disabled | \`--color-disabled-disabled-inverse\` on \`--color-disabled-disabled\` |
| solid text | \`--color-text-icon-inverse\` |
| popout ring | \`--stroke-200\` (2px), \`--color-stroke-border-pop\` |

## Accessibility

- Counter is presentational. The number alone rarely conveys what is being
  counted — pair it with a visible or accessible label on its host control
  (e.g. \`aria-label="9 unread notifications"\` on the bell button), not on the
  counter.
- For counts that change live, mark the host region with \`role="status"\` /
  \`aria-live\` so assistive tech announces updates.
- \`status="disabled"\` is a muted visual treatment only; it sets no
  \`aria-disabled\`.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use Counter for short numeric counts and "9+" overflow. | Put words or long text in a Counter — use Badge. |
| Enable \`popout\` when the counter overlaps an icon or avatar. | Leave \`popout\` on for a standalone counter — the ring won't contrast a plain background. |
| Label what is being counted on the host control. | Rely on the number alone to convey meaning to screen readers. |
| Use \`destructive\` for alerts, \`primary\` for neutral counts. | Rely on color alone to distinguish counts. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    count: '9+',
    status: 'primary',
    tone: 'solid',
    popout: false,
  },
  argTypes: {
    count: { control: 'text', table: { category: 'Content' } },
    status: { control: 'inline-radio', options: STATUSES, table: { category: 'Appearance' } },
    tone: { control: 'inline-radio', options: TONES, table: { category: 'Appearance' } },
    popout: { control: 'boolean', table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof Counter>;

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
          'Each Figma `status` maps to its semantic family. `disabled` is a muted, inactive treatment.',
      },
    },
  },
  render: () => (
    <Row>
      {STATUSES.map((status) => (
        <Counter key={status} count="9+" status={status} />
      ))}
    </Row>
  ),
};

export const Tones: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`solid` is a saturated fill with inverse text (Figma `heavy`); `subtle` is a light tinted wash with colored text (Figma `light`).',
      },
    },
  },
  render: () => (
    <Stack>
      {TONES.map((tone) => (
        <Row key={tone}>
          {STATUSES.map((status) => (
            <Counter key={status} count="9+" status={status} tone={tone} />
          ))}
        </Row>
      ))}
    </Stack>
  ),
};

export const Values: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'The pill hugs its content, so single digits, larger numbers, and "9+" overflow all fit.',
      },
    },
  },
  render: () => (
    <Row>
      <Counter count={1} status="destructive" />
      <Counter count={9} status="destructive" />
      <Counter count={42} status="destructive" />
      <Counter count="9+" status="destructive" />
      <Counter count="99+" status="destructive" />
    </Row>
  ),
};

export const Popout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Enable `popout` to add a 2px separator ring when the counter overlaps busy content, so it reads as distinct from its host. Shown pinned to a bell icon.',
      },
    },
  },
  render: () => (
    <Row>
      <OnIcon>
        <Counter count="9+" status="destructive" popout />
      </OnIcon>
      <OnIcon>
        <Counter count={3} status="primary" popout />
      </OnIcon>
      <OnIcon>
        <Counter count={12} status="secondary" tone="subtle" popout />
      </OnIcon>
    </Row>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix for every status across both tones and the popout ring. Audit contrast under all Theme toolbar modes, including Win HCT.',
      },
    },
  },
  render: () => (
    <Stack>
      {[false, true].map((popout) =>
        TONES.map((tone) => (
          <Row key={`${popout}-${tone}`}>
            {STATUSES.map((status) => (
              <Counter key={status} count="9+" status={status} tone={tone} popout={popout} />
            ))}
          </Row>
        )),
      )}
    </Stack>
  ),
};

/** Pure interaction test (hidden from docs): the count value renders. */
export const RendersCount: Story = {
  tags: ['!autodocs'],
  args: { count: '9+' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('9+')).toBeInTheDocument();
  },
};
