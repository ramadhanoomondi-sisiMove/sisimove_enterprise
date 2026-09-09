// src/app/(public)/layout.tsx

// -----------------------------------------------------------------------------
// SisiMove — Public Route Layout
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  SiteFooter,
  SiteHeader,
} from '@/components/layout';

// -----------------------------------------------------------------------------
// Public Layout
// -----------------------------------------------------------------------------

export default function PublicLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <SiteHeader />

      <main>{children}</main>

      <SiteFooter />
    </>
  );
}