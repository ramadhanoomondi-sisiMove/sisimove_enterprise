"use client";

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
// The authenticated Home page exposes the same core Journey marketplace as
// the public SisiMove experience.
//
// Authentication does not create another marketplace. It adds participation
// capabilities around the same Journey marketplace projections.
//
// Product direction:
//
//     JOURNEY SUPPLY
//
//     Publish a Journey
//           ↓
//     Discover published journeys
//           ↓
//     Review Journey
//           ↓
//     Book
//           ↓
//     Travel
//           ↓
//     Complete
//
// Journey Demand is intentionally not part of this page.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
//     /home
//       │
//       ├── AuthenticatedMarketplaceActions
//       │     └── Publish a journey
//       │
//       └── JourneyMarketplace
//             ├── JourneyMarketplaceFilters
//             ├── JourneyList
//             ├── JourneyEmptyState
//             └── JourneyErrorState
//
// JourneyMarketplace remains an independent feature boundary.
//
// It owns:
// - Journey querying;
// - filter state;
// - loading state;
// - error state;
// - empty state;
// - Journey result presentation.
//
// This page owns only the navigation/presentation callbacks supplied to the
// marketplace component.
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
// Marketplace result actions:
//
//     View Journey
//     Share Journey
//     Book Journey
//
// The Journey marketplace remains responsible for presenting those actions,
// while this page owns their navigation destinations.
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
// - own marketplace filter state;
// - recreate marketplace query state;
// - parse URLSearchParams;
// - construct API requests;
// - perform Journey mutations;
// - perform booking mutations;
// - resolve Journey lifecycle state;
// - implement authentication;
// - implement authorization.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// This is an authenticated route.
//
// Therefore a Book action must not redirect to `/login` simply because the
// user is already authenticated.
//
// The Journey public detail remains a valid navigation boundary. The actual
// booking workflow should remain owned by the Journey detail / booking feature,
// rather than being implemented inside HomePage.
//
// -----------------------------------------------------------------------------

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { AuthenticatedMarketplaceActions } from "@/components/authenticated";
import { JourneyMarketplace } from "@/components/journey/marketplace";

import { AUTHENTICATED_ROUTES } from "@/foundation/routing";
import { PUBLIC_ROUTES } from "@/foundation/routing/public-routes";

// =============================================================================
// Page
// =============================================================================

export default function HomePage() {
  const router = useRouter();

  // ===========================================================================
  // Journey Actions
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // View Journey
  // ---------------------------------------------------------------------------
  //
  // The public Journey detail is also the canonical Journey presentation
  // boundary. Authentication does not require a separate authenticated
  // Journey projection.
  //
  // ---------------------------------------------------------------------------

  const handleViewJourney = useCallback(
    (journeyPublicId: string): void => {
      router.push(
        PUBLIC_ROUTES.journey(journeyPublicId),
      );
    },
    [router],
  );

  // ---------------------------------------------------------------------------
  // Share Journey
  // ---------------------------------------------------------------------------
  //
  // Sharing uses the canonical public Journey URL.
  //
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Book Journey
  // ---------------------------------------------------------------------------
  //
  // The member is already authenticated.
  //
  // Do not send the member back through `/login`.
  //
  // Booking remains a Journey/Booking feature responsibility. The Home page
  // therefore navigates to the canonical Journey detail rather than creating
  // or mutating a booking itself.
  //
  // ---------------------------------------------------------------------------

  const handleBookJourney = useCallback(
    (journeyPublicId: string): void => {
      router.push(
        PUBLIC_ROUTES.journey(journeyPublicId),
      );
    },
    [router],
  );

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <div className="w-full min-w-0">
      {/* ------------------------------------------------------------------- */}
      {/* Authenticated Journey publishing entry point                       */}
      {/* ------------------------------------------------------------------- */}

      <AuthenticatedMarketplaceActions
        publishJourneyHref={AUTHENTICATED_ROUTES.MY_JOURNEY_NEW}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Journey marketplace                                                */}
      {/* ------------------------------------------------------------------- */}

      <main className="page-container py-6 sm:py-8">
        <JourneyMarketplace
          emphasis="default"
          onView={handleViewJourney}
          onShare={handleShareJourney}
          onBook={handleBookJourney}
        />
      </main>
    </div>
  );
}

