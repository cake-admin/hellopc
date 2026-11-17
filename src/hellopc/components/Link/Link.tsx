import React from 'react';
import { VisuallyHidden } from 'radix-ui';
import styled, { css } from 'styled-components';
import { ExternalLink } from 'lucide-react';

export type LinkSize = 'sm' | 'md' | 'lg';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Type size, always Rookery New Medium: `sm` 12px (Figma `link.12`), `md`
   * 14px (`link.14.body`), `lg` 16px (`link.16`). The icon matches the text size.
   * @default 'md'
   */
  size?: LinkSize;
  /**
   * For links on a colored fill (banners, promos): text, icon and focus ring
   * all use `--color-text-icon-on-primary` (Figma `hellopc.link.inverse`).
   * Never place the standard link on a colored surface.
   * @default false
   */
  inverse?: boolean;
  /**
   * The link leaves the app — a browser, a new window, another app. Shows the
   * trailing open-in-new icon, opens in a new tab (`target="_blank"`,
   * `rel="noopener noreferrer"`) unless you pass your own `target` / `rel`, and
   * announces "(opens in a new window)" to screen readers.
   * @default false
   */
  external?: boolean;
  /**
   * Replaces the trailing icon (Figma `icon` swap). Inherits the link color
   * and size — don't size or color it yourself. Shown whenever it is set.
   */
  icon?: React.ReactNode;
  /**
   * Renders the link inert: no `href`, `aria-disabled="true"`, removed from the
   * tab order, clicks ignored. Use sparingly — prefer hiding a destination
   * that doesn't exist.
   * @default false
   */
  disabled?: boolean;
}

/** Font size + Figma letter-spacing per size. The tracking values have no
 *  token; they're the `link type/*` text styles (0.2px / 0.1px / 0). */
const sizeStyles = {
  sm: css`
    font-size: var(--type-size-caption);
    letter-spacing: 0.2px;
  `,
  md: css`
    font-size: var(--type-size-body);
    letter-spacing: 0.1px;
  `,
  lg: css`
    font-size: var(--type-size-subject);
    letter-spacing: 0;
  `,
} as const;

const colorStyles = (inverse: boolean) =>
  inverse
    ? css`
        --link-color: var(--color-text-icon-on-primary);
        color: var(--link-color);
        /* Figma: inverse disabled = onPrimary at 50%. The on-primary-disabled
           token doesn't hold that value in dark.a, so opacity carries it. */
        &[aria-disabled='true'] {
          opacity: 0.5;
        }
      `
    : css`
        --link-color: var(--color-text-icon-link);
        color: var(--link-color);
        &:hover:not([aria-disabled='true']) {
          color: var(--color-text-icon-link-hover);
        }
        &:active:not([aria-disabled='true']) {
          color: var(--color-text-icon-link-press);
        }
        &[aria-disabled='true'] {
          color: var(--color-text-icon-disabled);
        }
      `;

const StyledLink = styled.a<{ $size: LinkSize; $inverse: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
  /* 24px minimum target (WCAG 2.5.8) — Figma hellopc.link frame height. */
  min-height: 24px;
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  text-decoration: none;
  cursor: pointer;
  outline: none;

  ${(p) => sizeStyles[p.$size]}
  ${(p) => colorStyles(p.$inverse)}

  &[aria-disabled='true'] {
    cursor: not-allowed;
  }

  /* Figma focus: 3px ring in the link color, hugging the text vertically and
     4px out at the sides, 4px radius. The text color stays at rest. */
  &:focus-visible {
    color: var(--link-color);
  }
  &:focus-visible::after {
    content: '';
    position: absolute;
    inset: 0 calc(-1 * var(--space-050));
    border: var(--stroke-300) solid var(--link-color);
    border-radius: var(--radius-50);
    pointer-events: none;
  }
`;

/** The underline lives on the text, not the flex container (decorations don't
 *  propagate into flex items). Always on — never removed (WCAG 1.4.1). */
const Text = styled.span`
  text-decoration: underline;
  text-decoration-thickness: from-font;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
`;

/** Icon slot sized by the font size (12/14/16px), colored by currentColor. */
const IconSlot = styled.span`
  display: inline-flex;
  flex: none;

  svg {
    width: 1em;
    height: 1em;
  }
`;

/**
 * hello pc Link — navigation to a page, section, or external resource
 * (Figma `hellopc.link` / `hellopc.link.inverse`, node 17585:4304). Always a
 * real `<a>`, always underlined. Links navigate; buttons perform actions.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      size = 'md',
      inverse = false,
      external = false,
      icon,
      disabled = false,
      href,
      target,
      rel,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const trailing = icon ?? (external ? <ExternalLink aria-hidden /> : null);

    return (
      <StyledLink
        {...props}
        ref={ref}
        $size={size}
        $inverse={inverse}
        href={disabled ? undefined : href}
        target={target ?? (external ? '_blank' : undefined)}
        rel={rel ?? (external ? 'noopener noreferrer' : undefined)}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : props.tabIndex}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
      >
        <Text>{children}</Text>
        {external ? <VisuallyHidden.Root> (opens in a new window)</VisuallyHidden.Root> : null}
        {trailing ? <IconSlot aria-hidden>{trailing}</IconSlot> : null}
      </StyledLink>
    );
  },
);

Link.displayName = 'Link';

export default Link;
