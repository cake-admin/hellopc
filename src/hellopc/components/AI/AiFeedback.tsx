import React from 'react';
import { ToggleGroup as RadixToggleGroup, VisuallyHidden } from 'radix-ui';
import styled from 'styled-components';
import { Copy, RotateCw, ThumbsDown, ThumbsUp } from 'lucide-react';

import { IconButton } from '../Button';

export type AiFeedbackValue = 'liked' | 'disliked' | null;

export interface AiFeedbackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  /** Controlled rating. Pair with `onValueChange`. */
  value?: AiFeedbackValue;
  /** Uncontrolled initial rating. @default null */
  defaultValue?: AiFeedbackValue;
  /** Called with `'liked'`, `'disliked'`, or `null` when the choice is cleared. */
  onValueChange?: (value: AiFeedbackValue) => void;
  /** Shows Copy and calls this when it's pressed; announces "Copied". */
  onCopy?: () => void;
  /** Called on Regenerate. */
  onRegenerate?: () => void;
  /** Shows the Regenerate button (Figma `showRegenerate`) — only rendered when `onRegenerate` is set. @default true */
  showRegenerate?: boolean;
  /** Accessible name for the group. @default 'Response feedback' */
  label?: string;
}

const Root = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-025);
`;

const Group = styled(RadixToggleGroup.Root)`
  display: inline-flex;
  gap: var(--space-025);
`;

/** 24px round toggle (Figma hellopc.ai.feedback 17312:418). Default matches
 *  IconButton xs secondary ghost; pressed takes the tonal secondary overlay and
 *  a filled glyph. */
const Thumb = styled(RadixToggleGroup.Item)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: var(--radius-1000);
  background: transparent;
  color: var(--color-secondary-secondary);
  cursor: pointer;
  transition: background-color 120ms ease;

  &:hover {
    background: var(--color-secondary-secondary-overlay);
  }
  &:active {
    background: var(--color-secondary-secondary-overlay-hover);
  }
  &[data-state='on'] {
    background: var(--color-tonal-tonal-secondary-overlay);
    color: var(--color-text-icon-on-tonal-secondary);
  }
  &[data-state='on'] svg {
    fill: currentColor;
  }
  &:focus {
    outline: none;
  }
  &:focus-visible::after {
    content: '';
    position: absolute;
    inset: -2px;
    border: var(--stroke-300) solid var(--color-primary-primary);
    border-radius: var(--radius-1000);
    pointer-events: none;
  }

  & > svg {
    width: var(--space-300);
    height: var(--space-300);
  }
`;

/**
 * hello pc AI Feedback — like / dislike / copy / regenerate under an AI response
 * (Figma `hellopc.ai.feedback`, node 17312:418). Like and dislike are a Radix
 * single ToggleGroup (mutually exclusive, deselectable, `aria-pressed`); copy and
 * regenerate are plain icon buttons.
 */
export const AiFeedback = React.forwardRef<HTMLDivElement, AiFeedbackProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      onCopy,
      onRegenerate,
      showRegenerate = true,
      label = 'Response feedback',
      ...props
    },
    ref,
  ) => {
    const [inner, setInner] = React.useState<AiFeedbackValue>(defaultValue);
    const value = valueProp !== undefined ? valueProp : inner;
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
      if (!copied) return undefined;
      const t = window.setTimeout(() => setCopied(false), 2000);
      return () => window.clearTimeout(t);
    }, [copied]);

    return (
      <Root ref={ref} role="group" aria-label={label} {...props}>
        <Group
          type="single"
          value={value ?? ''}
          onValueChange={(next: string) => {
            const v = (next || null) as AiFeedbackValue;
            if (valueProp === undefined) setInner(v);
            onValueChange?.(v);
          }}
        >
          <Thumb value="liked" aria-label="Good response">
            <ThumbsUp aria-hidden />
          </Thumb>
          <Thumb value="disliked" aria-label="Bad response">
            <ThumbsDown aria-hidden />
          </Thumb>
        </Group>
        {onCopy ? (
          <IconButton
            label="Copy"
            icon={<Copy />}
            size="xs"
            intent="secondary"
            variant="ghost"
            onClick={() => {
              onCopy();
              setCopied(true);
            }}
          />
        ) : null}
        {showRegenerate && onRegenerate ? (
          <IconButton label="Regenerate" icon={<RotateCw />} size="xs" intent="secondary" variant="ghost" onClick={onRegenerate} />
        ) : null}
        <VisuallyHidden.Root aria-live="polite">{copied ? 'Copied' : ''}</VisuallyHidden.Root>
      </Root>
    );
  },
);

AiFeedback.displayName = 'AiFeedback';

export default AiFeedback;
