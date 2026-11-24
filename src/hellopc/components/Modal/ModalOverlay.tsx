import { Dialog } from 'radix-ui';
import styled, { keyframes } from 'styled-components';

/**
 * The modal scrim (Figma `hellopc.modal.scrim`) shared by every Radix-Dialog
 * surface in the Modal family — `Modal` and `SideSheet`. Internal: not part of
 * the public barrel. Render it inside `Dialog.Portal`, before the content.
 */

const overlayIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const ModalOverlay = styled(Dialog.Overlay)`
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
