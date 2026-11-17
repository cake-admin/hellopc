import React from 'react';
import { DropdownMenu } from 'radix-ui';
import styled from 'styled-components';
import { Check, File as FileIcon, Grip, Plus, Power, ReceiptText, Rocket, Wrench } from 'lucide-react';

import { IconButton } from '../Button';
import { Divider } from '../Elements';
import { MenuContainer, MenuItem } from '../Menu';

/** One context type a person can attach to a prompt (Figma hellopc.ai.contextMenu item). */
export interface AiContextOption {
  /** Stable id reported through `onToggle` / the input's `contexts`. */
  value: string;
  /** Visible label, also used for the chip. */
  label: string;
  /** 16px glyph (menu) / 18px glyph (chip); colored via `currentColor`. */
  icon?: React.ReactNode;
}

/**
 * The context types from the Figma spec (hellopc.ai.contextMenu, 19163:8542).
 * Lucide stand-ins for the Ampersand icons: receipt, power, apps, rocket_launch,
 * build. Pass your own list when a product needs different types.
 */
export const AI_CONTEXT_OPTIONS: AiContextOption[] = [
  { value: 'ticket', label: 'Ticket', icon: <ReceiptText /> },
  { value: 'power', label: 'Power', icon: <Power /> },
  { value: 'application', label: 'Application', icon: <Grip /> },
  { value: 'deployment', label: 'Deployment', icon: <Rocket /> },
  { value: 'device-configuration', label: 'Device Configuration', icon: <Wrench /> },
];

export interface AiContextMenuProps {
  /** Context types listed above the divider. @default AI_CONTEXT_OPTIONS */
  options?: AiContextOption[];
  /** Values already attached — shown with the selected treatment + check. */
  selected?: string[];
  /** Called with an option's value when it is chosen (toggle on / off). */
  onToggle?: (value: string) => void;
  /**
   * Called with the files picked from **File**. When omitted, the divider and
   * File item are not shown.
   */
  onFilesSelected?: (files: File[]) => void;
  /** `accept` for the file picker, e.g. `".pdf,.txt,image/*"`. */
  accept?: string;
  /** Allow picking several files at once. @default true */
  multiple?: boolean;
  /** Label of the file item. @default 'File' */
  fileLabel?: string;
  /** Accessible name of the + trigger. @default 'Add context or files' */
  triggerLabel?: string;
  /** Disables the + trigger. @default false */
  disabled?: boolean;
  /** Menu width (px or CSS). @default 320 */
  width?: number | string;
}

/** Radix positions/animates this wrapper; MenuContainer paints the surface. */
const Content = styled(DropdownMenu.Content)`
  z-index: 1000;
  outline: none;
`;

/** Visually hidden, not `display: none`: some browsers (notably older Safari)
 *  ignore a programmatic click() on an undisplayed file input, so the picker
 *  would never open. Clipped to 1px, it stays clickable but invisible. */
const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
`;

/**
 * hello pc AI ContextMenu — the **+** button of the AI query input and the menu
 * it opens (Figma "hellopc.ai.contextMenu", node 19163:8542): context types,
 * a divider, then **File**, which opens the system file picker.
 *
 * Built on Radix `DropdownMenu` (role="menu", arrow-key roving focus, typeahead,
 * Esc returns focus to +). The surface and rows are the existing hello pc
 * `MenuContainer`, `MenuItem` and `Divider`; the trigger is `IconButton`.
 * Opens above the trigger, start-aligned, 8px gap.
 */
export const AiContextMenu = ({
  options = AI_CONTEXT_OPTIONS,
  selected = [],
  onToggle,
  onFilesSelected,
  accept,
  multiple = true,
  fileLabel = 'File',
  triggerLabel = 'Add context or files',
  disabled = false,
  width = 320,
}: AiContextMenuProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <DropdownMenu.Root modal={false}>
        {/* asChild keeps one real <button>: IconButton forwards its ref + props. */}
        <DropdownMenu.Trigger asChild disabled={disabled}>
          <IconButton
            label={triggerLabel}
            icon={<Plus />}
            size="sm"
            intent="secondary"
            variant="ghost"
            disabled={disabled}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <Content side="top" align="start" sideOffset={8} collisionPadding={8}>
            <MenuContainer width={width}>
              {options.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <DropdownMenu.Item key={opt.value} asChild onSelect={() => onToggle?.(opt.value)}>
                    <MenuItem
                      selected={isSelected}
                      leftSlot={opt.icon}
                      showLeftSlot={opt.icon != null}
                      showRightSlot={isSelected}
                      rightSlot={<Check />}
                    >
                      {opt.label}
                    </MenuItem>
                  </DropdownMenu.Item>
                );
              })}
              {onFilesSelected ? (
                <>
                  {options.length > 0 ? <Divider /> : null}
                  <DropdownMenu.Item asChild onSelect={() => fileInputRef.current?.click()}>
                    <MenuItem leftSlot={<FileIcon />} showRightSlot={false}>
                      {fileLabel}
                    </MenuItem>
                  </DropdownMenu.Item>
                </>
              ) : null}
            </MenuContainer>
          </Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      {onFilesSelected ? (
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const files: File[] = e.target.files ? Array.from(e.target.files) : [];
            if (files.length) onFilesSelected(files);
            e.target.value = ''; // allow picking the same file again
          }}
        />
      ) : null}
    </>
  );
};

AiContextMenu.displayName = 'AiContextMenu';

export default AiContextMenu;
