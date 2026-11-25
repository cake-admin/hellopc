import React, { forwardRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import colorData from '../../data/colors.json';

/**
 * Checkbox states
 */
const CHECKBOX_STATES = {
  UNCHECKED: 'unchecked',
  CHECKED: 'checked',
  INDETERMINATE: 'indeterminate'
};

/**
 * Checkbox themes
 */
const CHECKBOX_THEMES = {
  LIGHT: 'light.a',
  DARK: 'dark.a'
};

/**
 * Checkbox sizes
 */
const CHECKBOX_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

const getCheckboxColors = (state, theme, isDisabled, isFocused, isHovered, isPressed) => {
  const isDark = theme === CHECKBOX_THEMES.DARK;
  
  if (isDark) {
    // Dark theme colors
    if (isDisabled) {
      return {
        border: '#9CA3AF',
        background: '#27272A',
        icon: '#9CA3AF',
        label: '#9CA3AF'
      };
    }

    if (state === CHECKBOX_STATES.CHECKED || state === CHECKBOX_STATES.INDETERMINATE) {
      if (isPressed) {
        return {
          border: '#52525B',
          background: '#93C5FD',
          icon: '#18181B',
          label: '#D4D4D8'
        };
      } else if (isHovered) {
        return {
          border: '#52525B',
          background: '#93C5FD',
          icon: '#18181B',
          label: '#D4D4D8'
        };
      } else {
        return {
          border: '#52525B',
          background: '#93C5FD',
          icon: '#18181B',
          label: '#D4D4D8'
        };
      }
    }

    // Unchecked state for dark theme
    if (isPressed) {
      return {
        border: '#71717A',
        background: 'transparent',
        icon: 'transparent',
        label: '#D4D4D8'
      };
    } else if (isHovered) {
      return {
        border: '#D4D4D8',
        background: 'transparent',
        icon: 'transparent',
        label: '#D4D4D8'
      };
    } else {
      return {
        border: '#71717A',
        background: 'transparent',
        icon: 'transparent',
        label: '#D4D4D8'
      };
    }
  } else {
    // Light theme colors (keeping existing implementation)
    if (isDisabled) {
      return {
        border: '#64748B',
        background: '#F1F5F9',
        icon: '#475569',
        label: '#475569'
      };
    }

    if (state === CHECKBOX_STATES.CHECKED || state === CHECKBOX_STATES.INDETERMINATE) {
      if (isPressed) {
        return {
          border: '#1D4ED8',
          background: '#1D4ED8',
          icon: '#FFFFFF',
          label: '#0F172A'
        };
      } else if (isHovered) {
        return {
          border: '#1E3A8A',
          background: '#1E3A8A',
          icon: '#FFFFFF',
          label: '#0F172A'
        };
      } else {
        return {
          border: '#1D4ED8',
          background: '#1D4ED8',
          icon: '#FFFFFF',
          label: '#0F172A'
        };
      }
    }

    // Unchecked state for light theme
    if (isPressed) {
      return {
        border: '#64748B',
        background: 'transparent',
        icon: 'transparent',
        label: '#0F172A'
      };
    } else if (isHovered) {
      return {
        border: '#0F172A',
        background: 'transparent',
        icon: 'transparent',
        label: '#0F172A'
      };
    } else {
      return {
        border: '#64748B',
        background: 'transparent',
        icon: 'transparent',
        label: '#0F172A'
      };
    }
  }
};

const CheckboxContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  user-select: none;
  position: relative;
  line-height: 1;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  pointer-events: none;
`;

const CheckboxBox = styled.div`
  position: relative;
  width: ${props => {
    switch (props.size) {
      case CHECKBOX_SIZES.SMALL: return '14px';
      case CHECKBOX_SIZES.LARGE: return '18px';
      default: return '16px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case CHECKBOX_SIZES.SMALL: return '14px';
      case CHECKBOX_SIZES.LARGE: return '18px';
      default: return '16px';
    }
  }};
  border: 1.5px solid ${props => props.colors.border};
  border-radius: 3px;
  background-color: ${props => props.colors.background};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;

const FocusRing = styled.div`
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 3px solid ${props => props.theme === CHECKBOX_THEMES.DARK ? '#93C5FD' : '#1D4ED8'};
  border-radius: 6px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s ease;
  pointer-events: none;
`;

const CheckmarkIcon = styled.svg`
  width: ${props => {
    switch (props.size) {
      case CHECKBOX_SIZES.SMALL: return '8px';
      case CHECKBOX_SIZES.LARGE: return '12px';
      default: return '10px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case CHECKBOX_SIZES.SMALL: return '8px';
      case CHECKBOX_SIZES.LARGE: return '12px';
      default: return '10px';
    }
  }};
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const IndeterminateIcon = styled.div`
  width: ${props => {
    switch (props.size) {
      case CHECKBOX_SIZES.SMALL: return '6px';
      case CHECKBOX_SIZES.LARGE: return '10px';
      default: return '8px';
    }
  }};
  height: 2px;
  background-color: ${props => props.color};
  border-radius: 1px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const Label = styled.label`
  font-size: ${props => {
    switch (props.size) {
      case CHECKBOX_SIZES.SMALL: return '12px';
      case CHECKBOX_SIZES.LARGE: return '16px';
      default: return '14px';
    }
  }};
  font-weight: 600;
  color: ${props => props.colors.label};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  line-height: 1;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
  margin-top: 3px;
`;

// Untyped JS component: without this, TypeScript infers forwardRef props as `{}`,
// so .tsx callers cannot pass any prop.
/** @type {import("react").ForwardRefExoticComponent<Record<string, any> & import("react").RefAttributes<any>>} */
const Checkbox = forwardRef(({
  checked = false,
  indeterminate = false,
  disabled = false,
  label = 'Label',
  theme = CHECKBOX_THEMES.LIGHT,
  size = CHECKBOX_SIZES.MEDIUM,
  onChange,
  onFocus,
  onBlur,
  id,
  name,
  value,
  className,
  style,
  'aria-describedby': ariaDescribedby,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [internalChecked, setInternalChecked] = useState(checked);
  const [showFocusRing, setShowFocusRing] = useState(false);

  // Handle controlled vs uncontrolled state
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  // Determine the visual state
  const getVisualState = () => {
    if (indeterminate) return CHECKBOX_STATES.INDETERMINATE;
    if (currentChecked) return CHECKBOX_STATES.CHECKED;
    return CHECKBOX_STATES.UNCHECKED;
  };

  const visualState = getVisualState();
  const colors = getCheckboxColors(visualState, theme, disabled, isFocused, isHovered, isPressed);

  useEffect(() => {
    if (!isControlled) {
      setInternalChecked(checked);
    }
  }, [checked, isControlled]);

  const handleChange = (event) => {
    if (disabled) return;

    const newChecked = event.target.checked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    if (onChange) {
      onChange(event);
    }
  };

  const handleFocus = (event) => {
    setIsFocused(true);
    // Show focus ring for keyboard navigation
    setShowFocusRing(true);
    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    setShowFocusRing(false);
    if (onBlur) {
      onBlur(event);
    }
  };

  const handleContainerClick = (event) => {
    if (disabled) return;
    
    // Prevent double-triggering if clicking on the label
    if (event.target.tagName === 'LABEL') return;
    
    // Create a synthetic event to trigger the hidden input
    const syntheticEvent = {
      target: {
        checked: !currentChecked,
        type: 'checkbox'
      }
    };
    
    handleChange(syntheticEvent);
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      
      // Create a synthetic event to trigger the change
      const syntheticEvent = {
        target: {
          checked: !currentChecked,
          type: 'checkbox'
        }
      };
      
      handleChange(syntheticEvent);
    }
  };

  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <CheckboxContainer
      disabled={disabled}
      className={className}
      style={style}
      onClick={handleContainerClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <HiddenInput
        ref={ref}
        type="checkbox"
        id={checkboxId}
        name={name}
        value={value}
        checked={currentChecked}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="checkbox"
        aria-checked={currentChecked}
        aria-describedby={ariaDescribedby}
        {...props}
      />
      <CheckboxBox
        colors={colors}
        disabled={disabled}
        theme={theme}
        size={size}
      >
        <FocusRing 
          visible={showFocusRing} 
          theme={theme}
        />
        {visualState === CHECKBOX_STATES.CHECKED && (
          <CheckmarkIcon 
            visible={true} 
            color={colors.icon}
            size={size}
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" stroke={colors.icon} strokeWidth="3" fill="none" />
          </CheckmarkIcon>
        )}
        {visualState === CHECKBOX_STATES.INDETERMINATE && (
          <IndeterminateIcon 
            visible={true} 
            color={colors.icon}
            size={size}
          />
        )}
      </CheckboxBox>
      <Label 
        htmlFor={checkboxId} 
        disabled={disabled}
        colors={colors}
        size={size}
      >
        {label}
      </Label>
    </CheckboxContainer>
  );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.oneOf(Object.values(CHECKBOX_THEMES)),
  size: PropTypes.oneOf(Object.values(CHECKBOX_SIZES)),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  'aria-describedby': PropTypes.string
};

export default Checkbox;
export { CHECKBOX_STATES, CHECKBOX_THEMES, CHECKBOX_SIZES }; 