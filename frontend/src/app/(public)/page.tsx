// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Route
// -----------------------------------------------------------------------------
//
// Public entry point for the sisiMove marketplace.
//
// Route:
//
//   /
//
// This file belongs to the `(public)` route group:
//
//   src/app/(public)/page.tsx
//
// The `(public)` segment is a Next.js route group and does not appear in the
// URL. Therefore this page still resolves to:
//
//   /
//
// The route intentionally contains no marketplace data-fetching, filtering,
// sorting, or presentation logic. Those responsibilities belong to the
// Public Marketplace application boundary and its presentation components.
//
// Flow:
//
//   /
//    │
//    ▼
//   PublicMarketplaceContent
//    │
//    ├── owns marketplace query state
//    ├── composes public Journey + Journey Demand data
//    ├── resolves marketplace actions/routes
//    │
//    ▼
//   LandingPage
//    │
//    ├── Hero
//    ├── Marketplace
//    ├── Create Demand CTA
//    ├── Publish Journey CTA
//    └── How It Works
//
// The surrounding `(public)/layout.tsx` provides the shared public shell:
//
//   SiteHeader
//   <main>
//     └── PublicMarketplaceContent
//   </main>
//   SiteFooter
//
// Keeping this route thin allows the App Router to remain a routing boundary
// while the marketplace feature owns its application behavior.
// -----------------------------------------------------------------------------

import { PublicMarketplaceContent } from '@/components/landing/marketplace/public-marketplace-content';

export default function Page() {
  return <PublicMarketplaceContent />;
}