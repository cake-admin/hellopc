import React from 'react';
import styled, { css } from 'styled-components';
import { Star } from 'lucide-react';

export type StarRatingSize = 'sm' | 'lg';

export interface StarRatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The score, 0–`max`. Whole stars are drawn; the number is rounded for the stars. */
  value: number;
  /** How many stars make the scale. @default 5 */
  max?: number;
  /**
   * `sm` 28px stars (12px text), `lg` 32px stars (bold 20 value, medium 16 label).
   * @default 'sm'
   */
  size?: StarRatingSize;
  /**
   * Shows the score as text before the stars (Figma `showValue`), formatted with
   * one decimal ("4.0") unless you pass `valueText`.
   * @default false
   */
  showValue?: boolean;
  /** Custom score text (e.g. "4.3 (128)"); implies `showValue`. */
  valueText?: string;
  /** Optional label after the stars ("Approved supplier"). */
  label?: string;
  /**
   * Accessible name for the whole rating. Defaults to "Rated N out of M stars",
   * prefixed with `label` when one is given.
   */
  'aria-label'?: string;
}

/** Star size per size (Figma hellopc.rating 17303:429: 28 / 32, geometry). */
const STAR = { sm: '28px', lg: '32px' } as const;

const Root = styled.div<{ $size: StarRatingSize }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => (p.$size === 'lg' ? 'var(--space-100)' : 'var(--space-050)')};
  font-family: var(--font-family);
  color: var(--color-text-icon-primary);
  line-height: 1.35;
`;

const Stars = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
`;

/** Filled stars: rating-filled with a rating-outline edge; empty stars: a
 *  rating-empty outline. Shape (filled vs outline) carries the meaning, so the
 *  win hct system-color mapping still reads. */
const StarGlyph = styled.span<{ $size: StarRatingSize; $filled: boolean }>`
  display: inline-flex;

  & > svg {
    width: ${(p) => STAR[p.$size]};
    height: ${(p) => STAR[p.$size]};
    ${(p) =>
      p.$filled
        ? css`
            fill: var(--color-rating-filled);
            stroke: var(--color-rating-outline);
          `
        : css`
            fill: none;
            stroke: var(--color-rating-empty);
          `}
  }
`;

const valueStyles = {
  sm: css`
    font-size: var(--type-size-caption);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.2px;
  `,
  lg: css`
    font-size: var(--type-size-title);
    font-weight: var(--font-weight-bold);
  `,
};

const labelStyles = {
  sm: css`
    font-size: var(--type-size-caption);
    font-weight: var(--font-weight-regular);
    letter-spacing: 0.2px;
  `,
  lg: css`
    font-size: var(--type-size-subject);
    font-weight: var(--font-weight-medium);
  `,
};

const Value = styled.span<{ $size: StarRatingSize }>`
  ${(p) => valueStyles[p.$size]}
`;

const Label = styled.span<{ $size: StarRatingSize }>`
  ${(p) => labelStyles[p.$size]}
`;

/**
 * hello pc Star Rating — a read-only star score for reviews, scores and
 * relationship strength (Figma `hellopc.rating`, set 17303:429). Display only:
 * it shows a result and takes no input. For collecting a score, use `Rating`.
 */
export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    { value, max = 5, size = 'sm', showValue = false, valueText, label, 'aria-label': ariaLabel, ...props },
    ref,
  ) => {
    const clamped = Math.min(Math.max(value, 0), max);
    const filled = Math.round(clamped);
    const shownValue = valueText ?? clamped.toFixed(1);
    const name =
      ariaLabel ??
      `${label ? `${label}: ` : ''}Rated ${Number.isInteger(clamped) ? clamped : clamped.toFixed(1)} out of ${max} stars`;

    return (
      <Root ref={ref} role="img" aria-label={name} $size={size} {...props}>
        {showValue || valueText ? (
          <Value $size={size} aria-hidden>
            {shownValue}
          </Value>
        ) : null}
        <Stars aria-hidden>
          {Array.from({ length: max }, (_, i) => (
            <StarGlyph key={i} $size={size} $filled={i < filled}>
              <Star strokeWidth={i < filled ? 1 : 1.5} />
            </StarGlyph>
          ))}
        </Stars>
        {label ? (
          <Label $size={size} aria-hidden>
            {label}
          </Label>
        ) : null}
      </Root>
    );
  },
);

StarRating.displayName = 'StarRating';

export default StarRating;
