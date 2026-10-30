import React from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';
import styled from 'styled-components';

const Trigger = styled(RadixTooltip.Trigger)`
  all: unset;
  display: inline-flex;
  box-sizing: border-box;
  border-radius: var(--radius-100);
  cursor: help;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

const Content = styled(RadixTooltip.Content)`
  z-index: 1100;
  box-sizing: border-box;
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-inverse-container);
  color: var(--color-text-icon-inverse);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  overflow-wrap: anywhere;

  /* Figma elevation/2 (node 128:8606). */
  box-shadow: var(--elevation-2);

  &[data-state='delayed-open'],
  &[data-state='instant-open'] {
    animation: tooltip-in 120ms ease-out;
  }

  @keyframes tooltip-in {
    from {
      opacity: 0;
      transform: translateY(var(--space-025));
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export interface SimpleTooltipProps {
  /**
   * Non-interactive trigger content rendered inside Radix Tooltip's real
   * button. Do not pass another button here because nested controls are invalid.
   */
  trigger: React.ReactNode;
  /** Tooltip text or short phrasing content. */
  children: React.ReactNode;
  /** Accessible name for a trigger whose visible content is not descriptive. */
  triggerAriaLabel?: string;
  /** Controlled open state. */
  open?: boolean;
  /** Initial state for uncontrolled usage. @default false */
  defaultOpen?: boolean;
  /** Fires whenever Radix opens or closes the tooltip. */
  onOpenChange?: (open: boolean) => void;
  /** Hover/focus delay before opening, in milliseconds. @default 0 */
  delayDuration?: number;
  /** Preferred placement relative to the trigger. @default 'top' */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alignment along the selected side. @default 'center' */
  align?: 'start' | 'center' | 'end';
  /** Gap between trigger and tooltip. @default 8 */
  sideOffset?: number;
  /** Maximum tooltip width (number = px). @default 280 */
  maxWidth?: number | string;
}

/**
 * hello pc SimpleTooltip — a compact text description built on Radix Tooltip
 * (Figma node 128:8606). Radix owns hover/focus timing, accessible
 * `aria-describedby`, portal positioning, collision handling, and Escape;
 * hello pc owns the inverse surface and exact elevation/2.
 */
export const SimpleTooltip = React.forwardRef<HTMLDivElement, SimpleTooltipProps>(
  (
    {
      trigger,
      children,
      triggerAriaLabel,
      open,
      defaultOpen = false,
      onOpenChange,
      delayDuration = 0,
      side = 'top',
      align = 'center',
      sideOffset = 8,
      maxWidth = 280,
    },
    ref,
  ) => (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
      >
        <Trigger type="button" aria-label={triggerAriaLabel}>
          {trigger}
        </Trigger>
        <RadixTooltip.Portal>
          <Content
            ref={ref}
            side={side}
            align={align}
            sideOffset={sideOffset}
            style={{ maxWidth }}
          >
            {children}
          </Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  ),
);

SimpleTooltip.displayName = 'SimpleTooltip';

export default SimpleTooltip;
