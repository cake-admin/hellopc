import type { CSSProperties } from 'react';
import { MemoryRouter } from 'react-router-dom';
import TopNav from '@site/components/TopNav';
import { SiteThemeProvider, useSiteTheme } from '@site/theme/SiteThemeProvider';
import { ThemeProvider, useChartTheme, useThemeMode } from './theme/ThemeProvider';
import type { Mode } from './tokens/tokens.types';
import { PreviewStage } from './preview/PreviewStage';
import { CustomizationPanel } from './panel/CustomizationPanel';
import './styles.css';

/** Main hello pc site origin — nav links leave /datavis and open the docs site. */
const SITE_ORIGIN = 'https://cake.lenovo.com';

/** Map site theme dropdown → chart modes (incl. Windows High-Contrast). */
function siteThemeToChartMode(themeKey: string): Mode {
  if (themeKey === 'dark') return 'dark';
  if (themeKey === 'hct') return 'hct';
  return 'light';
}

/**
 * Inner shell (inside ThemeProvider) so the whole app chrome is driven by the
 * same tokens as the charts (dark mode restyles everything). Site TopNav sits
 * above the stage; brand float remains over the preview.
 */
function AppShell() {
  const theme = useChartTheme();
  const { mode } = useThemeMode();

  // HCT collapses canvas/card to the same near-black — keep chrome-bg-2 as the
  // canvas, and expose a separate hover wash from existing HCT tokens.
  const hctChrome = mode === 'hct';
  const chromeVars = {
    '--chrome-bg': theme.surface.card,
    '--chrome-bg-2': theme.surface.canvas,
    '--chrome-hover': hctChrome ? theme.border.weak : theme.surface.canvas,
    '--chrome-border': theme.border.weak,
    '--chrome-border-strong': theme.border.standard,
    '--chrome-text': theme.text.primary,
    '--chrome-text-2': theme.text.secondary,
    '--chrome-text-3': theme.text.helper,
    '--accent': theme.color.base.primary,
    '--accent-weak': hctChrome ? theme.color.base.primary : undefined,
    '--accent-on-weak': hctChrome ? theme.surface.canvas : undefined,
  } as CSSProperties;

  return (
    // TopNav (fixed bar + BarSpacer) must sit *outside* the chart viewport box.
    // Nesting the spacer inside `.app { height: 100vh; overflow: hidden }` eats
    // the flex budget and can clip `.app__main` to zero visible height.
    // Wrap TopNav in one chrome flex child so Bar/BarSpacer/MobileDrawer are not
    // three siblings competing with `.app` for the viewport (fixed flex items
    // still mis-size the row in some engines and collapse the stage).
    <div className="app-root">
      <div className="app-root__chrome">
        <TopNav forceNoActive siteOrigin={SITE_ORIGIN} />
      </div>
      <div className="app" data-theme={mode} style={chromeVars}>
        <main className="app__main">
          <span className="app__brand-float">
            <span>
              <span className="brand-name">hello <span className="brand-pc">pc</span></span> data visualization playground
            </span>
          </span>
          <PreviewStage />
          <CustomizationPanel />
        </main>
      </div>
    </div>
  );
}

/** Chart ThemeProvider mode follows the shared site theme dropdown. */
function ThemedApp() {
  const { themeKey } = useSiteTheme();
  const chartMode = siteThemeToChartMode(themeKey);

  return (
    <ThemeProvider mode={chartMode}>
      <AppShell />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <MemoryRouter initialEntries={['/']}>
      {/* Skip CakeGlobalStyle — chart chrome owns body/canvas colors. */}
      <SiteThemeProvider globalStyles={false}>
        <ThemedApp />
      </SiteThemeProvider>
    </MemoryRouter>
  );
}
