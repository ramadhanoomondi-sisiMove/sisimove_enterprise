// src/app/layout.tsx

// -----------------------------------------------------------------------------
// SisiMove — Root Application Layout
// -----------------------------------------------------------------------------

import type { Metadata, Viewport } from 'next';

import './globals.css';

// -----------------------------------------------------------------------------
// Site Configuration
// -----------------------------------------------------------------------------

const siteName = 'sisiMove';

const siteDescription =
  "Kenya's long-distance travel social network. Find people travelling your way, share journeys, and travel together.";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),

  title: {
    default: `${siteName} — Travel together`,
    template: `%s — ${siteName}`,
  },

  description: siteDescription,

  applicationName: siteName,

  keywords: [
    'SisiMove',
    'sisiMove',
    'Kenya travel',
    'long-distance travel',
    'carpooling Kenya',
    'shared journeys',
    'travel community',
  ],

  authors: [
    {
      name: siteName,
    },
  ],

  creator: siteName,

  referrer: 'origin-when-cross-origin',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  icons: {
    icon: '/favicon.ico',
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName,
    title: `${siteName} — Travel together`,
    description: siteDescription,
  },

  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Travel together`,
    description: siteDescription,
  },
};

// -----------------------------------------------------------------------------
// Viewport
// -----------------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
  colorScheme: 'light',
};

// -----------------------------------------------------------------------------
// Root Layout
// -----------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-KE">
      <body>{children}</body>
    </html>
  );
}