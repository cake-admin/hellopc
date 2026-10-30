import React from 'react';
import styled from 'styled-components';
import { Tabs as RadixTabs } from 'radix-ui';

/**
 * hello pc HorizontalTabItem — one tab in a horizontal tab bar (Figma
 * ".elements/tab_item", node 149:8842).
 *
 * A Radix `Tabs.Trigger`, so selection, roving **Left/Right** focus, and the
 * `role="tab"` / `aria-selected` / panel wiring come from the primitive. Figma's
 * `status` axis is Radix's `data-state`; its `state` axis
 * (default/hover/press/disabled) is CSS pseudo-classes plus `disabled`.
 *
 * Despite sharing a Figma component name with the vertical row, this is a
 * distinctly different skin: a 48px pill-cornered tab whose selected indicator
 * is a **bottom underline** rather than a leading bar, and whose selected label
 * uses `--color-text-icon-on-tonal` rather than `--color-primary-primary`.
 *
 * Must be rendered inside `HorizontalTabsList` within `HorizontalTabs`.
 */

/* Figma 149:8843 intrinsic geometry: the 48px tab and its 4px underline. */
const TAB_HEIGHT = 48;
const INDICATOR_HEIGHT = 4;

/** The underline. Always rendered so selecting a tab never shifts its label;
 *  only its fill turns on (see the Trigger rules below). */
const Indicator = styled.span`
  flex: 1 1 0%;
  height: ${INDICATOR_HEIGHT}px;
  border-radius: var(--radius-1000);
  background: transparent;
  transition: background 120ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const IndicatorSlot = styled.span`
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: ${INDICATOR_HEIGHT}px;
  padding: 0 var(--space-300);
`;

const LabelRow = styled.span`
  display: flex;
  flex: 1 1 0%;
  align-items: center;
  justify-content: center;
  gap: var(--space-300);
  min-height: 0;
  padding: var(--space-150) var(--space-200) var(--space-100);
  white-space: nowrap;
`;

const Column = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 var(--space-100);
`;

const Trigger = styled(RadixTabs.Trigger)`
  box-sizing: border-box;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  height: ${TAB_HEIGHT}px;
  padding: 0;
  border: none;
  appearance: none;
  border-radius: var(--radius-300);
  background: transparent;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.1px;
  line-height: 1.35;
  cursor: pointer;
  overflow: hidden;
  transition: background 120ms ease;

  /* Not selected. */
  &:hover:not(:disabled) {
    background: var(--color-tonal-tonal-secondary-overlay-hover);
  }
  &:active:not(:disabled) {
    background: var(--color-tonal-tonal-secondary-overlay-press);
  }

  /* Selected — Radix owns data-state, so selection is never tracked here. */
  &[data-state='active'] {
    background: var(--color-tonal-tonal-overlay);
    color: var(--color-text-icon-on-tonal);
    font-weight: var(--font-weight-bold);
  }
  &[data-state='active']:hover:not(:disabled) {
    background: var(--color-tonal-tonal-overlay-hover);
  }
  &[data-state='active']:active:not(:disabled) {
    background: var(--color-tonal-tonal-overlay-press);
  }
  &[data-state='active']:not(:disabled) ${Indicator} {
    background: var(--color-primary-primary);
  }

  /* Disabled wins over the selected treatment: Figma drops both the fill and
     the underline, and returns the label to medium weight. */
  &:disabled {
    cursor: not-allowed;
    background: transparent;
    color: var(--color-disabled-disabled-inverse);
    font-weight: var(--font-weight-medium);
  }

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: calc(-1 * var(--stroke-200));
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export interface HorizontalTabItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  /** Value linking this tab to its `HorizontalTabsContent` panel. */
  value: string;
  /** The tab label. */
  children: React.ReactNode;
  /** Dims the tab and drops it from the tab order. @default false */
  disabled?: boolean;
}

export const HorizontalTabItem = React.forwardRef<HTMLButtonElement, HorizontalTabItemProps>(
  ({ children, ...props }, ref) => (
    <Trigger ref={ref} {...props}>
      <Column>
        <LabelRow>{children}</LabelRow>
        <IndicatorSlot>
          <Indicator />
        </IndicatorSlot>
      </Column>
    </Trigger>
  ),
);

HorizontalTabItem.displayName = 'HorizontalTabItem';

export default HorizontalTabItem;
