import React from 'react';
import styled from 'styled-components';

import { aiGradient, aiVar, type AiSegment } from './aiSegment';

export interface AiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visible label — name the action ("Start deployment plan"). */
  children: React.ReactNode;
  /** AI segment — sets the fill gradient and label color. @default 'consumer' */
  segment?: AiSegment;
  /** Optional 16px leading icon (inherits the label color). */
  icon?: React.ReactNode;
}

/** Figma's gradient angle on the 32px-tall pill (hellopc.ai.button 17842:6051):
 *  wide shapes take a shallower angle than the query input's 39.06°. */
const BUTTON_GRADIENT_ANGLE = '8.35deg';

const StyledButton = styled.button<{ $segment: AiSegment }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
  height: 32px;
  padding: var(--space-100) var(--space-250) var(--space-100) var(--space-100);
  border: none;
  border-radius: var(--radius-1000);
  background: ${(p) => aiGradient(p.$segment, 'fill', BUTTON_GRADIENT_ANGLE)};
  color: ${(p) => aiVar(p.$segment, 'on-fill')};
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  letter-spacing: 0.2px;
  white-space: nowrap;
  cursor: pointer;
  transition: box-shadow 120ms ease;

  &:hover:not(:disabled) {
    box-shadow: var(--elevation-1);
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
  &:disabled {
    background: var(--color-disabled-disabled);
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }

  & > svg {
    flex: none;
    width: var(--space-300);
    height: var(--space-300);
  }
`;

/**
 * hello pc AI Button — the one primary action an AI response offers, e.g.
 * "Start deployment plan" (Figma `hellopc.ai.button`, node 17842:6051): a 32px
 * pill in the segment's fill gradient. Regular actions use `Button`.
 */
export const AiButton = React.forwardRef<HTMLButtonElement, AiButtonProps>(
  ({ children, segment = 'consumer', icon, type = 'button', ...props }, ref) => (
    <StyledButton ref={ref} type={type} $segment={segment} {...props}>
      {icon}
      <span>{children}</span>
    </StyledButton>
  ),
);

AiButton.displayName = 'AiButton';

export default AiButton;
