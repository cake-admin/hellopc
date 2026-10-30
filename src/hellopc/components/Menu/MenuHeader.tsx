import React from 'react';
import { DropdownMenu } from 'radix-ui';
import styled from 'styled-components';

const Root = styled(DropdownMenu.Label)`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--space-075) var(--space-150);
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

export interface MenuHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Non-interactive label for the menu group that follows. */
  children: React.ReactNode;
}

/**
 * hello pc MenuHeader — a non-interactive group label for a Radix dropdown menu
 * (Figma "&menu.header", node 85:4481). It wraps `DropdownMenu.Label`, so the
 * label inherits the correct menu primitive semantics without adding a focus
 * stop or imitating a selectable menu item.
 */
export const MenuHeader = React.forwardRef<HTMLDivElement, MenuHeaderProps>(
  ({ children, ...props }, ref) => (
    <Root ref={ref} {...props}>
      {children}
    </Root>
  ),
);

MenuHeader.displayName = 'MenuHeader';

export default MenuHeader;
