import React from 'react';
import styled from 'styled-components';

/**
 * hello pc Data Card (Figma `hellopc.data.card`, node 18275:745).
 *
 * A card that holds data — a table, a chart, KPIs, or a mix — with a
 * consistent header and footer. The header pairs a title (and optional
 * description) with a `tools` slot (segments **ContentSwitcher** `size="sm"`,
 * an "AI summary" **Button**, a "more" **IconButton**); the `children` content
 * sits in a bordered, 8px-rounded well; the footer carries the data's sources /
 * as-of line and a "View all" **Button**.
 *
 * Not a **Card** variant: it is flat — a 1px border, 12px radius, no shadow —
 * and owns its own header/footer structure. It renders a `<section>` named by
 * its title. Every value resolves from hello pc token custom properties.
 */

const Root = styled.section`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  width: 100%;
  padding: var(--space-500);
  background: var(--color-surfaces-container);
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-200);
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
`;

/** Figma 18275:746 `header` — title group + tools, gap-16. */
const Header = styled.header`
  display: flex;
  align-items: flex-start;
  gap: var(--space-300);
  min-width: 0;
`;

/** Figma 18275:747 `title group` — title over description, gap-4. */
const TitleGroup = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: var(--space-050);
  min-width: 0;
  line-height: 1.35;
`;

/** Figma medium.20.title. */
const Title = styled.h2`
  margin: 0;
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

/** Figma regular.14.body. */
const Description = styled.p`
  margin: 0;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  /* Figma regular.14.body tracking; no token carries letter-spacing. */
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

/** Figma 18275:750 `tools` — gap-8. */
const Tools = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  flex-shrink: 0;
`;

/** Figma 18275:813 `Content` — a bordered well that clips its child to 8px corners. */
const Content = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-150);
`;

/** Figma 18275:1034 `footer` — sources · spacer · View all, gap-8. */
const Footer = styled.footer`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

/** Figma regular.12. */
const Sources = styled.p`
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

export type DataCardHeadingLevel = 'h2' | 'h3' | 'h4';

export interface DataCardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Card title (Figma `title`), medium 20px. Also the section's accessible name. */
  title: React.ReactNode;
  /** Optional one-line description under the title (Figma `showDescription`). */
  description?: React.ReactNode;
  /**
   * Header tools, right-aligned: a segments **ContentSwitcher** (`size="sm"`,
   * `intent="secondary"`), an "AI summary" **Button** (`size="sm"` primary
   * tonal), a "more" **IconButton** (`size="sm"` ghost) — any subset.
   */
  tools?: React.ReactNode;
  /** The data — a **Table**, a chart, KPIs — shown in the bordered content well. */
  children?: React.ReactNode;
  /** Footer provenance line, e.g. "Sources: Source name · As of 05 Dec 2026" (12px). */
  sources?: React.ReactNode;
  /** Footer action — a "View all" **Button** (`size="sm"` primary ghost). */
  footerAction?: React.ReactNode;
  /** Heading level for the title, to fit the page outline. @default 'h2' */
  headingLevel?: DataCardHeadingLevel;
}

/**
 * A flat data card: title + description + tools · bordered content well ·
 * sources + View all. Compose existing pieces into its slots.
 */
export const DataCard = React.forwardRef<HTMLElement, DataCardProps>(
  (
    {
      title,
      description,
      tools,
      children,
      sources,
      footerAction,
      headingLevel = 'h2',
      ...props
    },
    ref,
  ) => {
    const titleId = React.useId();
    const showFooter = sources != null || footerAction != null;
    return (
      <Root ref={ref} aria-labelledby={titleId} {...props}>
        <Header>
          <TitleGroup>
            <Title as={headingLevel} id={titleId}>
              {title}
            </Title>
            {description != null ? <Description>{description}</Description> : null}
          </TitleGroup>
          {tools != null ? <Tools>{tools}</Tools> : null}
        </Header>
        {children != null ? <Content>{children}</Content> : null}
        {showFooter ? (
          <Footer>
            <Sources>{sources}</Sources>
            {footerAction}
          </Footer>
        ) : null}
      </Root>
    );
  },
);

DataCard.displayName = 'DataCard';

export default DataCard;
