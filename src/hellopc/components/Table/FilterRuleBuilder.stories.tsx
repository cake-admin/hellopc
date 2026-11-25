import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { expect, fireEvent, fn, screen, userEvent, waitFor, within } from 'storybook/test';

import { FilterRuleBuilder, type FilterRuleSet } from './FilterRuleBuilder';

const FIELDS = [
  { label: 'Status', value: 'status' },
  { label: 'Device name', value: 'device' },
  { label: 'OS type', value: 'os' },
  { label: 'Last seen', value: 'seen' },
];

const OPERATORS = [
  { label: 'Is', value: 'is' },
  { label: 'Is not', value: 'not' },
  { label: 'Contains', value: 'contains' },
  { label: 'Starts with', value: 'starts' },
];

const ADVANCED: FilterRuleSet = {
  match: 'all',
  rules: [
    { id: 'a1', field: 'status', operator: 'is', value: 'Online' },
    { id: 'a2', field: 'device', operator: 'contains', value: 'PF4' },
  ],
};

/** Open-panel stories render in their own iframe so the modal popover never traps the docs page. */
const inIframe = (height: number) => ({
  docs: { story: { inline: false, iframeHeight: height } },
  layout: 'padded' as const,
});

const meta = {
  title: 'Components/Table/Filter Rule Builder',
  component: FilterRuleBuilder,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Condition filters for a table (Figma \`hellopc.table.filter.rule.builder\`, node
18224:820), in a dialog-style popover: "Show rows that match All rules / Any
rule", one row per rule, Add rule, and Clear / Apply. Use it for conditions —
"Device name contains PF4", "Status is not Offline". For picking values from a
short list, use the **Filter Menu**.

Every color, spacing, and type value resolves from hello pc tokens via
\`props.theme\` — the **Theme** toolbar toggle re-themes every example on this
page live; nothing is hardcoded.

Two scopes: \`column\` (400px) opens from a column header and fixes the field;
\`advanced\` (600px) opens from the **Filter Bar**'s "Advanced filters" and lets
each rule pick its field. Rows compose existing pieces — compact 32px
**Dropdown**s (\`size="sm"\`), a **TextInput** \`size="sm"\`, a remove
**IconButton** — and the footer is **Button**s (Clear secondary outline, Apply
primary fill). Rules are a draft until Apply (rules left without a value are
dropped); Esc or an outside click cancels. The trigger follows the scope: an
\`xs\` **IconButton** in a column header, the "Advanced filters" link with a rule
**Counter**, or (\`triggerAppearance="filter"\`) the compact bar's "Filters" pill.

## Usage

\`\`\`tsx
<FilterRuleBuilder fields={fields} operators={operators} onApply={setRules} />
<FilterRuleBuilder scope="column" field="status" fields={fields} operators={operators} />
<FilterRuleBuilder fields={fields} operators={operators} value={rules} onApply={setRules} />
<FilterRuleBuilder fields={fields} operators={operators} triggerAppearance="filter" triggerLabel="Filters" />
<FilterRuleBuilder fields={fields} operators={operators} title="Filter devices" />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| panel | \`--color-surfaces-container\`, \`--stroke-100\` · \`--color-stroke-border\`, \`--radius-150\` (8px), \`--elevation-3\` |
| panel padding / section gap | \`--space-300\` (16px) |
| rule rows / row gap | \`--space-100\` (8px) |
| title | \`--type-size-body\` (14px), \`--font-weight-medium\`, \`--color-text-icon-primary\` |
| "Show rows that match" | \`--type-size-body\`, \`--font-weight-regular\` |
| selects | **Dropdown** \`size="sm"\` (32px) — match 128px, field 160px, operator 140px |
| value | **TextInput** \`size="sm"\` |
| remove | **IconButton** \`size="sm"\` secondary ghost |
| Add rule | **Button** \`size="sm"\` primary ghost |
| footer | **Button** \`size="sm"\` secondary outline / primary fill |
| divider | **Divider** \`weight="weak"\` |
| widths | 400px column / 600px advanced (intrinsic geometry, Figma 18224:820) |

## Accessibility

- The trigger carries \`aria-haspopup="dialog"\` / \`aria-expanded\`; the panel is a
  dialog named by its title. Focus moves into it on open, Esc closes (an open
  select closes first), and focus returns to the trigger.
- Every control in a rule row is labelled by position — "Field for rule 2",
  "Operator for rule 2", "Value for rule 2", "Remove rule 2" — since the row
  has no visible labels. Removing a rule moves focus to "Add rule".
- The column-header trigger's name includes the active count ("Filter Status,
  1 active").

## Do / Don't

| Do | Don't |
| --- | --- |
| Use \`scope="column"\` from a header, \`advanced\` from the Filter Bar | Show a field picker when the column already fixes the field |
| Apply once on Apply, then show the count on the trigger | Re-query on every keystroke in the value field |
| Offer operators that fit the field's data | Offer "Contains" on a date or a status |
| Use the **Filter Menu** for a short list of known values | Make people type values they could tick |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    scope: 'advanced',
    fields: FIELDS,
    operators: OPERATORS,
    onApply: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    scope: { control: 'inline-radio', options: ['advanced', 'column'], table: { category: 'Appearance' } },
    triggerAppearance: {
      control: 'inline-radio',
      options: ['link', 'filter', 'icon'],
      table: { category: 'Appearance' },
    },
    title: { control: 'text', table: { category: 'Content' } },
    triggerLabel: { control: 'text', table: { category: 'Content' } },
    fields: { control: false, table: { category: 'Content' } },
    field: { control: 'text', table: { category: 'Content' } },
    operators: { control: false, table: { category: 'Content' } },
    value: { control: false, table: { category: 'State' } },
    defaultValue: { control: false, table: { category: 'State' } },
    open: { control: 'boolean', table: { category: 'State' } },
    onApply: { action: 'apply', table: { category: 'Events' } },
    onOpenChange: { action: 'openChange', table: { category: 'Events' } },
  },
} satisfies Meta<typeof FilterRuleBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

/**
 * The trigger for each context: the column-header **IconButton**, the
 * "Advanced filters" link with its rule **Counter**, and the compact bar's
 * "Filters" pill — each shown idle and with rules applied.
 */
export const Triggers: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 16, alignItems: 'center' }}>
      <FilterRuleBuilder scope="column" field="status" fields={FIELDS} operators={OPERATORS} />
      <FilterRuleBuilder fields={FIELDS} operators={OPERATORS} />
      <FilterRuleBuilder fields={FIELDS} operators={OPERATORS} triggerAppearance="filter" triggerLabel="Filters" />
      <FilterRuleBuilder
        scope="column"
        field="status"
        fields={FIELDS}
        operators={OPERATORS}
        defaultValue={{ match: 'all', rules: [{ id: 'c1', field: 'status', operator: 'is', value: 'Online' }] }}
      />
      <FilterRuleBuilder fields={FIELDS} operators={OPERATORS} defaultValue={{ match: 'all', rules: ADVANCED.rules.slice(0, 1) }} />
      <FilterRuleBuilder
        fields={FIELDS}
        operators={OPERATORS}
        triggerAppearance="filter"
        triggerLabel="Filters"
        defaultValue={ADVANCED}
      />
    </div>
  ),
};

/** `scope="column"` — 400px, the field fixed to the column ("Filter by Status"). */
export const ColumnScope: Story = {
  parameters: { controls: { disable: true }, ...inIframe(340) },
  render: () => (
    <div style={{ minHeight: 300 }}>
      <FilterRuleBuilder scope="column" field="status" fields={FIELDS} operators={OPERATORS} open />
    </div>
  ),
};

/** `scope="advanced"` — 600px, each rule picks its field; two rules applied. */
export const AdvancedScope: Story = {
  parameters: { controls: { disable: true }, ...inIframe(380) },
  render: () => (
    <div style={{ minHeight: 340 }}>
      <FilterRuleBuilder fields={FIELDS} operators={OPERATORS} defaultValue={ADVANCED} open />
    </div>
  ),
};

/**
 * QA matrix: both scopes open. Audit it under light, dark, and win hct with the
 * **Theme** toolbar.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true }, ...inIframe(420) },
  render: () => {
    const [col, setCol] = React.useState(true);
    return (
      <div style={{ display: 'flex', gap: 24, minHeight: 380 }}>
        <FilterRuleBuilder
          scope="column"
          field="status"
          fields={FIELDS}
          operators={OPERATORS}
          open={col}
          onOpenChange={setCol}
        />
        <div style={{ marginLeft: 420 }}>
          <FilterRuleBuilder fields={FIELDS} operators={OPERATORS} defaultValue={ADVANCED} />
        </div>
      </div>
    );
  },
};

/** Focus moves in on open; adding, typing and Apply report the rule set and close back onto the trigger. */
export const AppliesRules: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Advanced filters' }));
    await screen.findByRole('dialog', { name: 'Advanced filters' });
    // Re-query each step: the popover content can re-mount just after opening.
    const dialog = {
      getByRole: (...q: Parameters<typeof screen.getByRole>) =>
        within(screen.getByRole('dialog', { name: 'Advanced filters' })).getByRole(...q),
    };
    await waitFor(() =>
      expect(dialog.getByRole('combobox', { name: 'Show rows that match' })).toHaveFocus(),
    );

    // user-event keystrokes inside the modal popover don't reach React in the
    // play harness (real typing does); set the value the way React reads it.
    fireEvent.change(dialog.getByRole('textbox', { name: 'Value for rule 1' }), {
      target: { value: 'Online' },
    });
    await expect(dialog.getByRole('textbox', { name: 'Value for rule 1' })).toHaveValue('Online');
    await userEvent.click(dialog.getByRole('button', { name: 'Add rule' }));
    await expect(dialog.getByRole('textbox', { name: 'Value for rule 2' })).toBeInTheDocument();
    await userEvent.click(dialog.getByRole('button', { name: 'Remove rule 2' }));
    await waitFor(() => expect(dialog.getByRole('button', { name: 'Add rule' })).toHaveFocus());
    await expect(dialog.getByRole('textbox', { name: 'Value for rule 1' })).toHaveValue('Online');

    await userEvent.click(dialog.getByRole('button', { name: 'Apply' }));
    await expect(args.onApply).toHaveBeenCalledWith({
      match: 'all',
      rules: [expect.objectContaining({ field: 'status', operator: 'is', value: 'Online' })],
    });
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Advanced filters 1' })).toHaveFocus());
  },
};

/** Esc closes without applying and returns focus to the trigger. */
export const EscCloses: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Advanced filters' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Advanced filters' });
    fireEvent.change(within(dialog).getByRole('textbox', { name: 'Value for rule 1' }), {
      target: { value: 'x' },
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(args.onApply).not.toHaveBeenCalled();
    await expect(trigger).toHaveFocus();
  },
};

/**
 * Picking a field and an operator with the pointer keeps the builder open (the
 * Dropdown menus portal outside the panel), and Apply reports the picks.
 */
export const PicksOptionsWithPointer: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dialog = () => within(screen.getByRole('dialog', { name: 'Advanced filters' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Advanced filters' }));
    await screen.findByRole('dialog', { name: 'Advanced filters' });

    await userEvent.click(dialog().getByRole('combobox', { name: 'Field for rule 1' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Device name' }));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(screen.getByRole('dialog', { name: 'Advanced filters' })).toBeInTheDocument();
    await expect(dialog().getByRole('combobox', { name: 'Field for rule 1' })).toHaveTextContent('Device name');

    await userEvent.click(dialog().getByRole('combobox', { name: 'Operator for rule 1' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Contains' }));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(screen.getByRole('dialog', { name: 'Advanced filters' })).toBeInTheDocument();

    // See AppliesRules: user-event keystrokes don't reach React inside the modal popover here.
    fireEvent.change(dialog().getByRole('textbox', { name: 'Value for rule 1' }), {
      target: { value: 'PF4' },
    });
    await userEvent.click(dialog().getByRole('button', { name: 'Apply' }));
    await expect(args.onApply).toHaveBeenCalledWith({
      match: 'all',
      rules: [expect.objectContaining({ field: 'device', operator: 'contains', value: 'PF4' })],
    });
  },
};
