import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
    <html lang="en">
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
      </head>
      <body className={`${instrumentSerif.variable} font-sans antialiased`}>
        <div id="app-root">
          {children}
        </div>
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
