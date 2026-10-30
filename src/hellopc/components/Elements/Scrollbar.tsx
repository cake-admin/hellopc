import React from 'react';
import { ScrollArea as RadixScrollArea } from 'radix-ui';
import styled, { css } from 'styled-components';

/**
 * hello pc Scrollbar — the design-system scroll surface (Figma "Scrollbar", node
 * 123:6261). Wrap any overflowing content and it gets the tokenized hello pc
 * scrollbar: a grey thumb that rests thin and widens while you interact with
 * it. Behavior (overflow, drag, keyboard, touch) is delegated to the Radix
 * `ScrollArea` primitive; only the look is themed, from hello pc tokens that
 * mirror the Figma variables 1:1 and re-theme via `[data-theme]`.
 *
 * A `ScrollArea` can't be nested inside every primitive (Radix `Select`, for
 * one, owns its own viewport), so this module also exports
 * `nativeScrollbarStyles` — the same thumb look for native-overflow surfaces —
 * keeping every scrollbar in the system visually identical.
 */

/* Figma "Scrollbar" (node 123:6261) intrinsic bar geometry: the thumb is 4px
   wide at rest (variant scrolling=no) and widens to 8px while scrolling /
   hovering (scrolling=yes). These are the component's defining dimensions —
   no spacing token equals them — cited per the devkit no-hardcoded-px rule. */
const THUMB_REST = '4px';
const THUMB_ACTIVE = '8px';

/** Normalize a number (→px) or CSS length into a `max-*` value; `none` clears it. */
const cssSize = (v?: number | string): string =>
  v === undefined || v === null ? 'none' : typeof v === 'number' ? `${v}px` : v;

const Root = styled(RadixScrollArea.Root)`
  position: relative;
  overflow: hidden;
`;

const Viewport = styled(RadixScrollArea.Viewport)<{ $horizontal: boolean }>`
  width: 100%;
  height: 100%;
  /* The caps live here, on the actual overflow:scroll container — not on the
     Root. A percentage height on the Viewport resolves against an indefinite
     Root as auto, so capping the Root instead never makes the vertical axis a
     bounded scroll container (the thumb would never appear). */
  max-height: var(--_max-height);
  max-width: var(--_max-width);

  /* Radix sets its content wrapper to display:table with min-width:100%, and
     that table display is load-bearing: it makes the wrapper size to its
     children on both axes, which is how Radix measures content to work out the
     thumb's length. Overriding it to block defeats that measurement and the
     thumb renders full-length instead of proportional.

     Vertical-only scrollers still need the wrapper not to grow past the
     viewport, or a wide child stretches the table and text-overflow:ellipsis
     stops working in menus. Capping max-width does that without touching the
     display, so measurement survives. Horizontal axes get no cap — content
     growing wider is exactly what makes them scroll. */
  ${(p) =>
    p.$horizontal
      ? ''
      : css`
          & > div {
            max-width: 100%;
          }
        `}
`;

/** The scrollbar track — transparent, with a 4px inset so the thumb floats off
 *  the edge. Widens on hover/drag so the thumb goes 4px → 8px (Figma states). */
const Bar = styled(RadixScrollArea.Scrollbar)`
  display: flex;
  user-select: none;
  touch-action: none;
  background: transparent;

  &[data-orientation='vertical'] {
    width: calc(${THUMB_REST} + var(--space-050) * 2);
    padding: var(--space-050);
    transition: width 140ms ease;
  }
  &[data-orientation='vertical']:hover,
  &[data-orientation='vertical'][data-state='visible']:active {
    width: calc(${THUMB_ACTIVE} + var(--space-050) * 2);
  }

  &[data-orientation='horizontal'] {
    flex-direction: column;
    height: calc(${THUMB_REST} + var(--space-050) * 2);
    padding: var(--space-050);
    transition: height 140ms ease;
  }
  &[data-orientation='horizontal']:hover,
  &[data-orientation='horizontal'][data-state='visible']:active {
    height: calc(${THUMB_ACTIVE} + var(--space-050) * 2);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Thumb = styled(RadixScrollArea.Thumb)`
  flex: 1;
  border-radius: var(--radius-50);
  background: var(--color-stroke-border-high);
`;

const Corner = styled(RadixScrollArea.Corner)`
  background: transparent;
`;

/**
 * Native-overflow scrollbar styling — the same grey thumb (`4px`,
 * `--color-stroke-border-high`, `--radius-50`) applied via `scrollbar-*` /
 * `::-webkit-scrollbar` rules. Use it on surfaces that must keep native
 * overflow and can't host a `ScrollArea` (e.g. a Radix `Select` viewport), so
 * their scrollbar matches the `Scrollbar` component.
 */
export const nativeScrollbarStyles = css`
  scrollbar-width: thin;
  scrollbar-color: var(--color-stroke-border-high) transparent;

  &::-webkit-scrollbar {
    width: var(--space-050);
    height: var(--space-050);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-stroke-border-high);
    border-radius: var(--radius-50);
  }
`;

export interface ScrollbarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixScrollArea.Root>, 'children'> {
  /** The scrollable content. */
  children: React.ReactNode;
  /** Caps the viewport height; the vertical scrollbar appears when content overflows. */
  maxHeight?: number | string;
  /** Caps the viewport width; the horizontal scrollbar appears when content overflows. */
  maxWidth?: number | string;
  /**
   * Which scrollbars to render.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Props forwarded to the scrollable viewport — add padding/layout here. */
  viewportProps?: React.ComponentPropsWithoutRef<typeof RadixScrollArea.Viewport>;
}

/**
 * The scroll surface. Forwards every Radix `ScrollArea.Root` prop (`type`,
 * `scrollHideDelay`, …); `type` defaults to `'auto'` so the scrollbar shows
 * only when content overflows.
 */
export const Scrollbar = React.forwardRef<HTMLDivElement, ScrollbarProps>(
  (
    { children, maxHeight, maxWidth, orientation = 'vertical', type = 'auto', viewportProps, style, ...props },
    ref,
  ) => (
    <Root ref={ref} type={type} style={style} {...props}>
      <Viewport
        $horizontal={orientation !== 'vertical'}
        {...viewportProps}
        style={
          {
            '--_max-height': cssSize(maxHeight),
            '--_max-width': cssSize(maxWidth),
            ...viewportProps?.style,
          } as React.CSSProperties
        }
      >
        {children}
      </Viewport>
      {orientation !== 'horizontal' ? (
        <Bar orientation="vertical">
          <Thumb />
        </Bar>
      ) : null}
      {orientation !== 'vertical' ? (
        <Bar orientation="horizontal">
          <Thumb />
        </Bar>
      ) : null}
      {orientation === 'both' ? <Corner /> : null}
    </Root>
  ),
);

Scrollbar.displayName = 'Scrollbar';

export default Scrollbar;
