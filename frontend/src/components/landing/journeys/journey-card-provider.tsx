// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Provider
// -----------------------------------------------------------------------------
//
// Presentation component for the provider portion of a public Journey
// marketplace card.
//
// The provider is the traveller offering the Journey.
//
// PublicJourneyProvider already contains the resolved public Traveller Profile
// and public Trust Profile:
//
//     provider
//     ├── traveller
//     └── trust
//
// This component deliberately does not:
// - fetch provider data;
// - resolve Identity references;
// - construct API URLs;
// - contain Journey marketplace logic;
// - decide whether the Journey can be booked.
//
// Those responsibilities belong outside the presentation component.
//
// The component composes the existing shared Traveller and Trust presentation
// components so provider presentation remains visually consistent across
// Journey and Journey Demand marketplace cards.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyProvider } from '@/features/journeys/models/public-journey-provider';

import { TravellerSummary } from '@/components/landing/shared/traveller';
import { TrustSummary } from '@/components/landing/shared/trust';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardProviderProps {
  /**
   * Public Journey provider representation.
   *
   * The model contains only public Traveller and Trust information. Internal
   * Identity references are intentionally absent.
   */
  provider: PublicJourneyProvider;

  /**
   * Whether the traveller summary should link to the public traveller profile.
   *
   * Enabled by default because the provider is a public marketplace identity
   * and the profile provides useful context when evaluating a Journey.
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

export function JourneyCardProvider({
  provider,
  linkToProfile = true,
  showTrustBadges = true,
  className,
}: JourneyCardProviderProps) {
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
        
        The Journey card does not duplicate that presentation logic.
      */}

      <TravellerSummary
        traveller={provider.traveller}
        linkToProfile={linkToProfile}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Trust context                                                       */}
      {/* ------------------------------------------------------------------- */}
      {/*
        TrustSummary presents the public trust information associated with
        the Journey provider.

        Trust is intentionally displayed as enrichment of the traveller,
        rather than as a separate marketplace object.
      */}

      <TrustSummary
        trust={provider.trust}
        showBadges={showTrustBadges}
      />
    </div>
  );
}