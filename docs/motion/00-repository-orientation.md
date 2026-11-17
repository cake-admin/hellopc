# Phase 0 — Repository orientation

This document records the current state of motion in this repository. It does not propose timings, easings, token values, or new animation designs.

## Scope

This repository is the cake& design system, the public documentation site, and the data-visualization playground. It is not a Vantage or Ampersand product application.

The following surfaces from the Phase 0 brief are **not in this tree**. They cannot be inventoried here and should be audited in their own repositories in a later phase:

- Vantage and Ampersand application shells
- System Updates
- Device Settings
- Personalization
- Account experiences
- A Windows PC product window chrome beyond the documentation site

What this repository does contain:

| Surface | Role | Entry |
| --- | --- | --- |
| Marketing and docs site | Create React App, deployed to cake.lenovo.com | `src/index.js`, `src/App.js` |
| cake& package | Components published as `@cake-admin/cakeand` | `src/cakeand/` |
| Storybook | Component and foundation docs, nested at `/storybook/` | `.storybook/main.ts` |
| Data visualization playground | Separate Vite app, nested at `/datavis/` | `chart-tool-echarts/` |
| Designer starter | Template that installs a published package tarball | `starter/` |

## Architecture overview

### Framework and versions

Versions below are the ranges declared in each `package.json`.

| Surface | Stack |
| --- | --- |
| Root site and design-system source | React `^18.2.0`, React DOM `^18.2.0`, Create React App via `react-scripts` `^5.0.1`, React Router `^6.22.1`, styled-components `^6.1.8`, `radix-ui` `^1.6.2`. Mixed JavaScript and TypeScript. Root `tsconfig.json` has `strict: false` and `allowJs: true`. |
| Storybook | `storybook` `^10.4.6` with `@storybook/react-vite` `^10.4.6` and `@storybook/addon-a11y` `^10.4.6`. Dev server uses Vite `^6.4.3`, not the CRA webpack dev server. |
| Published package | Vite library build (`vite.lib.config.mts`) driven by `scripts/build-package.mjs`. Output name `@cake-admin/cakeand`. |
| `starter/` | Vite `^8.1.1`, React `^19.2.7`, TypeScript `~5.9.3`. Not an npm workspace. |
| `chart-tool-echarts/` | Vite `^6.0.7`, React `^18.3.1`, TypeScript `^5.6.3`, Zustand `^5.0.1`. |

Root package version in `package.json` is `4.0.1`. The starter pins the published tarball `v4.2.4`. Those are different version surfaces. Motion work that lands in `src/cakeand/` does not reach designers until a package publish, and does not reach the starter until that tarball is bumped.

### Routing

There is no product app router.

1. **Documentation site.** `BrowserRouter` in `src/App.js`, with `basename` from `PUBLIC_URL`. Route table: `src/data/routes.js`. Comment in that file: component docs live in Storybook.
2. **Storybook.** No React Router. Stories and MDX are the navigation.
3. **Chart tool.** `MemoryRouter` with a single `/` entry in `chart-tool-echarts/src/App.tsx`. One playground screen, not a multi-page app.

Live site routes:

| Path | Module | Purpose |
| --- | --- | --- |
| `/` | `src/pages/HomePage.jsx` | Design-system home |
| `/resources` | `src/pages/Resources.js` | Libraries and resources |
| `/resources/whats-new` | `src/pages/WhatsNew.js` | Changelog-style updates |
| `/sound`, `/sound/library`, `/sound/prompting` | `src/pages/SoundPage.js` → `src/pages/sound/SoundPage.jsx` | Sound guidelines and library |
| `/foundations` and `/foundations/ai/*` | `src/pages/foundations/FoundationsPage.jsx` | Color, type, spacing, elevation, AI styling |
| `/components` | `src/pages/ComponentsPage.jsx` | Component catalog (one URL, rail tabs) |
| `/version-control` | `src/pages/VersionControl.js` | Version history |

`src/App.js` also redirects retired paths (`/whats-new`, `/get-started/*`, `/foundations/colors`, some `/sound/*` paths) onto the routes above. There is no route transition. `ScrollToTop` jumps with `window.scrollTo(0, 0)`.

Many files under `src/pages/` and `src/components/design-system/` are not referenced by `routes.js`. They remain in the tree as an older site implementation. Motion in those files is real code, and it is not what the current site renders.

### Component architecture

**Shipped design system.** `src/cakeand/components/<Name>/` holds the component and its stories. Public exports: `src/cakeand/index.ts`. Interactive components wrap Radix primitives imported from the `radix-ui` meta-package. Styles are styled-components using CSS custom properties (`--color-*`, `--space-*`, `--radius-*`, `--stroke-*`, `--type-*`, `--elevation-*`). There are no CSS Modules under `src/`.

**Documentation site chrome.** `src/components/` (`TopNav.jsx`, footer in `src/App.js`, and older unused pieces such as `Navigation.js`).

**Legacy component set.** `src/components/design-system/` uses styled-components and, in places, MUI. It is not the published package.

**Chart tool.** Its own React UI in `chart-tool-echarts/src/`, styled mainly by `chart-tool-echarts/src/styles.css`, with ECharts option builders under `src/charts/options/`.

### Cake& Dev Kit integration

- Build: `npm run build:package` → `scripts/build-package.mjs`.
- The package does not publish when `main` merges. Publishing is a separate workflow. The site and Storybook do deploy on merge to `main`.
- `starter/package.json` depends on the GitHub Release tarball for `@cake-admin/cakeand` at v4.2.4, plus `lucide-react`, `radix-ui`, and `styled-components`.
- `starter/src/main.tsx` imports `@cake-admin/cakeand/cakeand.css`.
- `starter/context/` is generated. It describes the pinned package version. A motion system added only in this repo is invisible to starter agents until context is regenerated at publish time.
- `starter/src/` contains no CSS transitions or keyframe animations of its own. Motion a designer sees there is whatever the published package already contains.

### State management

- No Redux.
- Documentation site: React local state, plus `SiteThemeProvider` (`src/theme/SiteThemeProvider.jsx`) for the theme key.
- Sound pages: `SoundPlayerProvider` for audio playback. That is sound state, not visual motion.
- Chart tool: Zustand store at `chart-tool-echarts/src/state/chartStore.ts`.
- Storybook: theme toolbar globals in `.storybook/preview.tsx`.

### Theme architecture

Three modes, matching Figma: `light.a`, `dark.a`, and `win hct`.

- `CakeProvider` (`src/cakeand/theme/CakeProvider.tsx`) sets `data-theme` on `<html>` so portaled Radix content inherits tokens.
- `cake-vars.css` defines the custom properties per `[data-theme]`.
- The site persists a UI key (`light` / `dark` / `hct`) in `localStorage` under `cake-site-theme` and maps it onto those modes.
- Theme changes swap color tokens. They do not define a motion behavior for the swap.

### Token architecture

| File | Role |
| --- | --- |
| `& theme.a/`, `& spacing/`, `& win hct/` | Figma DTCG JSON exports |
| `src/cakeand/tokens/tokens.json` | Generated color, spacing, radius, and stroke values |
| `src/cakeand/tokens/cake-vars.css` | Generated CSS custom properties |
| `src/cakeand/tokens/theme.ts` | JavaScript theme object |
| `src/cakeand/tokens/typography.ts` | Type presets |
| `src/tokens/cake-color-tokens.json`, `src/tokens/colorTokens.js` | Legacy color helpers for the old site components |
| `chart-tool-echarts/scripts/build-tokens.mjs` | Chart-tool token pipeline, separate from cake& |

A search of `src/cakeand/tokens/` for duration, easing, and motion names returns nothing. Motion values in components are literal times and keywords written next to the rule that uses them (`120ms ease`, `160ms ease`, and so on).

The token pipeline is generated from Figma variable exports. Component styling rules for cake& allow `--color-*`, `--space-*`, `--radius-*`, `--stroke-*`, and `--type-*`. A future motion token has to enter through that pipeline. It cannot be invented as a new JSON name beside the Figma exports.

### Accessibility architecture

- Radix supplies roles, focus trapping, and keyboard behavior for the primitives cake& wraps.
- Storybook loads `@storybook/addon-a11y`.
- Focus styling is per component, commonly `:focus-visible` using stroke tokens.
- Reduced motion is implemented inside individual components. There is no shared `useReducedMotion` hook and no global `@media (prefers-reduced-motion)` in `cake-vars.css` or the site shell.
- Storybook docs mention reduced motion for Accordion, Spinner, and Scrollbar. Those notes describe the component. They are not a system-wide policy.

## Motion-related technologies

Motion in this repo is CSS, plus two JavaScript hosts that are not animation libraries.

| Technology | Where | What it does |
| --- | --- | --- |
| styled-components `keyframes` and `transition` | cake& components, legacy site components, some pages | All package motion and most site motion |
| Plain CSS transitions and keyframes | `chart-tool-echarts/src/styles.css` | Playground chrome, including a local `--ease-out` custom property |
| Radix `data-state` and CSS variables | Accordion, Toast, Tooltip, Modal | Open, close, and swipe states drive CSS. Accordion height uses `--radix-accordion-content-height`. Toast swipe uses `--radix-toast-swipe-*`. |
| ECharts animation options | `chart-tool-echarts/src/charts/options/common.ts` | Canvas series entrance. Shared helper `animationOpts()`. |
| `@dnd-kit` | `chart-tool-echarts/src/panel/controls/SortableRows.tsx` | Drag reorder via inline `transform` and the library `transition` |
| `setInterval` | `src/pages/HomePage.jsx` | Hero typewriter. Interval is `WORD_MS = 90`. Skipped when reduced motion matches. |
| `requestAnimationFrame` | `src/pages/sound/SoundPage.jsx` | Defers setting a copy-toast open flag. Not a visual animation curve. |

Not present as runtime motion:

- No Lottie, GIF motion assets, or SVG SMIL `<animate>`.
- `.gif` appears only as a file-accept string on FileUpload.
- No framer-motion, GSAP, anime.js, react-transition-group, or page-transition library imports.
- `@react-spring/web` `10.1.1` is in the root lockfile only because `@visx/react-spring` is a transitive of the declared `@visx/*` packages. Application source does not import visx or react-spring.
- `react-transition-group` is transitive through `@mui/material`. Application source does not import it.
- `.agents/skills/emil-design-eng/SKILL.md` discusses motion as reviewer guidance and mentions framer-motion in that document. It is not a dependency and it does not run in the app.

## Existing dependencies

Declared ranges. "Used" means imported or called from application source, excluding `node_modules`.

| Package | Declared | Where declared | Current use |
| --- | --- | --- | --- |
| `styled-components` | `^6.1.8` | Root, starter, chart tool | Host for cake& and legacy keyframes and transitions |
| `radix-ui` | `^1.6.2` | Root, starter, chart tool | Primitive state that cake& animates against. Chart-tool source does not import it directly. |
| `lucide-react` | `^0.536.0` | Root, starter, chart tool | Icons in cake& and the site, including the FileUpload `LoaderCircle` that is rotated with CSS |
| `@phosphor-icons/react` `^2.1.10`, `react-icons` `^5.5.0` | Root | Declared only. No source imports found. |
| `@mui/material` `^5.18.0`, `@mui/icons-material` `^5.18.0`, `@emotion/react` `^11.14.0`, `@emotion/styled` `^11.14.1` | Root | Legacy docs-site components under `src/components/design-system/` and older pages. Not used by `src/cakeand/`. |
| `echarts` | Root `^5.6.0`, chart tool `^5.5.1` | Chart playground and `src/pages/components/datavisCharts.js` | Chart series animation. Site previews set `animation: false`. |
| `echarts-gl` | `^2.0.9` | Chart tool | 3D chart setup |
| `@dnd-kit/core` `^6.1.0`, `@dnd-kit/sortable` `^8.0.0`, `@dnd-kit/utilities` `^3.2.2` | Chart tool | Row reorder in the customization panel |
| `@visx/*` `^4.0.0` | Root | Declared only. No source imports found. Brings `@react-spring` transitively. |
| `svgo` `^3.2.0` | Root | Build/optimize pipeline via CRA overrides (`@svgr/webpack`). Not a runtime animation library. |
| `react-router-dom` `^6.22.1` | Root, chart tool | Routing without page transitions |
| `zustand` `^5.0.1` | Chart tool | Chart state, not motion |

## Surface inventory

### Shell

| Surface | Purpose | Key flow | Motion that exists |
| --- | --- | --- | --- |
| Window chrome | Not a desktop window. The site shell is `src/App.js`: `TopNav`, optional `SectionSubNav`, Lenovo logo, main, footer. | Move between site sections | `TopNav.jsx` has no CSS transition or animation. Footer is static. Route changes scroll to top instantly. |
| Navigation | Current site uses `TopNav.jsx`. `src/components/Navigation.js` is an older sidebar and is not imported by a live route. | Section links | Live nav: none found. Unused `Navigation.js`: `transition: all 0.5s ease` on the panel, `left 0.3s` when closed off-canvas, submenu `max-height 0.3s ease-out`, chevron `transform 0.3s`. No reduced-motion query. |
| Header | `TopNav.jsx` | Theme and section links | No motion rules found. |
| Footer | `Footer` in `src/App.js` | Brand line | No motion. Background is a hardcoded `#000000`, not a motion concern. |

### Core experiences that exist here

| Surface | Purpose | Key flow | Motion |
| --- | --- | --- | --- |
| Home | `src/pages/HomePage.jsx` | Read the intro, follow links into resources, foundations, components, Storybook | Hero typewriter via `setInterval` at 90ms per step. Cursor blink keyframe `1s step-end infinite`. Both stop under `prefers-reduced-motion: reduce`. Wallpaper is a static image (`StickyWallpaper`), not the aurora animation. |
| Foundations | `FoundationsPage.jsx` | Color, typography, spacing, elevation, special surfaces, tone, AI styling | No page-level animation found. Inherits the static wallpaper. |
| Components catalog | `ComponentsPage.jsx` | Browse component groups and jump to Storybook | No page-level animation found. Chart previews in `src/pages/components/datavisCharts.js` set ECharts `animation: false`. |
| Resources / What's new / Version control | Matching page modules | Read updates and links | Color transitions only where older page files still style cards (see the file map). Live wallpaper pages do not run the aurora loop. |
| Sound | `src/pages/sound/` | Read guidance, play library assets, copy a prompt | Audio playback. `requestAnimationFrame` only opens a copy toast on the next frame. Waveform graphics are static SVG. Sound-catalog `durationMs` is audio length. |
| Search | `getSearchResults` in `src/data/routes.js` | Filter the route list | No motion. There is no search modal on the current route table. |
| AI experiences | Foundations AI routes, plus unrouted files under `src/pages/subsystems/ai/` and `src/components/design-system/ai/` | Read AI styling guidance on the live foundations routes | Live foundations pages: no dedicated motion found. Unrouted AI components: color transitions around `0.2s`, and `ShimmerThinkingIndicator.js` (`background-position`, `2s linear infinite`, disabled under reduced motion). |
| Data visualization | `chart-tool-echarts/` at `/datavis/` | Pick a chart, edit data and tokens, export | ECharts entrance through `animationOpts` (600ms, `cubicOut`, stagger `idx * 40`), off for static export and reduced motion. Chrome uses CSS transitions and two catalog keyframes. Drag reorder uses dnd-kit transforms. |
| Storybook | `src/cakeand/**/*.stories.tsx` and `src/cakeand/foundations/*.mdx` | Read component behavior | Renders the component motion described in the file map. Foundations MDX covers color, type, spacing, and elevation. There is no motion foundation page. |
| Dashboard, System Updates, Device Settings, Personalization, Account | Not in this repository | — | — |

### Supporting experiences (cake& package)

These are the overlays a consumer of `@cake-admin/cakeand` actually gets.

| Pattern | Path | Purpose | Motion |
| --- | --- | --- | --- |
| Modal | `src/cakeand/components/Modal/Modal.tsx` | Radix Dialog | Overlay opacity `160ms ease`. Content opacity, translate, and scale `180ms ease`. Disabled under reduced motion. |
| Toast | `src/cakeand/components/Toast/Toast.tsx` | Radix Toast | Enter, exit, and swipe on opacity and translate. Gated on `prefers-reduced-motion: no-preference`. |
| Simple tooltip | `src/cakeand/components/Tooltip/SimpleTooltip.tsx` | Radix Tooltip | Opacity and translateY `120ms ease-out`. Disabled under reduced motion. |
| Rich tooltip | `src/cakeand/components/Tooltip/RichTooltip.tsx` | Radix Popover | Opacity, translateY, and scale `160ms ease-out`. Disabled under reduced motion. |
| Dropdown / number dropdown | `Dropdown.tsx`, `NumberDropdown.tsx` | Radix Select | Field color `120ms ease`. Chevron rotate `150ms ease`. The menu panel itself has no enter or exit animation. No reduced-motion query. |
| Date popover | `DateInput/DateInput.tsx` | Radix Popover | Field color `120ms ease` only. No popover enter animation found. |
| Menu | `Menu/MenuItem.tsx`, `MenuContainer.tsx` | Presentational menu row | Item background `120ms ease`. No open/close animation. |
| Notification / notification panel | `Notification/`, `NotificationPanel/` | Inline status and a blur panel | No transition or keyframe rules found. |
| Progress | `Progress Indicators/ProgressBar.tsx`, `Spinner.tsx` | Determinate bar and indeterminate spinner | Bar fill is `transform` `160ms ease` (no reduced-motion query). Spinner is `rotate` `900ms linear infinite`, stopped under reduced motion. |
| Accordion | `Accordion/Accordion.tsx` | Disclosure | Height keyframes `200ms ease`, chevron rotate `200ms ease`. Both respect reduced motion. |
| Switch | `Switch/Switch.tsx` | Toggle | Thumb `left` and `width` `150ms ease`. No reduced-motion query. |

Legacy copies of modal, dropdown, tooltip, alert, and spinner still live in `src/components/design-system/` with different timings and almost no reduced-motion handling. They are not the package API.

## Accessibility observations

### Support that exists

`prefers-reduced-motion` is handled in application code, not only in comments.

cake& components that stop or skip movement:

- Modal overlay and content (`animation: none`)
- Toast enter, exit, and swipe (animations applied only under `no-preference`)
- Simple tooltip and rich tooltip (`animation: none`)
- Accordion height (animations only under `no-preference`) and chevron (`transition: none`)
- Spinner (`animation: none`)
- Scrollbar thumb size (`transition: none`)
- Horizontal tabs, vertical tabs, and sidebar rows (`transition: none` on the rules that move or recolor those rows)

Site and chart tool:

- Home hero typewriter and cursor
- `RotatingHeadline.js` (CSS and a `matchMedia` check). This module is not imported by a live route.
- Legacy `Spinner.js` and `ShimmerThinkingIndicator.js`
- Legacy `Link.js` (`transition: none`)
- Chart `animationOpts()` turns ECharts animation off when `matchMedia('(prefers-reduced-motion: reduce)')` matches, and when `staticFrame` is set
- Chart CSS drops the press `scale` on a few controls and shortens their transitions. It does not disable `catalog-fade` or `catalog-pop`.

### Support that is missing

- No global reduced-motion rule for cake& or the site shell. Each component opts in, so new components ship movement unless someone remembers the query.
- cake& Switch (`left` and `width`), ProgressBar (`transform`), FileUpload spinner (`900ms` rotate), and dropdown chevrons (`transform`) keep moving.
- cake& color transitions (`120ms ease` on background, border, and text) are not gated. Those are paint changes, not travel. They are called out so a later policy can decide whether color fades count.
- Legacy modals, alerts, dropdowns, sliders, navigation, aurora, and interactive grid do not check reduced motion.
- dnd-kit reorder in the chart tool does not check reduced motion.
- Chart catalog enter animations are outside the reduced-motion block in `styles.css`.

### Risks

- Two policies already disagree. Toast and Accordion only animate under `no-preference`. Modal and tooltips animate by default and then set `animation: none`. Both work today. A shared helper does not exist, so the next component can pick a third pattern or none.
- Consumers of the package inherit only the per-component queries. An app cannot turn cake& motion off from one place.
- Windows High Contrast is considered for Toast borders (a real border so forced-colors can paint an edge). That work is contrast, not motion. Motion has no equivalent forced-colors or reduced-motion contract in the token files.

## Performance observations

### Practices already present

- Modal content, tooltips, toast, and the ProgressBar indicator animate `opacity` and/or `transform`.
- Spinner rotation is `transform: rotate` with `will-change: transform`.
- Chevrons in Accordion, Dropdown, Sidebar, and Vertical Tabs rotate with `transform`.
- Chart chrome press feedback uses `transform` scale, and the reduced-motion block removes that scale.
- ECharts animation is centralized and can be turned off for export and reduced motion.
- Site chart previews disable ECharts animation entirely.

### Expensive or layout-affecting motion

| Location | Property | Why it matters |
| --- | --- | --- |
| `Accordion.tsx` | `height` from `0` to `--radix-accordion-content-height` | Layout on every frame of open and close |
| `Switch.tsx` | `left` and `width`, with `will-change: left, width` | Layout. `will-change` keeps those properties promotion-ready even when the control is idle. |
| `Scrollbar.tsx` | Bar `width` or `height` `140ms ease` | Layout on hover and drag |
| Legacy `Slider.js` | Fill `width 0.1s ease` when not dragging | Layout. Thumb position is `left` as a percentage; the transition list does not include `left`. |
| `Navigation.js` | `transition: all 0.5s` and submenu `max-height` | `all` interpolates every property. `max-height` is a layout animation. File is unused by current routes. |
| `ShimmerThinkingIndicator.js` | `background-position` `2s linear infinite` | Continuous paint. Unrouted AI demo. |
| `AuroraBackground.js`, `InteractiveGrid.js` | `20s` infinite transform, large blur | Continuous compositor and paint work. Not mounted by current routes (`AuroraBackground` is only imported by unrouted `src/pages/Home.js`). |

### Continuous animations

- cake& Spinner and FileUpload icon: `900ms linear infinite`
- Legacy Spinner: `0.8s linear infinite`
- Home cursor: `1s step-end infinite` (stopped for reduced motion)
- Shimmer: `2s linear infinite` (stopped for reduced motion)
- Aurora and interactive grid: `20s ease-in-out infinite` (not stopped)
- ECharts entrance is finite (600ms), not a loop

No width or height animation was found in the published cake& package except Accordion `height` and Scrollbar bar size. Switch is the package control that animates `left`.

## Architectural constraints

1. **Three dialects.** cake& (package), `src/components/design-system/` (legacy, mostly unwired), and `chart-tool-echarts` (its own CSS variable and ECharts helper). A motion language that only edits one of them will not show up in the others.
2. **The package is the system of record for product UI.** Vantage and Ampersand are expected to consume `@cake-admin/cakeand`, not the legacy site components. Legacy motion is evidence of an older pattern. It is not a second source of truth.
3. **Tokens are generated from Figma.** Duration and easing tokens do not exist. Adding them later means a Figma variable source, then `tokens.json` and `cake-vars.css`. Hardcoded milliseconds in styled-components will not pick up a token until each component is switched to `var(--…)`.
4. **Component CSS rules name the allowed custom properties.** Today's cake& styling contract lists color, space, radius, stroke, and type. Motion is outside that contract, which is why values are literals.
5. **Radix owns open and close state.** Enter and exit motion has to hang off `data-state` (and toast swipe attributes). A JS animation library would fight that model unless it is deliberately wrapped around the same states.
6. **Portals follow `data-theme` on `<html>`.** Overlay motion cannot assume it inherits a subtree class. Any future motion custom properties must be on `:root` / `[data-theme]`, the same way color tokens are, or portaled dialogs will not see them.
7. **Publish lag.** Site and Storybook update on merge to `main`. The npm package and `starter/context/` update only on a release. Motion guidelines written into Storybook foundations would ship with the site. Motion behavior inside components would not reach the starter until the next package version.
8. **starter forbids a second UI library.** A later decision to add framer-motion or a similar runtime would violate the starter agent rules unless those rules are changed in the same effort. Today the starter expects styled-components plus the package.
9. **No page-transition layer.** React Router swaps routes immediately. There is no shared layout animation to extend.
10. **Reduced motion is local.** There is no single switch a consuming app can set, and no test that fails when a new keyframe omits the media query.

## What is reusable today

- The cake& habit of short color and border transitions written as `120ms ease` on the control, not on `all`.
- Radix `data-state` as the hook for enter and exit, already used by Modal, Toast, Tooltip, and Accordion.
- Transform and opacity for overlay entrance (Modal, tooltips, Toast), as distinct from the height and position animations.
- `animationOpts()` plus `reducedMotion()` in the chart tool, as the only shared gate in the repo. It is local to ECharts options. It is not imported by cake&.
- `--ease-out` in the chart-tool stylesheet, as proof that one custom property can be shared inside one app. It is not a cake& token and it does not cross into the package.

## What this phase does not decide

Curves, durations, token names, and which existing animation should become the standard are later phases. This document only states what is implemented and which constraints a later phase has to respect.
