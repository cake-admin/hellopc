import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import TopNav from './components/TopNav';
import { BrandName, BRAND_PC_LIGHT } from './components/BrandName';
import SectionSubNav from './components/SectionSubNav';
import LenovoLogo from './components/LenovoLogo';
import { SiteThemeProvider } from './theme/SiteThemeProvider';
import { routes } from './data/routes';
import HomePage from './pages/HomePage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/** Avoid horizontal scrollbar eating layout / clipping the document footer. */
const GlobalScroll = createGlobalStyle`
  html, body, #root {
    max-width: 100%;
    overflow-x: clip;
  }

`;

const Shell = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: ${(p) =>
    p.$home ? 'transparent' : 'var(--color-surfaces-canvas)'};
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
`;

const Main = styled.main`
  width: 100%;
  max-width: 100%;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.footer`
  position: relative;
  z-index: 10;
  isolation: isolate;
  flex-shrink: 0;
  width: 100%;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: var(--space-200) var(--space-600);
  box-sizing: border-box;
  background: #000000;
  color: #ffffff;
  --brand-pc: ${BRAND_PC_LIGHT};
  text-align: center;
  font-size: var(--type-size-caption);
  font-family: var(--font-family);
  letter-spacing: 0.02em;
`;

const AppShell = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/' || pathname === '';
  /** Wallpaper pages: transparent shell, no secondary nav. */
  const isWallpaperPage =
    isHome ||
    pathname === '/resources' ||
    pathname === '/resources/whats-new' ||
    pathname === '/foundations' ||
    pathname.startsWith('/foundations/ai') ||
    pathname === '/components' ||
    pathname === '/version-control' ||
    pathname === '/sound' ||
    pathname.startsWith('/sound/');

  return (
    <Shell $home={isWallpaperPage}>
      <GlobalScroll />
      <TopNav />
      {!isWallpaperPage ? <SectionSubNav /> : null}
      <LenovoLogo />
      <ScrollToTop />
      <Main data-content-container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/whats-new" element={<Navigate to="/resources/whats-new" replace />} />
          <Route path="/sound/guidance" element={<Navigate to="/sound" replace />} />
          <Route path="/sound/duration" element={<Navigate to="/sound" replace />} />
          <Route path="/sound/materials" element={<Navigate to="/sound" replace />} />
          <Route path="/resources/about" element={<Navigate to="/resources" replace />} />
          <Route
            path="/get-started/about-cake"
            element={<Navigate to="/resources" replace />}
          />
          <Route
            path="/get-started/about"
            element={<Navigate to="/resources" replace />}
          />
          <Route
            path="/get-started/figma-libraries"
            element={<Navigate to="/resources" replace />}
          />
          <Route
            path="/foundations/colors"
            element={<Navigate to="/foundations" replace />}
          />
          <Route
            path="/foundations/iconography"
            element={<Navigate to="/foundations" replace />}
          />
          <Route
            path="/foundations/language-grammar"
            element={<Navigate to="/foundations" replace state={{ foundationsTab: 'tone-of-voice' }} />}
          />
          {routes
            .filter((route) => route.component && route.path !== '/')
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
          <Route
            path="/components/:legacy/*"
            element={<Navigate to="/components" replace />}
          />
        </Routes>
      </Main>
      <Footer>
        <span>© 2026 <BrandName /> design system. All rights reserved.</span>
      </Footer>
    </Shell>
  );
};

function App() {
  const baseUrl = process.env.PUBLIC_URL || '';

  return (
    <SiteThemeProvider>
      <Router basename={baseUrl}>
        <AppShell />
      </Router>
    </SiteThemeProvider>
  );
}

export default App;
