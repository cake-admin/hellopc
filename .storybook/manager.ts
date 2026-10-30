import { addons } from 'storybook/manager-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

import {
  cakeManagerThemes,
  resolveManagerThemeKey,
  type CakeManagerThemeKey,
} from './hellopc-manager-themes';

/**
 * hello pc Storybook manager chrome — fully re-themes with the preview Theme
 * toolbar (light / dark / hct), so the whole screen follows hello pc tokens.
 */

/** Selected / hover tokens for manager-head.html (solid fills, mode-aware). */
const ROW: Record<
  CakeManagerThemeKey,
  { selectedBg: string; selectedFg: string; hoverBg: string; primary: string; text: string; textMuted: string; border: string; container: string; canvas: string }
> = {
  light: {
    selectedBg: '#f0efff',
    selectedFg: '#132384',
    hoverBg: '#e8eafc',
    primary: '#394edb',
    text: '#25262d',
    textMuted: '#44464e',
    border: '#e3e3e3',
    container: '#ffffff',
    canvas: '#f9f9f9',
  },
  dark: {
    selectedBg: '#34376a',
    selectedFg: '#dee0ff',
    hoverBg: '#2a2d4a',
    primary: '#bcc3ff',
    text: '#ffffff',
    textMuted: '#c6c6cf',
    border: '#5e5e5e',
    container: '#25262d',
    canvas: '#121318',
  },
  hct: {
    selectedBg: '#8ee3f0',
    selectedFg: '#263b50',
    hoverBg: '#2a2a2a',
    primary: '#8ee3f0',
    text: '#ffffff',
    textMuted: '#ffffff',
    border: '#ffffff',
    container: '#202020',
    canvas: '#202020',
  },
};

const applyManagerChrome = (
  key: CakeManagerThemeKey,
  api?: { setOptions: (o: object) => void },
) => {
  const theme = cakeManagerThemes[key];
  if (api) api.setOptions({ theme });
  else addons.setConfig({ theme });

  const root = document.documentElement;
  const row = ROW[key];
  root.dataset.cakeManager = key;
  root.style.colorScheme = key === 'light' ? 'light' : 'dark';
  // Mirror cake-vars selectors so preview-adjacent CSS can key off the same attr.
  root.setAttribute(
    'data-theme',
    key === 'light' ? 'light.a' : key === 'dark' ? 'dark.a' : 'win hct',
  );

  root.style.setProperty('--cake-sb-selected-bg', row.selectedBg);
  root.style.setProperty('--cake-sb-selected-fg', row.selectedFg);
  root.style.setProperty('--cake-sb-hover-bg', row.hoverBg);
  root.style.setProperty('--cake-sb-primary', row.primary);
  root.style.setProperty('--cake-sb-text', row.text);
  root.style.setProperty('--cake-sb-text-muted', row.textMuted);
  root.style.setProperty('--cake-sb-border', row.border);
  root.style.setProperty('--cake-sb-container', row.container);
  root.style.setProperty('--cake-sb-canvas', row.canvas);
};

addons.setConfig({
  theme: cakeManagerThemes.light,
  sidebar: { showRoots: true },
});

applyManagerChrome('light');

addons.register('cake/manager-theme', (api) => {
  const sync = (payload?: { globals?: Record<string, unknown> }) => {
    const raw = payload?.globals?.theme ?? api.getGlobals()?.theme;
    applyManagerChrome(resolveManagerThemeKey(raw), api);
  };

  sync();
  api.on(GLOBALS_UPDATED, sync);
});

/**
 * Chrome steals Ctrl/Cmd+K for the omnibox. Remap Storybook search to Alt+K
 * when the binding is still the stock Ctrl/Cmd+K (leave a user override alone).
 */
addons.register('cake/chrome-safe-search', (api) => {
  const search = api.getShortcutKeys()?.search;
  if (!Array.isArray(search) || search.length !== 2) return;

  const [mod, key] = search;
  const isStockCtrlK =
    (mod === 'control' || mod === 'meta') && String(key).toUpperCase() === 'K';

  if (isStockCtrlK) {
    void api.setShortcut('search', ['alt', 'K']);
  }
});
