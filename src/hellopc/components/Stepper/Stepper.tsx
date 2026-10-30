import React from 'react';
import styled, { css } from 'styled-components';
import { Check } from 'lucide-react';

/**
 * hello pc Stepper — progress through a multi-step flow (Figma "& Stepper",
 * node 5473:1146). Composes Figma's `&stepper.item` + `&stepper.line` into
 * `&vertical.stepper` / `&horizontal.stepper`.
 *
 * Presentational by default (like ProgressBar): stages derive from
 * `activeIndex`. Optional `onStepClick` turns non-current steps into buttons
 * for wizard-style navigation. No Radix primitive covers a stepper trail, so
 * the root is a `<nav>` landmark wrapping an ordered list with
 * `aria-current="step"` on the active item.
 *
 * Markers match the Radio glyph geometry (24px target / 16px ring / 8px dot)
 * and the Material `check_circle` complete treatment, but they are **not** the
 * Radio form control — a stepper must not introduce radio roles or a group.
 *
 * Spec geometry (Figma 5326:2949 / 5326:2970 / 5326:3034 / 5326:3047):
 * 24px marker slot, 16px glyph, 40px connector, 4px icon↔text gap, 8px
 * horizontal step gap, 12px connector centering pad.
 */

/** Figma connector length — vertical bar / horizontal span. */
const CONNECTOR_LENGTH = 40;
/** Figma marker slot — matches Radio's 24px touch target. */
const MARKER_SLOT = 24;
/** Figma ring / check disc diameter. */
const MARKER_GLYPH = 16;
/** Figma selected radio dot. */
const MARKER_DOT = 8;

export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperStage = 'complete' | 'current' | 'incomplete';

export interface StepperStep {
  /** Step title (Figma `stepTitle`). */
  title: string;
  /** Optional description under the title (Figma `stepDescription`). */
  description?: string;
}

export interface StepperProps extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'children'> {
  /** Ordered steps to render. */
  steps: StepperStep[];
  /**
   * 0-based index of the current step. Steps before it are `complete`; steps
   * after it are `incomplete`.
   * @default 0
   */
  activeIndex?: number;
  /**
   * Layout axis — Figma `&vertical.stepper` / `&horizontal.stepper`.
   * @default 'vertical'
   */
  orientation?: StepperOrientation;
  /**
   * When `false`, hides every step's description (Figma `showDescription`).
   * @default true
   */
  showDescription?: boolean;
  /**
   * Fired when a non-current step is activated. Omit to keep the stepper
   * display-only.
   */
  onStepClick?: (index: number) => void;
  /**
   * Accessible name for the landmark. Provide this (or `aria-labelledby`) so
   * assistive tech announces what the steps are for.
   * @default 'Progress'
   */
  'aria-label'?: string;
}

const stageForIndex = (index: number, activeIndex: number): StepperStage => {
  if (index < activeIndex) return 'complete';
  if (index === activeIndex) return 'current';
  return 'incomplete';
};

/** Connector after step `index` is complete when that step itself is complete. */
const lineComplete = (index: number, activeIndex: number) => index < activeIndex;

const Nav = styled.nav`
  font-family: var(--font-family);
`;

const List = styled.ol<{ $orientation: StepperOrientation }>`
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;

  ${(p) =>
    p.$orientation === 'horizontal'
      ? css`
          flex-direction: row;
          align-items: center;
          gap: var(--space-100);
        `
      : css`
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        `}
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0;
  padding: 0;
`;

const StepRow = styled.div<{ $interactive: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--space-050);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  font: inherit;
  text-align: left;
  color: inherit;

  ${(p) =>
    p.$interactive
      ? css`
          cursor: pointer;
          border-radius: var(--radius-50);

          &:focus-visible {
            outline: var(--stroke-200) solid var(--color-primary-primary);
            outline-offset: var(--space-025);
          }
        `
      : css`
          cursor: default;
        `}
`;

const MarkerSlot = styled.span`
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${MARKER_SLOT}px;
  height: ${MARKER_SLOT}px;
`;

/** Complete: filled success disc + inverse check (Figma `check_circle`). */
const CompleteGlyph = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${MARKER_GLYPH}px;
  height: ${MARKER_GLYPH}px;
  border-radius: var(--radius-1000);
  background: var(--color-success-success);
  color: var(--color-text-icon-inverse);

  & > svg {
    width: 10px;
    height: 10px;
    stroke-width: 3;
  }
`;

/** Current / incomplete: Radio-matching ring (+ primary fill when current). */
const RingGlyph = styled.span<{ $current: boolean }>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${MARKER_GLYPH}px;
  height: ${MARKER_GLYPH}px;
  border-radius: var(--radius-1000);
  border: var(--stroke-200) solid
    ${(p) =>
      p.$current ? 'var(--color-primary-primary)' : 'var(--color-text-icon-secondary)'};
  background: transparent;
`;

const Dot = styled.span`
  display: block;
  width: ${MARKER_DOT}px;
  height: ${MARKER_DOT}px;
  border-radius: var(--radius-1000);
  background: var(--color-primary-primary);
`;

const TextCol = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
  line-height: 1.35;
`;

const Title = styled.span<{ $stage: StepperStage }>`
  font-size: var(--type-size-body);
  font-weight: ${(p) =>
    p.$stage === 'current' ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)'};
  color: ${(p) =>
    p.$stage === 'current'
      ? 'var(--color-text-icon-secondary)'
      : 'var(--color-text-icon-primary)'};
  white-space: nowrap;
`;

const Description = styled.span`
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-icon-secondary);
`;

const Connector = styled.li<{
  $orientation: StepperOrientation;
  $complete: boolean;
}>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  list-style: none;

  ${(p) =>
    p.$orientation === 'vertical'
      ? css`
          padding: 0 var(--space-200);
        `
      : css`
          padding: var(--space-200) 0;
        `}

  &::before {
    content: '';
    display: block;
    background: ${(p) =>
      p.$complete ? 'var(--color-success-success)' : 'var(--color-stroke-border)'};
    border-radius: var(--radius-1000);

    ${(p) =>
      p.$orientation === 'vertical'
        ? css`
            width: var(--stroke-100);
            height: ${CONNECTOR_LENGTH}px;
          `
        : css`
            width: ${CONNECTOR_LENGTH}px;
            height: var(--stroke-100);
          `}
  }
`;

const Marker = ({ stage }: { stage: StepperStage }) => {
  if (stage === 'complete') {
    return (
      <MarkerSlot aria-hidden>
        <CompleteGlyph>
          <Check />
        </CompleteGlyph>
      </MarkerSlot>
    );
  }

  return (
    <MarkerSlot aria-hidden>
      <RingGlyph $current={stage === 'current'}>
        {stage === 'current' ? <Dot /> : null}
      </RingGlyph>
    </MarkerSlot>
  );
};

export const Stepper = React.forwardRef<HTMLElement, StepperProps>(
  (
    {
      steps,
      activeIndex = 0,
      orientation = 'vertical',
      showDescription = true,
      onStepClick,
      'aria-label': ariaLabel = 'Progress',
      ...rest
    },
    ref,
  ) => {
    const clampedActive = Math.max(0, Math.min(activeIndex, Math.max(steps.length - 1, 0)));

    return (
      <Nav ref={ref} aria-label={ariaLabel} {...rest}>
        <List $orientation={orientation}>
          {steps.map((step, index) => {
            const stage = stageForIndex(index, clampedActive);
            const interactive = Boolean(onStepClick) && stage !== 'current';
            const showDesc = showDescription && Boolean(step.description);

            const row = (
              <>
                <Marker stage={stage} />
                <TextCol>
                  <Title $stage={stage}>{step.title}</Title>
                  {showDesc ? <Description>{step.description}</Description> : null}
                </TextCol>
              </>
            );

            return (
              <React.Fragment key={`${step.title}-${index}`}>
                <Item
                  aria-current={stage === 'current' ? 'step' : undefined}
                >
                  {interactive ? (
                    <StepRow
                      as="button"
                      type="button"
                      $interactive
                      onClick={() => onStepClick?.(index)}
                    >
                      {row}
                    </StepRow>
                  ) : (
                    <StepRow $interactive={false}>{row}</StepRow>
                  )}
                </Item>
                {index < steps.length - 1 ? (
                  <Connector
                    aria-hidden
                    $orientation={orientation}
                    $complete={lineComplete(index, clampedActive)}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </List>
      </Nav>
    );
  },
);

Stepper.displayName = 'Stepper';

export default Stepper;
