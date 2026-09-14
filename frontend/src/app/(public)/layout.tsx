
// -----------------------------------------------------------------------------
// sisiMove — Public Route Layout
// -----------------------------------------------------------------------------
//
// Shared layout for public-facing routes.
//
// Responsibilities:
// - render the public site header;
// - provide the page-level semantic <main> landmark;
// - render the public site footer.
//
// Individual public pages are responsible for their own content structure,
// width, spacing, and presentation inside the <main> element.
//
// This prevents individual pages such as the public marketplace, Journey
// detail, and Journey Demand detail from introducing nested <main> elements.
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
