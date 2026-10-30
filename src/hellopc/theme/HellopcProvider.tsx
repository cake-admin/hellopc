import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { CakeThemeProvider, CakeGlobalStyle } from './ThemeProvider';
import type { ThemeMode } from '../tokens/theme';

/**
 * hello pc Provider — the single wrapper an app needs to consume the design system.
 *
 * Wrapping your tree in `<CakeProvider>` sets up everything the components
 * expect, so nothing else has to be imported or configured:
 *
 *  - the **CSS custom properties** (`--color-*`, `--space-*`, …) via the
 *    `data-theme` attribute — see the scoping note below;
 *  - the **styled-components theme** (`props.theme`), for the parts of the
 *    system that read the JS theme object;
 *  - the **fonts** and the **global baseline** (`CakeGlobalStyle`), which
 *    arrive as side-effect imports of `ThemeProvider`.
 *
 * ### Why `data-theme` goes on `<html>`
 *
 * `hellopc-vars.css` scopes the tokens as `:root, [data-theme='light.a']`, with
 * `[data-theme='dark.a']` / `[data-theme='win hct']` overriding inside a
 * subtree. Several components (Modal, Dropdown, both Tooltips, Breadcrumb,
 * NumberDropdown, Pagination) render through a Radix **Portal** into
 * `document.body` — *outside* this provider's subtree. If the attribute lived
 * on a wrapper `<div>`, those portalled surfaces would escape it and fall back
 * to `:root` (light.a), so a dark-mode app would paint light menus and dialogs.
 *
 * Setting it on `document.documentElement` puts every portal inside the themed
 * scope. Pass `scope="subtree"` to opt out and theme only this subtree (useful
 * when embedding hello pc inside a host app you don't own) — portalled components
 * will not be themed in that mode.
 *
 * ### First paint
 *
 * The attribute is applied in a layout effect, so the very first paint uses the
 * `:root` (light.a) values. If your app boots in dark mode and you want to avoid
 * the flash, also set `data-theme` on `<html>` in your HTML shell.
 */

/**
 * Indigo for the word “pc”. Dark on light canvases, light on dark.a and win hct.
 * HCT’s primary token is cyan, so this does not follow `--color-primary-primary`.
 */
const BrandPcStyle = createGlobalStyle`
  :root,
  [data-theme='light.a'] {
    --brand-pc: #394edb;
  }

  [data-theme='dark.a'],
  [data-theme='win hct'] {
    --brand-pc: #bcc3ff;
  }
`;

/** `useLayoutEffect` on the client, `useEffect` on the server (dodges the SSR warning). */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export interface CakeProviderProps {
  /**
   * Active theme mode. Drives both the CSS custom properties and the
   * styled-components theme object.
   * @default 'light.a'
   */
  mode?: ThemeMode;
  /** The application tree. */
  children: React.ReactNode;
  /**
   * Render the hello pc global baseline (`box-sizing`, body font, canvas
   * background). Turn it off when embedding inside a host app whose global
   * styles you must not touch.
   * @default true
   */
  globalStyles?: boolean;
  /**
   * Where the `data-theme` attribute is applied. `document` puts it on
   * `<html>`, so Radix portals (dialogs, menus, tooltips) stay themed;
   * `subtree` wraps the children in a themed `<div>` instead and leaves the
   * rest of the page alone — at the cost of unthemed portals.
   * @default 'document'
   */
  scope?: 'document' | 'subtree';
}

/**
 * Wrap your app once and every hello pc component is themed, fonted, and
 * tokenized. See the module docs for the `data-theme` scoping rationale.
 */
export const CakeProvider = ({
  mode = 'light.a',
  children,
  globalStyles = true,
  scope = 'document',
}: CakeProviderProps) => {
  useIsomorphicLayoutEffect(() => {
    if (scope !== 'document' || typeof document === 'undefined') return undefined;

    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', mode);

    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, [mode, scope]);

  return (
    <CakeThemeProvider mode={mode}>
      <BrandPcStyle />
      {globalStyles ? <CakeGlobalStyle /> : null}
      {scope === 'subtree' ? <div data-theme={mode}>{children}</div> : children}
    </CakeThemeProvider>
  );
};

export default CakeProvider;
