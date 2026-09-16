// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Provider
// -----------------------------------------------------------------------------
//
// Compact presentation component for the provider section of a public Journey
// marketplace listing.
//
// MARKETPLACE ROLE
// ----------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//              ↑
//           this block
//
// The provider is the public Traveller offering the Journey.
//
// PublicJourneyProvider already contains the composed public read models:
//
//   provider
//   ├── traveller
//   └── trust
//
// This component therefore presents those supplied read models directly.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - renders the public Traveller identity;
// - renders the provider's public Trust summary;
// - optionally links the Traveller to their public profile.
//
// It deliberately does not:
//
// - fetch provider data;
// - resolve Identity references;
// - reconstruct Traveller or Trust relationships;
// - determine Journey ownership;
// - determine booking eligibility;
// - perform navigation programmatically;
// - contain Journey or Booking business logic.
//
// TravellerSummary and TrustSummary remain the shared presentation boundary
// for public Traveller and Trust information across Journey and Journey Demand
// marketplace cards.
//
// PROVIDER RELATIONSHIP
// --------------------
//
// The Journey owns the provider relationship.
//
// This component does NOT imply:
//
//   Traveller → owns Journey
//
// or:
//
//   Trust → owns Journey
//
// The Journey read model supplies `PublicJourneyProvider`, which composes the
// public Traveller and Trust information needed to represent the provider.
//
// The marketplace therefore consumes:
//
//   Journey
//      ↓
//   PublicJourneyProvider
//      ├── Traveller
//      └── Trust
//
// INTERNAL LAYOUT
// --------------
//
// The provider remains vertically grouped:
//
//   [avatar]
//   @handle
//   ✓ Verified  ★ 4.9 (5) · 2 completed journeys
//
// The parent JourneyMarketplaceCard controls the provider column's:
//
// - width;
// - position;
// - outer padding;
// - separator.
//
// This component controls only the internal composition and density.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The provider column contracts with the rest of the marketplace row.
//
// This component therefore deliberately does NOT:
//
// - define a fixed width;
// - use fixed desktop dimensions;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding.
//
// The internal gap progressively contracts on smaller screens.
//
// -----------------------------------------------------------------------------

import { TravellerSummary } from '@/components/landing/shared/traveller';
import { TrustSummary } from '@/components/landing/shared/trust';
import type { PublicJourneyProvider } from '@/features/journeys/models/public-journey-provider';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardProviderProps {
  /**
   * Public Journey provider representation.
   *
   * The model already contains the public Traveller and Trust read models.
   * Internal Identity references are intentionally not exposed here.
   */
  readonly provider: PublicJourneyProvider;

  /**
   * Whether the Traveller identity should link to the public Traveller
   * profile.
   *
   * Enabled by default because the provider is a public marketplace identity.
   */
  readonly linkToProfile?: boolean;

  /**
   * Whether public Trust badges should be displayed.
   *
   * Enabled by default because trust is important marketplace context.
   */
  readonly showTrustBadges?: boolean;

  /**
   * Optional additional styling supplied by the parent marketplace card.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCardProvider({
  provider,
  linkToProfile = true,
  showTrustBadges = true,
  className,
}: JourneyCardProviderProps) {
  return (
    <div
      className={[
        // -------------------------------------------------------------------
        // Provider content boundary
        // -------------------------------------------------------------------
        //
        // The parent marketplace column owns the column width, separator,
        // and outer padding.
        //
        // This component only establishes the internal vertical composition.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'justify-center',

        // -------------------------------------------------------------------
        // Progressive internal density
        // -------------------------------------------------------------------
        //
        // The identity and trust blocks remain vertically grouped while their
        // spacing contracts with the marketplace density.
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
      {/* Traveller identity                                                   */}
      {/* ------------------------------------------------------------------- */}
      {/*
        TravellerSummary owns the public Traveller presentation:
        
          - avatar;
          - public handle;
          - optional profile navigation.
        
        The provider column deliberately requests vertical orientation.
        
        TravellerSummary remains a shared presentation component and does not
        know that the Traveller is being displayed as a Journey provider.
      */}
      <TravellerSummary
        traveller={provider.traveller}
        linkToProfile={linkToProfile}
        orientation="vertical"
        className="w-full min-w-0"
      />

      {/* ------------------------------------------------------------------- */}
      {/* Trust context                                                        */}
      {/* ------------------------------------------------------------------- */}
      {/*
        TrustSummary owns compact public trust presentation:
        
          - verification;
          - rating;
          - completed journeys;
          - optional public trust badges.
        
        Trust remains public enrichment supplied through the Journey provider
        read model. It is not treated as an independent marketplace object or
        Journey owner.
      */}
      <TrustSummary
        trust={provider.trust}
        showBadges={showTrustBadges}
        className="w-full min-w-0"
      />
    </div>
  );
}