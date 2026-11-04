import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, fn } from 'storybook/test';
import { ArrowRight, Plus } from 'lucide-react';

import { Button } from './Button';

const meta = {
  title: 'Components/Button/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The hello pc action trigger — pill-shaped and token-driven.

Pick emphasis by importance: **fill** is the single main action in a view;
**outline** and **tonal** are secondary emphasis; **ghost** is the lowest —
dense UIs, toolbars, and inline actions. Cross any of those with an **intent**
(\`primary\` indigo / \`secondary\` ink) and a **size** (\`xs\`–\`lg\`).

Every color, radius, spacing, and type value resolves from the hello pc design
tokens as CSS custom properties (\`--color-*\`, \`--space-*\`, \`--radius-*\`,
\`--type-*\`), whose names mirror the Figma variables 1:1 — nothing is
hardcoded, so the **Theme** toolbar toggle re-themes every example on this
page live via \`[data-theme]\`.

Always renders a real \`<button type="button">\`. Icon-only buttons are
intentionally unsupported here — that's the separate IconButton component.

## Usage

\`\`\`tsx
<Button>Save changes</Button>
<Button intent="secondary">Cancel</Button>
<Button variant="outline">Preview</Button>
<Button variant="tonal">Duplicate</Button>
<Button variant="ghost">Dismiss</Button>
<Button size="lg" fullWidth>Continue</Button>
<Button startIcon={<Plus size={16} />}>Add item</Button>
\`\`\`

## Design tokens used

Custom-property names mirror the Figma variables (\`color/primary/primaryHover\`
⇄ \`--color-primary-primary-hover\`).

| Variant · intent | Background | Text | Hover / Press |
| --- | --- | --- | --- |
| fill · primary | \`--color-primary-primary\` | \`--color-text-icon-on-primary\` | \`…primary-hover\` / \`…primary-press\` |
| fill · secondary | \`--color-secondary-secondary\` | \`--color-text-icon-inverse\` | \`…secondary-hover\` / \`…secondary-press\` |
| outline · primary | \`--color-surfaces-container\` + \`--stroke-200\` \`--color-primary-primary\` inset stroke | \`--color-primary-primary\` | \`…primary-overlay\` / \`…primary-overlay-hover\` |
| outline · secondary | \`--color-surfaces-container\` + \`--stroke-200\` \`--color-secondary-secondary\` inset stroke | \`--color-secondary-secondary\` | \`…secondary-overlay\` / \`…secondary-overlay-hover\` |
| tonal · primary | \`--color-tonal-tonal\` | \`--color-text-icon-on-tonal-inverse\` | \`…tonal-hover\` / \`…tonal-press\` |
| tonal · secondary | \`--color-tonal-tonal-secondary-overlay\` | \`--color-text-icon-on-tonal-secondary\` | \`…secondary-overlay-hover\` / \`…secondary-overlay-press\` |
| ghost · primary | transparent | \`--color-primary-primary\` | \`…primary-overlay\` / \`…primary-overlay-hover\` |
| ghost · secondary | transparent | \`--color-secondary-secondary\` (label underlined) | \`…secondary-overlay\` / \`…secondary-overlay-hover\` |
| disabled (any) | \`--color-disabled-disabled\` | \`--color-disabled-disabled-inverse\` | — |

(\`…\` = the same family prefix as the row's background.) Shape is
\`--radius-1000\`; the focus ring is a \`--stroke-300\` \`--color-primary-primary\`
outline drawn at −2px inset; icon↔label gap is \`--space-100\` (\`--space-050\`
for tonal·md); per-size paddings use \`--space-050\`…\`--space-400\`.

## Accessibility

- The focus-visible ring is drawn as an \`::after\` overlay — focus is restyled,
  never removed.
- Disabled uses the native \`disabled\` attribute (plus a styling hook for
  \`[aria-disabled='true']\`).
- Icons are decorative: the text label always carries the accessible name.
- The **ghost · secondary** button has a persistent label underline. With no
  background or border, color alone would set it apart, so the underline is the
  required non-color affordance (WCAG 1.4.1 Use of Color).

## Do / Don't

| Do | Don't |
| --- | --- |
| Use one fill button per view — the single main action. | Stack several fill buttons; demote the rest to outline/tonal/ghost. |
| Use ghost in dense UIs: toolbars, table rows, inline actions. | Use ghost for the primary call-to-action. |
| Always pass a visible text label. | Build icon-only buttons with this component — that's IconButton. |
| Disable with nearby context explaining why. | Hide the main action while it's unavailable. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    children: 'Button',
    size: 'md',
    intent: 'primary',
    variant: 'fill',
    fullWidth: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    children: { control: 'text', table: { category: 'Content' } },
    startIcon: { control: false, table: { category: 'Content' } },
    endIcon: { control: false, table: { category: 'Content' } },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    intent: {
      control: 'inline-radio',
      options: ['primary', 'secondary'],
      table: { category: 'Appearance' },
    },
    variant: {
      control: 'inline-radio',
      options: ['fill', 'outline', 'tonal', 'ghost'],
      table: { category: 'Appearance' },
    },
    fullWidth: { control: 'boolean', table: { category: 'Appearance' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    ref: { table: { disable: true } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
);
const Stack = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
);

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The four emphasis treatments across both intents. Reach for the ' +
          'strongest emphasis the action deserves and no more: one **fill** per ' +
          'view, **outline**/**tonal** for supporting actions, **ghost** where ' +
          'the UI is dense and the action is incidental.',
      },
    },
  },
  render: () => (
    <Stack>
      {(['fill', 'outline', 'tonal', 'ghost'] as const).map((variant) => (
        <Row key={variant}>
          <Button intent="primary" variant={variant}>
            Primary {variant}
          </Button>
          <Button intent="secondary" variant={variant}>
            Secondary {variant}
          </Button>
        </Row>
      ))}
    </Stack>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Four heights: `xs` 24px, `sm` 32px, `md` 40px (default), `lg` 48px — ' +
          'all bold, with the type stepping 12px (`caption`) at xs/sm, 14px ' +
          '(`body`) at md, 16px (`subject`) at lg.',
      },
    },
  },
  render: () => (
    <Row>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <Button key={size} size={size}>
          Size {size}
        </Button>
      ))}
    </Row>
  ),
};

export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Leading (`startIcon`) and trailing (`endIcon`) icons sit in a fixed ' +
          '16px slot beside the label. Icons are decorative — the label carries ' +
          'the accessible name, so never omit it. Icon-only actions belong to ' +
          'the separate IconButton component.',
      },
    },
  },
  render: () => (
    <Row>
      <Button startIcon={<Plus size={16} />}>Add item</Button>
      <Button variant="tonal" endIcon={<ArrowRight size={16} />}>
        Continue
      </Button>
      <Button variant="outline" intent="secondary" startIcon={<Plus size={16} />}>
        New project
      </Button>
    </Row>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: {
    docs: {
      description: {
        story:
          'Stretches to the container width (a 320px frame here) — for stacked ' +
          'layouts like dialog footers and mobile forms.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Disabled treatment per variant: fill/tonal flatten to ' +
          '`--color-disabled-disabled` with `--color-disabled-disabled-inverse` ' +
          'text; outline keeps its surface with a disabled border; ghost just ' +
          'dims its text. Disabled buttons set `pointer-events: none`. Prefer ' +
          'disabling with nearby context that explains why.',
      },
    },
  },
  render: () => (
    <Row>
      <Button disabled>Fill</Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="tonal" disabled>
        Tonal
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
    </Row>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The QA matrix: every variant × intent in default and disabled states, ' +
          'plus the size ramp. Use it with the Theme toolbar to audit both ' +
          '`light.a` and `dark.a` at a glance.',
      },
    },
  },
  render: () => (
    <Stack>
      {(['fill', 'outline', 'tonal', 'ghost'] as const).map((variant) => (
        <Row key={variant}>
          {(['primary', 'secondary'] as const).map((intent) => (
            <Row key={intent}>
              <Button intent={intent} variant={variant}>
                {intent === 'primary' ? 'Primary' : 'Secondary'}
              </Button>
              <Button intent={intent} variant={variant} disabled>
                Disabled
              </Button>
            </Row>
          ))}
        </Row>
      ))}
      <Row>
        {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </Row>
    </Stack>
  ),
};

/** Pure interaction test (hidden from the docs page): a click fires the handler. */
export const ClicksFire: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /button/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};
