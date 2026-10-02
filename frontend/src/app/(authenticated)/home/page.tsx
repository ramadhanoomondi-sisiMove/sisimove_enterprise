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
// The authenticated Home page exposes the same core marketplace as the public
// SisiMove experience.
//
// Authentication does not create another marketplace. It adds participation
// capabilities around the same public marketplace projections.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
//     /home
//       │
//       ├── AuthenticatedMarketplaceActions
//       │     ├── Publish a journey
//       │     └── Express travel demand
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
// -----------------------------------------------------------------------------
//
// AUTHENTICATED PARTICIPATION
// -----------------------------------------------------------------------------
//
// Authentication adds:
//
//     Publish a journey
//          ↓
//     /my-journeys/new
//
//     Express travel demand
//          ↓
//     /my-demands/new
//
// Marketplace result actions remain owned by this page because they require
// navigation/presentation callbacks:
//
//     View Journey
//     Share Journey
//     Book Journey
//
//     View Journey Demand
//     Share Journey Demand
//     Join Journey Demand
//
// The marketplace components themselves remain responsible for presenting
// those actions, but the page owns their destinations.
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
// - own marketplace filter state;
// - recreate marketplace query state;
// - parse URLSearchParams;
// - construct API requests;
// - perform Journey mutations;
// - perform Journey Demand mutations.
//
// -----------------------------------------------------------------------------
//

// -----------------------------------------------------------------------------

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { AuthenticatedMarketplaceActions } from "@/components/authenticated";

import { JourneyMarketplace } from "@/components/journey/marketplace";
import { JourneyDemandMarketplace } from "@/components/journey-demand/marketplace";

import { AUTHENTICATED_ROUTES } from "@/foundation/routing";
import { AUTHENTICATION_ROUTES } from "@/foundation/routing/authentication-routes";
import { PUBLIC_ROUTES } from "@/foundation/routing/public-routes";

// =============================================================================
// Page
// =============================================================================

export default function HomePage() {
  const router = useRouter();

  // ===========================================================================
  // Journey Actions
  // ===========================================================================

  const handleViewJourney = useCallback(
    (journeyPublicId: string): void => {
      router.push(
        PUBLIC_ROUTES.journey(journeyPublicId),
      );
    },
    [router],
  );

  const handleShareJourney = useCallback(
    async (journeyPublicId: string): Promise<void> => {
      const journeyUrl =
        `${window.location.origin}${PUBLIC_ROUTES.journey(journeyPublicId)}`;

      if (navigator.share) {
        await navigator.share({
          title: "SisiMove Journey",
          url: journeyUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(journeyUrl);
    },
    [],
  );

  const handleBookJourney = useCallback(
    (): void => {
      router.push(AUTHENTICATION_ROUTES.LOGIN);
    },
    [router],
  );

  // ===========================================================================
  // Journey Demand Actions
  // ===========================================================================

  const handleViewJourneyDemand = useCallback(
    (demandPublicId: string): void => {
      router.push(
        PUBLIC_ROUTES.demand(demandPublicId),
      );
    },
    [router],
  );

  const handleShareJourneyDemand = useCallback(
    async (demandPublicId: string): Promise<void> => {
      const demandUrl =
        `${window.location.origin}${PUBLIC_ROUTES.demand(demandPublicId)}`;

      if (navigator.share) {
        await navigator.share({
          title: "SisiMove Journey Demand",
          url: demandUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(demandUrl);
    },
    [],
  );

  const handleJoinJourneyDemand = useCallback(
    (): void => {
      router.push(AUTHENTICATION_ROUTES.LOGIN);
    },
    [router],
  );

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <div className="w-full min-w-0">
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

          <JourneyMarketplace
            emphasis="default"
            onView={handleViewJourney}
            onShare={handleShareJourney}
            onBook={handleBookJourney}
          />

          {/* ----------------------------------------------------------------- */}
          {/* Journey Demand marketplace                                        */}
          {/* ----------------------------------------------------------------- */}

          <JourneyDemandMarketplace
            emphasis="default"
            onView={handleViewJourneyDemand}
            onShare={handleShareJourneyDemand}
            onJoin={handleJoinJourneyDemand}
          />
        </div>
      </main>
    </div>
  );
}