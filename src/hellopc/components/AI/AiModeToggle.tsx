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
   * The default microphone fills its capsule when pressed (the Figma
   * filled-icon On state); a custom icon is shown as-is unless you pass
   * `pressedIcon`.
   */
  icon?: React.ReactElement;
  /**
   * Glyph shown while pressed — the filled version of `icon` (Figma On
   * state). Use it with a custom `icon`; the default microphone already has
   * its own filled state.
   */
  pressedIcon?: React.ReactElement;
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
    color: var(--color-text-icon-secondary-on-surface);
  }
  &[data-state='off']:active:not(:disabled) {
    background: var(--color-secondary-secondary-overlay-hover);
    color: var(--color-text-icon-secondary-on-surface);
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
    color: var(--color-text-icon-disabled);
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

/** `$fillCapsule`: the default mic's On state fills only its capsule (the
 *  lucide Mic `<rect>`) — the arc and stem stay strokes, as in Figma. Filling
 *  the whole SVG would flood the open arc into a solid bowl. */
const IconSlot = styled.span<{ $fillCapsule: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${ICON}px;
  height: ${ICON}px;
  & > svg {
    width: 100%;
    height: 100%;
  }
  ${(p) => (p.$fillCapsule ? '& > svg rect { fill: currentColor; }' : '')}
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
      pressedIcon,
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

    const rendered = (pressed ? pressedIcon : undefined) ?? icon ?? <Mic />;
    const fillCapsule = pressed && !icon && !pressedIcon;

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
          <IconSlot aria-hidden $fillCapsule={fillCapsule}>
            {rendered}
          </IconSlot>
        </AccessibleIcon.Root>
      </Root>
    );
  },
);

AiModeToggle.displayName = 'AiModeToggle';

export default AiModeToggle;
