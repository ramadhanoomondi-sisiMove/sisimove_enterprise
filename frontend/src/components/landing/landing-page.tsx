// -----------------------------------------------------------------------------
// sisiMove — Landing Page
// -----------------------------------------------------------------------------
//
// The landing page is the public composition of the Journey marketplace.
//
// The public route layout owns:
// - SiteHeader;
// - the document-level <main>;
// - SiteFooter.
//
// LandingPage therefore owns only:
// - JourneyMarketplace;
// - public Journey presentation actions.
//
// JourneyMarketplace remains an independent feature boundary and owns its own:
// - query;
// - filter state;
// - loading state;
// - error state;
// - empty state;
// - result presentation.
//
// There is deliberately no combined marketplace abstraction.
//
// There is also deliberately no Journey Demand marketplace.
//
// sisiMove is currently focused on the supply lifecycle:
//
//     Journey Provider
//           ↓
//     Publish Journey
//           ↓
//     Public Marketplace
//           ↓
//     Traveller discovers
//           ↓
//     Traveller books
//           ↓
//     Travel
//           ↓
//     Complete
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
// The public landing page does not create a JourneyBooking. Booking remains
// an authenticated application capability.
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
// LandingPage is a composition component.
//
// It does NOT:
// - fetch Journeys;
// - manage marketplace filters;
// - manage marketplace loading/error/empty state;
// - create bookings;
// - perform Journey mutations;
// - recreate Journey domain logic;
// - contain Journey Demand logic.
//
// Those responsibilities belong to the appropriate feature/component
// boundaries.
//
// -----------------------------------------------------------------------------

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { JourneyMarketplace } from "@/components/journey/marketplace";
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
  //
  // The public marketplace owns the Journey presentation.
  //
  // LandingPage only owns the public navigation destination.
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
  // Sharing remains a presentation-level public capability.
  //
  // The landing page constructs the canonical public Journey URL and delegates
  // the actual sharing mechanism to the browser:
  //
  // 1. native Web Share API when available;
  // 2. clipboard fallback otherwise.
  //
  // No backend mutation is involved.
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
  // Booking is an authenticated capability.
  //
  // The current authentication routing contract does not yet carry a return
  // destination, so the Journey public ID is intentionally not required here.
  //
  // The authenticated booking workflow can resolve the Journey again after
  // login rather than making the public landing page responsible for booking
  // state.
  //
  // ---------------------------------------------------------------------------

  const handleBookJourney = useCallback((): void => {
    router.push(AUTHENTICATION_ROUTES.LOGIN);
  }, [router]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  //
  // There is intentionally only one marketplace on the landing page:
  //
  //     JourneyMarketplace
  //
  // Journey Demand has been removed from the product flow, so there is no:
  //
  //     JourneyDemandMarketplace
  //     onViewDemand
  //     onShareDemand
  //     onJoinDemand
  //     demand routing
  //
  // This keeps the public landing page aligned with the supply-first product
  // direction.
  //
  // ---------------------------------------------------------------------------

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
      <JourneyMarketplace
        onView={handleViewJourney}
        onShare={handleShareJourney}
        onBook={handleBookJourney}
      />
    </div>
  );
}