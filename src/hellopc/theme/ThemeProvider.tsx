import React from 'react';
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from 'styled-components';
import { themes, type ThemeMode } from '../tokens/theme';
import './fonts.css';
import '../tokens/hellopc-vars.css';

/**
 * Global baseline for hello pc. Paints the canvas + base typography from tokens.
 */
export const CakeGlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: ${(p) => p.theme.font.family};
    color: ${(p) => p.theme.color.textIcon.primary};
    background: ${(p) => p.theme.color.surfaces.canvas};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

export interface CakeThemeProviderProps {
  /** Active theme mode. */
  mode?: ThemeMode;
  children: React.ReactNode;
}

/**
 * Provides the hello pc theme to styled-components. Every hello pc component reads
 * its colors, spacing, radius, and typography from `props.theme`, so wrapping
 * an app (or a story) in this provider is all that's needed to theme it.
 */
export const CakeThemeProvider = ({
  mode = 'light.a',
  children,
}: CakeThemeProviderProps) => (
  <StyledThemeProvider theme={themes[mode]}>{children}</StyledThemeProvider>
);

export default CakeThemeProvider;
