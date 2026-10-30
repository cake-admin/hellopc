---
name: storybook-component-docs
description: >
  Author or review a hello pc design-system component and its Storybook docs page.
  Use whenever creating, modifying, or reviewing anything under
  src/hellopc/components/ (component .tsx or .stories.tsx), or when asked to
  "document a component", "add a component to Storybook", or "write stories".
  Encodes the reference-library docs template: where prose lives, the exact
  docs-page section order, story taxonomy, props-table rules, and verification.
---

# hello pc Storybook component documentation

Every hello pc component ships a **reference-library-quality docs page** assembled
by Storybook autodocs from exactly two files. This skill defines what those
files must contain so every component's docs page looks and reads the same.
`src/hellopc/components/Button/` is the canonical exemplar — when in doubt,
match it.

## Architecture (do not deviate)

- **Enhanced autodocs. No per-component MDX.** The docs page is generated from
  the stories file; never create `<Component>.mdx` or attach a custom docs
  page. Rationale: docs, stories, and props can then never drift — everything
  lives in the two files below.
- All long-form prose lives in `parameters.docs.description.component` (a
  markdown template literal in the stories file) and
  `parameters.docs.description.story`.
- Props-table richness comes from **JSDoc on the props interface** in the
  component file (react-docgen reads it). JSDoc = short, prop-scoped;
  `docs.description` = page-level prose. Never duplicate content between them.
- Storybook 10 (react-vite builder). Doc blocks (foundations pages only)
  import from `@storybook/addon-docs/blocks`. Global config already set in
  `.storybook/preview.tsx`: autodocs tag, right-rail TOC (`h2, h3`), theme
  decorator + toolbar, story sort. Do not re-configure these per component.

## File layout

```
src/hellopc/components/<Component>/
  <Component>.tsx          # implementation (styled-components + tokens)
  <Component>.stories.tsx  # stories + ALL docs prose (CSF 3)
  index.ts                 # barrel: named export + prop types
```

## Part 1 — the component file

1. **Radix first.** Interactive behavior wraps a Radix primitive from the
   unified `radix-ui` package (`import { Switch as RadixSwitch } from
   'radix-ui'`). Radix owns behavior/a11y (roles, keyboard, `data-state`);
   hello pc owns visuals. Simple native elements (e.g. `<button>`) need no
   primitive. Do NOT add Radix `Slot` / `asChild` polymorphism — it was
   deliberately removed from this design system; components render real
   elements.
2. **Tokens only — as CSS custom properties.** Every color/space/radius/type
   value is a `var()` reference to the generated token layer
   (`src/hellopc/tokens/hellopc-vars.css`, built by `npm run build:hellopc-vars`,
   mode-scoped by `[data-theme]`), consumed inside styled-components:
   - colors: `var(--color-<group>-<token>)` (e.g. `var(--color-primary-primary-hover)`) —
     names mirror the Figma variables 1:1
   - spacing: `var(--space-025 … --space-1000)` (Figma `Spacing/<bucket>/space-*`, 2–80px)
   - radius: `var(--radius-50 … --radius-1000)` (`--radius-1000` = 999px pill/circle)
   - stroke widths: `var(--stroke-100 … --stroke-600)` (1–6px — borders,
     outlines; focus rings use `--stroke-300`, Switch's ring `--stroke-200`)
   - type: `var(--font-family)`, `var(--font-weight-*)`, `var(--type-size-<role>)`
   - shadows: `var(--elevation-0 … --elevation-5)` (Figma `elevation/<n>`; see
     Foundations/Elevation for which level a surface takes). `--elevation-low`
     and `--elevation-high` are legacy single-layer approximations — never
     adopt them in new work.
   Never hardcode hex, px spacing, border widths, or font sizes. Style Radix
   state via data attributes (`[data-state='checked']`, `[data-disabled]`).
   `Button`, `IconButton`, and `Switch` are fully migrated exemplars.
3. **Typed props with rich JSDoc.** Every public prop gets a JSDoc block that
   will render verbatim in the docs props table:
   - Meaning of each allowed value where non-obvious
     (`xs` 24px, `sm` 32px, …).
   - Behavioral notes (controlled vs uncontrolled, a11y requirements).
   - `@default 'md'` tag whenever a default exists — it fills the table's
     Default column.
4. `React.forwardRef` where a DOM node is useful. `displayName` set. Named
   export (+ default export for single-component files).
5. Focus is restyled, never removed (`:focus-visible` ring from tokens).

## Part 2 — the stories file: meta

```tsx
const meta = {
  title: 'Components/<Component>',   // reusable form elements composed by
  component: <Component>,            // fields use 'Elements/<Element>' instead
  parameters: {
    layout: 'centered',
    docs: { description: { component: `…see anatomy below…` } },
  },
  tags: ['autodocs'],
  args: { /* sensible defaults; event handlers use fn() from storybook/test */ },
  argTypes: { /* see rules below */ },
} satisfies Meta<typeof <Component>>;
```

### `docs.description.component` anatomy — exact section order

Write it as one markdown template literal. Escape backticks as `` \` ``.
Sections, in this order (1–3 are plain paragraphs, 4–7 are `##` headings so
the global TOC picks them up):

1. **Intro** (1–2 paragraphs): what the component is; when to use which
   variant/state; when to use a *different* component instead
   ("use Checkbox for form-submission gating").
2. **Theming note** (1 paragraph, always include): every value resolves from
   hello pc tokens via `props.theme`; the **Theme** toolbar toggle re-themes the
   page live; nothing is hardcoded.
3. **Rendering/behavior notes**: what element renders; controlled vs
   uncontrolled; explicit non-goals (e.g. "icon-only buttons are the separate
   IconButton component").
4. `## Usage` — a fenced ` ```tsx ` block of 5–8 **copyable one-liners**
   covering: default, each major variant, a size, a state, each content slot.
5. `## Design tokens used` — a markdown table mapping every variant/part/state
   to its exact token paths. Derive it by reading the styled-components in the
   component file — every `p.theme.…` reference belongs in this table. Include
   rows for shape (radius), focus ring, and gaps. Format:

   | Variant · intent | Background | Text | Hover / Press |
   |---|---|---|---|
   | fill · primary | `color.primary.primary` | `textIcon.onPrimary` | `primaryHover` / `primaryPress` |

   (For non-variant components use Part | Tokens, like Switch.)
6. `## Accessibility` — bullets: what Radix provides for free, what the
   author must supply (`aria-label` when no visible label), focus-ring
   behavior, disabled semantics. Teach, don't just claim compliance.
7. `## Do / Don't` — a two-column markdown table (`| Do | Don't |`), 3–5 rows
   of concrete usage guidance (emphasis hierarchy, labeling, when this
   component is the wrong choice).

### argTypes rules

- Group every arg: `table: { category: 'Content' | 'Appearance' | 'State' |
  'Behavior' | 'Events' }`.
- Every public prop stays **visible** in the props table. Props with no
  sensible control (ReactNode slots, refs excluded) get `control: false` —
  **never** `table: { disable: true }` (hiding the row hides the docs). The
  only exception is `ref`.
- Enums use `control: 'inline-radio'` with explicit `options`.
- Event handlers: `action: '<name>'` + category Events, and `fn()` in `args`.
- **No theme control, ever** — the global toolbar drives `light.a` / `dark.a`
  through `CakeThemeProvider`.

## Part 3 — story taxonomy (export order = docs order)

| Order | Story | Rules |
|---|---|---|
| 1 | `Playground` | Empty (`{}`) or args-only. It becomes the docs-page hero canvas with live controls. **Never** give it a `play` function. JSDoc one-liner: "Interactive playground — drive every prop from the Controls panel below." |
| 2 | Variants/intents | Matrix `render` showing each variant × intent. `parameters.controls.disable: true`. Prose on choosing emphasis. |
| 3 | Sizes | All sizes in a row, with the px mapping in the description. |
| 4 | Content slots | Icons/labels/slots — every example keeps a visible text label. |
| 5 | States | Disabled (all variants), error, etc. Name the tokens in the prose. |
| 6 | `AllVariants` | QA matrix: variant × intent × (default/disabled) + size ramp. Controls disabled. Description says to audit it under both themes. |
| 7 | Interaction tests | `play` functions asserting behavior. **Tag `['!autodocs']`** so they run in the sidebar/test runner but never render on the docs page. Name by behavior (`ClicksFire`, `TogglesFire`). |

Story description rules:

- Every docs-visible story has a description: a `/** JSDoc one-liner */` for
  a single sentence, or `parameters.docs.description.story` for longer prose.
  Use exactly one of the two per story, never both.
- Matrix/showcase stories (`render`-based, multi-example) always set
  `parameters: { controls: { disable: true } }` — their controls don't affect
  the render and would mislead.
- Reusable layout helpers (`Row`, `Stack`) are plain inline components in the
  stories file; raw px there is acceptable (it's chrome, not the component).

## Part 4 — hard constraints (violations = review rejection)

- No per-component MDX docs pages.
- No hardcoded design values in components — tokens only.
- No theme control on any story.
- No icon-only `Button` usage anywhere (docs, examples, other stories) — that
  is the separate `IconButton` component.
- No Radix `Slot` / `asChild` polymorphism.
- No `table: { disable: true }` on public props (only `ref`).
- Pure interaction tests must be `['!autodocs']`.
- Interactive components wrap Radix primitives; don't re-implement or undo
  Radix a11y.

## Part 5 — verification (run all before committing)

The repo path contains `&`, which breaks npm `.bin` shims — invoke binaries
via `node`, and prefer the package scripts (they already do this):

```bash
# 1. Type check (must be silent for src/cakeand files)
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json

# 2. Static build must succeed (then remove the artifact)
npm run build-storybook   # = node node_modules/storybook/dist/bin/dispatcher.js build
rm -rf storybook-static

# 3. Dev server for eyeballing
npm run storybook         # port 6006
```

Eyeball checklist on `Components/<Component>/Docs`:

- [ ] Sections render in order: intro → theming → behavior → Usage →
      Design tokens used → Accessibility → Do/Don't → stories.
- [ ] Right-rail TOC lists the `##` sections and story titles.
- [ ] Usage block has a working copy button.
- [ ] Props table: every public prop visible, Default column populated from
      `@default` tags, ReactNode props show "–" control (not missing rows).
- [ ] Interaction-test stories absent from the docs page, present in the
      sidebar, and passing.
- [ ] Toggle the Theme toolbar: every block (incl. `AllVariants`) re-themes;
      spot-check the token table against rendered colors.
- [ ] Docs blocks are content-height (no viewport-tall empty boxes).
- [ ] Accessibility panel: no violations on any story.

## Exemplars

- `src/hellopc/components/Button/Button.stories.tsx` — variant component
  (Variant · intent token table, AllVariants matrix, ClicksFire test).
- `src/hellopc/components/Switch/Switch.stories.tsx` — stateful/form
  component (Part | Tokens table, controlled/uncontrolled prose, labelless
  `aria-label` requirement, TogglesFire test).
- `src/hellopc/foundations/StoryAuthoring.mdx` — the human-facing guide that
  mirrors this skill (keep the two in sync when the template changes).

## Skeleton for a new component's stories file

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Widget } from './Widget';

const meta = {
  title: 'Components/Widget',
  component: Widget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
<Intro: what it is, when to use it, when to use something else.>

Every color, radius, spacing, and type value resolves from hello pc theme tokens
via \`props.theme\` — the **Theme** toolbar toggle re-themes every example on
this page live.

<Rendering/behavior notes.>

## Usage

\`\`\`tsx
<Widget label="…" />
\`\`\`

## Design tokens used

| Part | Tokens |
| --- | --- |
| … | \`color.…\`, \`radius.…\` |

## Accessibility

- …

## Do / Don't

| Do | Don't |
| --- | --- |
| … | … |
`,
      },
    },
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
  argTypes: {
    label: { control: 'text', table: { category: 'Content' } },
    disabled: { control: 'boolean', table: { category: 'State' } },
    onChange: { action: 'change', table: { category: 'Events' } },
  },
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interactive playground — drive every prop from the Controls panel below. */
export const Playground: Story = {};

// …variant/size/state stories with docs.description.story…

/** Pure interaction test (hidden from the docs page). */
export const ChangesFire: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('…'));
    await expect(args.onChange).toHaveBeenCalled();
  },
};
```
