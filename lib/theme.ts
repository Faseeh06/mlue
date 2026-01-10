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
