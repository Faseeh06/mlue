"use client";

import { useEffect, useState } from "react";
import { getCurrentTheme, getGradientColors } from "@/lib/theme";

interface GradientBlobProps {
  className?: string;
  style?: React.CSSProperties;
  direction?: "to-bottom" | "to-top-right" | "to-tr";
  opacity?: number;
  children?: React.ReactNode;
}

export function GradientBlob({ 
  className = "", 
  style = {},
  direction = "to-bottom",
  opacity = 0.35,
  children 
}: GradientBlobProps) {
  const [theme, setTheme] = useState(getCurrentTheme());
  
  useEffect(() => {
    const updateTheme = () => {
      setTheme(getCurrentTheme());
    };
    
    const interval = setInterval(updateTheme, 500);
    const handleStorageChange = () => {
      updateTheme();
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const { irisRgb, lilacRgb } = getGradientColors(theme);
  
  const gradientDirection = direction === "to-top-right" || direction === "to-tr" 
    ? "to top right" 
    : "to bottom";
  
  const gradientStyle = {
    ...style,
    background: `linear-gradient(${gradientDirection}, rgba(217, 249, 157, 0.2), rgba(${lilacRgb}, ${opacity === 0.3 ? 0.25 : 0.25}), rgba(${irisRgb}, ${opacity === 0.3 ? 0.2 : opacity === 0.4 ? 0.3 : 0.2}))`,
  };

  return (
    <div className={className} style={gradientStyle}>
      {children}
    </div>
  );
}

// Common gradient patterns
export const gradientPatterns = {
  hero: (irisRgb: string, lilacRgb: string) => 
    `linear-gradient(to bottom, rgba(${lilacRgb}, 0.35), rgba(${irisRgb}, 0.25), rgba(217, 249, 157, 0.2))`,
  
  standard: (irisRgb: string, lilacRgb: string) =>
    `linear-gradient(to bottom, rgba(217, 249, 157, 0.2), rgba(${lilacRgb}, 0.25), rgba(${irisRgb}, 0.2))`,
  
  topRight: (irisRgb: string, lilacRgb: string) =>
    `linear-gradient(to top right, rgba(${irisRgb}, 0.2), rgba(${lilacRgb}, 0.2), rgba(217, 249, 157, 0.15))`,
  
  topRightStrong: (irisRgb: string, lilacRgb: string) =>
    `linear-gradient(to top right, rgba(${irisRgb}, 0.3), rgba(${lilacRgb}, 0.2), rgba(217, 249, 157, 0.3))`,
  
  standardReverse: (irisRgb: string, lilacRgb: string) =>
    `linear-gradient(to bottom, rgba(${lilacRgb}, 0.25), rgba(${irisRgb}, 0.2), rgba(217, 249, 157, 0.2))`,
};
