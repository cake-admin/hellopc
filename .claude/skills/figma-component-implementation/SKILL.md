---
name: figma-component-implementation
description: >
  Implement a hello pc design-system component from its Figma spec into Storybook
  — the full devkit workflow: per-component Figma audit via the Figma MCP,
  token extraction + verification, Radix-wrapped implementation styled with
  CSS custom properties, stories/docs, play tests + a11y, and verification.
  Use when asked to implement, build, port, or audit a component from a Figma
  link, or to plan a design-system/devkit migration. Pairs with the
  storybook-component-docs skill (docs template) and the figma-design-to-code
  skill (MCP mechanics).
---

# hello pc component implementation from Figma

The end-to-end recipe for turning a Figma component into a shipped, documented
Storybook component. Work through the phases **in order** — the audit phase is
mandatory and produces the spec the implementation is checked against.
`Switch` (Figma 42:1850) and `IconButton` (43:1888) were built exactly this
way; read their files when in doubt.

Companion skills — load them when the phase says so:

- **figma-design-to-code** — MUST be loaded before any `get_design_context`
  call (MCP mechanics, hint priority).
- **storybook-component-docs** — MUST be followed for the stories/docs file
  (docs-page anatomy, story taxonomy, argTypes rules).

## Phase A — system-wide devkit audit (only for a fresh system or on request)

When starting a new devkit (not a single component), audit the Figma system
first and produce an implementation plan — **no code** — containing:

1. Component inventory (every component set, variant counts)
2. Token inventory (color/spacing/radius/typography/shadow variables and
   which file exports them)
3. Font and icon dependencies
4. Variant/property naming patterns across components
5. Accessibility + interaction-state patterns (hover/press/focus/disabled)
6. Recommended Radix primitive mapping per component
7. Migration order: foundations → primitives → composites
8. Risks, gaps, and open questions to resolve before implementation

## Phase B — per-component audit (mandatory, NO code yet)

Call `get_design_context` on the component node (load figma-design-to-code
first). Produce the audit before writing any file:

- **Purpose** — what the component is for; primitive / wrapper / composite.
- **Variants & properties** — every Figma axis (size, type, container, state)
  with its values.
- **Visual tokens** — every fill/border/shadow mapped to a Figma variable.
- **Typography tokens** — text styles used.
- **Icon usage** — slot sizes per component size.
- **Interaction states** — default/hover/press/focus/disabled specifics
  (focus-ring geometry, press feedback like thumb stretch).
- **Accessibility expectations** — role, keyboard, required labels.
- **Radix mapping** — which primitive owns behavior (see table below).
- **Reuse map** — before proposing any new markup, scan the design for parts
  that are **already-built hello pc Elements or Components**, and list them.
  Figma composite/nested components almost always contain existing pieces:
  a field's label row is `Elements/InputLabel`, its assistive line is
  `Elements/HelperString`, an inline action is `Button`/`IconButton`, a rule
  is `Elements/Divider`, a toggle is `Checkbox`/`Radio`/`Switch`. Match by
  Figma layer name (`&input.label`, `&helper.string`, `&button`, …) and by
  shape. Anything already built is **imported, not re-created**.
- **Proposed React API** — typed props the variants map to (including any
  props that pass through to the reused pieces).
- **Edge cases** — labelless usage, controlled/uncontrolled, disabled links…

### Audit techniques (learned the hard way)

- **Large component sets** return sparse metadata instead of code. Read the
  variant taxonomy from the symbol names, then pull **representative
  variants in parallel waves** (one full state row, one variant per
  container/type, each size once). Use `excludeScreenshot: true` on all but
  the first call to preserve context.
- **Icon/asset colors are unreliable in exported SVGs** (`var(--fill-0, …)`
  fallbacks may be the icon library's raw color, not the instance override).
  Verify by rendering the variant with `get_screenshot` (small
  `maxDimension`), downloading the PNG, and **pixel-sampling** it
  (PowerShell: `System.Drawing.Bitmap.GetPixel`).
- **Verify every extracted hex against `src/hellopc/tokens/tokens.json`**
  with a small node script before trusting a token mapping. A color that
  matches no token is a finding to raise, not a value to hardcode.
- **Figma stroke alignment doesn't survive the CSS conversion** — when a
  ring/border looks different in the screenshot than the generated CSS
  suggests (e.g. a visible gap), trust the screenshot and adjust offsets.

### Naming translation (Figma ⇄ code)

Component prop vocabulary follows the **codebase**, not Figma's variant
names; document the Figma name in JSDoc and the docs page:

| Figma | Code |
|---|---|
| `container=filled` | `variant="fill"` |
| `container=none` | `variant="ghost"` |
| `type=primary/secondary` | `intent` |
| `size=24 xsml / 32 sml / 40 med / 48 lrg` | `size: 'xs' | 'sm' | 'md' | 'lg'` |
| state variants (hover/press/focus/disabled) | CSS pseudo-classes / `disabled` prop |

State names must stay consistent across Figma, code, and Storybook story
names (`Disabled` story ⇄ `state=disabled` ⇄ `:disabled`).

## Phase C — plan the files (before coding)

Inspect the existing package structure and list the exact files to create or
update. Conventions:

- Component family folders: related components share one folder and one
  Storybook sidebar folder (`src/hellopc/components/Button/` holds
  `Button.tsx` + `IconButton.tsx`; titles `Components/Button/Button` and
  `Components/Button/Icon Button`).
- Reusable form elements (pieces composed by field components — e.g.
  InputLabel, HelperString) live in `src/hellopc/components/Elements/` and
  title under the top-level `Elements/` sidebar section (sorted before
  Components in `.storybook/preview.tsx`).
- Every folder has an `index.ts` barrel exporting components + prop types.
- One `.stories.tsx` per component (not per folder).

## Phase D — implementation rules (the devkit rules)

1. **Figma variables map to CSS custom properties.** Style with
   `var(--color-<group>-<token>)`, `var(--space-025…-1000)`,
   `var(--radius-50…-1000)`, `var(--stroke-100…-600)`, `var(--type-*)`,
   `var(--elevation-*)` — consumed inside styled-components. The variables are
   generated from `tokens.json` by `npm run build:hellopc-vars` →
   `src/hellopc/tokens/hellopc-vars.css` (imported by `CakeThemeProvider`; modes
   scoped by `[data-theme]`). Var names mirror Figma 1:1:
   `color/primary/primaryHover` ⇄ `--color-primary-primary-hover`,
   `Spacing/Small/space-100` ⇄ `--space-100`, `Border/Radius/radius-1000` ⇄
   `--radius-1000` (999px pill), `Border/Stroke/stroke-300` ⇄ `--stroke-300`.
   Sources: colors from `& theme.a/*.tokens.json`, spacing/radius/stroke from
   `& spacing/Value.tokens.json`. After token changes run
   `npm run build:hellopc-tokens` then `npm run build:hellopc-vars`.
2. **No hardcoded** colors, spacing, radius, stroke/border widths,
   typography, shadows, or icon sizes. The only allowed raw px are geometry
   intrinsic to the component's spec (e.g. Switch's 38×24 track, IconButton's
   24–48 diameters) — cite the Figma node for them in a comment or JSDoc.
   `Button`, `IconButton`, and `Switch` are fully migrated exemplars of this
   rule.
3. **Radix provides behavior where applicable.** Wrap primitives from the
   unified `radix-ui` package; never re-implement or undo their a11y. No
   `Slot`/`asChild` polymorphism. Native elements are fine where no primitive
   exists (`<button>`); use `AccessibleIcon` for icon-only controls. Common
   mappings: Switch→`Switch`, Dialog→`Dialog`, Tooltip→`Tooltip`,
   Dropdown→`DropdownMenu`, Tabs→`Tabs`, Checkbox→`Checkbox`,
   Radio→`RadioGroup`, Select→`Select`, Slider→`Slider`,
   icon-only→`AccessibleIcon`.
4. **Figma variants map to typed React props** with rich JSDoc + `@default`
   (react-docgen feeds the docs props table).
5. **Icons**: `lucide-react` is the **interim** icon package — a dedicated
   hello pc icon set is coming. Icons must inherit color via `currentColor` and
   size via the component's icon slot (never per-icon color/size props), so
   the future swap is a drop-in.
6. **Fonts**: Rookery New only, via `fonts.css` + the typography tokens
   (`--type-size-*`, `--font-weight-*` or the theme presets). Never raw
   font-family/size literals.
7. **Compose from what's already built — never rebuild it.** If the Reuse map
   (Phase B) found an existing hello pc Element or Component that covers a part
   of the design, **import and render it**; do not re-create its markup,
   styles, or a11y. This is mandatory, not optional:
   - Fields compose the form Elements — `TextInput` renders `InputLabel`
     (label row) + `HelperString` (assistive line), wiring them via `htmlFor`
     / `aria-describedby` and passing state down (e.g. the field's status
     drives the helper's `tone`). New fields (Textarea, Select) do the same.
   - Composites (Toolbar, DataCard, Dialog footer, …) render existing
     `Button`/`IconButton`/`Checkbox`/`Divider`/… — they never reimplement a
     button, a checkbox, or a rule.
   - Reused pieces stay the single source of truth: fix a shared behavior in
     the Element/Component, and every composer inherits it. If the design
     needs a piece the existing component can't express, extend that
     component (a new prop) rather than forking a private copy.
   - Only build new internal markup for parts that have **no** existing
     Element/Component — and if such a part is reusable (a label, a counter,
     a rule), build it as a new `Elements/` piece first, then compose it.
8. Focus is restyled, never removed. `React.forwardRef`, `displayName`,
   named export + barrel entry.

## Phase E — stories, docs, tests

Follow the **storybook-component-docs** skill exactly (docs-page anatomy,
story taxonomy, argTypes rules, AllVariants matrix). Testing policy:

- **Tests = Storybook `play` interaction tests** (at least one per
  component, named by behavior, tagged `['!autodocs']`) + a clean
  **Accessibility panel** on every story. No separate unit-test files.
- The docs `## Design tokens used` table lists the CSS custom properties
  (which equal the Figma variable names) so designers can cross-check.

## Phase F — verification (all must pass before committing)

```bash
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json   # silent for src/cakeand
npm run build-storybook && rm -rf storybook-static               # must exit 0
npm run storybook                                                # eyeball on :6006
```

- Compare rendered variants against the Figma screenshots from Phase B —
  geometry, every state (hover/press/focus/disabled), both themes via the
  toolbar.
- Confirm the play test passes and the a11y panel is clean.
- Commit to the working branch with a body that records the Figma node id
  and the verified token mappings. Do not push unless asked.

## Phase G — Code Connect (optional)

When Figma Dev Mode / org access is available, add a Code Connect mapping so
the Figma component shows the real code snippet (load the
`figma:figma-code-connect` skill). **Skip without blocking** when access
isn't set up — note it in the commit/PR instead.
