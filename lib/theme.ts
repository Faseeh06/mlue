import { themeStorage, type ThemeColor } from './storage';

// Theme color definitions
const THEME_COLORS = {
  purple: {
    iris: '262 69% 42%', // #5b21b6 in HSL
    irisHex: '#5b21b6',
    irisRgb: '91, 33, 182', // rgba values for gradients
    lilacRgb: '216, 180, 254', // lighter purple for gradients
    lilacHex: '#d8b4fe',
  },
  orange: {
    iris: '13 97% 71%', // #FD8A6B in HSL (rgb(253, 138, 107))
    irisHex: '#FD8A6B',
    irisRgb: '253, 138, 107', // rgba values for gradients
    lilacRgb: '253, 175, 150', // lighter orange for gradients
    lilacHex: '#FDAF96',
  },
  blue: {
    iris: '217 91% 60%', // #3b82f6 in HSL (rgb(59, 130, 246))
    irisHex: '#3b82f6',
    irisRgb: '59, 130, 246', // rgba values for gradients
    lilacRgb: '147, 197, 253', // lighter blue for gradients
    lilacHex: '#93c5fd',
  },
  green: {
    iris: '142 76% 36%', // #10b981 in HSL (rgb(16, 185, 129))
    irisHex: '#10b981',
    irisRgb: '16, 185, 129', // rgba values for gradients
    lilacRgb: '134, 239, 172', // lighter green for gradients
    lilacHex: '#86efac',
  },
  teal: {
    iris: '173 80% 40%', // #14b8a6 in HSL (rgb(20, 184, 166))
    irisHex: '#14b8a6',
    irisRgb: '20, 184, 166', // rgba values for gradients
    lilacRgb: '94, 234, 212', // lighter teal for gradients
    lilacHex: '#5eead4',
  },
  pink: {
    iris: '330 81% 60%', // #ec4899 in HSL (rgb(236, 72, 153))
    irisHex: '#ec4899',
    irisRgb: '236, 72, 153', // rgba values for gradients
    lilacRgb: '244, 114, 182', // lighter pink for gradients
    lilacHex: '#f472b6',
  },
  indigo: {
    iris: '239 84% 67%', // #6366f1 in HSL (rgb(99, 102, 241))
    irisHex: '#6366f1',
    irisRgb: '99, 102, 241', // rgba values for gradients
    lilacRgb: '165, 180, 252', // lighter indigo for gradients
    lilacHex: '#a5b4fc',
  },
  red: {
    iris: '0 84% 60%', // #ef4444 in HSL (rgb(239, 68, 68))
    irisHex: '#ef4444',
    irisRgb: '239, 68, 68', // rgba values for gradients
    lilacRgb: '248, 113, 113', // lighter red for gradients
    lilacHex: '#f87171',
  },
  cyan: {
    iris: '188 94% 43%', // #06b6d4 in HSL (rgb(6, 182, 212))
    irisHex: '#06b6d4',
    irisRgb: '6, 182, 212', // rgba values for gradients
    lilacRgb: '103, 232, 249', // lighter cyan for gradients
    lilacHex: '#67e8f9',
  },
};

/**
 * Apply theme color to the document
 */
export function applyTheme(theme: ThemeColor = 'purple'): void {
  if (typeof document === 'undefined') return;
  
  const colors = THEME_COLORS[theme];
  
  // Update CSS variable for iris color
  document.documentElement.style.setProperty('--iris', colors.iris);
  
  // Update primary color (which uses iris)
  document.documentElement.style.setProperty('--primary', colors.iris);
  document.documentElement.style.setProperty('--ring', colors.iris);
  document.documentElement.style.setProperty('--sidebar-primary', colors.iris);
  document.documentElement.style.setProperty('--sidebar-ring', colors.iris);
  
  // Update CSS variables for gradient colors
  document.documentElement.style.setProperty('--iris-rgb', colors.irisRgb);
  document.documentElement.style.setProperty('--lilac-rgb', colors.lilacRgb);
  document.documentElement.style.setProperty('--iris-hex', colors.irisHex);
  document.documentElement.style.setProperty('--lilac-hex', colors.lilacHex);
  
  // Store theme preference
  themeStorage.set(theme);
  
  // Dispatch custom event for components to listen
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('themeChanged'));
  }
}

/**
 * Initialize theme on app load
 */
export function initializeTheme(): void {
  const theme = themeStorage.get();
  applyTheme(theme);
}

/**
 * Get current theme
 */
export function getCurrentTheme(): ThemeColor {
  return themeStorage.get();
}

/**
 * Get theme color values
 */
export function getThemeColors(theme?: ThemeColor) {
  const currentTheme = theme || getCurrentTheme();
  return THEME_COLORS[currentTheme];
}

/**
 * Get gradient colors for backgrounds
 */
export function getGradientColors(theme?: ThemeColor) {
  const colors = getThemeColors(theme);
  return {
    irisRgb: colors.irisRgb,
    lilacRgb: colors.lilacRgb,
  };
}
