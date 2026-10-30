import React from 'react';
import styled, { css } from 'styled-components';
import { Image, LoaderCircle, Trash2, Upload } from 'lucide-react';

import { Button } from '../Button/Button';
import { HelperString, type HelperTone } from '../Elements/HelperString';

/**
 * hello pc FileUpload — an image upload dropzone (Figma "File Upload", node
 * 78:7708). It composes the existing hello pc Button for the browse/update
 * action and HelperString for the restrictions line.
 *
 * The browser's native file input owns file selection. This component adds a
 * keyboard-accessible drop target, drag-state feedback, accept/size checks,
 * and controlled or uncontrolled file display. There is no Radix primitive
 * for browser file selection.
 *
 * State model:
 * - default / hover: outlined dropzone; hover washes with tonal lightest.
 * - dragging: tonal overlay + dashed on-tonal border.
 * - loading: tonal overlay + solid on-tonal border and spinner.
 * - disabled: muted disabled surface with blocked interactions.
 * - error: default chrome with a warning chip.
 * - uploaded: consumer-provided preview (or generic image glyph), update and
 *   delete actions.
 */

/** Figma node 78:7708 intrinsic dropzone, media panel, and glyph geometry. */
const DROPZONE_WIDTH = 480;
const MEDIA_SIZE = 48;
const ICON_SIZE = 24;

export type FileUploadStatus = 'default' | 'loading' | 'error' | 'uploaded';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
  max-width: ${DROPZONE_WIDTH}px;
  font-family: var(--font-family);
`;

const Dropzone = styled.div<{
  $dragging: boolean;
  $hovered: boolean;
  $loading: boolean;
  $disabled: boolean;
}>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-300);
  width: 100%;
  min-height: 236px;
  padding: var(--space-800) var(--space-300);
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-300);
  background: transparent;
  text-align: center;
  transition: background 120ms ease, border-color 120ms ease;

  ${(p) =>
    p.$hovered &&
    !p.$dragging &&
    !p.$loading &&
    css`
      background: var(--color-tonal-tonal-lightest);
    `}

  ${(p) =>
    (p.$dragging || p.$loading) &&
    css`
      background: var(--color-tonal-tonal-overlay);
    `}

  ${(p) =>
    p.$dragging &&
    css`
      border: var(--stroke-200) dashed var(--color-text-icon-on-tonal);
    `}

  ${(p) =>
    p.$loading &&
    css`
      border: var(--stroke-200) solid var(--color-text-icon-on-tonal);
    `}

  ${(p) =>
    p.$disabled &&
    css`
      background: var(--color-disabled-disabled);
      border-color: var(--color-disabled-disabled-inverse);
      color: var(--color-disabled-disabled-inverse);
      cursor: not-allowed;
    `}

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

const MediaPanel = styled.div<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${MEDIA_SIZE}px;
  height: ${MEDIA_SIZE}px;
  overflow: hidden;
  border-radius: var(--radius-200);
  background: ${(p) => (p.$disabled ? 'var(--color-surfaces-on-container-low)' : 'var(--color-tonal-tonal)')};
  color: ${(p) => (p.$disabled ? 'var(--color-disabled-disabled-inverse)' : 'var(--color-text-icon-on-tonal)')};

  & > svg {
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
  }
`;

const Preview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Message = styled.p<{ $disabled: boolean }>`
  margin: 0;
  font-family: var(--font-family);
  font-size: var(--type-size-helper);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  color: ${(p) => (p.$disabled ? 'var(--color-disabled-disabled-inverse)' : 'var(--color-text-icon-secondary)')};
`;

const Spinner = styled(LoaderCircle)`
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  color: var(--color-text-icon-on-tonal);
  animation: file-upload-spin 900ms linear infinite;

  @keyframes file-upload-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-300);
`;

const RemoveButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: var(--radius-1000);
  background: transparent;
  color: var(--color-primary-primary);
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--color-primary-primary-overlay);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible::after {
    position: absolute;
    inset: calc(var(--space-025) * -1);
    border: var(--stroke-200) solid var(--color-primary-primary);
    border-radius: var(--radius-1000);
    content: '';
    pointer-events: none;
  }

  &:disabled {
    color: var(--color-disabled-disabled-inverse);
    cursor: not-allowed;
  }

  & > svg {
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
  }
`;

const ErrorChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-025);
  height: 24px;
  padding: 0 var(--space-200);
  border-radius: var(--radius-1000);
  background: var(--color-warning-warn-overlay);
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

const WarningMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--color-warning-warn);

  &::before {
    content: '!';
    font-size: var(--type-size-caption);
    font-weight: var(--font-weight-bold);
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`;

const DEFAULT_ACCEPT = '.bmp,.gif,.ico,.jpg,.jpeg,.png';

const readableBytes = (bytes: number) => `${Math.round(bytes / (1024 * 1024))} MB`;

const matchesAccept = (file: File, accept: string) => {
  const accepted = accept
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  if (accepted.length === 0) return true;
  const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  return accepted.some((rule) => {
    if (rule.startsWith('.')) return extension === rule;
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
};

export interface FileUploadProps {
  /** Controlled current file. Supplying a file renders the uploaded state. */
  file?: File | null;
  /** Uncontrolled initial file. */
  defaultFile?: File | null;
  /** Fires after an accepted replacement is selected or dropped. */
  onFileChange?: (file: File) => void;
  /** Fires after the user removes an uploaded file. */
  onRemove?: () => void;
  /** Fires when accept or maximum-size validation rejects a file. */
  onError?: (message: string, file: File) => void;
  /** Forces a visual state; omit it to derive from file, validation, and loading props. */
  status?: FileUploadStatus;
  /** Shows the Figma loading treatment and blocks interactions. @default false */
  loading?: boolean;
  /** Blocks file selection, drag/drop, and removal. @default false */
  disabled?: boolean;
  /** Native file-input accept string. @default '.bmp,.gif,.ico,.jpg,.jpeg,.png' */
  accept?: string;
  /** Maximum accepted file size in bytes. @default 5242880 (5 MB) */
  maxSize?: number;
  /** Text below the dropzone; defaults to the Figma restrictions line. */
  restrictions?: React.ReactNode;
  /** Dropzone prompt. @default 'Drag and drop file here to upload.' */
  prompt?: string;
  /** Browse action label. @default 'Upload Image' */
  uploadLabel?: string;
  /** Replacement action label after a file is present. @default 'Update Image' */
  updateLabel?: string;
  /** Error-chip text. Defaults to the latest validation error. */
  errorMessage?: string;
  /** Image preview URL shown for an uploaded file. */
  previewUrl?: string;
  /** Accessible name for the dropzone. @default 'Image upload' */
  'aria-label'?: string;
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      file,
      defaultFile = null,
      onFileChange,
      onRemove,
      onError,
      status,
      loading = false,
      disabled = false,
      accept = DEFAULT_ACCEPT,
      maxSize = 5 * 1024 * 1024,
      restrictions,
      prompt = 'Drag and drop file here to upload.',
      uploadLabel = 'Upload Image',
      updateLabel = 'Update Image',
      errorMessage,
      previewUrl,
      'aria-label': ariaLabel = 'Image upload',
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [innerFile, setInnerFile] = React.useState<File | null>(defaultFile);
    const [dragging, setDragging] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [validationError, setValidationError] = React.useState<string | undefined>();

    const currentFile = file ?? innerFile;
    const effectiveError = errorMessage ?? validationError;
    const derivedStatus: FileUploadStatus = status ?? (loading ? 'loading' : effectiveError ? 'error' : currentFile ? 'uploaded' : 'default');
    const isLoading = derivedStatus === 'loading';
    const isDisabled = disabled || isLoading;
    const isUploaded = derivedStatus === 'uploaded';
    const isError = derivedStatus === 'error';
    const restrictionText =
      restrictions ?? `Extensions: ${accept.replaceAll(',', ', ')} | Max size: ${readableBytes(maxSize)} | File Size: 32×32 px`;
    const helperTone: HelperTone = disabled ? 'disabled' : isError ? 'warning' : 'greyscale';

    const openFileDialog = () => {
      if (!isDisabled) inputRef.current?.click();
    };

    const receiveFile = (next: File | undefined) => {
      if (!next || isDisabled) return;

      let nextError: string | undefined;
      if (!matchesAccept(next, accept)) {
        nextError = 'File type is not supported';
      } else if (next.size > maxSize) {
        nextError = `File exceeds the ${readableBytes(maxSize)} limit`;
      }

      if (nextError) {
        setValidationError(nextError);
        onError?.(nextError, next);
        return;
      }

      setValidationError(undefined);
      setInnerFile(next);
      onFileChange?.(next);
    };

    const removeFile = () => {
      if (isDisabled) return;
      setInnerFile(null);
      setValidationError(undefined);
      if (inputRef.current) inputRef.current.value = '';
      onRemove?.();
    };

    return (
      <Root ref={ref}>
        <Dropzone
          $dragging={dragging && !isDisabled}
          $hovered={hovered && !isDisabled}
          $loading={isLoading}
          $disabled={disabled}
          role="group"
          aria-label={ariaLabel}
          aria-busy={isLoading || undefined}
          aria-invalid={isError || undefined}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!isDisabled) setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            if (event.currentTarget === event.target) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            receiveFile(event.dataTransfer.files[0]);
          }}
        >
          <HiddenInput
            ref={inputRef}
            type="file"
            accept={accept}
            disabled={isDisabled}
            tabIndex={-1}
            aria-label={`${ariaLabel} file picker`}
            onChange={(event) => receiveFile(event.target.files?.[0])}
          />
          {isLoading ? (
            <Spinner aria-label="Uploading" />
          ) : (
            <MediaPanel $disabled={disabled}>
              {isUploaded && previewUrl ? <Preview src={previewUrl} alt="" /> : <Image aria-hidden />}
            </MediaPanel>
          )}
          <Message $disabled={disabled}>{prompt}</Message>
          {isUploaded ? (
            <ActionRow>
              <Button
                size="md"
                intent="primary"
                variant="fill"
                startIcon={<Upload />}
                disabled={isDisabled}
                onClick={(event) => {
                  event.stopPropagation();
                  openFileDialog();
                }}
              >
                {updateLabel}
              </Button>
              <RemoveButton
                type="button"
                disabled={isDisabled}
                aria-label={`Remove ${currentFile?.name ?? 'file'}`}
                onClick={(event) => {
                  event.stopPropagation();
                  removeFile();
                }}
              >
                <Trash2 aria-hidden />
              </RemoveButton>
            </ActionRow>
          ) : (
            <Button
              size="md"
              intent="primary"
              variant="fill"
              startIcon={<Upload />}
              disabled={isDisabled}
              onClick={(event) => {
                event.stopPropagation();
                openFileDialog();
              }}
            >
              {uploadLabel}
            </Button>
          )}
          {isError ? (
            <ErrorChip role="status">
              <WarningMark aria-hidden />
              {effectiveError ?? 'File type is not supported'}
            </ErrorChip>
          ) : null}
        </Dropzone>
        <HelperString tone={helperTone} showIcon={false}>
          {restrictionText}
        </HelperString>
      </Root>
    );
  },
);

FileUpload.displayName = 'FileUpload';
