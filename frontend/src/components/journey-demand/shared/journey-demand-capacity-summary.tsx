// src/features/journey-demand/components/shared/journey-demand-capacity-summary.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity Summary
// -----------------------------------------------------------------------------
//
// Compact reusable presentation component for Journey Demand capacity.
//
// Responsibilities:
// - Present the number of seats requested.
// - Present the number of seats already matched.
//
// This component does NOT:
// - perform queries;
// - perform mutations;
// - calculate remaining seats;
// - determine whether capacity is full;
// - determine whether a demand is partially or fully matched;
// - infer lifecycle state;
// - recreate backend capacity rules.
//
// The backend-provided PublicJourneyDemandCapacity projection is the source
// of truth. The frontend renders that projection without deriving additional
// business state.
//
// Participation evidence such as participantCount and joinedSeats belongs to
// PublicJourneyDemandDemand and should be presented by a separate component.
// -----------------------------------------------------------------------------


import type { PublicJourneyDemandCapacity } from '@/features/journey-demand/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyDemandCapacitySummaryProps {
  /**
   * Public Journey Demand capacity supplied by the backend.
   */
  readonly capacity: PublicJourneyDemandCapacity;

  /**
   * Optional additional classes for the summary.
   */
  readonly className?: string;

  /**
   * Controls the visual density of the summary.
   *
   * Compact is appropriate for marketplace cards.
   * Default is appropriate for detail and management surfaces.
   */
  readonly emphasis?: 'compact' | 'default';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCapacitySummary({
  capacity,
  className,
  emphasis = 'default',
}: JourneyDemandCapacitySummaryProps) {
  const { requestedSeats, matchedSeats } = capacity;

  return (
    <div
      className={[
        'min-w-0',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'flex',
          'min-w-0',
          'flex-wrap',
          'items-baseline',
          'gap-x-2',
          'gap-y-1',
        ].join(' ')}
      >
        <span
          className={[
            emphasis === 'compact'
              ? 'text-sm font-medium'
              : 'text-base font-semibold',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {requestedSeats}{' '}
          {requestedSeats === 1 ? 'seat' : 'seats'}
        </span>

        <span
          className="text-xs text-[var(--foreground-secondary)]"
        >
          {matchedSeats} matched
        </span>
      </div>

      <div
        className={[
          'mt-0.5',
          emphasis === 'compact'
            ? 'text-[11px]'
            : 'text-xs',
          'text-[var(--foreground-muted)]',
        ].join(' ')}
      >
        Requested capacity
      </div>
    </div>
  );
}

