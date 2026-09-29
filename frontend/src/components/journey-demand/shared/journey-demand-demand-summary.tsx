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
// Marketplace presentation:
//
// - Demand is a primary marketplace signal.
// - Requested seats are visually dominant.
// - Participant count is supporting information.
// - The component remains compact enough to sit immediately after the route.
// - No nested card/surface is introduced.
// - No business state is derived.
//
// This component is presentation-only. It does not derive business state such
// as remaining seats, fullness, matching progress, or demand strength.
//
// The public demand projection is optional at runtime because marketplace
// data can temporarily contain an incomplete projection. When unavailable,
// the component continues presenting the requested capacity fact.
//
// The component does not invent a participant count or derive one from other
// Journey Demand fields.
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

  /**
   * Public participant projection.
   *
   * The public marketplace should normally provide this projection.
   * It is optional at the presentation boundary so an incomplete marketplace
   * response cannot crash the entire Journey Demand marketplace.
   */
  readonly demand?: PublicJourneyDemandDemand;

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

  const participantCount = demand?.participantCount;

  const participantLabel =
    participantCount === 1
      ? 'participant'
      : 'participants';

  return (
    <section
      className={cn(
        'min-w-0',
        isCompact ? 'px-3 py-2' : 'px-4 py-3',
        className,
      )}
      aria-label="Demand"
    >
      <div
        className={cn(
          'flex min-w-0 items-center',
          isCompact ? 'gap-3' : 'gap-4',
        )}
      >
        {/* -----------------------------------------------------------------
            Primary demand signal
            ----------------------------------------------------------------- */}

        <div className="min-w-0">
          <p
            className={cn(
              'font-medium uppercase tracking-wide',
              'text-[var(--foreground-muted)]',
              isCompact ? 'text-[10px]' : 'text-xs',
            )}
          >
            Demand
          </p>

          <p
            className={cn(
              'mt-0.5 truncate font-bold leading-tight',
              'text-[var(--foreground)]',
              isCompact ? 'text-base' : 'text-lg',
            )}
          >
            {capacity.requestedSeats}
            <span
              className={cn(
                'ml-1 font-medium',
                'text-[var(--foreground-secondary)]',
                isCompact ? 'text-xs' : 'text-sm',
              )}
            >
              {seatLabel}
            </span>
          </p>
        </div>

        {/* -----------------------------------------------------------------
            Participant projection
            ----------------------------------------------------------------- */}

        {demand && (
          <div
            className={cn(
              'min-w-0 border-l border-[var(--border-subtle)]',
              isCompact ? 'pl-3' : 'pl-4',
            )}
          >
            <p
              className={cn(
                'font-medium text-[var(--foreground-muted)]',
                isCompact ? 'text-[10px]' : 'text-xs',
              )}
            >
              Joined
            </p>

            <p
              className={cn(
                'mt-0.5 truncate font-semibold leading-tight',
                'text-[var(--foreground)]',
                isCompact ? 'text-xs' : 'text-sm',
              )}
            >
              {participantCount}{' '}
              <span className="font-normal text-[var(--foreground-muted)]">
                {participantLabel}
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}