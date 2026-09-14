// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Route
// -----------------------------------------------------------------------------
//
// Root public entry point for the sisiMove marketplace.
//
// The root route intentionally contains no marketplace data-fetching,
// filtering, sorting, or presentation logic. Those responsibilities belong to
// the Public Marketplace application boundary and its presentation components.
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
// Keeping this route thin allows the App Router to remain a routing boundary
// while the marketplace feature owns its application behavior.
// -----------------------------------------------------------------------------

import { PublicMarketplaceContent } from '@/components/landing/marketplace/public-marketplace-content';

export default function Page() {
  return <PublicMarketplaceContent />;
}
