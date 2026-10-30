import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card } from '../hellopc/components/Card';
import { Badge } from '../hellopc/components/Badge';
import { Button } from '../hellopc/components/Button';
import { pageGutterX } from '../styles/pageChrome';
import { StickyWallpaper } from './HomePage';
import { BrandName, withBrand } from '../components/BrandName';
import heroBg from '../assets/home/hero-bg.png';

const ROOKERY = "'Rookery New', Rookery, var(--font-family)";

/**
 * Hero title on the wallpaper. Same ink mapping as Home/Resources:
 * white in light/dark, black in HCT (--color-text-icon-inverse flips wrong in dark.a).
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
  font-family: ${ROOKERY};
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

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-500);
  width: 100%;
  max-width: 48rem;
`;

/**
 * Figma card template (node 9877:99005): title, badge row (date + release type),
 * then body. Padding space-600 (32px); title uses type-size-title (20px).
 */
const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-600);
  box-sizing: border-box;
  font-family: ${ROOKERY};
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  align-items: flex-start;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-150);
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-primary);

  p {
    margin: 0;
  }
`;

const ChangeList = styled.ul`
  margin: 0;
  padding-left: var(--space-400);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-primary);

  li {
    margin-bottom: var(--space-100);

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-200);
  margin-top: var(--space-100);
`;

const LegacyDivider = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-400);
  width: 100%;
  padding-top: var(--space-200);
`;

const LegacyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-400);
  width: 100%;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const LegacyRule = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-stroke-border);
  width: 100%;
`;

const LegacyHeading = styled.h2`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-primary);
`;

/** Posts at or after the AI guidelines announcement (and the 1.0.0 release). */
const CURRENT_POSTS = [
  {
    id: 'cakeand-1-0-0',
    title: 'hello pc 1.0.0',
    date: 'August 13, 2026',
    release: 'major',
    body: [
      "We're excited to introduce hello pc 1.0.0.",
      "This release marks the beginning of a new chapter for Lenovo design. Built together by Lenovo and Motorola, hello pc unifies our design languages into a single PC software system that's modern, accessible, and ready for the future.",
      'Our goal is simple: help teams design, build, and ship with greater consistency and confidence. This release includes our new Figma library, React component library, Storybook documentation, design foundations, and developer resources—all working from the same source of truth.',
      "This is just the beginning. We'll continue evolving hello pc alongside our products and the teams who build them.",
    ],
  },
  {
    id: 'ai-guidelines',
    title: 'New AI guidelines added',
    date: 'May 12, 2026',
    release: 'major',
    body: [
      "We've introduced a new AI section to the hello pc to support a more consistent and scalable approach to AI experiences across Lenovo products. This update includes AI design principles, gradient usage guidance, and logo and icon direction that define how AI should be communicated through visual treatment, hierarchy, motion, and brand expression rather than relying on a single universal symbol.",
      'The new guidance outlines when to use AI gradients, how to apply segment-specific treatments for consumer, commercial, and internal products, and when AI logos or icons are appropriate within product experiences. These updates are intended to help teams create recognizable AI moments while avoiding icon overload and maintaining consistency across different product contexts.',
    ],
    links: [
      { label: 'AI Overview', to: '/foundations/ai/overview' },
      { label: 'AI Gradient', to: '/foundations/ai/gradient' },
      { label: 'AI Logo & Icon', to: '/foundations/ai/logo-icon' },
    ],
  },
];

/** Everything before the AI guidelines announcement. */
const LEGACY_POSTS = [
  {
    id: 'cake-web-v2',
    title: 'Cake Web V2 Update',
    date: 'October 8, 2025',
    release: 'major',
    changes: [
      'Launched Cake Web V2 — a modern, responsive design system built with React',
      'Comprehensive accessibility features meeting WCAG 2.2 AA standards',
      'Standardized design tokens and an enhanced component library',
    ],
  },
  {
    id: 'v1-4-0',
    title: 'v1.4.0',
    date: 'May 1, 2025',
    release: 'major',
    changes: [
      'Updated core components and focus state to meet WCAG 2.2 guidelines',
      'Improved interaction consistency across all core components',
      'Color contrast improvements for better readability and accessibility',
    ],
  },
  {
    id: 'v1-3-0',
    title: 'v1.3.0',
    date: 'July 17, 2024',
    release: 'minor',
    changes: [
      'Improved core component consistency and usability',
      'Refined Figma layout for easier navigation',
      'Added sections for raw components, themes, and usage guidelines',
    ],
  },
  {
    id: 'v1-2-8',
    title: 'v1.2.8',
    date: 'May 16, 2024',
    release: 'minor',
    changes: [
      'Added Date Picker component',
      'Updated asterisk required to error color token and SegoeUI font 14 style',
    ],
  },
  {
    id: 'v1-2-7',
    title: 'v1.2.7',
    date: 'May 8, 2024',
    release: 'minor',
    changes: ['Added Alerts component', 'Added "inline-alert" color token'],
  },
  {
    id: 'v1-2-3',
    title: 'v1.2.3',
    date: 'April 19, 2024',
    release: 'minor',
    changes: ['Added Horizontal Tabs component', 'S & XS breakpoint behaviors'],
  },
  {
    id: 'v1-2-0',
    title: 'v1.2.0',
    date: 'March 7, 2024',
    release: 'minor',
    changes: ['Enhancements to Alert components', 'Additional color tokens'],
  },
];

const ReleaseBadge = ({ release }) => {
  if (release === 'major') {
    return (
      <Badge color="primary" tone="solid" dot={false}>
        Major release
      </Badge>
    );
  }
  if (release === 'minor') {
    return (
      <Badge color="primary" tone="subtle" dot={false}>
        Minor release
      </Badge>
    );
  }
  return null;
};

const PostCard = ({ post, onNavigate }) => (
  <Card elevation="low">
    <CardInner>
      <TitleBlock>
        <CardTitle>{withBrand(post.title)}</CardTitle>
        <BadgeRow>
          <Badge color="secondary" tone="subtle" dot={false}>
            {post.date}
          </Badge>
          <ReleaseBadge release={post.release} />
        </BadgeRow>
      </TitleBlock>

      {post.body ? (
        <CardBody>
          {post.body.map((para) => (
            <p key={para.slice(0, 32)}>{withBrand(para)}</p>
          ))}
        </CardBody>
      ) : null}

      {post.changes ? (
        <ChangeList>
          {post.changes.map((change) => (
            <li key={change}>{change}</li>
          ))}
        </ChangeList>
      ) : null}

      {post.links?.length ? (
        <LinkRow>
          {post.links.map((link) => (
            <Button
              key={link.to}
              intent="secondary"
              variant="outline"
              size="sm"
              endIcon={<ArrowRight size={16} aria-hidden />}
              onClick={() => onNavigate(link.to)}
            >
              {link.label}
            </Button>
          ))}
        </LinkRow>
      ) : null}
    </CardInner>
  </Card>
);

const WhatsNew = () => {
  const navigate = useNavigate();

  return (
    <Page>
      <StickyWallpaper aria-hidden>
        <img src={heroBg} alt="" />
      </StickyWallpaper>

      <Layer>
        <Hero>
          <HeroTitle>What&apos;s new</HeroTitle>
        </Hero>

        <Content>
          <Intro>
            <IntroText>
              Track the latest updates, improvements, and releases for the{' '}
              <BrandName /> Design System.
            </IntroText>
            <div>
              <Button
                intent="primary"
                size="md"
                onClick={() => navigate('/version-control')}
              >
                View full version control
              </Button>
            </div>
          </Intro>

          <Feed>
            {CURRENT_POSTS.map((post) => (
              <PostCard key={post.id} post={post} onNavigate={navigate} />
            ))}
          </Feed>

          <LegacyDivider>
            <LegacyRule />
            <LegacyHeading>Cake [Legacy]</LegacyHeading>
            <LegacyGrid>
              {LEGACY_POSTS.map((post) => (
                <PostCard key={post.id} post={post} onNavigate={navigate} />
              ))}
            </LegacyGrid>
          </LegacyDivider>
        </Content>
      </Layer>
    </Page>
  );
};

export default WhatsNew;
