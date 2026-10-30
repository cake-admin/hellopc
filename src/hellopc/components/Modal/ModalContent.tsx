import React from 'react';
import { Dialog } from 'radix-ui';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-100);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-300) var(--space-500);
  background: var(--color-surfaces-container);
`;

const Subtitle = styled.h2`
  width: 100%;
  margin: 0;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-subtitle);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-300);
  width: 100%;
`;

const Description = styled(Dialog.Description)`
  width: 100%;
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
`;

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional section heading displayed above the description. It is visually
   * styled as Figma's `medium type/medium.18` content subtitle.
   */
  subtitle?: React.ReactNode;
  /**
   * Dialog summary rendered through Radix `Dialog.Description`. Keep this to
   * phrasing content; place interactive or structured dialog UI in `children`.
   */
  description?: React.ReactNode;
  /**
   * Optional structured modal body rendered below the description. Use this
   * slot for existing hello pc controls rather than recreating them inside a
   * dialog.
   */
  children?: React.ReactNode;
  /**
   * Renders `description` through Radix `Dialog.Description` so it becomes the
   * dialog's accessible description. A Radix Dialog exposes exactly one
   * description, so set this to `false` when another element in the same dialog
   * (e.g. Modal's header subtitle) already owns it; the text then renders as a
   * plain paragraph with identical styling.
   * @default true
   */
  descriptionAsDialogDescription?: boolean;
}

/**
 * hello pc ModalContent — the tokenized content region for a Radix Dialog (Figma
 * `_elements / modal content`, node 97:5762). It supplies a subtitle, Radix
 * dialog description, and an optional flexible body slot; ModalTitle remains
 * responsible for the dialog's primary accessible title.
 */
export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  (
    { subtitle, description, children, descriptionAsDialogDescription = true, ...props },
    ref,
  ) => (
    <Root ref={ref} {...props}>
      {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      {description || children ? (
        <Content>
          {description ? (
            <Description as={descriptionAsDialogDescription ? undefined : 'p'}>
              {description}
            </Description>
          ) : null}
          {children}
        </Content>
      ) : null}
    </Root>
  ),
);

ModalContent.displayName = 'ModalContent';

export default ModalContent;
