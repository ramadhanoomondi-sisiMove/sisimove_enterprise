// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity Summary
// -----------------------------------------------------------------------------
//
// Read-only presentation of Journey Demand capacity.
//
// Architecture:
// - Consumes the public Journey Demand capacity projection.
// - Does not fetch data.
// - Does not mutate data.
// - Does not calculate remaining seats.
// - Does not infer whether a demand is full or partially matched.
// - Displays backend-provided requested and matched seat counts directly.
//
// Public capacity:
//
//   requestedSeats
//   matchedSeats
//
// The frontend must not manufacture additional business facts such as:
//
//   remainingSeats
//   isFull
//   isPartiallyMatched
//   isFullyMatched
//
// Those semantics belong to the backend/public projection.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandCapacity } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

export interface JourneyDemandCapacitySummaryProps {
  readonly capacity: PublicJourneyDemandCapacity;
  readonly emphasis?: 'compact' | 'default';
  readonly className?: string;
}

export function JourneyDemandCapacitySummary({
  capacity,
  emphasis = 'default',
  className,
}: JourneyDemandCapacitySummaryProps) {
  const isCompact = emphasis === 'compact';

  return (
    <section
      className={cn(
        'min-w-0',
        className,
      )}
      aria-labelledby="journey-demand-capacity-summary-heading"
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <h3
          id="journey-demand-capacity-summary-heading"
          className={cn(
            'font-semibold text-foreground',
            isCompact ? 'text-sm' : 'text-base',
          )}
        >
          Seats
        </h3>
      </div>

      <dl
        className={cn(
          'mt-4 grid min-w-0 gap-3',
          isCompact
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2',
        )}
      >
        <CapacityValue
          label="Seats requested"
          value={capacity.requestedSeats}
          emphasis={emphasis}
        />

        <CapacityValue
          label="Matched seats"
          value={capacity.matchedSeats}
          emphasis={emphasis}
        />
      </dl>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Capacity value
// -----------------------------------------------------------------------------

interface CapacityValueProps {
  readonly label: string;
  readonly value: number;
  readonly emphasis: 'compact' | 'default';
}

function CapacityValue({
  label,
  value,
  emphasis,
}: CapacityValueProps) {
  const seatLabel = value === 1 ? 'seat' : 'seats';

  return (
    <div
      className={cn(
        'min-w-0 rounded-[var(--radius-md)]',
        'border border-[var(--border-subtle)]',
        'bg-[var(--background-subtle)]',
        emphasis === 'compact' ? 'p-3' : 'p-4',
      )}
    >
      <dt
        className={cn(
          'text-foreground-muted',
          emphasis === 'compact' ? 'text-xs' : 'text-sm',
        )}
      >
        {label}
      </dt>

      <dd
        className={cn(
          'mt-1 font-semibold text-foreground',
          emphasis === 'compact' ? 'text-sm' : 'text-base',
        )}
      >
        {value} {seatLabel}
      </dd>
    </div>
  );
}

