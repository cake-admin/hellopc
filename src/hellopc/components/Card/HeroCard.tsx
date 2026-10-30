import React from 'react';
import styled, { css } from 'styled-components';

export type HeroCardAlign = 'start' | 'center';

/**
 * hello pc Hero Card — the marketing hero card template (Figma `hero card`, node
 * 183:11829, and its centered `banner card` variant, node 183:11878). It is
 * content that slots into a **Card**: an optional leading eyebrow (icon + text),
 * a large display title, one or two body paragraphs, and an actions row.
 *
 * `align` covers both Figma templates — `start` is the left-aligned hero,
 * `center` is the banner. It carries the type scale and spacing; the buttons are
 * yours (compose a hello pc **Button** into `actions` — `fill` for the hero,
 * `tonal` for the banner). Being presentational it wraps no Radix primitive.
 * Every value resolves from hello pc tokens, so the **Theme** toolbar re-themes it
 * live. Place it inside a `<Card>`, which supplies the surface + elevation.
 */

const Root = styled.div<{ $align: HeroCardAlign }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  /* p-32 from Figma 183:11829 */
  padding: var(--space-600);
  align-items: ${(p) => (p.$align === 'center' ? 'center' : 'flex-start')};
  text-align: ${(p) => (p.$align === 'center' ? 'center' : 'left')};
  font-family: var(--font-family);
`;

const Header = styled.div<{ $align: HeroCardAlign }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
  align-items: ${(p) => (p.$align === 'center' ? 'center' : 'flex-start')};
`;

const LeadingRow = styled.div<{ $align: HeroCardAlign }>`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  color: var(--color-text-icon-primary);
  ${(p) => (p.$align === 'center' ? 'justify-content: center;' : 'width: 100%;')}
`;

const LeadingIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const Leading = styled.span`
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const Title = styled.h2`
  margin: 0;
  width: 100%;
  font-size: var(--type-size-hero);
  font-weight: var(--font-weight-bold);
  /* Figma bold.42 tracking; no token carries letter-spacing. */
  letter-spacing: -0.6px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const Body = styled.div<{ $align: HeroCardAlign }>`
  display: flex;
  flex-direction: column;
  gap: var(--space-600);
  width: 100%;
  align-items: ${(p) => (p.$align === 'center' ? 'center' : 'flex-start')};
`;

const bodyText = css`
  margin: 0;
  width: 100%;
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

/** Primary body — 20px (Figma regular.20.title). */
const Lead = styled.p`
  ${bodyText}
  font-size: var(--type-size-title);
  letter-spacing: 0.4px;
`;

/** Secondary body — 16px (Figma regular.16). */
const Sub = styled.p`
  ${bodyText}
  font-size: var(--type-size-subject);
  letter-spacing: 0.2px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
`;

/* `title` is redeclared as a ReactNode, so the DOM's `title?: string` (the
   tooltip attribute) is omitted rather than conflicting with it. */
export interface HeroCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Eyebrow text above the title (Figma "Leading text"). */
  leadingText?: React.ReactNode;
  /** Optional 24px icon before the leading text; inherits the text color. */
  leadingIcon?: React.ReactNode;
  /** The display title (Figma 42px `bold.42`). */
  title: React.ReactNode;
  /** Primary body paragraph (Figma 20px `regular.20.title`). */
  body?: React.ReactNode;
  /** Secondary body paragraph (Figma 16px `regular.16`). */
  secondaryBody?: React.ReactNode;
  /** Actions row — compose a hello pc **Button** (`fill` for hero, `tonal` for banner). */
  actions?: React.ReactNode;
  /**
   * `start` is the left-aligned hero (Figma `hero card`); `center` is the
   * centered banner (Figma `banner card`).
   * @default 'start'
   */
  align?: HeroCardAlign;
}

/**
 * The hero/banner card template. Fill the text props; drop a **Button** into
 * `actions`. Slot it into a `<Card>` for the surface and elevation.
 */
export const HeroCard = React.forwardRef<HTMLDivElement, HeroCardProps>(
  ({ leadingText, leadingIcon, title, body, secondaryBody, actions, align = 'start', ...props }, ref) => (
    <Root ref={ref} $align={align} {...props}>
      <Header $align={align}>
        {leadingText != null || leadingIcon != null ? (
          <LeadingRow $align={align}>
            {leadingIcon != null ? <LeadingIcon aria-hidden>{leadingIcon}</LeadingIcon> : null}
            {leadingText != null ? <Leading>{leadingText}</Leading> : null}
          </LeadingRow>
        ) : null}
        <Title>{title}</Title>
      </Header>
      {body != null || secondaryBody != null || actions != null ? (
        <Body $align={align}>
          {body != null ? <Lead>{body}</Lead> : null}
          {secondaryBody != null ? <Sub>{secondaryBody}</Sub> : null}
          {actions != null ? <Actions>{actions}</Actions> : null}
        </Body>
      ) : null}
    </Root>
  ),
);

HeroCard.displayName = 'HeroCard';

export default HeroCard;
