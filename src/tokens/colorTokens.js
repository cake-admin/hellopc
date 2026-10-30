/**
 * Color Token System for hello pc
 * Maps semantic color tokens to actual color values for light.a and dark.a themes
 * 
 * This system centralizes color management and makes it easy to:
 * - Switch between themes
 * - Update colors globally
 * - Integrate with Figma design tokens
 * - Maintain consistency across components
 */

import colorData from '../data/colors.json';
import cakeColorTokensData from './cake-color-tokens.json';

/**
 * Theme constants
 */
export const THEMES = {
  LIGHT_A: 'light.a',
  DARK_A: 'dark.a'
};

// Parse cake-color-tokens.json (it's stored as a JSON string)
// Webpack will parse the JSON file once, giving us a string, so we parse it once more to get the object
let cakeColorTokens;
try {
  cakeColorTokens = typeof cakeColorTokensData === 'string' 
    ? JSON.parse(cakeColorTokensData)
    : cakeColorTokensData;
} catch (error) {
  console.error('Failed to parse cake-color-tokens.json:', error);
  cakeColorTokens = {};
}

/**
 * Safely get a token value from cakeColorTokens with fallback
 * @param {string} tokenName - Name of the token (e.g., 'surfaceIconButtonSecondaryPress')
 * @param {string} theme - Theme key ('lightA' or 'darkA')
 * @param {string} fallback - Fallback color value
 * @returns {string} Color value or fallback
 */
const getTokenValue = (tokenName, theme, fallback = null) => {
  if (!cakeColorTokens || typeof cakeColorTokens !== 'object') {
    console.warn(`cakeColorTokens is not available. Token: ${tokenName}`);
    return fallback;
  }
  
  const token = cakeColorTokens[tokenName];
  if (!token || typeof token !== 'object') {
    console.warn(`Token '${tokenName}' not found in cake-color-tokens.json`);
    return fallback;
  }
  
  const value = token[theme];
  if (!value) {
    console.warn(`Theme '${theme}' not found for token '${tokenName}'`);
    return fallback;
  }
  
  return value;
};

/**
 * Color token mappings organized by semantic category
 * Each token maps to light.a and dark.a theme values
 */
const colorTokens = {
  // Background colors
  background: {
    // Maps to: surfaceCanvas (from cake-color-tokens.json)
    canvas: {
      [THEMES.LIGHT_A]: cakeColorTokens.surfaceCanvas.lightA,
      [THEMES.DARK_A]: cakeColorTokens.surfaceCanvas.darkA
    },
    default: {
      [THEMES.LIGHT_A]: '#FFFFFF',  // white
      [THEMES.DARK_A]: '#27272A'    // zinc-800
    },
    disabled: {
      [THEMES.LIGHT_A]: '#F1F5F9',  // slate-100
      [THEMES.DARK_A]: '#1F2937'    // gray-800
    },
    error: {
      [THEMES.LIGHT_A]: '#FEF2F2',  // red-50
      [THEMES.DARK_A]: '#2F0808'    // custom dark red
    },
    success: {
      [THEMES.LIGHT_A]: '#ECFDF5',  // emerald-50
      [THEMES.DARK_A]: '#064E3B'    // emerald-900
    }
  },

  // Border colors
  border: {
    default: {
      [THEMES.LIGHT_A]: '#E2E8F0',  // slate-200
      [THEMES.DARK_A]: '#4B5563'    // gray-600
    },
    hover: {
      [THEMES.LIGHT_A]: '#CBD5E1',  // slate-300
      [THEMES.DARK_A]: '#6B7280'    // gray-500
    },
    focus: {
      [THEMES.LIGHT_A]: '#3B82F6',  // blue-500
      [THEMES.DARK_A]: '#3B82F6'    // blue-500
    },
    disabled: {
      [THEMES.LIGHT_A]: '#9CA3AF',  // gray-400
      [THEMES.DARK_A]: '#374151'    // gray-700
    },
    error: {
      [THEMES.LIGHT_A]: '#DC2626',  // red-600
      [THEMES.DARK_A]: '#FCA5A5'    // red-300
    },
    success: {
      [THEMES.LIGHT_A]: '#059669',  // emerald-600
      [THEMES.DARK_A]: '#34D399'    // emerald-400
    },
    zero: {
      [THEMES.LIGHT_A]: cakeColorTokens.borderZero.lightA,
      [THEMES.DARK_A]: cakeColorTokens.borderZero.darkA
    },
    weak: {
      [THEMES.LIGHT_A]: cakeColorTokens?.borderWeak?.lightA || getTokenValue('borderWeak', 'lightA', '#E2E8F0'),
      [THEMES.DARK_A]: cakeColorTokens?.borderWeak?.darkA || getTokenValue('borderWeak', 'darkA', '#3F3F46')
    }
  },

  // Text colors (from Figma variables - mapped 1:1 from cake-color-tokens.json)
  text: {
    primary: {
      [THEMES.LIGHT_A]: getTokenValue('textPrimary', 'lightA', '#0F172A'),
      [THEMES.DARK_A]: getTokenValue('textPrimary', 'darkA', '#D4D4D8')
    },
    secondary: {
      [THEMES.LIGHT_A]: '#334155',  // slate-700
      [THEMES.DARK_A]: '#D4D4D8'    // zinc-300
    },
    tertiary: {
      [THEMES.LIGHT_A]: '#64748B',  // slate-500
      [THEMES.DARK_A]: '#A1A1AA'    // zinc-400
    },
    disabled: {
      [THEMES.LIGHT_A]: '#475569',  // slate-600
      [THEMES.DARK_A]: '#6B7280'    // gray-500
    },
    placeholder: {
      [THEMES.LIGHT_A]: '#9CA3AF',  // gray-400
      [THEMES.DARK_A]: '#9CA3AF'    // gray-400
    },
    error: {
      [THEMES.LIGHT_A]: '#DC2626',  // red-600
      [THEMES.DARK_A]: '#FCA5A5'    // red-300
    },
    success: {
      [THEMES.LIGHT_A]: '#047857',  // emerald-700
      [THEMES.DARK_A]: '#34D399'    // emerald-400
    },
    metadata: {
      [THEMES.LIGHT_A]: '#334155',  // slate-700
      [THEMES.DARK_A]: '#A1A1AA'    // zinc-400
    }
  },

  // Button colors
  button: {
    primary: {
      background: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#93C5FD'    // blue-300
      },
      backgroundHover: {
        [THEMES.LIGHT_A]: '#1E3A8A',  // blue-900
        [THEMES.DARK_A]: '#60A5FA'    // blue-400
      },
      backgroundPressed: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#93C5FD'    // blue-300
      },
      text: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#18181B'    // zinc-900
      }
    },
    secondary: {
      background: {
        [THEMES.LIGHT_A]: '#E2E8F0',  // slate-200
        [THEMES.DARK_A]: '#CBD5E1'    // slate-300
      },
      backgroundHover: {
        [THEMES.LIGHT_A]: '#CBD5E1',  // slate-300
        [THEMES.DARK_A]: '#94A3B8'    // slate-400
      },
      backgroundPressed: {
        [THEMES.LIGHT_A]: '#E2E8F0',  // slate-200
        [THEMES.DARK_A]: '#CBD5E1'    // slate-300
      },
      text: {
        [THEMES.LIGHT_A]: '#1E293B',  // slate-800
        [THEMES.DARK_A]: '#18181B'    // zinc-900
      }
    },
    danger: {
      background: {
        [THEMES.LIGHT_A]: '#B91C1C',  // red-700
        [THEMES.DARK_A]: '#FCA5A5'    // red-300
      },
      backgroundHover: {
        [THEMES.LIGHT_A]: '#7F1D1D',  // red-900
        [THEMES.DARK_A]: '#EF4444'    // red-500
      },
      backgroundPressed: {
        [THEMES.LIGHT_A]: '#B91C1C',  // red-700
        [THEMES.DARK_A]: '#FCA5A5'    // red-300
      },
      text: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#18181B'    // zinc-900
      }
    },
    text: {
      primary: {
        text: {
          [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
          [THEMES.DARK_A]: '#93C5FD'    // blue-300
        },
        backgroundHover: {
          [THEMES.LIGHT_A]: '#DBEAFE',  // blue-100
          [THEMES.DARK_A]: 'rgba(59, 130, 246, 0.45)'  // blue-500 45% opacity
        },
        backgroundPressed: {
          [THEMES.LIGHT_A]: '#BFDBFE',  // blue-200
          [THEMES.DARK_A]: 'rgba(59, 130, 246, 0.35)'  // blue-500 35% opacity
        }
      },
      secondary: {
        text: {
          [THEMES.LIGHT_A]: '#334155',  // slate-700
          [THEMES.DARK_A]: '#E2E8F0'    // slate-200
        },
        backgroundHover: {
          [THEMES.LIGHT_A]: '#E2E8F0',  // slate-200
          [THEMES.DARK_A]: 'rgba(100, 116, 139, 0.25)'  // slate-500 25% opacity
        },
        backgroundPressed: {
          [THEMES.LIGHT_A]: '#CBD5E1',  // slate-300
          [THEMES.DARK_A]: 'rgba(100, 116, 139, 0.35)'  // slate-500 35% opacity
        }
      }
    },
    icon: {
      primary: {
        icon: {
          [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
          [THEMES.DARK_A]: '#93C5FD'    // blue-300
        },
        iconHover: {
          [THEMES.LIGHT_A]: '#1E40AF',  // blue-800
          [THEMES.DARK_A]: '#93C5FD'    // blue-300
        },
        iconPressed: {
          [THEMES.LIGHT_A]: '#1E3A8A',  // blue-900
          [THEMES.DARK_A]: '#93C5FD'    // blue-300
        },
        backgroundHover: {
          [THEMES.LIGHT_A]: '#DBEAFE',  // blue-100
          [THEMES.DARK_A]: 'rgba(59, 130, 246, 0.45)'  // blue-500 45% opacity
        },
        backgroundPressed: {
          [THEMES.LIGHT_A]: '#BFDBFE',  // blue-200
          [THEMES.DARK_A]: 'rgba(59, 130, 246, 0.35)'  // blue-500 35% opacity
        }
      },
      secondary: {
        icon: {
          [THEMES.LIGHT_A]: '#1E293B',  // slate-800
          [THEMES.DARK_A]: '#E2E8F0'    // slate-200
        },
        iconHover: {
          [THEMES.LIGHT_A]: '#0F172A',  // slate-900
          [THEMES.DARK_A]: '#E2E8F0'    // slate-200
        },
        iconPressed: {
          [THEMES.LIGHT_A]: '#0F172A',  // slate-900
          [THEMES.DARK_A]: '#E2E8F0'    // slate-200
        },
        backgroundHover: {
          [THEMES.LIGHT_A]: '#E2E8F0',  // slate-200
          [THEMES.DARK_A]: 'rgba(100, 116, 139, 0.25)'  // slate-500 25% opacity
        },
        backgroundPressed: {
          [THEMES.LIGHT_A]: '#CBD5E1',  // slate-300
          [THEMES.DARK_A]: 'rgba(100, 116, 139, 0.35)'  // slate-500 35% opacity
        }
      }
    },
    text: {
      primary: {
        textHover: {
          [THEMES.LIGHT_A]: '#1E3A8A',  // blue-900
          [THEMES.DARK_A]: '#93C5FD'    // blue-300
        },
        textPressed: {
          [THEMES.LIGHT_A]: '#1E3A8A',  // blue-900
          [THEMES.DARK_A]: '#93C5FD'    // blue-300
        }
      },
      secondary: {
        textHover: {
          [THEMES.LIGHT_A]: '#1E293B',  // slate-800
          [THEMES.DARK_A]: '#E2E8F0'    // slate-200
        },
        textPressed: {
          [THEMES.LIGHT_A]: '#0F172A',  // slate-900
          [THEMES.DARK_A]: '#E2E8F0'    // slate-200
        }
      }
    },
    disabled: {
      background: {
        [THEMES.LIGHT_A]: 'rgba(203, 213, 225, 0.5)',  // slate-300 50% opacity
        [THEMES.DARK_A]: 'rgba(100, 116, 139, 0.2)'    // slate-500 20% opacity
      },
      text: {
        [THEMES.LIGHT_A]: '#475569',  // slate-600
        [THEMES.DARK_A]: '#9CA3AF'    // gray-400
      },
      icon: {
        [THEMES.LIGHT_A]: '#475569',  // slate-600
        [THEMES.DARK_A]: '#9CA3AF'    // gray-400
      }
    },
    focus: {
      ring: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#93C5FD'    // blue-300
      },
      ringInner: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#18181B'    // zinc-900
      }
    }
  },

  // Alert colors
  alert: {
    success: {
      background: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#27272A'    // zinc-800
      },
      border: {
        [THEMES.LIGHT_A]: '#047857',  // emerald-700
        [THEMES.DARK_A]: '#34D399'    // emerald-400
      },
      icon: {
        [THEMES.LIGHT_A]: '#047857',  // emerald-700
        [THEMES.DARK_A]: '#34D399'    // emerald-400
      },
      text: {
        [THEMES.LIGHT_A]: '#0F172A',  // slate-900
        [THEMES.DARK_A]: '#D4D4D8'    // zinc-300
      }
    },
    warning: {
      background: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#27272A'    // zinc-800
      },
      border: {
        [THEMES.LIGHT_A]: '#C2410C',  // orange-700
        [THEMES.DARK_A]: '#FDBA74'    // orange-300
      },
      icon: {
        [THEMES.LIGHT_A]: '#C2410C',  // orange-700
        [THEMES.DARK_A]: '#FDBA74'    // orange-300
      },
      text: {
        [THEMES.LIGHT_A]: '#0F172A',  // slate-900
        [THEMES.DARK_A]: '#D4D4D8'    // zinc-300
      }
    },
    error: {
      background: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#27272A'    // zinc-800
      },
      border: {
        [THEMES.LIGHT_A]: '#B91C1C',  // red-700
        [THEMES.DARK_A]: '#FCA5A5'    // red-300
      },
      icon: {
        [THEMES.LIGHT_A]: '#B91C1C',  // red-700
        [THEMES.DARK_A]: '#FCA5A5'    // red-300
      },
      text: {
        [THEMES.LIGHT_A]: '#0F172A',  // slate-900
        [THEMES.DARK_A]: '#D4D4D8'    // zinc-300
      }
    },
    info: {
      background: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#27272A'    // zinc-800
      },
      border: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#60A5FA'    // blue-400
      },
      icon: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#60A5FA'    // blue-400
      },
      text: {
        [THEMES.LIGHT_A]: '#0F172A',  // slate-900
        [THEMES.DARK_A]: '#D4D4D8'    // zinc-300
      }
    }
  },

  // Badge colors
  badge: {
    blue: {
      background: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#60A5FA'    // blue-400
      },
      text: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#0F172A'    // slate-900
      }
    },
    red: {
      background: {
        [THEMES.LIGHT_A]: '#B91C1C',  // red-700
        [THEMES.DARK_A]: '#FB7185'    // rose-400
      },
      text: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#0F172A'    // slate-900
      }
    }
  },

  // Checkbox colors
  checkbox: {
    border: {
      default: {
        [THEMES.LIGHT_A]: '#64748B',  // slate-500
        [THEMES.DARK_A]: '#71717A'    // zinc-500
      },
      hover: {
        [THEMES.LIGHT_A]: '#0F172A',  // slate-900
        [THEMES.DARK_A]: '#D4D4D8'    // zinc-300
      },
      checked: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#52525B'    // zinc-600
      },
      disabled: {
        [THEMES.LIGHT_A]: '#9CA3AF',  // gray-400
        [THEMES.DARK_A]: '#9CA3AF'    // gray-400
      }
    },
    background: {
      checked: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#93C5FD'    // blue-300
      },
      disabled: {
        [THEMES.LIGHT_A]: '#F3F4F6',  // gray-100
        [THEMES.DARK_A]: '#27272A'    // zinc-800
      }
    },
    icon: {
      checked: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#18181B'    // zinc-900
      },
      disabled: {
        [THEMES.LIGHT_A]: '#9CA3AF',  // gray-400
        [THEMES.DARK_A]: '#9CA3AF'    // gray-400
      }
    },
    label: {
      default: {
        [THEMES.LIGHT_A]: '#0F172A',  // slate-900
        [THEMES.DARK_A]: '#D4D4D8'    // zinc-300
      },
      disabled: {
        [THEMES.LIGHT_A]: '#9CA3AF',  // gray-400
        [THEMES.DARK_A]: '#9CA3AF'    // gray-400
      }
    }
  },

  // Radio colors
  radio: {
    border: {
      default: {
        [THEMES.LIGHT_A]: '#64748B',  // slate-500
        [THEMES.DARK_A]: '#71717A'    // zinc-500
      },
      hover: {
        [THEMES.LIGHT_A]: '#0F172A',  // slate-900
        [THEMES.DARK_A]: '#D4D4D8'    // zinc-300
      },
      selected: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#93C5FD'    // blue-300
      },
      disabled: {
        [THEMES.LIGHT_A]: '#9CA3AF',  // gray-400
        [THEMES.DARK_A]: '#9CA3AF'    // gray-400
      }
    },
    dot: {
      selected: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // blue-700
        [THEMES.DARK_A]: '#93C5FD'    // blue-300
      },
      disabled: {
        [THEMES.LIGHT_A]: 'transparent',
        [THEMES.DARK_A]: '#9CA3AF'    // gray-400
      }
    },
    label: {
      default: {
        [THEMES.LIGHT_A]: '#0F172A',  // slate-900
        [THEMES.DARK_A]: '#D4D4D8'    // zinc-300
      },
      disabled: {
        [THEMES.LIGHT_A]: '#9CA3AF',  // gray-400
        [THEMES.DARK_A]: '#9CA3AF'    // gray-400
      }
    }
  },

  // Chip colors
  chip: {
    info: {
      background: {
        [THEMES.LIGHT_A]: '#EFF6FF',  // blue-50
        [THEMES.DARK_A]: '#93C5FD'    // blue-300
      },
      text: {
        [THEMES.LIGHT_A]: '#1E3A8A',  // blue-900
        [THEMES.DARK_A]: '#0F172A'    // slate-900
      }
    },
    success: {
      background: {
        [THEMES.LIGHT_A]: '#ECFDF5',  // emerald-50
        [THEMES.DARK_A]: '#34D399'    // emerald-400
      },
      text: {
        [THEMES.LIGHT_A]: '#047857',  // emerald-700
        [THEMES.DARK_A]: '#064E3B'    // emerald-900
      }
    },
    warning: {
      background: {
        [THEMES.LIGHT_A]: '#FFF7ED',  // orange-50
        [THEMES.DARK_A]: '#FDBA74'    // orange-300
      },
      text: {
        [THEMES.LIGHT_A]: '#C2410C',  // orange-700
        [THEMES.DARK_A]: '#7C2D12'    // orange-900
      }
    },
    error: {
      background: {
        [THEMES.LIGHT_A]: '#FEF2F2',  // red-50
        [THEMES.DARK_A]: '#FCA5A5'    // red-300
      },
      text: {
        [THEMES.LIGHT_A]: '#B91C1C',  // red-700
        [THEMES.DARK_A]: '#7F1D1D'    // red-900
      }
    }
  },

  // Reference colors (top-level)
  reference: {
    primary: {
      [THEMES.LIGHT_A]: cakeColorTokens.referencePrimary.lightA,
      [THEMES.DARK_A]: cakeColorTokens.referencePrimary.darkA
    },
    surfaceDisabled: {
      [THEMES.LIGHT_A]: '#F1F5F9',  // --reference/surface-disabled (slate-100)
      [THEMES.DARK_A]: '#1F2937'    // gray-800
    },
    errorWeak: {
      [THEMES.LIGHT_A]: '#FEF2F2',  // --reference/error-weak (red-50)
      [THEMES.DARK_A]: '#2F0808'    // custom dark red
    },
    infoWeak: {
      [THEMES.LIGHT_A]: cakeColorTokens.referenceInfoWeak.lightA,
      [THEMES.DARK_A]: cakeColorTokens.referenceInfoWeak.darkA
    },
    secondaryWeak: {
      [THEMES.LIGHT_A]: cakeColorTokens.referenceSecondaryWeak.lightA,
      [THEMES.DARK_A]: cakeColorTokens.referenceSecondaryWeak.darkA
    },
    focus: {
      [THEMES.LIGHT_A]: cakeColorTokens.referenceFocus.lightA,
      [THEMES.DARK_A]: cakeColorTokens.referenceFocus.darkA
    },
    helper: {
      [THEMES.LIGHT_A]: cakeColorTokens.referenceHelper.lightA,
      [THEMES.DARK_A]: cakeColorTokens.referenceHelper.darkA
    }
  },

  // Surface colors (top-level)
  surface: {
    card: {
      [THEMES.LIGHT_A]: cakeColorTokens?.surfaceCard?.lightA || '#FFFFFF',  // --surface/card
      [THEMES.DARK_A]: cakeColorTokens?.surfaceCard?.darkA || '#27272A'    // zinc-800
    },
    itemSelectedOnCanvas: {
      [THEMES.LIGHT_A]: cakeColorTokens.surfaceItemSelectedOnCanvas.lightA,
      [THEMES.DARK_A]: cakeColorTokens.surfaceItemSelectedOnCanvas.darkA
    },
    itemSelectedHover: {
      [THEMES.LIGHT_A]: cakeColorTokens.surfaceItemSelectedHover.lightA,
      [THEMES.DARK_A]: cakeColorTokens.surfaceItemSelectedHover.darkA
    },
    itemHover: {
      [THEMES.LIGHT_A]: cakeColorTokens.surfaceItemHover.lightA,
      [THEMES.DARK_A]: cakeColorTokens.surfaceItemHover.darkA
    },
    itemSelected: {
      [THEMES.LIGHT_A]: cakeColorTokens.surfaceItemSelected.lightA,
      [THEMES.DARK_A]: cakeColorTokens.surfaceItemSelected.darkA
    },
    iconButtonSecondaryHover: {
      [THEMES.LIGHT_A]: cakeColorTokens?.surfaceIconButtonSecondaryHover?.lightA || getTokenValue('surfaceIconButtonSecondaryHover', 'lightA', '#E2E8F0'),
      [THEMES.DARK_A]: cakeColorTokens?.surfaceIconButtonSecondaryHover?.darkA || getTokenValue('surfaceIconButtonSecondaryHover', 'darkA', '#E2E8F0')
    },
    iconButtonSecondaryPress: {
      [THEMES.LIGHT_A]: cakeColorTokens?.surfaceIconButtonSecondaryPress?.lightA || getTokenValue('surfaceIconButtonSecondaryPress', 'lightA', '#CBD5E1'),
      [THEMES.DARK_A]: cakeColorTokens?.surfaceIconButtonSecondaryPress?.darkA || getTokenValue('surfaceIconButtonSecondaryPress', 'darkA', '#F8FAFC')
    },
    disabled: {
      [THEMES.LIGHT_A]: cakeColorTokens.surfaceDisabled.lightA,
      [THEMES.DARK_A]: cakeColorTokens.surfaceDisabled.darkA
    }
  },

  // Icon colors (top-level)
  icon: {
    // Maps to: iconDisabled (from cake-color-tokens.json)
    disabled: {
      [THEMES.LIGHT_A]: cakeColorTokens.iconDisabled?.lightA || '#64748B',
      [THEMES.DARK_A]: cakeColorTokens.iconDisabled?.darkA || '#9CA3AF'
    },
    primary: {
      [THEMES.LIGHT_A]: cakeColorTokens?.iconPrimary?.lightA || getTokenValue('iconPrimary', 'lightA', '#0F172A'),
      [THEMES.DARK_A]: cakeColorTokens?.iconPrimary?.darkA || getTokenValue('iconPrimary', 'darkA', '#A1A1AA')
    },
    iconButtonSecondary: {
      [THEMES.LIGHT_A]: cakeColorTokens?.iconIconButtonSecondary?.lightA || getTokenValue('iconIconButtonSecondary', 'lightA', '#1E293B'),
      [THEMES.DARK_A]: cakeColorTokens?.iconIconButtonSecondary?.darkA || getTokenValue('iconIconButtonSecondary', 'darkA', '#E2E8F0')
    },
    iconButtonSecondaryHover: {
      [THEMES.LIGHT_A]: cakeColorTokens?.iconIconButtonSecondaryHover?.lightA || getTokenValue('iconIconButtonSecondaryHover', 'lightA', '#0F172A'),
      [THEMES.DARK_A]: cakeColorTokens?.iconIconButtonSecondaryHover?.darkA || getTokenValue('iconIconButtonSecondaryHover', 'darkA', '#E2E8F0')
    },
    iconButtonSecondaryPressed: {
      [THEMES.LIGHT_A]: cakeColorTokens?.iconIconButtonSecondaryPressed?.lightA || getTokenValue('iconIconButtonSecondaryPressed', 'lightA', '#0F172A'),
      [THEMES.DARK_A]: cakeColorTokens?.iconIconButtonSecondaryPressed?.darkA || getTokenValue('iconIconButtonSecondaryPressed', 'darkA', '#E2E8F0')
    }
  },

  // TextField colors (from Figma variables - mapped 1:1 from cake-color-tokens.json)
  textField: {
    surface: {
      input: {
        [THEMES.LIGHT_A]: getTokenValue('surfaceInput', 'lightA', '#F8FAFC'),
        [THEMES.DARK_A]: getTokenValue('surfaceInput', 'darkA', '#F8FAFC')
      },
      inputOnCanvas: {
        [THEMES.LIGHT_A]: getTokenValue('surfaceInputOnCanvas', 'lightA', '#F1F5F9'),
        [THEMES.DARK_A]: getTokenValue('surfaceInputOnCanvas', 'darkA', '#27272A')
      },
      inputHover: {
        [THEMES.LIGHT_A]: getTokenValue('surfaceInputHover', 'lightA', '#FFFFFF'),
        [THEMES.DARK_A]: getTokenValue('surfaceInputHover', 'darkA', '#27272A')
      },
      inputFocus: {
        [THEMES.LIGHT_A]: getTokenValue('surfaceInputFocus', 'lightA', '#FFFFFF'),
        [THEMES.DARK_A]: getTokenValue('surfaceInputFocus', 'darkA', '#27272A')
      },
      inputRest: {
        [THEMES.LIGHT_A]: getTokenValue('surfaceInputRest', 'lightA', '#FFFFFF'),
        [THEMES.DARK_A]: getTokenValue('surfaceInputRest', 'darkA', '#27272A')
      },
      disabled: {
        [THEMES.LIGHT_A]: getTokenValue('surfaceInputDisabled', 'lightA', '#F1F5F9'),
        [THEMES.DARK_A]: getTokenValue('surfaceInputDisabled', 'darkA', '#F1F5F9')
      },
      inputError: {
        [THEMES.LIGHT_A]: getTokenValue('surfaceInputError', 'lightA', '#FEF2F2'),
        [THEMES.DARK_A]: getTokenValue('surfaceInputError', 'darkA', '#FEF2F2')
      },
      errorWeak: {
        [THEMES.LIGHT_A]: getTokenValue('referenceErrorWeak', 'lightA', '#FEF2F2'),
        [THEMES.DARK_A]: getTokenValue('referenceErrorWeak', 'darkA', '#2F0808')
      },
      successWeak: {
        [THEMES.LIGHT_A]: getTokenValue('referenceSuccessWeak', 'lightA', '#ECFDF5'),
        [THEMES.DARK_A]: getTokenValue('referenceSuccessWeak', 'darkA', '#033D2D')
      }
    },
    border: {
      input: {
        [THEMES.LIGHT_A]: getTokenValue('borderInput', 'lightA', '#64748B'),
        [THEMES.DARK_A]: getTokenValue('borderInput', 'darkA', '#71717A')
      },
      focus: {
        [THEMES.LIGHT_A]: getTokenValue('borderFocus', 'lightA', '#1D4ED8'),
        [THEMES.DARK_A]: getTokenValue('borderFocus', 'darkA', '#1D4ED8')
      },
      inputError: {
        [THEMES.LIGHT_A]: getTokenValue('borderInputError', 'lightA', '#B91C1C'),
        [THEMES.DARK_A]: getTokenValue('borderInputError', 'darkA', '#B91C1C')
      },
      inputSuccess: {
        [THEMES.LIGHT_A]: getTokenValue('borderInputSuccess', 'lightA', '#047857'),
        [THEMES.DARK_A]: getTokenValue('borderInputSuccess', 'darkA', '#047857')
      },
      disabled: {
        [THEMES.LIGHT_A]: getTokenValue('borderDisabled', 'lightA', '#9CA3AF'),
        [THEMES.DARK_A]: getTokenValue('borderDisabled', 'darkA', '#9CA3AF')
      }
    },
    reference: {
      helper: {
        [THEMES.LIGHT_A]: getTokenValue('referenceHelper', 'lightA', '#475569'),
        [THEMES.DARK_A]: getTokenValue('referenceHelper', 'darkA', '#A1A1AA')
      },
      error: {
        [THEMES.LIGHT_A]: getTokenValue('referenceError', 'lightA', '#B91C1C'),
        [THEMES.DARK_A]: getTokenValue('referenceError', 'darkA', '#FCA5A5')
      },
      success: {
        [THEMES.LIGHT_A]: getTokenValue('referenceSuccess', 'lightA', '#047857'),
        [THEMES.DARK_A]: getTokenValue('referenceSuccess', 'darkA', '#34D399')
      }
    },
    text: {
      disabled: {
        [THEMES.LIGHT_A]: getTokenValue('textDisabled', 'lightA', '#475569'),
        [THEMES.DARK_A]: getTokenValue('textDisabled', 'darkA', '#9CA3AF')
      },
      disabledSurface: {
        [THEMES.LIGHT_A]: getTokenValue('surfaceDisabled', 'lightA', '#9CA3AF'),
        [THEMES.DARK_A]: getTokenValue('surfaceDisabled', 'darkA', '#71717A')
      }
    },
    surface: {
      disabled: {
        [THEMES.LIGHT_A]: getTokenValue('surfaceDisabled', 'lightA', '#9CA3AF'),
        [THEMES.DARK_A]: getTokenValue('surfaceDisabled', 'darkA', '#71717A')
      }
    }
  },

  // Zinc color tokens
  zinc: {
    800: {
      [THEMES.LIGHT_A]: '#27272A',  // zinc-800 (not typically used in light mode)
      [THEMES.DARK_A]: '#27272A'    // zinc-800
    }
  },

  // Toggle colors (from Figma variables via cake-color-tokens.json)
  // Figma variable naming: category-component-type-onSurface-state
  // Mapped to semantic paths for component usage
  toggle: {
    track: {
      // Maps to: referencePrimary (ON state, rest)
      on: {
        [THEMES.LIGHT_A]: '#1D4ED8',  // referencePrimary.lightA (blue-700)
        [THEMES.DARK_A]: '#93C5FD'     // referencePrimary.darkA (blue-300)
      },
      // Maps to: referencePrimaryStrong (ON state, hover)
      onHover: {
        [THEMES.LIGHT_A]: '#1E40AF',  // referencePrimaryStrong.lightA (blue-800)
        [THEMES.DARK_A]: '#60A5FA'     // referencePrimaryStrong.darkA (blue-400)
      },
      // Maps to: surfaceToggleSecondary (OFF state, rest)
      off: {
        [THEMES.LIGHT_A]: '#334155',   // surfaceToggleSecondary.lightA (slate-700)
        [THEMES.DARK_A]: '#CBD5E1'     // surfaceToggleSecondary.darkA (slate-300)
      },
      // Maps to: surfaceToggleSecondaryHover (OFF state, hover)
      offHover: {
        [THEMES.LIGHT_A]: '#0F172A',   // surfaceToggleSecondaryHover.lightA (slate-900)
        [THEMES.DARK_A]: '#E2E8F0'     // surfaceToggleSecondaryHover.darkA (slate-200)
      },
      // Maps to: surfaceToggleDisabled
      disabled: {
        [THEMES.LIGHT_A]: '#E5E7EB',   // surfaceToggleDisabled.lightA (gray-200)
        [THEMES.DARK_A]: '#1F2937'     // surfaceToggleDisabled.darkA (gray-800)
      }
    },
    thumb: {
      // Maps to: iconOnPrimary (ON state thumb)
      on: {
        [THEMES.LIGHT_A]: '#FFFFFF',   // iconOnPrimary.lightA (white)
        [THEMES.DARK_A]: '#18181B'     // iconOnPrimary.darkA (zinc-900)
      },
      // Maps to: iconToggleOnSecondary (OFF state thumb)
      off: {
        [THEMES.LIGHT_A]: '#F8FAFC',   // iconToggleOnSecondary.lightA (slate-50)
        [THEMES.DARK_A]: '#0F172A'     // iconToggleOnSecondary.darkA (slate-900)
      },
      // Maps to: iconDisabled
      disabled: {
        [THEMES.LIGHT_A]: '#64748B',   // iconDisabled.lightA (slate-500)
        [THEMES.DARK_A]: '#9CA3AF'     // iconDisabled.darkA (gray-400)
      },
      // Maps to: iconOnPrimary (pressed state uses same as ON)
      pressed: {
        [THEMES.LIGHT_A]: '#FFFFFF',   // iconOnPrimary.lightA (white)
        [THEMES.DARK_A]: '#18181B'     // iconOnPrimary.darkA (zinc-900)
      }
    },
    label: {
      // Maps to: textPrimary
      default: {
        [THEMES.LIGHT_A]: '#0F172A',   // textPrimary.lightA (slate-900)
        [THEMES.DARK_A]: '#D4D4D8'      // textPrimary.darkA (zinc-300)
      },
      // Maps to: textDisabled
      disabled: {
        [THEMES.LIGHT_A]: '#475569',   // textDisabled.lightA (slate-600)
        [THEMES.DARK_A]: '#9CA3AF'      // textDisabled.darkA (gray-400)
      }
    },
    focus: {
      // Maps to: borderFocus (light.a) / referenceFocus (dark.a)
      ring: {
        [THEMES.LIGHT_A]: '#1D4ED8',   // borderFocus.lightA (blue-700)
        [THEMES.DARK_A]: '#93C5FD'      // referenceFocus.darkA (blue-300) - lighter for dark theme
      },
      innerBorder: {
        [THEMES.LIGHT_A]: '#FFFFFF',   // White inner border to create white space effect
        [THEMES.DARK_A]: '#FFFFFF'      // White inner border - same for dark theme
      },
      // Maps to: referenceSecondaryStrong (creates white space between ring and track)
      background: {
        [THEMES.LIGHT_A]: '#94A3B8',   // referenceSecondaryStrong.lightA (slate-400)
        [THEMES.DARK_A]: '#A1A1AA19'    // referenceSecondaryStrong.darkA (zinc-400 with opacity)
      }
    }
  },

  // Menu colors (from Figma variables)
  menu: {
    surface: {
      item: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // --surface/item
        [THEMES.DARK_A]: '#27272A'    // zinc-800
      },
      itemHover: {
        [THEMES.LIGHT_A]: '#F3F4F6',  // gray-100
        [THEMES.DARK_A]: '#3F3F46'    // zinc-700
      },
      itemSelected: {
        [THEMES.LIGHT_A]: '#EFF6FF',  // blue-50
        [THEMES.DARK_A]: 'rgba(29, 78, 216, 0.05)'  // 1D4ED8 at 5% opacity (info-a50) from Figma
      },
      itemSelectedHover: {
        [THEMES.LIGHT_A]: '#DBEAFE',  // blue-100
        [THEMES.DARK_A]: 'rgba(29, 78, 216, 0.10)'  // 1D4ED8 at 10% opacity (info-a100) from Figma
      },
      itemFocused: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#27272A'    // zinc-800
      },
      itemDisabled: {
        [THEMES.LIGHT_A]: '#FFFFFF',  // white
        [THEMES.DARK_A]: '#27272A'    // zinc-800
      },
      search: {
        [THEMES.LIGHT_A]: '#F1F5F9',  // --surface/input-oncanvas (slate-100)
        [THEMES.DARK_A]: '#1F2937'    // gray-800
      }
    },
    border: {
      zero: {
        [THEMES.LIGHT_A]: 'rgba(255, 255, 255, 0)',  // --border/zero (transparent)
        [THEMES.DARK_A]: 'rgba(255, 255, 255, 0)'
      },
      search: {
        [THEMES.LIGHT_A]: '#64748B',  // --border/input (slate-500)
        [THEMES.DARK_A]: '#4B5563'    // gray-600
      },
      strong: {
        [THEMES.LIGHT_A]: '#64748B',  // --border/strong (slate-500)
        [THEMES.DARK_A]: '#64748B'    // slate-500
      }
    },
    text: {
      item: {
        [THEMES.LIGHT_A]: '#0F172A',  // --text/primary (slate-900)
        [THEMES.DARK_A]: '#F9FAFB'    // gray-50
      },
      itemSelected: {
        [THEMES.LIGHT_A]: '#0F172A',  // slate-900 (matches text.primary light.a)
        [THEMES.DARK_A]: '#F9FAFB'    // gray-50 (matches text.primary dark.a)
      },
      itemDisabled: {
        [THEMES.LIGHT_A]: '#9CA3AF',  // gray-400
        [THEMES.DARK_A]: '#6B7280'    // gray-500
      },
      search: {
        [THEMES.LIGHT_A]: '#475569',  // --reference/helper (slate-600)
        [THEMES.DARK_A]: '#9CA3AF'    // gray-400
      }
    }
  },

  // Tab colors (from Figma variables via cake-color-tokens.json)
  // Figma variable naming: category-component-type-onSurface-state
  // Token names follow convention: surfaceTabPrimaryRest, textTabPrimaryRest, etc.
  // Mapped to semantic paths for component usage (backward compatibility)
  tab: {
    surface: {
      // Maps to: surfaceTabPrimarySelectedRest (from cake-color-tokens.json)
      selected: {
        [THEMES.LIGHT_A]: cakeColorTokens.surfaceTabPrimarySelectedRest.lightA,
        [THEMES.DARK_A]: cakeColorTokens.surfaceTabPrimarySelectedRest.darkA
      },
      // Maps to: surfaceTabPrimaryRest (from cake-color-tokens.json)
      unselected: {
        [THEMES.LIGHT_A]: cakeColorTokens.surfaceTabPrimaryRest.lightA,
        [THEMES.DARK_A]: cakeColorTokens.surfaceTabPrimaryRest.darkA
      },
      // Maps to: surfaceTabPrimaryHover (from cake-color-tokens.json)
      hover: {
        [THEMES.LIGHT_A]: cakeColorTokens.surfaceTabPrimaryHover.lightA,
        [THEMES.DARK_A]: cakeColorTokens.surfaceTabPrimaryHover.darkA
      },
      // Maps to: surfaceTabPrimaryDisabled (from cake-color-tokens.json)
      disabled: {
        [THEMES.LIGHT_A]: cakeColorTokens.surfaceTabPrimaryDisabled.lightA,
        [THEMES.DARK_A]: cakeColorTokens.surfaceTabPrimaryDisabled.darkA
      }
    },
    text: {
      // Maps to: textTabPrimarySelectedRest (from cake-color-tokens.json)
      selected: {
        [THEMES.LIGHT_A]: cakeColorTokens.textTabPrimarySelectedRest.lightA,
        [THEMES.DARK_A]: cakeColorTokens.textTabPrimarySelectedRest.darkA
      },
      // Maps to: textTabPrimaryRest (from cake-color-tokens.json)
      unselected: {
        [THEMES.LIGHT_A]: cakeColorTokens.textTabPrimaryRest.lightA,
        [THEMES.DARK_A]: cakeColorTokens.textTabPrimaryRest.darkA
      },
      // Maps to: textTabPrimaryDisabled (from cake-color-tokens.json)
      disabled: {
        [THEMES.LIGHT_A]: cakeColorTokens.textTabPrimaryDisabled.lightA,
        [THEMES.DARK_A]: cakeColorTokens.textTabPrimaryDisabled.darkA
      }
    },
    border: {
      // Maps to: borderTabPrimarySelectedRest (from cake-color-tokens.json)
      selected: {
        [THEMES.LIGHT_A]: cakeColorTokens.borderTabPrimarySelectedRest.lightA,
        [THEMES.DARK_A]: cakeColorTokens.borderTabPrimarySelectedRest.darkA
      }
    },
    icon: {
      // Maps to: iconTabScrollRest (from cake-color-tokens.json)
      scroll: {
        [THEMES.LIGHT_A]: cakeColorTokens.iconTabScrollRest.lightA,
        [THEMES.DARK_A]: cakeColorTokens.iconTabScrollRest.darkA
      },
      // Maps to: iconTabScrollHover (from cake-color-tokens.json)
      scrollHover: {
        [THEMES.LIGHT_A]: cakeColorTokens.iconTabScrollHover.lightA,
        [THEMES.DARK_A]: cakeColorTokens.iconTabScrollHover.darkA
      },
      // Maps to: iconTabScrollDisabled (from cake-color-tokens.json)
      scrollDisabled: {
        [THEMES.LIGHT_A]: cakeColorTokens.iconTabScrollDisabled.lightA,
        [THEMES.DARK_A]: cakeColorTokens.iconTabScrollDisabled.darkA
      }
    }
  }
};

/**
 * Get a color token value for a specific theme
 * @param {string} tokenPath - Dot-separated path to the token (e.g., 'background.canvas', 'button.primary.background')
 * @param {string} theme - Theme name ('light.a' or 'dark.a')
 * @returns {string} Color value
 */
export const getTokenColor = (tokenPath, theme = THEMES.LIGHT_A) => {
  const parts = tokenPath.split('.');
  let value = colorTokens;

  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      console.warn(`[ColorTokens] Token path not found: "${tokenPath}" (failed at "${part}")`);
      if (process.env.NODE_ENV === 'development') {
        console.trace('Token lookup trace:');
      }
      return '#000000'; // Fallback color
    }
  }

  if (typeof value === 'object' && theme in value) {
    const colorValue = value[theme];
    // Check if the value is undefined or null, which might indicate missing JSON data
    if (!colorValue && colorValue !== 'transparent') {
      console.warn(`[ColorTokens] Token "${tokenPath}" has no value for theme "${theme}". This may indicate missing data in cake-color-tokens.json`);
      return '#000000'; // Fallback color
    }
    return colorValue;
  }

  console.warn(`[ColorTokens] Theme '${theme}' not found for token: "${tokenPath}". Available themes: ${typeof value === 'object' ? Object.keys(value).join(', ') : 'none'}`);
  return '#000000'; // Fallback color
};

/**
 * Get all color tokens for a specific theme
 * @param {string} theme - Theme name ('light.a' or 'dark.a')
 * @returns {object} All color tokens for the theme
 */
export const getThemeTokens = (theme = THEMES.LIGHT_A) => {
  const flatten = (obj, prefix = '') => {
    const result = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        if (theme in obj[key] && Object.keys(obj[key]).length === 2) {
          // This is a theme value object
          result[prefix ? `${prefix}.${key}` : key] = obj[key][theme];
        } else {
          // Continue traversing
          Object.assign(result, flatten(obj[key], prefix ? `${prefix}.${key}` : key));
        }
      }
    }
    return result;
  };

  return flatten(colorTokens);
};

/**
 * Check if a theme is dark
 * @param {string} theme - Theme name
 * @returns {boolean} True if theme is dark
 */
export const isDarkTheme = (theme) => {
  return theme === THEMES.DARK_A;
};

export default colorTokens;

