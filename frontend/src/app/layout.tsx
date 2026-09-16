// -----------------------------------------------------------------------------
// sisiMove — Root Application Layout
// -----------------------------------------------------------------------------
//
// Root document layout for the Next.js App Router.
//
// Architectural responsibilities:
// - establish the HTML document boundary required by Next.js;
// - load global application styles;
// - provide application-wide metadata;
// - establish application-wide infrastructure providers;
// - render the active route tree.
//
// This layout intentionally does NOT:
// - render the public site header or footer;
// - own public marketplace composition;
// - fetch application data;
// - contain route-specific business logic;
// - contain authentication or feature state.
//
// Infrastructure providers belong here because they must be available to
// every route tree.
//
// Public presentation is provided by:
//
//   app/(public)/layout.tsx
//
// This separation keeps root document infrastructure independent from the
// public marketplace and from future authenticated application shells.
//
// -----------------------------------------------------------------------------


import type { Metadata } from 'next';

import './globals.css';

import { QueryProvider } from '@/query-provider';


// =============================================================================
// Application Metadata
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: 'sisiMove',
    template: '%s | sisiMove',
  },

  description:
    'Long-distance journeys shared by people travelling the same way.',
};


// =============================================================================
// Root Layout
// =============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}