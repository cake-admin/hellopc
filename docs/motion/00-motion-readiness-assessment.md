# Phase 0 — Motion readiness assessment

Ratings use only what is in the repository today. They do not assume a future token set, curve, or duration.

| Area | Rating |
| --- | --- |
| Token readiness | Not Ready |
| Component consistency | Partially Ready |
| Accessibility readiness | Partially Ready |
| Performance readiness | Partially Ready |
| Documentation readiness | Not Ready |
| Design system readiness | Partially Ready |

Detail and the file inventory are in [00-repository-orientation.md](00-repository-orientation.md) and [00-motion-file-map.md](00-motion-file-map.md).

## Token readiness — Not Ready

`src/cakeand/tokens/tokens.json` and `src/cakeand/tokens/cake-vars.css` define color, space, radius, stroke, type, and elevation. A search of that folder finds no duration, easing, or motion names.

Every cake& time is a literal in the component that uses it (`120ms ease`, `150ms ease`, `160ms ease`, `180ms ease`, `200ms ease`, `900ms linear`). The chart tool has one local custom property, `--ease-out`, in its own stylesheet. That property is not generated with the cake& tokens and is not available to the package or the starter.

The token pipeline is generated from Figma exports (`& theme.a/`, `& spacing/`, `& win hct/`). Cake& component rules tell authors to use the existing custom properties and not to invent names. A motion token written only into a component, or only into JSON, would violate that pipeline.

Nothing is ready to retokenize. The values exist as scattered literals, not as a scale.

## Component consistency — Partially Ready

Inside `src/cakeand/components/`, hover and selected color changes share one pattern: `120ms ease` on background, border, and text, written as a specific property list rather than `transition: all`. That pattern shows up on buttons, inputs, chips, menu rows, tabs, and table rows. It is the closest thing to a convention.

Entrance motion does not share that convention. Modal, Toast, tooltips, and Accordion each pick their own duration and easing keyword. Dropdown and DateInput open overlays with no enter animation at all. Chevron rotation is `150ms` on Dropdown and `200ms` on Accordion. Spinners are `900ms` in cake& and `0.8s` in the legacy spinner.

A second implementation lives in `src/components/design-system/`. It prefers `0.2s`–`0.3s` and `transition: all`, and it animates some of the same ideas differently (legacy modal travels `translateY(-20px)` and scales to `0.95`; cake& modal uses a shorter opacity, translate, and `scale(0.98)` pair). A third implementation lives in the chart tool (`0.12s`–`0.18s`, a cubic-bezier custom property, and ECharts at `600` / `cubicOut`).

The package is consistent about color fades. It is not consistent about overlays, disclosure, or loading. The repo as a whole is three dialects.

Reusable without a redesign: the cake& `120ms ease` color-fade habit, and Radix `data-state` as the place enter and exit already attach.

Needs later refactoring, not a new design in this phase: duplicate modal, tooltip, dropdown, and spinner implementations; overlays that animate beside overlays that pop; `transition: all` in the legacy set.

## Accessibility readiness — Partially Ready

Reduced motion is implemented, and it is not systematic.

cake& already stops movement on Modal, Toast, both tooltips, Accordion, Spinner, Scrollbar, horizontal tabs, vertical tabs, and sidebar rows. The home hero stops its typewriter and cursor. The chart tool turns ECharts animation off when `prefers-reduced-motion: reduce` matches.

Gaps that still move:

- Switch animates `left` and `width`
- ProgressBar animates `transform`
- FileUpload spins an icon at `900ms linear infinite`
- Dropdown and NumberDropdown rotate a chevron
- Chart catalog fade and pop animations are outside the reduced-motion block
- dnd-kit reorder does not check the media query
- Legacy modal, alert, dropdown, slider, navigation, aurora, and interactive grid do not check it

There is no shared hook and no global media query in `cake-vars.css`. Two local styles already coexist: some components animate only under `no-preference`, others animate by default and then set `animation: none`. Both can work. Neither is a contract the next component is forced to follow.

Storybook a11y addon and Radix keyboard behavior are in place for interaction. They do not test motion. A few stories mention reduced motion for Accordion, Spinner, and Scrollbar. Most moving components do not.

Risk: a consuming app cannot disable package motion from one setting. Each component decides.

## Performance readiness — Partially Ready

Overlay entrance in the package already uses opacity and transform (Modal, tooltips, Toast). The progress fill uses transform. Spinner rotation uses transform. Chart press feedback uses transform and removes it under reduced motion. ECharts animation is one helper and is disabled for static export and for the site's embedded previews.

Layout-affecting motion is still in the package:

- Accordion animates `height`
- Switch animates `left` and `width`, and sets `will-change` on both while idle
- Scrollbar animates bar `width` or `height`

Outside the package, legacy Slider animates fill `width`, legacy AI text fields animate `border-width`, unused `Navigation.js` uses `transition: all` and `max-height`, and unused aurora and grid loops run for `20s`. Those unused files do not affect the live site until something imports them. They remain a trap if a later page mounts them.

No evidence of a shared performance budget, a ban on `transition: all` in the package, or a review check that flags `width`, `height`, `top`, or `left`. The package mostly avoids those properties. The exceptions are not documented as exceptions.

## Documentation readiness — Not Ready

Storybook foundations cover color, typography, spacing, elevation, and special surfaces (`src/cakeand/foundations/`). There is no motion page.

Component stories describe behavior, accessibility, and tokens. Reduced motion is mentioned for three components. Durations are not described as a scale because there is no scale.

`starter/context/` is generated from story prose. It cannot tell a designer's agent about motion until the stories describe it, and it only updates on package publish.

Reviewer notes under `.agents/skills/emil-design-eng/` discuss motion in general. They are not cake& guidance and they are not wired to these components.

There is no changelog entry, no foundation doc, and no agent-context page for motion. This `docs/motion/` folder is the first written record, and it is an audit, not a guideline.

## Design system readiness — Partially Ready

What a later motion system can build on:

- One package boundary (`src/cakeand/`) that products are supposed to consume
- Radix state attributes as a stable animation hook
- CSS custom properties that already retheme portaled overlays, because `CakeProvider` sets `data-theme` on `<html>`
- A generate-from-Figma path for tokens, so motion tokens have an obvious home if Figma ever defines them
- A single chart-tool helper that shows what a shared gate looks like (`animationOpts`)

What is not ready:

- Motion is outside the styling contract (color, space, radius, stroke, type)
- No shared module, no reduced-motion helper, no test that a new keyframe must opt into reduced motion
- Legacy and chart-tool motion will drift further if only the package is specified
- The starter forbids adding another UI library. Any runtime besides CSS and the existing Radix state has to be an explicit decision, not an incidental dependency
- Package publish is manual and version-pinned. Behavior and the starter's copy of the docs move on a release, not on a site deploy

## Executive summary

### Top 10 observations

1. This repository is the cake& design system, its documentation site, and the `/datavis` chart playground. Vantage, Ampersand, and the product shells named in the brief are not here.
2. Motion is CSS in styled-components, plus ECharts options and one dnd-kit drag list. No animation library is a direct dependency.
3. The published package's most repeated motion is a `120ms ease` color and border fade. It is a habit, not a token.
4. Overlay motion exists for Modal, Toast, tooltips, and Accordion, each with its own literal timing. Select menus, date popovers, and menus do not animate open or closed.
5. A full older component set under `src/components/design-system/` repeats those patterns with different timings, `transition: all`, and little reduced-motion support. Current routes do not mount most of it.
6. The chart tool is the only place with a shared motion helper and a shared easing custom property. Both are local to that app.
7. `prefers-reduced-motion` is implemented on several cake& overlays and on the home hero, and it is absent on Switch, ProgressBar, the FileUpload spinner, and dropdown chevrons.
8. The package already prefers transform and opacity for overlays. Accordion height, Switch `left`/`width`, and Scrollbar size are the package exceptions that affect layout.
9. Tokens, Storybook foundations, and starter context have no motion layer. The token pipeline cannot grow one without a Figma source.
10. Shipping motion behavior to product teams means a package release. Shipping a written guideline to the public site means a Storybook page on `main`. Those are different pipelines.

### Biggest risks

- Three dialects stay in the tree. A guideline written against cake& can be contradicted by legacy components if those files get mounted again, and by the chart tool, which will not see package tokens.
- Reduced motion is opt-in per file. New components can ship travel or infinite spin without a failing check.
- Layout animations in Accordion and Switch are in the package consumers already take. Changing them later is a behavior change, not a docs change.
- Inventing duration tokens in JSON ahead of Figma would break the token pipeline and the "do not invent token names" rule.
- Adding a motion runtime library would conflict with the starter rule that forbids a second UI library.

### Biggest opportunities

- Treat `src/cakeand/` as the only system of record and treat the legacy folder as historical evidence.
- The `120ms ease` color fade and the Radix `data-state` enter/exit pattern are already shared in practice. A later phase can study them before deciding whether they become the scale.
- `animationOpts()` is a working example of one gate that honors reduced motion and a static-export flag. It is the pattern to study, not code to copy into cake& as-is.
- Portaled overlays already read tokens from `documentElement`. A future motion custom property on `:root` would reach dialogs and toasts without a new theming mechanism.
- Unused aurora, grid, rotating headline, and `Navigation.js` motion can be studied as non-production. They do not have to be preserved for the live site.

### Missing foundations

- Duration and easing tokens, and a Figma source for them
- A shared reduced-motion approach (one media-query pattern, or one helper)
- A Storybook foundations page for motion
- A decision about which existing animations are in the system and which are leftovers
- Any audit of Vantage, Ampersand, or other Windows product shells

### Recommended focus for Phase 1

Phase 1 should stay analytical. It should not pick curves or durations.

1. Lock cake& (`src/cakeand/components/`) as the system of record. Catalog only those motions as candidates. Keep legacy and chart-tool motion in a comparison column so differences stay visible.
2. Map the insertion point for a future token: Figma variables, then `scripts/build-cakeand-tokens.mjs` / `scripts/build-cakeand-css-vars.mjs`, then `cake-vars.css`, then the styled-components that today use literals. Do not add the token.
3. List every package motion that still runs under `prefers-reduced-motion: reduce`, and every package motion that animates `width`, `height`, `top`, or `left`. That list is the audit backlog. Switch, ProgressBar, FileUpload, dropdown chevrons, Accordion height, and Scrollbar size are the known entries.
4. Note overlays that do not animate (Dropdown, NumberDropdown, DateInput, Menu, Notification) as behavior gaps to study, without designing an entrance for them.
5. When product repositories are available, repeat this inventory there. This repo cannot answer how Vantage or Ampersand move.

## Success criteria

**What exists today?** CSS transitions and keyframes in cake&, a second set in the legacy site components, ECharts entrance animation, chart-tool chrome CSS, and a small amount of `setInterval` and dnd-kit motion. No Lottie, GIF, or animation library.

**Where is it implemented?** Package motion is in `src/cakeand/components/`. Site motion that users hit today is mainly `src/pages/HomePage.jsx`. Chart motion is `chart-tool-echarts/src/charts/options/common.ts` and `chart-tool-echarts/src/styles.css`. The file map lists the rest, including unwired files.

**What is reusable?** The cake& color-fade pattern, Radix `data-state` animation hooks, transform and opacity on overlays, and the chart tool's single `animationOpts` gate as a reference. None of these are a shared cake& module yet.

**What needs refactoring later?** Duplicate legacy components, `transition: all`, height and position animations, and uneven reduced-motion coverage. This phase does not change them.

**What should be audited next?** The package exceptions listed in the Phase 1 focus, the Figma variable set to see whether any motion variables already exist outside this repo, and the product applications that are not in this tree.
