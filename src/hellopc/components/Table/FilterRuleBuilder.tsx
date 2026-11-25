import React from 'react';
import styled from 'styled-components';
import { Filter, Plus, Trash2 } from 'lucide-react';

import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { Divider } from '../Elements/Divider';
import { Dropdown, type DropdownOption } from '../Dropdown/Dropdown';
import { TextInput } from '../TextInput/TextInput';
import { FilterPopover, FilterTrigger, type FilterTriggerAppearance } from './FilterPopover';

/**
 * hello pc Table — Filter Rule Builder (Figma `hellopc.table.filter.rule.builder`,
 * node 18224:820).
 *
 * A dialog-style popover for condition filters: "Show rows that match [All
 * rules ▾]", then one row per rule — field **Dropdown** (advanced scope only),
 * operator **Dropdown**, value **TextInput**, remove **IconButton** — an "Add
 * rule" **Button**, and a Clear / Apply footer. `scope="column"` (400px) opens
 * from a column header and fixes the field; `scope="advanced"` (600px) opens
 * from the **Filter Bar**'s "Advanced filters" button and lets people pick the
 * field. The selects are the compact 32px `Dropdown size="sm"`.
 *
 * Rules are a draft until **Apply**; Esc or an outside click cancels. Behavior
 * is Radix `Popover` (via `FilterPopover`): focus moves into the panel on open,
 * Esc closes, focus returns to the trigger. Every value resolves from hello pc
 * token custom properties.
 */

/** Figma 18224:820 — panel widths per scope, and the fixed select widths in a rule row. */
const WIDTH = { column: 400, advanced: 600 } as const;
const MATCH_WIDTH = 128;
const FIELD_WIDTH = 160;
const OPERATOR_WIDTH = 140;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  /* p-16 from Figma 18224:58 */
  padding: var(--space-300);
`;

const Title = styled.h2`
  margin: 0;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  /* Figma medium.14.body tracking; no token carries letter-spacing. */
  letter-spacing: 0.1px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const Text = styled.span`
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  /* Figma regular.14.body tracking. */
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  white-space: nowrap;
`;

const Rules = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

const Fixed = styled.div<{ $width: number }>`
  flex: 0 0 ${(p) => p.$width}px;
  min-width: 0;
`;

const Grow = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

const Start = styled.div`
  display: flex;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-100);
`;

/** One filter condition. */
export interface FilterRule {
  /** Stable id (used for React keys). */
  id: string;
  /** Field (column) the rule tests. */
  field: string;
  /** Operator value, e.g. `'is'`, `'contains'`. */
  operator: string;
  /** Value to compare against. */
  value: string;
}

export type FilterMatch = 'all' | 'any';

/** The builder's value: how rules combine, and the rules. */
export interface FilterRuleSet {
  match: FilterMatch;
  rules: FilterRule[];
}

export type FilterRuleBuilderScope = 'column' | 'advanced';

export interface FilterRuleBuilderProps {
  /**
   * `column` — opened from a column header; the field is fixed to `field`
   * (400px). `advanced` — opened from the Filter Bar; each rule picks its field
   * (600px).
   * @default 'advanced'
   */
  scope?: FilterRuleBuilderScope;
  /** Selectable fields (advanced) — also used to name the fixed field in column scope. */
  fields?: DropdownOption[];
  /** The fixed field in `column` scope. */
  field?: string;
  /** Operators offered for every rule. */
  operators: DropdownOption[];
  /** Panel heading. @default 'Advanced filters' / `Filter by ${field label}` */
  title?: string;
  /** Controlled applied rule set. */
  value?: FilterRuleSet;
  /** Uncontrolled initial applied rule set. @default { match: 'all', rules: [] } */
  defaultValue?: FilterRuleSet;
  /** Fires with the applied rule set on **Apply** (rules without a value are dropped). */
  onApply?: (value: FilterRuleSet) => void;
  /** Controlled open state. */
  open?: boolean;
  /** Fires when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Trigger look: `link` — primary ghost "Advanced filters" with a rule
   * **Counter** (Filter Bar full); `filter` — outline/tonal "Filters" pill with a
   * counter (Filter Bar compact); `icon` — an `xs` **IconButton** for a column
   * header.
   * @default 'link' (advanced) / 'icon' (column)
   */
  triggerAppearance?: FilterTriggerAppearance | 'icon';
  /** Trigger text (or the icon button's accessible name). @default 'Advanced filters' / `Filter ${field label}` */
  triggerLabel?: string;
}

const EMPTY: FilterRuleSet = { match: 'all', rules: [] };
/**
 * A collision-free rule id. Rules can be persisted and handed back through
 * `value` / `defaultValue`, so a per-module counter could mint an id that a
 * restored rule already uses after a reload; random UUIDs can't.
 */
const newRuleId = (): string => {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c && typeof c.randomUUID === 'function') return `rule-${c.randomUUID()}`;
  // Fallback for non-secure contexts (randomUUID needs HTTPS / localhost).
  return `rule-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};
const blankRule = (field: string, operator: string): FilterRule => ({
  id: newRuleId(),
  field,
  operator,
  value: '',
});

const MATCH_OPTIONS: DropdownOption[] = [
  { label: 'All rules', value: 'all' },
  { label: 'Any rule', value: 'any' },
];

/**
 * Condition filters for a table, in a dialog-style popover: match all / any,
 * field · operator · value rows, Add rule, Clear, Apply.
 */
export function FilterRuleBuilder({
  scope = 'advanced',
  fields = [],
  field,
  operators,
  title,
  value,
  defaultValue = EMPTY,
  onApply,
  open: openProp,
  onOpenChange,
  triggerAppearance,
  triggerLabel,
}: FilterRuleBuilderProps) {
  const isColumn = scope === 'column';
  const fixedField = field ?? fields[0]?.value ?? '';
  const fieldLabel = fields.find((f) => f.value === fixedField)?.label ?? fixedField;
  const defaultField = isColumn ? fixedField : (fields[0]?.value ?? '');
  const defaultOperator = operators[0]?.value ?? '';

  const [innerValue, setInnerValue] = React.useState<FilterRuleSet>(defaultValue);
  const applied = value ?? innerValue;
  const [innerOpen, setInnerOpen] = React.useState(false);
  const open = openProp ?? innerOpen;

  const seed = (set: FilterRuleSet): FilterRuleSet =>
    set.rules.length > 0 ? set : { ...set, rules: [blankRule(defaultField, defaultOperator)] };
  const [draft, setDraft] = React.useState<FilterRuleSet>(() => seed(applied));
  const addRef = React.useRef<HTMLButtonElement>(null);
  // Set when a rule's remove button (which held focus) is about to unmount.
  const [refocusAdd, setRefocusAdd] = React.useState(false);
  React.useLayoutEffect(() => {
    // Runs in the same commit that removed the row — before Radix FocusScope
    // would see focus fall to <body> and pull it to the panel container.
    if (refocusAdd) {
      addRef.current?.focus();
      setRefocusAdd(false);
    }
  }, [refocusAdd]);

  const setOpen = (next: boolean) => {
    if (next) setDraft(seed(applied));
    if (openProp === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  // A controlled `open` can turn true without going through setOpen; reseed on
  // every closed → open transition so Apply never commits a stale draft.
  const wasOpen = React.useRef(open);
  React.useLayoutEffect(() => {
    if (open && !wasOpen.current) setDraft(seed(applied));
    wasOpen.current = open;
  });

  const update = (id: string, patch: Partial<FilterRule>) =>
    setDraft((d) => ({ ...d, rules: d.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  const remove = (id: string) => {
    setDraft((d) => ({ ...d, rules: d.rules.filter((r) => r.id !== id) }));
    // The removed row takes focus with it; land on "Add rule" instead of the body.
    setRefocusAdd(true);
  };
  const add = () => {
    // Create the rule (and its id) outside the updater, which must stay pure.
    const rule = blankRule(defaultField, defaultOperator);
    setDraft((d) => ({ ...d, rules: [...d.rules, rule] }));
  };
  const clear = () => setDraft({ match: 'all', rules: [blankRule(defaultField, defaultOperator)] });
  const apply = () => {
    const next: FilterRuleSet = {
      match: draft.match,
      rules: draft.rules.filter((r) => r.value.trim() !== ''),
    };
    if (value === undefined) setInnerValue(next);
    onApply?.(next);
    setOpen(false);
  };

  const heading = title ?? (isColumn ? `Filter by ${fieldLabel}` : 'Advanced filters');
  const appearance = triggerAppearance ?? (isColumn ? 'icon' : 'link');
  const count = applied.rules.length;
  const name = triggerLabel ?? (isColumn ? `Filter ${fieldLabel}` : 'Advanced filters');

  return (
    <FilterPopover
      open={open}
      onOpenChange={setOpen}
      label={heading}
      width={WIDTH[scope]}
      renderTrigger={(p) =>
        appearance === 'icon' ? (
          <IconButton
            size="xs"
            intent={count > 0 ? 'primary' : 'secondary'}
            variant={count > 0 ? 'tonal' : 'ghost'}
            label={count > 0 ? `${name}, ${count} active` : name}
            icon={<Filter />}
            {...p}
          />
        ) : (
          <FilterTrigger
            appearance={appearance}
            applied={count > 0}
            count={count}
            startIcon={<Filter />}
            {...p}
          >
            {name}
          </FilterTrigger>
        )
      }
    >
      <Panel>
        <Title>{heading}</Title>
        <Row>
          <Text>Show rows that match</Text>
          <Fixed $width={MATCH_WIDTH}>
            <Dropdown
              size="sm"
              aria-label="Show rows that match"
              options={MATCH_OPTIONS}
              value={draft.match}
              onValueChange={(m) => setDraft((d) => ({ ...d, match: m as FilterMatch }))}
            />
          </Fixed>
        </Row>

        <Rules role="list" aria-label="Rules">
          {draft.rules.map((r, i) => {
            const n = i + 1;
            return (
              <Row key={r.id} role="listitem">
                {!isColumn ? (
                  <Fixed $width={FIELD_WIDTH}>
                    <Dropdown
                      size="sm"
                      aria-label={`Field for rule ${n}`}
                      options={fields}
                      value={r.field}
                      onValueChange={(f) => update(r.id, { field: f })}
                    />
                  </Fixed>
                ) : null}
                <Fixed $width={OPERATOR_WIDTH}>
                  <Dropdown
                    size="sm"
                    aria-label={`Operator for rule ${n}`}
                    options={operators}
                    value={r.operator}
                    onValueChange={(o) => update(r.id, { operator: o })}
                  />
                </Fixed>
                <Grow>
                  <TextInput
                    size="sm"
                    aria-label={`Value for rule ${n}`}
                    placeholder="Type here"
                    value={r.value}
                    onChange={(e) => update(r.id, { value: e.target.value })}
                  />
                </Grow>
                <IconButton
                  size="sm"
                  intent="secondary"
                  variant="ghost"
                  label={`Remove rule ${n}`}
                  icon={<Trash2 />}
                  onClick={() => remove(r.id)}
                />
              </Row>
            );
          })}
        </Rules>

        <Start>
          <Button ref={addRef} size="sm" intent="primary" variant="ghost" startIcon={<Plus />} onClick={add}>
            Add rule
          </Button>
        </Start>

        <Divider weight="weak" decorative />

        <Footer>
          <Button size="sm" intent="secondary" variant="outline" onClick={clear}>
            Clear
          </Button>
          <Button size="sm" intent="primary" variant="fill" onClick={apply}>
            Apply
          </Button>
        </Footer>
      </Panel>
    </FilterPopover>
  );
}

FilterRuleBuilder.displayName = 'FilterRuleBuilder';

export default FilterRuleBuilder;
