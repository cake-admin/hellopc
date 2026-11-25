import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import { fontStack } from '../../styles/globalStyles';
import { getTokenColor } from '../../tokens/colorTokens';
import Menu from './Menu';

// Animation keyframes
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface DropdownPosition {
  direction: 'up' | 'down';
  alignment: 'left' | 'right';
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  items?: string[];
  selectedItem?: string;
  hasSearch?: boolean;
  hasScroll?: boolean;
  disabled?: boolean;
  theme?: 'light.a' | 'dark.a';
  onSelect?: (item: string) => void;
  className?: string;
}

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const LabelText = styled.label<{ $theme?: string }>`
  font-family: ${fontStack};
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${props => getTokenColor('text.primary', props.$theme || 'light.a')};
`;

const TriggerContainer = styled.div<{ 
  $isOpen: boolean;
  $isHovered: boolean;
  $isFocused: boolean;
  $isSelected: boolean;
  $disabled: boolean;
  $theme?: string;
}>`
  position: relative;
  height: 40px;
  background-color: ${props => {
    const theme = props.$theme || 'light.a';
    if (props.$disabled) {
      return getTokenColor('reference.surfaceDisabled', theme);
    }
    if (props.$isFocused || props.$isOpen) {
      // Focus state: surface/card (light) or zinc/800 (dark)
      return theme === 'dark.a' 
        ? getTokenColor('zinc.800', theme) 
        : getTokenColor('surface.card', theme);
    }
    if (props.$isSelected) {
      // Rest state: surface/card (light) or zinc/800 (dark)
      return theme === 'dark.a' 
        ? getTokenColor('zinc.800', theme) 
        : getTokenColor('surface.card', theme);
    }
    if (props.$isHovered && !props.$isFocused) {
      // Hover state: surface/card (light) or zinc/800 (dark)
      return theme === 'dark.a' 
        ? getTokenColor('zinc.800', theme) 
        : getTokenColor('surface.card', theme);
    }
    // Default state: surface/canvas
    return getTokenColor('background.canvas', theme);
  }};
  border: 2px solid ${props => {
    const theme = props.$theme || 'light.a';
    if (props.$disabled) {
      return getTokenColor('textField.border.disabled', theme);
    }
    if (props.$isFocused || props.$isOpen) {
      return getTokenColor('border.focus', theme);
    }
    return getTokenColor('textField.border.input', theme);
  }};
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 8px 12px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  
  &:hover:not(:disabled) {
    border-color: ${props => {
      const theme = props.$theme || 'light.a';
      if (props.$isFocused) {
        return getTokenColor('border.focus', theme);
      }
      return getTokenColor('textField.border.input', theme);
    }};
  }
`;

const TriggerInput = styled.div<{ $theme?: string; $disabled?: boolean; $hasValue?: boolean }>`
  flex: 1;
  font-family: ${fontStack};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${props => {
    const theme = props.$theme || 'light.a';
    if (props.$disabled) {
      return getTokenColor('textField.text.disabled', theme);
    }
    if (props.$hasValue) {
      return getTokenColor('text.primary', theme);
    }
    return getTokenColor('textField.reference.helper', theme);
  }};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlaceholderText = styled.span<{ $theme?: string }>`
  color: ${props => getTokenColor('textField.reference.helper', props.$theme || 'light.a')};
`;

const IconContainer = styled.div<{ $isOpen: boolean; $theme?: string; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 100px;
  flex-shrink: 0;
  color: ${props => {
    const theme = props.$theme || 'light.a';
    if (props.$disabled) {
      return getTokenColor('textField.text.disabled', theme);
    }
    return getTokenColor('text.primary', theme);
  }};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchContainer = styled.div<{ $theme?: string }>`
  padding: 0 8px 8px 8px;
  border-bottom: none;
`;

const SearchInputWrapper = styled.div<{ $theme?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  background: ${props => getTokenColor('textField.surface.inputOnCanvas', props.$theme || 'light.a')};
  border: 1px solid ${props => getTokenColor('textField.border.input', props.$theme || 'light.a')};
  border-radius: 4px;
  height: 32px;
  padding: 0 8px;
  gap: 12px;
  
  &:focus-within {
    background: ${props => getTokenColor('textField.surface.inputOnCanvas', props.$theme || 'light.a')};
    border-color: ${props => getTokenColor('border.focus', props.$theme || 'light.a')};
  }
`;

const SearchIconWrapper = styled.div<{ $theme?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: ${props => getTokenColor('menu.text.search', props.$theme || 'light.a')};
  flex-shrink: 0;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const SearchInput = styled.input<{ $theme?: string }>`
  flex: 1;
  border: none;
  background: transparent;
  font-family: ${fontStack};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${props => getTokenColor('text.primary', props.$theme || 'light.a')};
  outline: none;
  
  &::placeholder {
    color: ${props => getTokenColor('menu.text.search', props.$theme || 'light.a')};
  }
`;

const MenuWrapper = styled.div<{ 
  $calculatedPosition: DropdownPosition;
  $theme?: string;
}>`
  position: absolute;
  ${props => props.$calculatedPosition.direction === 'down' 
    ? 'top: calc(100% + 8px);' 
    : 'bottom: calc(100% + 8px);'
  }
  ${props => props.$calculatedPosition.alignment === 'right' ? 'right: 0;' : 'left: 0;'}
  min-width: 100%;
  z-index: 1000;
  animation: ${slideDown} 0.2s ease-out;
  background: ${props => getTokenColor('menu.surface.item', props.$theme || 'light.a')};
  border-radius: 4px;
  padding: 8px 0;
  
  &.dropdown-up {
    transform-origin: bottom;
  }
  
  &.dropdown-down {
    transform-origin: top;
  }
`;

const calculateDropdownPosition = (
  triggerElement: HTMLElement,
  dropdownElement: HTMLElement,
  preferredPosition: string = 'bottom-left'
): DropdownPosition => {
  const BUFFER = 20;
  const triggerRect = triggerElement.getBoundingClientRect();
  const dropdownHeight = dropdownElement.offsetHeight;
  const viewportHeight = window.innerHeight;

  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  let direction: 'up' | 'down';
  if (preferredPosition.startsWith('bottom') && spaceBelow >= dropdownHeight + BUFFER) {
    direction = 'down';
  } else if (preferredPosition.startsWith('top') && spaceAbove >= dropdownHeight + BUFFER) {
    direction = 'up';
  } else {
    direction = spaceBelow >= spaceAbove ? 'down' : 'up';
  }

  const alignment = preferredPosition.endsWith('right') ? 'right' : 'left';

  return { direction, alignment };
};

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Select',
  items = [],
  selectedItem,
  hasSearch = false,
  hasScroll = false,
  disabled = false,
  theme = 'light.a',
  onSelect,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [calculatedPosition, setCalculatedPosition] = useState<DropdownPosition>({
    direction: 'down',
    alignment: 'left'
  });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on search query
  const filteredItems = hasSearch && searchQuery
    ? items.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  // Update position when dropdown opens or window resizes
  useEffect(() => {
    if (isOpen && triggerRef.current && menuRef.current) {
      const updatePosition = () => {
        const newPosition = calculateDropdownPosition(
          triggerRef.current!,
          menuRef.current!,
          'bottom-left'
        );
        setCalculatedPosition(newPosition);
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isOpen, filteredItems.length]);

  // Focus search input when dropdown opens with search
  useEffect(() => {
    if (isOpen && hasSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, hasSearch]);

  // Focus menu item when focusedIndex changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll('[role="menuitem"]');
      if (menuItems[focusedIndex]) {
        (menuItems[focusedIndex] as HTMLElement).focus();
      }
    }
  }, [isOpen, focusedIndex]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && focusedIndex < filteredItems.length) {
          handleItemSelect(filteredItems[focusedIndex]);
        }
        break;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
          triggerRef.current?.focus();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
        }
        break;
    }
  };

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchQuery('');
        setFocusedIndex(-1);
      }
    }
  };

  const handleItemSelect = (item: string) => {
    setIsOpen(false);
    setSearchQuery('');
    setFocusedIndex(-1);
    onSelect?.(item);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFocusedIndex(-1);
  };

  const displayValue = selectedItem || '';

  return (
    <DropdownWrapper ref={wrapperRef} className={className}>
      <LabelContainer>
        {label && <LabelText $theme={theme}>{label}</LabelText>}
        <TriggerContainer
          ref={triggerRef}
          $isOpen={isOpen}
          $isHovered={isHovered}
          $isFocused={isFocused}
          $isSelected={!!selectedItem}
          $disabled={disabled}
          $theme={theme}
          onClick={handleTriggerClick}
          onMouseEnter={() => !disabled && setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          aria-controls="dropdown-menu"
        >
          <TriggerInput $theme={theme} $disabled={disabled} $hasValue={!!displayValue}>
            {displayValue || <PlaceholderText $theme={theme}>{placeholder}</PlaceholderText>}
          </TriggerInput>
          <IconContainer $isOpen={isOpen} $theme={theme} $disabled={disabled}>
            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconContainer>
        </TriggerContainer>
      </LabelContainer>
      
      {isOpen && (
        <MenuWrapper
          ref={menuRef}
          $calculatedPosition={calculatedPosition}
          $theme={theme}
          className={`dropdown-${calculatedPosition.direction}`}
          id="dropdown-menu"
        >
          {hasSearch && (
            <SearchContainer $theme={theme}>
              <SearchInputWrapper $theme={theme}>
                <SearchIconWrapper $theme={theme}>
                  <SearchIcon />
                </SearchIconWrapper>
                <SearchInput
                  ref={searchInputRef}
                  $theme={theme}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      setFocusedIndex(e.key === 'ArrowDown' ? 0 : filteredItems.length - 1);
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (focusedIndex >= 0 && focusedIndex < filteredItems.length) {
                        handleItemSelect(filteredItems[focusedIndex]);
                      } else if (filteredItems.length > 0) {
                        handleItemSelect(filteredItems[0]);
                      }
                    }
                  }}
                />
              </SearchInputWrapper>
            </SearchContainer>
          )}
          <Menu
            items={filteredItems}
            selectedItem={selectedItem}
            theme={theme}
            onItemClick={handleItemSelect}
            width={triggerRef.current?.offsetWidth || 228}
            hasScroll={hasScroll}
            style={{ 
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '4px'
            }}
          />
        </MenuWrapper>
      )}
    </DropdownWrapper>
  );
};

export default Dropdown;

