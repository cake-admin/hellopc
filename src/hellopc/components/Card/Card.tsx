import React from 'react';
import styled from 'styled-components';

export type CardElevation = 'low' | 'high';

/** elevation → Figma `elevation/<n>` token (see Foundations/Elevation). */
const ELEVATION: Record<CardElevation, string> = {
  low: 'var(--elevation-0)',
  high: 'var(--elevation-0)',
};

/**
 * hello pc Card — an elevated surface that frames a slot of content (Figma
 * `&Card`, node 182:11794). It is a container and nothing more: a rounded
 * `--radius-400` (24px) `--color-surfaces-container` surface that lifts off the
 * page with a token drop shadow and clips its content to the rounded corners.
 * What goes inside is yours — plain content, or the card templates that slot in.
 *
 * Being presentational, Card wraps no Radix primitive (there is none for a
 * surface, and nothing interactive to delegate) — it renders a semantic
 * `<div>`, the same call the static **Badge** makes. Every value resolves from
 * hello pc token custom properties, so the **Theme** toolbar re-themes it live.
 *
 * The slot is flush — Card adds no inner padding — so edge-to-edge media reaches
 * the corners (that's what `overflow: hidden` is for). Content that needs insets
 * brings its own padding (the templates do).
 */

const Root = styled.div<{ $elevation: CardElevation }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  /* Clip children to the rounded corners so media/backgrounds bleed to the edge. */
  overflow: hidden;
  border-radius: var(--radius-400);
  background: var(--color-surfaces-container);
  box-shadow: ${(p) => ELEVATION[p.$elevation]};

  /*
   * Windows HCT collapses elevation + container surfaces onto the canvas, so
   * cards lose their edge. Match Dropdown: a real stroke token border.
   */
  :root[data-theme='win hct'] &,
  [data-theme='win hct'] & {
    border: var(--stroke-100) solid var(--color-stroke-border);
    box-shadow: none;
  }
`;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The card's content — plain nodes, or a card template that slots in. */
  children?: React.ReactNode;
  /**
   * Drop-shadow depth. Both currently resolve to the Figma `elevation/0`
   * resting shadow (`--elevation-0`) — `high` is reserved for a raised/
   * floating treatment once that spec is confirmed against Figma.
   * @default 'low'
   */
  elevation?: CardElevation;
}

/**
 * An elevated container. Give it content (or a card template) as `children`;
 * it supplies the surface, corner radius, and shadow.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, elevation = 'low', ...props }, ref) => (
    <Root ref={ref} $elevation={elevation} {...props}>
      {children}
    </Root>
  ),
);

Card.displayName = 'Card';

export default Card;
