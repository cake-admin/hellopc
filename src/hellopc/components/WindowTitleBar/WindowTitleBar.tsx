import React from 'react';
import styled, { css } from 'styled-components';
import { Maximize, Minimize, Minus, X } from 'lucide-react';

import { IconButton } from '../Button';

export type WindowTitleBarVariant = 'windows' | 'in-app';

export interface WindowTitleBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * `windows` — the 32px Windows caption bar for secondary windows that have
   * no topbar (transparent over Mica, 46×32 caption buttons). `in-app` — a
   * 48px bar for floating agent panels and pop-out editors (container surface,
   * bottom border, 32px icon buttons). Figma `style`.
   * @default 'windows'
   */
  variant?: WindowTitleBarVariant;
  /** The window title (usually the app or document name). */
  title: React.ReactNode;
  /** App icon slot — 16px in `windows`, 20px in `in-app`. Decorative. */
  appIcon?: React.ReactNode;
  /** Shows the Minimize control and calls this when it's pressed. */
  onMinimize?: () => void;
  /** Shows the Maximize/Restore control and calls this when it's pressed. */
  onMaximize?: () => void;
  /** Shows the Close control and calls this when it's pressed. */
  onClose?: () => void;
  /** The window is maximized: the control becomes Restore. @default false */
  maximized?: boolean;
  /**
   * Marks the bar as the window's drag region (`app-region: drag`, with the
   * controls excluded) for desktop hosts such as Electron or WebView2.
   * @default true
   */
  dragRegion?: boolean;
}

const dragStyles = css`
  -webkit-app-region: drag;
  app-region: drag;
`;
const noDragStyles = css`
  -webkit-app-region: no-drag;
  app-region: no-drag;
`;

const Root = styled.div<{ $variant: WindowTitleBarVariant; $drag: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  font-family: var(--font-family);
  color: var(--color-text-icon-primary);
  user-select: none;
  ${(p) => (p.$drag ? dragStyles : '')}

  ${(p) =>
    p.$variant === 'windows'
      ? css`
          /* Figma style=windows: 32px, transparent over the Mica backdrop. */
          height: 32px;
          padding-left: var(--space-300);
          background: transparent;
        `
      : css`
          /* Figma style=in-app: 48px on the container surface. */
          height: 48px;
          padding: var(--space-100) var(--space-100) var(--space-100) var(--space-300);
          background: var(--color-surfaces-container);
          border-bottom: var(--stroke-100) solid var(--color-stroke-border);
        `}
`;

const Identity = styled.div<{ $variant: WindowTitleBarVariant }>`
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

/** App icon: 16px (windows) / 20px (in-app) — Figma slot geometry. */
const AppIcon = styled.span<{ $variant: WindowTitleBarVariant }>`
  display: inline-flex;
  flex: none;
  width: ${(p) => (p.$variant === 'windows' ? '16px' : '20px')};
  height: ${(p) => (p.$variant === 'windows' ? '16px' : '20px')};

  & > svg,
  & > img {
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.span<{ $variant: WindowTitleBarVariant }>`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.35;
  ${(p) =>
    p.$variant === 'windows'
      ? css`
          font-size: var(--type-size-caption);
          font-weight: var(--font-weight-regular);
          letter-spacing: 0.2px;
        `
      : css`
          font-size: var(--type-size-body);
          font-weight: var(--font-weight-medium);
          letter-spacing: 0.1px;
        `}
`;

const Controls = styled.div<{ $variant: WindowTitleBarVariant }>`
  display: flex;
  flex: none;
  align-items: center;
  align-self: stretch;
  gap: ${(p) => (p.$variant === 'in-app' ? 'var(--space-050)' : '0')};
  ${noDragStyles}
`;

/** Windows caption button — 46×32 (Figma .hellopc.caption.button 17311:177).
 *  Hover/press use the secondary overlays; Close turns error red. The glyph
 *  takes control/onHover (onDestructiveHover for Close) on hover so it stays
 *  readable on the Highlight fill in win hct. */
const CaptionButton = styled.button<{ $close?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-icon-primary);
  cursor: default;

  &:hover {
    background: ${(p) => (p.$close ? 'var(--color-error-error)' : 'var(--color-secondary-secondary-overlay)')};
    color: ${(p) => (p.$close ? 'var(--color-control-on-destructive-hover)' : 'var(--color-control-on-hover)')};
  }
  &:active {
    background: ${(p) => (p.$close ? 'var(--color-error-error-hover)' : 'var(--color-secondary-secondary-overlay-hover)')};
    color: ${(p) => (p.$close ? 'var(--color-control-on-destructive-hover)' : 'var(--color-control-on-hover)')};
  }
  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: var(--stroke-300) solid var(--color-control-focus-ring);
    outline-offset: calc(-1 * var(--stroke-300));
  }

  & > svg {
    width: var(--space-300);
    height: var(--space-300);
  }
`;

/** Windows-style glyphs, drawn to the Figma geometry: a 10px line, a 10px box
 *  with a 1px edge (maximize), or two offset boxes (restore). */
const Glyph = styled.span<{ $kind: 'minimize' | 'maximize' | 'restore' }>`
  position: relative;
  display: inline-block;
  width: 10px;
  height: 10px;
  ${(p) =>
    p.$kind === 'minimize'
      ? css`
          height: var(--stroke-100);
          background: currentColor;
        `
      : p.$kind === 'maximize'
        ? css`
            border: var(--stroke-100) solid currentColor;
            border-radius: 1px;
            box-sizing: border-box;
          `
        : css`
            &::before,
            &::after {
              content: '';
              position: absolute;
              box-sizing: border-box;
              width: 8px;
              height: 8px;
              border: var(--stroke-100) solid currentColor;
              border-radius: 1px;
            }
            &::before {
              top: 0;
              right: 0;
              border-bottom-color: transparent;
              border-left-color: transparent;
            }
            &::after {
              bottom: 0;
              left: 0;
            }
          `}
`;

/**
 * hello pc Window Title Bar — the bar across the top of a window or floating
 * panel (Figma `hellopc.window.titlebar`, set 17311:306): app icon, title, and
 * minimize / maximize / close. App windows with a topbar use that instead; this
 * is for secondary windows (`windows`) and floating in-app panels (`in-app`).
 * A control renders only when its handler is set.
 */
export const WindowTitleBar = React.forwardRef<HTMLDivElement, WindowTitleBarProps>(
  (
    {
      variant = 'windows',
      title,
      appIcon,
      onMinimize,
      onMaximize,
      onClose,
      maximized = false,
      dragRegion = true,
      ...props
    },
    ref,
  ) => {
    const maximizeLabel = maximized ? 'Restore' : 'Maximize';
    const hasControls = onMinimize || onMaximize || onClose;

    return (
      <Root ref={ref} $variant={variant} $drag={dragRegion} {...props}>
        <Identity $variant={variant}>
          {appIcon ? (
            <AppIcon $variant={variant} aria-hidden>
              {appIcon}
            </AppIcon>
          ) : null}
          <Title $variant={variant}>{title}</Title>
        </Identity>
        {hasControls ? (
          <Controls $variant={variant}>
            {variant === 'windows' ? (
              <>
                {onMinimize ? (
                  <CaptionButton type="button" aria-label="Minimize" onClick={onMinimize}>
                    <Glyph $kind="minimize" aria-hidden />
                  </CaptionButton>
                ) : null}
                {onMaximize ? (
                  <CaptionButton type="button" aria-label={maximizeLabel} onClick={onMaximize}>
                    <Glyph $kind={maximized ? 'restore' : 'maximize'} aria-hidden />
                  </CaptionButton>
                ) : null}
                {onClose ? (
                  <CaptionButton type="button" aria-label="Close" $close onClick={onClose}>
                    <X aria-hidden strokeWidth={1.25} />
                  </CaptionButton>
                ) : null}
              </>
            ) : (
              <>
                {onMinimize ? (
                  <IconButton label="Minimize" icon={<Minus />} size="sm" intent="secondary" variant="ghost" onClick={onMinimize} />
                ) : null}
                {onMaximize ? (
                  <IconButton
                    label={maximizeLabel}
                    icon={maximized ? <Minimize /> : <Maximize />}
                    size="sm"
                    intent="secondary"
                    variant="ghost"
                    onClick={onMaximize}
                  />
                ) : null}
                {onClose ? (
                  <IconButton label="Close" icon={<X />} size="sm" intent="secondary" variant="ghost" onClick={onClose} />
                ) : null}
              </>
            )}
          </Controls>
        ) : null}
      </Root>
    );
  },
);

WindowTitleBar.displayName = 'WindowTitleBar';

export default WindowTitleBar;
