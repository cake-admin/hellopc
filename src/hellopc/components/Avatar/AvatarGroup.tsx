import React from 'react';
import styled from 'styled-components';

import { Avatar, type AvatarColor, type AvatarSize } from './Avatar';
import { SimpleTooltip } from '../Tooltip';

export interface AvatarGroupPerson {
  /** Full name — used for the accessible name and the tooltip. */
  name: string;
  /** Photo URL. */
  src?: string;
  /** Initials when there's no photo (1–2 characters). */
  initials?: string;
  /** Overrides the automatic color cycle for this person. */
  color?: AvatarColor;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Everyone in the group, in display order (the first sits on top). */
  people: AvatarGroupPerson[];
  /**
   * How many avatars to show before the rest collapse into a "+N" chip
   * (Figma `visible`).
   * @default 3
   */
  max?: 2 | 3 | 4;
  /** Diameter: `sm` 32px, `md` 40px, `lg` 48px. @default 'md' */
  size?: AvatarSize;
  /** Accessible name for the group, e.g. "Project members". */
  label: string;
  /**
   * Hover/focus tooltips with each full name (the "+N" chip lists the hidden
   * names). Makes each avatar a tab stop.
   * @default true
   */
  showTooltips?: boolean;
  /** Builds the overflow chip's name. @default "N more: name, name" */
  overflowLabel?: (count: number, names: string[]) => string;
}

/** Colors cycle so neighbours differ (Figma items 1–4). */
const CYCLE: AvatarColor[] = ['primary', 'teal', 'amber', 'violet'];

/** Overlap per size — Figma -6 / -8 / -10. */
const OVERLAP: Record<AvatarSize, string> = {
  sm: 'calc(-1 * var(--space-075))',
  md: 'calc(-1 * var(--space-100))',
  lg: 'calc(-1 * var(--space-150))',
};

/** Overflow chip diameter matches Avatar (Figma 32/40/48, geometry). */
const DIAMETER: Record<AvatarSize, string> = { sm: '32px', md: '40px', lg: '48px' };
const COUNT_SIZE: Record<AvatarSize, string> = {
  sm: 'var(--type-size-caption)',
  md: 'var(--type-size-body)',
  lg: 'var(--type-size-subject)',
};

const Root = styled.div`
  display: inline-flex;
  align-items: center;
`;

/** Each item carries a 2px cut-out ring in the surface color, and items stack
 *  left-on-top (z-index descends left to right). */
const Item = styled.span<{ $size: AvatarSize; $z: number }>`
  position: relative;
  z-index: ${(p) => p.$z};
  display: inline-flex;
  border-radius: var(--radius-1000);
  box-shadow: 0 0 0 var(--stroke-200) var(--color-surfaces-container);

  /* Not "& + &": items differ in z-index, so each gets its own class and a
     sibling selector would apply one size's overlap to all of them. */
  &:not(:first-child) {
    margin-left: ${(p) => OVERLAP[p.$size]};
  }

  /* SimpleTooltip's trigger: keep it round so its focus ring hugs the avatar. */
  & > button {
    border-radius: var(--radius-1000);
  }
`;

const Overflow = styled.span<{ $size: AvatarSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => DIAMETER[p.$size]};
  height: ${(p) => DIAMETER[p.$size]};
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-on-container-low);
  color: var(--color-text-icon-secondary);
  font-family: var(--font-family);
  font-size: ${(p) => COUNT_SIZE[p.$size]};
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

/**
 * hello pc Avatar Group — overlapping avatars with a "+N" overflow chip (Figma
 * `hellopc.avatar.group`, node 18089:1040). The first person sits on top;
 * colors cycle primary → teal → amber → violet when there's no photo.
 */
export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      people,
      max = 3,
      size = 'md',
      label,
      showTooltips = true,
      overflowLabel = (n, names) => `${n} more: ${names.join(', ')}`,
      ...props
    },
    ref,
  ) => {
    const shown = people.slice(0, max);
    const hidden = people.slice(max);
    const total = shown.length + (hidden.length ? 1 : 0);

    const wrap = (content: React.ReactNode, name: string, key: string, z: number) => (
      <Item key={key} $size={size} $z={z}>
        {showTooltips ? (
          <SimpleTooltip trigger={content} triggerAriaLabel={name}>
            {name}
          </SimpleTooltip>
        ) : (
          <span role="img" aria-label={name} style={{ display: 'inline-flex' }}>
            {content}
          </span>
        )}
      </Item>
    );

    return (
      <Root ref={ref} role="group" aria-label={label} {...props}>
        {shown.map((p, i) =>
          wrap(
            <Avatar
              size={size}
              src={p.src}
              alt=""
              initials={p.initials}
              color={p.color ?? CYCLE[i % CYCLE.length]}
              aria-hidden
            />,
            p.name,
            `p-${i}`,
            total - i,
          ),
        )}
        {hidden.length
          ? wrap(
              <Overflow $size={size} aria-hidden>
                +{hidden.length}
              </Overflow>,
              overflowLabel(
                hidden.length,
                hidden.map((p) => p.name),
              ),
              'overflow',
              1,
            )
          : null}
      </Root>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;
