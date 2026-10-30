import React from 'react';
import styled from 'styled-components';
import { MoreHorizontal, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { Avatar } from '../Avatar/Avatar';
import { IconButton } from '../Button/IconButton';
import { Scrollbar } from '../Elements/Scrollbar';
import { SidebarList } from './Sidebar';
import { SidebarCollapsedContext } from './SidebarContext';
import { SidebarDivider } from './SidebarSection';

/**
 * hello pc SidebarNav — the app sidebar shell (Figma "Sidebar", node 160:9393):
 * a brand header, the navigation rail, and a footer holding the collapse
 * toggle and the signed-in user.
 *
 * Composes the pieces rather than rebuilding them: the rail is `SidebarList`
 * (so the rows keep their Radix Tabs behavior), the footer rule is
 * `SidebarDivider`, the user avatar is the hello pc **Avatar**, and every control
 * is an **IconButton**. Rows go in as children — `SidebarItem`,
 * `SidebarSubItem`, `SidebarBlock`, `SidebarSectionHeader`, `SidebarDivider`.
 *
 * Goes inside `Sidebar` (the Tabs root), so panels can sit beside it:
 *
 * ```tsx
 * <Sidebar defaultValue="home">
 *   <SidebarNav aria-label="Main navigation">…rows…</SidebarNav>
 *   <SidebarContent value="home">…</SidebarContent>
 * </Sidebar>
 * ```
 */

/* Figma 160:9394 intrinsic geometry: the rail is 280px expanded and 80px
   collapsed; brand row 40px, logo 32px. The collapsed rail is widened to 96px
   so a centred 24px icon keeps comfortable breathing room beside the scrollbar
   gutter — Figma draws the collapsed rail without a scrollbar. */
const WIDTH_EXPANDED = 280;
const WIDTH_COLLAPSED = 96;
const BRAND_ROW_HEIGHT = 40;
const LOGO_SIZE = 32;

export type SidebarNavSurface = 'translucent' | 'solid';

const Frame = styled.nav<{ $collapsed: boolean; $surface: SidebarNavSurface }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-050);
  width: ${(p) => (p.$collapsed ? WIDTH_COLLAPSED : WIDTH_EXPANDED)}px;
  height: 100%;
  padding: var(--space-500) var(--space-200) var(--space-200);
  font-family: var(--font-family);

  /* Figma's platform axis: the web rail is an opaque panel with a right-hand
     edge; the windows rail sits transparent on whatever is behind it. */
  ${(p) =>
    p.$surface === 'solid' &&
    `
    background: var(--color-surfaces-container);
    border-right: var(--stroke-100) solid var(--color-stroke-border);
  `}
`;

/** Brand header + rail. Grows so the footer can sit at the bottom. */
const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-500);
  width: 100%;
  flex: 1 1 auto;
  /* Without this the rows overflow this box instead of shrinking it, and spill
     straight over the footer — which is what put the collapse control in the
     middle of the row list. */
  min-height: 0;
`;

/**
 * The scrolling region for the rows, so a long rail scrolls rather than
 * overrunning the footer.
 *
 * This is the hello pc `Scrollbar` element, not native overflow: the rail is an
 * ordinary div we own, so nothing stops it hosting a ScrollArea (unlike Modal
 * or a Select viewport, where Radix owns the scroll container).
 *
 * It needs no `maxHeight` — as a flex item with `flex: 1; min-height: 0` the
 * root gets a definite height from the flex layout, which the viewport's
 * `height: 100%` resolves against.
 */
/*
 * The scrollbar gutter. Radix pins its ScrollArea bar as an overlay at the
 * Root's right edge, so instead of trying to inset the rows around it (fragile —
 * the row and its selected pill are full-width), we narrow the scrolling
 * viewport by this much. The bar then lives in the freed strip and the rows
 * physically cannot sit under it, whatever their alignment. --space-300 (16px)
 * covers the bar's hover-widened track (8px thumb + 4px each side).
 *
 * The brand and footer sit outside the scroll area, so they take the same gutter
 * as plain right padding — that keeps every icon, the logo and the footer
 * controls centred/aligned in one usable column beside the bar.
 */
const RAIL_GUTTER = 'var(--space-300)';

const Rail = styled(Scrollbar)`
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;

  [data-radix-scroll-area-viewport] {
    width: calc(100% - ${RAIL_GUTTER}) !important;
  }
`;

const Brand = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex: none;
  align-items: center;
  gap: ${(p) => (p.$collapsed ? 'var(--space-150)' : 'var(--space-300)')};
  /* min-height, not height: the two-line lockup runs a little over 40px at
     18px, and a fixed height clipped the app name's descenders. Figma's row
     doesn't clip either. */
  min-height: ${BRAND_ROW_HEIGHT}px;
  box-sizing: border-box;
  width: 100%;
  padding-left: ${(p) => (p.$collapsed ? '0' : 'var(--space-100)')};
  /* Same gutter the rail reserves for the scrollbar, so the logo shares the
     usable column with the row icons rather than sitting beside the bar. */
  padding-right: ${RAIL_GUTTER};
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
`;

const Logo = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: ${LOGO_SIZE}px;
  height: ${LOGO_SIZE}px;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;

/** "Lenovo / Appname" — the product name sits light above a bold app name. */
const BrandText = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-subtitle);
  letter-spacing: -0.4px;
  /* Enough leading for descenders — 1.15 cropped the "p" in "Appname". */
  line-height: 1.25;
  /* Clip horizontally only; vertical clipping is what cut the app name off. */
  overflow-x: hidden;
`;

const ProductName = styled.span`
  font-weight: var(--font-weight-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AppName = styled.span`
  font-weight: var(--font-weight-bold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  flex: none;
  /* Same gutter the rail reserves for the scrollbar, so the footer's controls
     share the usable column with the row icons rather than drifting toward the
     bar. */
  padding-right: ${RAIL_GUTTER};
`;

/*
 * The footer controls are 32px (IconButton, Avatar) while a row's icon is 24px.
 * Centred (collapsed) their glyph centres coincide, but when the footer is
 * left-aligned (expanded) the 4px size difference offsets them, so the toggle
 * reads as out of line with the row icons. Pulling the left inset in by that 4px
 * puts the centres on one axis:
 *   row icon   16 (row pad) + 12 (half of 24) = 28
 *   footer     12 (this)    + 16 (half of 32) = 28
 */
const FOOTER_INSET = 'calc(var(--space-300) - var(--space-050))';

const ToggleRow = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  box-sizing: border-box;
  width: 100%;
  /* Footer already reserves the scrollbar gutter, so only the left inset varies:
     nudged for glyph-centre alignment when expanded, none when centred. */
  padding: var(--space-200) 0 var(--space-200) ${(p) => (p.$collapsed ? '0' : FOOTER_INSET)};
`;

const UserRow = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--space-300);
  box-sizing: border-box;
  width: 100%;
  /* Same as the toggle: the Footer reserves the gutter, so only the left inset
     varies — the 4px avatar-centre nudge when expanded, none when centred. */
  padding: var(--space-200) 0 var(--space-200) ${(p) => (p.$collapsed ? '0' : FOOTER_INSET)};
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
`;

const UserIdentity = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex: 1 1 0%;
  align-items: center;
  gap: var(--space-200);
  min-width: 0;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
`;

const UserName = styled.span`
  flex: 1 1 0%;
  min-width: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.2px;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface SidebarNavUser {
  /** Display name, shown beside the avatar when expanded. */
  name: string;
  /** Avatar node. Defaults to a 32px hello pc `Avatar` using the name's initial. */
  avatar?: React.ReactNode;
  /** Fires when the user row's trailing control is activated. Renders it when set. */
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name for that control. @default 'Account options' */
  actionLabel?: string;
}

export interface SidebarNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The rows: `SidebarItem`, `SidebarBlock`, `SidebarSectionHeader`, … */
  children: React.ReactNode;
  /** Accessible name for the rail. Always provide one. */
  'aria-label'?: string;
  /** Collapses to the 80px icon rail. @default false */
  collapsed?: boolean;
  /** Fires with the next collapsed state when the toggle is activated. Renders the toggle when set. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Accessible name for the toggle while expanded. @default 'Collapse sidebar' */
  collapseLabel?: string;
  /** Accessible name for the toggle while collapsed. @default 'Expand sidebar' */
  expandLabel?: string;
  /** Brand mark, rendered in a 32px slot. */
  logo?: React.ReactNode;
  /** Product or org name, above the app name (Figma "Lenovo"). */
  productName?: React.ReactNode;
  /** App name (Figma "Appname"). */
  appName?: React.ReactNode;
  /**
   * Surface treatment (Figma `platform`): `translucent` sits on whatever is
   * behind it (`platform=windows`); `solid` is an opaque panel with a
   * right-hand edge (`platform=web`).
   * @default 'translucent'
   */
  surface?: SidebarNavSurface;
  /** The signed-in user, shown in the footer. */
  user?: SidebarNavUser;
}

export const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  (
    {
      children,
      collapsed = false,
      onCollapsedChange,
      collapseLabel = 'Collapse sidebar',
      expandLabel = 'Expand sidebar',
      logo,
      productName,
      appName,
      surface = 'translucent',
      user,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const showBrandText = !collapsed && (productName || appName);

    return (
      <SidebarCollapsedContext.Provider value={collapsed}>
        <Frame ref={ref} $collapsed={collapsed} $surface={surface} {...props}>
        <Main>
          {logo || showBrandText ? (
            <Brand $collapsed={collapsed}>
              {logo ? <Logo aria-hidden>{logo}</Logo> : null}
              {showBrandText ? (
                <BrandText>
                  {productName ? <ProductName>{productName}</ProductName> : null}
                  {appName ? <AppName>{appName}</AppName> : null}
                </BrandText>
              ) : null}
            </Brand>
          ) : null}

          <Rail>
            <SidebarList aria-label={ariaLabel}>{children}</SidebarList>
          </Rail>
        </Main>

        <Footer>
          {onCollapsedChange ? (
            <ToggleRow $collapsed={collapsed}>
              <IconButton
                label={collapsed ? expandLabel : collapseLabel}
                icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                size="sm"
                intent="secondary"
                variant="ghost"
                onClick={() => onCollapsedChange(!collapsed)}
              />
            </ToggleRow>
          ) : null}

          <SidebarDivider />

          {user ? (
            <UserRow $collapsed={collapsed}>
              <UserIdentity $collapsed={collapsed}>
                {user.avatar ?? <Avatar size="sm" initials={user.name.charAt(0)} alt={user.name} />}
                {!collapsed ? <UserName>{user.name}</UserName> : null}
              </UserIdentity>
              {!collapsed && user.onAction ? (
                <IconButton
                  label={user.actionLabel ?? 'Account options'}
                  icon={<MoreHorizontal />}
                  size="sm"
                  intent="secondary"
                  variant="ghost"
                  onClick={user.onAction}
                />
              ) : null}
            </UserRow>
          ) : null}
        </Footer>
        </Frame>
      </SidebarCollapsedContext.Provider>
    );
  },
);

SidebarNav.displayName = 'SidebarNav';

export default SidebarNav;
