import React from 'react';
import { Progress as RadixProgress } from 'radix-ui';
import styled from 'styled-components';
import { Info } from 'lucide-react';

import { HelperString, type HelperTone } from '../Elements/HelperString';

export type ProgressBarColor = 'info' | 'primary' | 'secondary' | 'success' | 'warn' | 'error';
export type ProgressBarWidth = 'thin' | 'thick';

/** Figma 87:4707 intrinsic progress-track geometry: 12px thin / 18px thick. */
const TRACK_HEIGHT: Record<ProgressBarWidth, number> = { thin: 12, thick: 18 };

const COLOR: Record<ProgressBarColor, string> = {
  info: 'var(--color-info-info)',
  primary: 'var(--color-primary-primary)',
  secondary: 'var(--color-secondary-secondary)',
  success: 'var(--color-success-success)',
  warn: 'var(--color-warning-warn)',
  error: 'var(--color-error-error)',
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  width: 100%;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

const LabelGroup = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
  font-weight: var(--font-weight-medium);
`;

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

const LabelValue = styled.span`
  flex-shrink: 0;
  margin-left: var(--space-100);
  font-weight: var(--font-weight-regular);
`;

const Track = styled(RadixProgress.Root)<{ $width: ProgressBarWidth }>`
  width: 100%;
  height: ${(p) => TRACK_HEIGHT[p.$width]}px;
  overflow: hidden;
  border-radius: var(--radius-1000);
  background: var(--color-stroke-border);
`;

const Indicator = styled(RadixProgress.Indicator)<{ $color: ProgressBarColor }>`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: ${(p) => COLOR[p.$color]};
  transform-origin: left;
  transition: transform 160ms ease;
`;

const HelperRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  width: 100%;
`;

const ProgressHelper = styled(HelperString)`
  flex: 1;
  min-width: 0;
`;

const Percentage = styled.span`
  flex-shrink: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-helper);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  color: var(--color-text-icon-secondary);
`;

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);

export interface ProgressBarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixProgress.Root>, 'children' | 'value' | 'max'> {
  /** Current determinate progress. Values outside 0–max are visually clamped. @default 30 */
  value?: number;
  /** Maximum progress value. @default 100 */
  max?: number;
  /**
   * Semantic indicator color from the Figma `color` variants.
   * @default 'info'
   */
  color?: ProgressBarColor;
  /**
   * Figma track thickness: `thin` is 12px; `thick` is 18px.
   * @default 'thick'
   */
  width?: ProgressBarWidth;
  /** Label shown above the progress track. When provided it labels the Radix progressbar. @default 'Label' */
  label?: React.ReactNode;
  /** Value aligned at the end of the label row, e.g. `40MB`. @default '40MB' */
  labelValue?: React.ReactNode;
  /** Shows the 16px informational glyph after the label. @default true */
  showLabelIcon?: boolean;
  /** Helper content beneath the track. @default 'Example helper string' */
  helperText?: React.ReactNode;
  /** Shows the helper row beneath the track. @default true */
  showHelper?: boolean;
  /** Shows the 16px HelperString icon before the helper text. @default true */
  showHelperIcon?: boolean;
  /**
   * Shows the calculated percentage at the right of the helper row.
   * @default true
   */
  showValue?: boolean;
  /** Semantic tone for the reusable HelperString. @default 'greyscale' */
  helperTone?: HelperTone;
  /** Accessible name used when no visible `label` is supplied. @default 'Progress' */
  'aria-label'?: string;
}

/**
 * hello pc ProgressBar — determinate progress feedback (Figma `&progress bar`,
 * node 87:4707). It wraps Radix `Progress`, reuses HelperString for its
 * optional feedback row, and exposes the six Figma semantic color treatments.
 */
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 30,
      max = 100,
      color = 'info',
      width = 'thick',
      label = 'Label',
      labelValue = '40MB',
      showLabelIcon = true,
      helperText = 'Example helper string',
      showHelper = true,
      showHelperIcon = true,
      showValue = true,
      helperTone = 'greyscale',
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const labelId = React.useId();
    const safeMax = max > 0 ? max : 100;
    const safeValue = clamp(value, safeMax);
    const ratio = safeValue / safeMax;
    const percentage = Math.round(ratio * 100);
    const hasHelper = showHelper && (helperText != null || showValue);

    return (
      <Root>
        {label != null ? (
          <LabelRow>
            <LabelGroup id={labelId}>
              <span>{label}</span>
              {showLabelIcon ? (
                <InfoSlot aria-hidden>
                  <Info />
                </InfoSlot>
              ) : null}
            </LabelGroup>
            {labelValue != null ? <LabelValue>{labelValue}</LabelValue> : null}
          </LabelRow>
        ) : null}
        <Track
          ref={ref}
          value={safeValue}
          max={safeMax}
          aria-labelledby={label != null && !ariaLabel ? labelId : undefined}
          aria-label={ariaLabel ?? (label == null ? 'Progress' : undefined)}
          $width={width}
          {...props}
        >
          <Indicator
            $color={color}
            style={{ transform: `translateX(-${100 - ratio * 100}%)` }}
          />
        </Track>
        {hasHelper ? (
          <HelperRow>
            {helperText != null ? (
              <ProgressHelper tone={helperTone} showIcon={showHelperIcon}>
                {helperText}
              </ProgressHelper>
            ) : (
              <span />
            )}
            {showValue ? <Percentage>{percentage}%</Percentage> : null}
          </HelperRow>
        ) : null}
      </Root>
    );
  },
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
