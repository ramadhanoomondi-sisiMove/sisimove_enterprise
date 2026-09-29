// -----------------------------------------------------------------------------
// sisiMove — Landing Page
// -----------------------------------------------------------------------------
//
// The landing page is the public composition of the two primary marketplace
// surfaces.
//
// The public route layout owns:
// - SiteHeader;
// - the document-level <main>;
// - SiteFooter.
//
// LandingPage therefore owns only:
// - JourneyMarketplace;
// - JourneyDemandMarketplace;
// - public Journey presentation actions;
// - public Journey Demand presentation actions.
//
// Each marketplace remains an independent feature boundary and owns its own:
// - query;
// - filter state;
// - loading state;
// - error state;
// - empty state;
// - result presentation.
//
// There is deliberately no combined marketplace abstraction.
//
// Width responsibility:
//
// The landing page intentionally constrains its content locally rather than
// modifying the global `.page-container` utility.
//
// This keeps the public landing experience visually narrower while allowing
// authenticated application surfaces to retain their existing application
// width.
//
// Public Journey action flow:
//
//     View
//         ↓
//     /journeys/[publicId]
//
//     Share
//         ↓
//     public Journey URL
//
//     Book
//         ↓
//     /login
//
// Public Journey Demand action flow:
//
//     View
//         ↓
//     /demands/[publicId]
//
//     Share
//         ↓
//     public Journey Demand URL
//
//     Join
//         ↓
//     /login
//
// The public landing page does not create a JourneyBooking or join a Journey
// Demand. Those remain authenticated application capabilities.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { JourneyMarketplace } from "@/components/journey/marketplace";
import { JourneyDemandMarketplace } from "@/components/journey-demand/marketplace";
import { AUTHENTICATION_ROUTES } from "@/foundation/routing/authentication-routes";
import { PUBLIC_ROUTES } from "@/foundation/routing/public-routes";

// =============================================================================
// Landing Page
// =============================================================================

export function LandingPage() {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // View Journey
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
  // Booking is an authenticated capability.
  //
  // The current authentication routing contract does not yet carry a
  // return destination, so the Journey public ID is intentionally not
  // required here.
  //
  // ---------------------------------------------------------------------------

  const handleBookJourney = useCallback((): void => {
    router.push(AUTHENTICATION_ROUTES.LOGIN);
  }, [router]);

  // ---------------------------------------------------------------------------
  // View Journey Demand
  // ---------------------------------------------------------------------------

  const handleViewJourneyDemand = useCallback(
    (demandPublicId: string): void => {
      router.push(
        PUBLIC_ROUTES.demand(demandPublicId),
      );
    },
    [router],
  );

  // ---------------------------------------------------------------------------
  // Share Journey Demand
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Join Journey Demand
  // ---------------------------------------------------------------------------
  //
  // Joining a public demand is an authenticated capability.
  //
  // The current authentication routing contract does not yet carry a
  // return destination, so the demand public ID is intentionally not
  // required here.
  //
  // ---------------------------------------------------------------------------

  const handleJoinJourneyDemand = useCallback((): void => {
    router.push(AUTHENTICATION_ROUTES.LOGIN);
  }, [router]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
      <JourneyMarketplace
        onView={handleViewJourney}
        onShare={handleShareJourney}
        onBook={handleBookJourney}
      />

      <JourneyDemandMarketplace
        onView={handleViewJourneyDemand}
        onShare={handleShareJourneyDemand}
        onJoin={handleJoinJourneyDemand}
      />
    </div>
  );
}