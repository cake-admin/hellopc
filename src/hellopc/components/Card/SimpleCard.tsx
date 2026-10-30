import React from 'react';
import styled from 'styled-components';

/**
 * hello pc Simple Card — the vertical media card template (Figma
 * `_elements / simple card`, node 183:11859). Content that slots into a
 * **Card**: a full-bleed media area on top, then a title with an optional
 * overflow menu, a body paragraph, and an actions row.
 *
 * The media is full-bleed so it reaches the card's rounded corners (the
 * enclosing **Card**'s `overflow: hidden` clips it); the rest sits in padded
 * content. It carries the layout and type scale; the media, menu, and buttons
 * are yours (compose a hello pc **IconButton** into `menu` and **Button**s into
 * `actions`). Being presentational it wraps no Radix primitive. Every value
 * resolves from hello pc tokens, so the **Theme** toolbar re-themes it live. Place
 * it inside a `<Card>` for the surface and elevation.
 */

const Root = styled.div`
  display: flex;
  flex-direction: column;
  font-family: var(--font-family);
`;

/** Full-bleed media strip — no padding, so it reaches the Card's corners. */
const Media = styled.div`
  width: 100%;
  overflow: hidden;
  background: var(--color-surfaces-on-container);
  & > img,
  & > video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-500);
  /* p-24 from Figma 183:11861 */
  padding: var(--space-500);
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
`;

const Title = styled.h3`
  flex: 1 0 0;
  margin: 0;
  min-width: 0;
  font-size: var(--type-size-subtitle);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const Menu = styled.div`
  flex-shrink: 0;
  display: inline-flex;
`;

const Text = styled.p`
  margin: 0;
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

/* `title` is redeclared as a ReactNode, so the DOM's `title?: string` (the
   tooltip attribute) is omitted rather than conflicting with it. */
export interface SimpleCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Full-bleed media on top — an image or any node; clipped to the Card's corners. */
  media?: React.ReactNode;
  /** The card title (Figma 18px `bold.18`). */
  title: React.ReactNode;
  /** Trailing overflow control beside the title — a hello pc **IconButton** (e.g. a "⋮" menu). */
  menu?: React.ReactNode;
  /** Body paragraph (Figma 14px `regular.14.body`, secondary color). */
  body?: React.ReactNode;
  /** Actions row — a hello pc **Button** or button group. */
  actions?: React.ReactNode;
}

/**
 * The vertical media card template: full-bleed media, a title with an optional
 * menu, a body, and actions. Slot it into a `<Card>` for the surface and
 * elevation.
 */
export const SimpleCard = React.forwardRef<HTMLDivElement, SimpleCardProps>(
  ({ media, title, menu, body, actions, ...props }, ref) => (
    <Root ref={ref} {...props}>
      {media != null ? <Media>{media}</Media> : null}
      <Content>
        <Head>
          <TitleRow>
            <Title>{title}</Title>
            {menu != null ? <Menu>{menu}</Menu> : null}
          </TitleRow>
          {body != null ? <Text>{body}</Text> : null}
        </Head>
        {actions != null ? <Actions>{actions}</Actions> : null}
      </Content>
    </Root>
  ),
);

SimpleCard.displayName = 'SimpleCard';

export default SimpleCard;
