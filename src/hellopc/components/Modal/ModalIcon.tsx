import React from 'react';
import { AccessibleIcon } from 'radix-ui';
import styled from 'styled-components';

export type ModalIconType = 'icon' | 'info' | 'success' | 'warning' | 'error' | 'neutral';

/** Figma 97:5706 intrinsic icon geometry: 24px glyph inside 4px state padding. */
const GLYPH_SIZE = 24;

/**
 * Exact Figma-exported glyph geometry (node 97:5706). Rendered inline so the
 * shapes stay faithful while `currentColor` lets the active hello pc theme drive
 * their color. `icon` is the generic fallback glyph.
 */
/** Circle-i glyph shared by `info` (blue) and `neutral` (ink) — same Figma
 *  shape, recolored per status via `COLOR`. */
const INFO_CIRCLE_PATH =
  'M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM13 7V9H11V7H13ZM13 17V10H11V17H13Z';

const GLYPH: Record<ModalIconType, React.ReactNode> = {
  info: <path fillRule="evenodd" clipRule="evenodd" d={INFO_CIRCLE_PATH} fill="currentColor" />,
  neutral: <path fillRule="evenodd" clipRule="evenodd" d={INFO_CIRCLE_PATH} fill="currentColor" />,
  success: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM16.2459 7.91486L10.8425 13.3183L8.02138 10.4972L6.60716 11.9114L10.1354 15.4396C10.5259 15.8301 11.1591 15.8301 11.5496 15.4396L17.6601 9.32907L16.2459 7.91486Z"
      fill="currentColor"
    />
  ),
  warning: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.9577 1.42086C13.2948 1.60476 13.5719 1.88182 13.7558 2.21895L22.3867 18.0423C22.9156 19.012 22.5583 20.2269 21.5886 20.7558C21.2948 20.916 20.9656 21 20.6309 21H3.36908C2.26451 21 1.36908 20.1046 1.36908 19C1.36908 18.6654 1.45305 18.3361 1.61329 18.0423L10.2442 2.21895C10.7731 1.24925 11.988 0.891939 12.9577 1.42086ZM11 14V8H13V14H11ZM11 17V15H13V17H11Z"
      fill="currentColor"
    />
  ),
  error: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM11 17V15H13V17H11ZM11 7L11 14H13L13 7H11Z"
      fill="currentColor"
    />
  ),
  icon: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.8 11.0221L7.0188 2.52209L2.23755 11.0221H11.8ZM5.65655 9.02209L7.01855 6.60109L8.38055 9.02209H5.65655ZM6.99411 12.75C9.34132 12.75 11.2441 14.6528 11.2441 17C11.2441 19.3472 9.34132 21.25 6.99411 21.25C4.6469 21.25 2.74412 19.3472 2.74412 17C2.74412 14.6528 4.6469 12.75 6.99411 12.75ZM6.99411 14.75C5.75147 14.75 4.74412 15.7574 4.74412 17C4.74412 18.2427 5.75147 19.25 6.99411 19.25C8.23676 19.25 9.24411 18.2427 9.24411 17C9.24411 15.7574 8.23676 14.75 6.99411 14.75ZM20.7423 13.2527V20.7527H13.2423V13.2527H20.7423ZM18.7423 15.2527H15.2423V18.7527H18.7423V15.2527ZM18.9392 3.56384C20.3264 3.56384 21.4611 4.61841 21.5463 5.95038L21.5514 6.1115C21.5514 6.1538 21.5504 6.19586 21.5483 6.23766L21.5506 6.27997L21.5514 6.3238C21.5514 8.01045 20.1544 9.68353 17.3603 11.343C17.13 11.4836 16.8416 11.4842 16.6088 11.3478C13.9086 9.74635 12.5104 8.13187 12.4139 6.50466L12.4086 6.3238C12.4086 6.29436 12.4097 6.26566 12.412 6.2377C12.4096 6.19615 12.4086 6.15394 12.4086 6.1115C12.4086 4.70446 13.5781 3.56384 15.0208 3.56384C15.5435 3.56384 16.0303 3.71355 16.4387 3.97142L16.6219 4.09298L16.8495 4.25441C16.8911 4.28464 16.9346 4.31652 16.98 4.35007L17.3292 4.09946L17.5076 3.98011C17.9188 3.71692 18.4106 3.56384 18.9392 3.56384ZM18.9392 5.56384C18.8077 5.56384 18.6878 5.59931 18.5859 5.66454L18.4953 5.72438L16.9621 6.82459L15.6288 5.8397C15.5818 5.80577 15.5429 5.77817 15.516 5.7594L15.3708 5.66248C15.2696 5.59855 15.151 5.56384 15.0208 5.56384C14.7065 5.56384 14.462 5.77165 14.4163 6.02543L14.4087 6.12354L14.4167 6.26215L14.4086 6.34884L14.4104 6.38635C14.4526 7.09779 15.2194 8.06265 16.8867 9.16408L16.9796 9.22384L17.067 9.16847C18.7233 8.07572 19.4841 7.13108 19.5475 6.45226L19.5518 6.36136L19.5504 6.07809C19.5327 5.8018 19.2739 5.56384 18.9392 5.56384Z"
      fill="currentColor"
    />
  ),
};

const COLOR: Record<ModalIconType, string> = {
  icon: 'var(--color-text-icon-primary)',
  info: 'var(--color-info-info)',
  success: 'var(--color-success-success)',
  warning: 'var(--color-warning-warn)',
  error: 'var(--color-error-error)',
  neutral: 'var(--color-text-icon-primary)',
};

const DEFAULT_LABEL: Record<ModalIconType, string> = {
  icon: 'Dialog icon',
  info: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  neutral: 'Notice',
};

const Root = styled.span<{ $type: ModalIconType }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: calc(${GLYPH_SIZE}px + var(--space-100));
  height: calc(${GLYPH_SIZE}px + var(--space-100));
  padding: var(--space-050);
  color: ${(p) => COLOR[p.$type]};

  & > svg {
    width: ${GLYPH_SIZE}px;
    height: ${GLYPH_SIZE}px;
    display: block;
  }
`;

export interface ModalIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Semantic icon treatment from the Figma `type` variant.
   * @default 'icon'
   */
  type?: ModalIconType;
  /**
   * Custom 24px glyph for the generic `icon` treatment. Semantic treatments
   * supply their corresponding default glyph.
   */
  icon?: React.ReactNode;
  /**
   * Accessible name for non-decorative usage. When this icon accompanies a
   * dialog title, set `decorative` because the title supplies the meaning.
   */
  label?: string;
  /**
   * Hides the glyph from assistive technology. Use when it only reinforces
   * adjacent text, such as a ModalTitle heading.
   * @default false
   */
  decorative?: boolean;
}

/**
 * hello pc ModalIcon — the modal leading item (Figma `_elements / modal leading
 * item`, node 97:5706). It supplies the semantic 24px glyph and its 4px
 * tokenized state padding; ModalTitle exclusively composes this component for
 * leading icon treatments. The same semantic glyph set (`info`/`success`/
 * `warning`/`error`) is the exact shape used by Toast's status icon — Toast
 * reuses this component rather than forking its own copy. `neutral` extends
 * the set for Toast's colorless "greyscale" status (Figma node 108:5974),
 * reusing the `info` circle-i shape recolored to the neutral ink token.
 */
export const ModalIcon = React.forwardRef<HTMLSpanElement, ModalIconProps>(
  (
    {
      type = 'icon',
      icon,
      label = DEFAULT_LABEL[type],
      decorative = false,
      ...props
    },
    ref,
  ) => {
    const glyph =
      type === 'icon' && icon ? (
        icon
      ) : (
        <svg viewBox={`0 0 ${GLYPH_SIZE} ${GLYPH_SIZE}`} fill="none" aria-hidden focusable="false">
          {GLYPH[type]}
        </svg>
      );

    const content = (
      <Root ref={ref} $type={type} aria-hidden={decorative || undefined} {...props}>
        {glyph}
      </Root>
    );

    return decorative ? content : <AccessibleIcon.Root label={label}>{content}</AccessibleIcon.Root>;
  },
);

ModalIcon.displayName = 'ModalIcon';

export default ModalIcon;
