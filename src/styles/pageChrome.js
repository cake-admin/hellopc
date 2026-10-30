import styled, { css } from 'styled-components';
import { nativeScrollbarStyles } from '../hellopc/components/Elements/Scrollbar';

/**
 * Horizontal page gutter shared by TopNav and wallpaper page sections.
 * Mobile/tablet: --space-600; desktop (≥960px): --space-800.
 */
export const pageGutterX = css`
  padding-left: var(--space-600);
  padding-right: var(--space-600);

  @media (min-width: 960px) {
    padding-left: var(--space-800);
    padding-right: var(--space-800);
  }
`;

/**
 * Sticky docs tab rail, shared by the Components, Foundations, and Sound pages.
 *
 * TopNav is `position: fixed` and its BarSpacer only pushes *static* content
 * down, so a sticky rail has to offset itself by the bar's measured height
 * (--topnav-height, published by TopNav) or it scrolls behind the nav and its
 * top tabs get clipped.
 *
 * The height cap is what makes that offset hold. A rail as tall as its grid
 * container (the case whenever the open panel is shorter than the rail) has no
 * range to stick in, so it just scrolls with the page and ends up bottom-
 * aligned against the container — back under the nav. Capping the rail to the
 * space actually available between the nav and the page's bottom chrome keeps
 * it clear at every scroll position, and it scrolls internally so a rail taller
 * than that (Components) keeps all of its items reachable.
 */
export const stickyDocsRail = css`
  grid-column: 1;
  width: 100%;
  max-width: 220px;
  flex-shrink: 0;
  align-self: start;
  position: sticky;
  top: calc(var(--topnav-height, 64px) + var(--space-400));
  /* Viewport, less: the fixed nav, this rail's own top offset, the page
     Content's padding-bottom (--space-600) and the site footer (48px). */
  max-height: calc(
    100vh - var(--topnav-height, 64px) - var(--space-400) - var(--space-600) -
      var(--space-800)
  );
  overflow-y: auto;
  ${nativeScrollbarStyles}

  @media (max-width: 720px) {
    max-width: none;
    position: static;
    max-height: none;
    overflow-y: visible;
  }
`;

/** Shared page shell primitives — token-driven, for marketing/docs pages. */

export const PageContainer = styled.div`
  padding: var(--space-600) var(--space-400) var(--space-1000);
  max-width: 1200px;
  margin: 0 auto;
  min-height: 60vh;
  font-family: var(--font-family);
  box-sizing: border-box;
`;

export const PageHeader = styled.div`
  margin-bottom: var(--space-800);
`;

export const PageTitle = styled.h1`
  margin: 0 0 var(--space-200);
  font-family: 'Rookery New', Rookery, var(--font-family);
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-icon-primary);
`;

export const PageDescription = styled.p`
  margin: 0;
  font-size: var(--type-size-subject);
  line-height: 1.5;
  color: var(--color-text-icon-secondary);
  max-width: 40rem;
`;

export const Section = styled.section`
  margin-bottom: var(--space-800);

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0 0 var(--space-200);
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  font-size: var(--type-size-subtitle);
  color: var(--color-text-icon-primary);
`;

export const SectionDescription = styled.p`
  margin: 0 0 var(--space-400);
  font-size: var(--type-size-body);
  line-height: 1.5;
  color: var(--color-text-icon-secondary);
  max-width: 42rem;
`;
