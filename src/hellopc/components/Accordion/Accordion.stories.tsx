import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import styled from 'styled-components';
import { Bell, CreditCard, Tag } from 'lucide-react';

import { Accordion, AccordionItem } from './Accordion';

/** Example content body — a "Subtitle" (16px medium primary) over supporting
 *  copy, matching the Figma content region. */
const Subtitle = styled.p`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

const Body = styled.p`
  margin: 0;
`;

const sampleBody = (
  <>
    <Subtitle>Subtitle</Subtitle>
    <Body>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porttitor
      urna at magna posuere, vel dignissim nisl faucibus.
    </Body>
  </>
);

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: { AccordionItem: AccordionItem as never },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A stack of collapsible sections (Figma "Accordion", node 117:6508). Use it to
**progressively disclose** long or optional content — FAQs, grouped settings,
detail panels — so a page stays scannable and users open only what they need.

Wraps Radix \`Accordion\` (Root / Item / Header / Trigger / Content): the
keyboard interaction (arrow keys move between headers, Enter/Space toggles),
the \`aria-expanded\` / \`region\` wiring, the single-vs-multiple open behaviour,
and the grow/shrink animation all come from the primitive. Every color,
spacing, radius, and stroke value resolves from hello pc tokens whose names mirror
the Figma variables 1:1 — the **Theme** toolbar re-themes every example live via
\`[data-theme]\`.

## Behavior

- \`type="single"\` opens one section at a time; add \`collapsible\` to let the
  open section close again (otherwise one is always open).
- \`type="multiple"\` lets any number of sections be open at once.
- Uncontrolled by default via \`defaultValue\`; drive it with \`value\` +
  \`onValueChange\` to control it.
- The chevron rotates 180° on open; the section grows/shrinks with a height
  animation that respects \`prefers-reduced-motion\`.

## Usage

\`\`\`tsx
import { Accordion, AccordionItem } from '@/hellopc/components/Accordion';

<Accordion type="single" collapsible defaultValue="a">
  <AccordionItem value="a" title="Accordion title" icon={<Tag />}>
    <p>Section content…</p>
  </AccordionItem>
  <AccordionItem value="b" title="Second section">
    <p>More content…</p>
  </AccordionItem>
</Accordion>

// several open at once
<Accordion type="multiple" defaultValue={['a', 'b']}>
  {/* …items… */}
</Accordion>
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| container | \`--color-surfaces-container\` surface, \`--stroke-100\` \`--color-stroke-border\` edge, \`--radius-400\` (24px) |
| header row | \`--color-surfaces-container\` surface, \`--stroke-100\` \`--color-stroke-border\` bottom divider |
| header inset / gap | \`--space-300\` (16px) block, \`--space-600\` (32px) inline; \`--space-300\` (16px) gap |
| title | \`--type-size-subject\` (16px), \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| leading icon | 24px, \`--color-primary-primary\` |
| chevron | 24px, \`--color-text-icon-primary\` |
| content surface | \`--color-surfaces-on-container-high\`, \`--stroke-100\` \`--color-stroke-border\` bottom divider |
| content inset / gap | \`--space-500\` (24px) top, \`--space-600\` (32px) bottom + sides; \`--space-100\` (8px) gap |
| content text | \`--type-size-body\` (14px), \`--font-weight-regular\`, \`--color-text-icon-secondary\`, 0.2px tracking |
| focus ring | \`--stroke-200\` \`--color-primary-primary\`, inset on the trigger |

The container maxes at 640px and fills narrower parents.

## Accessibility

- Radix renders each header as a real \`<button>\` inside a heading, wired with
  \`aria-expanded\` and \`aria-controls\` to its \`region\` — assistive tech
  announces each section's open state and lets users jump to its content.
- Full keyboard support from the primitive: **Tab** to a header, **Enter** /
  **Space** to toggle, **Arrow** keys to move between headers, **Home** / **End**
  to the first / last.
- The trigger keeps a visible \`:focus-visible\` ring (\`--color-primary-primary\`);
  the chevron is \`aria-hidden\` since open state is already conveyed to AT.
- The open/close animation is disabled under \`prefers-reduced-motion\`.
- Disabled items reuse the native \`<button>\` \`disabled\` state, so they're
  skipped in the tab order.

## Do / Don't

| Do | Don't |
| --- | --- |
| Use it to progressively disclose optional or lengthy content. | Hide content users always need behind a collapsed header. |
| Write short, scannable header titles. | Pack a paragraph into the header title. |
| Use \`type="single"\` when only one section is relevant at a time. | Force \`single\` when users need to compare open sections — use \`multiple\`. |
| Give every \`AccordionItem\` a unique \`value\`. | Reuse \`value\`s — Radix tracks open state by \`value\`. |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    type: 'single',
    collapsible: true,
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['single', 'multiple'],
      table: { category: 'Behavior', defaultValue: { summary: 'single' } },
    },
    collapsible: {
      control: 'boolean',
      description: 'For `type="single"`: allow the open section to close again.',
      table: { category: 'Behavior' },
    },
    disabled: { control: 'boolean', table: { category: 'State' } },
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: false, table: { category: 'State' } },
    onValueChange: { control: false, table: { category: 'Events' } },
  },
  decorators: [(Story) => <div style={{ width: 640, maxWidth: '100%' }}>{Story()}</div>],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — switch `type`/`collapsible` in the Controls panel
 *  and open the sections. */
export const Playground: Story = {
  render: (args) => (
    <Accordion {...args} defaultValue={args.type === 'multiple' ? ['a'] : 'a'}>
      <AccordionItem value="a" title="Accordion title" icon={<Tag />}>
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="b" title="Second section" icon={<Tag />}>
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="c" title="Third section" icon={<Tag />}>
        {sampleBody}
      </AccordionItem>
    </Accordion>
  ),
};

export const Single: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`type="single"` with `collapsible` — one section open at a time, and ' +
          'the open one can be closed again. The default for FAQ-style lists.',
      },
    },
  },
  render: () => (
    <Accordion type="single" collapsible defaultValue="a">
      <AccordionItem value="a" title="What is hello pc?">
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="b" title="How do I theme it?">
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="c" title="Is it accessible?">
        {sampleBody}
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`type="multiple"` lets several sections stay open at once — use it ' +
          'when users need to compare content across sections.',
      },
    },
  },
  render: () => (
    <Accordion type="multiple" defaultValue={['a', 'b']}>
      <AccordionItem value="a" title="First section">
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="b" title="Second section">
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="c" title="Third section">
        {sampleBody}
      </AccordionItem>
    </Accordion>
  ),
};

export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Pass an `icon` to prefix a header with a 24px leading glyph (rendered ' +
          'in the primary accent). Icons are decorative — the title carries the ' +
          'accessible name.',
      },
    },
  },
  render: () => (
    <Accordion type="single" collapsible defaultValue="a">
      <AccordionItem value="a" title="Billing" icon={<CreditCard />}>
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="b" title="Notifications" icon={<Bell />}>
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="c" title="Labels" icon={<Tag />}>
        {sampleBody}
      </AccordionItem>
    </Accordion>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Disable a single item with `disabled` on the `AccordionItem`, or the ' +
          'whole accordion with `disabled` on `Accordion`. Disabled headers are ' +
          'skipped in the tab order.',
      },
    },
  },
  render: () => (
    <Accordion type="single" collapsible defaultValue="a">
      <AccordionItem value="a" title="Available section">
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="b" title="Disabled section" disabled>
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="c" title="Another available section">
        {sampleBody}
      </AccordionItem>
    </Accordion>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'QA matrix — collapsed, open, with-icon, and disabled headers side by ' +
          'side. Audit under both themes: the surfaces, dividers, and rounded ' +
          'corners should read cleanly on light and dark.',
      },
    },
  },
  render: () => (
    <Accordion type="multiple" defaultValue={['open']}>
      <AccordionItem value="collapsed" title="Collapsed header">
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="open" title="Open header" icon={<Tag />}>
        {sampleBody}
      </AccordionItem>
      <AccordionItem value="disabled" title="Disabled header" disabled>
        {sampleBody}
      </AccordionItem>
    </Accordion>
  ),
};

/** Pure interaction test (hidden from docs): a header toggles its section. */
export const ExpandCollapse: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="a" title="Toggle me">
        {sampleBody}
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Toggle me' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};
