import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AudioLines, List, Menu as MenuIcon, X } from 'lucide-react';
import { Dropdown } from '../hellopc/components/Dropdown';
import { useSiteTheme, THEME_OPTIONS } from '../theme/SiteThemeProvider';
import { NAV_SECTIONS, getActiveSection, isBlogPath } from '../data/nav';
import { pageGutterX } from '../styles/pageChrome';

import iconHome from '../assets/home/icon-home.svg';
import iconConnect from '../assets/home/icon-connect.svg';
import iconMemory from '../assets/home/icon-memory.svg';
import iconDraw from '../assets/home/icon-draw.svg';

const SECTION_ICONS = {
  home: iconHome,
  resources: null,
  foundations: iconConnect,
  components: iconMemory,
  blog: iconDraw,
};

/**
 * Fixed (not sticky): Radix Select wraps the portalled menu in RemoveScroll,
 * which locks body overflow and breaks sticky positioning. After scroll + open,
 * the bar jumps to its document position (off-screen) while the popper follows
 * the trigger above the viewport. Fixed keeps the chrome in the viewport.
 */
const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--space-300);
  padding-top: var(--space-200);
  padding-bottom: var(--space-200);
  ${pageGutterX}
  background: var(--color-surfaces-container);
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);
  font-family: var(--font-family);

  /* When Center is display:none it drops out of the grid — use 2 columns so
     brand stays left and theme controls stay right. */
  @media (max-width: 960px) {
    grid-template-columns: 1fr auto;
  }
`;

/** Reserves the fixed bar's height so page content is not covered. */
const BarSpacer = styled.div`
  flex-shrink: 0;
  height: ${(p) => p.$height}px;
`;

const Brand = styled(Link)`
  display: inline;
  text-decoration: none;
  font-family: 'Rookery New', Rookery, var(--font-family);
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
  justify-self: start;
  line-height: 1;

  &:hover {
    text-decoration: none;
    color: var(--color-text-icon-primary);
  }
`;

const Amp = styled.span`
  margin-left: 0.12em;
  color: var(--brand-pc, #394edb);
`;

const Center = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-500);

  @media (max-width: 960px) {
    display: none;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-200);
  justify-self: end;
`;

const ThemeField = styled.div`
  width: 160px;

  @media (max-width: 480px) {
    width: 130px;
  }
`;

const IconSlot = styled.span`
  display: inline-flex;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
    display: block;
  }
`;

/**
 * Quote the mask URL — Vite (and CRA) often inlines SVGs as `data:image/svg+xml,…`
 * data-URIs. An unquoted `url(data:…)` breaks the CSS `mask` shorthand on the
 * commas inside the data-URI, so icons render as empty 18×18 boxes.
 */
const maskUrl = (src) => {
  const raw = typeof src === 'string' ? src : '';
  return `url("${raw.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`;
};

const MaskIcon = styled.span`
  display: block;
  width: 18px;
  height: 18px;
  background-color: currentColor;
  -webkit-mask-image: ${(p) => maskUrl(p.$src)};
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-image: ${(p) => maskUrl(p.$src)};
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
`;

const navPillBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-050);
  height: 32px;
  padding: 0 var(--space-200);
  border: none;
  border-radius: var(--radius-1000);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.2px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
`;

/**
 * Windows HCT maps tonal-secondary-overlay-hover to solid white while nav ink
 * stays primary (light cyan) — same collapsed wash as Dropdown/ContentSwitcher.
 * Inverse surface + inverse ink + primary edge keeps hover readable.
 */
const navPillHctHover = `
  :root[data-theme='win hct'] &:hover:not(.active),
  [data-theme='win hct'] &:hover:not(.active) {
    background: var(--color-surfaces-inverse-container);
    color: var(--color-text-icon-inverse);
    box-shadow: inset 0 0 0 var(--stroke-100) var(--color-primary-primary);
  }
`;

const NavLinkButton = styled(NavLink)`
  ${navPillBase}
  background: transparent;
  color: var(--color-primary-primary);

  &:hover {
    background: var(--color-tonal-tonal-secondary-overlay-hover);
    text-decoration: none;
    color: var(--color-primary-primary);
  }

  &.active {
    background: var(--color-primary-primary);
    color: var(--color-text-icon-on-primary);
  }

  ${navPillHctHover}
`;

/** Same pill styles for absolute `<a>` links (e.g. datavis → main site). */
const NavAnchorButton = styled.a`
  ${navPillBase}
  background: transparent;
  color: var(--color-primary-primary);

  &:hover {
    background: var(--color-tonal-tonal-secondary-overlay-hover);
    text-decoration: none;
    color: var(--color-primary-primary);
  }

  ${navPillHctHover}
`;

const MobileToggle = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--radius-200);
  background: transparent;
  color: var(--color-text-icon-primary);
  cursor: pointer;

  @media (max-width: 960px) {
    display: inline-flex;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MobileDrawer = styled.div`
  display: none;

  @media (max-width: 960px) {
    display: ${(p) => (p.$open ? 'flex' : 'none')};
    position: fixed;
    top: ${(p) => p.$top}px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    flex-direction: column;
    gap: var(--space-100);
    padding: var(--space-300);
    background: var(--color-surfaces-canvas);
    overflow-y: auto;
  }
`;

const MobileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  padding-bottom: var(--space-200);
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);

  &:last-child {
    border-bottom: none;
  }
`;

const MobileLink = styled(NavLink)`
  padding: var(--space-150) var(--space-200);
  border-radius: var(--radius-200);
  text-decoration: none;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);

  &.active {
    background: var(--color-tonal-tonal-lightest);
    color: var(--color-text-icon-on-tonal);
    font-weight: var(--font-weight-medium);
  }
`;

const MobileAnchor = styled.a`
  padding: var(--space-150) var(--space-200);
  border-radius: var(--radius-200);
  text-decoration: none;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
`;

const SectionIcon = ({ id }) => {
  if (id === 'resources') {
    return (
      <IconSlot aria-hidden>
        <List />
      </IconSlot>
    );
  }
  if (id === 'sound') {
    return (
      <IconSlot aria-hidden>
        <AudioLines />
      </IconSlot>
    );
  }
  const src = SECTION_ICONS[id];
  if (!src) return null;
  return (
    <IconSlot aria-hidden>
      <MaskIcon $src={src} />
    </IconSlot>
  );
};

const DEFAULT_BAR_HEIGHT = 64;

const normalizeOrigin = (origin) => {
  if (!origin) return null;
  return String(origin).replace(/\/$/, '');
};

/**
 * @param {object} [props]
 * @param {boolean} [props.forceNoActive] When true, no nav item is highlighted
 *   (used on surfaces outside the main site IA, e.g. /datavis).
 * @param {string} [props.siteOrigin] Absolute origin for main-site links
 *   (e.g. https://cake.lenovo.com). When set, nav uses `<a href>` instead of
 *   react-router so the datavis playground (base /datavis/) does not treat site paths
 *   as in-app routes.
 */
const TopNav = ({ forceNoActive = false, siteOrigin } = {}) => {
  const { pathname } = useLocation();
  const { themeKey, setThemeKey } = useSiteTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [barHeight, setBarHeight] = useState(DEFAULT_BAR_HEIGHT);
  const barRef = useRef(null);
  const origin = normalizeOrigin(siteOrigin);
  const activeSection = forceNoActive ? null : getActiveSection(pathname);
  const blogActive = forceNoActive ? false : isBlogPath(pathname);

  const siteHref = (path) => (origin ? `${origin}${path}` : path);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return undefined;

    /* --topnav-height lets sticky page furniture (docs rails) offset itself
       below the fixed bar; BarSpacer alone only pushes static content down. */
    const sync = () => {
      const next = Math.ceil(el.getBoundingClientRect().height);
      if (next > 0) {
        setBarHeight(next);
        document.documentElement.style.setProperty('--topnav-height', `${next}px`);
      }
    };

    sync();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const navClass = (isActive) => (isActive && !forceNoActive ? 'active' : undefined);

  return (
    <>
      <Bar ref={barRef}>
        {origin ? (
          <Brand as="a" href={siteHref('/')} aria-label="hello pc home">
            hello<Amp>pc</Amp>
          </Brand>
        ) : (
          <Brand to="/" aria-label="hello pc home">
            hello<Amp>pc</Amp>
          </Brand>
        )}

        <Center aria-label="Primary">
          {origin ? (
            <NavAnchorButton href={siteHref('/')}>
              <SectionIcon id="home" />
              Home
            </NavAnchorButton>
          ) : (
            <NavLinkButton to="/" end className={({ isActive }) => navClass(isActive)}>
              <SectionIcon id="home" />
              Home
            </NavLinkButton>
          )}

          {NAV_SECTIONS.map((section) =>
            origin ? (
              <NavAnchorButton key={section.id} href={siteHref(section.path)}>
                <SectionIcon id={section.id} />
                {section.label}
              </NavAnchorButton>
            ) : (
              <NavLinkButton
                key={section.id}
                to={section.path}
                end={section.id === 'resources'}
                className={() =>
                  navClass(activeSection?.id === section.id)
                }
              >
                <SectionIcon id={section.id} />
                {section.label}
              </NavLinkButton>
            ),
          )}

          {origin ? (
            <NavAnchorButton href={siteHref('/resources/whats-new')}>
              <SectionIcon id="blog" />
              Blog
            </NavAnchorButton>
          ) : (
            <NavLinkButton
              to="/resources/whats-new"
              className={() => navClass(blogActive)}
            >
              <SectionIcon id="blog" />
              Blog
            </NavLinkButton>
          )}
        </Center>

        <Right>
          <ThemeField>
            <Dropdown
              id="site-theme"
              value={themeKey}
              onValueChange={setThemeKey}
              options={THEME_OPTIONS.map(({ value, label }) => ({ value, label }))}
              placeholder="Theme"
            />
          </ThemeField>
          <MobileToggle
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X /> : <MenuIcon />}
          </MobileToggle>
        </Right>
      </Bar>
      <BarSpacer $height={barHeight} aria-hidden />

      <MobileDrawer $open={mobileOpen} $top={barHeight} aria-label="Mobile navigation">
        <MobileSection>
          {origin ? (
            <MobileAnchor href={siteHref('/')}>Home</MobileAnchor>
          ) : (
            <MobileLink to="/" end>
              Home
            </MobileLink>
          )}
        </MobileSection>
        {NAV_SECTIONS.map((section) => (
          <MobileSection key={section.id}>
            {origin ? (
              <MobileAnchor href={siteHref(section.path)}>
                {section.label}
              </MobileAnchor>
            ) : (
              <MobileLink
                to={section.path}
                end={section.id === 'resources'}
                className={() =>
                  navClass(activeSection?.id === section.id)
                }
              >
                {section.label}
              </MobileLink>
            )}
          </MobileSection>
        ))}
        <MobileSection>
          {origin ? (
            <MobileAnchor href={siteHref('/resources/whats-new')}>
              Blog
            </MobileAnchor>
          ) : (
            <MobileLink
              to="/resources/whats-new"
              className={() => navClass(blogActive)}
            >
              Blog
            </MobileLink>
          )}
        </MobileSection>
        <MobileSection>
          <ThemeField>
            <Dropdown
              id="site-theme-mobile"
              value={themeKey}
              onValueChange={setThemeKey}
              options={THEME_OPTIONS.map(({ value, label }) => ({ value, label }))}
              placeholder="Theme"
            />
          </ThemeField>
        </MobileSection>
      </MobileDrawer>
    </>
  );
};

export default TopNav;
