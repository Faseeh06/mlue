import { fontFamily } from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Opus theme colors
        surface: "#f4f1f9",
        ink: "#0f0518",
        iris: "#5b21b6",
        lilac: "#d8b4fe",
        lime: "#d9f99d",
      },
      fontFamily: {
        'providence': ["'Providence'", 'Arial', 'Helvetica', ...fontFamily.sans],
        'inter': ["var(--font-inter)", ...fontFamily.sans],
        'body': ["'Providence'", 'Arial', 'Helvetica', ...fontFamily.sans],
        'heading': ["'Providence'", 'Arial', 'Helvetica', ...fontFamily.sans],
        sans: ["'Providence'", 'Arial', 'Helvetica', ...fontFamily.sans],
        serif: ["'Providence'", 'Arial', 'Helvetica', ...fontFamily.sans],
      },
      fontSize: {
        'xs': ['1.0625rem', { lineHeight: '1.375rem' }],     // 17px (was 12px) +5px total
        'sm': ['1.1875rem', { lineHeight: '1.625rem' }],     // 19px (was 14px) +5px total
        'base': ['1.3125rem', { lineHeight: '1.875rem' }],   // 21px (was 16px) +5px total
        'lg': ['1.4375rem', { lineHeight: '1.875rem' }],     // 23px (was 18px) +5px total
        'xl': ['1.5625rem', { lineHeight: '2.125rem' }],     // 25px (was 20px) +5px total
        '2xl': ['1.8125rem', { lineHeight: '2.375rem' }],    // 29px (was 24px) +5px total
        '3xl': ['2.1875rem', { lineHeight: '2.625rem' }],    // 35px (was 30px) +5px total
        '4xl': ['2.5625rem', { lineHeight: '2.875rem' }],    // 41px (was 36px) +5px total
        '5xl': ['3.3125rem', { lineHeight: '1' }],           // 53px (was 48px) +5px total
        '6xl': ['4.0625rem', { lineHeight: '1' }],           // 65px (was 60px) +5px total
        '7xl': ['4.8125rem', { lineHeight: '1' }],           // 77px (was 72px) +5px total
        '8xl': ['6.3125rem', { lineHeight: '1' }],           // 101px (was 96px) +5px total
        '9xl': ['8.3125rem', { lineHeight: '1' }],           // 133px (was 128px) +5px total
      },
    },
  },
}
