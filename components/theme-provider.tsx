"use client";

import { useEffect } from 'react';
import { initializeTheme, applyTheme } from '@/lib/theme';
import { storage, themeStorage } from '@/lib/storage';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme on mount
    initializeTheme();
    
    // Listen for theme changes in storage
    const unsubscribe = storage.onStorageChange((key) => {
      if (key === 'mlue-finance-theme') {
        const theme = themeStorage.get();
        applyTheme(theme);
        // Dispatch custom event for components to listen
        window.dispatchEvent(new Event('themeChanged'));
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
