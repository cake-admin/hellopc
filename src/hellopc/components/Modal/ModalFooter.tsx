import React from 'react';
import styled from 'styled-components';

import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-300);
  width: 100%;
  padding: var(--space-300) var(--space-500);
  background: var(--color-surfaces-container);
`;

const CheckboxSlot = styled.div`
  display: flex;
  flex: none;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.1px;
  line-height: 1.35;
  /* The acknowledgement label must stay on a single line (Figma 97:5766). */
  white-space: nowrap;
  cursor: pointer;

  &:has([data-disabled]) {
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }
`;

const Actions = styled.div`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-300);
`;

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Replacement for the leading checkbox slot. When supplied, all checkbox
   * label and state props are ignored so consumers can compose another existing
   * hello pc control.
   */
  checkbox?: React.ReactNode;
  /**
   * Replacement for the trailing action group. When supplied, all default
   * action label, event, and disabled props are ignored.
   */
  actions?: React.ReactNode;
  /**
   * Visible label for the default Radix-wrapped Checkbox.
   * @default 'Don’t remind me again'
   */
  checkboxLabel?: string;
  /**
   * Controlled state for the default checkbox. Pair with
   * `onCheckboxCheckedChange`; ignored when `checkbox` is supplied.
   */
  checkboxChecked?: boolean | 'indeterminate';
  /**
   * Initial state for the uncontrolled default checkbox.
   * @default false
   */
  defaultCheckboxChecked?: boolean;
  /** Fired when the default checkbox changes state. */
  onCheckboxCheckedChange?: (checked: boolean | 'indeterminate') => void;
  /** Disables the default checkbox. @default false */
  checkboxDisabled?: boolean;
  /** Visible label for the low-emphasis secondary action. @default 'Secondary' */
  secondaryActionLabel?: string;
  /** Fired when the default secondary action is activated. */
  onSecondaryAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Disables the default secondary action. @default false */
  secondaryActionDisabled?: boolean;
  /** Visible label for the primary action. @default 'Primary' */
  primaryActionLabel?: string;
  /** Fired when the default primary action is activated. */
  onPrimaryAction?: React.MouseEventHandler<HTMLButtonElement>;
  /** Disables the default primary action. @default false */
  primaryActionDisabled?: boolean;
}

/**
 * hello pc ModalFooter — the action region for a dialog (Figma `_elements / modal
 * Footer`, node 97:5766). It composes the existing Radix-wrapped Checkbox and
 * Button components, keeping the secondary action before the primary action.
 */
export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  (
    {
      checkbox,
      actions,
      checkboxLabel = 'Don’t remind me again',
      checkboxChecked,
      defaultCheckboxChecked = false,
      onCheckboxCheckedChange,
      checkboxDisabled = false,
      secondaryActionLabel = 'Secondary',
      onSecondaryAction,
      secondaryActionDisabled = false,
      primaryActionLabel = 'Primary',
      onPrimaryAction,
      primaryActionDisabled = false,
      ...props
    },
    ref,
  ) => {
    const checkboxId = React.useId();
    const defaultCheckbox = (
      <CheckboxLabel htmlFor={checkboxId}>
        <Checkbox
          id={checkboxId}
          checked={checkboxChecked}
          defaultChecked={defaultCheckboxChecked}
          onCheckedChange={onCheckboxCheckedChange}
          disabled={checkboxDisabled}
        />
        <span>{checkboxLabel}</span>
      </CheckboxLabel>
    );

    const defaultActions = (
      <>
        <Button
          size="sm"
          intent="secondary"
          variant="ghost"
          onClick={onSecondaryAction}
          disabled={secondaryActionDisabled}
        >
          {secondaryActionLabel}
        </Button>
        <Button size="sm" onClick={onPrimaryAction} disabled={primaryActionDisabled}>
          {primaryActionLabel}
        </Button>
      </>
    );

    return (
      <Root ref={ref} {...props}>
        <CheckboxSlot>{checkbox ?? defaultCheckbox}</CheckboxSlot>
        <Actions>{actions ?? defaultActions}</Actions>
      </Root>
    );
  },
);

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
