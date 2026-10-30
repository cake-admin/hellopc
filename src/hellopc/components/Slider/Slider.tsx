import React from 'react';
import { Slider as RadixSlider } from 'radix-ui';
import styled from 'styled-components';

import { NumberInput } from '../NumberInput/NumberInput';

export type SliderType = 'continuous' | 'discrete';

/* The Figma frames use a 56px value field, but NumberInput's real 12px
   leading inset plus the reusable suffix need 64px to avoid clipping values.
   Grow the complete rows by the same amount so the track does not shrink. */
const SINGLE_WIDTH = 314;
const RANGE_WIDTH = 404;
const FRAME_HEIGHT = 56;
const THUMB_SIZE = 20;
const THUMB_HIT_SIZE = 48;
const TRACK_HEIGHT = 4;
const STATE_LAYER_SIZE = 40;

const Frame = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--space-300);
  height: ${FRAME_HEIGHT}px;
  padding: var(--space-100);
  font-family: var(--font-family);
`;

const Endpoint = styled.span`
  flex-shrink: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  line-height: 1.35;
  letter-spacing: 0.2px;
  white-space: nowrap;
`;

const InputSlot = styled.div`
  flex: 0 0 var(--space-900);
  width: var(--space-900);
`;

const Control = styled(RadixSlider.Root)`
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  height: ${THUMB_HIT_SIZE}px;
  align-items: center;
  touch-action: none;
  user-select: none;

  &[data-disabled] {
    cursor: not-allowed;
  }
`;

const Track = styled(RadixSlider.Track)<{ $discrete: boolean }>`
  position: relative;
  flex: 1;
  height: ${TRACK_HEIGHT}px;
  overflow: hidden;
  border-radius: var(--radius-50);
  background: var(--color-stroke-border);

  ${Control}[data-disabled] & {
    background: var(--color-disabled-disabled);
  }
`;

const ActiveRange = styled(RadixSlider.Range)`
  position: absolute;
  height: 100%;
  border-radius: var(--radius-1000);
  background: var(--color-primary-primary);

  ${Control}[data-disabled] & {
    background: var(--color-disabled-disabled-inverse);
  }
`;

const Ticks = styled.span`
  position: absolute;
  inset: 0 var(--stroke-100);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
`;

const Tick = styled.span`
  width: var(--space-025);
  height: var(--space-025);
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-container);
`;

const Marker = styled.span`
  position: absolute;
  top: calc(100% + var(--space-050));
  left: 50%;
  z-index: 2;
  display: none;
  transform: translateX(-50%);
  padding: var(--space-050) var(--space-100);
  border-radius: var(--radius-1000);
  background: var(--color-primary-primary);
  color: var(--color-text-icon-on-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  letter-spacing: 0.2px;
  white-space: nowrap;
  pointer-events: none;
`;

const Thumb = styled(RadixSlider.Thumb)`
  all: unset;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  display: block;
  width: ${THUMB_SIZE}px;
  height: ${THUMB_SIZE}px;
  border-radius: var(--radius-1000);
  background: var(--color-primary-primary);
  box-shadow: var(--elevation-0);
  cursor: grab;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${STATE_LAYER_SIZE}px;
    height: ${STATE_LAYER_SIZE}px;
    transform: translate(-50%, -50%);
    border-radius: var(--radius-1000);
    background: transparent;
    pointer-events: none;
  }

  &:hover::before,
  &:focus-visible::before {
    background: var(--color-primary-primary-overlay-hover);
  }

  &:active {
    cursor: grabbing;
  }

  &:active::before {
    background: var(--color-primary-primary-overlay-press);
  }

  &:hover ${Marker},
  &:focus-visible ${Marker},
  &:active ${Marker} {
    display: block;
  }

  &[data-disabled] {
    background: var(--color-disabled-disabled-inverse);
    box-shadow: none;
    cursor: not-allowed;
  }

  &[data-disabled]::before {
    display: none;
  }
`;

interface SharedSliderProps {
  /** Continuous track or discrete track with evenly spaced tick marks. @default 'continuous' */
  type?: SliderType;
  /** Minimum selectable value. @default 0 */
  min?: number;
  /** Maximum selectable value. @default 100 */
  max?: number;
  /** Keyboard/pointer increment and discrete step size. @default 1 */
  step?: number;
  /** Number of visual tick marks in discrete mode, including both endpoints. @default 9 */
  tickCount?: number;
  /** Shows the minimum and maximum values beside the track. @default true */
  showEndpoints?: boolean;
  /** Shows synchronized NumberInput control(s). @default true */
  showValueInput?: boolean;
  /** Non-editable suffix shown by the NumberInput controls. @default '%' */
  inputSuffix?: React.ReactNode;
  /** Formats endpoint labels, thumb markers, and accessible value text. */
  formatValue?: (value: number) => React.ReactNode;
  /** Disables pointer, keyboard, and NumberInput interaction. @default false */
  disabled?: boolean;
  /** Form field name passed to Radix Slider. */
  name?: string;
  /** Width of the complete slider row (number = px). */
  width?: number | string;
  /** Applied to the outer layout row. */
  className?: string;
  /** Applied to the outer layout row. */
  style?: React.CSSProperties;
  /** Fires continuously while a thumb moves. */
  onValueChange?: (value: number[]) => void;
  /** Fires when pointer/keyboard interaction finishes. */
  onValueCommit?: (value: number[]) => void;
}

export interface SliderProps extends Omit<SharedSliderProps, 'onValueChange' | 'onValueCommit'> {
  /** Controlled value. */
  value?: number;
  /** Initial value for uncontrolled usage. @default 50 */
  defaultValue?: number;
  /** Accessible name applied to the thumb. */
  'aria-label'?: string;
  /** Fires continuously while the value changes. */
  onValueChange?: (value: number) => void;
  /** Fires when pointer/keyboard interaction finishes. */
  onValueCommit?: (value: number) => void;
}

export interface RangeSliderProps extends Omit<SharedSliderProps, 'onValueChange' | 'onValueCommit'> {
  /** Controlled lower and upper values. */
  value?: readonly [number, number];
  /** Initial lower and upper values for uncontrolled usage. @default [10, 50] */
  defaultValue?: readonly [number, number];
  /** Minimum number of `step` increments kept between thumbs. @default 0 */
  minStepsBetweenThumbs?: number;
  /** Accessible names for the lower and upper thumbs. */
  'aria-label'?: readonly [string, string];
  /** Fires continuously with the lower and upper values. */
  onValueChange?: (value: [number, number]) => void;
  /** Fires when pointer/keyboard interaction finishes. */
  onValueCommit?: (value: [number, number]) => void;
}

interface SliderBaseProps extends SharedSliderProps {
  value?: readonly number[];
  defaultValue: readonly number[];
  labels: readonly string[];
  minStepsBetweenThumbs?: number;
  range: boolean;
}

const SliderBase = React.forwardRef<HTMLSpanElement, SliderBaseProps>(
  (
    {
      value,
      defaultValue,
      labels,
      range,
      type = 'continuous',
      min = 0,
      max = 100,
      step = 1,
      tickCount = 9,
      showEndpoints = true,
      showValueInput = true,
      inputSuffix = '%',
      formatValue = String,
      disabled = false,
      width,
      name,
      minStepsBetweenThumbs = 0,
      className,
      style,
      onValueChange,
      onValueCommit,
    },
    ref,
  ) => {
    const [innerValue, setInnerValue] = React.useState<number[]>([...defaultValue]);
    const currentValue = value ? [...value] : innerValue;

    const commit = (next: number[]) => {
      if (!value) setInnerValue(next);
      onValueChange?.(next);
    };

    const updateInput = (index: number, next: number | undefined) => {
      if (next == null) return;
      const clamped = Math.min(max, Math.max(min, next));
      const updated = [...currentValue];
      updated[index] = clamped;
      if (range) {
        const gap = minStepsBetweenThumbs * step;
        if (index === 0) updated[0] = Math.min(clamped, updated[1] - gap);
        if (index === 1) updated[1] = Math.max(clamped, updated[0] + gap);
      }
      commit(updated);
    };

    const marks = Math.max(2, Math.floor(tickCount));
    const rowWidth = width ?? (range ? RANGE_WIDTH : SINGLE_WIDTH);

    const input = (index: number) => (
      <InputSlot>
        <NumberInput
          aria-label={labels[index]}
          value={currentValue[index]}
          min={min}
          max={max}
          step={step}
          suffix={inputSuffix}
          showDecrement={false}
          showIncrement={false}
          disabled={disabled}
          onValueChange={(next) => updateInput(index, next)}
        />
      </InputSlot>
    );

    return (
      <Frame className={className} style={{ width: rowWidth, ...style }}>
        {range && showValueInput ? input(0) : null}
        {showEndpoints ? <Endpoint>{formatValue(min)}</Endpoint> : null}
        <Control
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          name={name}
          minStepsBetweenThumbs={minStepsBetweenThumbs}
          onValueChange={commit}
          onValueCommit={onValueCommit}
        >
          <Track $discrete={type === 'discrete'}>
            <ActiveRange />
            {type === 'discrete' ? (
              <Ticks aria-hidden>
                {Array.from({ length: marks }, (_, index) => (
                  <Tick key={index} />
                ))}
              </Ticks>
            ) : null}
          </Track>
          {currentValue.map((thumbValue, index) => (
            <Thumb
              key={index}
              aria-label={labels[index]}
              aria-valuetext={String(formatValue(thumbValue))}
            >
              <Marker aria-hidden>{formatValue(thumbValue)}</Marker>
            </Thumb>
          ))}
        </Control>
        {showEndpoints ? <Endpoint>{formatValue(max)}</Endpoint> : null}
        {showValueInput ? input(range ? 1 : 0) : null}
      </Frame>
    );
  },
);

SliderBase.displayName = 'SliderBase';

/**
 * hello pc Slider (Figma 125:6383) wraps Radix Slider for selecting one value.
 * It composes NumberInput when `showValueInput` is enabled.
 */
export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  (
    {
      value,
      defaultValue = 50,
      'aria-label': ariaLabel = 'Value',
      onValueChange,
      onValueCommit,
      ...props
    },
    ref,
  ) => (
    <SliderBase
      ref={ref}
      {...props}
      range={false}
      labels={[ariaLabel]}
      value={value == null ? undefined : [value]}
      defaultValue={[defaultValue]}
      onValueChange={(next) => onValueChange?.(next[0])}
      onValueCommit={(next) => onValueCommit?.(next[0])}
    />
  ),
);

Slider.displayName = 'Slider';

/**
 * hello pc RangeSlider (Figma 125:7821) wraps the same Radix Slider primitive
 * with two thumbs and synchronized NumberInput controls.
 */
export const RangeSlider = React.forwardRef<HTMLSpanElement, RangeSliderProps>(
  (
    {
      value,
      defaultValue = [10, 50],
      minStepsBetweenThumbs = 0,
      'aria-label': ariaLabel = ['Minimum value', 'Maximum value'],
      onValueChange,
      onValueCommit,
      ...props
    },
    ref,
  ) => (
    <SliderBase
      ref={ref}
      {...props}
      range
      labels={ariaLabel}
      value={value}
      defaultValue={defaultValue}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      onValueChange={(next) => onValueChange?.(next as [number, number])}
      onValueCommit={(next) => onValueCommit?.(next as [number, number])}
    />
  ),
);

RangeSlider.displayName = 'RangeSlider';

export default Slider;
