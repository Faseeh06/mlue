import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Clean complementary font for body text and UI
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/png" href="/images/Rounded_logo.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/images/Rounded_logo.png" sizes="16x16" />
        <link rel="shortcut icon" type="image/png" href="/images/Rounded_logo.png" />
      </head>
      <body className="antialiased">
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
