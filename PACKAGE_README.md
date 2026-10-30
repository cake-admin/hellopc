# @cake-admin/cakeand

The hello pc design system — React components, design tokens, and theming.

Published from [`cake-admin/cakev2`](https://github.com/cake-admin/cakev2).
Component documentation lives in the Storybook at
<https://cake.lenovo.com/storybook/>, which is the canonical source of truth for
every component's API, variants, states, and accessibility contract.

## Quickest start: the template

```bash
npx degit cake-admin/cakev2/starter my-prototype
cd my-prototype && npm install && npm run dev
```

A Vite + React + TypeScript app with the provider, tokens, fonts, theming and
coding-agent context already wired up. Nothing to configure.

## Install

### From a GitHub Release — no token needed

The repository is public, so npm can fetch the tarball directly. No `.npmrc`, no
personal access token, nothing to set up.

Take the `.tgz` URL from the current release —
<https://github.com/cake-admin/cakev2/releases#release-v4.2.4> — and install it:

```bash
npm install https://github.com/cake-admin/cakev2/releases/download/v4.2.4/cake-admin-cakeand-4.2.4.tgz
```

Always install a **version-specific** URL, never one that resolves to "latest".
npm records a checksum of the exact tarball bytes in your lockfile, so a URL
whose contents change will first silently fail to update, then break `npm ci`
with an integrity error that is hard to trace back.

Upgrading later is the same command with the newer version's URL.

Note that `npm outdated` will not report new versions of this package — it
compares against a registry, and this installs from a URL. Start from
<https://github.com/cake-admin/cakev2/releases#release-v4.2.4>.

### Peer dependencies

Install these alongside it — they are intentionally *not* bundled, so your app
owns a single copy of each:

```bash
npm install react react-dom styled-components radix-ui lucide-react
```

> `styled-components` **must** resolve to a single instance. Two copies in one
> app means two separate stylesheets and theme contexts, and components silently
> lose their theme.

In Vite, make that explicit — it costs nothing and the failure is silent:

```ts
export default defineConfig({
  resolve: { dedupe: ['styled-components', 'react', 'react-dom'] },
});
```

Requires React 18 or 19 (verified against both).

## Usage

Wrap your app **once** in `CakeProvider`. That is the whole setup — there is no
separate CSS import and no font wiring:

```tsx
import { CakeProvider, Card, HeroCard, Button } from '@cake-admin/cakeand';

export default function App() {
  return (
    <CakeProvider mode="light.a">
      <Card>
        <HeroCard
          title="Hello"
          body="Composed from hello pc components."
          actions={<Button size="lg">Get started</Button>}
        />
      </Card>
    </CakeProvider>
  );
}
```

`CakeProvider` does three things:

1. sets `data-theme` on `<html>`, which activates the CSS custom properties
   (`--color-*`, `--space-*`, `--radius-*`, …);
2. provides the styled-components theme for the parts that read `props.theme`;
3. loads the Rookery New fonts and the global baseline.

### Theming

```tsx
<CakeProvider mode="dark.a">…</CakeProvider>
```

Modes: `light.a` (default), `dark.a`, `win hct`.

The attribute goes on `<html>` deliberately. Several components — `Modal`,
`Dropdown`, both tooltips, `Breadcrumb`, `NumberDropdown`, `Pagination` — render
through a Radix **portal** into `document.body`, outside your React tree. If the
theme attribute lived on a wrapper `<div>`, those portalled surfaces would escape
it and fall back to the light theme. Pass `scope="subtree"` to opt out and theme
only the provider's children (portals will then be unthemed).

Because the attribute is applied in a layout effect, the first paint uses the
default (light) values. If your app boots dark, also set `data-theme` on `<html>`
in your HTML shell to avoid the flash.

## What's included

63 components, including:

- **Actions** — Button, IconButton, Chip
- **Surfaces** — Card (+ Hero / Content / Simple card templates), Modal, Toast,
  Notification, Tooltip
- **Data** — Table (+ Action Bar, Header Row, Data Row), Pagination, Badge,
  Counter, Avatar
- **Navigation** — Sidebar, vertical & horizontal Tabs, Breadcrumb, Content
  Switcher, Accordion
- **Forms** — TextInput, PasswordInput, NumberInput, PinInput, DateInput,
  TimeInput, Checkbox, Radio, Switch, Slider, Dropdown, FileUpload

Interactive components wrap Radix primitives, so behaviour and accessibility
(roles, keyboard, focus management) come from Radix; hello pc owns the visuals.
Every value resolves from design tokens — nothing is hardcoded.

### Package layout

After install, `node_modules/@cake-admin/cakeand/` contains:

| Path | Purpose |
|------|---------|
| `index.js` | Runtime components (`import { Button } from '@cake-admin/cakeand'`) |
| `cakeand.css` | Tokens, fonts, baseline (imported by the entry) |
| `types/components`, `types/tokens`, `types/theme` | TypeScript declarations |
| `stories/` | Storybook `*.stories.tsx` sources (e.g. `Button/Button.stories.tsx`) — for agents and reference; **do not import into app code** |
| `context/` | Generated markdown agents should read (`hellopc-components.md`, `components/*.md`, tokens) |

`stories/` and `context/` are documentation for coding agents. They are not part
of the runtime API.

## TypeScript

Types ship with the package, including per-prop documentation and defaults.
Importing the types directly is supported:

```ts
import type { ButtonProps, CardElevation, ThemeMode } from '@cake-admin/cakeand';
```
