import React from 'react';
import styled from 'styled-components';
import { ArrowRight } from 'lucide-react';

import { AiButton } from './AiButton';
import { AiFeedback, type AiFeedbackProps } from './AiFeedback';
import { AiSources, type AiSource } from './AiSources';
import type { AiSegment } from './aiSegment';

export interface AiMessageResponseAction {
  /** Button label — the action the assistant offers. */
  label: string;
  /** Leading icon. @default an arrow */
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface AiMessageResponseProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onCopy'> {
  /**
   * The reply. Strings render as paragraphs; pass an array for several
   * paragraphs, or any nodes for richer content.
   */
  children: React.ReactNode;
  /** AI segment — tints the action button. @default 'consumer' */
  segment?: AiSegment;
  /** Where the answer came from, shown above the action (Figma `showSources`). */
  sources?: AiSource[];
  /** The one primary action the response offers (Figma `showAction`). */
  action?: AiMessageResponseAction;
  /** Shows the feedback row at the bottom (Figma `showFeedback`). */
  feedback?: AiFeedbackProps;
}

/** Figma hellopc.ai.message.response (17842:6331): 12px stack, 16px block
 *  padding, 32px right inset (raw in Figma; mapped to the space scale). */
const Root = styled.article`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-200);
  padding: var(--space-300) var(--space-600) var(--space-300) 0;
  font-family: var(--font-family);
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;

  & p {
    margin: 0;
  }
`;

/**
 * hello pc AI Message Response — the assistant's reply block (Figma
 * `hellopc.ai.message.response`, node 17842:6313): one or more paragraphs, then
 * optional sources, an optional AI action, and an optional feedback row. No
 * bubble: it sits on the conversation surface.
 */
export const AiMessageResponse = React.forwardRef<HTMLElement, AiMessageResponseProps>(
  ({ children, segment = 'consumer', sources, action, feedback, ...props }, ref) => {
    const paragraphs = React.Children.toArray(children).map((c, i) =>
      typeof c === 'string' ? <p key={i}>{c}</p> : c,
    );

    return (
      <Root ref={ref} {...props}>
        <Body>{paragraphs}</Body>
        {sources?.length ? <AiSources sources={sources} /> : null}
        {action ? (
          <AiButton segment={segment} icon={action.icon ?? <ArrowRight />} onClick={action.onClick} disabled={action.disabled}>
            {action.label}
          </AiButton>
        ) : null}
        {feedback ? <AiFeedback {...feedback} /> : null}
      </Root>
    );
  },
);

AiMessageResponse.displayName = 'AiMessageResponse';

export default AiMessageResponse;
