import React from 'react';
import styled, { css } from 'styled-components';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

export type ThumbsRatingValue = 'up' | 'down' | null;
export type ThumbsRatingSize = 'sm' | 'lg';

export interface ThumbsRatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The result: thumbs up, thumbs down, or `null` for no rating yet. */
  value: ThumbsRatingValue;
  /** `sm` 28px thumbs (regular 12 label), `lg` 32px (medium 16 label). @default 'sm' */
  size?: ThumbsRatingSize;
  /** Optional label after the thumbs ("Feedback"). */
  label?: string;
  /**
   * Accessible name. Defaults to "<label>: thumbs up / thumbs down / no rating"
   * (label defaults to "Feedback").
   */
  'aria-label'?: string;
}

/** Thumb size per size (Figma hellopc.rating.thumbs 18926:3316: 28 / 32, geometry). */
const THUMB = { sm: '28px', lg: '32px' } as const;

const Root = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  font-family: var(--font-family);
  color: var(--color-text-icon-primary);
  line-height: 1.35;
`;

const Thumbs = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
`;

/** Selected: filled in primary; unselected: a rating-empty outline. */
const ThumbGlyph = styled.span<{ $size: ThumbsRatingSize; $selected: boolean }>`
  display: inline-flex;

  & > svg {
    width: ${(p) => THUMB[p.$size]};
    height: ${(p) => THUMB[p.$size]};
    ${(p) =>
      p.$selected
        ? css`
            fill: var(--color-primary-primary);
            stroke: var(--color-primary-primary);
          `
        : css`
            fill: none;
            stroke: var(--color-rating-empty);
          `}
  }
`;

const Label = styled.span<{ $size: ThumbsRatingSize }>`
  ${(p) =>
    p.$size === 'lg'
      ? css`
          font-size: var(--type-size-subject);
          font-weight: var(--font-weight-medium);
        `
      : css`
          font-size: var(--type-size-caption);
          font-weight: var(--font-weight-regular);
          letter-spacing: 0.2px;
        `}
`;

const RESULT: Record<string, string> = { up: 'thumbs up', down: 'thumbs down', none: 'no rating' };

/**
 * hello pc Thumbs Rating — a read-only thumbs up / down result (Figma
 * `hellopc.rating.thumbs`, set 18926:3316). Display only. For giving feedback
 * on an AI response, use `AiFeedback`.
 */
export const ThumbsRating = React.forwardRef<HTMLDivElement, ThumbsRatingProps>(
  ({ value, size = 'sm', label, 'aria-label': ariaLabel, ...props }, ref) => {
    const name = ariaLabel ?? `${label ?? 'Feedback'}: ${RESULT[value ?? 'none']}`;
    return (
      <Root ref={ref} role="img" aria-label={name} {...props}>
        <Thumbs aria-hidden>
          <ThumbGlyph $size={size} $selected={value === 'up'}>
            <ThumbsUp strokeWidth={1.5} />
          </ThumbGlyph>
          <ThumbGlyph $size={size} $selected={value === 'down'}>
            <ThumbsDown strokeWidth={1.5} />
          </ThumbGlyph>
        </Thumbs>
        {label ? (
          <Label $size={size} aria-hidden>
            {label}
          </Label>
        ) : null}
      </Root>
    );
  },
);

ThumbsRating.displayName = 'ThumbsRating';

export default ThumbsRating;
