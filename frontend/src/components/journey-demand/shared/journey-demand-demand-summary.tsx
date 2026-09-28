
// src/features/journey-demands/components/shared/journey-demand-demand-summary.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Summary
// -----------------------------------------------------------------------------
//
// Presents the public facts that summarize a Journey Demand:
//
// - requested seats;
// - current participant count.
//
// This component is presentation-only. It does not derive business state such
// as remaining seats, fullness, matching progress, or demand strength.
// -----------------------------------------------------------------------------

import type {
  PublicJourneyDemandCapacity,
  } from '@/features/journey-demand/models';

import type {
  PublicJourneyDemandDemand,
} from '@/features/journey-demand/models/public-journey-demand-demand';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandDemandSummaryProps {
  readonly capacity: PublicJourneyDemandCapacity;
  readonly demand: PublicJourneyDemandDemand;
  readonly emphasis?: 'compact' | 'default';
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandDemandSummary({
  capacity,
  demand,
  emphasis = 'default',
  className,
}: JourneyDemandDemandSummaryProps) {
  const isCompact = emphasis === 'compact';

  const seatLabel =
    capacity.requestedSeats === 1 ? 'seat' : 'seats';

  const participantLabel =
    demand.participantCount === 1
      ? 'participant'
      : 'participants';

  return (
    <dl
      className={cn(
        'flex min-w-0 items-center gap-4',
        className,
      )}
    >
      <div className="min-w-0">
        <dt className="sr-only">
          Requested seats
        </dt>

        <dd
          className={cn(
            'font-semibold text-foreground',
            isCompact ? 'text-sm' : 'text-base',
          )}
        >
          {capacity.requestedSeats} {seatLabel}
        </dd>
      </div>

      <div className="min-w-0">
        <dt className="sr-only">
          Participants
        </dt>

        <dd
          className={cn(
            'text-foreground-muted',
            isCompact ? 'text-xs' : 'text-sm',
          )}
        >
          {demand.participantCount} {participantLabel}
        </dd>
      </div>
    </dl>
  );
}
