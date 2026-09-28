// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand List
// -----------------------------------------------------------------------------
//
// Marketplace list for public Journey Demand projections.
//
// Responsibilities:
// - render an ordered collection of PublicJourneyDemand projections;
// - compose JourneyDemandCard for each item;
// - preserve the order supplied by the parent;
// - provide a compact, mobile-first marketplace layout.
//
// Non-responsibilities:
// - no data fetching;
// - no filtering;
// - no sorting;
// - no pagination;
// - no loading/error/empty-state ownership;
// - no navigation;
// - no lifecycle logic;
// - no public projection transformation;
// - no business-state derivation.
//
// The parent/query layer owns collection state. This component only presents
// the public Journey Demand projections it receives.
//
// Component hierarchy:
//
//   JourneyDemandMarketplace
//            ↓
//   JourneyDemandList
//            ↓
//   JourneyDemandCard
//
// The dependency direction is intentionally one-way. JourneyDemandCard must
// never import this component.
//
// Public model boundary:
//
//   PublicJourneyDemand
//     ├── requester
//     ├── route
//     ├── schedule
//     ├── capacity
//     ├── pricing
//     └── demand
//
// The list does not cast or reshape the public projection into an internal
// Journey Demand model.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from '@/features/journey-demand/models';

import { JourneyDemandCard } from './journey-demand-card';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandListProps {
  /**
   * Public Journey Demand projections supplied by the marketplace parent.
   *
   * The supplied order is preserved exactly.
   */
  readonly demands: readonly PublicJourneyDemand[];

  /**
   * Optional additional classes for the collection container.
   */
  readonly className?: string;

  /**
   * Controls card information density.
   */
  readonly emphasis?: 'compact' | 'default';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandList({
  demands,
  className,
  emphasis = 'default',
}: JourneyDemandListProps) {
  return (
    <div
      className={[
        'w-full',
        'space-y-3',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {demands.map((demand) => (
        <JourneyDemandCard
          key={demand.publicId}
          demand={demand}
          emphasis={emphasis}
        />
      ))}
    </div>
  );
}

