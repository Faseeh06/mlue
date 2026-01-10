"use client";

import { useEffect, useState } from "react";
import { getCurrentTheme, getGradientColors } from "@/lib/theme";

export function useTheme() {
  const [theme, setTheme] = useState(getCurrentTheme());
  const [gradientColors, setGradientColors] = useState(getGradientColors());
  
  useEffect(() => {
    const updateTheme = () => {
      const newTheme = getCurrentTheme();
      setTheme(newTheme);
      setGradientColors(getGradientColors(newTheme));
    };
    
    // Check theme periodically
    const interval = setInterval(updateTheme, 500);
    
    // Listen to storage changes
    const handleStorageChange = () => {
      updateTheme();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Listen to custom theme change event
    const handleThemeChange = () => {
      updateTheme();
    };
    window.addEventListener('themeChanged', handleThemeChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  return { theme, ...gradientColors };
}
