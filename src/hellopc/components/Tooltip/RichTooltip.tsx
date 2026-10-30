import React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { X } from 'lucide-react';
import styled from 'styled-components';

import { Button } from '../Button/Button';
import { IconButton } from '../Button/IconButton';

const Trigger = styled(RadixPopover.Trigger)`
  all: unset;
  display: inline-flex;
  box-sizing: border-box;
  border-radius: var(--radius-100);
  cursor: pointer;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

const Content = styled(RadixPopover.Content)`
  z-index: 1100;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-500);
  border-radius: var(--radius-400);
  background: var(--color-surfaces-container-blur-high);
  color: var(--color-text-icon-primary);
  backdrop-filter: blur(45px);

  /* Figma node 128:8611 — deliberately stronger than Simple Tooltip's
     elevation/2; the exported values are exactly elevation/5. */
  box-shadow: var(--elevation-5);

  &[data-state='open'] {
    animation: rich-tooltip-in 160ms ease-out;
  }

  @keyframes rich-tooltip-in {
    from {
      opacity: 0;
      transform: translateY(var(--space-050)) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  width: 100%;
`;

const Title = styled.h2`
  flex: 1;
  min-width: 0;
  margin: 0;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-subtitle);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

const Body = styled.div`
  width: 100%;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;

  & > :first-child {
    margin-top: 0;
  }
  & > :last-child {
    margin-bottom: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
  width: 100%;
  min-height: 48px;
  padding-top: var(--space-100);
`;

const Stepper = styled.span`
  flex: 1;
  min-width: 0;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  letter-spacing: 0.1px;
`;

const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-300);
`;

export interface RichTooltipProps {
  /**
   * Non-interactive trigger content rendered inside Radix Popover's real
   * button. Do not pass another button here because nested controls are invalid.
   */
  trigger: React.ReactNode;
  /** Structured body content. */
  children: React.ReactNode;
  /** Accessible name for a trigger whose visible content is not descriptive. */
  triggerAriaLabel?: string;
  /** Optional heading. @default 'Title' */
  title?: React.ReactNode;
  /** Shows the title/close header row. @default true */
  showHeader?: boolean;
  /** Shows the title inside the header. @default true */
  showTitle?: boolean;
  /** Shows the reusable IconButton close action. @default true */
  showClose?: boolean;
  /** Shows the step/action footer. @default true */
  showFooter?: boolean;
  /** Shows the leading progress text in the footer. @default true */
  showStepper?: boolean;
  /** Footer progress text. @default 'Step 1 of 4' */
  stepperText?: React.ReactNode;
  /** Replaces the default secondary and primary Buttons. */
  actions?: React.ReactNode;
  /** Secondary Button label. @default 'Secondary' */
  secondaryActionLabel?: string;
  /** Primary Button label. @default 'Primary' */
  primaryActionLabel?: string;
  /** Fires when the secondary action is activated. */
  onSecondaryAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Fires when the primary action is activated. */
  onPrimaryAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Fires after the close IconButton is activated. */
  onClose?: () => void;
  /** Controlled open state. */
  open?: boolean;
  /** Initial state for uncontrolled usage. @default false */
  defaultOpen?: boolean;
  /** Fires whenever Radix opens or closes the rich tooltip. */
  onOpenChange?: (open: boolean) => void;
  /** Preferred placement relative to the trigger. @default 'bottom' */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alignment along the selected side. @default 'center' */
  align?: 'start' | 'center' | 'end';
  /** Gap between trigger and surface. @default 12 */
  sideOffset?: number;
  /** Surface width (number = px). @default 448 */
  width?: number | string;
}

/**
 * hello pc RichTooltip (Figma node 128:8611) uses Radix Popover—not Tooltip—
 * because it contains focusable close and action buttons. Radix owns
 * click/keyboard opening, focus management, Escape, outside dismissal,
 * collision handling, and portal positioning. The surface composes hello pc
 * Button and IconButton.
 */
export const RichTooltip = React.forwardRef<HTMLDivElement, RichTooltipProps>(
  (
    {
      trigger,
      children,
      triggerAriaLabel,
      title = 'Title',
      showHeader = true,
      showTitle = true,
      showClose = true,
      showFooter = true,
      showStepper = true,
      stepperText = 'Step 1 of 4',
      actions,
      secondaryActionLabel = 'Secondary',
      primaryActionLabel = 'Primary',
      onSecondaryAction,
      onPrimaryAction,
      onClose,
      open,
      defaultOpen = false,
      onOpenChange,
      side = 'bottom',
      align = 'center',
      sideOffset = 12,
      width = 448,
    },
    ref,
  ) => {
    const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
    const currentOpen = open ?? innerOpen;
    const titleId = React.useId();
    const bodyId = React.useId();

    const setOpen = (next: boolean) => {
      if (open == null) setInnerOpen(next);
      onOpenChange?.(next);
    };

    const defaultActions = (
      <>
        <Button size="md" intent="secondary" variant="ghost" onClick={onSecondaryAction}>
          {secondaryActionLabel}
        </Button>
        <Button size="md" onClick={onPrimaryAction}>
          {primaryActionLabel}
        </Button>
      </>
    );

    return (
      <RadixPopover.Root open={currentOpen} onOpenChange={setOpen}>
        <Trigger type="button" aria-label={triggerAriaLabel}>
          {trigger}
        </Trigger>
        <RadixPopover.Portal>
          <Content
            ref={ref}
            side={side}
            align={align}
            sideOffset={sideOffset}
            aria-labelledby={showHeader && showTitle ? titleId : undefined}
            aria-describedby={bodyId}
            style={{ width, maxWidth: 'calc(100vw - var(--space-500) * 2)' }}
          >
            <Main>
              {showHeader && (showTitle || showClose) ? (
                <Header>
                  {showTitle ? <Title id={titleId}>{title}</Title> : null}
                  {showClose ? (
                    <IconButton
                      size="sm"
                      intent="secondary"
                      variant="ghost"
                      label="Close tooltip"
                      icon={<X />}
                      onClick={() => {
                        setOpen(false);
                        onClose?.();
                      }}
                    />
                  ) : null}
                </Header>
              ) : null}
              <Body id={bodyId}>{children}</Body>
            </Main>
            {showFooter ? (
              <Footer>
                {showStepper ? <Stepper>{stepperText}</Stepper> : <Stepper aria-hidden />}
                <Actions>{actions ?? defaultActions}</Actions>
              </Footer>
            ) : null}
          </Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    );
  },
);

RichTooltip.displayName = 'RichTooltip';

export default RichTooltip;
