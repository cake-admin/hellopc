import React from 'react';
import styled from 'styled-components';
import { File as FileIcon, Image as ImageIcon, RotateCw, X } from 'lucide-react';

import { IconButton } from '../Button';
import { Spinner } from '../Progress Indicators';
import { aiGradient, aiVar, type AiSegment } from './aiSegment';

/**
 * Upload lifecycle of an attached file (Figma "State"):
 * - `uploading` — spinner + "Uploading…"; the query input blocks Send
 * - `ready` — file-type glyph + `details` (type · size)
 * - `error` — error ring, "Upload failed", Retry + remove
 */
export type AiFileAttachmentStatus = 'uploading' | 'ready' | 'error';

export interface AiFileAttachmentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** File name. Truncates to one line; the full name is exposed as a tooltip (`title`). */
  name: string;
  /**
   * Upload state (Figma State=Uploading / Ready / Error).
   * @default 'ready'
   */
  status?: AiFileAttachmentStatus;
  /**
   * Secondary line while `ready`, e.g. "PDF · 2.4 MB". Uploading and error
   * states show their own fixed text.
   */
  details?: React.ReactNode;
  /** Removes the file. Renders the trailing × when provided. */
  onRemove?: () => void;
  /** Retries a failed upload. Renders Retry in the `error` state when provided. */
  onRetry?: () => void;
  /** Disables remove / retry. @default false */
  disabled?: boolean;
  /**
   * AI segment (Figma "Segment") — tints the file-type tile with the segment
   * surface gradient and flat glyph. Match the surrounding query input.
   * @default 'consumer'
   */
  segment?: AiSegment;
  /**
   * File-type glyph (Figma "File type"). Defaults to an image glyph for image
   * files (by extension) and a document glyph otherwise.
   */
  icon?: React.ReactNode;
}

const IMAGE_EXT = /\.(png|jpe?g|gif|bmp|webp|svg|heic|ico|tiff?)$/i;

/** Figma hellopc.ai.fileAttachment (19331:8984): 280px tile, 40px file-type tile, 24px glyph. */
const WIDTH = 280;
const TYPE_TILE = 40;
const TYPE_GLYPH = 24;

const Root = styled.div<{ $error: boolean }>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--space-200);
  width: ${WIDTH}px;
  max-width: 100%;
  padding: var(--space-200);
  border-radius: var(--radius-300);
  background: var(--color-surfaces-container);
  box-shadow: var(--elevation-0);
  border: var(--stroke-100) solid
    ${(p) => (p.$error ? 'var(--color-error-error)' : 'var(--color-stroke-border)')};
  font-family: var(--font-family);
`;

const TypeTile = styled.span<{ $error: boolean; $segment: AiSegment }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${TYPE_TILE}px;
  height: ${TYPE_TILE}px;
  border-radius: var(--radius-200);
  /* Ready/Uploading: segment surface gradient + flat glyph; Error: neutral tile, error glyph. */
  background: ${(p) => (p.$error ? 'var(--color-surfaces-on-container)' : aiGradient(p.$segment, 'surface'))};
  color: ${(p) =>
    p.$error ? 'var(--color-text-icon-error-on-surface-icon)' : aiVar(p.$segment, 'flat')};

  & > svg {
    width: ${TYPE_GLYPH}px;
    height: ${TYPE_GLYPH}px;
  }
`;

const Text = styled.span`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  line-height: 1.35;
`;

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-primary);
`;

const Details = styled.span<{ $error: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  color: ${(p) =>
    p.$error
      ? 'var(--color-text-icon-error-on-surface-text-destructive-btn)'
      : 'var(--color-text-icon-secondary)'};
`;

/**
 * hello pc AI FileAttachment — a file attached to a prompt in the AI query
 * input (Figma "hellopc.ai.fileAttachment", node 19331:8984). Added from
 * **File** in the + context menu (or drag-and-drop / paste); several tiles
 * wrap above the text.
 *
 * Static content (no Radix primitive applies); the remove and retry actions
 * reuse the hello pc `IconButton`, and the uploading state reuses `Spinner`.
 * The upload itself is the app's job — this tile only reflects its `status`.
 */
export const AiFileAttachment = React.forwardRef<HTMLDivElement, AiFileAttachmentProps>(
  (
    { name, status = 'ready', details, onRemove, onRetry, disabled = false, segment = 'consumer', icon, ...props },
    ref,
  ) => {
    const isError = status === 'error';
    const detailText =
      status === 'uploading' ? 'Uploading…' : isError ? 'Upload failed' : details;

    return (
      <Root ref={ref} $error={isError} aria-busy={status === 'uploading' || undefined} {...props}>
        <TypeTile $error={isError} $segment={segment} aria-hidden={status !== 'uploading'}>
          {status === 'uploading' ? (
            <Spinner size="sm" color="greyscale" aria-label={`Uploading ${name}`} />
          ) : (
            icon ?? (IMAGE_EXT.test(name) ? <ImageIcon /> : <FileIcon />)
          )}
        </TypeTile>
        <Text>
          <Name title={name}>{name}</Name>
          {detailText != null ? <Details $error={isError}>{detailText}</Details> : null}
        </Text>
        {isError && onRetry ? (
          <IconButton
            label={`Retry uploading ${name}`}
            icon={<RotateCw />}
            size="xs"
            intent="secondary"
            variant="ghost"
            disabled={disabled}
            onClick={onRetry}
          />
        ) : null}
        {onRemove ? (
          <IconButton
            label={`Remove ${name}`}
            icon={<X />}
            size="xs"
            intent="secondary"
            variant="ghost"
            disabled={disabled}
            onClick={onRemove}
          />
        ) : null}
      </Root>
    );
  },
);

AiFileAttachment.displayName = 'AiFileAttachment';

export default AiFileAttachment;
