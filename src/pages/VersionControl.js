import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../hellopc/components/Card';
import { Badge } from '../hellopc/components/Badge';
import { pageGutterX } from '../styles/pageChrome';
import { StickyWallpaper } from './HomePage';
import { withBrand } from '../components/BrandName';
import heroBg from '../assets/home/hero-bg.png';

const ROOKERY = "'Rookery New', Rookery, var(--font-family)";

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

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  align-self: flex-start;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.2px;
  color: var(--color-primary-primary);
  text-decoration: none;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    text-decoration: underline;
    color: var(--color-primary-primary);
  }
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

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-400);
  max-width: 48rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${ROOKERY};
  font-size: var(--type-size-page);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-primary);
`;

const SectionCopy = styled.p`
  margin: 0;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);
  max-width: 40rem;
`;

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

const CardTitle = styled.h3`
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

const VersionTimeline = styled.div`
  position: relative;
  padding-left: var(--space-500);

  &::before {
    content: '';
    position: absolute;
    left: var(--space-100);
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-stroke-border);
  }
`;

const VersionEntry = styled.div`
  position: relative;
  margin-bottom: var(--space-500);

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: calc(-1 * var(--space-500) + var(--space-100) - 5px);
    top: 6px;
    width: 12px;
    height: 12px;
    border-radius: var(--radius-1000);
    background: ${(p) =>
      p.$latest
        ? 'var(--color-primary-primary)'
        : 'var(--color-secondary-secondary)'};
    border: var(--stroke-100) solid var(--color-surfaces-container);
    box-shadow: 0 0 0 2px var(--color-stroke-border);
  }
`;

const VersionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-150);
  margin-bottom: var(--space-300);
`;

const VersionNumber = styled.h3`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-150);
  font-family: ${ROOKERY};
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const VersionDate = styled.span`
  font-size: var(--type-size-caption);
  color: var(--color-text-icon-secondary);
  letter-spacing: 0.2px;
`;

const ChangeList = styled.ul`
  margin: 0;
  padding-left: var(--space-400);
  font-size: var(--type-size-body);
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--color-text-icon-secondary);

  li {
    margin-bottom: var(--space-100);

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: var(--color-text-icon-primary);
    font-weight: var(--font-weight-medium);
  }
`;

const StrategyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-400);
`;

/** Matches WhatsNew hello pc 1.0.0 / major Aug 13 entry. */
const CURRENT_RELEASE = {
  version: '1.0.0',
  date: 'August 13, 2026',
  title: 'hello pc 1.0.0',
  body: [
    "We're excited to introduce hello pc 1.0.0.",
    "This release marks the beginning of a new chapter for Lenovo design. Built together by Lenovo and Motorola, hello pc unifies our design languages into a single PC software system that's modern, accessible, and ready for the future.",
    'Our goal is simple: help teams design, build, and ship with greater consistency and confidence. This release includes our new Figma library, React component library, Storybook documentation, design foundations, and developer resources—all working from the same source of truth.',
    "This is just the beginning. We'll continue evolving hello pc alongside our products and the teams who build them.",
  ],
  changes: [
    { type: 'Added', text: 'Public hello pc Figma community library' },
    { type: 'Added', text: 'React component library on Radix with Storybook docs' },
    { type: 'Added', text: 'Design foundations — color, type, spacing, elevation, surfaces' },
    { type: 'Added', text: 'AI styling guidance for overview, gradient, and logo & icon' },
    { type: 'Added', text: 'Developer resources, data visualization playground, and AI Labs starter' },
  ],
};

const PRIOR_RELEASES = [
  {
    version: 'hello pc Web V2',
    date: 'October 8, 2025',
    description: 'Modern responsive design system built with React',
    changes: [
      { type: 'Added', text: 'hello pc Web V2 site and documentation' },
      { type: 'Added', text: 'WCAG 2.2 AA accessibility baseline' },
      { type: 'Added', text: 'Standardized design tokens and enhanced components' },
    ],
  },
  {
    version: '1.4.0',
    date: 'May 1, 2025',
    description: 'Accessibility and interaction consistency update',
    changes: [
      { type: 'Changed', text: 'Core components and focus states for WCAG 2.2' },
      { type: 'Changed', text: 'Interaction consistency across core components' },
      { type: 'Changed', text: 'Color contrast for readability' },
    ],
  },
];

const VersionControl = () => (
  <Page>
    <StickyWallpaper aria-hidden>
      <img src={heroBg} alt="" />
    </StickyWallpaper>

    <Layer>
      <Hero>
        <HeroTitle>Version control</HeroTitle>
      </Hero>

      <Content>
        <BackLink to="/resources/whats-new">
          <ArrowLeft aria-hidden />
          Back to what&apos;s new
        </BackLink>

        <Intro>
          <IntroText>
            {withBrand(
              'Track the evolution of hello pc through version history and changelog entries. We follow semantic versioning so teams know what changed and how to adopt it.',
            )}
          </IntroText>
        </Intro>

        <Section>
          <SectionTitle>Current version</SectionTitle>
          <SectionCopy>
            {withBrand(
              `We're currently on hello pc ${CURRENT_RELEASE.version}, our first major unified release across Figma, React, Storybook, and foundations.`,
            )}
          </SectionCopy>

          <Card elevation="low">
            <CardInner>
              <TitleBlock>
                <CardTitle>{withBrand(CURRENT_RELEASE.title)}</CardTitle>
                <BadgeRow>
                  <Badge color="secondary" tone="subtle" dot={false}>
                    {CURRENT_RELEASE.date}
                  </Badge>
                  <Badge color="primary" tone="solid" dot={false}>
                    Major release
                  </Badge>
                  <Badge color="primary" tone="subtle" dot={false}>
                    Latest
                  </Badge>
                </BadgeRow>
              </TitleBlock>
              <CardBody>
                {CURRENT_RELEASE.body.map((para) => (
                  <p key={para.slice(0, 40)}>{withBrand(para)}</p>
                ))}
              </CardBody>
            </CardInner>
          </Card>
        </Section>

        <Section>
          <SectionTitle>Changelog</SectionTitle>
          <SectionCopy>
            {withBrand(
              'A history of releases, improvements, and new features across hello pc and earlier hello pc Web milestones.',
            )}
          </SectionCopy>

          <VersionTimeline>
            <VersionEntry $latest>
              <VersionHeader>
                <VersionNumber>
                  v{CURRENT_RELEASE.version}
                  <Badge color="primary" tone="solid" dot={false}>
                    Latest
                  </Badge>
                  <Badge color="primary" tone="subtle" dot={false}>
                    Major
                  </Badge>
                </VersionNumber>
                <VersionDate>{CURRENT_RELEASE.date}</VersionDate>
                <IntroText>
                  Unified Lenovo + Motorola design system for PC software.
                </IntroText>
              </VersionHeader>
              <ChangeList>
                {CURRENT_RELEASE.changes.map((change) => (
                  <li key={change.text}>
                    <strong>{change.type}:</strong> {withBrand(change.text)}
                  </li>
                ))}
              </ChangeList>
            </VersionEntry>

            {PRIOR_RELEASES.map((release) => (
              <VersionEntry key={release.version}>
                <VersionHeader>
                  <VersionNumber>v{withBrand(release.version)}</VersionNumber>
                  <VersionDate>{release.date}</VersionDate>
                  <IntroText>{withBrand(release.description)}</IntroText>
                </VersionHeader>
                <ChangeList>
                  {release.changes.map((change) => (
                    <li key={change.text}>
                      <strong>{change.type}:</strong> {withBrand(change.text)}
                    </li>
                  ))}
                </ChangeList>
              </VersionEntry>
            ))}
          </VersionTimeline>
        </Section>

        <Section>
          <SectionTitle>Versioning strategy</SectionTitle>
          <SectionCopy>
            We follow semantic versioning (SemVer) to communicate the nature of
            each change clearly.
          </SectionCopy>
          <StrategyGrid>
            <Card elevation="low">
              <CardInner>
                <CardTitle>Major versions</CardTitle>
                <IntroText>
                  Incompatible API changes that may require updates to existing
                  implementations. These releases include breaking changes and new
                  major features.
                </IntroText>
              </CardInner>
            </Card>
            <Card elevation="low">
              <CardInner>
                <CardTitle>Minor versions</CardTitle>
                <IntroText>
                  New functionality added in a backwards-compatible manner —
                  features and improvements without breaking changes.
                </IntroText>
              </CardInner>
            </Card>
            <Card elevation="low">
              <CardInner>
                <CardTitle>Patch versions</CardTitle>
                <IntroText>
                  Backwards-compatible bug fixes and minor improvements focused on
                  stability.
                </IntroText>
              </CardInner>
            </Card>
          </StrategyGrid>
        </Section>
      </Content>
    </Layer>
  </Page>
);

export default VersionControl;
