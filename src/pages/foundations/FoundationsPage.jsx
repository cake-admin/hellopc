import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Toast as RadixToast } from 'radix-ui';
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react';
import { Button } from '../../hellopc/components/Button';
import { Card } from '../../hellopc/components/Card';
import { Toast } from '../../hellopc/components/Toast';
import {
  VerticalTabs,
  VerticalTabsList,
  VerticalTabsContent,
} from '../../hellopc/components/VerticalTabs/VerticalTabs';
import { VerticalTabItem } from '../../hellopc/components/VerticalTabs/VerticalTabItem';
import {
  VerticalTabsSectionHeader,
  VerticalTabsDivider,
} from '../../hellopc/components/VerticalTabs/VerticalTabsSection';
import { STORYBOOK_PATH } from '../../data/nav';
import { withBrand } from '../../components/BrandName';
import { pageGutterX, stickyDocsRail } from '../../styles/pageChrome';
import { StickyWallpaper } from '../HomePage';
import tokens from '../../hellopc/tokens/tokens.json';
import {
  TYPOGRAPHY_ROLES,
  TYPOGRAPHY_SIZE_PX,
  typographyPresets,
} from '../../hellopc/tokens/typography';
import heroBg from '../../assets/home/hero-bg.png';
import wallpaperLight from '../../hellopc/foundations/assets/wallpaper-light.jpg';
import wallpaperDark from '../../hellopc/foundations/assets/wallpaper-dark.jpg';
import { AiOverviewContent } from './ai/AiOverviewPage';
import { AiGradientContent } from './ai/AiGradientPage';
import AiLogoIconContent from './ai/AiLogoIconPage';

const storybookDocs = (slug) => `${STORYBOOK_PATH}?path=/docs/${slug}`;

const ROOKERY = `'Rookery New', Rookery, var(--font-family)`;

/**
 * Match `scripts/build-hellopc-css-vars.mjs` exactly.
 * CamelCase → kebab (`primaryHover` → `primary-hover`); underscores stay
 * (`1_Data` → `1_data`), so data palette vars resolve as `--color-data-1_data`.
 */
const toCssKebab = (value) =>
  String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

const cssVarForToken = (token) =>
  `var(--color-${toCssKebab(token.groupKey)}-${toCssKebab(token.leafKey)})`;

const colorGroups = [...new Set(tokens.list.map((t) => t.group))];

const spacingTokens = tokens.value?.spacing ?? [];
const radiusTokens = tokens.value?.radius ?? [];
const strokeTokens = tokens.value?.stroke ?? [];

const ELEVATION_LEVELS = [
  { n: 0, name: 'Resting', use: 'Cards and notifications at rest' },
  { n: 1, name: 'Raised', use: 'A surface that has been picked up' },
  { n: 2, name: 'Floating', use: 'Tooltips and small popovers' },
  { n: 3, name: 'Overlay', use: 'Menus, toasts, and panels' },
  { n: 4, name: 'Prominent', use: 'Drawers and sheets' },
  { n: 5, name: 'Dialog', use: 'Modals and screen-taking surfaces' },
];

const TYPE_SAMPLE = {
  data: '42,000',
  short: 'Smarter technology for all',
  med: 'Smarter technology for all, built for people and the planet.',
};

const previewForRole = (role) => {
  if (role === 'data') return TYPE_SAMPLE.data;
  if (['caption', 'helper', 'body'].includes(role)) return TYPE_SAMPLE.med;
  return TYPE_SAMPLE.short;
};

const SECTIONS = [
  {
    id: 'color',
    label: 'Color',
    storybook: storybookDocs('foundations-colors--docs'),
  },
  {
    id: 'typography',
    label: 'Typography',
    storybook: storybookDocs('foundations-typography--docs'),
  },
  {
    id: 'spacing',
    label: 'Spacing',
    storybook: storybookDocs('foundations-spacing--docs'),
  },
  {
    id: 'elevation',
    label: 'Elevation',
    storybook: storybookDocs('foundations-elevation--docs'),
  },
  {
    id: 'surfaces',
    label: 'Special surfaces',
    storybook: storybookDocs('foundations-special-surfaces--docs'),
  },
  {
    id: 'tone-of-voice',
    label: 'Tone of voice',
  },
];

const AI_SECTIONS = [
  { id: 'ai-overview', label: 'AI overview', path: '/foundations/ai/overview' },
  { id: 'ai-gradient', label: 'AI gradient', path: '/foundations/ai/gradient' },
  { id: 'ai-logo-icon', label: 'AI logo & icon', path: '/foundations/ai/logo-icon' },
];

/** Map deep-link paths onto the Foundations rail tab value. */
const tabFromPath = (pathname) => {
  if (pathname === '/foundations/ai' || pathname === '/foundations/ai/') {
    return 'ai-overview';
  }
  const ai = AI_SECTIONS.find((s) => s.path === pathname);
  return ai?.id ?? null;
};

const pathForTab = (tab) => {
  const ai = AI_SECTIONS.find((s) => s.id === tab);
  return ai?.path ?? '/foundations';
};

/**
 * Hero title on the wallpaper. Same ink mapping as Home/Resources:
 * white in light/dark, black in HCT.
 */
const Page = styled.div`
  --page-on-media: #ffffff;

  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  font-family: ${ROOKERY};

  html[data-theme='win hct'] & {
    --page-on-media: #000000;
  }
`;

const Layer = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Hero = styled.section`
  display: flex;
  align-items: flex-end;
  min-height: 200px;
  padding-top: var(--space-200);
  padding-bottom: var(--space-200);
  ${pageGutterX}
  box-sizing: border-box;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-hero);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--page-on-media);
`;

const Content = styled.section`
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  backdrop-filter: blur(45px);
  background: var(--color-surfaces-container-blur-high);
  box-shadow: var(--elevation-5);
  padding-top: var(--space-600);
  padding-bottom: var(--space-600);
  ${pageGutterX}
  display: flex;
  flex-direction: column;
`;

const Layout = styled(VerticalTabs)`
  display: grid !important;
  grid-template-columns: 220px minmax(0, 1fr);
  align-items: start;
  gap: var(--space-500);
  width: 100%;
  max-width: none;
  flex: 1;
  min-height: 0;
  font-family: ${ROOKERY};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Rail = styled(VerticalTabsList)`
  ${stickyDocsRail}
`;
const Panel = styled(VerticalTabsContent)`
  /* Stay in the content column of Layout's 2-col grid (rail is col 1). */
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: var(--space-500);
  width: 100%;
  max-width: none;
  min-width: 0;
  font-family: ${ROOKERY};

  /*
   * styled-components' display: flex overrides the UA [hidden] rule, so
   * inactive Radix panels would still participate in the grid and auto-place
   * into the rail column (weird offset). Force them out of flow.
   */
  &[data-state='inactive'],
  &[hidden] {
    display: none;
  }

  @media (max-width: 720px) {
    grid-column: 1;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  letter-spacing: -0.4px;
  color: var(--color-text-icon-primary);
`;

const SectionCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  max-width: 40rem;
`;

const Para = styled.p`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
`;

const PreviewPanel = styled.div`
  width: 100%;
  border-radius: var(--radius-300);
  border: var(--stroke-100) solid var(--color-stroke-border);
  background: var(--color-surfaces-container);
  padding: var(--space-400);
  box-sizing: border-box;
  font-family: ${ROOKERY};
`;

const GroupBlock = styled.div`
  & + & {
    margin-top: var(--space-500);
  }
`;

const GroupLabel = styled.h3`
  margin: 0 0 var(--space-200);
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-icon-secondary);
`;

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: var(--space-200);
`;

const SwatchCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  min-width: 0;
`;

const Swatch = styled.div`
  width: 100%;
  height: 48px;
  border-radius: var(--radius-150);
  background: ${(p) => p.$color};
  border: var(--stroke-100) solid var(--color-stroke-border);
  box-sizing: border-box;
`;

const SwatchName = styled.span`
  font-family: ${ROOKERY};
  font-size: 11px;
  line-height: 1.3;
  color: var(--color-text-icon-primary);
  overflow-wrap: anywhere;
`;

const ScaleRow = styled.div`
  display: flex;
  gap: var(--space-400);
  align-items: baseline;
  padding: var(--space-200) 0;
  border-top: var(--stroke-100) solid var(--color-stroke-border);

  &:first-child {
    border-top: none;
    padding-top: 0;
  }
`;

const ScaleMeta = styled.div`
  width: 132px;
  flex-shrink: 0;
`;

const ScaleRole = styled.div`
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;

const ScaleDetail = styled.div`
  margin-top: 2px;
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const ScaleSample = styled.div`
  flex: 1;
  min-width: 0;
  font-family: ${(p) => p.$fontFamily};
  font-size: ${(p) => p.$fontSize};
  font-weight: ${(p) => p.$fontWeight};
  line-height: ${(p) => p.$lineHeight};
  color: var(--color-text-icon-primary);
`;

const TokenBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
  padding: var(--space-150) 0;
  border-top: var(--stroke-100) solid var(--color-stroke-border);

  &:first-of-type {
    border-top: none;
  }
`;

const TokenBarMeta = styled.div`
  width: 140px;
  flex-shrink: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
`;

const TokenBarPx = styled.span`
  width: 40px;
  flex-shrink: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
`;

const TokenBar = styled.span`
  display: inline-block;
  height: 14px;
  width: ${(p) => p.$px}px;
  max-width: 100%;
  background: var(--color-primary-primary);
  border-radius: var(--radius-50);
`;

const RadiusGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-400);
`;

const RadiusCard = styled.div`
  text-align: center;
`;

const RadiusSwatch = styled.div`
  width: 72px;
  height: 72px;
  background: var(--color-primary-primary-overlay);
  border: var(--stroke-200) solid var(--color-primary-primary);
  border-radius: ${(p) => p.$px}px;
`;

const RadiusLabel = styled.div`
  margin-top: var(--space-100);
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
`;

const StrokeSample = styled.div`
  width: 180px;
  max-width: 100%;
  border-top: ${(p) => p.$px}px solid var(--color-primary-primary);
`;

const ElevationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-400);
  padding: var(--space-400);
  border-radius: var(--radius-300);
  background: var(--color-surfaces-canvas);
  border: var(--stroke-100) solid var(--color-stroke-border);
`;

const ElevationCard = styled.div`
  background: var(--color-surfaces-container);
  border-radius: var(--radius-300);
  box-shadow: ${(p) => `var(--elevation-${p.$level})`};
  height: 88px;
  display: grid;
  place-items: center;
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-primary);
`;

const ElevationCaption = styled.div`
  margin-top: var(--space-200);
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  text-align: center;
`;

const SurfaceStages = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-300);
`;

const SurfaceStage = styled.div`
  flex: 1 1 240px;
  min-width: 220px;
`;

const SurfaceStageCanvas = styled.div`
  border-radius: var(--radius-200);
  border: var(--stroke-100) solid var(--color-stroke-border);
  background-image: ${(p) => `url(${p.$wallpaper})`};
  background-size: cover;
  background-position: center;
  display: grid;
  place-items: center;
  padding: var(--space-500) var(--space-400);
`;

const BlurSurface = styled.div`
  box-sizing: border-box;
  width: 148px;
  height: 116px;
  border-radius: var(--radius-300);
  background: ${(p) =>
    p.$high
      ? 'var(--color-surfaces-container-blur-high)'
      : 'var(--color-surfaces-container-blur)'};
  border: ${(p) =>
    p.$high ? '8px solid var(--color-stroke-border-container-os)' : 'none'};
  background-clip: ${(p) => (p.$high ? 'padding-box' : 'border-box')};
  backdrop-filter: blur(45px);
  -webkit-backdrop-filter: blur(45px);
  box-shadow: ${(p) =>
    p.$high ? 'var(--elevation-5)' : 'var(--elevation-3)'};
`;

const SurfaceCaption = styled.div`
  margin-top: var(--space-150);
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  text-align: center;
`;

const RecipeList = styled.ul`
  margin: var(--space-200) 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

const RecipeItem = styled.li`
  font-family: ${ROOKERY};
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);

  code {
    color: var(--color-text-icon-primary);
  }
`;

const VoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-300);
`;

const VoiceCardInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  padding: var(--space-400);
  box-sizing: border-box;
`;

const VoiceCardTitle = styled.h3`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const VoiceCardBody = styled.p`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
`;

const VoiceSubsection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
`;

const VoiceSubhead = styled.h3`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const DoDontGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-300);
`;

const DoDontInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  padding: var(--space-400);
  box-sizing: border-box;
`;

const DoDontHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-100);
  padding-bottom: var(--space-200);
  border-bottom: var(--stroke-200) solid
    ${(p) => (p.$ok ? 'var(--color-success-success)' : 'var(--color-error-error)')};
  color: ${(p) => (p.$ok ? 'var(--color-success-success)' : 'var(--color-error-error)')};
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;

  svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin-top: 2px;
  }
`;

const DoDontExample = styled.div`
  font-family: ${ROOKERY};
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
  color: var(--color-text-icon-primary);
  max-width: ${(p) => (p.$narrow ? '12rem' : 'none')};
`;

/**
 * Radix Toast portals into a Viewport. For an embedded page banner we mount a
 * local Provider + relative Viewport (same pattern as Storybook Toast docs /
 * Components page previews) so it stays in flow instead of floating to a
 * corner.
 */
const InlineToastShell = ({ children }) => (
  <RadixToast.Provider>
    {children}
    <RadixToast.Viewport
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-300)',
        width: '100%',
        maxWidth: 640,
        margin: 0,
        padding: 0,
        listStyle: 'none',
        outline: 'none',
      }}
    />
  </RadixToast.Provider>
);

const ColorPreview = () => {
  const byGroup = useMemo(() => {
    const map = new Map();
    for (const token of tokens.list) {
      if (!map.has(token.group)) map.set(token.group, []);
      map.get(token.group).push(token);
    }
    return colorGroups.map((group) => ({
      group,
      tokens: map.get(group) ?? [],
    }));
  }, []);

  return (
    <PreviewPanel>
      {byGroup.map(({ group, tokens: groupTokens }) => (
        <GroupBlock key={group}>
          <GroupLabel>{group}</GroupLabel>
          <SwatchGrid>
            {groupTokens.map((token) => (
              <SwatchCard key={token.figmaPath}>
                <Swatch
                  $color={cssVarForToken(token)}
                  title={`${token.groupKey}.${token.leafKey}`}
                  aria-label={`color.${token.groupKey}.${token.leafKey}`}
                />
                <SwatchName>
                  {token.groupKey}.{token.leafKey}
                </SwatchName>
              </SwatchCard>
            ))}
          </SwatchGrid>
        </GroupBlock>
      ))}
    </PreviewPanel>
  );
};

const TypographyPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Type scale</GroupLabel>
      {TYPOGRAPHY_ROLES.map((role) => {
        const style = typographyPresets.regular[role];
        return (
          <ScaleRow key={role}>
            <ScaleMeta>
              <ScaleRole>{role}</ScaleRole>
              <ScaleDetail>
                {TYPOGRAPHY_SIZE_PX[role]}px · {style.fontSize}
              </ScaleDetail>
              <ScaleDetail>line-height {style.lineHeight}</ScaleDetail>
            </ScaleMeta>
            <ScaleSample
              $fontFamily={style.fontFamily}
              $fontSize={style.fontSize}
              $fontWeight={style.fontWeight}
              $lineHeight={style.lineHeight}
            >
              {previewForRole(role)}
            </ScaleSample>
          </ScaleRow>
        );
      })}
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Weights</GroupLabel>
      {[
        ['regular', 'Regular'],
        ['medium', 'Medium'],
        ['bold', 'Bold'],
      ].map(([weight, label]) => {
        const style = typographyPresets[weight].subtitle;
        return (
          <ScaleRow key={weight}>
            <ScaleMeta>
              <ScaleRole>{label}</ScaleRole>
              <ScaleDetail>
                {weight} · {style.fontWeight}
              </ScaleDetail>
            </ScaleMeta>
            <ScaleSample
              $fontFamily={style.fontFamily}
              $fontSize={style.fontSize}
              $fontWeight={style.fontWeight}
              $lineHeight={style.lineHeight}
            >
              {TYPE_SAMPLE.short}
            </ScaleSample>
          </ScaleRow>
        );
      })}
    </GroupBlock>
  </PreviewPanel>
);

const SpacingPreview = () => (
  <PreviewPanel>
    <GroupBlock>
      <GroupLabel>Spacing — --space-*</GroupLabel>
      {spacingTokens.map((token) => (
        <TokenBarRow key={token.name}>
          <TokenBarMeta>
            <code>--{token.name}</code>
          </TokenBarMeta>
          <TokenBarPx>{token.px}px</TokenBarPx>
          <TokenBar $px={token.px} aria-hidden />
        </TokenBarRow>
      ))}
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Radius — --radius-*</GroupLabel>
      <RadiusGrid>
        {radiusTokens.map((token) => (
          <RadiusCard key={token.name}>
            <RadiusSwatch $px={token.px} />
            <RadiusLabel>
              <code>--{token.name}</code>
              <div>{token.px}px</div>
            </RadiusLabel>
          </RadiusCard>
        ))}
      </RadiusGrid>
    </GroupBlock>

    <GroupBlock>
      <GroupLabel>Stroke — --stroke-*</GroupLabel>
      {strokeTokens.map((token) => (
        <TokenBarRow key={token.name}>
          <TokenBarMeta>
            <code>--{token.name}</code>
          </TokenBarMeta>
          <TokenBarPx>{token.px}px</TokenBarPx>
          <StrokeSample $px={token.px} aria-hidden />
        </TokenBarRow>
      ))}
    </GroupBlock>
  </PreviewPanel>
);

const ElevationPreview = () => (
  <PreviewPanel>
    <ElevationGrid>
      {ELEVATION_LEVELS.map((level) => (
        <div key={level.n}>
          <ElevationCard $level={level.n}>
            <code>elevation/{level.n}</code>
          </ElevationCard>
          <ElevationCaption>
            {level.name}
            <br />
            {level.use}
          </ElevationCaption>
        </div>
      ))}
    </ElevationGrid>
  </PreviewPanel>
);

const SurfaceRecipe = ({ high }) => (
  <GroupBlock>
    <GroupLabel>
      {high ? 'container blur high' : 'container blur'}
    </GroupLabel>
    <SurfaceStages>
      {[
        { label: 'Light A', wallpaper: wallpaperLight },
        { label: 'Dark A', wallpaper: wallpaperDark },
      ].map(({ label, wallpaper }) => (
        <SurfaceStage key={label}>
          <SurfaceStageCanvas $wallpaper={wallpaper}>
            <BlurSurface $high={high} />
          </SurfaceStageCanvas>
          <SurfaceCaption>{label}</SurfaceCaption>
        </SurfaceStage>
      ))}
    </SurfaceStages>
    <RecipeList>
      <RecipeItem>
        fill:{' '}
        <code>
          {high
            ? '--color-surfaces-container-blur-high'
            : '--color-surfaces-container-blur'}
        </code>
      </RecipeItem>
      {high ? (
        <RecipeItem>
          stroke: <code>8px</code> solid{' '}
          <code>--color-stroke-border-container-os</code>
        </RecipeItem>
      ) : null}
      <RecipeItem>
        backdrop blur: <code>blur(45px)</code>
      </RecipeItem>
      <RecipeItem>
        shadow: <code>{high ? '--elevation-5' : '--elevation-3'}</code>
      </RecipeItem>
    </RecipeList>
  </GroupBlock>
);

const SurfacesPreview = () => (
  <PreviewPanel>
    <SurfaceRecipe />
    <SurfaceRecipe high />
  </PreviewPanel>
);

const VoiceTraitCard = ({ title, children }) => (
  <Card elevation="low">
    <VoiceCardInner>
      <VoiceCardTitle>{title}</VoiceCardTitle>
      <VoiceCardBody>{children}</VoiceCardBody>
    </VoiceCardInner>
  </Card>
);

const DoDontCard = ({ ok, title, example, narrow }) => (
  <Card elevation="low">
    <DoDontInner>
      <DoDontHeader $ok={ok}>
        {ok ? <CheckCircle2 aria-hidden /> : <XCircle aria-hidden />}
        <span>{title}</span>
      </DoDontHeader>
      <DoDontExample $narrow={narrow}>{example}</DoDontExample>
    </DoDontInner>
  </Card>
);

const ToneOfVoicePreview = () => (
  <>
    <VoiceSubsection>
      <VoiceSubhead>Lenovo is</VoiceSubhead>
      <VoiceGrid>
        <VoiceTraitCard title="Purposeful">
          There is an intent to everything we do.
        </VoiceTraitCard>
        <VoiceTraitCard title="Unexpected">
          We don&apos;t sound like everyone else.
        </VoiceTraitCard>
        <VoiceTraitCard title="Brave">
          We are confident in our point of view.
        </VoiceTraitCard>
      </VoiceGrid>
    </VoiceSubsection>

    <VoiceSubsection>
      <VoiceSubhead>Generally, the text itself is</VoiceSubhead>
      <VoiceGrid>
        <VoiceTraitCard title="Accessible">
          Language below a 7th grade reading level. Every element has text for
          screen readers including URLs and button states. Available in the
          languages our users are most proficient in.
        </VoiceTraitCard>
        <VoiceTraitCard title="Purposeful">
          What our user can or should do to meet the goals in their best interest
          is clear. Suggestions support Lenovo&apos;s mission of Smarter
          Technology for All.
        </VoiceTraitCard>
        <VoiceTraitCard title="Concise">
          Information presented is relevant at the moment of the experience. Text
          is &lt;50 characters wide and &lt;4 lines long. Buttons have three or
          fewer words.
        </VoiceTraitCard>
        <VoiceTraitCard title="Conversational">
          The words, phrases, and ideas presented are familiar or well explained.
          Directions are presented in useful, logical, and complete steps.
        </VoiceTraitCard>
        <VoiceTraitCard title="Clear">
          Actions have unambiguous results. Error messages help our users move
          forward. The same term means the same thing every time it is used.
          Policy information is easy to find.
        </VoiceTraitCard>
      </VoiceGrid>
    </VoiceSubsection>

    <VoiceSubsection>
      <VoiceSubhead>Capitalization</VoiceSubhead>
      <Para>
        Sentence case should be used in all titles, headings, menu items, lists,
        labels and buttons.
      </Para>
      <DoDontGrid>
        <DoDontCard
          ok
          title="Do use sentence case for all UI text elements."
          example="Check for updates"
        />
        <DoDontCard
          ok={false}
          title="Don't use title case or capitalize every word."
          example="Check for Updates"
        />
      </DoDontGrid>
    </VoiceSubsection>

    <VoiceSubsection>
      <VoiceSubhead>Punctuation</VoiceSubhead>
      <VoiceGrid>
        <VoiceTraitCard title="Consistent">Punctuation is consistent.</VoiceTraitCard>
        <VoiceTraitCard title="Headers">
          Short strings such as headers do not need punctuation.
        </VoiceTraitCard>
        <VoiceTraitCard title="Full sentences">
          Full sentences always get full punctuation.
        </VoiceTraitCard>
        <VoiceTraitCard title="Exclamation points">
          Friendly, delightful uses of exclamation points are encouraged!
        </VoiceTraitCard>
      </VoiceGrid>
    </VoiceSubsection>

    <VoiceSubsection>
      <VoiceSubhead>Body text</VoiceSubhead>
      <VoiceGrid>
        <VoiceTraitCard title="Detailed but not technical">
          Body text should be detailed but not overly technical.
        </VoiceTraitCard>
        <VoiceTraitCard title="Concise with opportunities">
          Be concise but offer opportunities to learn more.
        </VoiceTraitCard>
        <VoiceTraitCard title="Familiar language">
          Use familiar language, especially when discussing technical or
          unfamiliar topics.
        </VoiceTraitCard>
        <VoiceTraitCard title="Support with visuals">Support with visuals.</VoiceTraitCard>
        <VoiceTraitCard title="Avoid orphans and widows">
          One word alone on a line (an orphan) and two words alone on a line (a
          widow) are to be avoided wherever possible.
        </VoiceTraitCard>
      </VoiceGrid>
      <Para>Example:</Para>
      <DoDontGrid>
        <DoDontCard
          ok
          title="Do"
          example="This is a good example where there are several words on every line."
        />
        <DoDontCard
          ok={false}
          title="Don't"
          example="This is an example where two words, called a widow, are alone on a line as a result of a line break."
          narrow
        />
        <DoDontCard
          ok={false}
          title="Don't"
          example="This is an example where one word, called an orphan, is alone on a line as a result of a line break."
          narrow
        />
      </DoDontGrid>
    </VoiceSubsection>

    <VoiceSubsection>
      <VoiceSubhead>Resources</VoiceSubhead>
      <Para>
        Access official documentation and additional resources to expand your
        content toolkit.
      </Para>
      <InlineToastShell>
        <Toast
          status="info"
          variant="inline"
          title="Lenovo brand voice and tone guidelines"
          description="Official Lenovo brand guidelines for tone of voice, messaging, and content strategy."
          primaryActionLabel="Visit Lenovo brand guidelines"
          onPrimaryAction={() =>
            window.open(
              'https://brandworld.lenovo.com/tone-of-voice/',
              '_blank',
              'noopener,noreferrer',
            )
          }
          duration={Infinity}
        />
      </InlineToastShell>
    </VoiceSubsection>
  </>
);

const openStorybook = (href) => {
  window.open(href, '_blank', 'noopener,noreferrer');
};

const SectionIntro = ({ title, paragraphs, storybook }) => (
  <>
    <SectionTitle>{title}</SectionTitle>
    <SectionCopy>
      {paragraphs.map((text) => (
        <Para key={text.slice(0, 48)}>{withBrand(text)}</Para>
      ))}
    </SectionCopy>
    {storybook ? (
      <div>
        <Button
          intent="secondary"
          endIcon={<ExternalLink size={16} aria-hidden />}
          onClick={() => openStorybook(storybook)}
        >
          View more on Storybook
        </Button>
      </div>
    ) : null}
  </>
);

const FoundationsPage = () => {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const pathTab = tabFromPath(pathname);
  const [tab, setTab] = useState(state?.foundationsTab ?? pathTab ?? 'color');

  useEffect(() => {
    if (pathTab) setTab(pathTab);
  }, [pathTab]);

  useEffect(() => {
    const fromRedirect = state?.foundationsTab;
    if (fromRedirect) {
      setTab(fromRedirect);
      navigate(pathname, { replace: true, state: {} });
    }
  }, [state, navigate, pathname]);

  const onValueChange = (value) => {
    setTab(value);
    const next = pathForTab(value);
    if (next !== pathname) navigate(next, { replace: true });
  };

  return (
    <Page>
      <StickyWallpaper aria-hidden>
        <img src={heroBg} alt="" />
      </StickyWallpaper>

      <Layer>
        <Hero>
          <HeroTitle>Foundations</HeroTitle>
        </Hero>

        <Content>
          <Layout value={tab} onValueChange={onValueChange}>
            <Rail aria-label="Foundation sections">
              <VerticalTabsSectionHeader>Foundations</VerticalTabsSectionHeader>
              {SECTIONS.map((section) => (
                <VerticalTabItem key={section.id} value={section.id}>
                  {section.label}
                </VerticalTabItem>
              ))}
              <VerticalTabsDivider />
              <VerticalTabsSectionHeader>AI styling</VerticalTabsSectionHeader>
              {AI_SECTIONS.map((section) => (
                <VerticalTabItem key={section.id} value={section.id}>
                  {section.label}
                </VerticalTabItem>
              ))}
            </Rail>

            <Panel value="color">
              <SectionIntro
                title="Color"
                storybook={SECTIONS[0].storybook}
                paragraphs={[
                  'Color is how hello pc feels at a glance — calm surfaces, clear hierarchy, and accents that guide attention. Instead of picking hex values by hand, every color has a job: backgrounds, text, borders, success, warnings, and more.',
                  'Those roles stay consistent across Light, Dark, and High Contrast, so a screen designed in one mode still reads correctly in another. Browse the swatches below in the current theme, then open Storybook when you need the full reference.',
                ]}
              />
              <ColorPreview />
            </Panel>

            <Panel value="typography">
              <SectionIntro
                title="Typography"
                storybook={SECTIONS[1].storybook}
                paragraphs={[
                  'hello pc uses Rookery New in Regular, Medium, and Bold. Every style is a role on a shared scale — caption through hero, plus a large data figure — so hierarchy stays consistent across screens.',
                  'Sizes and line-heights are the same in every weight. Use the scale below to pick a role, then open Storybook for the full token names and usage notes.',
                ]}
              />
              <TypographyPreview />
            </Panel>

            <Panel value="spacing">
              <SectionIntro
                title="Spacing"
                storybook={SECTIONS[2].storybook}
                paragraphs={[
                  'Spacing, radius, and stroke tokens keep layout rhythm consistent. Use them for every padding, gap, margin, corner, and border width — never arbitrary pixel values.',
                  'Spacing is grouped Small (2–10), Medium (12–24), and Large (32–80). Radius includes a pill value for buttons and switches; stroke widths cover outlines and focus rings.',
                ]}
              />
              <SpacingPreview />
            </Panel>

            <Panel value="elevation">
              <SectionIntro
                title="Elevation"
                storybook={SECTIONS[3].storybook}
                paragraphs={[
                  'Elevation separates a surface from the one behind it. Six levels — resting through dialog — each use a two-layer shadow that re-themes with Light, Dark, and High Contrast.',
                  'Pick a level by what the surface is (card, tooltip, menu, modal), not by how strong the shadow looks. Nested elevation does not compound — one surface should own the lift.',
                ]}
              />
              <ElevationPreview />
            </Panel>

            <Panel value="surfaces">
              <SectionIntro
                title="Special surfaces"
                storybook={SECTIONS[4].storybook}
                paragraphs={[
                  'Two surfaces in hello pc are translucent: they let content through, blurred. Each is a recipe of fill, backdrop blur, and elevation — all three parts have to travel together or the effect breaks.',
                  'Container blur is for temporary floating UI (toasts, notification panels). Container blur high is reserved for the Windows OS shell of the app, with a thick translucent rim.',
                ]}
              />
              <SurfacesPreview />
            </Panel>

            <Panel value="tone-of-voice">
              <SectionIntro
                title="Tone of voice"
                paragraphs={[
                  "Guidelines for creating clear, accessible, and purposeful content that aligns with Lenovo's tone of voice and supports our mission of Smarter Technology for All.",
                  'We are tech optimists: we believe in the power of technology to enable positive human-centered outcomes, and we know that a global, inclusive perspective is critical to real change.',
                ]}
              />
              <ToneOfVoicePreview />
            </Panel>

            <Panel value="ai-overview">
              <SectionIntro
                title="AI overview"
                paragraphs={[
                  "Lenovo's AI strategy follows a hybrid, tiered system. Rather than relying on a single universal AI icon across all products, our goal is to create harmony across AI experiences through a shared visual system.",
                  'This system brings together gradient treatments, syncopated motion, shared brand cues, and consistent visual indicators that can scale across consumer, commercial, and internal Lenovo products.',
                ]}
              />
              <AiOverviewContent />
            </Panel>

            <Panel value="ai-gradient">
              <SectionIntro
                title="AI gradient"
                paragraphs={[
                  'AI gradients are used to signal that a product, feature, or surface is AI-powered without introducing a new icon.',
                  'This approach uses visual treatment, such as color, surface, container styling, and hierarchy, to create a recognizable AI experience across Lenovo products. Gradients help maintain consistency while reducing icon overload and allowing each product context to use the appropriate level of emphasis.',
                ]}
              />
              <AiGradientContent />
            </Panel>

            <Panel value="ai-logo-icon">
              <SectionIntro
                title="AI logo & icon"
                paragraphs={[
                  'AI logos and icons are used to signal AI-powered experiences with a recognizable visual mark. They should be used intentionally and only when the AI capability needs clear recognition, persistent presence, or state-based feedback.',
                ]}
              />
              <AiLogoIconContent />
            </Panel>
          </Layout>
        </Content>
      </Layer>
    </Page>
  );
};

export default FoundationsPage;
