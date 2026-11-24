import React from 'react';
import styled, { css } from 'styled-components';
import { CircleAlert, CircleCheck, Lock, Plus, SearchX } from 'lucide-react';

import { Button } from '../Button';

export type EmptyStateType = 'first-use' | 'no-results' | 'error' | 'no-access' | 'success';
export type EmptyStateSize = 'sm' | 'lg';

export interface EmptyStateAction {
  /** Visible button label — name the outcome ("Create device", "Try again"). */
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Scenario (Figma `type`) — sets the icon circle's color and the default icon:
   * `first-use` (nothing created yet), `no-results` (a search or filter found
   * nothing), `error` (content failed to load), `no-access` (missing
   * permission), `success` (nothing left to do).
   * @default 'first-use'
   */
  type?: EmptyStateType;
  /**
   * `sm` for cards, panels and table bodies (48px circle, 16px title, sm
   * buttons); `lg` for a page or large region (64px circle, 20px title).
   * @default 'sm'
   */
  size?: EmptyStateSize;
  /** One-line title — what's going on, in plain words. */
  title: React.ReactNode;
  /** Optional sentence explaining why, or what to do next. */
  description?: React.ReactNode;
  /**
   * Replaces the scenario's default icon. Inherits the circle's icon color and
   * size — don't color or size it. Pass `null` to hide the icon.
   */
  icon?: React.ReactNode | null;
  /** The main way forward, rendered as a primary fill Button (rightmost). */
  primaryAction?: EmptyStateAction;
  /** An alternative, rendered as a secondary outline Button before the primary. */
  secondaryAction?: EmptyStateAction;
  /**
   * Heading element for the title; the visual size comes from `size`.
   * @default 3
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** Circle fill + icon color per scenario (Figma hellopc.empty.state 17977:531).
 *  first-use uses surfaces/primary as bound in Figma (the others use *Overlay). */
const SCENARIO: Record<EmptyStateType, { bg: string; fg: string; icon: React.ReactNode }> = {
  'first-use': { bg: 'var(--color-surfaces-primary)', fg: 'var(--color-primary-primary)', icon: <Plus /> },
  'no-results': {
    bg: 'var(--color-secondary-secondary-overlay)',
    fg: 'var(--color-text-icon-secondary)',
    icon: <SearchX />,
  },
  error: { bg: 'var(--color-error-error-overlay)', fg: 'var(--color-error-error)', icon: <CircleAlert /> },
  'no-access': { bg: 'var(--color-warning-warn-overlay)', fg: 'var(--color-warning-warn)', icon: <Lock /> },
  success: { bg: 'var(--color-success-success-overlay)', fg: 'var(--color-success-success)', icon: <CircleCheck /> },
};

/** Per-size geometry: circle 48/64 with a 24/32 icon (Figma sm/lg), width cap
 *  368/448 (Figma frame widths, used as max-width). */
const SIZE = {
  sm: { circle: '48px', icon: 'var(--space-500)', maxWidth: '368px' },
  lg: { circle: '64px', icon: 'var(--space-600)', maxWidth: '448px' },
} as const;

const Root = styled.div<{ $size: EmptyStateSize }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-300);
  width: 100%;
  max-width: ${(p) => SIZE[p.$size].maxWidth};
  margin-inline: auto;
  padding: var(--space-500);
  font-family: var(--font-family);
  text-align: center;
`;

const Circle = styled.span<{ $size: EmptyStateSize; $type: EmptyStateType }>`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: ${(p) => SIZE[p.$size].circle};
  height: ${(p) => SIZE[p.$size].circle};
  border-radius: var(--radius-1000);
  background: ${(p) => SCENARIO[p.$type].bg};
  color: ${(p) => SCENARIO[p.$type].fg};

  & > svg {
    width: ${(p) => SIZE[p.$size].icon};
    height: ${(p) => SIZE[p.$size].icon};
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
`;

const titleStyles = {
  sm: css`
    font-size: var(--type-size-subject);
    font-weight: var(--font-weight-medium);
  `,
  lg: css`
    font-size: var(--type-size-title);
    font-weight: var(--font-weight-bold);
  `,
};

const Title = styled.h3<{ $size: EmptyStateSize }>`
  margin: 0;
  color: var(--color-text-icon-primary);
  line-height: 1.35;
  ${(p) => titleStyles[p.$size]}
`;

const Description = styled.p<{ $size: EmptyStateSize }>`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: ${(p) => (p.$size === 'lg' ? 'var(--type-size-subject)' : 'var(--type-size-body)')};
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-100);
`;

/**
 * hello pc Empty State — what to show when a view has no content (Figma
 * `hellopc.empty.state`, node 17977:531): an icon in a tinted circle, a title,
 * an optional description and up to two actions. It has no surface of its own;
 * it sits on its host (a card, panel, table body or page).
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      type = 'first-use',
      size = 'sm',
      title,
      description,
      icon,
      primaryAction,
      secondaryAction,
      headingLevel = 3,
      ...props
    },
    ref,
  ) => {
    const glyph = icon === null ? null : icon ?? SCENARIO[type].icon;
    const buttonSize = size === 'lg' ? 'md' : 'sm';

    return (
      <Root ref={ref} $size={size} {...props}>
        {glyph ? (
          <Circle $size={size} $type={type} aria-hidden>
            {glyph}
          </Circle>
        ) : null}
        <Text>
          <Title as={`h${headingLevel}` as 'h3'} $size={size}>
            {title}
          </Title>
          {description ? <Description $size={size}>{description}</Description> : null}
        </Text>
        {/* No actions → no actions row (Figma keeps an empty fixed frame for
            success, which would add dead height). */}
        {primaryAction || secondaryAction ? (
          <Actions>
            {secondaryAction ? (
              <Button
                size={buttonSize}
                intent="secondary"
                variant="outline"
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
            {primaryAction ? (
              <Button size={buttonSize} onClick={primaryAction.onClick} disabled={primaryAction.disabled}>
                {primaryAction.label}
              </Button>
            ) : null}
          </Actions>
        ) : null}
      </Root>
    );
  },
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
