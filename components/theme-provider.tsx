"use client";

import { useEffect } from 'react';
import { initializeTheme, applyTheme, initializeColorMode, applyColorMode } from '@/lib/theme';
import { storage, themeStorage, colorModeStorage } from '@/lib/storage';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme color on mount
    initializeTheme();
    
    // Initialize color mode (dark/light) on mount
    initializeColorMode();
    
    // Listen for theme color changes in storage
    const unsubscribe = storage.onStorageChange((key) => {
      if (key === 'mlue-finance-theme') {
        const theme = themeStorage.get();
        applyTheme(theme);
        // Dispatch custom event for components to listen
        window.dispatchEvent(new Event('themeChanged'));
      }
      
      // Listen for color mode (dark/light) changes
      if (key === 'mlue-finance-color-mode') {
        const mode = colorModeStorage.get();
        applyColorMode(mode);
        // Dispatch custom event for components to listen
        window.dispatchEvent(new Event('colorModeChanged'));
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
