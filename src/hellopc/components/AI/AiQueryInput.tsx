import React from 'react';
import styled, { css } from 'styled-components';
import { ArrowRight, Plus, RotateCw, Square } from 'lucide-react';

import { IconButton } from '../Button';
import { Chip } from '../Chip';
import { HelperString } from '../Elements';
import { AiContextMenu, type AiContextOption } from './AiContextMenu';
import { AiFileAttachment, type AiFileAttachmentStatus } from './AiFileAttachment';
import { AiModeToggle } from './AiModeToggle';
import { aiGradient, aiVar, type AiSegment } from './aiSegment';

/**
 * Request lifecycle the input reflects (Figma "State" minus Empty/Typing,
 * which are derived from whether the field has text):
 * - `idle` — Empty (send disabled) or Typing (send enabled)
 * - `sending` — the response is streaming; send becomes **Stop**
 * - `error` — the send failed; error ring + inline message, send becomes **Retry**
 */
export type AiQueryInputStatus = 'idle' | 'sending' | 'error';

/** A file shown above the text (Figma Attachments row). The app owns the upload. */
export interface AiAttachment {
  /** Stable id passed back to `onRemoveAttachment` / `onRetryAttachment`. */
  id: string;
  /** File name. */
  name: string;
  /** Upload state. @default 'ready' */
  status?: AiFileAttachmentStatus;
  /** Secondary line while ready, e.g. "PDF · 2.4 MB". */
  details?: React.ReactNode;
  /** Optional file-type glyph; defaults by extension (image vs document). */
  icon?: React.ReactNode;
}

export interface AiQueryInputProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange' | 'defaultValue'> {
  /**
   * AI segment (Figma "Segment") — sets the gradient ring, caret, and the
   * send-button fill from the `--color-ai-<segment>-*` tokens.
   * @default 'consumer'
   */
  segment?: AiSegment;
  /**
   * Request lifecycle: `idle`, `sending` (send → Stop), `error` (error ring,
   * inline message, send → Retry). Empty vs Typing is derived from the text.
   * @default 'idle'
   */
  status?: AiQueryInputStatus;
  /** Controlled text. Pair with `onValueChange`. */
  value?: string;
  /** Uncontrolled initial text. @default '' */
  defaultValue?: string;
  /** Called on every edit with the new text. */
  onValueChange?: (value: string) => void;
  /**
   * Called with the trimmed prompt (and the attached context values) when the
   * user presses Enter or the send button. In uncontrolled mode the field
   * clears afterwards (Figma Sending: "field cleared").
   */
  onSubmit?: (value: string, meta: { contexts: string[] }) => void;
  /** Called when the Stop button is pressed while `status="sending"`. */
  onStop?: () => void;
  /** Called with the kept text when Retry is pressed while `status="error"`. */
  onRetry?: (value: string) => void;
  /**
   * Placeholder shown while the field is empty.
   * @default 'Type your message here'
   */
  placeholder?: string;
  /**
   * Accessible name for the text field (there is no visible label).
   * @default 'Message'
   */
  label?: string;
  /**
   * Inline message shown under the text when `status="error"`. Rendered with
   * the hello pc `HelperString` element (tone `error`) and wired to the field
   * via `aria-describedby`.
   * @default "Your message didn't send. Check your connection and try again."
   */
  errorMessage?: React.ReactNode;
  /**
   * Leading toolbar slot. Defaults to the ghost "add" `IconButton` (wired to
   * `onAdd`). Pass your own actions — e.g. an attachment button plus a tool
   * picker — to replace it.
   */
  leadingActions?: React.ReactNode;
  /**
   * Click handler for the plain "add" button. Only used when neither
   * `contextOptions` nor `onFilesSelected` is set (otherwise + opens the
   * context menu).
   */
  onAdd?: () => void;
  /**
   * Context types the + menu offers (Figma hellopc.ai.contextMenu). Setting
   * this (or `onFilesSelected`) turns + into the context menu; pass
   * `AI_CONTEXT_OPTIONS` for the spec's default list.
   */
  contextOptions?: AiContextOption[];
  /** Controlled attached context values — each renders a `Chip` after +. */
  contexts?: string[];
  /** Uncontrolled initial context values. @default [] */
  defaultContexts?: string[];
  /** Called with the next attached context values. */
  onContextsChange?: (contexts: string[]) => void;
  /**
   * Called with the files picked from **File** in the + menu. Add them to
   * `attachments` (status `uploading`) and update as your upload progresses.
   */
  onFilesSelected?: (files: File[]) => void;
  /** `accept` for the file picker, e.g. `".pdf,image/*"`. */
  accept?: string;
  /**
   * Files shown above the text as `AiFileAttachment` tiles. Send stays
   * disabled while any file is `uploading`.
   */
  attachments?: AiAttachment[];
  /** Called with an attachment id when its × is pressed. */
  onRemoveAttachment?: (id: string) => void;
  /** Called with an attachment id when Retry is pressed on a failed upload. */
  onRetryAttachment?: (id: string) => void;
  /**
   * Trailing toolbar slot, rendered before the send button. Defaults to an
   * uncontrolled voice `AiModeToggle` in the same segment; pass a controlled
   * `AiModeToggle` (or `null` to remove it).
   */
  trailingActions?: React.ReactNode;
  /**
   * Content under the input card (outside the ring) — e.g. an AI disclaimer
   * line. Not part of the current Figma spec; provided as a composition slot.
   */
  footer?: React.ReactNode;
  /** Disables the field and every toolbar action. @default false */
  disabled?: boolean;
  /**
   * Maximum visible text lines before the field scrolls.
   * @default 6
   */
  maxRows?: number;
}

/* ── Geometry from Figma hellopc.ai.queryInput (17608:3405) ─────────────── */
/** min/max width of the card (Figma min-w 400, max-w 680). */
const MIN_WIDTH = 400;
const MAX_WIDTH = 680;
/** Text line-height from medium.14.body (1.35). */
const LINE_HEIGHT = 1.35;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
  min-width: ${MIN_WIDTH}px;
  max-width: ${MAX_WIDTH}px;
`;

/**
 * The ring: a 2px gradient border (gradient/ai/<segment>/primary) drawn with
 * the padding-box / border-box background technique so the container fill
 * stays solid; Error swaps it for a solid `--color-error-error` ring.
 */
const Card = styled.form<{ $segment: AiSegment; $status: AiQueryInputStatus; $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => (p.$status === 'error' ? 'var(--space-300)' : 'var(--space-600)')};
  margin: 0;
  padding: var(--space-500);
  border-radius: var(--radius-400);
  border: var(--stroke-200) solid transparent;
  /* Figma drop shadow: 0 1px 2px color/elevation/drop-shadow-light (not an elevation/<n> style) */
  box-shadow: 0 1px 2px 0 var(--color-elevation-drop-shadow-light);
  font-family: var(--font-family);

  ${(p) =>
    p.$status === 'error'
      ? css`
          background: var(--color-surfaces-container);
          border-color: var(--color-error-error);
        `
      : css`
          background:
            linear-gradient(var(--color-surfaces-container), var(--color-surfaces-container)) padding-box,
            ${aiGradient(p.$segment, 'primary')} border-box;
        `}

  ${(p) =>
    p.$disabled &&
    css`
      background: var(--color-surfaces-container);
      border-color: var(--color-disabled-disabled);
    `}
`;

/** Attachments row + text (Figma 1.3.0 "content": --space-300 between them). */
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  min-width: 0;
`;

/** Figma "attachments": tiles wrap with --space-100 gaps. */
const Attachments = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-100);
`;

const Field = styled.textarea<{ $segment: AiSegment; $maxRows: number }>`
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  resize: none;
  overflow-y: auto;
  background: transparent;
  font-family: var(--font-family);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: ${LINE_HEIGHT};
  color: var(--color-text-icon-primary);
  caret-color: ${(p) => aiVar(p.$segment, 'flat')};
  max-height: ${(p) => `calc(${p.$maxRows} * ${LINE_HEIGHT} * var(--type-size-body))`};

  &::placeholder {
    color: var(--color-text-icon-placeholder);
    opacity: 1;
  }
  &:disabled {
    cursor: not-allowed;
    color: var(--color-disabled-disabled-inverse);
  }
`;

/** Toolbar row — 32px tall (the sm IconButton diameter). */
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-100);
  min-height: 32px;
`;

const ActionGroup = styled.div<{ $end?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  ${(p) =>
    p.$end
      ? 'flex: 0 0 auto; justify-content: flex-end;'
      : 'flex: 1 1 auto; flex-wrap: wrap; min-width: 0;'}
`;

/**
 * Send / Stop / Retry: the hello pc IconButton (sm · fill) with its enabled
 * fill swapped for the segment gradient (gradient/ai/<segment>/fill) and the
 * glyph in `on fill`. Disabled keeps IconButton's disabled tokens untouched.
 * `&&` out-ranks IconButton's own hover/press rules.
 */
const SendButton = styled(IconButton)<{ $segment: AiSegment }>`
  && {
    transition: box-shadow 120ms ease;
  }
  &&:not(:disabled),
  &&:hover:not(:disabled),
  &&:active:not(:disabled) {
    background: ${(p) => aiGradient(p.$segment, 'fill')};
    color: ${(p) => aiVar(p.$segment, 'on-fill')};
  }
  &&:hover:not(:disabled) {
    box-shadow: var(--elevation-1);
  }
  &&:active:not(:disabled) {
    box-shadow: none;
  }
`;

/**
 * Figma "stop" glyph is a filled rounded square ~14px in the 24px slot
 * (inset 20.8%). lucide's Square is 18px, so it is scaled to match.
 */
const StopGlyph = () => (
  <Square fill="currentColor" strokeWidth={0} style={{ transform: 'scale(0.78)' }} />
);

/**
 * hello pc AI QueryInput — the prompt input for AI experiences (Figma
 * "hellopc.ai.queryInput", node 17608:3405). Segment sets the ring and
 * accents; status drives Empty → Typing → Sending (Stop) → Error (Retry).
 *
 * Renders a `<form>` around a native auto-growing `<textarea>`: Enter sends,
 * Shift+Enter inserts a newline. Composes existing hello pc pieces —
 * `IconButton` (add, send/stop/retry), `HelperString` (error line) and
 * `AiModeToggle` (voice) — rather than re-creating them.
 */
export const AiQueryInput = React.forwardRef<HTMLTextAreaElement, AiQueryInputProps>(
  (
    {
      segment = 'consumer',
      status = 'idle',
      value: valueProp,
      defaultValue = '',
      onValueChange,
      onSubmit,
      onStop,
      onRetry,
      placeholder = 'Type your message here',
      label = 'Message',
      errorMessage = "Your message didn't send. Check your connection and try again.",
      leadingActions,
      onAdd,
      contextOptions,
      contexts: contextsProp,
      defaultContexts = [],
      onContextsChange,
      onFilesSelected,
      accept,
      attachments = [],
      onRemoveAttachment,
      onRetryAttachment,
      trailingActions,
      footer,
      disabled = false,
      maxRows = 6,
      className,
      style,
      ...formProps
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolled;

    const fieldRef = React.useRef<HTMLTextAreaElement | null>(null);
    React.useImperativeHandle(ref, () => fieldRef.current as HTMLTextAreaElement);
    const errorId = React.useId();

    // Auto-grow: reset then size to content (capped by max-height in CSS).
    React.useLayoutEffect(() => {
      const el = fieldRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    const setValue = (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    };

    const [uncontrolledContexts, setUncontrolledContexts] = React.useState(defaultContexts);
    const contexts = contextsProp ?? uncontrolledContexts;
    const setContexts = (next: string[]) => {
      if (contextsProp === undefined) setUncontrolledContexts(next);
      onContextsChange?.(next);
    };
    const toggleContext = (v: string) =>
      setContexts(contexts.includes(v) ? contexts.filter((c) => c !== v) : [...contexts, v]);

    const isUploading = attachments.some((a) => (a.status ?? 'ready') === 'uploading');
    const hasText = value.trim().length > 0;
    const isSending = status === 'sending';
    const isError = status === 'error';

    const submit = () => {
      if (disabled || isSending || !hasText || isUploading) return;
      if (isError) {
        onRetry?.(value);
        return;
      }
      onSubmit?.(value.trim(), { contexts });
      if (!isControlled) setUncontrolled('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        submit();
      }
    };

    let action: { label: string; icon: React.ReactNode; enabled: boolean; onClick: () => void };
    if (isSending) {
      action = { label: 'Stop response', icon: <StopGlyph />, enabled: true, onClick: () => onStop?.() };
    } else if (isError) {
      // Like Send, Retry waits for in-progress uploads.
      action = { label: 'Retry', icon: <RotateCw />, enabled: hasText && !isUploading, onClick: submit };
    } else {
      action = { label: 'Send message', icon: <ArrowRight />, enabled: hasText && !isUploading, onClick: submit };
    }

    const useContextMenu = contextOptions !== undefined || onFilesSelected !== undefined;
    const optionFor = (v: string) => contextOptions?.find((o) => o.value === v);

    const leading =
      leadingActions !== undefined ? (
        leadingActions
      ) : useContextMenu ? (
        <>
          <AiContextMenu
            options={contextOptions ?? []}
            selected={contexts}
            onToggle={toggleContext}
            onFilesSelected={onFilesSelected}
            accept={accept}
            disabled={disabled}
          />
          {contexts.map((v) => {
            const opt = optionFor(v);
            return (
              <Chip
                key={v}
                type="secondary"
                size="lg"
                leadingIcon={opt?.icon}
                disabled={disabled}
                onRemove={() => setContexts(contexts.filter((c) => c !== v))}
                removeLabel={`Remove ${opt?.label ?? v} context`}
              >
                {opt?.label ?? v}
              </Chip>
            );
          })}
        </>
      ) : (
        <IconButton
          label="Add attachment"
          icon={<Plus />}
          size="sm"
          intent="secondary"
          variant="ghost"
          disabled={disabled}
          onClick={onAdd}
        />
      );

    const trailing =
      trailingActions !== undefined ? trailingActions : <AiModeToggle segment={segment} disabled={disabled} />;

    return (
      <Wrapper className={className} style={style}>
        <Card
          {...formProps}
          $segment={segment}
          $status={status}
          $disabled={disabled}
          aria-busy={isSending || undefined}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Content>
          {attachments.length > 0 ? (
            <Attachments aria-label="Attachments" role="list">
              {attachments.map((a) => (
                <AiFileAttachment
                  key={a.id}
                  role="listitem"
                  name={a.name}
                  segment={segment}
                  status={a.status}
                  details={a.details}
                  icon={a.icon}
                  disabled={disabled}
                  onRemove={onRemoveAttachment ? () => onRemoveAttachment(a.id) : undefined}
                  onRetry={onRetryAttachment ? () => onRetryAttachment(a.id) : undefined}
                />
              ))}
            </Attachments>
          ) : null}
          <Field
            ref={fieldRef}
            rows={1}
            $segment={segment}
            $maxRows={maxRows}
            value={value}
            placeholder={placeholder}
            aria-label={label}
            aria-invalid={isError || undefined}
            aria-describedby={isError ? errorId : undefined}
            disabled={disabled}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          </Content>
          {isError ? (
            <HelperString id={errorId} tone="error" role="alert">
              {errorMessage}
            </HelperString>
          ) : null}
          <Toolbar>
            <ActionGroup>{leading}</ActionGroup>
            <ActionGroup $end>
              {trailing}
              <SendButton
                $segment={segment}
                label={action.label}
                icon={action.icon}
                size="sm"
                intent="primary"
                variant="fill"
                disabled={disabled || !action.enabled}
                onClick={action.onClick}
              />
            </ActionGroup>
          </Toolbar>
        </Card>
        {footer}
      </Wrapper>
    );
  },
);

AiQueryInput.displayName = 'AiQueryInput';

export default AiQueryInput;
