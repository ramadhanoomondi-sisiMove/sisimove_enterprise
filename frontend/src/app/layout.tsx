// -----------------------------------------------------------------------------
// sisiMove — Public Route Layout
// -----------------------------------------------------------------------------
//
// Shared layout for publicly accessible sisiMove pages.
//
// Public routes include:
//
// - Journey detail
// - Journey Demand detail
// - Traveller profiles
// - How it works
//
// The marketplace landing page is mounted from the root route (`/`). This
// route-group layout is specifically responsible for the pages beneath
// `/(public)`.
//
// Responsibilities:
//
// - provide the shared public site shell;
// - render the public header and footer;
// - provide the consistent public page structure.
//
// This layout intentionally does NOT:
//
// - fetch Journey or Journey Demand data;
// - own marketplace state;
// - render marketplace cards;
// - resolve Traveller, Trust, or Asset data;
// - contain route-specific business logic.
//
// Route-specific pages remain responsible for composing their own feature
// presentation beneath this shared public shell.
//
// The shared visual primitives come from `globals.css`, including:
//
// - `.page-shell`
// - `.page-container`
//
// The layout does not add page-specific spacing so individual public features
// can control their own presentation and density.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { SiteFooter, SiteHeader } from '@/components/layout';

export interface PublicLayoutProps {
  readonly children: ReactNode;
}

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      <SiteHeader />

      <main className="min-w-0 flex-1">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}

