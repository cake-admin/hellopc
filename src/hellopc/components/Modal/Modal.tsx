import React from 'react';
import { Dialog } from 'radix-ui';
import styled, { keyframes } from 'styled-components';

import { ModalTitle, type ModalTitleProps } from './ModalTitle';
import { nativeScrollbarStyles } from '../Elements/Scrollbar';

/**
 * Figma 105:5863 intrinsic modal sizing: the design opens at 448px and may grow
 * to 640px. The default is set to 480px so the footer's acknowledgement label
 * and action group sit comfortably on one line; it still stays within the
 * 448–640px range.
 */
const MIN_WIDTH = 448;
const DEFAULT_WIDTH = 480;
const MAX_WIDTH = 640;

const overlayIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const contentIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.98); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--color-overlay-scrim);
  /* Figma's overlay scrim blur effect. Fixed 12px in both themes — only the
     scrim color token switches (a white-tinted veil in light, black-tinted in
     dark). Intrinsic geometry, not a tokenized value. */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  animation: ${overlayIn} 160ms ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  width: ${DEFAULT_WIDTH}px;
  min-width: ${MIN_WIDTH}px;
  max-width: min(${MAX_WIDTH}px, calc(100vw - var(--space-500) * 2));
  max-height: calc(100vh - var(--space-800));
  overflow: hidden auto;
  /* Native-overflow scrollbar shared with the Scrollbar element — Dialog.Content
     is itself the scroll container (Radix owns it for focus trapping and
     dismiss), so it can't host a ScrollArea; this keeps a tall modal's
     scrollbar identical to every other hello pc scrollbar. */
  ${nativeScrollbarStyles}
  transform: translate(-50%, -50%);
  border-radius: var(--radius-400);
  background: var(--color-surfaces-container);
  /* Figma elevation/5 — the top of the scale, for surfaces with a scrim. */
  box-shadow: var(--elevation-5);
  animation: ${contentIn} 180ms ease;

  &:focus {
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-100);
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
`;

export interface ModalProps
  extends Pick<
    ModalTitleProps,
    'title' | 'subtitle' | 'modalIcon' | 'modalIconSlot' | 'closeLabel'
  > {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. @default false */
  defaultOpen?: boolean;
  /** Fired whenever the dialog requests an open-state change. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether the header shows the reusable close IconButton.
   * @default true
   */
  showClose?: boolean;
  /**
   * The modal body. This is a slot: compose `ModalContent`, images, or any
   * custom hello pc content. A Radix Dialog exposes a single accessible
   * description, so if the header `subtitle` is set, any `Dialog.Description`
   * inside here must be opted out (e.g. `ModalContent` with
   * `descriptionAsDialogDescription={false}`).
   */
  children?: React.ReactNode;
  /**
   * Optional footer slot, typically a `ModalFooter`. When omitted, no footer
   * region renders.
   */
  footer?: React.ReactNode;
}

/**
 * hello pc Modal — a token-styled, elevated dialog surface (Figma `&Modal`, node
 * 105:5863) built on Radix `Dialog`. Radix owns focus trapping, scroll locking,
 * escape/overlay dismissal, and the `dialog` role; hello pc owns the surface, the
 * elevation/5 shadow, and the composed header. The header is built from the
 * reusable `ModalTitle`; the body and footer are slots so consumers can drop in
 * the other Modal elements or custom content.
 */
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      title,
      subtitle,
      modalIcon,
      modalIconSlot,
      closeLabel,
      showClose = true,
      children,
      footer,
    },
    ref,
  ) => {
    const isControlled = openProp !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp : uncontrolledOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Overlay />
          <Content ref={ref}>
            <ModalTitle
              title={title}
              subtitle={subtitle}
              modalIcon={modalIcon}
              modalIconSlot={modalIconSlot}
              closeLabel={closeLabel}
              onClose={showClose ? () => setOpen(false) : undefined}
            />
            {children ? <Body>{children}</Body> : null}
            {footer ? <Footer>{footer}</Footer> : null}
          </Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);

Modal.displayName = 'Modal';

export default Modal;
