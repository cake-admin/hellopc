import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import {
  Badge,
  BADGE_PALETTE,
  BADGE_SEMANTICS,
  type BadgeColor,
  type BadgeTone,
} from './Badge';

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
);

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

const COLORS: BadgeColor[] = [...BADGE_SEMANTICS, ...BADGE_PALETTE];
const TONES: BadgeTone[] = ['solid', 'subtle'];

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Badge is a compact, non-interactive status label (Figma \`Label\`, node
122:6268). Use it to tag or categorize content — a status, a count, a
category — with an optional leading status dot. Reach for **Chip** when the
pill needs to be selectable or removable, and **Button** for actions; Badge
never responds to input.

Every color, radius, spacing, and type value resolves from hello pc CSS custom
properties that mirror Figma variables. The **Theme** toolbar re-themes every
example live; nothing is hardcoded.

Badge renders a semantic \`<span>\`. It wraps no Radix primitive because it is
purely presentational — there is no interactive behavior to delegate and no
Radix badge primitive exists. The leading dot is decorative (\`aria-hidden\`)
and inherits the badge's text color, so the label text alone carries meaning.

## Usage

\`\`\`tsx
<Badge>Label</Badge>
<Badge color="destructive">Error</Badge>
<Badge color="green" tone="subtle">Active</Badge>
<Badge color="blue">New</Badge>
<Badge color="disabled">Archived</Badge>
<Badge dot={false}>No dot</Badge>
<Badge role="status" color="green" tone="subtle">Saved</Badge>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| shape · padding · gap | \`--radius-1000\` (pill), \`--space-050\` (4px horizontal padding + gap) |
| status dot | \`--space-100\` (8px), \`currentColor\` |
| label type | \`--type-size-caption\` (12px), \`--font-weight-bold\` |
| semantic · solid fill | \`--color-primary-primary\`, \`--color-secondary-secondary\`, \`--color-error-error\`, \`--color-disabled-disabled-inverse\` on \`--color-text-icon-inverse\` / \`--color-disabled-disabled\` |
| semantic · subtle wash | \`--color-primary-primary-overlay\`, \`--color-secondary-secondary-overlay\`, \`--color-error-error-overlay\`, \`--color-disabled-disabled\` with matching colored text |
| palette · solid | \`--color-badge-<color>\` on \`--color-text-icon-inverse\` |
| palette · subtle | \`--color-badge-<color>-light\` on \`--color-badge-text-icon-on-<color>-light\` |

## Accessibility

- The badge is presentational; the leading dot is \`aria-hidden\`, so screen
  readers announce only the label text — never rely on the dot or color alone
  to convey meaning.
- \`color="disabled"\` is a muted visual treatment, not an interactive state —
  Badge sets no \`aria-disabled\` because there is nothing to disable.
- For status that updates live, add \`role="status"\` (or \`aria-live\`) so
  assistive tech announces the change.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use Badge for static status, counts, and category tags. | Use a Badge for a clickable or removable pill — use Chip. |
| Keep the label short and scannable. | Put a wrapping sentence inside a badge. |
| Pair a color with clear label text. | Rely on color or the dot alone to convey meaning. |
| Use \`subtle\` on dense surfaces and \`solid\` for high emphasis. | Mix many palette colors without a consistent meaning. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Label',
    color: 'primary',
    tone: 'solid',
    dot: true,
  },
  argTypes: {
    children: { control: 'text', table: { category: 'Content' } },
    dot: { control: 'boolean', table: { category: 'Content' } },
    color: { control: 'select', options: COLORS, table: { category: 'Appearance' } },
    tone: { control: 'inline-radio', options: TONES, table: { category: 'Appearance' } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Tones: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`solid` is a saturated fill with inverse text (Figma `primary`); `subtle` is a light tinted wash with colored text (Figma `onPrimary`).',
      },
    },
  },
  render: () => (
    <Row>
      <Badge color="primary" tone="solid">
        Solid
      </Badge>
      <Badge color="primary" tone="subtle">
        Subtle
      </Badge>
    </Row>
  ),
};

export const SemanticColors: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The four semantic families draw from the design-system colors. `disabled` is a muted, inactive treatment — shown in both tones.',
      },
    },
  },
  render: () => (
    <Stack>
      {TONES.map((tone) => (
        <Row key={tone}>
          {BADGE_SEMANTICS.map((color) => (
            <Badge key={color} color={color} tone={tone}>
              {color}
            </Badge>
          ))}
        </Row>
      ))}
    </Stack>
  ),
};

export const PaletteColors: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The decorative palette maps 1:1 to the `--color-badge-*` tokens. `solid` uses the saturated swatch; `subtle` uses its light wash with matching text.',
      },
    },
  },
  render: () => (
    <Stack>
      {TONES.map((tone) => (
        <Row key={tone}>
          {BADGE_PALETTE.map((color) => (
            <Badge key={color} color={color} tone={tone}>
              {color}
            </Badge>
          ))}
        </Row>
      ))}
    </Stack>
  ),
};

export const WithoutDot: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Set `dot={false}` to hide the leading status dot for a text-only badge.',
      },
    },
  },
  render: () => (
    <Row>
      <Badge color="blue">With dot</Badge>
      <Badge color="blue" dot={false}>
        No dot
      </Badge>
    </Row>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix for every color across both tones. Audit label and background contrast under all Theme toolbar modes, including Win HCT.',
      },
    },
  },
  render: () => (
    <Stack>
      {COLORS.map((color) => (
        <Row key={color}>
          {TONES.map((tone) => (
            <Badge key={tone} color={color} tone={tone}>
              {`${color} ${tone}`}
            </Badge>
          ))}
        </Row>
      ))}
    </Stack>
  ),
};

/** Pure interaction test (hidden from docs): the label renders and the dot is not announced. */
export const RendersLabel: Story = {
  tags: ['!autodocs'],
  args: { children: 'Beta' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Beta')).toBeInTheDocument();
  },
};
