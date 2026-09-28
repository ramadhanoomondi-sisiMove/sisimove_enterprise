// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity
// -----------------------------------------------------------------------------
//
// Detail presentation component for a public Journey Demand's passenger
// requirement.
//
// Responsibilities:
// - present requested seats;
// - present backend-provided matched seats;
// - distinguish requested capacity from matched capacity.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no seat calculations;
// - no remaining-seat derivation;
// - no booking semantics;
// - no matching logic.
//
// The PublicJourneyDemandCapacity projection remains authoritative.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandCapacity } from '@/features/journey-demand/models';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCapacityProps {
  /**
   * Public Journey Demand capacity projection.
   */
  readonly capacity: PublicJourneyDemandCapacity;

  /**
   * Controls presentation density.
   */
  readonly emphasis?: 'compact' | 'default';

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCapacity({
  capacity,
  emphasis = 'default',
  className,
}: JourneyDemandCapacityProps) {
  const isCompact = emphasis === 'compact';

  return (
    <section
      aria-labelledby="journey-demand-capacity-heading"
      className={cn('min-w-0', className)}
    >
      <div
        className={cn(
          'mb-3',
          'text-xs',
          'font-medium',
          'uppercase',
          'tracking-wide',
          'text-[var(--foreground-muted)]',
        )}
      >
        <h2 id="journey-demand-capacity-heading">
          Passenger requirement
        </h2>
      </div>

      <dl
        className={cn(
          'grid',
          'min-w-0',
          'grid-cols-1',
          'gap-3',
          'sm:grid-cols-2',
        )}
      >
        <div
          className={cn(
            'min-w-0',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border-subtle)]',
            'bg-[var(--surface)]',
            isCompact ? 'p-3' : 'p-4',
          )}
        >
          <dt
            className={cn(
              'text-xs',
              'text-[var(--foreground-muted)]',
            )}
          >
            Seats requested
          </dt>

          <dd
            className={cn(
              'mt-1',
              isCompact
                ? 'text-sm font-medium'
                : 'text-base font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            {capacity.requestedSeats}
          </dd>
        </div>

        <div
          className={cn(
            'min-w-0',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border-subtle)]',
            'bg-[var(--surface)]',
            isCompact ? 'p-3' : 'p-4',
          )}
        >
          <dt
            className={cn(
              'text-xs',
              'text-[var(--foreground-muted)]',
            )}
          >
            Matched seats
          </dt>

          <dd
            className={cn(
              'mt-1',
              isCompact
                ? 'text-sm font-medium'
                : 'text-base font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            {capacity.matchedSeats}
          </dd>
        </div>
      </dl>
    </section>
  );
}