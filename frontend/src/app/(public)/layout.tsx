// -----------------------------------------------------------------------------
// sisiMove — Public Route Layout
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  SiteFooter,
  SiteHeader,
} from '@/components/layout';

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