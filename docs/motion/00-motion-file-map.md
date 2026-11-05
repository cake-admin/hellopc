# Phase 0 — Motion file map

Inventory of motion-related files in this repository at the time of the Phase 0 audit. Timings are quoted from the source. This list does not recommend replacements.

Motion type values:

- `css-transition` — CSS `transition`
- `css-keyframes` — CSS `@keyframes` or styled-components `keyframes`
- `js` — JavaScript-driven motion (timer, ECharts, dnd-kit)
- `docs` — prose that describes motion and does not animate

Reduced motion: `yes` if the file queries `prefers-reduced-motion` or `matchMedia`, `no` if movement is unconditional, `n/a` if the file only changes color or does not animate.

Stories that mention reduced motion are listed once at the end. They document behavior. They do not implement it.

## 1. cake& package — entrance, exit, and continuous motion

These files are what `@cake-admin/cakeand` ships.

| File | Purpose | Type | What moves | Timing in source | Reduced motion | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `src/cakeand/components/Modal/Modal.tsx` | Dialog overlay and panel | css-keyframes | Overlay opacity. Content opacity, `translate(-50%, -48%) scale(0.98)` to `translate(-50%, -50%) scale(1)`. | Overlay `160ms ease`. Content `180ms ease`. | yes | `animation: none` on both. Scrim also uses `backdrop-filter: blur(12px)` (paint, not a timed animation). |
| `src/cakeand/components/Toast/Toast.tsx` | Toast enter, exit, swipe | css-keyframes, css-transition | Opacity and `translateY` on open. Opacity on close. `translateX` on swipe. | Open `200ms ease`. Close `150ms ease-in`. Swipe end `150ms ease-out`. Swipe cancel `transform 200ms ease-out`. | yes | Animations are inside `@media (prefers-reduced-motion: no-preference)` only. |
| `src/cakeand/components/Tooltip/SimpleTooltip.tsx` | Tooltip appear | css-keyframes | Opacity and `translateY` | `tooltip-in 120ms ease-out` | yes | `animation: none` |
| `src/cakeand/components/Tooltip/RichTooltip.tsx` | Popover appear | css-keyframes | Opacity, `translateY`, `scale(0.98)` to `1` | `rich-tooltip-in 160ms ease-out` | yes | `animation: none`. Also `backdrop-filter: blur(45px)`. |
| `src/cakeand/components/Accordion/Accordion.tsx` | Disclosure height and chevron | css-keyframes, css-transition | Content `height` between `0` and `--radix-accordion-content-height`. Chevron `transform` rotate. | Both `200ms ease` | yes | Height runs only under `no-preference`. Chevron sets `transition: none` under `reduce`. Height is layout work. |
| `src/cakeand/components/Progress Indicators/Spinner.tsx` | Indeterminate loader | css-keyframes | `transform: rotate(360deg)` | `900ms linear infinite` when `$animated` | yes | `animation: none` under `reduce`. `will-change: transform`. |
| `src/cakeand/components/FileUpload/FileUpload.tsx` | Drop zone and loading icon | css-transition, css-keyframes | Zone background and border. `LoaderCircle` rotates. | Zone `120ms ease`. Spin `file-upload-spin 900ms linear infinite`. | no | Spin has no reduced-motion query. |
| `src/cakeand/components/Progress Indicators/ProgressBar.tsx` | Determinate fill | css-transition | Indicator `transform` (Radix scale on the X axis), `transform-origin: left` | `transform 160ms ease` | no | Compositor-friendly property. Not gated. |

## 2. cake& package — position and size

| File | Purpose | Type | What moves | Timing in source | Reduced motion | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `src/cakeand/components/Switch/Switch.tsx` | Toggle thumb | css-transition | Thumb `left`, `width`, and background. Track background. | `150ms ease` | no | `will-change: left, width`. Comment in file calls the press stretch a spring. The implementation is a CSS transition, not a spring solver. |
| `src/cakeand/components/Elements/Scrollbar.tsx` | Scrollbar thumb affordance | css-transition | Vertical bar `width`. Horizontal bar `height`. | `140ms ease` | yes | `transition: none` under `reduce`. |
| `src/cakeand/components/Dropdown/Dropdown.tsx` | Select field and chevron | css-transition | Field background, border, color. Chevron `transform` rotate. | Field `120ms ease`. Chevron `150ms ease`. | no | Menu panel has no enter animation. |
| `src/cakeand/components/NumberDropdown/NumberDropdown.tsx` | Numeric select | css-transition | Same as Dropdown | Field `120ms ease`. Chevron `150ms ease`. | no | Same gap as Dropdown. |
| `src/cakeand/components/Sidebar/SidebarItem.tsx` | Nav row and chevron | css-transition | Row background. Chevron `transform`. | Background `120ms ease`. Chevron `150ms ease`. | yes | Both rules set `transition: none` under `reduce`. |
| `src/cakeand/components/VerticalTabs/VerticalTabItem.tsx` | Tab row and chevron | css-transition | Row background. Chevron `transform`. | Background `120ms ease`. Chevron `150ms ease`. | yes | Same pattern as SidebarItem. |

## 3. cake& package — color and border transitions

Shared pattern: `120ms ease` on background, border-color, color, or box-shadow. No keyframes. No reduced-motion query, except the rows called out in the last column. These are state fades (hover, press, focus, selected), not travel.

| File | Properties | Reduced motion |
| --- | --- | --- |
| `src/cakeand/components/Button/Button.tsx` | `background-color`, `color`, `border-color`, `box-shadow` `120ms ease` | no |
| `src/cakeand/components/Button/IconButton.tsx` | `background-color`, `color`, `border-color` `120ms ease` | no |
| `src/cakeand/components/Checkbox/Checkbox.tsx` | `background`, `border-color` `120ms ease` | no |
| `src/cakeand/components/Chip/Chip.tsx` | `background-color` `120ms ease` on two nodes | no |
| `src/cakeand/components/DateInput/DateInput.tsx` | `background`, `border-color` `120ms ease` | no |
| `src/cakeand/components/HorizontalTabs/HorizontalTabItem.tsx` | `background` `120ms ease` on the trigger and the indicator | yes (`transition: none`) |
| `src/cakeand/components/Menu/MenuItem.tsx` | `background` `120ms ease` | no |
| `src/cakeand/components/NumberInput/NumberInput.tsx` | `background`, `border-color` `120ms ease` | no |
| `src/cakeand/components/Pagination/Pagination.tsx` | `background` `120ms ease` | no |
| `src/cakeand/components/PasswordInput/PasswordInput.tsx` | `background`, `border-color` `120ms ease` | no |
| `src/cakeand/components/PinInput/PinInput.tsx` | `background`, `border-color` `120ms ease` | no |
| `src/cakeand/components/Radio/Radio.tsx` | `border-color`, `background` `120ms ease` | no |
| `src/cakeand/components/Sidebar/SidebarSubItem.tsx` | `background` `120ms ease` | yes |
| `src/cakeand/components/Table/DataRow.tsx` | `background-color`, `box-shadow` `120ms ease` | no |
| `src/cakeand/components/TextInput/TextInput.tsx` | `background`, `border-color` `120ms ease` | no |
| `src/cakeand/components/TimeInput/TimeInput.tsx` | Field and segment `background`, `border-color`, `color` `120ms ease` | no |
| `src/cakeand/components/VerticalTabs/VerticalTabSubItem.tsx` | `background` `120ms ease` | yes |

Dropdown and NumberDropdown field transitions are in section 2 because those files also rotate a chevron.

## 4. cake& components with no motion rules

Searched for `transition` and `animation` under `src/cakeand/components/`. These component folders did not match. They still render, they just do not define motion:

`Avatar`, `Badge`, `Breadcrumb`, `Card`, `ContentSwitcher`, `Counter`, `Notification`, `NotificationPanel`, `Slider`, `Stepper`, plus presentational pieces that are not listed in sections 1–3 (`ModalTitle`, `ModalContent`, `ModalIcon`, menu container, table chrome other than `DataRow`).

`DateInput` opens a calendar popover and `Dropdown` opens a select menu without an enter or exit animation on the overlay. The field chrome is in the tables above. The overlay is not.

## 5. Legacy design-system components

Path prefix: `src/components/design-system/`. These are not exported by `@cake-admin/cakeand`. Most are not mounted by the current route table. They are listed because the code is still in the repo and it is a second motion dialect.

### Keyframes, layout, and continuous

| File | Purpose | Type | What moves | Timing in source | Reduced motion | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `Alert.js` | Toast-like alert | css-keyframes, css-transition | Opacity and translate per corner. Close control uses `transition: all`. | Slide in `0.3s ease-out`. Slide out `0.3s ease-in`. Close `0.2s ease`. | no | Keyframes are interpolated into the styled rule by position name. |
| `Modal.js` | Dialog | css-keyframes, css-transition | Overlay opacity. Content opacity, `translateY(-20px)`, `scale(0.95)`. Close uses `transition: all`. | Fade `0.2s ease-out`. Slide `0.3s ease-out`. Close `0.2s`. | no | Parallel to cake& Modal with different distance and timing. |
| `Modal.tsx` | Dialog (TS copy) | css-keyframes, css-transition | Same family as `Modal.js` | Fade `0.2s ease-out`. Slide `0.3s ease-out`. Button `background-color 0.2s ease`. | no | Second legacy modal file. |
| `Dropdown.tsx` | Menu reveal | css-keyframes, css-transition | Panel opacity and `translateY(-8px)`. Trigger `transition: all`. | `slideDown 0.2s ease-out`. Trigger `0.2s ease-in-out`. | no | cake& Dropdown does not animate the panel. |
| `DropdownButton.tsx` | Split button menu | css-keyframes, css-transition | Panel `slideDown`. Trigger background, transform, shadow. | Panel `0.2s ease-out`. Trigger `200ms ease-in-out`. Press sets `transform` transition to `0s`. | no | |
| `Spinner.js` | Loading ring | css-keyframes | `rotate` | `0.8s linear infinite` | yes | `animation: none`. cake& Spinner is `900ms`. |
| `Slider.js` | Range | css-transition | Fill `width` when not dragging. Thumb `transform`. Track and labels are color only. | Fill `width 0.1s ease` plus `background-color 0.2s`. Thumb `transform 0.2s ease` when not dragging, `none` while dragging. | no | Width animation. Thumb `left` is set as a percentage and is not in the transition list. |
| `Tooltip.js` | Show and hide | css-transition | Opacity and visibility | `0.2s ease-in-out` | no | cake& tooltips use keyframes at `120ms` and `160ms`. |
| `Accordion.js` | Disclosure chrome | css-transition | Border, background, chevron `transform`. Content uses `transition: all`. | `200ms ease-in-out` | no | Does not animate height with keyframes. Different model from cake& Accordion. |
| `ai/ShimmerThinkingIndicator.js` | "Thinking" text | css-keyframes | `background-position` | `2s linear infinite` | yes | `animation: none` and a static color. Continuous paint. |
| `InteractiveGrid.js` | Decorative grid | css-keyframes, css-transition | Grid `translateY` loop. Dots `transition: all` and scale. | Grid `20s ease-in-out infinite`. Dots `0.1s` and `0.3s ease-out`. | no | Imported by `backup/InteractiveGridPage.js` only. |

### Color and `transition: all`

No reduced-motion query unless noted. `transition: all` will also interpolate layout properties if those properties change, even when the visible intent is a color fade.

| File | Timing in source | Notes |
| --- | --- | --- |
| `Button.js` | `all 0.2s ease-in-out` | |
| `Badge.js` | `all 0.2s ease-in-out` | |
| `Breadcrumb.js` | `all 0.2s ease-in-out` | |
| `Card.js` | `all 0.2s ease` | |
| `Checkbox.js` | `all 0.2s ease` on the control. Opacity and color `0.2s ease` on marks. | |
| `Chip.js` | `all 0.2s ease-in-out` | |
| `Input.js` | `all 0.2s ease` | |
| `Pin.js` | `all 0.2s ease-in-out`. Opacity and color `0.2s`. | |
| `Radio.js` | `all 0.2s ease-in-out` and `all 0.3s ease-out` on inner marks | |
| `SearchBar.js` | `all 0.2s ease` | |
| `SegmentedControl.js` | `all 0.15s ease-in-out`. Icon opacity `0.2s ease`. | |
| `Tab.js` | `background-color`, `color`, border `0.2s ease` | |
| `TextArea.tsx` | `border-color`, `background-color` `0.15s ease-in-out` | |
| `TextField.tsx` | `border-color`, `background-color` `0.15s ease-in-out` | |
| `Toggle.js` | Opacity, background, color `0.2s ease`. Thumb `all 0.2s ease`. | |
| `ToggleGroup.tsx` | `all 0.15s ease-in-out` | |
| `Menu.tsx` | `background-color`, `color` `0.15s ease-in-out` | |
| `ColorBlock.js` | `opacity 0.2s ease-in-out` | |
| `Link.js` | `color 0.2s ease-in-out` | yes — `transition: none` |
| `ai/AiResponse.js` | Background, color, opacity `0.2s ease` | |
| `ai/AiChatInput.js` | Border, background `0.2s ease` | |
| `ai/AiTextField.js` | `border-width`, border-color, background `0.2s ease` | Animates `border-width` (layout) |
| `ai/AiRecommendedPrompts.js` | Background and opacity `0.2s ease` | |
| `ai/UserResponse.js` | Background, color, opacity `0.2s ease` | |
| `ai/RegenerateActionButton.js` | Background, color, opacity `0.2s ease` | |

## 6. Documentation site chrome and pages

| File | Purpose | Type | What moves | Timing in source | Reduced motion | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `src/pages/HomePage.jsx` | Live home | css-keyframes, js | Cursor opacity blink. Hero characters revealed by React state. | Cursor `1s step-end infinite`. Typewriter `WORD_MS = 90`. | yes | CSS and `matchMedia`. Reduced motion shows the full sentence and stops the blink. This is the live home, not `src/pages/Home.js`. |
| `src/pages/Home.js` | Older home | css-transition | Card or link `transition: all` | `0.2s ease-in-out` | no | Not on the route table. Mounts `AuroraBackground`. |
| `src/pages/CanvasPage.js` | Older canvas page | css-transition | `transition: all` | `0.1s ease-in-out` | no | Not on the route table. |
| `src/pages/ArchivePage.js` | Older archive | css-transition | Background and border | `0.15s` | no | Not on the route table. |
| `src/pages/subsystems/ai/CakeAiPage.js` | Older AI page | css-transition | Opacity | `0.2s ease` | no | Not on the route table. |
| `src/pages/components/datavisCharts.js` | Embedded chart previews | js | ECharts `animation: false` | none | n/a | Static frames on the components catalog. |
| `src/pages/sound/SoundPage.jsx` | Sound docs | js | `requestAnimationFrame` sets copy-toast open | next frame | n/a | Not a visual motion curve. Playback is audio. |
| `src/components/AuroraBackground.js` | Ambient blobs | css-keyframes | `rotate` and `scale` on blurred circles | `20s ease-in-out infinite` | no | Only imported by unrouted `Home.js`. Continuous. |
| `src/components/Navigation.js` | Older sidebar | css-transition | `transition: all` on the panel. Off-canvas `left`. Submenu `max-height`. Chevron `transform`. Row background and color. | Panel `0.5s ease`. `left 0.3s ease`. `max-height 0.3s ease-out`. Chevron `0.3s ease`. Rows `0.2s`. | no | No imports from current pages. `transition: all` and `max-height` are the costly parts. |
| `src/components/RotatingHeadline.js` | Word carousel | css-keyframes, js | `rotateX`, `translateY`, opacity. Interval in the component. | Default `1s cubic-bezier(0.4, 0, 0.2, 1)`. | yes | CSS `animation: none` and a `matchMedia` guard that skips the interval. No current-page imports found. |
| `src/components/RotatingText.js` | Word roll | css-keyframes, js | `translateY`, `rotateX` | `1s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Default interval `2000`. | no | No current-page imports found. |
| `src/components/TopNav.jsx` | Live header | — | — | — | n/a | No `transition` or `animation` rules. Listed so the shell is not assumed to animate. |
| `backup/InteractiveGridPage.js` | Backup page | css-keyframes (in a code sample string) | Documents a `20s` grid animation | `20s ease-in-out infinite` inside a template string | no | The running grid is `InteractiveGrid.js`. |

`src/App.js` shell (scroll reset, footer) has no transition or keyframe. Route changes are instant.

## 7. Chart tool

### Shared helper

| File | Purpose | Type | What moves | Timing in source | Reduced motion | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `chart-tool-echarts/src/charts/options/common.ts` | ECharts entrance gate | js | Series entrance, library-defined | `animationDuration: 600`, `animationEasing: 'cubicOut'`, `animationDelay` `(idx) => idx * 40` | yes | `reducedMotion()` uses `matchMedia`. Also off when `ctx.staticFrame` is set. |

### Option files that spread `animationOpts(ctx)`

Same motion as the helper. They do not declare a second duration.

`bar.ts`, `bullet.ts`, `funnel.ts`, `heatmap.ts`, `jitter.ts`, `line.ts`, `pie.ts`, `posNeg.ts`, `radar.ts`, `radialBar.ts`, `scatter.ts`, `treemap.ts`, `waterfall.ts`.

Exceptions inside that set:

| File | Notes |
| --- | --- |
| `chart-tool-echarts/src/charts/options/gauge.ts` | Spreads `animationOpts` and also sets `animation: false` on some series (lines 44 and 76). |
| `chart-tool-echarts/src/charts/options/map.ts` | Spreads `animationOpts` and sets `animation: false` on one layer (line 546). |

### Chrome CSS and drag

| File | Purpose | Type | What moves | Timing in source | Reduced motion | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `chart-tool-echarts/src/styles.css` | Playground chrome | css-transition, css-keyframes | Background, color, border, box-shadow. Press `transform` scale. Catalog overlay opacity. Catalog panel opacity, `translateY(8px)`, `scale(0.98)`. | `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` on `:root`. Press scale `0.14s var(--ease-out)` beside `0.15s` color fades. Some panels use `0.3s ease` or `0.12s`. `catalog-fade 0.15s`. `catalog-pop 0.18s`. | partial | The `reduce` block removes press scale on `.btn`, `.seg__btn`, `.icon-btn`, and `.token-row`, and narrows their transition to `background 0.12s, border-color 0.12s, color 0.12s`. Catalog keyframes are not in that block. |
| `chart-tool-echarts/src/panel/controls/SortableRows.tsx` | Reorder rows | js | dnd-kit `transform` and `transition`. Opacity `0.6` while dragging. | Library default transition string | no | No reduced-motion check. |

## 8. Not UI motion

| File | Why it showed up | Notes |
| --- | --- | --- |
| `src/data/sound-library.generated.json` and sound catalog modules | `durationMs` | Audio asset length. |
| `src/pages/sound/SoundWaveform.jsx` (static marks) | SVG | No animation rules found on the waveform. |
| `src/cakeand/components/FileUpload/FileUpload.tsx` accept string | `.gif` | File-type filter, not a GIF animation. |
| `.agents/skills/emil-design-eng/SKILL.md` | Discusses motion and shows a framer-motion import in prose | Reviewer guidance. Not loaded by the app. |
| `src/cakeand/components/Accordion/Accordion.stories.tsx` | Docs text | States that open/close animation respects `prefers-reduced-motion`. |
| `src/cakeand/components/Progress Indicators/Spinner.stories.tsx` | Docs text | States that spin stops under `prefers-reduced-motion: reduce`. |
| `src/cakeand/components/Elements/Scrollbar.stories.tsx` | Docs text | States that the thumb transition respects `prefers-reduced-motion`. |

## 9. Files that are not a motion system

No shared module exists under `src/cakeand/` for duration, easing, or reduced motion. The only shared runtime helpers are:

- `animationOpts` and `reducedMotion` in `chart-tool-echarts/src/charts/options/common.ts`
- `--ease-out` in `chart-tool-echarts/src/styles.css`

cake& repeats literal times in each styled component. Legacy components repeat a different set of literals, often `0.2s` and often `transition: all`.
