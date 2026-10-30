import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AudioLines, ExternalLink, Github, Package } from 'lucide-react';
import { Card } from '../hellopc/components/Card';
import { Button } from '../hellopc/components/Button';
import { Badge } from '../hellopc/components/Badge';
import { STORYBOOK_PATH } from '../data/nav';
import { pageGutterX } from '../styles/pageChrome';
import { StickyWallpaper } from './HomePage';
import { BrandName, withBrand } from '../components/BrandName';

import heroBg from '../assets/home/hero-bg.png';
import figmaTile from '../assets/resources/figma-tile.png';
import storybookTile from '../assets/resources/storybook-tile.png';
import datavizIcon from '../assets/resources/dataviz-icon.svg';

/**
 * Hero title on the wallpaper. `--color-text-icon-inverse` flips wrong in
 * dark.a, so Resources owns the same mapping as Home: white in light/dark,
 * black in HCT.
 */
const Page = styled.div`
  --page-on-media: #ffffff;

  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  font-family: var(--font-family);

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
  font-family: 'Rookery New', Rookery, var(--font-family);
  font-size: var(--type-size-hero);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--page-on-media);
`;

const Content = styled.section`
  flex: 1;
  backdrop-filter: blur(45px);
  background: var(--color-surfaces-container-blur-high);
  box-shadow: var(--elevation-5);
  padding-top: var(--space-600);
  padding-bottom: var(--space-600);
  ${pageGutterX}
  display: flex;
  flex-direction: column;
  gap: var(--space-600);
`;

const Intro = styled.div`
  margin: var(--space-200) 0 0;
  max-width: 40rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-500);
`;

const IntroBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
`;

const IntroText = styled.p`
  margin: 0;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
`;

/**
 * CSS grid — equal-height cards in each row (grid row tracks stretch
 * items by default). 1 → 2 → 3 → 4 columns as the viewport widens.
 * Direct children must be the cards (no wrappers) so stretch reaches them.
 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-500);
  align-items: stretch;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 960px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

/**
 * Figma `gradient/ui/*` fills — fixed palette stops (indigo/30→violet/60, etc.).
 * Not theme semantic tokens: these ramps stay constant across light/dark/HCT.
 */
const MEDIA_GRADIENTS = {
  figma:
    'linear-gradient(12.3deg, #2034b7 0%, #a078ff 100%)',
  storybook:
    'linear-gradient(12.3deg, #840075 0%, #fb565c 100%)',
  dataviz:
    'linear-gradient(12.3deg, #541cb8 0%, #e758cc 100%)',
  'ai-labs':
    'linear-gradient(12.3deg, #91061c 0%, #fb911c 100%)',
  devkit:
    'linear-gradient(12.3deg, #004e5e 0%, #3b92f9 100%)',
  sound:
    'linear-gradient(12.3deg, #0f3d3e 0%, #34d399 100%)',
};

const MediaBand = styled.div`
  display: flex;
  align-items: center;
  height: 96px;
  flex-shrink: 0;
  padding: var(--space-500);
  box-sizing: border-box;
  background: ${(p) => p.$gradient};
`;

const IconTile = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: var(--radius-200);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ChartIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 42px;
    height: 42px;
    display: block;
  }
`;

const GithubTile = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: var(--radius-200);
  background: #ffffff;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 28px;
    height: 28px;
    display: block;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-500);
  padding: var(--space-500);
  /* Fill remaining card height below the media band. */
  flex: 1 1 auto;
  min-height: 0;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  /* Absorb extra height so CardActions stays at the bottom. */
  flex: 1 1 auto;
  min-height: 0;
`;

const CardActions = styled.div`
  margin-top: auto;
  flex-shrink: 0;
`;

const TitleStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  align-items: flex-start;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-family: 'Rookery New', Rookery, var(--font-family);
  font-size: var(--type-size-subtitle);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const CardSubtitle = styled.p`
  margin: 0;
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-primary);
`;

const CardBody = styled.p`
  margin: 0;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-secondary);
`;

const AccessNote = styled.p`
  margin: 0;
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-secondary);
`;

const RESOURCES = [
  {
    id: 'figma',
    title: 'hello pc Figma file',
    subtitle: 'The single source of truth for designers.',
    body:
      'Browse every hello pc component, pattern, and style in our public community library, always up to date with the latest releases.',
    action: 'Open in Figma',
    href: 'https://www.figma.com/community/file/1667712364680681509/lenovo-cake-1-0',
    icon: figmaTile,
    iconKind: 'tile',
  },
  {
    id: 'storybook',
    title: 'hello pc Storybook',
    subtitle: 'The single source of truth for developers.',
    body:
      'Explore interactive React components built on Radix, complete with documentation, states, and implementation guidance.',
    action: 'Open Storybook',
    href: STORYBOOK_PATH,
    icon: storybookTile,
    iconKind: 'tile',
  },
  {
    id: 'devkit',
    title: 'hello pc Devkit',
    subtitle: 'The fastest way to start building.',
    body:
      'Download the hello pc starter kit to begin prototyping immediately. Includes components, tokens, and step-by-step setup so you can get a local preview running in minutes — even if you are new to development.',
    action: 'Get started',
    href: `${STORYBOOK_PATH}?path=/docs/introduction--docs`,
    iconKind: 'package',
  },
  {
    id: 'dataviz',
    title: 'hello pc data visualization playground',
    subtitle: 'Build charts in minutes.',
    body:
      'Copy editable SVG charts into Figma or generate themed ECharts code for production-ready data visualizations.',
    action: 'Try the playground',
    href: 'https://cake.lenovo.com/datavis/',
    icon: datavizIcon,
    iconKind: 'chart',
  },
  {
    id: 'ai-labs',
    title: 'hello pc AI Labs',
    subtitle: 'Prototype with hello pc AI workflows.',
    body:
      'Access our AI-powered starter project with hello pc design skills, Storybook context, and custom rules for faster prototyping and higher-quality output.',
    accessNote:
      'Available to Lenovo employees. Contact the hello pc team to request access.',
    action: 'View on GitHub',
    href: 'https://github.com/cake-admin/ai-lab',
    iconKind: 'github',
    restricted: true,
  },
  {
    id: 'sound',
    title: 'hello pc Sound',
    subtitle: 'A library of sound and audio design.',
    body:
      'Guidelines, assets, and documentation for creating consistent sound and audio experiences across Lenovo software.',
    action: 'Open hello pc Sound',
    href: '/sound',
    iconKind: 'waveform',
    internal: true,
  },
];

const openExternal = (href) => {
  window.open(href, '_blank', 'noopener,noreferrer');
};

/**
 * Fill the grid cell, then stack media → body as a column so Body/TextBlock
 * can flex and pin the CTA. Card already is `display: flex; flex-direction:
 * column`; height: 100% makes the percentage chain definite inside the cell.
 */
const StretchCard = styled(Card)`
  height: 100%;
  min-height: 0;
  min-width: 0;
  align-self: stretch;
`;

const ResourceCard = ({ resource }) => {
  const navigate = useNavigate();
  const isInternal = Boolean(resource.internal);

  const handleAction = () => {
    if (isInternal) {
      navigate(resource.href);
      return;
    }
    openExternal(resource.href);
  };

  return (
    <StretchCard elevation="low">
      <MediaBand $gradient={MEDIA_GRADIENTS[resource.id]}>
        {resource.iconKind === 'github' ? (
          <GithubTile aria-hidden>
            <Github />
          </GithubTile>
        ) : resource.iconKind === 'package' ? (
          <GithubTile aria-hidden>
            <Package />
          </GithubTile>
        ) : resource.iconKind === 'waveform' ? (
          <GithubTile aria-hidden>
            <AudioLines />
          </GithubTile>
        ) : resource.iconKind === 'chart' ? (
          <ChartIcon>
            <img src={resource.icon} alt="" />
          </ChartIcon>
        ) : (
          <IconTile>
            <img src={resource.icon} alt="" />
          </IconTile>
        )}
      </MediaBand>
      <Body>
        <TextBlock>
          <TitleStack>
            {resource.restricted ? (
              <Badge color="red" tone="solid" dot={false}>
                Restricted access
              </Badge>
            ) : null}
            <CardTitle>{withBrand(resource.title)}</CardTitle>
          </TitleStack>
          <CardSubtitle>{withBrand(resource.subtitle)}</CardSubtitle>
          <CardBody>{withBrand(resource.body)}</CardBody>
          {resource.accessNote ? (
            <AccessNote>{withBrand(resource.accessNote)}</AccessNote>
          ) : null}
        </TextBlock>
        <CardActions>
          <Button
            intent="secondary"
            variant="outline"
            size="md"
            endIcon={
              isInternal ? undefined : <ExternalLink size={16} aria-hidden />
            }
            onClick={handleAction}
          >
            {withBrand(resource.action)}
          </Button>
        </CardActions>
      </Body>
    </StretchCard>
  );
};

const Resources = () => (
  <Page>
    <StickyWallpaper aria-hidden>
      <img src={heroBg} alt="" />
    </StickyWallpaper>

    <Layer>
      <Hero>
        <HeroTitle>Resources</HeroTitle>
      </Hero>

      <Content>
        <Intro>
          <IntroBlock>
            <IntroText>
              <BrandName /> is the new age of PC &amp; web software design for
              Lenovo &amp; Motorola.
            </IntroText>
          </IntroBlock>
        </Intro>

        <Grid>
          {RESOURCES.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </Grid>
      </Content>
    </Layer>
  </Page>
);

export default Resources;
