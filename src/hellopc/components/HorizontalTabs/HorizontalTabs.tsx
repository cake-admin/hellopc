import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs as RadixTabs } from 'radix-ui';

import { IconButton } from '../Button/IconButton';

/**
 * hello pc HorizontalTabs — a horizontal tab bar and its panels (Figma
 * "&horizontal tabs", node 149:8841).
 *
 * A wrapper over Radix `Tabs`, which supplies roving **Left/Right** focus
 * (Home/End to jump), the `tablist` / `tab` / `tabpanel` roles, `aria-selected`,
 * and the trigger↔panel wiring. `HorizontalTabItem` provides the tabs.
 *
 * Beyond the primitive, the bar adds what Figma draws around it: when the tabs
 * overflow their container the strip scrolls, with prev/next chevron controls
 * that reuse the hello pc `IconButton`. Radix has no scrolling of its own, so that
 * part is implemented here.
 */

const Root = styled(RadixTabs.Root)`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  font-family: var(--font-family);
  min-width: 0;
`;

/** The bar: scroll control, the scrolling strip, scroll control. */
const Bar = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`;

/**
 * The scrolling viewport for the tabs. Its native scrollbar is hidden on
 * purpose — this is the one scroll surface in the system that does *not* use
 * the Scrollbar element, because the chevron controls are the affordance Figma
 * specifies and a bar under the tabs would duplicate them.
 */
const Strip = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const List = styled(RadixTabs.List)`
  display: inline-flex;
  align-items: center;
  min-width: max-content;
`;

const Content = styled(RadixTabs.Content)`
  min-width: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  color: var(--color-text-icon-primary);

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

export interface HorizontalTabsProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Root> {
  /** The selected tab's value (controlled). */
  value?: string;
  /** The initially selected tab's value (uncontrolled). */
  defaultValue?: string;
  /** Fires with the newly selected tab's value. */
  onValueChange?: (value: string) => void;
  /**
   * `automatic` selects a tab as soon as it receives focus; `manual` waits for
   * Enter/Space. Use `manual` when switching tabs is expensive.
   * @default 'automatic'
   */
  activationMode?: 'automatic' | 'manual';
}

/** The tabs root. Pins `orientation="horizontal"` so Radix wires Left/Right
 *  arrow navigation. */
export const HorizontalTabs = React.forwardRef<HTMLDivElement, HorizontalTabsProps>(
  (props, ref) => <Root ref={ref} {...props} orientation="horizontal" />,
);
HorizontalTabs.displayName = 'HorizontalTabs';

export interface HorizontalTabsListProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {
  /** Accessible name for the bar — always give it one. */
  'aria-label'?: string;
  /**
   * When to show the scroll chevrons: `auto` reveals them only once the tabs
   * overflow, `always` keeps them (disabled at the ends), `never` hides them
   * and leaves the strip to swipe/trackpad scrolling.
   * @default 'auto'
   */
  scrollButtons?: 'auto' | 'always' | 'never';
  /** Accessible name for the scroll-left control. @default 'Scroll tabs left' */
  prevLabel?: string;
  /** Accessible name for the scroll-right control. @default 'Scroll tabs right' */
  nextLabel?: string;
}

/**
 * The tab bar (`role="tablist"`). Scrolls horizontally when its tabs overflow,
 * with chevron controls composed from `IconButton`.
 */
export const HorizontalTabsList = React.forwardRef<HTMLDivElement, HorizontalTabsListProps>(
  (
    {
      children,
      scrollButtons = 'auto',
      prevLabel = 'Scroll tabs left',
      nextLabel = 'Scroll tabs right',
      ...props
    },
    ref,
  ) => {
    const stripRef = React.useRef<HTMLDivElement>(null);
    const [overflowing, setOverflowing] = React.useState(false);
    const [canPrev, setCanPrev] = React.useState(false);
    const [canNext, setCanNext] = React.useState(false);

    /* Recompute from the strip itself rather than from the tab count, so it
       stays right when labels, fonts, or the container change size. */
    const sync = React.useCallback(() => {
      const el = stripRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      setOverflowing(max > 1);
      setCanPrev(el.scrollLeft > 1);
      setCanNext(el.scrollLeft < max - 1);
    }, []);

    React.useEffect(() => {
      const el = stripRef.current;
      if (!el) return undefined;

      sync();
      el.addEventListener('scroll', sync, { passive: true });

      /* Watch both the viewport and its content: the strip can start fitting
         (or stop) without any scroll event firing. */
      const observer = new ResizeObserver(sync);
      observer.observe(el);
      if (el.firstElementChild) observer.observe(el.firstElementChild);

      return () => {
        el.removeEventListener('scroll', sync);
        observer.disconnect();
      };
    }, [sync]);

    const scrollByPage = (direction: 1 | -1) => {
      const el = stripRef.current;
      if (!el) return;
      el.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: 'smooth' });
    };

    const showButtons =
      scrollButtons === 'always' || (scrollButtons === 'auto' && overflowing);

    return (
      <Bar>
        {showButtons ? (
          <IconButton
            label={prevLabel}
            icon={<ChevronLeft />}
            size="md"
            intent="secondary"
            variant="ghost"
            disabled={!canPrev}
            onClick={() => scrollByPage(-1)}
          />
        ) : null}

        <Strip ref={stripRef}>
          <List ref={ref} {...props}>
            {children}
          </List>
        </Strip>

        {showButtons ? (
          <IconButton
            label={nextLabel}
            icon={<ChevronRight />}
            size="md"
            intent="secondary"
            variant="ghost"
            disabled={!canNext}
            onClick={() => scrollByPage(1)}
          />
        ) : null}
      </Bar>
    );
  },
);
HorizontalTabsList.displayName = 'HorizontalTabsList';

export interface HorizontalTabsContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content> {
  /** Matches the `value` of the tab that reveals this panel. */
  value: string;
}

/** A tab panel (`role="tabpanel"`), shown when its `value` is selected. */
export const HorizontalTabsContent = React.forwardRef<
  HTMLDivElement,
  HorizontalTabsContentProps
>((props, ref) => <Content ref={ref} {...props} />);
HorizontalTabsContent.displayName = 'HorizontalTabsContent';

export default HorizontalTabs;
