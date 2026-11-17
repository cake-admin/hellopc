import React from 'react';
import { RadioGroup as RadixRadioGroup } from 'radix-ui';
import styled from 'styled-components';

import { Divider } from '../Elements';

export type RatingCount = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** One choice on the scale (Figma `&rating.option`). */
export interface RatingOption {
  /** Value reported through `onValueChange` / form submission. */
  value: string;
  /** Text inside the tile — the number, or "N/A". */
  label: string;
  /** Optional caption under the tile (up to two lines). */
  caption?: string;
  /** Locks this option. A selected option stays visibly selected while disabled. */
  disabled?: boolean;
}

export interface RatingProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>,
    'children' | 'orientation' | 'asChild' | 'dir' | 'loop'
  > {
  /**
   * How many numbered options, 1 through `count` (Figma `count`, 2–10).
   * Ignored when `options` is set.
   * @default 5
   */
  count?: RatingCount;
  /**
   * Captions for the numbered options, index-aligned with 1…`count`
   * (e.g. `['No', 'Maybe', 'Yes']`). Missing entries render without a caption.
   */
  captions?: string[];
  /**
   * Show the captions under the tiles (Figma `showCaption`).
   * @default true
   */
  showCaptions?: boolean;
  /**
   * Adds a leading "N/A" option, separated from the scale by a divider
   * (Figma `showNa`). Its value is `"na"`.
   * @default false
   */
  showNa?: boolean;
  /** Tile text of the N/A option. @default 'N/A' */
  naLabel?: string;
  /** Caption of the N/A option. @default 'Unrated' */
  naCaption?: string;
  /**
   * Full control over the scale: replaces `count` / `captions`, for custom
   * values, labels, or per-option `disabled`. The N/A option (`showNa`) is
   * still prepended.
   */
  options?: RatingOption[];
}

/* ── Option ────────────────────────────────────────────────────────────── */

/** The tile: 48×40 (Figma `&rating.option` state layer, node 16702:983) —
 *  geometry intrinsic to the spec. Borders are inset box-shadows so the tile
 *  never shifts between the 1px and 2px states. */
const Tile = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 48px;
  height: 40px;
  padding: var(--space-100);
  border-radius: var(--radius-200);
  background: var(--color-control-fill);
  box-shadow: inset 0 0 0 var(--stroke-100) var(--color-control-border);
  color: var(--color-control-on-fill);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  transition: background-color 120ms ease, box-shadow 120ms ease, color 120ms ease;
`;

const Caption = styled.span`
  width: 100%;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  /* Figma regular.12: 0.2px tracking (no tracking token). */
  letter-spacing: 0.2px;
  line-height: 1.35;
  text-align: center;
  overflow-wrap: anywhere;
`;

/** The whole option — tile + caption — is the radio, so the caption is part
 *  of its accessible name and its click target. 86px wide per Figma. */
const Item = styled(RadixRadioGroup.Item)`
  display: inline-flex;
  flex: none;
  flex-direction: column;
  align-items: center;
  gap: var(--space-100);
  width: 86px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  font-family: var(--font-family);
  cursor: pointer;
  outline: none;

  &:hover:not([data-disabled]) ${Tile} {
    background: var(--color-control-fill-hover);
    box-shadow: inset 0 0 0 var(--stroke-200) var(--color-control-border-hover);
  }
  &:active:not([data-disabled]) ${Tile} {
    background: var(--color-control-fill-press);
    box-shadow: inset 0 0 0 var(--stroke-100) var(--color-control-border);
  }

  &[data-state='checked'] ${Tile} {
    background: var(--color-control-selected-fill);
    box-shadow: none;
    color: var(--color-control-on-selected);
  }
  &[data-state='checked']:hover:not([data-disabled]) ${Tile} {
    background: var(--color-control-selected-fill-hover);
    box-shadow: none;
  }
  &[data-state='checked']:active:not([data-disabled]) ${Tile} {
    background: var(--color-control-selected-fill-press);
  }

  &[data-disabled] {
    cursor: not-allowed;
  }
  &[data-disabled] ${Tile} {
    background: var(--color-control-disabled-fill);
    box-shadow: inset 0 0 0 var(--stroke-100) var(--color-control-disabled-border);
    color: var(--color-text-icon-disabled);
  }
  /* Selected + disabled (a locked answer) keeps a 2px ring so it still reads
     as the chosen value. */
  &[data-disabled][data-state='checked'] ${Tile} {
    box-shadow: inset 0 0 0 var(--stroke-200) var(--color-text-icon-disabled);
  }
  &[data-disabled] ${Caption} {
    color: var(--color-text-icon-disabled);
  }

  /* Focus keeps the current fill and adds a 3px ring hugging the tile. */
  &:focus-visible ${Tile}::after {
    content: '';
    position: absolute;
    inset: calc(-1 * var(--stroke-300));
    border: var(--stroke-300) solid var(--color-control-focus-ring);
    border-radius: calc(var(--radius-200) + var(--stroke-300));
    pointer-events: none;
  }
`;

/* ── Group ─────────────────────────────────────────────────────────────── */

const Root = styled(RadixRadioGroup.Root)`
  display: inline-flex;
  align-items: flex-start;
  gap: var(--space-300);
  font-family: var(--font-family);
`;

/** Numbered options sit 32px apart; N/A ↔ divider ↔ scale is 16px. */
const Scale = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-600);
`;

/** 64px-tall vertical rule between N/A and the scale (Figma 16734:210). */
const DividerSlot = styled.div`
  display: flex;
  align-self: center;
  height: var(--space-900);
`;

const Option = ({ option, showCaption }: { option: RatingOption; showCaption: boolean }) => (
  <Item value={option.value} disabled={option.disabled}>
    <Tile>{option.label}</Tile>
    {showCaption && option.caption ? <Caption>{option.caption}</Caption> : null}
  </Item>
);

/**
 * hello pc Rating — a horizontal scale of numbered options, 1 to `count`, each
 * with an optional caption, plus an optional leading N/A (Figma `&rating`,
 * page "Detailed Rating", node 16702:972). Use it for satisfaction and Likert
 * questions where the answer is one point on a scale.
 *
 * Built on Radix `RadioGroup`: a `radiogroup` of `radio`s with roving focus,
 * arrow-key selection, `name` / `required` form support. Colors come from the
 * `--color-control-*` tokens, which map to Windows system colors in win hct.
 */
export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      count = 5,
      captions = [],
      showCaptions = true,
      showNa = false,
      naLabel = 'N/A',
      naCaption = 'Unrated',
      options,
      ...props
    },
    ref,
  ) => {
    const scale: RatingOption[] =
      options ??
      Array.from({ length: count }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
        caption: captions[i],
      }));

    return (
      <Root ref={ref} orientation="horizontal" {...props}>
        {showNa ? (
          <>
            <Option option={{ value: 'na', label: naLabel, caption: naCaption }} showCaption={showCaptions} />
            <DividerSlot>
              <Divider direction="vertical" decorative />
            </DividerSlot>
          </>
        ) : null}
        <Scale>
          {scale.map((option) => (
            <Option key={option.value} option={option} showCaption={showCaptions} />
          ))}
        </Scale>
      </Root>
    );
  },
);

Rating.displayName = 'Rating';

export default Rating;
