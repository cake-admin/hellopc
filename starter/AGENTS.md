# hello pc prototype — agent instructions

This project builds UI with **hello pc**, Lenovo's design system. Everything visual
comes from the `@cake-admin/cakeand` package. Your job is to compose what is
already there, not to invent a parallel design system beside it.

## Before you write any UI

Read `context/hellopc-components.md` — the complete generated inventory of what the
package exports. Before using a component you have not used yet in this session,
read `context/components/<name>.md` for its props, a real usage snippet, and its
accessibility contract.

**Do not guess a component's API.** If it is not in the index, it does not exist.

## Hard rules

1. **One import path.** `import { X } from '@cake-admin/cakeand'`. There are no
   deep paths — `@cake-admin/cakeand/Button` does not resolve.
2. **One `CakeProvider`.** It is already mounted in `src/App.tsx`. Never add a
   second: it writes `data-theme` to `<html>`, and two of them fight over it.
3. **Never hardcode a color, spacing, radius, or type size.** Use the CSS custom
   properties — `var(--color-…)`, `var(--space-…)`, `var(--radius-…)`,
   `var(--type-size-…)`. The full list is in `context/hellopc-tokens.md`. If you
   cannot find a token for what you need, say so rather than inventing a hex
   value; a missing token is a real finding.
4. **Token names are exact.** They are generated from Figma variables. Do not
   guess by analogy — `--color-surfaces-canvas` exists, `--color-surfaces-background`
   does not, and the second one fails silently as an empty string.
5. **Do not install another UI library.** No MUI, no Tailwind, no shadcn, no
   Chakra, no Bootstrap. If hello pc lacks something, compose it from hello pc parts,
   or build it with `styled-components` + `radix-ui` (both already dependencies)
   styled entirely with tokens.
6. **Icons come from `lucide-react`.** That is what hello pc itself uses.
7. **Style with `styled-components`.** Already a dependency, already deduped in
   `vite.config.ts`. Never add a second styling library or a second copy.
8. **Do not edit anything in `context/`.** It is generated upstream from the
   hello pc Storybook. To refresh: `npm run hellopc:update`.
9. **Theme changes touch two files.** `data-theme` on `<html>` in `index.html`
   and the `mode` passed to `CakeProvider` in `src/App.tsx` must agree, or the
   first paint flashes the wrong theme. Change both together.
10. **Keep the stylesheet import at the top of `src/main.tsx`.** It looks
    redundant because the package imports its own CSS, but it fixes the cascade
    order: anything imported below it reliably overrides hello pc values. Add your
    own stylesheets after it, never before.
11. **Keep `resolve.dedupe` in `vite.config.ts`.** Removing it lets a second copy
    of `styled-components` in, and hello pc components then render unstyled with no
    error at all.

## Portalled components

`Modal`, `Dropdown`, `SimpleTooltip`, `RichTooltip`, `Breadcrumb`,
`NumberDropdown` and `Pagination` render through a Radix portal into
`document.body`, outside the React tree. They are themed only because
`CakeProvider` puts `data-theme` on `<html>`. Do not pass `scope="subtree"` to
the provider if you use any of them.

## Verify your work

```bash
npm run dev      # look at it in a browser
npm run build    # must exit 0 — typechecks and bundles
```

A change that has not been run is not done. If you changed layout or styling,
look at the result before reporting success.

## Canonical documentation

The live Storybook is the source of truth for anything the context files leave
ambiguous: <https://cake.lenovo.com/storybook/>
