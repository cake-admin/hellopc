import React from 'react';
import { Dialog } from 'radix-ui';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';

import { IconButton } from '../Button/IconButton';
import { HorizontalTabs, HorizontalTabsList } from '../HorizontalTabs/HorizontalTabs';
import { nativeScrollbarStyles } from '../Elements/Scrollbar';
import { ModalFooter } from './ModalFooter';
import { ModalOverlay } from './ModalOverlay';

export type SideSheetSize = 'sm' | 'md' | 'lg';
export type SideSheetDensity = 'default' | 'compact';

/** Figma 17310:419 intrinsic sheet widths: sm 400 / md 480 / lg 640. */
const WIDTH: Record<SideSheetSize, number> = { sm: 400, md: 480, lg: 640 };

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const Content = styled(Dialog.Content)<{ $size: SideSheetSize }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: ${(p) => WIDTH[p.$size]}px;
  max-width: 100vw;
  height: 100dvh;
  overflow: hidden;
  /* The sheet is flush with the right edge, so only the leading (left)
     corners round. */
  border-radius: var(--radius-300) 0 0 var(--radius-300);
  background: var(--color-surfaces-container);
  /* Figma elevation/5 — the top of the scale, for surfaces with a scrim. */
  box-shadow: var(--elevation-5);
  font-family: var(--font-family);
  animation: ${slideIn} 220ms cubic-bezier(0.2, 0, 0, 1);

  &:focus {
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Header = styled.div<{ $density: SideSheetDensity }>`
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-100);
  padding: ${(p) =>
    p.$density === 'compact'
      ? 'var(--space-200) var(--space-300)'
      : 'var(--space-400) var(--space-500)'};
`;

/* Figma fixes this group at 27px (22px compact), which clips the description;
   here it grows with its content. */
const TitleGroup = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-050);
  min-width: 0;
`;

const Title = styled(Dialog.Title)<{ $density: SideSheetDensity }>`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: ${(p) =>
    p.$density === 'compact' ? 'var(--type-size-subject)' : 'var(--type-size-title)'};
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

const Description = styled(Dialog.Description)`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
`;

const HeaderAction = styled.div`
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: var(--space-100);
`;

const TabsRoot = styled(HorizontalTabs)`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0;
  min-height: 0;
`;

const TabBar = styled.div<{ $density: SideSheetDensity }>`
  flex: none;
  padding: 0
    ${(p) => (p.$density === 'compact' ? 'var(--space-300)' : 'var(--space-500)')};
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);
`;

const Body = styled.div<{ $density: SideSheetDensity }>`
  flex: 1;
  min-height: 0;
  overflow: hidden auto;
  padding: ${(p) => (p.$density === 'compact' ? 'var(--space-300)' : 'var(--space-500)')};
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  ${nativeScrollbarStyles}

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: calc(-1 * var(--stroke-200));
  }
`;

const FooterActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
`;

export interface SideSheetProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. @default false */
  defaultOpen?: boolean;
  /** Fired whenever the sheet requests an open-state change (close, Esc, scrim click). */
  onOpenChange?: (open: boolean) => void;
  /**
   * Sheet width: `sm` 400px, `md` 480px, `lg` 640px. Never wider than the
   * viewport. Height is always the full viewport.
   * @default 'md'
   */
  size?: SideSheetSize;
  /**
   * `default` — 20/24px header, 20px title, 48px tabs, 24px content inset.
   * `compact` — 12/16px header, 16px title, ~36px tabs, 16px content inset;
   * about 50px more room for content.
   * @default 'default'
   */
  density?: SideSheetDensity;
  /** Visible heading, rendered through Radix `Dialog.Title` (the sheet's accessible name). */
  title: React.ReactNode;
  /** Optional supporting line under the title, rendered through Radix `Dialog.Description`. */
  description?: React.ReactNode;
  /**
   * Optional slot before the close control — typically one `Button size="sm"`
   * (e.g. "Edit").
   */
  headerAction?: React.ReactNode;
  /**
   * Optional tab bar: `HorizontalTabItem` elements. When set, the body is
   * wrapped in `HorizontalTabs`, so `children` should be the matching
   * `HorizontalTabsContent` panels. Tabs inherit the sheet's density.
   */
  tabs?: React.ReactNode;
  /** Accessible name for the tab bar. @default 'Sections' */
  tabsLabel?: string;
  /** Selected tab (controlled). Pair with `onTabChange`. */
  tabValue?: string;
  /** Initially selected tab (uncontrolled). Defaults to the first tab's `value`. */
  defaultTabValue?: string;
  /** Fired with the newly selected tab's value. */
  onTabChange?: (value: string) => void;
  /**
   * Optional footer actions, right-aligned above a top rule — typically
   * "Cancel" (`variant="outline" intent="secondary"`) then "Save" (fill),
   * both `size="sm"`. Rendered through `ModalFooter`.
   */
  footer?: React.ReactNode;
  /** Accessible name for the close control. @default 'Close' */
  closeLabel?: string;
  /** The scrolling content slot (or the tab panels when `tabs` is set). */
  children?: React.ReactNode;
}

/** The first tab's `value`, looking through Fragments — `React.Children`
 *  treats `<>…</>` as one child, which is how the docs pass `tabs`. */
const firstTabValue = (tabs: React.ReactNode): string | undefined => {
  for (const child of React.Children.toArray(tabs)) {
    if (!React.isValidElement<{ value?: unknown; children?: React.ReactNode }>(child)) continue;
    if (child.type === React.Fragment) {
      const nested = firstTabValue(child.props.children);
      if (nested !== undefined) return nested;
      continue;
    }
    if (typeof child.props.value === 'string') return child.props.value;
  }
  return undefined;
};

/**
 * hello pc SideSheet — a full-height panel that slides in from the right over
 * the modal scrim (Figma `hellopc.side.sheet`, node 17310:419; formerly
 * `hellopc.drawer`). Built on Radix `Dialog`: focus trap, scroll lock, Esc and
 * scrim dismissal, and focus return to the trigger come from the primitive.
 * The header composes `IconButton` (close) with an optional action slot; the
 * tabs reuse `HorizontalTabs`; the footer reuses `ModalFooter`.
 */
export const SideSheet = React.forwardRef<HTMLDivElement, SideSheetProps>(
  (
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      size = 'md',
      density = 'default',
      title,
      description,
      headerAction,
      tabs,
      tabsLabel = 'Sections',
      tabValue,
      defaultTabValue,
      onTabChange,
      footer,
      closeLabel = 'Close',
      children,
    },
    ref,
  ) => {
    const isControlled = openProp !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp : uncontrolledOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    /* The sheet is opened by an external control, not a `Dialog.Trigger`, so
       Radix has no trigger to refocus on close. Remember whatever had focus
       when the sheet opened and return focus there. */
    const returnFocusRef = React.useRef<HTMLElement | null>(null);
    const handleOpenAutoFocus = () => {
      const active = document.activeElement;
      returnFocusRef.current = active instanceof HTMLElement ? active : null;
    };
    const handleCloseAutoFocus = (event: Event) => {
      const target = returnFocusRef.current;
      if (target && target.isConnected) {
        event.preventDefault();
        target.focus();
      }
      returnFocusRef.current = null;
    };

    /* Every tab panel shares the one scrolling Body, so a new tab would open
       at the previous tab's scroll position. Start each tab at the top. */
    const bodyRef = React.useRef<HTMLDivElement>(null);
    const resetScroll = () => {
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
    };
    const handleTabChange = (value: string) => {
      resetScroll();
      onTabChange?.(value);
    };
    // Controlled selection can change without a user click.
    React.useLayoutEffect(resetScroll, [tabValue]);

    const body = (
      <Body ref={bodyRef} $density={density}>
        {children}
      </Body>
    );

    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <ModalOverlay />
          <Content
            ref={ref}
            $size={size}
            onOpenAutoFocus={handleOpenAutoFocus}
            onCloseAutoFocus={handleCloseAutoFocus}
            /* Radix warns when no Description exists unless the link is
               explicitly cleared. */
            {...(description ? {} : { 'aria-describedby': undefined })}
          >
            <Header $density={density}>
              <TitleGroup>
                <Title $density={density}>{title}</Title>
                {description ? <Description>{description}</Description> : null}
              </TitleGroup>
              {headerAction ? <HeaderAction>{headerAction}</HeaderAction> : null}
              <IconButton
                label={closeLabel}
                icon={<X />}
                size="sm"
                intent="secondary"
                variant="ghost"
                onClick={() => setOpen(false)}
              />
            </Header>

            {tabs ? (
              <TabsRoot
                size={density}
                value={tabValue}
                defaultValue={defaultTabValue ?? firstTabValue(tabs)}
                onValueChange={handleTabChange}
              >
                <TabBar $density={density}>
                  <HorizontalTabsList aria-label={tabsLabel}>{tabs}</HorizontalTabsList>
                </TabBar>
                {body}
              </TabsRoot>
            ) : (
              body
            )}

            {footer ? (
              <ModalFooter
                divider
                density={density}
                checkbox={false}
                actions={<FooterActions>{footer}</FooterActions>}
              />
            ) : null}
          </Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);

SideSheet.displayName = 'SideSheet';

export default SideSheet;
