import React from 'react';
import { Toast as RadixToast } from 'radix-ui';
import styled, { css, keyframes } from 'styled-components';
import { X } from 'lucide-react';

import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';
import { ModalIcon, type ModalIconType } from '../Modal/ModalIcon';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type ToastVariant = 'pop-out' | 'inline';
export type ToastLayout = 'simple' | 'complex';

/** Figma intrinsic max width per layout: Toast Simple (108:5974) 640px,
 *  Toast Complex (109:6541) 480px. */
const MAX_WIDTH: Record<ToastLayout, number> = { simple: 640, complex: 480 };

/** Toast `status` → the shared semantic glyph/color from ModalIcon (Figma's
 *  "greyscale" status maps to ModalIcon's colorless `neutral` type). */
const STATUS_ICON: Record<ToastStatus, ModalIconType> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
  neutral: 'neutral',
};

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(var(--space-100)); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const swipeOut = keyframes`
  from { transform: translateX(var(--radix-toast-swipe-end-x, 0)); opacity: 1; }
  to { transform: translateX(calc(var(--radix-toast-swipe-end-x, 0) + 100%)); opacity: 0; }
`;

const Root = styled(RadixToast.Root)<{ $variant: ToastVariant; $layout: ToastLayout }>`
  box-sizing: border-box;
  display: block;
  width: 100%;
  max-width: ${(p) => MAX_WIDTH[p.$layout]}px;
  border-radius: var(--radius-400);
  overflow: hidden;
  list-style: none;

  /* Figma "win.htc.border": a REAL border in --color-stroke-border-container
     (rgba(255,255,255,0) — genuinely invisible in light/dark). Under Windows
     High Contrast / forced-colors the system repaints borders (and strips
     box-shadows entirely), so this is what gives the blurred/translucent
     surface an edge in that mode. Per the Figma spec there is no visible
     ring in normal themes. */
  border: var(--stroke-100) solid var(--color-stroke-border-container);

  ${(p) =>
    p.$variant === 'pop-out'
      ? css`
          background: var(--color-surfaces-container-blur);
          backdrop-filter: blur(45px);
          -webkit-backdrop-filter: blur(45px);
          box-shadow: var(--elevation-3);
        `
      : css`
          background: var(--color-surfaces-on-container-high);
        `}

  &[data-swipe='move'] {
    transform: translateX(var(--radix-toast-swipe-move-x, 0));
  }
  &[data-swipe='cancel'] {
    transform: translateX(0);
    transition: transform 200ms ease-out;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-state='open'] {
      animation: ${slideIn} 200ms ease;
    }
    &[data-state='closed'] {
      animation: ${fadeOut} 150ms ease-in;
    }
    &[data-swipe='end'] {
      animation: ${swipeOut} 150ms ease-out forwards;
    }
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-500);
  width: 100%;
  padding: var(--space-300) var(--space-300) var(--space-300) var(--space-500);
`;

const Content = styled.div`
  display: flex;
  flex: 1 1 0%;
  align-items: center;
  gap: var(--space-300);
  min-width: 0;
`;

/* Cancel ModalIcon's 4px state-layer inset — Toast's icon slot is a tight
   24×24 (Figma 108:5974 / 109:6541), unlike Modal's 32×32 leading control. */
const StatusIcon = styled(ModalIcon)`
  margin: calc(-1 * var(--space-050));
`;

const Meta = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
`;

/* Toast Complex (109:6541): a stacked layout — a top row (icon + text +
   close) followed by a footer row (timestamp + actions), the footer indented
   to align under the text column. */
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-300);
  width: 100%;
  padding: var(--space-300);
`;

const ContentRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: var(--space-600);
  width: 100%;
`;

const IconAndText = styled.div`
  display: flex;
  flex: 1 1 0%;
  align-items: flex-start;
  gap: var(--space-300);
  min-width: 0;
`;

const ComplexMeta = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-075);
  min-width: 0;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
  width: 100%;
  /* Indent past the 24px icon + 16px gap so actions/metadata align under the
     text column, not the icon. */
  padding-left: var(--space-700);
`;

const Metadata = styled.span`
  flex: 1 1 0%;
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
`;

const Actions = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-100);
`;

const Title = styled(RadixToast.Title)`
  width: 100%;
  margin: 0;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

const Description = styled(RadixToast.Description)`
  width: 100%;
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
`;

const TopBtns = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-100);
`;

/* `onPause`/`onResume` are omitted with `title`: the DOM declares them as media
   ReactEventHandlers, while Radix `Toast.Root` — which this spreads its props
   onto — types them as bare `() => void` callbacks for its timer. Inheriting the
   DOM signatures made the whole spread unassignable. */
export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title' | 'onPause' | 'onResume'> {
  /**
   * Semantic treatment (Figma `status`: info/success/error/warn/greyscale).
   * Drives the status icon and its color; `neutral` is Figma's colorless
   * "greyscale" status.
   * @default 'info'
   */
  status?: ToastStatus;
  /**
   * Surface treatment (Figma `type`). `pop-out` is an elevated, blurred
   * surface with a drop shadow for floating/overlay placement; `inline` is a
   * flush, opaque banner with no elevation for embedding in page content.
   * @default 'pop-out'
   */
  variant?: ToastVariant;
  /**
   * Content arrangement (Figma `&Toast Simple` vs `&Toast Complex`). `simple`
   * is a single row — icon, text, actions, and dismiss all inline. `complex`
   * stacks a footer row (timestamp + actions) below the icon/text/dismiss
   * row, indented to align under the text column — use it when a toast needs
   * a timestamp or when its actions shouldn't compete with the dismiss
   * control for space on one line.
   * @default 'simple'
   */
  layout?: ToastLayout;
  /** Visible heading, rendered through Radix `Toast.Title`. */
  title?: React.ReactNode;
  /** Optional supporting copy, rendered through Radix `Toast.Description`. */
  description?: React.ReactNode;
  /**
   * Caption rendered in the footer row (e.g. a relative or absolute
   * timestamp). `layout="complex"` only — ignored in `simple`.
   */
  timestamp?: React.ReactNode;
  /**
   * Leading visual. Defaults to the `status` glyph; pass `null` to hide the
   * icon entirely, or a custom node to override it.
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
   * Fired when the reusable close icon button is activated. The close
   * control only renders when this is supplied — pass it to make the toast
   * user-dismissible.
   */
  onDismiss?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name for the optional close control. @default 'Dismiss notification' */
  dismissLabel?: string;
  /** Controlled visibility. Pair with `onOpenChange`. @default true */
  open?: boolean;
  /** Initial visibility for uncontrolled usage. @default true */
  defaultOpen?: boolean;
  /**
   * Fired whenever Radix requests a visibility change — auto-dismiss timeout,
   * swipe-to-dismiss gesture, or Escape key. Set the consumer's `open` state
   * to the given value here.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Time in milliseconds the toast stays visible before Radix auto-dismisses
   * it (fires `onOpenChange(false)`). Pass `Infinity` to disable auto-dismiss
   * for toasts that require an explicit action.
   * @default 5000
   */
  duration?: number;
  /**
   * Radix's assistive-tech live-region urgency: `foreground` interrupts
   * (assertive), `background` waits its turn (polite).
   * @default 'foreground'
   */
  type?: 'foreground' | 'background';
}

/**
 * hello pc Toast — a token-styled notification surface built on Radix `Toast`,
 * covering both Figma layouts: `&Toast Simple` (node 108:5974, the default)
 * and `&Toast Complex` (node 109:6541, `layout="complex"`). Radix owns the
 * live-region role, auto-dismiss timing, and swipe-to-dismiss gesture; hello pc
 * owns the surface, elevation, and composed content. Renders the message
 * only — mount a single `Toast.Provider` + `Toast.Viewport` (from
 * `radix-ui`) once near your app root and render `Toast` instances inside
 * it, per Radix's own architecture.
 */
export const Toast = React.forwardRef<HTMLLIElement, ToastProps>(
  (
    {
      status = 'info',
      variant = 'pop-out',
      layout = 'simple',
      title,
      description,
      timestamp,
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
      open,
      defaultOpen,
      onOpenChange,
      duration,
      type,
      ...props
    },
    ref,
  ) => {
    const hasActions = actions !== undefined || Boolean(secondaryActionLabel) || Boolean(primaryActionLabel);

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

    const resolvedIcon =
      icon === null ? null : icon ?? <StatusIcon type={STATUS_ICON[status]} decorative />;

    const closeButton = onDismiss ? (
      <IconButton
        label={dismissLabel}
        icon={<X />}
        size="sm"
        intent="secondary"
        variant="ghost"
        onClick={onDismiss}
      />
    ) : null;

    return (
      <Root
        ref={ref}
        $variant={variant}
        $layout={layout}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        duration={duration}
        type={type}
        {...props}
      >
        {layout === 'complex' ? (
          <Layout>
            <ContentRow>
              <IconAndText>
                {resolvedIcon}
                {title || description ? (
                  <ComplexMeta>
                    {title ? <Title>{title}</Title> : null}
                    {description ? <Description>{description}</Description> : null}
                  </ComplexMeta>
                ) : null}
              </IconAndText>
              {closeButton}
            </ContentRow>
            {timestamp || hasActions ? (
              <Footer>
                {timestamp ? <Metadata>{timestamp}</Metadata> : <span aria-hidden style={{ flex: 1 }} />}
                {hasActions ? <Actions>{actions ?? defaultActions}</Actions> : null}
              </Footer>
            ) : null}
          </Layout>
        ) : (
          <Row>
            <Content>
              {resolvedIcon}
              {title || description ? (
                <Meta>
                  {title ? <Title>{title}</Title> : null}
                  {description ? <Description>{description}</Description> : null}
                </Meta>
              ) : null}
            </Content>
            {hasActions || onDismiss ? (
              <TopBtns>
                {hasActions ? actions ?? defaultActions : null}
                {closeButton}
              </TopBtns>
            ) : null}
          </Row>
        )}
      </Root>
    );
  },
);

Toast.displayName = 'Toast';

export default Toast;
