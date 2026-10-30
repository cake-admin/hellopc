import React from 'react';
import styled from 'styled-components';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

/**
 * hello pc HelperString — the assistive line under a form field (Figma
 * "&helper.string", node 54:2782). A reusable form element: TextInput
 * composes it, and future fields (Textarea, Select, …) should too.
 *
 * A semantic `tone` drives the icon + text color (all from the hello pc token
 * custom properties); an optional right-aligned counter shows `count/max`.
 * No Radix primitive applies (it's static text) — a plain element with an
 * id for `aria-describedby` wiring.
 */

export type HelperTone = 'greyscale' | 'info' | 'success' | 'warning' | 'error' | 'disabled';

/** tone → text/icon color token (Figma "type" variants, 1:1). */
const TONE_COLOR: Record<HelperTone, string> = {
  greyscale: 'var(--color-text-icon-secondary)',
  info: 'var(--color-info-info)',
  success: 'var(--color-success-success)',
  warning: 'var(--color-warning-warn)',
  error: 'var(--color-error-error)',
  disabled: 'var(--color-disabled-disabled-inverse)',
};

/** tone → 16px lucide glyph (Figma: info / check_circle / warning / ErrorFilled). */
const TONE_ICON: Record<HelperTone, React.ComponentType> = {
  greyscale: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
  disabled: Info,
};

const Root = styled.div<{ $tone: HelperTone }>`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  width: 100%;
  font-family: var(--font-family);
  font-size: var(--type-size-helper);
  line-height: 1.35;
  color: ${(p) => TONE_COLOR[p.$tone]};
`;

const TextGroup = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

/** 16px tone icon — inherits the tone color via currentColor. */
const IconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  & > svg {
    width: 100%;
    height: 100%;
  }
`;

/** Right-aligned counter, same tone color (hello pc correction of the Figma
 *  layer, which still carried legacy non-hello pc text styles). */
const Counter = styled.span`
  flex: 1;
  min-width: 0;
  display: inline-flex;
  justify-content: flex-end;
  white-space: nowrap;
`;

export interface HelperStringProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The helper text. */
  children?: React.ReactNode;
  /**
   * Semantic tone (Figma "type") — drives the icon and color: `greyscale`
   * neutral guidance, `info` active guidance, `success`/`warning`/`error`
   * validation, `disabled` when the field is disabled.
   * @default 'greyscale'
   */
  tone?: HelperTone;
  /** Shows the 16px tone icon before the text. @default true */
  showIcon?: boolean;
  /** Current character count — with `max`, renders a right-aligned `count/max`. */
  count?: number;
  /** Character limit for the counter. */
  max?: number;
}

export const HelperString = React.forwardRef<HTMLDivElement, HelperStringProps>(
  ({ children, tone = 'greyscale', showIcon = true, count, max, ...props }, ref) => {
    const IconGlyph = TONE_ICON[tone];
    const showCounter = typeof count === 'number' && typeof max === 'number';
    return (
      <Root ref={ref} $tone={tone} {...props}>
        {children != null ? (
          <TextGroup>
            {showIcon ? (
              <IconSlot aria-hidden>
                <IconGlyph />
              </IconSlot>
            ) : null}
            <span>{children}</span>
          </TextGroup>
        ) : null}
        {showCounter ? (
          <Counter>
            {count}/{max}
          </Counter>
        ) : null}
      </Root>
    );
  },
);

HelperString.displayName = 'HelperString';
