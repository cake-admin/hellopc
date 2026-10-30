import React from 'react';
import { Dialog } from 'radix-ui';
import styled from 'styled-components';
import { X } from 'lucide-react';

import { IconButton } from '../Button/IconButton';
import { ModalIcon, type ModalIconType } from './ModalIcon';

/** Figma 97:5727 intrinsic leading/close control diameter. */
const CONTROL_SIZE = 40;

const Root = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: var(--space-300) var(--space-500);
  background: var(--color-surfaces-container);
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  min-width: 0;
  min-height: ${CONTROL_SIZE}px;
  padding-right: var(--space-100);
`;

const LeadingAndText = styled.div`
  display: flex;
  flex: 1;
  align-self: stretch;
  align-items: center;
  min-width: 0;
  gap: var(--space-100);
`;

const Leading = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  flex: none;
  width: ${CONTROL_SIZE}px;
  height: ${CONTROL_SIZE}px;
  padding-top: var(--space-050);
`;

/* Cancel ModalIcon's 4px state-layer inset so the glyph's visible left edge
   aligns with the 24px content/footer edge instead of sitting 4px inward. */
const LeadingIcon = styled(ModalIcon)`
  margin-left: calc(-1 * var(--space-050));
`;

const Text = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  min-height: ${CONTROL_SIZE}px;
  padding-top: var(--space-050);
`;

const Title = styled(Dialog.Title)`
  width: 100%;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-subtitle);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Subtitle = styled(Dialog.Description)`
  width: 100%;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Close = styled(IconButton)`
  flex: none;
  /* The close glyph is centered in the 40px control (8px inset) and the lucide
     "X" itself is drawn further inside its own box than a typical filled glyph.
     Offset the control so the X's *visible* edge lands ~24px from the modal
     edge, matching the leading icon's visible edge and the content inset. */
  margin-right: calc(-1 * (var(--space-100) + var(--space-050)));
`;

/* `title` is redeclared as a ReactNode heading, so the DOM's `title?: string`
   (the tooltip attribute) is omitted rather than conflicting with it. */
export interface ModalTitleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Visible dialog heading, rendered through Radix `Dialog.Title`. */
  title: React.ReactNode;
  /** Optional supporting text, rendered through Radix `Dialog.Description`. */
  subtitle?: React.ReactNode;
  /**
   * Optional semantic leading treatment. ModalTitle exclusively composes
   * ModalIcon for this slot.
   */
  modalIcon?: ModalIconType;
  /** Optional custom glyph used only with `modalIcon="icon"`. */
  modalIconSlot?: React.ReactNode;
  /**
   * Fired when the reusable close icon button is activated. The consumer owns
   * Dialog open state and should set it to false here.
   */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name for the optional close control. @default 'Close dialog' */
  closeLabel?: string;
}

/**
 * hello pc ModalTitle — the header for a Radix Dialog (Figma `_elements / modal
 * header/Default`, node 97:5727). It composes the existing IconButton close
 * control with Radix Dialog title/description primitives and tokenized layout.
 */
export const ModalTitle = React.forwardRef<HTMLDivElement, ModalTitleProps>(
  (
    {
      title,
      subtitle,
      modalIcon,
      modalIconSlot,
      onClose,
      closeLabel = 'Close dialog',
      ...props
    },
    ref,
  ) => (
    <Root ref={ref} {...props}>
      <Content>
        <LeadingAndText>
          {modalIcon ? (
            <Leading>
              <LeadingIcon type={modalIcon} icon={modalIconSlot} decorative />
            </Leading>
          ) : null}
          <Text>
            <Title>{title}</Title>
            {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
          </Text>
        </LeadingAndText>
      </Content>
      {onClose ? (
        <Close
          label={closeLabel}
          icon={<X />}
          size="md"
          intent="secondary"
          variant="ghost"
          onClick={onClose}
        />
      ) : null}
    </Root>
  ),
);

ModalTitle.displayName = 'ModalTitle';

export default ModalTitle;
