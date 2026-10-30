import type { StorybookConfig } from '@storybook/react-vite';

/**
 * Storybook configuration for the hello pc.
 *
 * Builder: Vite (independent of the app's Create React App build). This keeps
 * dev/HMR fast while the design-system components (styled-components, MUI icons,
 * JSON tokens, mixed .js/.tsx) render exactly as they do in the app.
 */
const config: StorybookConfig = {
  stories: [
    // hello pc only — the new design system. Foundations/guides first, then components.
    '../src/hellopc/foundations/**/*.mdx',
    '../src/hellopc/**/*.mdx',
    '../src/hellopc/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Hide the Storybook onboarding checklist widget in the sidebar.
  features: {
    sidebarOnboardingChecklist: false,
  },

  // Serve Rookery fonts + favicon only — never the whole `public/` tree.
  // Copying `public/` wholesale overwrites Storybook's manager `index.html`
  // with the CRA SPA shell (and drops CNAME / 404.html into the SB output).
  staticDirs: [
    { from: '../public/fonts', to: '/fonts' },
    { from: '../public/favicon.svg', to: '/favicon.svg' },
  ],

  // react-docgen reads BOTH JS PropTypes and TS prop types, which is required
  // for this mixed .js/.tsx codebase to get auto-generated props tables.
  typescript: {
    reactDocgen: 'react-docgen',
  },

  docs: {
    // Components opt into an auto-generated docs page via `tags: ['autodocs']`.
    defaultName: 'Docs',
  },

  async viteFinal(config, { configType }) {
    const { mergeConfig, transformWithEsbuild } = await import('vite');
    const isProd = configType === 'PRODUCTION';
    // Pages nests the static build at cake.lenovo.com/storybook/. Prefer
    // STORYBOOK_BASE from deploy.yml so CI matches local PRODUCTION builds;
    // never reuse CRA's PUBLIC_URL (that would prefix the main site too).
    const storybookBase =
      process.env.STORYBOOK_BASE || (isProd ? '/storybook/' : '/');
    const normalizedBase = storybookBase.endsWith('/')
      ? storybookBase
      : `${storybookBase}/`;

    return mergeConfig(config, {
      // Nested under the design-system Pages site at cake.lenovo.com/storybook.
      // Dev (`npm run storybook`) stays at `/`; only the static build uses the
      // subpath so asset URLs resolve under GitHub Pages.
      base: isProd ? normalizedBase : '/',
      // Vite's default `publicDir: 'public'` would copy the CRA SPA shell
      // (index.html, 404.html, CNAME) over Storybook's manager output. Fonts
      // and the favicon are already served via `staticDirs` above.
      publicDir: false,
      plugins: [
        {
          // This design system authors JSX inside plain `.js` files (a
          // Create React App convention). Vite/esbuild only treats .jsx/.tsx
          // as JSX, so we transform src/*.js through esbuild's JSX loader.
          name: 'cake:load-src-js-as-jsx',
          enforce: 'pre',
          async transform(code: string, id: string) {
            const file = id.split('?')[0];
            if (!file.includes('/src/') || !file.endsWith('.js')) return null;
            return transformWithEsbuild(code, id, {
              loader: 'jsx',
              jsx: 'automatic',
            });
          },
        },
      ],
      optimizeDeps: {
        esbuildOptions: {
          loader: { '.js': 'jsx' },
        },
      },
      define: {
        // Several components (e.g. src/tokens/colorTokens.js) reference
        // process.env.NODE_ENV. Vite does not expose `process` in the browser,
        // so define it to avoid a "process is not defined" runtime error.
        'process.env.NODE_ENV': JSON.stringify(
          isProd ? 'production' : 'development'
        ),
        // Site roots at cake.lenovo.com — leave empty so nav helpers that build
        // `${PUBLIC_URL}/storybook/` do not become `/storybook/storybook/`.
        'process.env.PUBLIC_URL': JSON.stringify(''),
      },
      // Windows often locks binary assets under src/assets; Vite's native
      // watcher then crashes with EBUSY. hello pc Storybook does not HMR those
      // files, so skip them (and fall back to polling for everything else).
      server: {
        watch: {
          ignored: [
            '**/src/assets/**',
            '**/node_modules/**',
            '**/.git/**',
          ],
          usePolling: process.platform === 'win32',
          interval: 1000,
        },
      },
    });
  },
};

export default config;
