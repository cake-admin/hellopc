# hello pc

Lenovo's design system: React components, design tokens, and three themes
(Light A, Dark A, Windows HCT). Every interactive component wraps a
[Radix](https://www.radix-ui.com/primitives) primitive, so behaviour and
accessibility come from Radix and hello pc owns the visuals. Every value resolves
from a design token — nothing is hardcoded.

**Live site:** <https://cake.lenovo.com/>  
**Documentation:** <https://cake.lenovo.com/storybook/> — the source of truth for
every component's API, variants, states, and accessibility contract.  
**Data viz playground:** <https://cake.lenovo.com/datavis/>  
**Figma community:** <https://www.figma.com/community/file/1667712364680681509/lenovo-cake-1-0>

---

## Use it

You need [Node.js](https://nodejs.org/) (the LTS build). That installs the
`npm` command. Then open a terminal and follow the steps. A longer,
designer-oriented walkthrough lives on the Storybook
[Introduction](https://cake.lenovo.com/storybook/?path=/docs/introduction--docs).

### Starting a new prototype (recommended)

**1.** Copy the starter onto your machine (pick any folder name instead of
`my-prototype`):

```bash
npx degit cake-admin/cakev2/starter my-prototype
```

**2.** Go into the folder, install, and open the local preview:

```bash
cd my-prototype
npm install
npm run dev
```

You get a Vite + React app with hello pc already wired (theme, fonts, components).
**No GitHub token and no `.npmrc`.** If the first command fails, see
[Getting Started](https://cake.lenovo.com/storybook/?path=/docs/getting-started--docs)
for backups (`giget`, or copy the `starter/` folder from a clone).

<details>
<summary>What is <code>npx degit</code>?</summary>

`npx` runs a helper once, without installing it forever. `degit` copies files
from GitHub **without** git history.

So that command means: *download just the starter project into `my-prototype`.*
You are not forking this whole repository.

</details>

### Adding hello pc to an existing app

If a developer already has a React project, install the **release file**
(`.tgz`) from [v4.2.4](https://github.com/cake-admin/cakev2/releases#release-v4.2.4)
— still no login:

```bash
npm install https://github.com/cake-admin/cakev2/releases/download/v4.2.4/cake-admin-cakeand-4.2.4.tgz
npm install react react-dom styled-components radix-ui lucide-react
```

Then wrap the app **once** in
`CakeProvider`. The starter already has the three easy-to-miss pieces
(`styled-components` dedupe, the hello pc CSS import, and `data-theme` on
`<html>`). Copy those from `starter/` or follow
[Getting Started](https://cake.lenovo.com/storybook/?path=/docs/getting-started--docs).

```tsx
import { CakeProvider, Card, HeroCard, Button } from '@cake-admin/cakeand';

<CakeProvider mode="light.a">
  <Card>
    <HeroCard title="Hello" actions={<Button size="lg">Get started</Button>} />
  </Card>
</CakeProvider>;
```

New components show up in Storybook as soon as they merge to `main`. They show
up in this install **only after someone publishes a package version**.

### Prototyping with AI agents

[`cake-admin/ai-lab`](https://github.com/cake-admin/ai-lab) is a Lenovo-internal
workspace (Cursor / Claude Code skills plus hello pc). Clone it and ask for a
prototype; it installs hello pc for you. Access is restricted — ask the hello pc
team.

---

## Updating

A new hello pc version does **not** appear in your prototype by itself. Each
project pins one exact version:

| Your project | What to run |
|---|---|
| Started from the starter | `npm run hellopc:update` |
| A prototype inside ai-lab | `node scripts/install-cake.mjs prototypes/<name>` |
| Your own app | `npm install` with the newer release's `.tgz` URL |

`npm outdated` will not notice a new hello pc — this package is not installed from
the public npm registry. Start from the current kit,
[v4.2.4](https://github.com/cake-admin/cakev2/releases#release-v4.2.4), or run
the update command now and then.

Pinning an exact file is deliberate: if the file behind one URL kept changing,
installs would eventually fail with a hard-to-debug integrity error.

---

## What's in this repo

| Path | What |
|------|------|
| `src/hellopc/` | The design system — the only thing that ships in the package |
| `src/hellopc/foundations/` | Storybook docs (Introduction, Foundations, hello pc Maintenance) |
| `src/pages/` | Marketing site (Home, Resources, foundations/components demos) |
| `starter/` | The template designers scaffold from |
| `scripts/` | Token generation, package build, agent-context generation |
| `chart-tool-echarts/` | hello pc data visualization playground (Vite app at `/datavis`) |
| `.storybook/` | Storybook config for the hello pc component library |

Building components and publishing versions is the design-system team's
workflow, documented in Storybook under **hello pc Maintenance** — *Building a
Component* and *Shipping a Component*. Agent conventions live in
[AGENTS.md](AGENTS.md).

---

## Deploying the site (GitHub Pages)

The live site (and Storybook + datavis) is published by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push
to `main` (or via **Actions → Deploy to GitHub Pages → Run workflow**).

**Pages source must be GitHub Actions**, not “Deploy from a branch”. In the
repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

| What ships | How |
|------------|-----|
| Main CRA site | `npm run build` |
| Storybook at `/storybook/` | `postbuild` → `nest-storybook.mjs` |
| Datavis at `/datavis/` | Separate CI steps: install + Vite build in `chart-tool-echarts/`, then `node scripts/nest-datavis.mjs` |

Root `npm run build` / `npm run deploy` (`gh-pages`) build **only** the CRA
site + Storybook. They do **not** build or nest `chart-tool-echarts`. If you
deploy that way (or from a branch without the workflow), `/datavis` will be
missing.

After a successful Actions run, open the workflow summary → artifact /
Pages URL and confirm `datavis/` is present. Live URLs:

- Custom domain: https://cake.lenovo.com/datavis/
- Default Pages host: `https://<owner>.github.io/<repo>/datavis/` (only if
  that is how Pages is configured; this repo uses the custom domain)

To nest datavis into a local `build/` after building the playground yourself:

```bash
# from chart-tool-echarts: tsc + vite build (see that folder's README)
npm run nest:datavis
```

---

## License

Internal Lenovo design system. The published package declares `UNLICENSED`.
Rookery New is an open-source but **protected** font — it ships with hello pc for
Lenovo use and is not licensed for unrestricted redistribution outside that
context.
