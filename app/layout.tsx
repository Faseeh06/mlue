import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Mlue',
  description: 'A modern Progressive Web App for managing your personal finances, budgets, and expenses',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['finance', 'budget', 'expenses', 'money management', 'PWA'],
  authors: [{ name: 'Mlue' }],
  creator: 'Mlue',
  publisher: 'Mlue',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/images/Rounded_logo.png',
    shortcut: '/images/Rounded_logo.png',
    apple: '/images/Rounded_logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mlue',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
  --font-serif: ${instrumentSerif.variable};
}
        `}</style>
        <link rel="icon" type="image/png" href="/images/Rounded_logo.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/images/Rounded_logo.png" sizes="16x16" />
        <link rel="shortcut icon" type="image/png" href="/images/Rounded_logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Apply saved theme color and color mode immediately (before React hydration)
                  // This prevents flash of unstyled content (FOUC)
                  const themeKey = 'mlue-finance-theme';
                  const colorModeKey = 'mlue-finance-color-mode';
                  
                  // Get saved values from localStorage
                  let savedTheme = null;
                  let savedColorMode = null;
                  
                  try {
                    const themeValue = localStorage.getItem(themeKey);
                    if (themeValue) {
                      savedTheme = JSON.parse(themeValue);
                    }
                  } catch (e) {
                    console.warn('Could not parse saved theme:', e);
                  }
                  
                  try {
                    const colorModeValue = localStorage.getItem(colorModeKey);
                    if (colorModeValue) {
                      savedColorMode = JSON.parse(colorModeValue);
                    }
                  } catch (e) {
                    console.warn('Could not parse saved color mode:', e);
                  }
                  
                  // Apply saved theme color
                  if (savedTheme) {
                    const themeColors = {
                      purple: { iris: '262 69% 42%', irisRgb: '91, 33, 182', lilacRgb: '216, 180, 254', irisHex: '#5b21b6', lilacHex: '#d8b4fe' },
                      orange: { iris: '13 97% 71%', irisRgb: '253, 138, 107', lilacRgb: '253, 175, 150', irisHex: '#FD8A6B', lilacHex: '#FDAF96' },
                      blue: { iris: '217 91% 60%', irisRgb: '59, 130, 246', lilacRgb: '147, 197, 253', irisHex: '#3b82f6', lilacHex: '#93c5fd' },
                      green: { iris: '142 76% 36%', irisRgb: '16, 185, 129', lilacRgb: '134, 239, 172', irisHex: '#10b981', lilacHex: '#86efac' },
                      teal: { iris: '173 80% 40%', irisRgb: '20, 184, 166', lilacRgb: '94, 234, 212', irisHex: '#14b8a6', lilacHex: '#5eead4' },
                      pink: { iris: '330 81% 60%', irisRgb: '236, 72, 153', lilacRgb: '244, 114, 182', irisHex: '#ec4899', lilacHex: '#f472b6' },
                      indigo: { iris: '239 84% 67%', irisRgb: '99, 102, 241', lilacRgb: '165, 180, 252', irisHex: '#6366f1', lilacHex: '#a5b4fc' },
                      red: { iris: '0 84% 60%', irisRgb: '239, 68, 68', lilacRgb: '248, 113, 113', irisHex: '#ef4444', lilacHex: '#f87171' },
                      cyan: { iris: '188 94% 43%', irisRgb: '6, 182, 212', lilacRgb: '103, 232, 249', irisHex: '#06b6d4', lilacHex: '#67e8f9' }
                    };
                    
                    if (themeColors[savedTheme]) {
                      const colors = themeColors[savedTheme];
                      document.documentElement.style.setProperty('--iris', colors.iris);
                      document.documentElement.style.setProperty('--primary', colors.iris);
                      document.documentElement.style.setProperty('--ring', colors.iris);
                      document.documentElement.style.setProperty('--sidebar-primary', colors.iris);
                      document.documentElement.style.setProperty('--sidebar-ring', colors.iris);
                      document.documentElement.style.setProperty('--iris-rgb', colors.irisRgb);
                      document.documentElement.style.setProperty('--lilac-rgb', colors.lilacRgb);
                      document.documentElement.style.setProperty('--iris-hex', colors.irisHex);
                      document.documentElement.style.setProperty('--lilac-hex', colors.lilacHex);
                    }
                  }
                  
                  // Apply saved color mode (dark/light)
                  if (savedColorMode === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Error initializing theme preferences:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${instrumentSerif.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div id="app-root">
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
