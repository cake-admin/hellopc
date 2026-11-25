import React from 'react';
import styled, { css } from 'styled-components';

import { Counter } from '../Counter';

export type SectionHeaderSize = 'sm' | 'md' | 'lg';

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The section title. Rendered as a real heading (see `headingLevel`). */
  title: React.ReactNode;
  /** Optional supporting line under the title. */
  description?: React.ReactNode;
  /**
   * Optional item count shown beside the title in a neutral counter pill
   * (Figma `showCount`). Omit to hide it.
   */
  count?: number | string;
  /**
   * `sm` for cards (16px medium title), `md` for page sections (20px bold),
   * `lg` for page titles inside content (28px bold). Pick button sizes to match:
   * `sm` buttons with `sm`/`md`, `md` buttons with `lg`.
   * @default 'md'
   */
  size?: SectionHeaderSize;
  /**
   * Heading element for the title. Choose the level that fits the page outline;
   * the visual size is set by `size`, not by the level.
   * @default 2
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /**
   * Actions on the right — usually up to two Buttons (secondary outline, then
   * primary fill, primary rightmost) and an optional overflow IconButton.
   */
  actions?: React.ReactNode;
}

/** Title type per size (Figma medium.16 / bold.20.title / bold.28.page). The
 *  lg -0.4px tracking is the bold.28.page text style (no tracking token). */
const titleStyles: Record<SectionHeaderSize, ReturnType<typeof css>> = {
  sm: css`
    font-size: var(--type-size-subject);
    font-weight: var(--font-weight-medium);
  `,
  md: css`
    font-size: var(--type-size-title);
    font-weight: var(--font-weight-bold);
  `,
  lg: css`
    font-size: var(--type-size-page);
    font-weight: var(--font-weight-bold);
    letter-spacing: -0.4px;
  `,
};

/** Description type per size: regular 12 / 14 / 16, 0.2px tracking. */
const DESCRIPTION_SIZE: Record<SectionHeaderSize, string> = {
  sm: 'var(--type-size-caption)',
  md: 'var(--type-size-body)',
  lg: 'var(--type-size-subject)',
};

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-300);
  width: 100%;
  font-family: var(--font-family);
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-025);
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const Title = styled.h2<{ $size: SectionHeaderSize }>`
  margin: 0;
  color: var(--color-text-icon-primary);
  line-height: 1.35;
  overflow-wrap: anywhere;
  ${(p) => titleStyles[p.$size]}
`;

const Description = styled.p<{ $size: SectionHeaderSize }>`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: ${(p) => DESCRIPTION_SIZE[p.$size]};
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
`;

const Actions = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-100);
`;

/**
 * hello pc Section Header — the header for a page section or card (Figma
 * `hellopc.section.header`, component set 17305:192): a heading, an optional
 * count and description, and an actions slot. Stretches to the section width.
 */
export const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, description, count, size = 'md', headingLevel = 2, actions, ...props }, ref) => (
    <Root ref={ref} {...props}>
      <TitleGroup>
        <TitleRow>
          <Title as={`h${headingLevel}` as 'h2'} $size={size}>
            {title}
          </Title>
          {count !== undefined && count !== null ? (
            <Counter count={count} status="secondary" tone="subtle" />
          ) : null}
        </TitleRow>
        {description ? <Description $size={size}>{description}</Description> : null}
      </TitleGroup>
      {actions ? <Actions>{actions}</Actions> : null}
    </Root>
  ),
);

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
