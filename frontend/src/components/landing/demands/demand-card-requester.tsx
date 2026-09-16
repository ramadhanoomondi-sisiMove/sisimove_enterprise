// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Requester
// -----------------------------------------------------------------------------
//
// Compact WHO column for a public Journey Demand.
//
// The requester is the Traveller who CREATED the Demand.
//
// PublicJourneyDemandRequester already represents the public read-side
// composition:
//
//     requester
//     ├── traveller
//     └── trust
//
// This component renders those supplied public read models directly.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component does NOT:
//
// - fetch requester data;
// - resolve Identity IDs;
// - reconstruct Traveller or Trust relationships;
// - determine Demand ownership;
// - determine participation eligibility;
// - contain Journey Demand business logic.
//
// It receives an already-composed public requester representation and renders
// it.
//
// REQUESTER RELATIONSHIP
// ----------------------
//
// The Journey Demand owns the requester relationship.
//
// This component does NOT imply:
//
//     Traveller → owns Demand
//
// or:
//
//     Trust → owns Demand
//
// Instead:
//
//     JourneyDemand
//          ↓
//     requesterPublicId
//          ↓
//     PublicJourneyDemandRequester
//          ├── Traveller
//          └── Trust
//
// INTERNAL LAYOUT
// --------------
//
// The requester identity remains vertically grouped:
//
//     [avatar]
//     @handle
//     ✓ Verified  ★ 4.9 (5)
//     · 2 completed journeys
//
// The parent DemandMarketplaceCard controls the requester's horizontal
// marketplace allocation:
//
//     Date | Requester | Route | Summary | Actions
//
// This component therefore does NOT define:
//
// - a fixed width;
// - shrink behavior;
// - marketplace column padding.
//
// -----------------------------------------------------------------------------

import { TravellerSummary } from '@/components/landing/shared/traveller';
import { TrustSummary } from '@/components/landing/shared/trust';
import type { PublicJourneyDemandRequester } from '@/features/journey-demands/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandCardRequesterProps {
  /**
   * Public requester representation supplied by the marketplace read model.
   *
   * The representation already contains the public Traveller and Trust
   * information required by this presentation component.
   */
  readonly requester: PublicJourneyDemandRequester;

  /**
   * Whether the public Traveller identity should link to the Traveller
   * profile.
   */
  readonly linkToProfile?: boolean;

  /**
   * Whether public Trust badges should be displayed.
   */
  readonly showTrustBadges?: boolean;

  /**
   * Optional additional presentation styling supplied by the parent card.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DemandCardRequester({
  requester,
  linkToProfile = true,
  showTrustBadges = true,
  className,
}: DemandCardRequesterProps) {
  return (
    <div
      className={[
        // -------------------------------------------------------------------
        // Requester content boundary
        // -------------------------------------------------------------------
        //
        // The parent DemandMarketplaceCard owns the outer responsive section
        // padding and the horizontal flex allocation.
        //
        // Keep this component min-w-0 so the identity and Trust content can
        // contract with the marketplace column rather than forcing overflow.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'justify-center',

        // -------------------------------------------------------------------
        // Internal proportional density
        // -------------------------------------------------------------------
        //
        // This spacing is deliberately smaller than the parent section
        // padding. It controls only the relationship between TravellerSummary
        // and TrustSummary.
        //
        'gap-1',
        'sm:gap-1.5',
        'md:gap-2',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Traveller identity                                                  */}
      {/* ------------------------------------------------------------------- */}
      {/*
        TravellerSummary owns public Traveller presentation:
        
          - avatar;
          - public handle;
          - optional profile navigation.
        
        Vertical orientation keeps the requester identity visually grouped
        within the WHO column.
      */}
      <TravellerSummary
        traveller={requester.traveller}
        linkToProfile={linkToProfile}
        orientation="vertical"
      />

      {/* ------------------------------------------------------------------- */}
      {/* Trust context                                                        */}
      {/* ------------------------------------------------------------------- */}
      {/*
        TrustSummary owns compact public Trust presentation:
        
          - verification;
          - rating;
          - completed journeys;
          - optional public Trust badges.
        
        Trust remains enrichment of the requester Traveller. It is not treated
        as an independent Demand or marketplace object.
      */}
      <TrustSummary
        trust={requester.trust}
        showBadges={showTrustBadges}
      />
    </div>
  );
}