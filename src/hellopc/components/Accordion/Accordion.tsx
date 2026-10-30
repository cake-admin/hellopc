import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ChevronDown } from 'lucide-react';
import { Accordion as RadixAccordion } from 'radix-ui';

/**
 * hello pc Accordion — a stack of collapsible sections (Figma "Accordion", node
 * 117:6508). Each item is a header row (title + optional leading icon + a
 * chevron) that expands to reveal a content region. Use it to progressively
 * disclose long or optional content: FAQs, settings groups, detail panels.
 *
 * Wraps Radix `Accordion` (Root / Item / Header / Trigger / Content), so the
 * keyboard interaction, `aria-expanded`/`region` wiring, single-vs-multiple
 * open behaviour, and open/close animation come from the primitive. Styled
 * entirely from the hello pc token custom properties, which mirror the Figma
 * variables 1:1 and re-theme via `[data-theme]`.
 */

/* Radix exposes the open content height as a CSS var so we can animate a
   grow/shrink from/to zero without measuring in JS. */
const slideDown = keyframes`
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
`;
const slideUp = keyframes`
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
`;

/** The outer container — white surface, hairline border, 24px radius, clipped
 *  so the item dividers meet the rounded corners cleanly. */
const Root = styled(RadixAccordion.Root)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 640px;
  border-radius: var(--radius-400);
  border: var(--stroke-100) solid var(--color-stroke-border);
  overflow: hidden;
  background: var(--color-surfaces-container);
`;

const Header = styled(RadixAccordion.Header)`
  margin: 0;
  display: flex;
`;

/** The clickable header row: white surface, bottom divider, 32px/16px inset. */
const Trigger = styled(RadixAccordion.Trigger)`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-300);
  width: 100%;
  padding: var(--space-300) var(--space-600);
  border: none;
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);
  appearance: none;
  background: var(--color-surfaces-container);
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Radix drives focus with :focus-visible on the trigger button. */
  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: calc(-1 * var(--stroke-200));
  }
`;

/** Optional leading icon slot (24×24). Defaults to the primary accent so a
 *  currentColor glyph matches the Figma tag icon. */
const IconSlot = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-primary);

  svg {
    width: 24px;
    height: 24px;
  }
`;

const TitleText = styled.span`
  flex: 1 1 0%;
  min-width: 0;
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

/** The chevron indicator — rotates 180° when its item opens. */
const Chevron = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--color-text-icon-primary);
  transition: transform 200ms ease;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Content = styled(RadixAccordion.Content)`
  overflow: hidden;
  background: var(--color-surfaces-on-container-high);
  border-bottom: var(--stroke-100) solid var(--color-stroke-border);
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.5;
  letter-spacing: 0.2px;

  @media (prefers-reduced-motion: no-preference) {
    &[data-state='open'] {
      animation: ${slideDown} 200ms ease;
    }
    &[data-state='closed'] {
      animation: ${slideUp} 200ms ease;
    }
  }
`;

/** Inner padding wrapper (24px top / 32px bottom / 32px sides) so the height
 *  animation includes the padding. */
const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding: var(--space-500) var(--space-600) var(--space-600);
`;

/** An accordion section. `value` is required by Radix to track open state.
 *  Rotates the chevron and removes the trailing divider on the last item so it
 *  meets the container's bottom border without doubling up. */
const Item = styled(RadixAccordion.Item)`
  &[data-state='open'] ${Chevron} {
    transform: rotate(180deg);
  }

  /* Last item: the container's border closes the bottom edge, so drop the
     item's own trailing hairline (the open content, and the closed header). */
  &:last-child ${Content} {
    border-bottom: none;
  }
  &:last-child[data-state='closed'] ${Trigger} {
    border-bottom: none;
  }
`;

export type AccordionProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Root>;

/**
 * The accordion container. Forwards every Radix `Accordion.Root` prop — set
 * `type="single"` (with `collapsible`) for one-open-at-a-time, or
 * `type="multiple"` to let several sections open at once; drive open state with
 * `value`/`defaultValue`/`onValueChange`.
 */
export const Accordion = Root as typeof Root & { displayName?: string };
Accordion.displayName = 'Accordion';

export interface AccordionItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixAccordion.Item>, 'title'> {
  /** Header label shown in the trigger row. */
  title: React.ReactNode;
  /** Optional leading icon (24×24), rendered before the title. */
  icon?: React.ReactNode;
  /** The revealed content. */
  children: React.ReactNode;
}

/**
 * A single collapsible section. Composes Radix `Item` / `Header` / `Trigger` /
 * `Content`: the `title` (and optional `icon`) render in the always-visible
 * header row alongside the rotating chevron, and `children` render in the
 * region revealed when the item opens.
 */
export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ title, icon, children, ...props }, ref) => (
    <Item ref={ref} {...props}>
      <Header>
        <Trigger>
          {icon ? <IconSlot aria-hidden>{icon}</IconSlot> : null}
          <TitleText>{title}</TitleText>
          <Chevron aria-hidden>
            <ChevronDown />
          </Chevron>
        </Trigger>
      </Header>
      <Content>
        <ContentInner>{children}</ContentInner>
      </Content>
    </Item>
  ),
);

AccordionItem.displayName = 'AccordionItem';

export default Accordion;
