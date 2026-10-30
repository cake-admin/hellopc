import React from 'react';
import styled from 'styled-components';

/**
 * hello pc Content Card — the horizontal content card template (Figma
 * `_elements / content card`, node 183:11846). Content that slots into a
 * **Card**: a text column (leading eyebrow, title, body, actions) beside a
 * square media slot.
 *
 * It carries the layout, type scale, and spacing; the buttons and the media are
 * yours (compose hello pc **Button**s into `actions` — a secondary before a
 * primary, per the button-group rule — and any node into `media`). Being
 * presentational it wraps no Radix primitive. Every value resolves from hello pc
 * tokens, so the **Theme** toolbar re-themes it live. Place it inside a
 * `<Card>` for the surface and elevation.
 */

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-600);
  /* p-24 from Figma 183:11846 */
  padding: var(--space-500);
  font-family: var(--font-family);
`;

const Content = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: var(--space-300);
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: 100%;
`;

const LeadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  width: 100%;
  color: var(--color-text-icon-secondary);
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
  color: var(--color-text-icon-secondary);
`;

const Title = styled.h3`
  margin: 0;
  width: 100%;
  font-size: var(--type-size-subtitle);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const BodyGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-500);
  width: 100%;
`;

const Text = styled.p`
  margin: 0;
  width: 100%;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-secondary);
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
`;

/** Square media slot — 200px in Figma, 16px radius; clips its content. */
const Media = styled.div`
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: var(--radius-300);
  overflow: hidden;
  background: var(--color-surfaces-on-container);
`;

/* `title` is redeclared as a ReactNode, so the DOM's `title?: string` (the
   tooltip attribute) is omitted rather than conflicting with it. */
export interface ContentCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Eyebrow text above the title (Figma "Leading text", secondary color). */
  leadingText?: React.ReactNode;
  /** Optional 24px icon before the leading text; inherits the text color. */
  leadingIcon?: React.ReactNode;
  /** The card title (Figma 18px `bold.18`). */
  title: React.ReactNode;
  /** Body paragraph (Figma 14px `regular.14.body`, secondary color). */
  body?: React.ReactNode;
  /** Actions row — a hello pc **Button** group (secondary before primary). */
  actions?: React.ReactNode;
  /** Square media on the trailing side — an image or any node; clipped to a 16px radius. */
  media?: React.ReactNode;
}

/**
 * The horizontal content card template: a text column beside a square media
 * slot. Slot it into a `<Card>` for the surface and elevation.
 */
export const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  ({ leadingText, leadingIcon, title, body, actions, media, ...props }, ref) => (
    <Root ref={ref} {...props}>
      <Content>
        <Header>
          {leadingText != null || leadingIcon != null ? (
            <LeadingRow>
              {leadingIcon != null ? <LeadingIcon aria-hidden>{leadingIcon}</LeadingIcon> : null}
              {leadingText != null ? <Leading>{leadingText}</Leading> : null}
            </LeadingRow>
          ) : null}
          <Title>{title}</Title>
        </Header>
        {body != null || actions != null ? (
          <BodyGroup>
            {body != null ? <Text>{body}</Text> : null}
            {actions != null ? <Actions>{actions}</Actions> : null}
          </BodyGroup>
        ) : null}
      </Content>
      {media != null ? <Media>{media}</Media> : null}
    </Root>
  ),
);

ContentCard.displayName = 'ContentCard';

export default ContentCard;
