import React from 'react';
import styled, { css } from 'styled-components';

import { Badge, type BadgeTone } from '../Badge/Badge';

/** Figma `status` axis — the four semantic families Counter supports. */
export type CounterStatus = 'primary' | 'secondary' | 'destructive' | 'disabled';
/** Figma `style` axis: `solid` == heavy, `subtle` == light. Mirrors Badge's tone. */
export type CounterTone = BadgeTone;

const Root = styled(Badge)<{ $popout: boolean }>`
  ${(p) =>
    p.$popout
      ? css`
          /* Figma popout: a 2px ring that separates the counter from busy
             content it overlays (an icon, avatar, or tab). The token is white
             in light/HCT and grey in dark, so it always contrasts the host. */
          border: var(--stroke-200) solid var(--color-stroke-border-pop);
        `
      : ''}
`;

/* `color` is omitted alongside `children`: Counter drives the pill's color from
   `status` and forwards it to Badge's `color` prop, so inheriting the DOM's
   legacy `color?: string` attribute would clash with Badge's `BadgeColor`. */
export interface CounterProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'color'> {
  /** The count to display (Figma `counter`), e.g. `3` or `"9+"`. */
  count: string | number;
  /**
   * Semantic color family (Figma `status`). `disabled` is a muted/inactive
   * treatment, not an interactive state.
   * @default 'primary'
   */
  status?: CounterStatus;
  /**
   * Emphasis (Figma `style`). `solid` is a saturated fill with inverse text
   * (Figma `heavy`); `subtle` is a light tinted wash with colored text (Figma
   * `light`). Ignored when `status="disabled"`, which always renders the muted
   * solid treatment.
   * @default 'solid'
   */
  tone?: CounterTone;
  /**
   * Adds a 2px separator ring (Figma `popout`) for placing the counter on top
   * of busy content — an icon, avatar, or tab. Defaults to `false` for a
   * standalone counter; the ring color is invisible on a matching background,
   * so only enable it when the counter overlaps other content. (Figma's own
   * default is `true`.)
   * @default false
   */
  popout?: boolean;
}

/**
 * hello pc Counter — a compact numeric badge for notification counts (Figma
 * `Counter`, node 123:6211). It composes `Badge` (same token-styled pill and
 * semantic colors, no status dot) and adds the `popout` separator ring, so
 * fixes to the shared pill live in one place.
 *
 * Being static, Counter wraps no Radix primitive — it renders `Badge`'s
 * semantic `<span>`. Every color resolves from hello pc CSS custom properties, so
 * the **Theme** toolbar re-themes it live. Use it for unread/pending counts;
 * for a labeled status tag use `Badge`, and for actions use `Button`.
 */
export const Counter = React.forwardRef<HTMLSpanElement, CounterProps>(
  ({ count, status = 'primary', tone = 'solid', popout = false, ...props }, ref) => {
    // Figma's disabled counter ignores the style axis — always the muted solid.
    const badgeTone: BadgeTone = status === 'disabled' ? 'solid' : tone;

    return (
      <Root ref={ref} $popout={popout} color={status} tone={badgeTone} dot={false} {...props}>
        {count}
      </Root>
    );
  },
);

Counter.displayName = 'Counter';

export default Counter;
