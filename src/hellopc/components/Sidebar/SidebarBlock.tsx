import React from 'react';
import styled from 'styled-components';

/**
 * hello pc SidebarBlock — a grouped sidebar section (Figma ".elements/
 * sidebar_block", node 157:9049): a parent `SidebarItem` sitting full-bleed
 * across the top of a tinted panel, with its `SidebarSubItem`s stacked beneath.
 *
 * Purely presentational — it groups rows and paints the surface. The rows keep
 * their own Radix `Tabs.Trigger` behavior, so the block still lives inside a
 * `SidebarList` and takes part in the same roving-focus rail.
 */

/**
 * Figma calls this axis `platform` (windows / web). Named for what it does
 * here, since a component library has no platform: `translucent` is the
 * acrylic-style wash, `solid` the flat panel.
 */
export type SidebarBlockSurface = 'translucent' | 'solid';

/*
 * `--color-surfaces-container-pop-web` is defined in the dark and win-hct
 * themes but *not* in light.a, so used bare it resolves to nothing in the
 * default theme and the panel would come out transparent. The fallback keeps
 * the solid surface reading as a surface until the token is filled in — see
 * the docs page, this is a token gap to close rather than a styling choice.
 */
const SOLID_SURFACE =
  'var(--color-surfaces-container-pop-web, var(--color-surfaces-on-container-high))';

const Block = styled.div<{ $surface: SidebarBlockSurface }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  border-radius: var(--radius-200);
  overflow: hidden;
  background: ${(p) =>
    p.$surface === 'solid' ? SOLID_SURFACE : 'var(--color-surfaces-container-pop-windows)'};
`;

/** The nested rows. Figma insets the translucent panel by 4px and the solid one
 *  by 2px. */
const SubItems = styled.div<{ $surface: SidebarBlockSurface }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-025);
  width: 100%;
  padding: ${(p) => (p.$surface === 'solid' ? 'var(--space-025)' : 'var(--space-050)')};
`;

export interface SidebarBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The parent row — a `SidebarItem`, rendered full-bleed across the top. */
  item: React.ReactNode;
  /** The nested `SidebarSubItem`s. Omit them while the group is collapsed. */
  children?: React.ReactNode;
  /**
   * Surface treatment (Figma `platform`): `translucent` is the acrylic wash
   * (`platform=windows`), `solid` the flat panel (`platform=web`).
   * @default 'translucent'
   */
  surface?: SidebarBlockSurface;
}

export const SidebarBlock = React.forwardRef<HTMLDivElement, SidebarBlockProps>(
  ({ item, children, surface = 'translucent', ...props }, ref) => (
    <Block ref={ref} $surface={surface} {...props}>
      {item}
      {children ? <SubItems $surface={surface}>{children}</SubItems> : null}
    </Block>
  ),
);

SidebarBlock.displayName = 'SidebarBlock';

export default SidebarBlock;
