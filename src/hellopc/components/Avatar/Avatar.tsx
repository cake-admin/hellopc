import React from 'react';
import styled, { css } from 'styled-components';
import { Check, User } from 'lucide-react';
import { Avatar as RadixAvatar } from 'radix-ui';

/**
 * hello pc Avatar — the circular representation of a person (Figma "&avatar", node
 * 142:8305). Shows a photo when one is available and degrades gracefully to
 * initials, then to a person glyph.
 *
 * Wraps the Radix `Avatar` primitive, which owns the part that's genuinely
 * fiddly: the image loading lifecycle. The fallback renders until the image has
 * actually loaded and comes back if it errors, so a broken URL never leaves a
 * blank circle.
 *
 * Figma's `size=focus` isn't a size — it's the focus state, so it's a real
 * `:focus-visible` ring here, and only when the avatar is interactive
 * (`onClick`), where it renders as a proper `<button>`. Likewise Figma's
 * `content=check` is a selected state, exposed as `selected`.
 */

/* Figma 142:8305 intrinsic geometry: the avatar diameters (small/medium/large)
   and the glyph sizes that sit inside them. */
const DIAMETER = { sm: 32, md: 40, lg: 48 } as const;
const CHECK_SIZE = { sm: 18, md: 24, lg: 28 } as const;
const ICON_SIZE = { sm: 20, md: 24, lg: 28 } as const;
/** Figma draws the presence dot at 8px on every size. */
const BADGE_SIZE = 8;

export type AvatarSize = keyof typeof DIAMETER;

const frameCss = css<{ $size: AvatarSize }>`
  position: relative;
  display: inline-flex;
  flex: none;
  width: ${(p) => DIAMETER[p.$size]}px;
  height: ${(p) => DIAMETER[p.$size]}px;
`;

const Frame = styled.span<{ $size: AvatarSize }>`
  ${frameCss}
`;

/** Interactive avatars are real buttons, so they're focusable and activatable
 *  by keyboard; the ring is Figma's `size=focus` treatment. */
const TriggerFrame = styled.button<{ $size: AvatarSize }>`
  ${frameCss}
  padding: 0;
  border: none;
  appearance: none;
  background: none;
  cursor: pointer;
  border-radius: var(--radius-1000);

  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: var(--stroke-300) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

const Root = styled(RadixAvatar.Root)<{ $size: AvatarSize; $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-1000);
  background: ${(p) =>
    p.$selected ? 'var(--color-primary-primary)' : 'var(--color-primary-primary-overlay)'};
  user-select: none;
`;

const Image = styled(RadixAvatar.Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Fallback = styled(RadixAvatar.Fallback)<{ $size: AvatarSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-primary-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  letter-spacing: 0.1px;

  svg {
    width: ${(p) => ICON_SIZE[p.$size]}px;
    height: ${(p) => ICON_SIZE[p.$size]}px;
  }
`;

/** Figma `content=check`: a filled primary circle with an inverse check. */
const SelectedMark = styled.span<{ $size: AvatarSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-icon-on-primary);

  svg {
    width: ${(p) => CHECK_SIZE[p.$size]}px;
    height: ${(p) => CHECK_SIZE[p.$size]}px;
  }
`;

/**
 * The presence dot. Sits outside the clipped circle so it isn't cut off, and
 * carries a ring in the container color so it stays legible against a photo.
 * Positioned on the circle's lower-right diagonal, which scales across sizes.
 */
const Badge = styled.span`
  position: absolute;
  right: 5%;
  bottom: 5%;
  width: ${BADGE_SIZE}px;
  height: ${BADGE_SIZE}px;
  border-radius: var(--radius-1000);
  background: var(--color-success-success);
  box-shadow: 0 0 0 var(--stroke-100) var(--color-surfaces-container);
`;

/** Visually hidden but announced — the presence dot must not be color-only. */
const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Photo URL. Until it loads (or if it fails) the fallback shows instead. */
  src?: string;
  /** Describes the person in the photo — not the word "avatar". */
  alt?: string;
  /** Initials shown when there's no photo (Figma `content=initials`). 1–2 characters. */
  initials?: string;
  /** Diameter: `sm` 32px, `md` 40px, `lg` 48px. @default 'md' */
  size?: AvatarSize;
  /**
   * Selected treatment — a filled primary circle with a check, for avatars used
   * as pickable options (Figma `content=check`).
   * @default false
   */
  selected?: boolean;
  /** Shows the presence dot (Figma `showBadge`). @default false */
  badge?: boolean;
  /** Accessible name for the presence dot. @default 'Online' */
  badgeLabel?: string;
  /** Makes the avatar activatable — it renders as a `<button>` and gains the focus ring. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Milliseconds to wait before showing the fallback. A small delay avoids a
   * flash of initials when the image loads fast.
   * @default 0
   */
  delayMs?: number;
}

export const Avatar = React.forwardRef<HTMLElement, AvatarProps>(
  (
    {
      src,
      alt,
      initials,
      size = 'md',
      selected = false,
      badge = false,
      badgeLabel = 'Online',
      onClick,
      delayMs = 0,
      ...props
    },
    ref,
  ) => {
    const inner = (
      <>
        <Root $size={size} $selected={selected}>
          {selected ? (
            <SelectedMark $size={size} aria-hidden>
              <Check strokeWidth={3} />
            </SelectedMark>
          ) : (
            <>
              {src ? <Image src={src} alt={alt} /> : null}
              <Fallback $size={size} delayMs={delayMs}>
                {initials ? initials : <User aria-hidden />}
              </Fallback>
            </>
          )}
        </Root>
        {badge ? (
          <Badge>
            <SrOnly>{badgeLabel}</SrOnly>
          </Badge>
        ) : null}
      </>
    );

    if (onClick) {
      return (
        <TriggerFrame
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          $size={size}
          onClick={onClick}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {inner}
        </TriggerFrame>
      );
    }

    return (
      <Frame ref={ref as React.Ref<HTMLSpanElement>} $size={size} {...props}>
        {inner}
      </Frame>
    );
  },
);

Avatar.displayName = 'Avatar';

export default Avatar;
