# hello pc prototype

A ready-to-run Vite + React + TypeScript app wired to the hello pc design system.
**No GitHub token, no `.npmrc`, no registry setup.**

You need [Node.js](https://nodejs.org/) (LTS). That gives you `npm`. Open a
terminal and run the steps below. A slower, plain-language walkthrough is on
the Storybook [Introduction](https://cake.lenovo.com/storybook/?path=/docs/introduction--docs).

## Start

```bash
npx degit cake-admin/cakev2/starter my-prototype
cd my-prototype
npm install
npm run dev
```

If `degit` gives you trouble (it is unmaintained), either of these works:

```bash
npx giget@latest gh:cake-admin/cakev2/starter my-prototype
git clone --depth 1 https://github.com/cake-admin/cakev2 && cp -r cakev2/starter my-prototype
```

## What is already wired up

- **`CakeProvider`** mounted once in `src/App.tsx`, with a working theme toggle.
- **Design tokens** — ~470 CSS custom properties, live, theme-aware.
- **Rookery New** loaded from the package. No font setup.
- **63 components**, imported from one path.
- **Agent context** in `context/` so Claude Code and Cursor know the real API
  instead of guessing at it. See [AGENTS.md](AGENTS.md).

## Working with a coding agent

Point it at this folder and ask for what you want — "build a settings page with
tabs, a table, and a save button". It reads `AGENTS.md` and `context/` and builds
from real hello pc components with real tokens.

## Updating hello pc

```bash
npm run hellopc:update
```

This resolves the newest release and pins its exact version. The dependency is a
version-specific URL on purpose — a "always latest" URL would silently fail to
update, then break `npm ci` with an integrity error. `scripts/update-hellopc.mjs`
explains the full reasoning.

## Adding hello pc to an app you already have

```bash
npm install https://github.com/cake-admin/cakev2/releases/download/v4.2.4/cake-admin-cakeand-4.2.4.tgz
npm install react react-dom styled-components radix-ui lucide-react
```

The current kit is
[v4.2.4](https://github.com/cake-admin/cakev2/releases#release-v4.2.4).

Then copy three things from this starter, all of which matter:

1. `resolve.dedupe` from `vite.config.ts`
2. the explicit `import '@cake-admin/cakeand/cakeand.css'` in `src/main.tsx`
3. `data-theme` on `<html>` in `index.html`

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Everything unstyled, every token an empty string | The hello pc stylesheet did not load. Check the `@cake-admin/cakeand/cakeand.css` import at the top of `src/main.tsx`. |
| Your CSS cannot override a hello pc value | Import order. Your stylesheets must come *after* the hello pc one in `src/main.tsx`. |
| Components render but ignore the theme | Two copies of `styled-components`. Check `npm ls styled-components`; `resolve.dedupe` in `vite.config.ts` should prevent it. |
| Flash of the wrong theme on load | `data-theme` in `index.html` disagrees with `mode` in `src/App.tsx`. |
| `npm error EINTEGRITY` | A lockfile pinned to a tarball whose bytes changed. Delete `package-lock.json` and run `npm run hellopc:update`. |
| npm fails oddly on Windows | An `&` in your folder path breaks npm's `.bin` shims. Rename the folder — `Q3 Concepts & Ideas` will not work. |
| A component you need does not exist | Check `context/hellopc-components.md`. If it genuinely is not there, raise it against `cake-admin/cakev2` rather than hand-rolling one. |

Use **npm**. pnpm and yarn will resolve the URL dependency, but their layouts
interact differently with `radix-ui`'s peer graph and are not tested here.

## Documentation

Live Storybook — every component, its props, variants, and accessibility
contract: <https://cake.lenovo.com/storybook/>
