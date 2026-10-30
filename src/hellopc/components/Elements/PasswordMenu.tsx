import React from 'react';
import styled from 'styled-components';

import { ProgressBar, type ProgressBarColor } from '../Progress Indicators/ProgressBar';
import { HelperString } from './HelperString';
import { InputLabel } from './InputLabel';

export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

/**
 * A password policy rule. `metAt` declares the lowest password strength at
 * which the rule is treated as satisfied.
 */
export interface PasswordRequirement {
  /** Stable key for the rule. */
  id: string;
  /** Human-readable policy requirement. */
  label: string;
  /** Lowest strength at which the requirement is considered satisfied. */
  metAt: Exclude<PasswordStrength, 'empty'>;
}

/**
 * hello pc PasswordMenu — static password-strength and policy feedback (Figma
 * "&password menu", node 72:5116). It is an element intended to sit beside or
 * below a password field; it does not collect a password itself.
 *
 * The component composes `HelperString` for every criterion row so status
 * icons remain consistent across form feedback, and can optionally compose
 * `InputLabel` above the card when its owning password field needs a label.
 *
 * The strength meter composes hello pc `ProgressBar` (which wraps Radix
 * `Progress`) instead of duplicating track, indicator, and progress semantics.
 * The rest of the card is static, non-interactive feedback (a region and
 * requirements list).
 *
 * Figma status mapping:
 * - empty: no progress; every rule is unmet.
 * - weak: lowercase met; red strength progress.
 * - medium: lowercase + uppercase met; warning strength progress.
 * - strong: all rules met; success progress.
 *
 * The card floats over the field it annotates, so it takes `--elevation-3`
 * (Figma `elevation/3`) — the same overlay level as Dropdown and Menu.
 */

const STRENGTH_ORDER: Record<PasswordStrength, number> = {
  empty: 0,
  weak: 1,
  medium: 2,
  strong: 3,
};

const DEFAULT_REQUIREMENTS: PasswordRequirement[] = [
  { id: 'lowercase', label: 'At least one lowercase', metAt: 'weak' },
  { id: 'uppercase', label: 'At least one uppercase', metAt: 'medium' },
  { id: 'numeric', label: 'At least one numeric', metAt: 'strong' },
  { id: 'length', label: 'Minimum 8 characters', metAt: 'strong' },
];

/** Figma 72:5116 card width. The 12px track is provided by ProgressBar's thin variant. */
const CARD_WIDTH = 320;

const Root = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: var(--space-050);
  width: ${CARD_WIDTH}px;
  max-width: 100%;
  font-family: var(--font-family);
`;

const Card = styled.section`
  overflow: hidden;
  border-radius: var(--radius-200);
  background: var(--color-surfaces-container);
  box-shadow: var(--elevation-3);
  /*
   * Figma's "surfaces/container blur" effect has a 90-radius blur. CSS's
   * 45px blur is the equivalent visual radius; this is intrinsic geometry
   * from node 72:5116, not a tokenized spacing or shadow value.
   */
  backdrop-filter: blur(45px);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding: var(--space-300);
`;

const Title = styled.h2`
  width: 100%;
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const Status = styled.p`
  width: 100%;
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const Divider = styled.div`
  height: var(--stroke-100);
  background: var(--color-stroke-border);
`;

const Requirements = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  margin: 0;
  padding: var(--space-300);
  list-style: none;
`;

/*
 * Reuse HelperString for its consistent 16px status icon and spacing, but
 * match Figma by keeping the policy text primary while the icon alone carries
 * success/error meaning.
 */
const Requirement = styled(HelperString)<{ $met: boolean }>`
  color: var(--color-text-icon-primary);

  svg {
    color: ${(p) => (p.$met ? 'var(--color-success-success)' : 'var(--color-error-error)')};
  }
`;

const STATUS_LABEL: Record<PasswordStrength, string> = {
  empty: 'Enter a password',
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
};

/** The Figma password-strength meter uses a deliberately non-linear progression. */
const STRENGTH_PROGRESS: Record<PasswordStrength, number> = {
  empty: 0,
  weak: 43,
  medium: 43,
  strong: 100,
};

const STRENGTH_COLOR: Record<PasswordStrength, ProgressBarColor> = {
  empty: 'secondary',
  weak: 'error',
  medium: 'warn',
  strong: 'success',
};

export interface PasswordMenuProps {
  /**
   * Password strength supplied by the owning password field. This component
   * displays policy feedback only and never calculates or stores a password.
   * @default 'empty'
   */
  strength?: PasswordStrength;
  /** Title in the card header. @default 'Pick a password' */
  title?: string;
  /** Overrides the visible strength status line. */
  statusLabel?: string;
  /** Requirement list; defaults to the four Figma criteria. */
  requirements?: PasswordRequirement[];
  /**
   * Explicitly satisfied requirement ids. When omitted, satisfaction follows
   * the Figma strength progression; password fields should provide it when
   * individual policy rules can be met out of order.
   */
  metRequirementIds?: string[];
  /**
   * Optional field label above the menu, composed through `InputLabel`. Pass
   * `htmlFor` to associate it with the owning password input.
   */
  label?: string;
  /** The password field described by the optional external label. */
  htmlFor?: string;
  /** Shows the optional label's 16px info icon. @default false */
  showLabelInfo?: boolean;
  /** Appends the optional label's "(required)" suffix. @default false */
  required?: boolean;
  /** Dims the optional label. The menu remains readable feedback. @default false */
  disabled?: boolean;
  /** Accessible name for the card region when its title is insufficient. */
  'aria-label'?: string;
}

export const PasswordMenu = React.forwardRef<HTMLElement, PasswordMenuProps>(
  (
    {
      strength = 'empty',
      title = 'Pick a password',
      statusLabel,
      requirements = DEFAULT_REQUIREMENTS,
      metRequirementIds,
      label,
      htmlFor,
      showLabelInfo = false,
      required = false,
      disabled = false,
      'aria-label': ariaLabel,
    },
    ref,
  ) => {
    const titleId = React.useId();
    const strengthValue = STRENGTH_ORDER[strength];

    return (
      <Root>
        {label ? (
          <InputLabel
            htmlFor={htmlFor}
            size="sm"
            required={required}
            showInfo={showLabelInfo}
            disabled={disabled}
          >
            {label}
          </InputLabel>
        ) : null}
        <Card ref={ref} aria-labelledby={ariaLabel ? undefined : titleId} aria-label={ariaLabel}>
          <Header>
            <Title id={titleId}>{title}</Title>
            <ProgressBar
              value={STRENGTH_PROGRESS[strength]}
              color={STRENGTH_COLOR[strength]}
              width="thin"
              label={null}
              showHelper={false}
              aria-label="Password strength"
              aria-valuetext={statusLabel ?? STATUS_LABEL[strength]}
            />
            <Status aria-live="polite">{statusLabel ?? STATUS_LABEL[strength]}</Status>
          </Header>
          <Divider />
          <Requirements aria-label="Password requirements">
            {requirements.map((requirement) => {
              const met = metRequirementIds
                ? metRequirementIds.includes(requirement.id)
                : strengthValue >= STRENGTH_ORDER[requirement.metAt];
              return (
                <li key={requirement.id}>
                  <Requirement tone={met ? 'success' : 'error'} $met={met}>
                    {requirement.label}
                  </Requirement>
                </li>
              );
            })}
          </Requirements>
        </Card>
      </Root>
    );
  },
);

PasswordMenu.displayName = 'PasswordMenu';
