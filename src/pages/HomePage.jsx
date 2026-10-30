import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Button } from '../hellopc/components/Button';
import { Card } from '../hellopc/components/Card';
import { STORYBOOK_PATH } from '../data/nav';
import { pageGutterX } from '../styles/pageChrome';
import { BrandName, withBrand, BRAND_PC_LIGHT, BRAND_PC_DARK } from '../components/BrandName';

import heroBg from '../assets/home/hero-bg.png';
import cakeSlice from '../assets/home/cake-slice.png';
import iconHellopc from '../assets/home/icon-hellopc.svg';
import iconOpenInNew from '../assets/home/icon-open-in-new.svg';
import winCanvasLight from '../assets/home/win-canvas-light.png';
import winCanvasDark from '../assets/home/win-canvas-dark.png';

/**
 * Ink on the hero wallpaper + quicklinks tint.
 * `--color-text-icon-inverse` flips the wrong way in dark.a (becomes dark),
 * so home owns this mapping: white in light/dark, black in HCT.
 */
const Page = styled.div`
  --home-on-media: #ffffff;

  position: relative;
  width: 100%;
  font-family: var(--font-family);

  html[data-theme='win hct'] & {
    --home-on-media: #000000;
  }
`;

/** Fixed wallpaper — stays put while content scrolls; stays under footer (z-index). */
export const StickyWallpaper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(180deg, rgba(147, 97, 221, 0.3) 0%, rgba(3, 1, 61, 0.6) 88%),
      linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
  }

  html[data-theme='win hct'] &::after {
    background-image:
      linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.25) 88%),
      linear-gradient(90deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.08));
  }
`;

const Layer = styled.div`
  position: relative;
  z-index: 1;
`;

const Hero = styled.section`
  /* White type on the blue wallpaper → light indigo. HCT uses black type. */
  --brand-pc: ${BRAND_PC_LIGHT};

  html[data-theme='win hct'] & {
    --brand-pc: ${BRAND_PC_DARK};
  }

  display: flex;
  align-items: center;
  justify-content: center;
  /* Fixed: 128px pad × 2 + three hero lines — typewriter must not resize. */
  height: calc(256px + (3 * 1.35 * var(--type-size-hero)));
  padding-top: 0;
  padding-bottom: 0;
  ${pageGutterX}
  box-sizing: border-box;
`;

const HeroCopy = styled.h1`
  margin: 0;
  max-width: 52rem;
  min-height: calc(3 * 1.35 * var(--type-size-hero));
  text-align: center;
  font-family: 'Rookery New', Rookery, var(--font-family);
  font-size: var(--type-size-hero);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--home-on-media);

  .brand-word {
    font-weight: var(--font-weight-bold);
  }

  .amp {
    color: var(--brand-pc, ${BRAND_PC_LIGHT});
  }
`;

const cursorBlink = keyframes`
  0%, 45% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 0.08em;
  height: 0.9em;
  margin-left: 0.06em;
  vertical-align: -0.05em;
  background: var(--home-on-media);
  animation: ${cursorBlink} 1s step-end infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

/** Full sentence, broken after “age” and “design”. “pc” takes the on-media indigo. */
const HERO_LINES = [
  [
    { text: 'hello', bold: true },
    { text: 'pc', amp: true },
    { text: 'is' },
    { text: 'the' },
    { text: 'new' },
    { text: 'age' },
  ],
  [
    { text: 'of' },
    { text: 'PC' },
    { text: '&' },
    { text: 'web' },
    { text: 'software' },
    { text: 'design' },
  ],
  [{ text: 'for' }, { text: 'Lenovo' }, { text: '&' }, { text: 'Motorola.' }],
];

const HERO_FLAT = HERO_LINES.flat();
const HERO_ARIA =
  'hello pc is the new age of PC & web software design for Lenovo & Motorola.';
const WORD_MS = 90;

const HeroTypewriter = () => {
  const [visible, setVisible] = useState(0);
  const total = HERO_FLAT.length;

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(total);
      return undefined;
    }

    setVisible(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setVisible(n);
      if (n >= total) window.clearInterval(id);
    }, WORD_MS);

    return () => window.clearInterval(id);
  }, [total]);

  let seen = 0;
  let linesRendered = 0;

  return (
    <HeroCopy aria-label={HERO_ARIA}>
      <span aria-hidden>
        {HERO_LINES.map((line, lineIdx) => {
          const lineStart = seen;
          const tokens = line.map((token, tokenIdx) => {
            const index = seen;
            seen += 1;
            if (index >= visible) return null;
            const spaceBefore = tokenIdx > 0 && !line[tokenIdx - 1].glue;
            return (
              <React.Fragment key={`${lineIdx}-${tokenIdx}`}>
                {spaceBefore ? ' ' : null}
                {token.bold || token.amp ? (
                  <span className={token.amp ? 'brand-word amp' : 'brand-word'}>
                    {token.text}
                  </span>
                ) : (
                  token.text
                )}
              </React.Fragment>
            );
          });

          if (visible <= lineStart) return null;
          const showBreak = linesRendered > 0;
          linesRendered += 1;

          return (
            <React.Fragment key={lineIdx}>
              {showBreak ? <br /> : null}
              {tokens}
            </React.Fragment>
          );
        })}
        <Cursor />
      </span>
    </HeroCopy>
  );
};

const Why = styled.section`
  backdrop-filter: blur(45px);
  background: var(--color-surfaces-container-blur-high);
  box-shadow: var(--elevation-5);
  padding-top: var(--space-600);
  padding-bottom: var(--space-600);
  ${pageGutterX}
`;

/** Light + dark app canvases (Figma 9864:97750) over the wallpaper. */
const Showcase = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-500);
  padding-top: var(--space-600);
  padding-bottom: var(--space-600);
  ${pageGutterX}
  box-sizing: border-box;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ShowcaseFrame = styled.div`
  width: 100%;
  /* Clip opaque black corner fill outside the rounded app chrome. */
  border-radius: clamp(10px, 1.1vw, 16px);
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const SectionTitle = styled.h2`
  margin: var(--space-200) 0 0;
  font-family: 'Rookery New', Rookery, var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.4px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-500);
  margin-top: var(--space-500);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-600);
  height: 100%;
  box-sizing: border-box;
`;

const FeatureTitle = styled.h3`
  margin: 0;
  font-family: 'Rookery New', Rookery, var(--font-family);
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.4px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const FeatureSubtitle = styled.p`
  margin: 0;
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-primary);
`;

const FeatureBody = styled.p`
  margin: 0;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
`;

const Quicklinks = styled.section`
  backdrop-filter: blur(45px);
  background: var(--color-tonal-tonal-lightest);
  box-shadow: var(--elevation-5);
  display: flex;
  align-items: stretch;
  min-height: 340px;
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const QuickLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-500);
  padding-top: var(--space-600);
  padding-bottom: var(--space-600);
  ${pageGutterX}
  min-width: 0;
`;

const QuickTitle = styled.h2`
  margin: var(--space-200) 0 0;
  font-family: 'Rookery New', Rookery, var(--font-family);
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.4px;
  line-height: 1.35;
  color: var(--home-on-media);
`;

const ToastBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-500);
  flex-wrap: wrap;
  max-width: 40rem;
  padding: var(--space-300) var(--space-300) var(--space-300) var(--space-500);
  border-radius: var(--radius-400);
  background: var(--color-surfaces-container-blur);
  border-left: var(--stroke-100) solid var(--color-stroke-border-low);
`;

const ToastIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

const ToastCopy = styled.div`
  flex: 1;
  min-width: 10rem;

  .meta {
    margin: 0;
    font-size: var(--type-size-body);
    color: var(--color-text-icon-primary);
    line-height: 1.35;
  }

  .title {
    margin: 0;
    font-size: var(--type-size-subject);
    font-weight: var(--font-weight-medium);
    color: var(--color-secondary-secondary);
    line-height: 1.35;
  }
`;

const ToastActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  flex-shrink: 0;
`;

const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-200) var(--space-300);
`;

const ExtIcon = styled.span`
  display: block;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background-color: currentColor;
  mask: url(${iconOpenInNew}) center / contain no-repeat;
  -webkit-mask: url(${iconOpenInNew}) center / contain no-repeat;
`;

const outlineLinkStyles = `
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  height: 40px;
  padding: 0 var(--space-300);
  border-radius: var(--radius-1000);
  border: var(--stroke-200) solid var(--home-on-media);
  color: var(--home-on-media);
  text-decoration: none;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  --brand-pc: ${BRAND_PC_LIGHT};

  html[data-theme='win hct'] & {
    --brand-pc: ${BRAND_PC_DARK};
  }
  letter-spacing: 0.1px;
  white-space: nowrap;
  box-sizing: border-box;

  &:hover {
    text-decoration: none;
    background: color-mix(in srgb, var(--home-on-media) 12%, transparent);
  }
`;

const OutlineAnchor = styled.a`
  ${outlineLinkStyles}
`;

const OutlineRouterLink = styled(Link)`
  ${outlineLinkStyles}
`;

const CakePhoto = styled.div`
  position: relative;
  width: min(391px, 40%);
  flex-shrink: 0;
  min-height: 340px;
  overflow: hidden;

  @media (max-width: 900px) {
    width: 100%;
    min-height: 220px;
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Keep the cake / candle on the right; crop the empty left. */
    object-position: right center;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(29, 40, 131, 0.2), transparent);
  }
`;

const FEATURES = [
  {
    title: 'Modern',
    subtitle: "Built for what's next.",
    body: (
      <>
        Born from the unification of Lenovo and Motorola design, <BrandName />{' '}
        combines a trusted PC foundation with the modern <strong>hello</strong> design
        language. One system, one vision, ready for the future.
      </>
    ),
  },
  {
    title: 'Accessible',
    subtitle: 'Accessibility by default.',
    body:
      'Every component is built to meet WCAG 2.2 AA standards, so every experience is more inclusive, consistent, and usable—across devices and for every user.',
  },
  {
    title: 'One Lenovo',
    subtitle: 'Designed as one.',
    body:
      'hello pc brings Lenovo and Motorola together under a single design language, creating a more connected experience for designers, developers, and users across the ecosystem.',
  },
  {
    title: 'AI-ready',
    subtitle: 'Ready for AI workflows.',
    body:
      'Built for modern design and development, hello pc gives AI the structure it needs to generate cleaner prototypes, stronger code, and faster results from day one.',
  },
];

const QUICK_LINKS = [
  { label: 'hello pc foundations', href: '/foundations' },
  { label: 'hello pc Storybook', href: STORYBOOK_PATH, external: true },
  {
    label: 'hello pc Figma library',
    href: 'https://www.figma.com/community/file/1667712364680681509/lenovo-cake-1-0',
    external: true,
  },
  { label: 'hello pc data visualization playground', href: 'https://cake.lenovo.com/datavis/', external: true },
  { label: 'hello pc blog', href: '/resources/whats-new' },
];

const goWhatsNew = () => {
  window.location.assign(`${process.env.PUBLIC_URL || ''}/resources/whats-new`);
};

const HomePage = () => (
  <Page>
    <StickyWallpaper aria-hidden>
      <img src={heroBg} alt="" />
    </StickyWallpaper>

    <Layer>
      <Hero>
        <HeroTypewriter />
      </Hero>

      <Why>
        <SectionTitle>
          Why build with <BrandName />?
        </SectionTitle>
        <CardGrid>
          {FEATURES.map((f) => (
            <Card key={f.title} elevation="low">
              <FeatureInner>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureSubtitle>{f.subtitle}</FeatureSubtitle>
                <FeatureBody>{withBrand(f.body)}</FeatureBody>
              </FeatureInner>
            </Card>
          ))}
        </CardGrid>
      </Why>

      <Showcase aria-label="hello pc in light and dark modes">
        <ShowcaseFrame>
          <img src={winCanvasLight} alt="Lenovo Application in light mode — About screen" />
        </ShowcaseFrame>
        <ShowcaseFrame>
          <img src={winCanvasDark} alt="Lenovo Application in dark mode — Settings screen" />
        </ShowcaseFrame>
      </Showcase>

      <Quicklinks>
        <QuickLeft>
          <QuickTitle>Quicklinks</QuickTitle>

          <ToastBar>
            <ToastIcon src={iconHellopc} alt="" />
            <ToastCopy>
              <p className="meta">
                See what&apos;s new with <BrandName />
              </p>
              <p className="title">New AI guidelines added</p>
            </ToastCopy>
            <ToastActions>
              <Button size="sm" intent="secondary" variant="ghost" onClick={goWhatsNew}>
                View changelog
              </Button>
              <Button size="sm" onClick={goWhatsNew}>
                Read more
              </Button>
            </ToastActions>
          </ToastBar>

          <LinkRow>
            {QUICK_LINKS.map((link) =>
              link.external ? (
                <OutlineAnchor
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{withBrand(link.label)}</span>
                  <ExtIcon aria-hidden />
                </OutlineAnchor>
              ) : (
                <OutlineRouterLink key={link.label} to={link.href}>
                  <span>{withBrand(link.label)}</span>
                  <ExtIcon aria-hidden />
                </OutlineRouterLink>
              ),
            )}
          </LinkRow>
        </QuickLeft>

        <CakePhoto aria-hidden>
          <img src={cakeSlice} alt="" />
        </CakePhoto>
      </Quicklinks>
    </Layer>
  </Page>
);

export default HomePage;
