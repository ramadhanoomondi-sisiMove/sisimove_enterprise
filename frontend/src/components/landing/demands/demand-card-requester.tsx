// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Card Requester
// -----------------------------------------------------------------------------
//
// Presentation component for the requester portion of a public Journey Demand
// marketplace card.
//
// The requester is the traveller who created the Demand.
//
// PublicJourneyDemandRequester already contains the resolved public Traveller
// Profile and public Trust Profile:
//
//     requester
//     ├── traveller
//     └── trust
//
// This component deliberately does not:
// - fetch requester data;
// - resolve Identity references;
// - construct API URLs;
// - contain marketplace logic;
// - decide whether the Demand can be joined.
//
// The component composes the existing shared Traveller and Trust presentation
// components so requester presentation remains consistent across Journey and
// Journey Demand marketplace cards.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandRequester } from '@/features/journey-demands/models/public-journey-demand-requester';

import { TravellerSummary } from '@/components/landing/shared/traveller';
import { TrustSummary } from '@/components/landing/shared/trust';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandCardRequesterProps {
  /**
   * Public requester representation.
   *
   * The model contains only public Traveller and Trust information. Internal
   * Identity references are intentionally absent.
   */
  requester: PublicJourneyDemandRequester;

  /**
   * Whether the traveller summary should link to the public traveller profile.
   *
   * Enabled by default because the requester is a public marketplace identity
   * and the profile provides useful context when evaluating a Demand.
   */
  linkToProfile?: boolean;

  /**
   * Whether public trust badges should be displayed.
   *
   * Enabled by default because trust is important marketplace context.
   */
  showTrustBadges?: boolean;

  /**
   * Optional additional styling supplied by the parent marketplace card.
   */
  className?: string;
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
        'flex',
        'min-w-0',
        'flex-col',
        'gap-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Traveller identity                                                  */}
      {/* ------------------------------------------------------------------- */}
      {/*
        TravellerSummary owns the public traveller presentation:
        avatar, handle, bio, and optional profile navigation.

        The Demand card does not duplicate that presentation logic.
      */}

      <TravellerSummary
        traveller={requester.traveller}
        linkToProfile={linkToProfile}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Trust context                                                       */}
      {/* ------------------------------------------------------------------- */}
      {/*
        TrustSummary presents the public trust information associated with
        the requester.

        Trust is enrichment of the traveller rather than a separate
        marketplace object.
      */}

      <TrustSummary
        trust={requester.trust}
        showBadges={showTrustBadges}
      />
    </div>
  );
}