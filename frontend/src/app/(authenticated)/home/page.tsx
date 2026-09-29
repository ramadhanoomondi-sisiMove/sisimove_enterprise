// -----------------------------------------------------------------------------
// sisiMove — Authenticated Home
// -----------------------------------------------------------------------------
//
// Authenticated marketplace entry point.
//
// Route:
//
//     /home
//
// The authenticated Home page exposes the same core marketplace concept as
// the public landing surface.
//
// SisiMove's marketplace is a core product surface:
//
//     Journeys  → available travel supply
//     Demands   → expressed travel need
//
// Authentication does not create another marketplace.
//
// Instead, authentication adds participation capabilities around the same
// marketplace:
//
//     Publish a journey
//     Create travel demand
//     View authenticated journey capabilities
//     Book / continue through the corresponding Journey flow
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
//     /home
//       │
//       ├── Page heading
//       │
//       ├── AuthenticatedMarketplaceActions
//       │     ├── Publish a journey
//       │     └── Create travel demand
//       │
//       ├── JourneyMarketplace
//       │     ├── JourneyMarketplaceFilters
//       │     ├── JourneyList
//       │     ├── JourneyEmptyState
//       │     └── JourneyErrorState
//       │
//       └── JourneyDemandMarketplace
//             ├── JourneyDemandMarketplaceFilters
//             ├── JourneyDemandList
//             ├── JourneyDemandEmptyState
//             └── JourneyDemandErrorState
//
// Each marketplace remains an independent feature boundary.
//
// JourneyMarketplace owns:
// - Journey marketplace filter state;
// - public Journey query execution;
// - Journey loading/error/empty states;
// - Journey result presentation.
//
// JourneyDemandMarketplace owns:
// - Journey Demand marketplace filter state;
// - Journey Demand query execution;
// - Journey Demand loading/error/empty states;
// - Journey Demand result presentation.
//
// The Home page does not compose a second unified marketplace abstraction.
//
// -----------------------------------------------------------------------------
//
// MARKETPLACE OWNERSHIP
// -----------------------------------------------------------------------------
//
// The marketplace is composed of two first-class product surfaces:
//
//     JourneyMarketplace
//             │
//             └── available travel supply
//
//     JourneyDemandMarketplace
//             │
//             └── expressed travel need
//
// The underlying APIs remain owned by their respective features:
//
//     features/journey
//     features/journey-demand
//
// Public marketplace data remains public projection data. Authentication does
// not change the underlying Journey or Journey Demand read models.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATED PARTICIPATION
// -----------------------------------------------------------------------------
//
// AuthenticatedMarketplaceActions provides the two primary creation paths:
//
//     Available seats
//          │
//          ▼
//     Publish a journey
//
//     Journey not found
//          │
//          ▼
//     Create travel demand
//
// The action component is presentation-only.
//
// The Home page supplies the canonical authenticated destinations:
//
//     Publish a journey
//          │
//          ▼
//     /my-journeys/new
//
//     Create travel demand
//          │
//          ▼
//     /my-demands/new
//
// -----------------------------------------------------------------------------
//
// AUTHORIZATION
// -----------------------------------------------------------------------------
//
// Authentication is established by the parent:
//
//     (authenticated)/layout.tsx
//
// This page does not implement:
//
// - verification;
// - booking authorization;
// - Journey publishing authorization;
// - Journey Demand creation authorization;
// - Journey Demand participation authorization.
//
// Those concerns remain owned by their respective capability boundaries.
//
// -----------------------------------------------------------------------------
//
// NON-RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This page does not:
//
// - fetch Traveller Profile data;
// - fetch Journey data directly;
// - fetch Journey Demand data directly;
// - combine Journey and Journey Demand into a new read model;
// - own marketplace filter state;
// - recreate marketplace query state;
// - parse URLSearchParams;
// - construct API requests;
// - perform Journey mutations;
// - perform Journey Demand mutations.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// Do not reintroduce:
//
//     usePublicMarketplace()
//     MarketplaceSection
//
// into the authenticated Home page.
//
// Those belonged to the previous unified marketplace composition.
//
// The canonical marketplace now reuses the actual Journey and Journey Demand
// marketplace feature components on both public and authenticated surfaces.
//
// -----------------------------------------------------------------------------
//
// HEADING HIERARCHY
// -----------------------------------------------------------------------------
//
// The page owns the document-level heading:
//
//     h1 — The Journey Market
//
// Individual marketplace components own their section headings:
//
//     h2 — Journeys
//     h2 — Travel needs
//
// AuthenticatedMarketplaceActions uses:
//
//     h2 — What are you looking to do?
//
// This keeps the action prompt and both marketplace surfaces below the page
// heading in the document hierarchy.
//
// -----------------------------------------------------------------------------

import { AuthenticatedMarketplaceActions } from "@/components/authenticated";

import { JourneyMarketplace } from "@/components/journey/marketplace";
import { JourneyDemandMarketplace } from "@/components/journey-demand/marketplace";

import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

// =============================================================================
// Page
// =============================================================================

export default function HomePage() {
  return (
    <div className="w-full min-w-0">
      {/* ------------------------------------------------------------------- */}
      {/* Page heading                                                        */}
      {/* ------------------------------------------------------------------- */}

      <header className="border-b border-[var(--border-subtle)] bg-[var(--surface)]">
        <div className="page-container py-5">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            The Journey Market
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-5 text-[var(--foreground-secondary)]">
            See where people are going and where people are looking to go.
          </p>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* Authenticated marketplace participation                             */}
      {/* ------------------------------------------------------------------- */}

      <AuthenticatedMarketplaceActions
        publishJourneyHref={AUTHENTICATED_ROUTES.MY_JOURNEY_NEW}
        createDemandHref={AUTHENTICATED_ROUTES.MY_DEMAND_NEW}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Marketplace                                                         */}
      {/* ------------------------------------------------------------------- */}

      <main className="page-container py-6 sm:py-8">
        <div className="space-y-10">
          {/* ----------------------------------------------------------------- */}
          {/* Journey marketplace                                               */}
          {/* ----------------------------------------------------------------- */}
          {/*
            Public Journey projections represent the same marketplace supply
            whether the visitor is authenticated or not.

            JourneyMarketplace owns its own query, filter, and result state.
          */}

          <JourneyMarketplace emphasis="default" />

          {/* ----------------------------------------------------------------- */}
          {/* Journey Demand marketplace                                        */}
          {/* ----------------------------------------------------------------- */}
          {/*
            Journey Demand remains an independent marketplace surface.

            It owns its own query, filter, and result state rather than being
            merged into a Home-level marketplace abstraction.
          */}

          <JourneyDemandMarketplace emphasis="default" />
        </div>
      </main>
    </div>
  );
}

