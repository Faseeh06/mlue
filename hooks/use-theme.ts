"use client";

import { useEffect, useState } from "react";
import { getCurrentTheme, getGradientColors, getCurrentColorMode } from "@/lib/theme";

// Helper to check if dark mode is actually applied to the DOM
function checkDarkModeFromDOM(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function useTheme() {
  const [theme, setTheme] = useState(getCurrentTheme());
  const [gradientColors, setGradientColors] = useState(getGradientColors());
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() => {
    // Check DOM first, then fallback to storage
    if (typeof document !== 'undefined') {
      return checkDarkModeFromDOM() ? 'dark' : 'light';
    }
    return getCurrentColorMode();
  });
  
  useEffect(() => {
    const updateTheme = () => {
      const newTheme = getCurrentTheme();
      setTheme(newTheme);
      setGradientColors(getGradientColors(newTheme));
    };
    
    const updateColorMode = () => {
      // Check actual DOM state instead of just storage
      const isDark = checkDarkModeFromDOM();
      setColorMode(isDark ? 'dark' : 'light');
    };
    
    // Initial check
    updateColorMode();
    
    // Check theme periodically
    const interval = setInterval(() => {
      updateTheme();
      updateColorMode();
    }, 500);
    
    // Listen to storage changes
    const handleStorageChange = () => {
      updateTheme();
      updateColorMode();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Listen to custom theme change event
    const handleThemeChange = () => {
      updateTheme();
    };
    window.addEventListener('themeChanged', handleThemeChange);
    
    // Listen to color mode change event
    const handleColorModeChange = () => {
      updateColorMode();
    };
    window.addEventListener('colorModeChanged', handleColorModeChange);
    
    // Also use MutationObserver to watch for class changes on html element
    const observer = new MutationObserver(() => {
      updateColorMode();
    });
    
    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('colorModeChanged', handleColorModeChange);
      observer.disconnect();
    };
  }, []);

  return { theme, colorMode, isDark: colorMode === 'dark', ...gradientColors };
}
