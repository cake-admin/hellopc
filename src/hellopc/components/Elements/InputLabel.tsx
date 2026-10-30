import React from 'react';
import { Label as RadixLabel } from 'radix-ui';
import styled from 'styled-components';
import { Info } from 'lucide-react';

/**
 * hello pc InputLabel — the label row above a form field (Figma "&input.label",
 * node 54:2773). A reusable form element: TextInput composes it, and future
 * fields (Textarea, Select, …) should too.
 *
 * Built on the Radix `Label` primitive (native `<label>` semantics + no
 * accidental text selection on double-click). Styled from the hello pc token
 * custom properties; the optional info icon and "(required)" suffix follow
 * the Figma layout: text ·4px· icon ···8px··· (required).
 */

const Root = styled(RadixLabel.Root)<{ $size: 'sm' | 'md'; $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  width: 100%;
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  font-size: ${(p) => (p.$size === 'md' ? 'var(--type-size-subject)' : 'var(--type-size-body)')};
  line-height: 1.35;
  color: ${(p) =>
    p.$disabled ? 'var(--color-disabled-disabled-inverse)' : 'var(--color-text-icon-primary)'};
`;

const TextGroup = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
  min-width: 0;
  flex: 1;
`;

/** 16px info icon — inherits the label color via currentColor. */
const InfoSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  & > svg {
    width: 100%;
    height: 100%;
  }
`;

/** "(required)" suffix — stays placeholder-colored even when disabled (per spec). */
const Required = styled.span`
  font-weight: var(--font-weight-regular);
  font-size: var(--type-size-helper);
  color: var(--color-text-icon-placeholder);
  white-space: nowrap;
`;

export interface InputLabelProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'children'> {
  /** The label text. */
  children: React.ReactNode;
  /**
   * Type size: `md` 16px (standalone rows), `sm` 14px (inside form fields —
   * TextInput uses this).
   * @default 'md'
   */
  size?: 'sm' | 'md';
  /** Appends the "(required)" suffix, right-aligned after the text. @default false */
  required?: boolean;
  /** Shows a 16px info icon after the text (inherits the label color). @default false */
  showInfo?: boolean;
  /** Dims the label text + icon (the "(required)" suffix keeps its color). @default false */
  disabled?: boolean;
  /** The form control this label describes. */
  htmlFor?: string;
}

export const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ children, size = 'md', required = false, showInfo = false, disabled = false, ...props }, ref) => (
    <Root ref={ref} $size={size} $disabled={disabled} {...props}>
      <TextGroup>
        <span>{children}</span>
        {showInfo ? (
          <InfoSlot aria-hidden>
            <Info />
          </InfoSlot>
        ) : null}
      </TextGroup>
      {required ? <Required>(required)</Required> : null}
    </Root>
  ),
);

InputLabel.displayName = 'InputLabel';
