import React from 'react';
import type { Preview, Decorator } from '@storybook/react-vite';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

import { CakeProvider } from '../src/hellopc/theme/HellopcProvider';
import { themes, type ThemeMode } from '../src/hellopc/tokens/theme';
import {
  cakeManagerThemes,
  resolveManagerThemeKey,
} from './hellopc-manager-themes';

// Always load tokens + fonts in the preview iframe — pure MDX docs pages do
// not run story decorators, so CakeProvider never mounts for Introduction /
// Foundations / hello pc Maintenance unless we import these here.
import '../src/hellopc/tokens/hellopc-vars.css';
import '../src/hellopc/theme/fonts.css';

/**
 * Toolbar values are URL-safe (`light` / `dark` / `hct`). Map them onto the
 * real hello pc ThemeMode strings used by tokens + `data-theme`.
 */
const TOOLBAR_TO_MODE: Record<string, ThemeMode> = {
  light: 'light.a',
  dark: 'dark.a',
  hct: 'win hct',
  // tolerate legacy / direct values
  'light.a': 'light.a',
  'dark.a': 'dark.a',
  'win hct': 'win hct',
};

const DEFAULT_THEME_GLOBAL = 'light';

const resolveMode = (raw: unknown): ThemeMode => {
  if (typeof raw === 'string' && TOOLBAR_TO_MODE[raw]) return TOOLBAR_TO_MODE[raw];
  return 'light.a';
};

const applyHtmlDataTheme = (raw: unknown) => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', resolveMode(raw));
};

// Keep <html data-theme> in sync even when no decorator / DocsContainer mounts
// (story canvas ↔ docs navigations, first paint on MDX-only entries).
addons.getChannel().on(GLOBALS_UPDATED, ({ globals }) => {
  applyHtmlDataTheme(globals?.theme);
});

/**
 * Docs (including pure MDX) — Storybook's TOC / prose chrome reads Emotion
 * colors from the docs ThemeProvider. Pass our cake manager themes so the
 * outline panel and docs chrome follow the Theme toolbar.
 *
 * Do NOT call `useGlobals()` here: Storybook preview hooks are only valid
 * inside decorators and story functions. DocsContainer is neither — calling
 * them throws "Storybook preview hooks can only be called inside decorators
 * and story functions" on the deployed docs pages. Read theme from the
 * channel / store instead.
 *
 * Seed from the *live* store (not only initialGlobals). Pure MDX pages remount
 * DocsContainer on navigation; seeding from initialGlobals would force light
 * and wipe a Dark/HCT toolbar choice that CSF stories recover via withTheme.
 */
const readLiveThemeGlobal = (context: DocsContainerProps['context']): unknown => {
  const store = (
    context as {
      store?: {
        userGlobals?: { globals?: Record<string, unknown> };
        globals?: { globals?: Record<string, unknown> };
      };
    }
  ).store;
  return (
    store?.userGlobals?.globals?.theme ??
    store?.globals?.globals?.theme ??
    (context.projectAnnotations?.initialGlobals as { theme?: unknown } | undefined)?.theme ??
    DEFAULT_THEME_GLOBAL
  );
};

const CakeDocsContainer = ({ children, context }: DocsContainerProps) => {
  const [themeGlobal, setThemeGlobal] = React.useState<unknown>(() =>
    readLiveThemeGlobal(context),
  );

  React.useEffect(() => {
    // Re-sync once on mount in case the store was ready after first paint.
    setThemeGlobal(readLiveThemeGlobal(context));

    const onGlobals = (payload: { globals?: Record<string, unknown> }) => {
      if (payload?.globals && 'theme' in payload.globals) {
        setThemeGlobal(payload.globals.theme);
      }
    };
    context.channel.on(GLOBALS_UPDATED, onGlobals);
    return () => {
      context.channel.off(GLOBALS_UPDATED, onGlobals);
    };
  }, [context, context.channel]);

  const managerKey = resolveManagerThemeKey(themeGlobal);
  const mode = resolveMode(themeGlobal);

  React.useLayoutEffect(() => {
    applyHtmlDataTheme(mode);
  }, [mode]);

  return (
    <DocsContainer context={context} theme={cakeManagerThemes[managerKey]}>
      {children}
    </DocsContainer>
  );
};

/**
 * Theme CSF stories without letting every story's CakeProvider fight over
 * `<html data-theme>` (docs pages mount many decorated blocks; their
 * cleanups were restoring a stale attribute and breaking the toolbar).
 *
 * - One layout-effect writes `data-theme` on `<html>` (no restore-on-unmount).
 * - CakeProvider uses `scope="subtree"` + `globalStyles={false}` so it only
 *   supplies the styled-components theme / a local data-theme wrapper, and
 *   does not paint `body` (which was fighting Storybook's docs chrome).
 */
const withTheme: Decorator = (Story, context) => {
  const mode = resolveMode(context.globals.theme);
  const canvas = themes[mode].color.surfaces.canvas;
  const isDocs = context.viewMode === 'docs';

  React.useLayoutEffect(() => {
    applyHtmlDataTheme(mode);
  }, [mode]);

  return (
    <CakeProvider mode={mode} scope="subtree" globalStyles={false}>
      <div
        data-theme={mode}
        style={{
          background: canvas,
          color: themes[mode].color.textIcon.primary,
          width: '100%',
          alignSelf: 'stretch',
          minHeight: isDocs ? 'auto' : '100vh',
          padding: isDocs ? '1.5rem' : '2rem',
          boxSizing: 'border-box',
        }}
      >
        <Story />
      </div>
    </CakeProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      description:
        'hello pc theme mode — sets data-theme on the preview <html> and the ' +
        'styled-components theme (light.a / dark.a / win hct).',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light A', icon: 'sun' },
          { value: 'dark', title: 'Dark A', icon: 'moon' },
          { value: 'hct', title: 'Windows HCT', icon: 'accessibility' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },

  parameters: {
    layout: 'centered',
    docs: {
      container: CakeDocsContainer,
      toc: { headingSelector: 'h2, h3' },
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Elevation', 'Special Surfaces'],
          'Components',
          'Elements',
          'hello pc Maintenance',
          ['Building a Component', 'Shipping a Component'],
        ],
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;
