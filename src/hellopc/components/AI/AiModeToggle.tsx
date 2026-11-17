import React from 'react';
import { AccessibleIcon, Toggle as RadixToggle } from 'radix-ui';
import styled from 'styled-components';
import { Mic } from 'lucide-react';

import { aiGradient, aiVar, type AiSegment } from './aiSegment';

export interface AiModeToggleProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixToggle.Root>, 'children' | 'asChild'> {
  /**
   * Accessible name for the mode (required — the toggle shows only a glyph),
   * e.g. "Voice input". Screen readers announce it with the pressed state.
   * @default 'Voice input'
   */
  label?: string;
  /**
   * The mode glyph. Defaults to a microphone (voice input); swap it for
   * another mode. Rendered in a 24px slot and colored via `currentColor`.
   * When pressed the glyph is filled (`fill="currentColor"`) to mirror the
   * Figma filled-icon On state.
   */
  icon?: React.ReactElement;
  /**
   * AI segment (Figma "Segment") — sets the pressed surface fill and accent.
   * @default 'consumer'
   */
  segment?: AiSegment;
  /** Controlled pressed state (Figma State=On). Pair with `onPressedChange`. */
  pressed?: boolean;
  /** Uncontrolled initial pressed state. @default false */
  defaultPressed?: boolean;
  /** Called with the next pressed state. */
  onPressedChange?: (pressed: boolean) => void;
  /** Mode unavailable (Figma State=Disabled). @default false */
  disabled?: boolean;
}

/** 32px circle — Figma toggle frame (hellopc.ai.modeToggle 17636:6401). */
const DIAMETER = 32;
const ICON = 24;

const Root = styled(RadixToggle.Root)<{ $segment: AiSegment }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${DIAMETER}px;
  height: ${DIAMETER}px;
  padding: 0;
  border: none;
  border-radius: var(--radius-1000);
  cursor: pointer;
  background: transparent;
  color: var(--color-secondary-secondary);
  transition: background-color 120ms ease, color 120ms ease;

  /* Off — matches IconButton ghost · secondary */
  &[data-state='off']:hover:not(:disabled) {
    background: var(--color-secondary-secondary-overlay);
  }
  &[data-state='off']:active:not(:disabled) {
    background: var(--color-secondary-secondary-overlay-hover);
  }

  /* On — segment surface gradient + filled glyph in the segment accent */
  &[data-state='on'] {
    background: ${(p) => aiGradient(p.$segment, 'surface')};
    color: ${(p) => aiVar(p.$segment, 'flat')};
  }

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
    background: transparent;
    color: var(--color-disabled-disabled-inverse);
  }

  &:focus {
    outline: none;
  }
  &:focus-visible::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: var(--stroke-300) solid var(--color-primary-primary);
    border-radius: var(--radius-1000);
    pointer-events: none;
  }
`;

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${ICON}px;
  height: ${ICON}px;
  & > svg {
    width: 100%;
    height: 100%;
  }
`;

/**
 * hello pc AI ModeToggle — the toggle icon button inside the AI query input
 * (Figma "hellopc.ai.modeToggle", node 17636:6401). Off = mode inactive,
 * On = mode active (segment surface fill + filled glyph), Disabled =
 * unavailable. Built on Radix `Toggle`, so it renders a real
 * `<button aria-pressed>` with Space/Enter support.
 */
export const AiModeToggle = React.forwardRef<HTMLButtonElement, AiModeToggleProps>(
  (
    {
      label = 'Voice input',
      icon,
      segment = 'consumer',
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      ...props
    },
    ref,
  ) => {
    // Track pressed locally (mirrors Radix) so the glyph can switch to filled.
    const [uncontrolled, setUncontrolled] = React.useState(defaultPressed);
    const isControlled = pressedProp !== undefined;
    const pressed = isControlled ? pressedProp : uncontrolled;

    const glyph = icon ?? <Mic />;
    const rendered = React.isValidElement<React.SVGProps<SVGSVGElement>>(glyph)
      ? React.cloneElement(glyph, { fill: pressed ? 'currentColor' : 'none' })
      : glyph;

    return (
      <Root
        ref={ref}
        $segment={segment}
        pressed={pressed}
        onPressedChange={(next) => {
          if (!isControlled) setUncontrolled(next);
          onPressedChange?.(next);
        }}
        {...props}
      >
        <AccessibleIcon.Root label={label}>
          <IconSlot aria-hidden>{rendered}</IconSlot>
        </AccessibleIcon.Root>
      </Root>
    );
  },
);

AiModeToggle.displayName = 'AiModeToggle';

export default AiModeToggle;
