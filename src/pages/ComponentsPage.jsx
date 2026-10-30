import React from 'react';
import styled from 'styled-components';
import {
  VerticalTabs,
  VerticalTabsList,
  VerticalTabsContent,
} from '../hellopc/components/VerticalTabs/VerticalTabs';
import { VerticalTabItem } from '../hellopc/components/VerticalTabs/VerticalTabItem';
import { pageGutterX, stickyDocsRail } from '../styles/pageChrome';
import { StickyWallpaper } from './HomePage';
import heroBg from '../assets/home/hero-bg.png';
import {
  RailSection,
  RailSectionTitle,
  ROOKERY,
  SectionIntro,
} from './components/chrome';
import { CATEGORIES, PANELS } from './components/panels';

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
   * into the rail column. Force them out of flow.
   */
  &[data-state='inactive'],
  &[hidden] {
    display: none;
  }

  @media (max-width: 720px) {
    grid-column: 1;
  }
`;

const ComponentsPage = () => (
  <Page>
    <StickyWallpaper aria-hidden>
      <img src={heroBg} alt="" />
    </StickyWallpaper>

    <Layer>
      <Hero>
        <HeroTitle>Components</HeroTitle>
      </Hero>

      <Content>
        <Layout defaultValue="buttons">
          <Rail aria-label="Component categories">
            {CATEGORIES.map((category) => (
              <RailSection key={category.id}>
                <RailSectionTitle>{category.label}</RailSectionTitle>
                {category.items.map((item) => (
                  <VerticalTabItem key={item.id} value={item.id}>
                    {item.label}
                  </VerticalTabItem>
                ))}
              </RailSection>
            ))}
          </Rail>

          {PANELS.map(({ id, title, paragraphs, storybook, ctas, Preview }) => (
            <Panel key={id} value={id}>
              <SectionIntro
                title={title}
                paragraphs={paragraphs}
                storybook={storybook}
                ctas={ctas}
              />
              <Preview />
            </Panel>
          ))}
        </Layout>
      </Content>
    </Layer>
  </Page>
);

export default ComponentsPage;
