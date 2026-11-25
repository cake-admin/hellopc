import React from 'react';
import styled, { css } from 'styled-components';
import { Info } from 'lucide-react';

import { Link } from '../Link';
import { SimpleTooltip } from '../Tooltip';

export type FieldLayout = 'inline' | 'stacked';

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** The name of the value ("Functional area", "Serial number"). */
  label: React.ReactNode;
  /** The value. Plain text, or any node (a Badge, a Rating, an Avatar). */
  children: React.ReactNode;
  /**
   * `inline` puts the label in a 160px column beside the value (detail views,
   * drawers); `stacked` puts the label above the value (narrow cards).
   * @default 'inline'
   */
  layout?: FieldLayout;
  /**
   * Makes the value a link to this destination (Figma `type=link`), rendered
   * with the hello pc Link at body size.
   */
  href?: string;
  /** Optional provenance line under the value ("Updated Nov 3 · By Alex Kim"). */
  meta?: React.ReactNode;
  /**
   * Explains the label in a tooltip behind a 16px info icon (Figma `showInfo`).
   * The icon is focusable, so keyboard and screen-reader users get the text too.
   */
  info?: React.ReactNode;
}

export interface FieldGroupProps extends React.HTMLAttributes<HTMLDListElement> {
  /** A stack of `Field`s, rendered as one description list. */
  children: React.ReactNode;
}

/** Fields inside a FieldGroup share its <dl>; a lone Field renders its own. */
const InGroup = React.createContext(false);

/** Inline label column — Figma hellopc.field 17303:430 (160px, geometry). */
const LABEL_COLUMN = '160px';

const layoutStyles = {
  inline: css`
    display: grid;
    grid-template-columns: ${LABEL_COLUMN} minmax(0, 1fr);
    column-gap: var(--space-300);
    align-items: baseline;
  `,
  stacked: css`
    display: flex;
    flex-direction: column;
    gap: var(--space-050);
  `,
};

const Row = styled.div<{ $layout: FieldLayout }>`
  margin: 0;
  font-family: var(--font-family);
  ${(p) => layoutStyles[p.$layout]}
`;

const Label = styled.dt`
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
`;

const Value = styled.dd`
  display: flex;
  flex-direction: column;
  gap: var(--space-025);
  min-width: 0;
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
`;

/** Figma meta is regular 10px; there is no 10px type token, so it uses the
 *  caption size until one exists. */
const Meta = styled.span`
  color: var(--color-text-icon-placeholder);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
`;

/** 16px info glyph, label-colored; the tooltip trigger is the focus target. */
const InfoGlyph = styled.span`
  display: inline-flex;
  & > svg {
    width: var(--space-300);
    height: var(--space-300);
  }
`;

const Group = styled.dl`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  margin: 0;
`;

/**
 * hello pc Field — a read-only label/value pair for detail views, drawers and
 * cards (Figma `hellopc.field`, set 17303:470). Not a form control: it displays
 * data. Stack several in a `FieldGroup`.
 */
export const Field = React.forwardRef<HTMLElement, FieldProps>(
  ({ label, children, layout = 'inline', href, meta, info, ...props }, ref) => {
    const inGroup = React.useContext(InGroup);
    const infoLabel = typeof label === 'string' ? `About ${label}` : 'More information';

    const row = (
      <Row
        ref={inGroup ? (ref as React.Ref<HTMLDivElement>) : undefined}
        $layout={layout}
        {...(inGroup ? props : {})}
      >
        <Label>
          {label}
          {info ? (
            <SimpleTooltip
              trigger={
                <InfoGlyph>
                  <Info aria-hidden />
                </InfoGlyph>
              }
              triggerAriaLabel={infoLabel}
            >
              {info}
            </SimpleTooltip>
          ) : null}
        </Label>
        <Value>
          {href ? (
            <span>
              <Link href={href} size="md">
                {children}
              </Link>
            </span>
          ) : (
            <span>{children}</span>
          )}
          {meta ? <Meta>{meta}</Meta> : null}
        </Value>
      </Row>
    );

    if (inGroup) return row;
    return (
      <Group ref={ref as React.Ref<HTMLDListElement>} {...props}>
        {row}
      </Group>
    );
  },
);

Field.displayName = 'Field';

/** A stack of Fields as one `<dl>`, 12px apart (Figma: space-200 between fields). */
export const FieldGroup = React.forwardRef<HTMLDListElement, FieldGroupProps>(({ children, ...props }, ref) => (
  <InGroup.Provider value>
    <Group ref={ref} {...props}>
      {children}
    </Group>
  </InGroup.Provider>
));

FieldGroup.displayName = 'FieldGroup';

export default Field;
