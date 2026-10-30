import React from 'react';
import styled from 'styled-components';

import { Scrollbar } from '../Elements/Scrollbar';

/**
 * hello pc MenuContainer — the elevated surface/slot that holds menu content
 * (Figma "&menu.container", node 86:4569). It is a composite: it supplies the
 * container surface, padding, and scroll behavior, and renders whatever
 * children it is given — Menu Header, Menu Item, Divider, or arbitrary content
 * such as a text input.
 *
 * Scrolling is delegated to the shared `Scrollbar` element (the hello pc Radix
 * `ScrollArea` wrapper); when `maxHeight` is set and the content overflows, the
 * tokenized scrollbar appears. The container stays semantically neutral (no
 * hardcoded `role="menu"`) so it can host non-menu content; pass `role="menu"`
 * when composing actual menu items.
 */

const Surface = styled.div`
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background: var(--color-surfaces-container);
  border-radius: var(--radius-300);
  box-shadow: var(--elevation-3);
`;

const Slot = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  padding: var(--space-100);
`;

export interface MenuContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Menu content: Menu Header, Menu Item, Divider, or any custom nodes. */
  children: React.ReactNode;
  /**
   * Caps the content height and enables the Radix scroll area. When content
   * fits within this height no scrollbar is shown.
   */
  maxHeight?: number | string;
  /**
   * Container width. The Figma specimen is 320px; pass a number (px) or any CSS
   * width (e.g. `'100%'`).
   * @default 320
   */
  width?: number | string;
}

export const MenuContainer = React.forwardRef<HTMLDivElement, MenuContainerProps>(
  ({ children, maxHeight, width = 320, style, ...props }, ref) => (
    <Surface ref={ref} style={{ width, ...style }} {...props}>
      <Scrollbar type="auto" maxHeight={maxHeight}>
        <Slot>{children}</Slot>
      </Scrollbar>
    </Surface>
  ),
);

MenuContainer.displayName = 'MenuContainer';

export default MenuContainer;
