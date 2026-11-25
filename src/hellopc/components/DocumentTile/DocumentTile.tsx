import React from 'react';
import { DropdownMenu as RadixDropdownMenu, VisuallyHidden } from 'radix-ui';
import styled, { css } from 'styled-components';
import { Download, EllipsisVertical, FileText, RotateCw, X } from 'lucide-react';

import { Badge, type BadgeColor } from '../Badge/Badge';
import { IconButton } from '../Button/IconButton';
import { Checkbox } from '../Checkbox/Checkbox';
import { MenuContainer } from '../Menu/MenuContainer';
import { MenuItem } from '../Menu/MenuItem';
import { ProgressBar } from '../Progress Indicators/ProgressBar';
import { SimpleTooltip } from '../Tooltip/SimpleTooltip';

export type DocumentTileLayout = 'tile' | 'compact';
export type DocumentTilePreview = 'icon' | 'photo';
export type DocumentTileStatus = 'idle' | 'uploading' | 'uploaded' | 'error';

export interface DocumentTileMenuItem {
  /** Visible item text, e.g. `Rename`. */
  label: string;
  /** Fires when the item is chosen (click, Enter, or Space). */
  onSelect?: () => void;
  /** Optional 24px leading glyph; inherits the item color. */
  icon?: React.ReactNode;
  /** Disables the item. */
  disabled?: boolean;
}

/* ── Geometry (Figma hellopc.document.tile, 17309:294) ──────────────────────
 * Tile: 160px thumbnail, 48px file-type icon, 36px photo badge (24px icon).
 * Compact: 40px icon block (24px icon), 20px photo badge (14px icon).
 * These are intrinsic component sizes, cited per the devkit rule. */
const TILE_THUMB_HEIGHT = 160;
const TILE_ICON = 48;
const TILE_BADGE = 36;
const COMPACT_BLOCK = 40;
const COMPACT_ICON = 24;
const COMPACT_BADGE = 20;
const COMPACT_BADGE_ICON = 14;

const Glyph = styled.span<{ $size: number }>`
  display: inline-flex;
  flex-shrink: 0;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;

  & > svg,
  & > img {
    width: 100%;
    height: 100%;
  }
`;

const Root = styled.div<{
  $layout: DocumentTileLayout;
  $preview: DocumentTilePreview;
  $selected: boolean;
  $interactive: boolean;
}>`
  position: relative;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-width: 0;
  overflow: clip;
  background: var(--color-surfaces-container);
  border: var(--stroke-100) solid var(--color-stroke-border);
  box-shadow: var(--elevation-0);
  font-family: var(--font-family);
  transition: box-shadow 120ms ease, border-color 120ms ease;

  ${(p) =>
    p.$layout === 'tile'
      ? css`
          flex-direction: column;
          border-radius: var(--radius-300);
        `
      : css`
          flex-direction: row;
          align-items: center;
          gap: var(--space-200);
          /* Figma 18908:488: 12px start/vertical, 8px end (icon buttons carry their own inset). */
          padding: var(--space-200) var(--space-100) var(--space-200) var(--space-200);
          border-radius: var(--radius-200);
        `}

  /* Hover = elevation/2; photo previews also lift the border to border-high. */
  ${(p) =>
    p.$interactive
      ? css`
          &:hover {
            box-shadow: var(--elevation-2);
            ${p.$preview === 'photo' ? 'border-color: var(--color-stroke-border-high);' : ''}
          }
        `
      : null}

  /* Selected = 2px primary border, flat (Figma 17309:255). The outer 1px is
     the border; an inset outline paints the second pixel over the thumbnail
     so the tile does not shift by a pixel. */
  ${(p) =>
    p.$selected
      ? css`
          &,
          &:hover {
            border-color: var(--color-primary-primary);
            box-shadow: none;
            outline: var(--stroke-100) solid var(--color-primary-primary);
            outline-offset: calc(-1 * var(--stroke-200));
          }
        `
      : null}

  /* Focus = 3px control focus ring drawn outside the tile (Figma 18922:41). */
  &:has([data-document-tile-primary]:focus-visible) {
    outline: var(--stroke-300) solid var(--color-control-focus-ring);
    outline-offset: 0;
  }
`;

/* ── Preview ─────────────────────────────────────────────────────────────── */

const TileThumb = styled.div<{ $preview: DocumentTilePreview }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: ${TILE_THUMB_HEIGHT}px;
  overflow: hidden;
  background: ${(p) => (p.$preview === 'icon' ? 'var(--color-surfaces-on-container)' : 'transparent')};
  color: var(--color-text-icon-secondary);
`;

const CompactThumb = styled.div<{ $preview: DocumentTilePreview; $error: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${COMPACT_BLOCK}px;
  height: ${COMPACT_BLOCK}px;
  border-radius: var(--radius-150);
  overflow: hidden;
  ${(p) =>
    p.$error
      ? css`
          background: var(--color-error-error-overlay);
          color: var(--color-error-error);

          /* Windows HCT resolves the error overlay and the error glyph to the
             same color; use the tonal ink so the file icon stays visible. */
          :root[data-theme='win hct'] &,
          [data-theme='win hct'] & {
            color: var(--color-text-icon-on-tonal);
          }
        `
      : p.$preview === 'icon'
        ? css`
            background: var(--color-tonal-tonal);
            color: var(--color-text-icon-on-tonal);
          `
        : null}
`;

const Photo = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/** File-type badge over a photo preview (Figma 18908:419 / 18908:688). */
const TypeBadge = styled.span<{ $layout: DocumentTileLayout }>`
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surfaces-container);
  border: var(--stroke-100) solid var(--color-stroke-border);
  color: var(--color-text-icon-secondary);
  ${(p) =>
    p.$layout === 'tile'
      ? css`
          left: var(--space-200);
          bottom: var(--space-200);
          width: ${TILE_BADGE}px;
          height: ${TILE_BADGE}px;
          border-radius: var(--radius-150);
        `
      : css`
          right: 0;
          bottom: 0;
          width: ${COMPACT_BADGE}px;
          height: ${COMPACT_BADGE}px;
          border-radius: var(--radius-50);
        `}
`;

const SelectSlot = styled.span<{ $layout: DocumentTileLayout }>`
  position: ${(p) => (p.$layout === 'tile' ? 'absolute' : 'relative')};
  z-index: 2;
  display: inline-flex;
  flex-shrink: 0;
  ${(p) =>
    p.$layout === 'tile'
      ? css`
          top: var(--space-200);
          left: var(--space-200);
        `
      : null}
`;

/* ── Body ────────────────────────────────────────────────────────────────── */

const Body = styled.div<{ $layout: DocumentTileLayout }>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  ${(p) =>
    p.$layout === 'tile'
      ? css`
          gap: var(--space-100);
          padding: var(--space-300);
        `
      : css`
          flex: 1;
          gap: var(--space-025);
        `}
`;

const Name = styled.span<{ $layout: DocumentTileLayout }>`
  display: block;
  max-width: 100%;
  overflow: hidden;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  letter-spacing: 0.1px;
  overflow-wrap: anywhere;
  ${(p) =>
    p.$layout === 'tile'
      ? css`
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        `
      : css`
          white-space: nowrap;
          text-overflow: ellipsis;
        `}
`;

/** Primary target: the file name is the link/button, and its ::after stretches
 *  over the whole tile so the card is one click target with one focus stop. */
const primaryStyles = css`
  all: unset;
  box-sizing: border-box;
  max-width: 100%;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  &:focus-visible {
    outline: none;
  }
`;
const PrimaryLink = styled.a`
  ${primaryStyles}
`;
const PrimaryButton = styled.button`
  ${primaryStyles}
  text-align: start;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const Meta = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.2px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Progress = styled.div`
  flex: 1;
  min-width: 0;
`;

/** Actions sit above the stretched primary target so they stay separate hits. */
const Actions = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  /* Stay end-aligned in the tile footer even when there is no meta. */
  margin-left: auto;
`;

const TagRow = styled.div`
  display: flex;
`;

/* ── Component ───────────────────────────────────────────────────────────── */

export interface DocumentTileProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> {
  /**
   * Figma `layout`: `tile` is a card with a 160px thumbnail for grids;
   * `compact` is a single row with a 40px icon block for lists, side panels,
   * attachments, and upload results. Both stretch to their container.
   * @default 'tile'
   */
  layout?: DocumentTileLayout;
  /**
   * Figma `preview`: `icon` shows the file-type icon on a neutral (tile) or
   * tonal (compact) block; `photo` shows `thumbnailSrc` with the file-type
   * icon as a small badge. Upload states always use `icon`.
   * @default 'icon'
   */
  preview?: DocumentTilePreview;
  /** File name (Figma `fileName`). Truncates to 2 lines (tile) or 1 (compact); the full name shows in a tooltip. */
  fileName: string;
  /** Secondary line, e.g. `Modified 22 Jun 2026 · Sam Taylor` (Figma `meta`). Hidden while an upload status is shown. */
  meta?: React.ReactNode;
  /** Optional tag text rendered as a violet subtle Badge (Figma `showTag`, tile only). */
  tag?: React.ReactNode;
  /** Badge color for `tag`. @default 'violet' */
  tagColor?: BadgeColor;
  /** Photo preview URL for `preview="photo"`. Decorative (`alt=""`): the file name names the tile. */
  thumbnailSrc?: string;
  /**
   * File-type glyph (Figma `fileTypeIcon` slot). Swap in an app icon (PDF,
   * PowerPoint) when the product has one; it inherits color via `currentColor`.
   * @default <FileText />
   */
  fileTypeIcon?: React.ReactNode;
  /** Hides the tile thumbnail for text-only grids (Figma `showThumbnail`). @default true */
  showThumbnail?: boolean;
  /** Selected treatment: 2px primary border, flat (Figma `state=selected`). Ignored during upload states. @default false */
  selected?: boolean;
  /**
   * Renders a Checkbox for multi-select (`Select <fileName>`). Omit to show
   * selection only visually via `selected`.
   */
  onSelectedChange?: (selected: boolean) => void;
  /**
   * Upload status. `uploading` shows a 4px progress bar with time left, %
   * uploaded, and cancel; `uploaded` a full success bar with remove; `error`
   * a full error bar with the message and retry. Replaces meta, download, and
   * more while active.
   * @default 'idle'
   */
  status?: DocumentTileStatus;
  /** Upload progress 0–100 for `status="uploading"`. @default 0 */
  progress?: number;
  /** Time-left text beside the bar while uploading, e.g. `2 mins left`. */
  timeLeft?: React.ReactNode;
  /** Error text for `status="error"`. @default 'Upload failed.' */
  errorMessage?: React.ReactNode;
  /** Success text for `status="uploaded"`. @default 'Uploaded successfully.' */
  successMessage?: React.ReactNode;
  /** Makes the file name a link to the file; the whole tile is its click target. */
  href?: string;
  /** Makes the file name a button that opens the file (when there is no `href`). */
  onOpen?: () => void;
  /** Shows the download action (Figma `showDownload`) and fires on click. */
  onDownload?: () => void;
  /** Items for the More (⋮) menu. Omit to hide the menu button. */
  menu?: DocumentTileMenuItem[];
  /** Cancel action while uploading. */
  onCancel?: () => void;
  /** Remove action once uploaded. */
  onRemove?: () => void;
  /** Retry action after an error. */
  onRetry?: () => void;
}

/**
 * Tracks whether the file name is visually truncated. Takes the element itself
 * (from a callback ref) because wrapping the name in a tooltip remounts it —
 * a stale RefObject would keep measuring the detached node.
 */
const useIsTruncated = (el: HTMLElement | null, deps: unknown[]) => {
  const [truncated, setTruncated] = React.useState(false);
  React.useLayoutEffect(() => {
    if (!el) return undefined;
    const measure = () => {
      if (!el.isConnected) return;
      setTruncated(el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    // Re-measure once layout and web fonts settle: a clamped name keeps the
    // same box size, so ResizeObserver alone would miss the font swap.
    let alive = true;
    const frame = requestAnimationFrame(measure);
    document.fonts?.ready.then(() => alive && measure());
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    ro?.observe(el);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el, ...deps]);
  return truncated;
};

/**
 * hello pc DocumentTile — a file or generated document as a card (`tile`) or a
 * list row (`compact`), including inline upload progress (Figma
 * `hellopc.document.tile`, node 17309:294). Composes Badge, IconButton,
 * ProgressBar, SimpleTooltip, Checkbox, and the Menu pieces on a Radix
 * DropdownMenu.
 */
export const DocumentTile = React.forwardRef<HTMLDivElement, DocumentTileProps>(
  (
    {
      layout = 'tile',
      preview = 'icon',
      fileName,
      meta,
      tag,
      tagColor = 'violet',
      thumbnailSrc,
      fileTypeIcon,
      showThumbnail = true,
      selected = false,
      onSelectedChange,
      status = 'idle',
      progress = 0,
      timeLeft,
      errorMessage = 'Upload failed.',
      successMessage = 'Uploaded successfully.',
      href,
      onOpen,
      onDownload,
      menu,
      onCancel,
      onRemove,
      onRetry,
      ...props
    },
    ref,
  ) => {
    const uploading = status !== 'idle';
    // Upload states only exist with an icon preview (Figma 18911:2536 …).
    const effectivePreview: DocumentTilePreview = uploading ? 'icon' : preview;
    const isSelected = selected && !uploading;
    const interactive = !uploading && (href != null || onOpen != null);
    const isTile = layout === 'tile';

    const [nameEl, setNameEl] = React.useState<HTMLSpanElement | null>(null);
    const truncated = useIsTruncated(nameEl, [fileName, layout]);
    const [tipOpen, setTipOpen] = React.useState(false);
    /** True between a pointer-down that dismisses the More menu and the click
     *  that follows it, so that click does not reach the primary overlay. */
    const suppressOpenRef = React.useRef(false);
    const handleMenuPointerDownOutside = () => {
      suppressOpenRef.current = true;
      const release = () => window.setTimeout(() => {
        suppressOpenRef.current = false;
      }, 0);
      window.addEventListener('pointerup', release, { once: true, capture: true });
      window.addEventListener('pointercancel', release, { once: true, capture: true });
    };

    const icon = fileTypeIcon ?? <FileText />;

    /* Preview block */
    const photo =
      effectivePreview === 'photo' && thumbnailSrc ? <Photo src={thumbnailSrc} alt="" /> : null;
    const previewNode = isTile ? (
      showThumbnail ? (
        <TileThumb $preview={effectivePreview}>
          {photo}
          {effectivePreview === 'photo' ? (
            <TypeBadge $layout="tile" aria-hidden>
              <Glyph $size={COMPACT_ICON}>{icon}</Glyph>
            </TypeBadge>
          ) : (
            <Glyph $size={TILE_ICON} aria-hidden>
              {icon}
            </Glyph>
          )}
        </TileThumb>
      ) : null
    ) : (
      <CompactThumb $preview={effectivePreview} $error={status === 'error'}>
        {photo}
        {effectivePreview === 'photo' ? (
          <TypeBadge $layout="compact" aria-hidden>
            <Glyph $size={COMPACT_BADGE_ICON}>{icon}</Glyph>
          </TypeBadge>
        ) : (
          <Glyph $size={COMPACT_ICON} aria-hidden>
            {icon}
          </Glyph>
        )}
      </CompactThumb>
    );

    /* Name (primary target when interactive).
     * The tooltip always wraps one stable, width-constrained element — the
     * link/button, or the name text itself — and only its open state follows
     * truncation. Swapping elements would remount the focus target and, for an
     * unconstrained wrapper, let the name stop overflowing (a wrap/unwrap loop). */
    const primaryProps = {
      'data-document-tile-primary': '',
      'aria-current': isSelected ? ('true' as const) : undefined,
    };
    const onPrimaryClick = (event: React.MouseEvent) => {
      // The click that dismissed the More menu lands on the stretched overlay;
      // it must not also open the file.
      if (suppressOpenRef.current) {
        event.preventDefault();
        return;
      }
      onOpen?.();
    };
    const target = interactive ? (
      href != null ? (
        <PrimaryLink href={href} onClick={onPrimaryClick} {...primaryProps}>
          <Name ref={setNameEl} $layout={layout}>
            {fileName}
          </Name>
        </PrimaryLink>
      ) : (
        <PrimaryButton type="button" onClick={onPrimaryClick} {...primaryProps}>
          <Name ref={setNameEl} $layout={layout}>
            {fileName}
          </Name>
        </PrimaryButton>
      )
    ) : (
      // Plain text: a focus stop only while cut off, so keyboard users can
      // still reach the full name in the tooltip.
      <Name ref={setNameEl} $layout={layout} tabIndex={truncated ? 0 : undefined}>
        {fileName}
      </Name>
    );
    const nameNode = (
      <SimpleTooltip
        triggerElement={target}
        delayDuration={400}
        open={truncated && tipOpen}
        onOpenChange={setTipOpen}
      >
        {fileName}
      </SimpleTooltip>
    );

    /* Actions */
    const actionSize = 'sm' as const;
    let actions: React.ReactNode = null;
    if (status === 'uploading') {
      actions = onCancel ? (
        <IconButton
          size={actionSize}
          variant="ghost"
          intent="secondary"
          icon={<X />}
          label={`Cancel upload of ${fileName}`}
          onClick={onCancel}
        />
      ) : null;
    } else if (status === 'uploaded') {
      actions = onRemove ? (
        <IconButton
          size={actionSize}
          variant="ghost"
          intent="secondary"
          icon={<X />}
          label={`Remove ${fileName}`}
          onClick={onRemove}
        />
      ) : null;
    } else if (status === 'error') {
      actions = onRetry ? (
        <IconButton
          size={actionSize}
          variant="ghost"
          intent="secondary"
          icon={<RotateCw />}
          label={`Retry upload of ${fileName}`}
          onClick={onRetry}
        />
      ) : null;
    } else if (onDownload || (menu && menu.length > 0)) {
      actions = (
        <>
          {onDownload ? (
            <IconButton
              size={actionSize}
              variant="ghost"
              intent="secondary"
              icon={<Download />}
              label={`Download ${fileName}`}
              onClick={onDownload}
            />
          ) : null}
          {menu && menu.length > 0 ? (
            <RadixDropdownMenu.Root>
              <RadixDropdownMenu.Trigger asChild>
                <IconButton
                  size={actionSize}
                  variant="ghost"
                  intent="secondary"
                  icon={<EllipsisVertical />}
                  label={`More actions for ${fileName}`}
                />
              </RadixDropdownMenu.Trigger>
              <RadixDropdownMenu.Portal>
                <RadixDropdownMenu.Content
                  align="end"
                  sideOffset={4}
                  style={{ zIndex: 1000 }}
                  aria-label={`Actions for ${fileName}`}
                  onPointerDownOutside={handleMenuPointerDownOutside}
                >
                  <MenuContainer width="max-content" role="none">
                    {menu.map((item) => (
                      <RadixDropdownMenu.Item
                        asChild
                        key={item.label}
                        disabled={item.disabled}
                        onSelect={() => item.onSelect?.()}
                      >
                        <MenuItem
                          disabled={item.disabled}
                          showLeftSlot={item.icon != null}
                          leftSlot={item.icon}
                          showRightSlot={false}
                        >
                          {item.label}
                        </MenuItem>
                      </RadixDropdownMenu.Item>
                    ))}
                  </MenuContainer>
                </RadixDropdownMenu.Content>
              </RadixDropdownMenu.Portal>
            </RadixDropdownMenu.Root>
          ) : null}
        </>
      );
    }
    const actionsNode = actions ? <Actions>{actions}</Actions> : null;

    /* Upload progress (ProgressBar hairline) */
    const progressNode = uploading ? (
      <Progress>
        <ProgressBar
          width="hairline"
          label={null}
          aria-label={`Upload progress for ${fileName}`}
          value={status === 'uploading' ? progress : 100}
          color={status === 'uploading' ? 'primary' : status === 'uploaded' ? 'success' : 'error'}
          helperTone={status === 'uploading' ? 'info' : status === 'uploaded' ? 'success' : 'error'}
          // Explicit null: ProgressBar's own default is placeholder copy, which
          // must never reach a live row when `timeLeft` is omitted.
          helperText={
            (status === 'uploading' ? timeLeft : status === 'uploaded' ? successMessage : errorMessage) ?? null
          }
          showHelperIcon
          showValue={status === 'uploading'}
          valueText={`${Math.round(Math.min(Math.max(progress, 0), 100))}% uploaded`}
        />
      </Progress>
    ) : null;

    /* Status announcements: only transitions, never every percent tick. */
    const announcement =
      status === 'uploading'
        ? `Uploading ${fileName}`
        : status === 'uploaded'
          ? `${fileName}: ${typeof successMessage === 'string' ? successMessage : 'uploaded'}`
          : status === 'error'
            ? `${fileName}: ${typeof errorMessage === 'string' ? errorMessage : 'upload failed'}`
            : '';

    const selectNode = onSelectedChange ? (
      <SelectSlot $layout={layout}>
        <Checkbox
          checked={isSelected}
          disabled={uploading}
          aria-label={`Select ${fileName}`}
          onCheckedChange={(next) => onSelectedChange(next === true)}
        />
      </SelectSlot>
    ) : null;

    return (
      <Root
        ref={ref}
        $layout={layout}
        $preview={effectivePreview}
        $selected={isSelected}
        $interactive={interactive}
        data-status={status}
        data-selected={isSelected ? '' : undefined}
        {...props}
      >
        {isTile ? (
          <>
            {selectNode}
            {previewNode}
            <Body $layout="tile">
              {tag != null ? (
                <TagRow>
                  <Badge color={tagColor} tone="subtle">
                    {tag}
                  </Badge>
                </TagRow>
              ) : null}
              {nameNode}
              {/* Skip the footer row (and its gap) when there is nothing to show. */}
              {uploading || meta != null || actionsNode ? (
                <Footer>
                  {uploading ? progressNode : meta != null ? <Meta>{meta}</Meta> : null}
                  {actionsNode}
                </Footer>
              ) : null}
            </Body>
          </>
        ) : (
          <>
            {selectNode}
            {previewNode}
            <Body $layout="compact">
              {nameNode}
              {uploading ? progressNode : meta != null ? <Meta>{meta}</Meta> : null}
            </Body>
            {actionsNode}
          </>
        )}
        <VisuallyHidden.Root role="status" aria-live="polite">
          {announcement}
        </VisuallyHidden.Root>
      </Root>
    );
  },
);

DocumentTile.displayName = 'DocumentTile';

export default DocumentTile;
