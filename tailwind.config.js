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
        'xs': ['0.75rem', { lineHeight: '1.125rem' }],       // 12px (reduced by 1px from 13px)
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],       // 14px (reduced by 1px from 15px)
        'base': ['1rem', { lineHeight: '1.5rem' }],          // 16px (reduced by 1px from 17px)
        'lg': ['1.125rem', { lineHeight: '1.625rem' }],      // 18px (reduced by 1px from 19px)
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],        // 20px (reduced by 1px from 21px)
        '2xl': ['1.5rem', { lineHeight: '2rem' }],           // 24px (reduced by 1px from 25px)
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],      // 30px (reduced by 1px from 31px)
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],        // 36px (reduced by 1px from 37px)
        '5xl': ['3rem', { lineHeight: '1' }],                // 48px (reduced by 1px from 49px)
        '6xl': ['3.75rem', { lineHeight: '1' }],             // 60px (reduced by 1px from 61px)
        '7xl': ['4.5rem', { lineHeight: '1' }],              // 72px (reduced by 1px from 73px)
        '8xl': ['6rem', { lineHeight: '1' }],                // 96px (reduced by 1px from 97px)
        '9xl': ['8rem', { lineHeight: '1' }],                // 128px (reduced by 1px from 129px)
      },
    },
  },
}
