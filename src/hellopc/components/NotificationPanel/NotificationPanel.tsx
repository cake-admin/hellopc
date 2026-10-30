import React from 'react';
import styled from 'styled-components';
import { Settings, X } from 'lucide-react';

import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';

/**
 * hello pc NotificationPanel — the bell/inbox panel frame (Figma "Notification
 * Panel", node 114:5748): a blurred, elevated surface holding a header
 * (title + settings/close controls), a rounded, divided list of
 * `Notification` cards, and an optional bottom **footer alert** (an inline
 * "Message deleted • Undo" snackbar).
 *
 * Composes the hello pc components rather than rebuilding them: the list items
 * are `Notification` (rendered `flush` so they tile), and every control reuses
 * `IconButton` / `Button`. No Radix primitive covers a panel shell, so it's a
 * semantic `<section>` (labelled by its heading). Styled entirely from the
 * hello pc token custom properties, which mirror the Figma variables and
 * re-theme via `[data-theme]`, including the blur + drop shadow.
 */

const Panel = styled.section`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 432px;
  border-radius: var(--radius-400);
  overflow: hidden;
  background: var(--color-surfaces-container-blur);
  backdrop-filter: blur(45px);
  -webkit-backdrop-filter: blur(45px);
  /* Figma "win.htc.border": transparent in light/dark, repainted by
     forced-colors so the blurred surface keeps an edge. */
  border: var(--stroke-100) solid var(--color-stroke-border-container);
  /* pop-out elevation (Figma elevation/3, same as Toast pop-out). */
  box-shadow: var(--elevation-3);
`;

/** Padded content region (header + list). Its own padding is the panel inset,
 *  and its bottom padding is the gap down to the full-bleed footer alert. */
const Body = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-500);
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding: var(--space-300);
`;

const Header = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-100);
  width: 100%;
  min-width: 0;
`;

const Heading = styled.h2`
  flex: 1 1 0%;
  min-width: 0;
  margin: 0;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

const HeaderActions = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-100);
`;

/** The rounded, clipped list container — supplies the corner radius, the
 *  outer hairline, and the dividers between flush Notification items. */
const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: var(--radius-400);
  border: var(--stroke-100) solid var(--color-stroke-border-low);

  & > * + * {
    border-top: var(--stroke-100) solid var(--color-stroke-border-low);
  }
`;

/** Bottom footer alert — a full-bleed inline snackbar (Figma "notification
 *  panel alert", node 114:5756). It's a direct child of the clipped panel, so
 *  it spans the full panel width edge-to-edge and reaches the very bottom; the
 *  Body's bottom padding leaves the gap above it. Its 32px inline padding
 *  aligns the message with the notification icon column (16px list inset + 16px
 *  card padding). The panel's overflow clip rounds its bottom corners. */
const Footer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--space-300);
  width: 100%;
  min-width: 0;
  padding: var(--space-300) var(--space-600);
  background: var(--color-primary-primary-overlay);
  border-bottom-left-radius: var(--radius-400);
  border-bottom-right-radius: var(--radius-400);
`;

const FooterMessage = styled.span`
  flex: 1 1 0%;
  min-width: 0;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
`;

const FooterActions = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-300);
`;

export interface NotificationPanelFooter {
  /** The alert message, e.g. "Message deleted". */
  message: React.ReactNode;
  /** Visible label for the alert's inline action (e.g. "Undo"). */
  actionLabel?: string;
  /** Fired when the alert action is activated. */
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Fired when the alert's close control is activated. Renders it when set. */
  onDismiss?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name for the alert's close control. @default 'Dismiss alert' */
  dismissLabel?: string;
}

export interface NotificationPanelProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Panel heading. @default 'Notifications' */
  title?: React.ReactNode;
  /** Fired when the header settings (gear) control is activated. Renders it when set. */
  onSettings?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name for the settings control. @default 'Notification settings' */
  settingsLabel?: string;
  /** Fired when the header close control is activated. Renders it when set. */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name for the header close control. @default 'Close notifications' */
  closeLabel?: string;
  /** Replaces the default header controls (settings + close) entirely. */
  headerActions?: React.ReactNode;
  /** The notification list — `Notification` items (rendered `flush`). */
  children: React.ReactNode;
  /**
   * Optional bottom alert bar (Figma's "notification panel alert"). Pass the
   * structured shape for the default snackbar, or a node for a custom footer.
   * Omit for the **no-footer** variation.
   */
  footer?: NotificationPanelFooter | React.ReactNode;
}

/** Type guard: is `footer` the structured snackbar shape (vs. a custom node)? */
const isStructuredFooter = (f: unknown): f is NotificationPanelFooter =>
  typeof f === 'object' && f !== null && 'message' in f;

export const NotificationPanel = React.forwardRef<HTMLElement, NotificationPanelProps>(
  (
    {
      title = 'Notifications',
      onSettings,
      settingsLabel = 'Notification settings',
      onClose,
      closeLabel = 'Close notifications',
      headerActions,
      children,
      footer,
      ...props
    },
    ref,
  ) => {
    const headingId = React.useId();

    const defaultHeaderActions = (
      <>
        {onSettings ? (
          <IconButton
            label={settingsLabel}
            icon={<Settings />}
            size="sm"
            intent="secondary"
            variant="ghost"
            onClick={onSettings}
          />
        ) : null}
        {onClose ? (
          <IconButton
            label={closeLabel}
            icon={<X />}
            size="sm"
            intent="secondary"
            variant="ghost"
            onClick={onClose}
          />
        ) : null}
      </>
    );

    const footerNode = isStructuredFooter(footer) ? (
      <Footer role="status">
        <FooterMessage>{footer.message}</FooterMessage>
        <FooterActions>
          {footer.actionLabel ? (
            <Button size="xs" intent="primary" variant="ghost" onClick={footer.onAction}>
              {footer.actionLabel}
            </Button>
          ) : null}
          {footer.onDismiss ? (
            <IconButton
              label={footer.dismissLabel ?? 'Dismiss alert'}
              icon={<X />}
              size="sm"
              intent="secondary"
              variant="ghost"
              onClick={footer.onDismiss}
            />
          ) : null}
        </FooterActions>
      </Footer>
    ) : footer ? (
      <Footer role="status">{footer}</Footer>
    ) : null;

    return (
      <Panel ref={ref} aria-labelledby={title ? headingId : undefined} {...props}>
        <Body>
          <Header>
            {title ? <Heading id={headingId}>{title}</Heading> : <span style={{ flex: 1 }} />}
            <HeaderActions>{headerActions ?? defaultHeaderActions}</HeaderActions>
          </Header>
          <List>{children}</List>
        </Body>
        {footerNode}
      </Panel>
    );
  },
);

NotificationPanel.displayName = 'NotificationPanel';

export default NotificationPanel;
