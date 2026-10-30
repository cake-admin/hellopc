import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { ModalIcon, type ModalIconType } from '../Modal/ModalIcon';

export type NotificationStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';

/** Notification `status` → the shared semantic glyph/color from ModalIcon
 *  (Figma's "greyscale" status maps to ModalIcon's colorless `neutral`). */
const STATUS_ICON: Record<NotificationStatus, ModalIconType> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
  neutral: 'neutral',
};

const Card = styled.article<{ $flush: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* Figma draws the card at 400px, but the description truncates awkwardly at
     that width; widen the ceiling to 480px (matching the Toast-complex
     sibling) so a normal message fits without cramping. The card still fills
     whatever narrower width its container gives it. */
  max-width: 480px;
  background: var(--color-surfaces-on-container-high);

  /* Standalone (default): rounded corners + the Figma "elevation/0" resting
     drop shadow (0 1px 2px light + 0 0 4px heavy) so the card lifts off the
     page. flush drops both so the card tiles inside a list/panel that owns
     the rounding, clipping, and dividers (see NotificationPanel). */
  min-width: 0;

  ${(p) =>
    p.$flush
      ? ''
      : `
    border-radius: var(--radius-400);
    box-shadow: var(--elevation-0);
  `}
`;

const Structure = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  width: 100%;
  min-width: 0;
  padding: var(--space-300);
`;

const ContentRow = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--space-600);
  width: 100%;
  min-width: 0;
`;

const IconAndText = styled.div`
  display: flex;
  flex: 1 1 0%;
  align-items: flex-start;
  gap: var(--space-300);
  min-width: 0;
`;

/* Cancel ModalIcon's 4px state-layer inset — the notification icon slot is a
   tight 24×24 (Figma 113:5549), like Toast's status icon. */
const StatusIcon = styled(ModalIcon)`
  margin: calc(-1 * var(--space-050));
`;

const Text = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  gap: var(--space-075);
  min-width: 0;
`;

const Title = styled.p`
  margin: 0;
  width: 100%;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

const Description = styled.p`
  margin: 0;
  width: 100%;
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
`;

const Footer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-300);
  width: 100%;
  min-width: 0;
  /* Indent past the 24px icon + 16px gap so the metadata + actions align
     under the text column, not the icon. */
  padding-left: var(--space-700);
`;

const MetaLine = styled.span`
  display: inline-flex;
  flex: 1 1 0%;
  align-items: center;
  gap: var(--space-050);
  min-width: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  line-height: 1.35;
`;

/** The unread indicator — "New" in the error/red token per Figma. */
const Unread = styled.span`
  color: var(--color-error-error);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.1px;
  white-space: nowrap;
`;

const Timestamp = styled.span`
  color: var(--color-text-icon-secondary);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  white-space: nowrap;
`;

const Sep = styled.span`
  color: var(--color-text-icon-secondary);
`;

const Actions = styled.div`
  display: flex;
  flex: none;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

export interface NotificationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Semantic treatment (Figma `status`: info/success/warning/error/greyscale).
   * Drives the status icon and its color; `neutral` is Figma's colorless
   * "greyscale" status.
   * @default 'info'
   */
  status?: NotificationStatus;
  /** Visible heading. */
  title?: React.ReactNode;
  /** Supporting copy under the title. */
  description?: React.ReactNode;
  /** Footer caption — a relative or absolute time, e.g. `7/20/22 • 8:22 PM`. */
  timestamp?: React.ReactNode;
  /**
   * Marks the notification unread: prepends a red **New** indicator before the
   * timestamp in the footer.
   * @default false
   */
  unread?: boolean;
  /**
   * Leading visual. Defaults to the `status` glyph; pass `null` to hide it, or
   * a custom node to override it.
   */
  icon?: React.ReactNode | null;
  /**
   * Replacement for the default action-button group. When supplied, the
   * default action label/handler props below are ignored.
   */
  actions?: React.ReactNode;
  /** Visible label for the default low-emphasis secondary action. */
  secondaryActionLabel?: string;
  /** Fired when the default secondary action is activated. */
  onSecondaryAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Disables the default secondary action. @default false */
  secondaryActionDisabled?: boolean;
  /** Visible label for the default high-emphasis primary action. */
  primaryActionLabel?: string;
  /** Fired when the default primary action is activated. */
  onPrimaryAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Disables the default primary action. @default false */
  primaryActionDisabled?: boolean;
  /**
   * Fired when the close control is activated. The close button only renders
   * when this is supplied.
   */
  onDismiss?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name for the close control. @default 'Dismiss notification' */
  dismissLabel?: string;
  /**
   * Renders flush — no own corner radius or drop shadow — so the card tiles
   * inside a list/panel that provides the rounding, clipping, and dividers.
   * `NotificationPanel` sets this on its items.
   * @default false
   */
  flush?: boolean;
}

/**
 * hello pc Notification — a persistent notification-center card (Figma
 * "Notifications", node 113:5543). Unlike Toast (a transient Radix Toast), a
 * Notification stays until dismissed and lives in a browsable list/panel, so
 * it carries an unread indicator and a timestamp.
 *
 * No Radix primitive covers a notification-center card, so the card itself is
 * a semantic `<article>`; its interactive parts reuse the Radix-backed hello pc
 * components — the status glyph is `ModalIcon`, the actions are `Button`, and
 * the close control is `IconButton`. Styled entirely from the hello pc token
 * custom properties, which mirror the Figma variables and re-theme via
 * `[data-theme]`.
 */
export const Notification = React.forwardRef<HTMLElement, NotificationProps>(
  (
    {
      status = 'info',
      title,
      description,
      timestamp,
      unread = false,
      icon,
      actions,
      secondaryActionLabel,
      onSecondaryAction,
      secondaryActionDisabled = false,
      primaryActionLabel,
      onPrimaryAction,
      primaryActionDisabled = false,
      onDismiss,
      dismissLabel = 'Dismiss notification',
      flush = false,
      ...props
    },
    ref,
  ) => {
    const baseId = React.useId();
    const titleId = `${baseId}-title`;
    const descId = `${baseId}-desc`;

    const hasActions =
      actions !== undefined || Boolean(secondaryActionLabel) || Boolean(primaryActionLabel);
    const hasFooter = Boolean(timestamp) || unread || hasActions;

    const resolvedIcon =
      icon === null ? null : icon ?? <StatusIcon type={STATUS_ICON[status]} decorative />;

    const defaultActions = (
      <>
        {secondaryActionLabel ? (
          <Button
            size="sm"
            intent="secondary"
            variant="ghost"
            onClick={onSecondaryAction}
            disabled={secondaryActionDisabled}
          >
            {secondaryActionLabel}
          </Button>
        ) : null}
        {primaryActionLabel ? (
          <Button size="sm" onClick={onPrimaryAction} disabled={primaryActionDisabled}>
            {primaryActionLabel}
          </Button>
        ) : null}
      </>
    );

    return (
      <Card
        ref={ref}
        $flush={flush}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        {...props}
      >
        <Structure>
          <ContentRow>
            <IconAndText>
              {resolvedIcon}
              {title || description ? (
                <Text>
                  {title ? <Title id={titleId}>{title}</Title> : null}
                  {description ? <Description id={descId}>{description}</Description> : null}
                </Text>
              ) : null}
            </IconAndText>
            {onDismiss ? (
              <IconButton
                label={dismissLabel}
                icon={<X />}
                size="sm"
                intent="secondary"
                variant="ghost"
                onClick={onDismiss}
              />
            ) : null}
          </ContentRow>

          {hasFooter ? (
            <Footer>
              <MetaLine>
                {unread ? <Unread>New</Unread> : null}
                {unread && timestamp ? <Sep aria-hidden>•</Sep> : null}
                {timestamp ? <Timestamp>{timestamp}</Timestamp> : null}
              </MetaLine>
              {hasActions ? <Actions>{actions ?? defaultActions}</Actions> : null}
            </Footer>
          ) : null}
        </Structure>
      </Card>
    );
  },
);

Notification.displayName = 'Notification';

export default Notification;
